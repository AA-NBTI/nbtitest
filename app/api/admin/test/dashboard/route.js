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
      question_id, axis, test_type,
      nbti_question_versions!inner (content, is_current)
    `)
    .eq('nbti_question_versions.is_current', true);

  const qMap = {};
  if (questionData) {
    questionData.forEach(q => {
      qMap[q.question_id] = {
        content: q.nbti_question_versions[0]?.content || '내용 없음',
        axis: q.axis || 'ETC',
        testType: q.test_type || 'basic'
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

  // [기능 추가] 1. 심리 지표별 그룹화
  const groupedQuestions = {
    'EI (외향/내향)': { items: [], avg: 0, total: 0 },
    'SN (감각/직관)': { items: [], avg: 0, total: 0 },
    'TF (사고/감정)': { items: [], avg: 0, total: 0 },
    'JP (판단/인식)': { items: [], avg: 0, total: 0 },
    '기타': { items: [], avg: 0, total: 0 }
  };

  // [기능 추가] 2. 테스트 버전별 그룹화 (사용자 요청)
  const versionGrouped = {
    'basic': { title: '일반형', items: [], avg: 0, total: 0 },
    'love': { title: '연애형', items: [], avg: 0, total: 0 },
    'work': { title: '직장형', items: [], avg: 0, total: 0 },
    'dynamic': { title: '통합형', items: [], avg: 0, total: 0 }
  };

  Object.entries(qStats).forEach(([id, s]) => {
    const info = qMap[id] || { content: id, axis: 'ETC', testType: 'basic' };
    const item = {
      id,
      content: info.content,
      avgSec: (s.sum / s.count / 1000).toFixed(2),
      count: s.count
    };

    // 1. 지표별 배정
    let axisGroup = groupedQuestions['기타'];
    if (info.axis === 'EI') axisGroup = groupedQuestions['EI (외향/내향)'];
    else if (info.axis === 'SN') axisGroup = groupedQuestions['SN (감각/직관)'];
    else if (info.axis === 'TF') axisGroup = groupedQuestions['TF (사고/감정)'];
    else if (info.axis === 'JP') axisGroup = groupedQuestions['JP (판단/인식)'];
    axisGroup.items.push(item);
    axisGroup.total += s.count;

    // 2. 버전별 배정
    const tGroup = versionGrouped[info.testType] || versionGrouped.basic;
    tGroup.items.push(item);
    tGroup.total += s.count;
  });

  // 평균값들 계산
  [groupedQuestions, versionGrouped].forEach(gSet => {
     Object.values(gSet).forEach(group => {
       if (group.items.length > 0) {
         const sumAvg = group.items.reduce((acc, curr) => acc + parseFloat(curr.avgSec), 0);
         group.avg = (sumAvg / group.items.length).toFixed(2);
       }
     });
  });

  // Today Boundaries & Stats
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const todayCount = safeResults.filter(r => r.created_at >= todayStart).length;
  const avgConf = safeResults.length > 0 
    ? (safeResults.reduce((acc, curr) => acc + (curr.nti_score || 0), 0) / safeResults.length).toFixed(1)
    : 0;

  const typeCounts = { basic: 0, love: 0, work: 0, dynamic: 0 };
  safeResults.forEach(r => {
    const t = r.test_type || 'basic';
    if (typeCounts[t] !== undefined) typeCounts[t]++;
    else typeCounts.basic++;
  });

  const dailyStats = {};
  safeResults.forEach(r => {
    const dateStr = r.created_at.split('T')[0];
    if (!dailyStats[dateStr]) dailyStats[dateStr] = { date: dateStr, count: 0, timeSum: 0 };
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
      avgDurationSec: (safeResults.reduce((acc, curr) => acc + (curr.total_time_ms || 0), 0) / (safeResults.length || 1) / 1000).toFixed(1)
    },
    types: typeCounts, 
    daily: dailyList,
    groupedQuestions,
    versionGrouped // [추가] 버전별 그룹화 데이터
  });
}
