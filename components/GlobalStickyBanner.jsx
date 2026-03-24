'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AdSlot } from './AdSlot';

/**
 * GlobalStickyBanner
 * - 전체 페이지(랜딩/테스트/결과)에 공통 노출되는 상단 고정 100px 띠배너
 * - layout.jsx(서버 컴포넌트)에서 사용할 수 있도록 별도 클라이언트 컴포넌트로 분리
 * - 관리자 페이지(/admin/*)는 제외
 */
export function GlobalStickyBanner() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // 하이드레이션 오류 방지를 위해 클라이언트 마운트 후 렌더링
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // 관리자 페이지에서는 배너 숨김
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '100px',
        zIndex: 9999,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid rgba(226,232,240,0.6)',
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <AdSlot slotId="MAIN_TOP" />
    </div>
  );
}
