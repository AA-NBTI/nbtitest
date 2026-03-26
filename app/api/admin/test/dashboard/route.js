import { getAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * [파일명: app/api/admin/test/dashboard/route.js]
 * 기능: 통합 테스트 운영 통계 엔진 (버전별/문항별 심층 분석 v10)
 * 업데이트: 버전별 그룹 내부에 해당 문항들의 상세 반응 정밀 분석 데이터 통합
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const filterValid = searchParams.get('realOnly') === 'true';

    const supabase = getAdminClient();

    // 1. 결과 데이터 가져오기
    const { data: results, error: resError } = await supabase
      .from('nbti_results')
      .select('mbti_type, nti_score, session_id, created_at, test_type, total_time_ms, score_ei, score_sn, score_tf, score_jp')
      .order('created_at', { ascending: false })
      .limit(3000);

    if (resError) throw new Error(resError.message);
    const allResults = results || [];

    // 실사용자 필터링 (60초 이상)
    const realResults = allResults.filter(r => (r.total_time_ms || 0) >= 60000);
    const targetResults = filterValid ? realResults : allResults;
    const targetSessionIds = targetResults.map(r => r.session_id);
    
    // 2. 심리지표별 분포 집계
    const dichotomyDistribution = { EI: { E: 0, I: 0 }, SN: { S: 0, N: 0 }, TF: { T: 0, F: 0 }, JP: { J: 0, P: 0 }};
    targetResults.forEach(r => {
      if (!r.mbti_type || r.mbti_type.length !== 4) return;
      const t = r.mbti_type;
      dichotomyDistribution.EI[t[0]]++; dichotomyDistribution.SN[t[1]]++; dichotomyDistribution.TF[t[2]]++; dichotomyDistribution.JP[t[3]]++;
    });

    // 3. 버전별 그룹 기초 데이터 설정
    const versionGrouped = { 
      'basic': { title: '일반형', total: 0, mbtiDist: {}, questions: [] }, 
      'love': { title: '연애형', total: 0, mbtiDist: {}, questions: [] }, 
      'work': { title: '직장형', total: 0, mbtiDist: {}, questions: [] }, 
      'dynamic': { title: '통합형', total: 0, mbtiDist: {}, questions: [] }
    };

    targetResults.forEach(r => {
      const v = r.test_type || 'basic';
      if (!versionGrouped[v]) versionGrouped[v] = { title: v, total: 0, mbtiDist: {}, questions: [] };
      versionGrouped[v].total++;
      if (r.mbti_type) {
        versionGrouped[v].mbtiDist[r.mbti_type] = (versionGrouped[v].mbtiDist[r.mbti_type] || 0) + 1;
      }
    });

    // 4. 문항 정보 및 실시간 반응 데이터 집계
    const { data: questionData } = await supabase
      .from('nbti_questions')
      .select(`question_id, axis, test_type, nbti_question_versions!inner (content, is_current)`)
      .eq('nbti_question_versions.is_current', true);

    const qMap = {};
    if (questionData) {
      questionData.forEach(q => {
        qMap[q.question_id] = { content: q.nbti_question_versions[0]?.content, axis: q.axis, testType: q.test_type || 'basic' };
      });
    }

    let safeResp = [];
    if (targetSessionIds.length > 0) {
      // 최근 200개 세션의 정밀 응답 분석
      const { data: responses } = await supabase
        .from('nbti_responses')
        .select('question_id, time_ms, session_id')
        .in('session_id', targetSessionIds.slice(0, 200))
        .limit(10000);
      safeResp = responses || [];
    }

    const qStats = {};
    safeResp.forEach(r => {
      if (!r.question_id || r.question_id.startsWith('AD_')) return;
      if (!qStats[r.question_id]) qStats[r.question_id] = { sum: 0, count: 0 };
      qStats[r.question_id].sum += (r.time_ms || 0);
      qStats[r.question_id].count += 1;
    });

    // 문항들을 Axis 그룹 및 Version 그룹 양쪽으로 분배
    const groupedQuestions = { 'EI': { items: [] }, 'SN': { items: [] }, 'TF': { items: [] }, 'JP': { items: [] }, '기타': { items: [] }};
    
    Object.entries(qStats).forEach(([id, s]) => {
      const info = qMap[id] || { content: id, axis: 'ETC', testType: 'basic' };
      const item = { id, content: info.content, avgSec: (s.sum / s.count / 1000).toFixed(2), count: s.count, axis: info.axis };
      
      // 1) 지표별 그룹에 추가
      let axisGroup = groupedQuestions[info.axis] || groupedQuestions['기타'];
      axisGroup.items.push(item);
      
      // 2) 버전별 상세 분석용 데이터에 추가
      if (versionGrouped[info.testType]) {
        versionGrouped[info.testType].questions.push(item);
      }
    });

    // 시간대 및 일간 트래픽
    const hourly = Array(24).fill(0);
    targetResults.forEach(r => hourly[new Date(r.created_at).getHours()]++);

    const daily = Object.values(targetResults.reduce((acc, r) => {
      const d = r.created_at.split('T')[0];
      acc[d] = { date: d, count: (acc[d]?.count || 0) + 1 };
      return acc;
    }, {})).sort((a,b) => b.date.localeCompare(a.date)).slice(0, 14);

    return Response.json({
      summary: { realCount: realResults.length, totalCount: allResults.length },
      metrics: {
        totalTests: targetResults.length,
        avgConfidence: targetResults.length > 0 ? (targetResults.reduce((acc, curr) => acc + (curr.nti_score || 0), 0) / targetResults.length).toFixed(1) : 0,
      },
      dichotomyDistribution,
      versionGrouped,
      groupedQuestions,
      hourly,
      daily
    });
  } catch (err) {
    console.error("Dashboard API Upgrade Failed:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
