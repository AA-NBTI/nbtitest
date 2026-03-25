import { getAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const filterValid = searchParams.get('realOnly') === 'true';

    const supabase = getAdminClient();

    // 1. Fetch Results
    const { data: results, error: resError } = await supabase
      .from('nbti_results')
      .select('nti_score, session_id, created_at, test_type, total_time_ms')
      .order('created_at', { ascending: false })
      .limit(2000);

    if (resError) throw new Error(resError.message);
    const allResults = results || [];

    // 실사용자(60초 이상) vs 전체 데이터 분리
    const realResults = allResults.filter(r => (r.total_time_ms || 0) >= 60000);
    const testResults = allResults.filter(r => (r.total_time_ms || 0) < 60000);

    const targetResults = filterValid ? realResults : allResults;
    const realSessionIds = new Set(realResults.map(r => r.session_id));
    
    // 2. Fetch Responses
    const { data: responses, error: respError } = await supabase
      .from('nbti_responses')
      .select('question_id, time_ms, session_id')
      .limit(5000);

    const safeResp = (responses || []).filter(r => !filterValid || realSessionIds.has(r.session_id));

    // 3. Question Info Mapping
    const { data: questionData } = await supabase
      .from('nbti_questions')
      .select(`question_id, axis, test_type, nbti_question_versions!inner (content, is_current)`)
      .eq('nbti_question_versions.is_current', true);

    const qMap = {};
    if (questionData) {
      questionData.forEach(q => {
        qMap[q.question_id] = { content: q.nbti_question_versions[0]?.content, axis: q.axis, testType: q.test_type };
      });
    }

    const qStats = {};
    safeResp.forEach(r => {
      if (!r.question_id || r.question_id.startsWith('AD_')) return;
      if (!qStats[r.question_id]) qStats[r.question_id] = { sum: 0, count: 0 };
      qStats[r.question_id].sum += (r.time_ms || 0);
      qStats[r.question_id].count += 1;
    });

    const groupedQuestions = { 'EI (외향/내향)': { items: [], avg: 0, total: 0 }, 'SN (감각/직관)': { items: [], avg: 0, total: 0 }, 'TF (사고/감정)': { items: [], avg: 0, total: 0 }, 'JP (판단/인식)': { items: [], avg: 0, total: 0 }, '기타': { items: [], avg: 0, total: 0 }};
    const versionGrouped = { 'basic': { title: '일반형', items: [], avg: 0, total: 0 }, 'love': { title: '연애형', items: [], avg: 0, total: 0 }, 'work': { title: '직장형', items: [], avg: 0, total: 0 }, 'dynamic': { title: '통합형', items: [], avg: 0, total: 0 }};

    Object.entries(qStats).forEach(([id, s]) => {
      const info = qMap[id] || { content: id, axis: 'ETC', testType: 'basic' };
      const item = { id, content: info.content, avgSec: (s.sum / s.count / 1000).toFixed(2), count: s.count };

      let axisGroup = groupedQuestions['기타'];
      if (info.axis === 'EI') axisGroup = groupedQuestions['EI (외향/내향)'];
      else if (info.axis === 'SN') axisGroup = groupedQuestions['SN (감각/직관)'];
      else if (info.axis === 'TF') axisGroup = groupedQuestions['TF (사고/감정)'];
      else if (info.axis === 'JP') axisGroup = groupedQuestions['JP (판단/인식)'];
      axisGroup.items.push(item);
      axisGroup.total += s.count;

      const tGroup = versionGrouped[info.testType] || versionGrouped.basic;
      tGroup.items.push(item);
      tGroup.total += s.count;
    });

    [groupedQuestions, versionGrouped].forEach(gSet => {
       Object.values(gSet).forEach(group => {
         if (group.items.length > 0) {
           group.avg = (group.items.reduce((acc, curr) => acc + parseFloat(curr.avgSec), 0) / group.items.length).toFixed(2);
         }
       });
    });

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const todayCount = targetResults.filter(r => r.created_at >= todayStart).length;
    
    const typeCounts = { basic: 0, love: 0, work: 0, dynamic: 0 };
    targetResults.forEach(r => {
      const t = r.test_type || 'basic';
      if (typeCounts[t] !== undefined) typeCounts[t]++;
      else typeCounts.basic++;
    });

    const dailyStats = {};
    targetResults.forEach(r => {
      const dateStr = r.created_at.split('T')[0];
      if (!dailyStats[dateStr]) dailyStats[dateStr] = { date: dateStr, count: 0, timeSum: 0 };
      dailyStats[dateStr].count += 1;
      dailyStats[dateStr].timeSum += (r.total_time_ms || 0);
    });

    const dailyList = Object.values(dailyStats).map(d => ({
      ...d, avgTime: (d.timeSum / (d.count || 1) / 1000).toFixed(1)
    })).sort((a,b) => b.date.localeCompare(a.date)).slice(0, 10);

    return Response.json({
      summary: {
        realCount: realResults.length,
        testCount: testResults.length,
        totalCount: allResults.length
      },
      metrics: {
        todayTests: todayCount,
        totalTests: targetResults.length,
        avgConfidence: targetResults.length > 0 ? (targetResults.reduce((acc, curr) => acc + (curr.nti_score || 0), 0) / targetResults.length).toFixed(1) : 0,
        avgDurationSec: targetResults.length > 0 ? (targetResults.reduce((acc, curr) => acc + (curr.total_time_ms || 0), 0) / targetResults.length / 1000).toFixed(1) : 0
      },
      types: typeCounts, daily: dailyList, groupedQuestions, versionGrouped
    });
  } catch (err) {
    console.error("Dashboard API Error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
