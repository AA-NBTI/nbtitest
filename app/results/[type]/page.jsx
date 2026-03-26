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
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 1.5rem 4rem', // 메인 및 테스트 화면과 동일한 80px 패딩 통일
      fontFamily: "'Apple SD Gothic Neo', sans-serif",
      color: '#111827'
    }}>

      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.8rem', letterSpacing: '0.4em', color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase', fontWeight: '500' }}>
          분석 결과 리포트
        </p>
        <h1 style={{ fontSize: 'clamp(3rem, 12vw, 5rem)', fontWeight: '800', color: '#111827', letterSpacing: '-0.05em', margin: 0, lineHeight: 0.9 }}>
          {mbtiType}
        </h1>
        <p style={{ marginTop: '1.25rem', fontSize: '1rem', color: '#94a3b8', fontWeight: '600' }}>{desc}</p>
      </div>

      {stats && stats.total > 0 && (
        <div style={{
          width: '100%', maxWidth: '400px', background: '#f8fafc', borderRadius: '32px',
          padding: '2rem', marginBottom: '2rem', border: '1px solid #f1f5f9',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', letterSpacing: '0.05em' }}>실시간 트렌드</span>
            <span style={{ padding: '2px 8px', background: '#4f46e5', borderRadius: '6px', fontSize: '10px', fontWeight: '600', color: '#ffffff' }}>N={stats.total}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ borderLeft: '4px solid #4f46e5', paddingLeft: '12px' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: '500', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>주요 성별</p>
              <h5 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827' }}>
                {Object.entries(stats.gender).sort((a,b)=>b[1]-a[1])[0]?.[0] || '분석 중'}
              </h5>
            </div>
            <div style={{ borderLeft: '4px solid #94a3b8', paddingLeft: '12px' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: '500', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>핵심 연령대</p>
              <h5 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827' }}>
                {Object.entries(stats.age).sort((a,b)=>b[1]-a[1])[0]?.[0] || '분석 중'}
              </h5>
            </div>
          </div>
        </div>
      )}

      <div style={{ width: '100%', maxWidth: '400px', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500', textTransform: 'uppercase' }}>신뢰도 스코어</span>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#111827' }}>{confidence}%</span>
        </div>
        <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${confidence}%`,
            background: '#111827',
            transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
          }} />
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="w-full flex justify-center mb-2">
          <AdSlot slotId="RESULT_TOP" mbtiType={mbtiType} />
        </div>

        {/* 1. NBTI 유형 분석 */}
        <button
          onClick={() => window.location.href = `https://mbti.nbtitest.com/${mbtiType.toLowerCase()}-characteristics/`}
          style={{
            width: '100%', padding: '1.5rem', background: '#111827',
            border: 'none', borderRadius: '20px',
            fontSize: '1.1rem', color: '#fff', cursor: 'pointer', fontWeight: '700',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {mbtiType} 분석 Report 보러가기
        </button>

        {/* 2. 처음으로 (사용자 요청: 단일 텍스트) */}
        <button
          onClick={goHome}
          style={{
            width: '100%', padding: '1.25rem', background: '#ffffff',
            border: '1px solid #e2e8f0', borderRadius: '20px',
            fontSize: '1.1rem', color: '#111827', cursor: 'pointer', fontWeight: '700',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f8fafc';
            e.currentTarget.style.borderColor = '#111827';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
        >
          처음으로 돌아가기
        </button>

        <div className="w-full flex justify-center mt-4">
          <AdSlot slotId="RESULT_BOTTOM" mbtiType={mbtiType} />
        </div>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin mb-4" />
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: '700' }}>결과를 분석 중입니다...</p>
    </div>}>
      <ResultContent />
    </Suspense>
  );
}
