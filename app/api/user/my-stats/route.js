import { getAdminClient } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * [파일명: api/user/my-stats/route.js]
 * 기능: 유저별 개인 성향 변동성 분석 및 히스토리 조회 (에러 핸들링 강화)
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) return Response.json({ error: "Missing User ID" }, { status: 400 });

    const supabase = getAdminClient();

    // 1. 유저 결과 조회 (Grade 컬럼 내 숨겨진 User ID 태그 기반 검색)
    // 💡 Zero-Migration 전략: user_id 컬럼이 없을 때도 작동하게 함
    const { data: allResults, error: resError } = await supabase
      .from('nbti_results')
      .select('nti_score, session_id, created_at, mbti_type, test_type, nti_grade')
      .order('created_at', { ascending: false });

    if (resError) throw new Error(resError.message);

    // 태그 필터링 (Grade 가 "전문가|uuid" 형식임)
    const results = allResults.filter(r => r.nti_grade && r.nti_grade.includes(userId))
      .map(r => ({ ...r, nti_grade: r.nti_grade.split('|')[0] }));

    // 2. 유저 응답 상세 조회 (일단 최신 세션 결과들 활용)
    const sessionIds = results.map(r => r.session_id);
    let responses = [];
    if (sessionIds.length > 0) {
      const { data: respData } = await supabase
        .from('nbti_responses')
        .select('question_id, answer_value, session_id, time_ms')
        .in('session_id', sessionIds)
        .eq('is_ad', false);
      responses = respData || [];
    }

    // 3. 문항 정보 매칭
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

    // 4. 가공 로직
    const consistencyMap = {};
    responses.forEach(r => {
      if (!consistencyMap[r.question_id]) {
        consistencyMap[r.question_id] = { 
          id: r.question_id,
          content: qMap[r.question_id] || r.question_id,
          scores: [],
          timeSum: 0
        };
      }
      consistencyMap[r.question_id].scores.push(r.answer_value);
      consistencyMap[r.question_id].timeSum += (r.time_ms || 0);
    });

    const questionAnalysis = Object.values(consistencyMap).map(q => {
      const avg = q.scores.reduce((a,b) => a+b, 0) / q.scores.length;
      // 분산: 값이 얼마나 요동치는지 (데이터가 1개면 0)
      const variance = q.scores.reduce((a,b) => a + Math.pow(b - avg, 2), 0) / q.scores.length;
      
      return {
        ...q,
        avg: avg.toFixed(1),
        variance: variance.toFixed(2),
        count: q.scores.length,
        avgTimeSec: (q.timeSum / (q.scores.length || 1) / 1000).toFixed(1)
      };
    })
    // 💡 1개일 때도 데이터 시트에 모든 문항이 나오도록 함
    .sort((a,b) => b.count - a.count || b.variance - a.variance); 

    return Response.json({
      history: results || [],
      consistency: questionAnalysis
    });
  } catch (err) {
    console.error("My Stats API Critical Error:", err);
    return Response.json({ error: err.message, history: [], consistency: [] }, { status: 200 }); // 크래시 방지
  }
}
