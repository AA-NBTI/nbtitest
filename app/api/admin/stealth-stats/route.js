import { getAdminClient } from '@/lib/supabase';

/**
 * [파일명: app/api/admin/stealth-stats/route.js]
 * 기능: 스텔스 문항별 7점 척도 응답 및 MBTI 상관관계 통계 반환
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const supabase = getAdminClient();

  try {
    // 1. 등록된 모든 광고 목록 가져오기 (캠페인 관리와 즉시 동기화)
    const { data: ads } = await supabase
      .from('nbti_internal_ads')
      .select('ad_id, brand_name, title, ad_format')
      .order('created_at', { ascending: false })
      .limit(100);

    // 2. 답변(responses)과 결과(results)를 각각 가져오기 (수동 Join)
    const [responsesRes, resultsRes] = await Promise.all([
      supabase.from('nbti_responses').select('answer_value, question_id, session_id').eq('is_ad', true),
      supabase.from('nbti_results').select('session_id, mbti_type')
    ]);

    const responses = responsesRes.data || [];
    const results = resultsRes.data || [];

    // 세션별 MBTI 맵 생성
    const result_map = {};
    results.forEach(r => { result_map[r.session_id] = r.mbti_type; });

    // 3. 데이터 가공 (모든 광고가 리스트에 보이도록 초기화)
    const stats = {};

    ads.forEach(ad => {
      const qId = `AD_${ad.ad_id}`;
      stats[qId] = {
        ad_id: ad.ad_id,
        brand_name: ad.brand_name || '미등록 광고',
        title: ad.title || '제목 없음',
        ad_format: ad.ad_format,
        total_count: 0,
        distribution: { 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {} }
      };
    });

    // 응답 데이터를 순회하며 MBTI 매칭 및 집계
    responses.forEach(row => {
      const qId = row.question_id;
      const score = row.answer_value;
      const mbti = result_map[row.session_id] || 'UNKNOWN';

      if (stats[qId] && score >= 1 && score <= 7) {
        stats[qId].total_count++;
        if (!stats[qId].distribution[score][mbti]) {
          stats[qId].distribution[score][mbti] = 0;
        }
        stats[qId].distribution[score][mbti]++;
      }
    });

    return Response.json({ ads: stats });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
