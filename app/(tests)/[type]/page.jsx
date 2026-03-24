'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuestionSlider } from '@/components/QuestionSlider';
import { useTestStore } from '@/store/useTestStore';
import { supabase } from '@/lib/supabase';

export default function TestPage({ params }) {
  const { type } = params;
  const router = useRouter();
  const { initTest, answers, questions, currentIndex, resetStore } = useTestStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadTest() {
      try {
        // 1. 세션 생성 및 문항 조회를 병렬 발사 (체감 로딩시간 대폭 단축)
        const [initRes, qRes] = await Promise.all([
          fetch('/api/start-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ testVersion: type })
          }),
          fetch(`/api/questions?type=${type}`, { cache: 'no-store' })
        ]);

        const initData = await initRes.json();
        if (initData.error) throw new Error(initData.error);

        const qData = await qRes.json();
        if (qData.error) throw new Error(qData.error);

        initTest(initData.profileId, initData.sessionId, qData.questions);
        setLoading(false);
      } catch (e) {
        console.error("loadTest Error:", e);
        setError('초기화 실패: ' + (e.message || JSON.stringify(e)));
        setLoading(false);
      }
    }
    loadTest();
    return () => resetStore();
  }, [type]);

  // 모든 문항 완료 시 결과 계산 API 호출
  useEffect(() => {
    if (!loading && questions.length > 0 && currentIndex >= questions.length && !submitting) {
      setSubmitting(true);
      submitAnswers();
    }
  }, [currentIndex, loading, questions.length, submitting]); // Added questions.length and submitting to dependencies

  async function submitAnswers() {
    try {
      const { profileId, sessionId, answers, clickedAds } = useTestStore.getState(); // Destructure clickedAds here
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId,
          sessionId,
          answers,
          testType: type,
          sessionRound: 1,
          previousConfidence: 0,
          isConsistent: false,
          clickedAds, // Add clickedAds to the payload
        }),
      });
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || '백엔드 결과 산출 중 문제가 발생했습니다.');
      }
      
      router.push(`/results/${result.mbtiType}?score=${result.ntiScore}&grade=${result.ntiGrade}&confidence=${result.confidence}`);
    } catch (e) {
      console.error(e);
      setError('결과 처리 중 서버 오류가 발생했습니다. (사유: DB 스키마 불안정 가능성)');
      setSubmitting(false);
    }
  }

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? Math.min(((currentIndex + 1) / questions.length) * 100, 100) : 0;

  if (loading) return <LoadingScreen message="문항을 불러오는 중..." />;
  if (error) return <ErrorScreen message={error} />;
  if (submitting) return <LoadingScreen message="결과를 분석하는 중..." />;

  return (
    <main style={{
      minHeight: '100vh',
      background: '#fafafa',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem 1rem',
      fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
    }}>
      {/* 상단 진행 바 */}
      <div style={{ width: '100%', maxWidth: '480px', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{type.toUpperCase()} 테스트</span>
          <span style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: '600' }}>
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
        <div style={{ height: '3px', background: '#e5e7eb', borderRadius: '999px' }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: '#6366f1',
            borderRadius: '999px',
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {/* 문항 슬라이더 */}
      {currentQuestion && <QuestionSlider question={currentQuestion} />}
    </main>
  );
}

function LoadingScreen({ message }) {
  return (
    <main style={{
      minHeight: '100vh', background: '#fafafa',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Pretendard', sans-serif",
    }}>
      <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{message}</p>
    </main>
  );
}

function ErrorScreen({ message }) {
  return (
    <main style={{
      minHeight: '100vh', background: '#fafafa',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Pretendard', sans-serif", gap: '1rem',
    }}>
      <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>{message}</p>
      <button onClick={() => window.location.reload()} style={{
        padding: '0.6rem 1.5rem', background: '#6366f1', color: '#fff',
        border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem',
      }}>다시 시도</button>
    </main>
  );
}
