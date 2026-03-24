import { getAdminClient } from '@/lib/supabase';

export const revalidate = 0; // 실시간 문항 및 광고 업데이트를 위해 캐시 제거

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'basic';

  try {
    const supabase = getAdminClient();

    // [최적화] 문항과 광고를 동시에 병렬 호출 (응답 대기 시간 1/2로 단축)
    const [qRes, sRes] = await Promise.all([
      supabase
        .from('nbti_questions')
        .select(`
          question_id, axis, polarity,
          nbti_question_versions!inner (id, content, is_current)
        `)
        .eq('nbti_question_versions.is_current', true)
        .eq('test_type', type !== 'dynamic' ? type : 'basic')
        .limit(30),
      supabase
        .from('nbti_internal_ads')
        .select('ad_id, title, brand_name, target_test, link_url, banner_img_url, ad_format, placement')
        .eq('is_active', true)
        .or(`target_test.eq.all,target_test.eq.${type}`)
        .limit(20)
    ]);

    const { data: qData, error: qError } = qRes;
    const { data: sponsorData, error: sponsorError } = sRes;

    if (qError) throw qError;
    if (sponsorError) console.error("SPONSOR_DB_ERROR:", sponsorError);

    if (!qData || qData.length === 0) {
      return Response.json({ questions: [] });
    }

    // 데이터 가공 로직
    let questionsList = qData.map(q => ({
      question_id: q.question_id,
      axis: q.axis,
      polarity: q.polarity,
      version_id: q.nbti_question_versions[0]?.id || 1,
      content: q.nbti_question_versions[0]?.content || '문항 로드 오류',
      isAd: false
    }));

    if (type === 'dynamic') {
      questionsList = questionsList.sort(() => Math.random() - 0.5).slice(0, 28);
    } else {
      questionsList = questionsList.slice(0, 28);
    }

    let questions = questionsList;
      
    if (sponsorError) console.error("SPONSOR_DB_ERROR:", sponsorError);

    // 고정형 광고 집계 (v16 최적화: 서버에서 미리 전송하여 로딩 지연 해소)
    // 상단/하단 광고 구좌에 데이터가 없을 경우 nbtitest.com 자체 홍보 배너를 강제 삽입(기본값)
    const fixedAds = {
      top: sponsorData?.find(ad => ad.placement === 'TEST_FIXED_TOP') || {
        ad_id: 'nbti-official-top',
        brand_name: 'NBTI 공식',
        title: 'NBTI: 유형을 넘어 트렌드로, 진짜 나를 발견하세요.',
        banner_img_url: '/nbti_promo.png',
        link_url: 'https://nbtitest.com',
        placement: 'TEST_FIXED_TOP'
      },
      bottom: sponsorData?.find(ad => ad.placement === 'TEST_FIXED_BOTTOM') || {
        ad_id: 'nbti-official-bottom',
        brand_name: 'NBTI 결과 리포트',
        title: '내 성격의 진짜 모습을 발견하세요. NBTI 리포트 보기',
        banner_img_url: '/nbti_discovery.png',
        link_url: 'https://nbtitest.com',
        placement: 'TEST_FIXED_BOTTOM'
      }
    };

    const activeSponsors = sponsorData?.filter(ad => 
      ['LOADING', 'RESULT_CARD', 'QUESTION_INSERT', 'STEALTH', 'SPONSORED_LIKERT', 'NATIVE_LIKERT'].includes(ad.placement)
    ).map(ad => ({
      question_id: `AD_${ad.ad_id}`,
      axis: 'AD',
      polarity: 1,
      version_id: 999, // 더미 버전
      content: ad.title,
      link_url: ad.link_url,
      banner_img_url: ad.banner_img_url,
      isAd: true,
      ad_format: ad.ad_format || 'BANNER'
    })) || [];

    // 광고를 포맷에 따라 분리
    const bannerAds = activeSponsors.filter(a => a.ad_format === 'BANNER');
    const nativeLikertAds = activeSponsors.filter(a => a.ad_format === 'NATIVE_LIKERT' || a.ad_format === 'SPONSORED_LIKERT');

    // 4-1. 배너형 광고 부착
    const attachedCombined = [...questions];
    if (bannerAds.length > 0 && attachedCombined.length > 0) {
      const interval = Math.floor(attachedCombined.length / bannerAds.length);
      bannerAds.forEach((sponsor, idx) => {
        const targetIdx = Math.min((idx + 1) * interval - 1, attachedCombined.length - 1);
        if (attachedCombined[targetIdx]) attachedCombined[targetIdx].attachedAd = sponsor;
      });
    }

    // 4-2. 네이티브 침투형 광고 삽입
    let finalQuestions = attachedCombined;
    if (nativeLikertAds.length > 0 && attachedCombined.length > 0) {
      const interval = Math.floor(attachedCombined.length / (nativeLikertAds.length + 1));
      let adIndex = 0;
      const resultArr = [];
      attachedCombined.forEach((q, idx) => {
        resultArr.push(q);
        if ((idx + 1) % interval === 0 && adIndex < nativeLikertAds.length) {
          resultArr.push(nativeLikertAds[adIndex]);
          adIndex++;
        }
      });
      finalQuestions = resultArr;
    }

    return Response.json({ questions: finalQuestions, fixedAds });
  } catch (err) {
    console.error('API /api/questions Error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
