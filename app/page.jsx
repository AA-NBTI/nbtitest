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
  const [completedTests, setCompletedTests] = useState([]);

  // 로컬 스토리지에서 완료된 테스트 목록 로드
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const completed = JSON.parse(localStorage.getItem('completed_nbti_tests') || '[]');
      setCompletedTests(completed);
    }
  }, []);

  // 완료된 테스트 제외 필터링
  const filteredTypes = TEST_TYPES.filter(t => !completedTests.includes(t.type));
  const isAllCompleted = completedTests.length >= TEST_TYPES.length;

  return (
    <div className="bg-[#fafafa] min-h-screen">
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
        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.25em', color: '#9ca3af', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            Next Behavioral Trend Indicator
          </p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: '800', color: '#111827', letterSpacing: '-0.03em', margin: 0 }}>
            NBTI 테스트
          </h1>
          <p style={{ marginTop: '1rem', fontSize: '1rem', color: '#6b7280' }}>
            당신의 성향을 정확하게 측정합니다
          </p>
        </div>

        {/* 테스트 유형 선택 또는 완료 메시지 */}
        <div style={{
          width: '100%',
          maxWidth: '420px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}>
          {isAllCompleted ? (
            <div style={{
              textAlign: 'center',
              padding: '2.5rem 1.5rem',
              background: '#f8fafc',
              borderRadius: '20px',
              border: '2px dashed #e2e8f0'
            }}>
              <span style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'block' }}>🎉</span>
              <p style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>
                모든 테스트를 완료하셨습니다!
              </p>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                이제 당신의 NBTI 결과를 바탕으로<br />
                맞춤형 트렌드 분석을 즐겨보세요.
              </p>
              <button
                onClick={() => {
                  localStorage.removeItem('completed_nbti_tests');
                  window.location.reload();
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#6366f1',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                다시 테스트하기
              </button>
            </div>
          ) : (
            <>
              {completedTests.length > 0 && (
                <p style={{ fontSize: '0.85rem', color: '#6366f1', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center' }}>
                  ✓ {completedTests.length}개 완료! 새로운 버전을 선택하세요.
                </p>
              )}
              {filteredTypes.map(({ type, label, desc }) => (
                <button
                  key={type}
                  onClick={() => router.push(`/${type}`)}
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
                    <p style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: 0 }}>{label}</p>
                    <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '0.25rem 0 0' }}>{desc}</p>
                  </div>
                  <span style={{ color: '#6366f1', fontSize: '1.2rem', fontWeight: 'bold' }}>→</span>
                </button>
              ))}
            </>
          )}
        </div>

        <p style={{ marginTop: '2.5rem', fontSize: '0.75rem', color: '#c4c9d4', textAlign: 'center', lineHeight: 1.6 }}>
          누적 테스트로 신뢰도가 올라갑니다<br />
          3회 완료 시 NTI 트렌드 지수를 확인할 수 있습니다
        </p>
      </main>
    </div>
  );
}
