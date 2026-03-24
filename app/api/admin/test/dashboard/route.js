import { getAdminClient } from '@/lib/supabase';

export async function GET() {
  const supabase = getAdminClient();

  // 1. Fetch Basic Results for top-level stats
  const { data: results, error: resError } = await supabase
    .from('nbti_results')
    .select('nti_score, session_id, created_at');

  if (resError) return Response.json({ error: resError.message }, { status: 500 });
  const safeResults = results || [];

  // Today's boundaries
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

  // Calc Today's Tests & Avg Confidence
  const todayTests = safeResults.filter(r => r.created_at >= todayStart).length;
  const avgConf = safeResults.length > 0 
    ? (safeResults.reduce((acc, curr) => acc + (curr.nti_score || 0), 0) / safeResults.length).toFixed(1)
    : 0;

  // 2. Fetch Responses for Quality and Funnel
  const { data: responses, error: respError } = await supabase
    .from('nbti_responses')
    .select('session_id, question_id, answer_value, time_ms');

  if (respError) return Response.json({ error: respError.message }, { status: 500 });
  const safeResp = responses || [];

  // Data processing structures
  const qStats = {};
  const sessions = {};

  safeResp.forEach(r => {
    // Skip Ads
    if (!r.question_id || r.question_id.startsWith('AD_')) return;

    // Quality processing
    const match = r.question_id.match(/\d+$/);
    const qNum = match ? parseInt(match[0], 10) : 999;

    if (!qStats[qNum]) qStats[qNum] = { total: 0, neutral: 0, timeSum: 0 };
    qStats[qNum].total += 1;
    if (r.answer_value === 4) qStats[qNum].neutral += 1;
    qStats[qNum].timeSum += r.time_ms || 0;

    // Session Processing for Funnel
    if (!sessions[r.session_id]) sessions[r.session_id] = { sessionId: r.session_id, maxQ: 0, fastAnswers: 0, totalAns: 0 };
    if (qNum > sessions[r.session_id].maxQ) {
      sessions[r.session_id].maxQ = qNum;
    }
    // For Penalty Rate logic
    if (r.time_ms < 1000) sessions[r.session_id].fastAnswers += 1;
    sessions[r.session_id].totalAns += 1;
  });

  // Calculate Metrics
  const sessionList = Object.values(sessions);
  const totalSessions = sessionList.length;
  
  // 실제 완료 세션: results 테이블에 데이터가 있는 세션만 추출
  const completedSet = new Set(safeResults.map(r => r.session_id));
  const completedSessions = sessionList.filter(s => completedSet.has(s.sessionId)).length;
  const completionRate = totalSessions > 0 ? ((completedSessions / totalSessions) * 100).toFixed(1) : 0;

  const penaltySessions = sessionList.filter(s => s.fastAnswers >= 5).length;
  const penaltyRate = totalSessions > 0 ? ((penaltySessions / totalSessions) * 100).toFixed(1) : 0;

  // Calculate Quality array
  const quality = Object.entries(qStats).map(([id, s]) => ({
    qId: parseInt(id, 10),
    bias: parseFloat(((s.neutral / s.total) * 100).toFixed(1)),
    avgTime: parseFloat(((s.timeSum / s.total) / 1000).toFixed(2))
  })).sort((a, b) => b.bias - a.bias); 

  // Calculate Funnel Array (동적 문항 수 대응)
  const globalMaxQ = sessionList.reduce((max, s) => Math.max(max, s.maxQ), 28) + 1; 
  const rawFunnel = Array(globalMaxQ).fill(0);
  
  sessionList.forEach(s => {
    // 세션이 완료(results 존재)되지 않은 경우에만 이탈로 간주
    if (!completedSet.has(s.sessionId)) {
      const dropPoint = s.maxQ;
      if (dropPoint < globalMaxQ) rawFunnel[dropPoint] += 1;
    }
  });

  return Response.json({
    metrics: {
      todayTests: todayTests,
      completionRate: parseFloat(completionRate),
      avgConfidence: parseFloat(avgConf),
      penaltyRate: parseFloat(penaltyRate)
    },
    quality,
    funnel: {
      labels: Array.from({ length: globalMaxQ }, (_, i) => `Q${i + 1}`),
      data: rawFunnel
    }
  });
}
