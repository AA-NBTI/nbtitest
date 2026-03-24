import { getAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'basic';

  try {
    const supabase = getAdminClient();

    // 1. 문항 뼈대와 문항 텍스트(현재 버전)를 조인하여 가져오기
    let query = supabase
      .from('nbti_questions')
      .select(`
        question_id, axis, polarity,
        nbti_question_versions!inner (id, content, is_current)
      `)
      .eq('nbti_question_versions.is_current', true);

    if (type !== 'dynamic') {
      query = query.eq('test_type', type);
    }

    const { data: qData, error } = await query;

    if (error) {
      console.error('Supabase Query Error:', error);
      throw error;
    }

    if (!qData || qData.length === 0) {
      return Response.json({ questions: [] });
    }

    // 평탄화 완료된 array
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

    // 3. 광고 데이터 (Ad Slot) 실제 DB에서 동적 Fetch (업데이트된 관리자 대시보드 연동)
    const { data: sponsorData, error: sponsorError } = await supabase
      .from('nbti_internal_ads')
      .select('ad_id, title, brand_name, target_test, link_url, banner_img_url, ad_format')
      .eq('is_active', true)
      .or(`target_test.eq.all,target_test.eq.${type}`)
      .limit(100);
      
    if (sponsorError) console.error("SPONSOR_DB_ERROR:", sponsorError);

    const activeSponsors = sponsorData?.map(ad => ({
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

    // 광고를 포맷에 따라 분리 (대놓고 스폰서형과 은밀한 네이티브형은 둘 다 단독 문항으로 삽입)
    const bannerAds = activeSponsors.filter(a => a.ad_format === 'BANNER');
    const nativeLikertAds = activeSponsors.filter(a => a.ad_format === 'NATIVE_LIKERT' || a.ad_format === 'SPONSORED_LIKERT');

    // 4-1. 배너형 광고 부착 (BANNER) - 실제 문항들 내부에 기생(Attached) 
    const attachedCombined = [...questions];
    if (bannerAds.length > 0 && attachedCombined.length > 0) {
      const interval = Math.floor(attachedCombined.length / bannerAds.length);
      bannerAds.forEach((sponsor, idx) => {
        const targetIdx = Math.min((idx + 1) * interval - 1, attachedCombined.length - 1);
        if (attachedCombined[targetIdx]) attachedCombined[targetIdx].attachedAd = sponsor;
      });
    }

    // 4-2. 네이티브 침투형 광고 삽입 (NATIVE_LIKERT) - 질문 배열 중간중간에 새로운 문항으로 편입
    if (nativeLikertAds.length > 0 && attachedCombined.length > 0) {
      const interval = Math.floor(attachedCombined.length / (nativeLikertAds.length + 1));
      let adIndex = 0;
      const finalQuestions = [];
      
      attachedCombined.forEach((q, idx) => {
        finalQuestions.push(q);
        // 문항을 넘기다보면 주기적인 타이밍에 광고 문항이 나타나도록 밀어넣음
        if ((idx + 1) % interval === 0 && adIndex < nativeLikertAds.length) {
          finalQuestions.push(nativeLikertAds[adIndex]);
          adIndex++;
        }
      });
      return Response.json({ questions: finalQuestions });
    }

    return Response.json({ questions: attachedCombined });
  } catch (err) {
    console.error('API /api/questions Error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
