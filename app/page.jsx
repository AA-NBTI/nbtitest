'use client';

import { useRouter } from 'next/navigation';

const TEST_TYPES = [
  { type: 'basic',    label: '일반형',   desc: '일상 속 나의 성향을 측정합니다' },
  { type: 'love',     label: '연애형',   desc: '관계에서 드러나는 나의 성향을 측정합니다' },
  { type: 'work',     label: '직장형',   desc: '업무 환경에서의 나의 성향을 측정합니다' },
  { type: 'dynamic',  label: '통합형',   desc: '세 가지 맥락을 혼합하여 정밀하게 측정합니다' },
];

export default function LandingPage() {
  const router = useRouter();

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
        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: '800', color: '#111827', letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0 }}>
          NBTI
        </h1>
        <p style={{ marginTop: '1rem', fontSize: '1rem', color: '#6b7280', fontWeight: '400' }}>
          당신의 성향을 정확하게 측정합니다
        </p>
      </div>

      {/* 테스트 유형 선택 */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}>
        {TEST_TYPES.map(({ type, label, desc }) => (
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
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#6366f1';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.08)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div>
              <p style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: 0 }}>{label}</p>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '0.25rem 0 0' }}>{desc}</p>
            </div>
            <span style={{ color: '#d1d5db', fontSize: '1.2rem' }}>→</span>
          </button>
        ))}
      </div>

      {/* 신뢰도 안내 */}
      <p style={{ marginTop: '2.5rem', fontSize: '0.75rem', color: '#c4c9d4', textAlign: 'center', lineHeight: 1.6 }}>
        누적 테스트로 신뢰도가 올라갑니다<br />
        3회 완료 시 NTI 트렌드 지수를 확인할 수 있습니다
      </p>
    </main>
    </div>
  );
}
