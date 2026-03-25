import { getAdminClient } from '@/lib/supabase-admin';

export async function POST(req) {
  try {
    const supabase = getAdminClient();
    const body = await req.json();
    const { answers, sessionId, userId, testType = 'basic', clickedAds = [], demoInfo } = body;

    if (!answers) return Response.json({ error: "No Data" }, { status: 400 });

    const validAnswers = answers.filter(a => !a.isAd);
    const sums = { EI: 0, SN: 0, TF: 0, JP: 0 };
    
    let totalAbsDistance = 0;
    const maxPossibleDistance = validAnswers.length * 3;
    
    validAnswers.forEach(a => {
      const distance = a.answerValue - 4;
      sums[a.axis] += distance * a.polarity;
      totalAbsDistance += Math.abs(distance);
    });

    const mbtiType = (sums.EI >= 0 ? 'E' : 'I') + (sums.SN >= 0 ? 'S' : 'N') + (sums.TF >= 0 ? 'T' : 'F') + (sums.JP >= 0 ? 'J' : 'P');
    const confidence = maxPossibleDistance > 0 ? Math.round((totalAbsDistance / maxPossibleDistance) * 100) : 0;
    const computedNtiScore = Math.max(0, Math.min(100, Math.round(confidence * 0.9 + 10)));
    
    let computedGrade = "탐색자";
    if (confidence >= 90) computedGrade = "마스터";
    else if (confidence >= 70) computedGrade = "전문가";
    else if (confidence >= 50) computedGrade = "탐색자";
    else computedGrade = "초심자";

    // DB 적재 데이터 (user_id 포함)
    const formattedAnswers = answers.map(a => ({
      session_id: sessionId,
      user_id: userId || null, // [추가] 회원인 경우 User ID 연동
      question_id: a.questionId,
      version_id: a.versionId,
      answer_value: a.answerValue,
      time_ms: a.timeMs,
      is_ad: a.isAd
    }));

    const promises = [];
    const activeAdClicks = clickedAds.map(adId => ({
      ad_id: adId.replace('AD_', ''),
      user_mbti: mbtiType,
      placement: 'BANNER_CLICK',
      test_type: testType,
      session_id: sessionId,
      user_id: userId || null
    }));

    const nativeClickRecords = answers.filter(a => a.isAd).map(a => ({
      ad_id: a.questionId.replace('AD_', ''),
      user_mbti: mbtiType,
      placement: 'NATIVE_LIKERT_ANSWER',
      test_type: testType,
      session_id: sessionId,
      user_id: userId || null
    }));

    const totalAdConversions = [...activeAdClicks, ...nativeClickRecords];
    const totalTimeMs = answers.reduce((sum, a) => sum + (a.timeMs || 0), 0);
    
    const saveToResults = async () => {
      try {
        const payload = {
          session_id: sessionId,
          mbti_type: mbtiType,
          score_ei: sums.EI,
          score_sn: sums.SN,
          score_tf: sums.TF,
          score_jp: sums.JP,
          nti_score: computedNtiScore,
          // [해결] DB 컬럼 추가 불가 시, 등급 컬럼에 유저 ID를 숨겨서 저장 (Zero-Migration 브리지)
          nti_grade: userId ? `${computedGrade}|${userId}` : computedGrade,
          gender: demoInfo?.gender,
          age_group: demoInfo?.age,
          region: demoInfo?.region,
          test_type: testType,
          total_time_ms: totalTimeMs
        };

        const { error } = await supabase.from('nbti_results').insert(payload);
        
        // 컬럼이 없는 경우 fallback (user_id 등 커스텀 컬럼 제외한 최소 삽입)
        if (error && error.message.includes('column')) {
          console.warn("Retrying insert without extended columns (user_id sync via grade)...");
          delete payload.user_id; // 만약 payload에 있었다면 제거
          await supabase.from('nbti_results').insert(payload);
        }
      } catch (e) {
        console.error("Result save failed:", e);
      }
    };

    if (answers.length > 0) {
      const saveResponses = async () => {
        const { error } = await supabase.from('nbti_responses').insert(formattedAnswers);
        if (error && error.message.includes('column')) {
           console.warn("Retrying responses insert without user_id...");
           const cleanAnswers = formattedAnswers.map(({ user_id, ...rest }) => rest);
           await supabase.from('nbti_responses').insert(cleanAnswers);
        }
      };
      promises.push(saveResponses());
    }
    
    if (totalAdConversions.length > 0) {
      promises.push(supabase.from('nbti_ad_clicks').insert(totalAdConversions));
    }

    promises.push(saveToResults());

    Promise.allSettled(promises);
    
    return Response.json({
      mbtiType,
      ntiScore: computedNtiScore, 
      ntiGrade: computedGrade,
      confidence: confidence
    });
  } catch (e) {
    console.error('Calculate Error:', e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}