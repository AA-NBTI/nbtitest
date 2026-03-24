import { getAdminClient } from '@/lib/supabase';

/**
 * [파일명: app/api/admin/stealth-stats/route.js]
 * 기능: 스텔스 문항별 7점 척도 응답 및 MBTI 상관관계 통계 반환
 */

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = getAdminClient();

  try {
    // 1. 스폰서 광고(스텔스 문항) 목록 가져오기
    const { data: ads } = await supabase
      .from('nbti_internal_ads')
      .select('ad_id, brand_name, title');

    // 2. 전체 스텔스 응답과 결과(MBTI) 조인 데이터 가져오기 (성능 이슈 방지를 위해 최근 5000건만 분석)
    // nbti_responses 테이블의 is_ad 필터 활용
    const { data: rawStats, error } = await supabase
      .from('nbti_responses')
      .select(`
        answer_value,
        nbti_results!inner ( mbti_type ),
        question_id
      `)
      .eq('is_ad', true)
      .order('created_at', { ascending: false })
      .limit(5000);

    if (error) throw error;

    // 3. 데이터 가공 (문항별 -> 점수별 -> MBTI별 카운팅)
    const stats = {};

    ads.forEach(ad => {
      const qId = `AD_${ad.ad_id}`;
      // 문항별 초기 구조
      stats[qId] = {
        ad_id: ad.ad_id,
        brand_name: ad.brand_name,
        title: ad.title,
        total_count: 0,
        distribution: {
          1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {} // 7점 척도
        }
      };
    });

    // 로우 데이터를 순회하며 카운팅
    rawStats.forEach(row => {
      const qId = row.question_id;
      const score = row.answer_value;
      const mbti = row.nbti_results?.mbti_type;

      if (stats[qId] && score >= 1 && score <= 7) {
        stats[qId].total_count++;
        // MBTI별 가산
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
