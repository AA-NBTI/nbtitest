'use client';

import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { AdSlot } from '@/components/AdSlot';

const MBTI_DESC = {
  INTJ: '전략가형 — 독립적이고 결단력 있는 사고가',
  INTP: '논리술사형 — 분석적이고 객관적인 사색가',
  ENTJ: '통솔자형 — 대담하고 강한 의지의 지도자',
  ENTP: '변론가형 — 영리하고 호기심 많은 사상가',
  INFJ: '옹호자형 — 조용하고 신비로운 이상주의자',
  INFP: '중재자형 — 시적이고 친절한 이타주의자',
  ENFJ: '선도자형 — 카리스마 있는 영감을 주는 지도자',
  ENFP: '활동가형 — 열정적이고 창의적인 자유인',
  ISTJ: '현실주의자형 — 사실에 충실한 신뢰할 수 있는 사람',
  ISFJ: '수호자형 — 헌신적이고 따뜻한 보호자',
  ESTJ: '경영자형 — 뛰어난 관리자, 관리의 달인',
  ESFJ: '집정관형 — 사교적이고 인기 많은 협력자',
  ISTP: '장인형 — 대담하고 실용적인 실험가',
  ISFP: '모험가형 — 유연하고 매력적인 예술가',
  ESTP: '사업가형 — 영리하고 에너지 넘치는 관찰자',
  ESFP: '연예인형 — 자발적이고 활기찬 엔터테이너',
};

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const rawType = params?.type || 'INTJ';
  const mbtiType = typeof rawType === 'string' ? rawType.toUpperCase() : 'INTJ';

  const ntiScore = parseInt(searchParams.get('score') || '0');
  const ntiGrade = searchParams.get('grade') || '';
  const confidence = parseInt(searchParams.get('confidence') || '0');
  const testType = searchParams.get('testType') || 'basic';

  const [stats, setStats] = useState(null);
  const desc = MBTI_DESC[mbtiType] || '나만의 고유한 성향 유형';

  // 실시간 통계 데이터 로드
  useEffect(() => {
    fetch('/api/stats/summary')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Stats load failed:", err));
  }, []);

  const goHome = () => {
    router.push('/');
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: '#fafafa',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
    }}>

      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
          당신의 유형
        </p>
        <h1 style={{ fontSize: 'clamp(2.5rem, 10vw, 4rem)', fontWeight: '800', color: '#111827', letterSpacing: '-0.03em', margin: 0 }}>
          {mbtiType}
        </h1>
        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#6b7280' }}>{desc}</p>
      </div>

      {stats && stats.total > 0 && (
        <div style={{
          width: '100%', maxWidth: '360px', background: '#fff', borderRadius: '24px',
          padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #f3f4f6',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#6366f1' }}>REAL-TIME</span>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#111827' }}>참여자 트렌드</span>
            <span style={{ padding: '2px 6px', background: '#eef2ff', borderRadius: '4px', fontSize: '10px', fontWeight: '700', color: '#6366f1' }}>N={stats.total}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ borderLeft: '3px solid #6366f1', paddingLeft: '10px' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#9ca3af', marginBottom: '4px' }}>주요 성별</p>
              <h5 style={{ fontSize: '1rem', fontWeight: '800', color: '#111827' }}>
                {Object.entries(stats.gender).sort((a,b)=>b[1]-a[1])[0]?.[0] || '분석 중'}
              </h5>
            </div>
            <div style={{ borderLeft: '3px solid #10b981', paddingLeft: '10px' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#9ca3af', marginBottom: '4px' }}>핵심 연령대</p>
              <h5 style={{ fontSize: '1rem', fontWeight: '800', color: '#111827' }}>
                {Object.entries(stats.age).sort((a,b)=>b[1]-a[1])[0]?.[0] || '분석 중'}
              </h5>
            </div>
          </div>
        </div>
      )}

      <div style={{ width: '100%', maxWidth: '360px', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>신뢰도</span>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#6366f1' }}>{confidence}%</span>
        </div>
        <div style={{ height: '4px', background: '#e5e7eb', borderRadius: '999px' }}>
          <div style={{
            height: '100%', width: `${confidence}%`,
            background: confidence >= 85 ? '#6366f1' : confidence >= 75 ? '#8b5cf6' : '#d1d5db',
            borderRadius: '999px', transition: 'width 0.6s ease',
          }} />
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div className="w-full flex justify-center mb-1">
          <AdSlot slotId="RESULT_TOP" mbtiType={mbtiType} />
        </div>

        {/* 1. NBTI 유형 분석 (블로그 연동 복구) */}
        <button
          onClick={() => window.location.href = `https://mbti.nbtitest.com/${mbtiType.toLowerCase()}-characteristics/`}
          style={{
            width: '100%', padding: '1.25rem', background: '#111827',
            border: 'none', borderRadius: '15px',
            fontSize: '1.1rem', color: '#fff', cursor: 'pointer', fontWeight: '800',
            boxShadow: '0 8px 15px -3px rgba(0, 0, 0, 0.1)',
            marginBottom: '0.25rem'
          }}
        >
          {mbtiType} 유형 분석 보기
        </button>

        {/* 2. 처음으로 (사용자 요청: 단일 텍스트) */}
        <button
          onClick={goHome}
          style={{
            width: '100%', padding: '1rem', background: '#6366f1',
            border: 'none', borderRadius: '15px',
            fontSize: '1.1rem', color: '#fff', cursor: 'pointer', fontWeight: '800',
            boxShadow: '0 8px 15px -3px rgba(99, 102, 241, 0.2)',
          }}
        >
          처음으로
        </button>

        <div className="w-full flex justify-center mt-3">
          <AdSlot slotId="RESULT_BOTTOM" mbtiType={mbtiType} />
        </div>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>결과를 분석 중입니다...</p>
    </div>}>
      <ResultContent />
    </Suspense>
  );
}
