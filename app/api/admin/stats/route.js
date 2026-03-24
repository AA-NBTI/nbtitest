import { getAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const supabase = getAdminClient();
  
  // 1. 가져오기: 광고 클릭 리포트 (nbti_ad_clicks) 
  const { data: clicks, error: cErr } = await supabase
    .from('nbti_ad_clicks')
    .select('user_mbti, placement, test_type, created_at, ad_id');
    
  // 2. 가져오기: 활성 캠페인 리스트 (nbti_internal_ads)
  const { data: ads, error: aErr } = await supabase
    .from('nbti_internal_ads')
    .select('ad_id, title, brand_name, target_test, cpc');

  if (cErr || aErr) {
    return Response.json({ error: cErr?.message || aErr?.message }, { status: 500 });
  }

  // 3. 통계 분석 엔진 (Data Aggregation)
  const totalClicks = clicks?.length || 0;
  
  // A. 오늘 매출 계산 (캠페인별 CPC 누적 합산)
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  let estimatedRevenue = 0;
  const todayClicks = clicks?.filter(c => {
    if (new Date(c.created_at) >= todayStart) {
      const adInfo = ads?.find(a => a.ad_id === c.ad_id);
      estimatedRevenue += (adInfo?.cpc || 250); // 개별 CPC가 없으면 250원 기본
      return true;
    }
    return false;
  }).length || 0;

  // B. MBTI별 타겟팅 성공률 (16개 전체)
  const mbtiCounts = {};
  clicks?.forEach(c => {
    if (c.user_mbti && c.user_mbti.length === 4 && c.user_mbti !== "UNDEFINED") {
      mbtiCounts[c.user_mbti] = (mbtiCounts[c.user_mbti] || 0) + 1;
    }
  });
  const topMbtiList = Object.entries(mbtiCounts)
    .sort((a, b) => b[1] - a[1]) // 제한 없이 전체 반환
    .map(([mbti, count]) => ({ mbti, count, percentage: ((count / totalClicks) * 100).toFixed(1) }));

  // C. 테스트 지면별 점유율 (Basic vs Dynamic vs Love 등)
  const testTypes = { basic: 0, dynamic: 0, etc: 0 };
  clicks?.forEach(c => {
    if (c.test_type === 'basic') testTypes.basic++;
    else if (c.test_type === 'dynamic') testTypes.dynamic++;
    else testTypes.etc++;
  });

  // D. 개별 캠페인(브랜드) 랭킹 리더보드
  const campaignStats = {};
  ads?.forEach(ad => {
    campaignStats[ad.ad_id] = { brand: ad.brand_name, title: ad.title, clicks: 0 };
  });
  
  clicks?.forEach(c => {
    if (campaignStats[c.ad_id]) {
      campaignStats[c.ad_id].clicks++;
    }
  });

  const leaderboard = Object.values(campaignStats)
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);

  // E. 노출 지면 효율 (Loading 화면 스와이프 vs Result 하단 배너)
  const placement = { LOADING: 0, RESULT_CARD: 0 };
  clicks?.forEach(c => {
    if (c.placement === 'LOADING') placement.LOADING++;
    else if (c.placement === 'RESULT_CARD') placement.RESULT_CARD++;
  });

  return Response.json({
    metrics: {
      totalEngagements: totalClicks,
      todayClicks: todayClicks,
      estimatedRevenue: estimatedRevenue.toLocaleString(),
    },
    leaderboard,
    mbtiTargeting: topMbtiList,
    testTypes,
    placement,
    error: null
  });
}