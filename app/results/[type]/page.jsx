'use client';

import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { Suspense } from 'react';

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

  // Hydration 불일치 방지: 타입스크립트처럼 window 객체 대신 Next.js 라우터의 내장 params 활용
  const rawType = params?.type || 'INTJ';
  const mbtiType = typeof rawType === 'string' ? rawType.toUpperCase() : 'INTJ';

  const ntiScore = parseInt(searchParams.get('score') || '0');
  const ntiGrade = searchParams.get('grade') || '';
  const confidence = parseInt(searchParams.get('confidence') || '0');

  const desc = MBTI_DESC[mbtiType] || '나만의 고유한 성향 유형';

  // NTI 진입 Tier 판정
  let ntiMessage = `신뢰도 ${confidence}% — 트렌드 지수 확인 불가 (75% 이상 필요)`;
  let tier = 0;

  if (confidence >= 85) {
    ntiMessage = `신뢰도 ${confidence}% — 프리미엄 NTI 완전 개방`;
    tier = 2;
  } else if (confidence >= 75) {
    ntiMessage = `신뢰도 ${confidence}% — 일반 쇼핑/연애 분석 개방`;
    tier = 1;
  }
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/og?mbti=${mbtiType}&score=${ntiScore}&grade=${ntiGrade}&format=card`;

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

      {/* MBTI 결과 */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
          당신의 유형
        </p>
        <h1 style={{ fontSize: 'clamp(3rem, 12vw, 5rem)', fontWeight: '800', color: '#111827', letterSpacing: '-0.03em', margin: 0 }}>
          {mbtiType}
        </h1>
        <p style={{ marginTop: '0.75rem', fontSize: '0.95rem', color: '#6b7280' }}>{desc}</p>
      </div>

      {/* 신뢰도 바 */}
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
        <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem', textAlign: 'center' }}>
          {ntiMessage}
        </p>
      </div>

      {/* NTI 진입 버튼 분기 */}
      <div style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {tier === 0 && (
          <button
            onClick={() => router.push('/')}
            style={{
              width: '100%', padding: '1rem', background: '#fff',
              border: '1px solid #e5e7eb', borderRadius: '10px',
              fontSize: '0.9rem', color: '#374151', cursor: 'pointer', fontWeight: '500',
            }}
          >
            다른 버전으로 한 번 더 테스트하기
          </button>
        )}

        {tier === 1 && (
          <>
            <button
              onClick={() => router.push('/shopping-nti')}
              style={{
                width: '100%', padding: '1rem', background: '#6366f1',
                border: 'none', borderRadius: '10px',
                fontSize: '0.9rem', color: '#fff', cursor: 'pointer', fontWeight: '600',
              }}
            >
              쇼핑 트렌드 지수 측정하기
            </button>
            <button
              onClick={() => router.push('/')}
              style={{
                width: '100%', padding: '1rem', background: '#fff',
                border: '1px solid #e5e7eb', borderRadius: '10px',
                fontSize: '0.9rem', color: '#6366f1', cursor: 'pointer', fontWeight: '500',
              }}
            >
              (현재 {confidence}%) 신뢰도 85% 채우고 프리미엄 보상 받기
            </button>
          </>
        )}

        {tier === 2 && (
          <button
            onClick={() => window.location.href = `https://mbti.nbtitest.com/${mbtiType.toLowerCase()}-characteristics/`}
            style={{
              width: '100%', padding: '1rem', background: '#111827',
              border: 'none', borderRadius: '10px',
              fontSize: '0.9rem', color: '#fff', cursor: 'pointer', fontWeight: '600',
            }}
          >
            ✨ 내 성격 특징 완벽 분석 리포트 보러가기
          </button>
        )}

        {/* 다시 테스트 하기 버튼 */}
        <button
          onClick={() => router.push('/')}
          style={{
            width: '100%', padding: '1rem', background: '#fff',
            border: '1px solid #e5e7eb', borderRadius: '10px',
            fontSize: '0.9rem', color: '#9ca3af', cursor: 'pointer', fontWeight: '500',
          }}
        >
          ↻ 처음부터 다시 테스트 하기
        </button>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>결과를 불러오는 중...</p>
    </div>}>
      <ResultContent />
    </Suspense>
  );
}
