import { getAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const supabase = getAdminClient();

  // 1. Fetch Results for top-level stats
  const { data: results, error: resError } = await supabase
    .from('nbti_results')
    .select('nti_score, session_id, created_at, test_type, total_time_ms')
    .order('created_at', { ascending: false })
    .limit(1000);

  if (resError) return Response.json({ error: resError.message }, { status: 500 });
  const safeResults = results || [];

  // 2. Fetch Responses for Question-level Timing
  const { data: responses, error: respError } = await supabase
    .from('nbti_responses')
    .select('question_id, time_ms')
    .limit(5000);

  // 3. 문항 본문 및 정보 가져오기 (매칭용)
  const { data: questionData, error: qDataError } = await supabase
    .from('nbti_questions')
    .select(`
      question_id, axis, 
      nbti_question_versions!inner (content, is_current)
    `)
    .eq('nbti_question_versions.is_current', true);

  const qMap = {};
  if (questionData) {
    questionData.forEach(q => {
      qMap[q.question_id] = {
        content: q.nbti_question_versions[0]?.content || '내용 없음',
        axis: q.axis || 'ET'
      };
    });
  }

  const safeResp = responses || [];
  const qStats = {};
  safeResp.forEach(r => {
    if (!r.question_id || r.question_id.startsWith('AD_')) return;
    if (!qStats[r.question_id]) qStats[r.question_id] = { sum: 0, count: 0 };
    qStats[r.question_id].sum += (r.time_ms || 0);
    qStats[r.question_id].count += 1;
  });

  // 문항 데이터 가공 및 그룹화 (주제별)
  const groupedQuestions = {
    'EI (외향/내향)': [],
    'SN (감각/직관)': [],
    'TF (사고/감정)': [],
    'JP (판단/인식)': [],
    '기타': []
  };

  Object.entries(qStats).forEach(([id, s]) => {
    const info = qMap[id] || { content: id, axis: 'ETC' };
    const item = {
      id,
      content: info.content,
      avgSec: (s.sum / s.count / 1000).toFixed(2),
      count: s.count
    };

    if (info.axis === 'EI') groupedQuestions['EI (외향/내향)'].push(item);
    else if (info.axis === 'SN') groupedQuestions['SN (감각/직관)'].push(item);
    else if (info.axis === 'TF') groupedQuestions['TF (사고/감정)'].push(item);
    else if (info.axis === 'JP') groupedQuestions['JP (판단/인식)'].push(item);
    else groupedQuestions['기타'].push(item);
  });

  // Today's boundaries
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

  const todayResults = safeResults.filter(r => r.created_at >= todayStart);
  const todayCount = todayResults.length;
  const avgConf = safeResults.length > 0 
    ? (safeResults.reduce((acc, curr) => acc + (curr.nti_score || 0), 0) / safeResults.length).toFixed(1)
    : 0;

  const avgTimeMs = safeResults.length > 0
    ? safeResults.reduce((acc, curr) => acc + (curr.total_time_ms || 0), 0) / safeResults.length
    : 0;
  const avgTimeSec = (avgTimeMs / 1000).toFixed(1);

  const typeCounts = { basic: 0, love: 0, work: 0, dynamic: 0 };
  safeResults.forEach(r => {
    const t = r.test_type || 'basic';
    if (typeCounts[t] !== undefined) typeCounts[t]++;
    else typeCounts.basic++;
  });

  const dailyStats = {};
  safeResults.forEach(r => {
    const dateStr = r.created_at.split('T')[0];
    if (!dailyStats[dateStr]) dailyStats[dateStr] = { date: dateStr, count: 0, avgTime: 0, timeSum: 0 };
    dailyStats[dateStr].count += 1;
    dailyStats[dateStr].timeSum += (r.total_time_ms || 0);
  });

  const dailyList = Object.values(dailyStats).map(d => ({
    ...d,
    avgTime: (d.timeSum / d.count / 1000).toFixed(1)
  })).sort((a,b) => b.date.localeCompare(a.date)).slice(0, 10);

  return Response.json({
    metrics: {
      todayTests: todayCount,
      totalTests: safeResults.length,
      avgConfidence: parseFloat(avgConf),
      avgDurationSec: parseFloat(avgTimeSec)
    },
    types: typeCounts, 
    daily: dailyList,
    groupedQuestions // [수정] 그룹화된 데이터 전송
  });
}
