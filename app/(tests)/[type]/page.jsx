'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuestionSlider } from '@/components/QuestionSlider';
import { useTestStore } from '@/store/useTestStore';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/app/AuthProvider';

export default function TestPage({ params }) {
  const { type } = params;
  const router = useRouter();
  const { user } = useAuth(); // [추가] 로그인 상태 가져오기
  const { initTest, questions, currentIndex, resetStore } = useTestStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadTest() {
      try {
        const qRes = await fetch(`/api/questions?type=${type}`);
        const qData = await qRes.json();
        if (qData.error) throw new Error(qData.error);
        initTest(null, null, qData.questions, qData.fixedAds);
        setLoading(false);

        fetch('/api/start-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ testVersion: type })
        })
          .then(res => res.json())
          .then(initData => {
            if (!initData.error) {
              useTestStore.setState({ profileId: initData.profileId, sessionId: initData.sessionId });
            }
          })
          .catch(err => console.error("Background session init failed:", err));
      } catch (e) {
        console.error("loadTest Error:", e);
        setError('초기화 실패: ' + (e.message || JSON.stringify(e)));
        setLoading(false);
      }
    }
    loadTest();
    return () => resetStore();
  }, [type]);

  useEffect(() => {
    const { answers } = useTestStore.getState();
    // [강화] 문항 수만큼 응답이 꽉 찼을 때만 제출 (중간에 튀는 현상 방지)
    const validAnswersCount = answers.filter(a => a !== undefined).length;
    
    if (!loading && questions.length > 0 && currentIndex >= questions.length && !submitting && validAnswersCount >= questions.length) {
      setSubmitting(true);
      submitAnswers();
    }
  }, [currentIndex, loading, questions.length, submitting]);

  async function submitAnswers() {
    try {
      const { profileId, sessionId, answers, clickedAds } = useTestStore.getState();
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId,
          sessionId,
          userId: user?.id, // [추가] 로그인한 회원인 경우 ID 전달
          answers,
          testType: type,
          sessionRound: 1,
          previousConfidence: 0,
          isConsistent: false,
          clickedAds,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || '결과 산출 중 오류');
      
      // [신규] 제출 성공 시 임시 진행도 데이터 삭제 (다음 번에 처음부터 시작 가능하도록)
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`nbti_progress_${type}`);
      }

      const query = new URLSearchParams({
        score: result.ntiScore,
        grade: result.ntiGrade,
        confidence: result.confidence,
        testType: type
      }).toString();

      router.push(`/results/${result.mbtiType}?${query}`);
    } catch (e) {
      console.error(e);
      setSubmitting(false);
    }
  }

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? Math.min(((currentIndex + 1) / questions.length) * 100, 100) : 0;

  if (loading) return <LoadingScreen message="문항을 불러오는 중..." />;
  if (error) return <ErrorScreen message={error} />;
  

  if (submitting) return (
    <LoadingScreen message="결과를 분석하는 중...">
      <button 
        onClick={() => {
          localStorage.removeItem(`nbti_progress_${type}`);
          resetStore();
          window.location.reload();
        }}
        style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#9ca3af', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        응답 초기화 및 다시 시작하기
      </button>
    </LoadingScreen>
  );

  return (
    <main style={{
      minHeight: '100vh',
      background: '#fafafa',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '80px 1.5rem 4rem', // 기존 80px 복구 및 표준화
      fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: '480px', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#0f172a', fontWeight: '500', letterSpacing: '0.15em' }}>{type.toUpperCase()} 분석 진행률</span>
          <span style={{ fontSize: '0.75rem', color: '#111827', fontWeight: '600' }}>
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
        <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: '#0f172a',
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }} />
        </div>
      </div>
      {currentQuestion && <QuestionSlider question={currentQuestion} testType={type} />}
    </main>
  );
}

function LoadingScreen({ message, children }) {
  return (
    <main style={{
      minHeight: '100vh', background: '#ffffff',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Pretendard', sans-serif",
    }}>
      <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin mb-4" />
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: '700', letterSpacing: '-0.02em' }}>{message}</p>
      {children}
    </main>
  );
}

function ErrorScreen({ message }) {
  return (
    <main style={{
      minHeight: '100vh', background: '#ffffff',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Pretendard', sans-serif", gap: '1.5rem',
    }}>
      <p style={{ color: '#111827', fontSize: '1rem', fontWeight: '900' }}>{message}</p>
      <button onClick={() => window.location.reload()} style={{
        padding: '1rem 2.5rem', background: '#111827', color: '#fff',
        border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '900',
        textTransform: 'uppercase', letterSpacing: '0.1em'
      }}>다시 시도</button>
    </main>
  );
}
