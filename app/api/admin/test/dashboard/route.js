import { getAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const filterValid = searchParams.get('realOnly') === 'true';

    const supabase = getAdminClient();

    // 1. 결과 데이터 가져오기 (최근 1000건)
    const { data: results, error: resError } = await supabase
      .from('nbti_results')
      .select('nti_score, session_id, created_at, test_type, total_time_ms')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (resError) throw new Error(resError.message);
    const allResults = results || [];

    // 실사용자(60초 이상) vs 전체 데이터 분리
    const realResults = allResults.filter(r => (r.total_time_ms || 0) >= 60000);
    const testResults = allResults.filter(r => (r.total_time_ms || 0) < 60000);

    const targetResults = filterValid ? realResults : allResults;
    const targetSessionIds = targetResults.map(r => r.session_id);
    
    // [핵심 수정] 타겟 세션의 응답 데이터만 정밀하게 필터링하여 가져오기
    let safeResp = [];
    if (targetSessionIds.length > 0) {
      // Supabase 'in' 필터를 사용하여 해당 세션들의 응답만 추출
      const { data: responses, error: respError } = await supabase
        .from('nbti_responses')
        .select('question_id, time_ms, session_id')
        .in('session_id', targetSessionIds.slice(0, 100)) // 너무 많으면 나눠야 하나 일단 100개 세션 단위
        .limit(5000);
      
      if (!respError) safeResp = responses || [];
    }

    // 3. 문항 정보 매핑
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

    // 통계 계산
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
      if (axisGroup) {
        axisGroup.items.push(item);
        axisGroup.total += s.count;
      }

      const tGroup = versionGrouped[info.testType] || versionGrouped.basic;
      tGroup.items.push(item);
      tGroup.total += s.count;
    });

    // 평균값 산출
    [groupedQuestions, versionGrouped].forEach(gSet => {
       Object.values(gSet).forEach(group => {
         if (group.items.length > 0) {
           group.avg = (group.items.reduce((acc, curr) => acc + parseFloat(curr.avgSec), 0) / group.items.length).toFixed(2);
         }
       });
    });

    // 최종 결과 반환
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    
    return Response.json({
      summary: {
        realCount: realResults.length,
        testCount: testResults.length,
        totalCount: allResults.length
      },
      metrics: {
        todayTests: targetResults.filter(r => r.created_at >= todayStart).length,
        totalTests: targetResults.length,
        avgConfidence: targetResults.length > 0 ? (targetResults.reduce((acc, curr) => acc + (curr.nti_score || 0), 0) / targetResults.length).toFixed(1) : 0,
        avgDurationSec: targetResults.length > 0 ? (targetResults.reduce((acc, curr) => acc + (curr.total_time_ms || 0), 0) / targetResults.length / 1000).toFixed(1) : 0
      },
      types: {
        basic: targetResults.filter(r => (r.test_type || 'basic') === 'basic').length,
        love: targetResults.filter(r => r.test_type === 'love').length,
        work: targetResults.filter(r => r.test_type === 'work').length,
        dynamic: targetResults.filter(r => r.test_type === 'dynamic').length
      },
      daily: Object.values(targetResults.reduce((acc, r) => {
        const d = r.created_at.split('T')[0];
        if (!acc[d]) acc[d] = { date: d, count: 0, timeSum: 0 };
        acc[d].count += 1;
        acc[d].timeSum += (r.total_time_ms || 0);
        return acc;
      }, {})).map(d => ({ ...d, avgTime: (d.timeSum / d.count / 1000).toFixed(1) })).sort((a,b) => b.date.localeCompare(a.date)).slice(0, 10),
      groupedQuestions, 
      versionGrouped
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
