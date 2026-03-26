'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const TEST_TYPES = [
  { type: 'basic',    label: '일반형',   desc: '일상 속 나의 성향을 측정합니다' },
  { type: 'love',     label: '연애형',   desc: '관계에서 드러나는 나의 성향을 측정합니다' },
  { type: 'work',     label: '직장형',   desc: '업무 환경에서의 나의 성향을 측정합니다' },
  { type: 'dynamic',  label: '통합형',   desc: '세 가지 맥락을 혼합하여 정밀하게 측정합니다' },
];

export default function LandingPage() {
  const router = useRouter();

  // [수정] 영구 저장 로직 전체 제거 (사용자 요청: 재방문 시 무조건 초기 상태)
  // 이전의 완료 내역이나 진행도를 기억하지 않고 매번 새롭게 진입합니다.

  return (
    <div className="bg-[#fafafa] min-h-screen">
      <main style={{
        minHeight: '100vh',
        background: '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '80px 1.5rem 4rem', // 상단 여백 설정 (80px)
        fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
      }}>
        {/* 헤더 (기존 중앙 정렬 복구) */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p style={{ 
            fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)', 
            letterSpacing: '0.15em', 
            color: '#94a3b8', 
            marginBottom: '0.75rem', 
            textTransform: 'uppercase',
            fontWeight: '500'
          }}>
            Next Behavioral Trend Indicator
          </p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: '800', color: '#111827', letterSpacing: '-0.03em', margin: 0 }}>
            NBTI 테스트
          </h1>
          <p style={{ marginTop: '1rem', fontSize: '1rem', color: '#6b7280' }}>
            당신의 성향을 정확하게 측정합니다
          </p>
        </div>

        {/* 테스트 유형 선택 (항상 모든 유형이 초기 상태로 노출됨) */}
        <div style={{
          width: '100%',
          maxWidth: '480px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {TEST_TYPES.map(({ type, label, desc }) => (
              <button
                key={type}
                onClick={() => {
                  // 진입 시 해당 타입의 기존 진행도는 삭제해줌 (확실한 초기 시작)
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem(`nbti_progress_${type}`);
                  }
                  router.push(`/${type}`);
                }}
                style={{
                  width: '100%',
                  padding: '1.25rem 1.5rem',
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#6366f1';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.04)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div>
                  <p style={{ fontSize: '1rem', fontWeight: '700', color: '#111827', margin: 0 }}>{label}</p>
                  <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '0.25rem 0 0' }}>{desc}</p>
                </div>
                <span style={{ color: '#6366f1', fontSize: '1.2rem', fontWeight: 'bold' }}>→</span>
              </button>
            ))}
          </div>
        </div>

        <p style={{ marginTop: '2.5rem', fontSize: '0.75rem', color: '#c4c9d4', textAlign: 'center', lineHeight: 1.6 }}>
          로그인 없이 간편하게 참여 가능합니다<br />
          언제든 다시 방문하여 새로운 결과를 확인해보세요
        </p>
      </main>
    </div>
  );
}
