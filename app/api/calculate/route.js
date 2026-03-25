import { getAdminClient } from '@/lib/supabase-admin';

/**
 * 안프로 요구사항: 서버사이드 결과 연산 엔진
 * 기능: 광고 문항(isAd)은 점수 합산에서 자동 제외, 페널티 계산, DB 적재
 */

export async function POST(req) {
  try {
    const supabase = getAdminClient();
    const body = await req.json();
    const { answers, sessionId, testType = 'basic', clickedAds = [], demoInfo } = body;

    // 1. 유효성 검사
    if (!answers) return Response.json({ error: "No Data" }, { status: 400 });

    // 2. 광고 문항 필터링 및 원점수 계산 (isAd 플래그 기준)
    const validAnswers = answers.filter(a => !a.isAd);
    const sums = { EI: 0, SN: 0, TF: 0, JP: 0 };
    
    let totalAbsDistance = 0;
    const maxPossibleDistance = validAnswers.length * 3; // 4점 기준 편차 최대 3(7 또는 1)
    
    validAnswers.forEach(a => {
      const distance = a.answerValue - 4;
      sums[a.axis] += distance * a.polarity;
      totalAbsDistance += Math.abs(distance);
    });

    // 3. MBTI 및 동적 신뢰도 산출
    const mbtiType = (sums.EI >= 0 ? 'E' : 'I') + (sums.SN >= 0 ? 'S' : 'N') + (sums.TF >= 0 ? 'T' : 'F') + (sums.JP >= 0 ? 'J' : 'P');
    
    // 신뢰도 연산 (응답 강도에 비례)
    const confidence = maxPossibleDistance > 0 ? Math.round((totalAbsDistance / maxPossibleDistance) * 100) : 0;
    const computedNtiScore = Math.max(0, Math.min(100, Math.round(confidence * 0.9 + 10))); // 스케일링 보정
    
    let computedGrade = "탐색자";
    if (confidence >= 90) computedGrade = "마스터";
    else if (confidence >= 70) computedGrade = "전문가";
    else if (confidence >= 50) computedGrade = "탐색자";
    else computedGrade = "초심자";

    // 4. DB 적재 (의미 있는 광고 데이터와 문항 데이터 실제 저장)
    const formattedAnswers = answers.map(a => ({
      session_id: sessionId,
      question_id: a.questionId,
      version_id: a.versionId,
      answer_value: a.answerValue,
      time_ms: a.timeMs,
      is_ad: a.isAd
    }));

    // 4. DB 병렬 적재 (로딩 속도 개선)
    // 3. Save Ad Click Conversions (배너 클릭 건수 + 네이티브 리커트 응답 건수 합산)
    const promises = [];

    // [A] 자발적 외부 배너 클릭 전환
    const activeAdClicks = clickedAds.map(adId => ({
      ad_id: adId.replace('AD_', ''),
      user_mbti: mbtiType,
      placement: 'BANNER_CLICK',
      test_type: testType,
      session_id: sessionId
    }));

    // [B] 네이티브 문항 평가(응답) 전환
    const nativeClickRecords = answers.filter(a => a.isAd).map(a => ({
      ad_id: a.questionId.replace('AD_', ''),
      user_mbti: mbtiType,
      placement: 'NATIVE_LIKERT_ANSWER',
      test_type: testType,
      session_id: sessionId
    }));

    const totalAdConversions = [...activeAdClicks, ...nativeClickRecords];

    const totalTimeMs = answers.reduce((sum, a) => sum + (a.timeMs || 0), 0);
    
    // [강화] DB 컬럼 존재 여부에 상관없이 삽입을 시도하되, 실패 시 기본 필드로 재시도 (마이그레이션 전 대비)
    const saveToResults = async () => {
      try {
        const { error } = await supabase.from('nbti_results').insert({
          session_id: sessionId,
          mbti_type: mbtiType,
          score_ei: sums.EI,
          score_sn: sums.SN,
          score_tf: sums.TF,
          score_jp: sums.JP,
          nti_score: computedNtiScore,
          nti_grade: computedGrade,
          gender: demoInfo?.gender,
          age_group: demoInfo?.age,
          region: demoInfo?.region,
          test_type: testType,
          total_time_ms: totalTimeMs
        });
        
        // 컬럼이 없어서 오류가 나는 경우 (42703 etc)
        if (error && error.message.includes('column')) {
          console.warn("Retrying insert without new columns...");
          await supabase.from('nbti_results').insert({
            session_id: sessionId,
            mbti_type: mbtiType,
            score_ei: sums.EI,
            score_sn: sums.SN,
            score_tf: sums.TF,
            score_jp: sums.JP,
            nti_score: computedNtiScore,
            nti_grade: computedGrade,
            gender: demoInfo?.gender,
            age_group: demoInfo?.age,
            region: demoInfo?.region
          });
        }
      } catch (e) {
        console.error("Result save failed:", e);
      }
    };

    if (answers.length > 0) {
      promises.push(supabase.from('nbti_responses').insert(formattedAnswers));
    }
    
    if (totalAdConversions.length > 0) {
      promises.push(supabase.from('nbti_ad_clicks').insert(totalAdConversions));
    }

    promises.push(saveToResults()); // [수정] 래퍼 함수로 감싸서 유연하게 대응

    // DB 적재는 백그라운드에서 실행 (유저 대기 시간 0으로 단축)
    Promise.allSettled(promises).catch(err => {
      console.error('Background DB save failed:', err);
    });
    
    // 연산된 결과값만 즉시 반환하여 결과 페이지로 점프!
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