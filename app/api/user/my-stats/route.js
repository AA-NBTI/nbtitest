import { getAdminClient } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) return Response.json({ error: "Missing User ID" }, { status: 400 });

    const supabase = getAdminClient();

    // 1. 유저의 모든 과거 결과 가져오기
    const { data: results, error: resError } = await supabase
      .from('nbti_results')
      .select('nti_score, session_id, created_at, mbti_type, test_type')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (resError) throw new Error(resError.message);

    // 2. 유저의 모든 과거 문항 응답 가져오기 (is_ad 제외)
    const { data: responses, error: respError } = await supabase
      .from('nbti_responses')
      .select('question_id, answer_value, session_id, time_ms')
      .eq('user_id', userId)
      .eq('is_ad', false);

    if (respError) throw new Error(respError.message);

    // 3. 문항 정보 매칭 (내용 표시용)
    const { data: questionData } = await supabase
      .from('nbti_questions')
      .select(`question_id, nbti_question_versions!inner (content)`)
      .eq('nbti_question_versions.is_current', true);

    const qMap = {};
    if (questionData) {
      questionData.forEach(q => {
        qMap[q.question_id] = q.nbti_question_versions[0]?.content;
      });
    }

    // 4. 문항별 일관성(상동성) 분석
    const consistencyMap = {};
    responses.forEach(r => {
      if (!consistencyMap[r.question_id]) {
        consistencyMap[r.question_id] = { 
          id: r.question_id,
          content: qMap[r.question_id] || r.question_id,
          scores: [],
          avgTime: 0,
          timeSum: 0
        };
      }
      consistencyMap[r.question_id].scores.push(r.answer_value);
      consistencyMap[r.question_id].timeSum += (r.time_ms || 0);
    });

    // 분산(Variance) 계산 및 가공
    const questionAnalysis = Object.values(consistencyMap).map(q => {
      const avg = q.scores.reduce((a,b) => a+b, 0) / q.scores.length;
      // 분산: 값이 얼마나 요동치는지 (상황에 따라 답이 바뀌는 정도)
      const variance = q.scores.reduce((a,b) => a + Math.pow(b - avg, 2), 0) / q.scores.length;
      
      return {
        ...q,
        avg: avg.toFixed(1),
        variance: variance.toFixed(2),
        count: q.scores.length,
        avgTimeSec: (q.timeSum / (q.scores.length || 1) / 1000).toFixed(1)
      };
    }).sort((a,b) => b.variance - a.variance); // 요동치는 문항 우선순위

    return Response.json({
      history: results || [],
      consistency: questionAnalysis
    });
  } catch (err) {
    console.error("My Stats API Error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
