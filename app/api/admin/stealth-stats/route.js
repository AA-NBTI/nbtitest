import { getAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * [파일명: app/api/admin/stealth-stats/route.js]
 * 기능: 스텔스 문항(광고)별 상세 이용 시간 및 시간대 분포 포함 통계 반환
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const realOnly = searchParams.get('realOnly') === 'true'; // [신규] 60초 이상 유저만 필터링 기능 추가 가능

  const supabase = getAdminClient();

  try {
    // 1. 등록된 모든 광고 목록 가져오기
    const { data: ads } = await supabase
      .from('nbti_internal_ads')
      .select('ad_id, brand_name, title, ad_format')
      .order('created_at', { ascending: false });

    // 2. 답변(responses)과 결과(results)를 각각 가져오기 (시간 데이터 포함)
    const [responsesRes, resultsRes] = await Promise.all([
      supabase.from('nbti_responses')
        .select('answer_value, question_id, session_id, time_ms') // [강화] time_ms 추가
        .eq('is_ad', true),
      supabase.from('nbti_results')
        .select('session_id, mbti_type, total_time_ms, created_at') // [강화] created_at, total_time_ms 추가
    ]);

    const allResponses = responsesRes.data || [];
    const allResults = resultsRes.data || [];

    // [필터링] 실사용자 데이터만 볼지 결정
    const targetResults = realOnly 
      ? allResults.filter(r => (r.total_time_ms || 0) >= 60000) 
      : allResults;
    
    const targetSessionIds = new Set(targetResults.map(r => r.session_id));
    const targetResponses = allResponses.filter(r => targetSessionIds.has(r.session_id));

    // 세션별 정보(MBTI, 시간대) 맵 생성
    const result_map = {};
    targetResults.forEach(r => { 
      const hour = new Date(r.created_at).getHours();
      result_map[r.session_id] = { mbti: r.mbti_type, hour }; 
    });

    // 3. 데이터 가공
    const stats = {};
    ads.forEach(ad => {
      const qId = `AD_${ad.ad_id}`;
      stats[qId] = {
        ad_id: ad.ad_id,
        brand_name: ad.brand_name || '미등록 광고',
        title: ad.title || '제목 없음',
        ad_format: ad.ad_format,
        total_count: 0,
        avg_engagement_ms: 0, // [신규] 평균 지류 시간 (체크 시간)
        time_sum: 0,
        hourly_counts: Array(24).fill(0), // [신규] 시간대별 전환 분포
        distribution: { 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {} }
      };
    });

    // 응답 데이터를 순회하며 통계 산출
    targetResponses.forEach(row => {
      const qId = row.question_id;
      const score = row.answer_value;
      const sessionInfo = result_map[row.session_id] || { mbti: 'UNKNOWN', hour: 0 };

      if (stats[qId]) {
        stats[qId].total_count++;
        stats[qId].time_sum += (row.time_ms || 0);
        stats[qId].hourly_counts[sessionInfo.hour]++;

        if (score >= 1 && score <= 7) {
          if (!stats[qId].distribution[score][sessionInfo.mbti]) {
            stats[qId].distribution[score][sessionInfo.mbti] = 0;
          }
          stats[qId].distribution[score][sessionInfo.mbti]++;
        }
      }
    });

    // 최종 집계 (평균 시간 등)
    Object.keys(stats).forEach(id => {
      if (stats[id].total_count > 0) {
        stats[id].avg_engagement_ms = Math.round(stats[id].time_sum / stats[id].total_count);
      }
    });

    return Response.json({ ads: stats });
  } catch (err) {
    console.error("Stealth Stats API Error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
