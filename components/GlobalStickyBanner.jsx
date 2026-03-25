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
import { useAuth } from '@/app/AuthProvider';
import Link from 'next/link';
import { User } from 'lucide-react';

export function GlobalStickyBanner() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth(); // 인증 상태 가져오기

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/my-dashboard')) {
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
      
      {/* [개선] 우측 상단 로그인/마이페이지 버튼 (가독성 강화) */}
      <Link 
        href={user ? '/my-dashboard' : '/login'}
        style={{
          position: 'absolute',
          right: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          padding: '8px 14px',
          borderRadius: '14px',
          backgroundColor: user ? '#4f46e5' : '#f8fafc',
          color: user ? '#ffffff' : '#6366f1',
          border: user ? 'none' : '1px solid #e0e7ff',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none',
          boxShadow: user ? '0 4px 12px rgba(79, 70, 229, 0.2)' : 'none',
          zIndex: 10000,
          transition: 'all 0.2s ease'
        }}
      >
        <User size={14} strokeWidth={3} />
        <span style={{ 
          fontSize: '11px', 
          fontWeight: '900', 
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap'
        }}>
          {user ? '내 정보' : '로그인'}
        </span>
      </Link>
    </div>
  );
}
