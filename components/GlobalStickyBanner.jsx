'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AdSlot } from './AdSlot';
import { useAuth } from '@/app/AuthProvider';
import Link from 'next/link';

/**
 * GlobalStickyBanner (정밀 위치 정렬본)
 * - 홈으로 (3글자): 하단 테스트 상자 내부의 '일반형' 텍스트 시작 라인과 일치 (1.75rem 패딩)
 * - 회원가입 (4글자): 하단 테스트 상자 내부의 화살표(→) 위치 라인과 대칭 일치
 */
export function GlobalStickyBanner() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/my-dashboard')) {
    return null;
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}>
      
      {/* 1. 광고 캠페인 슬롯 (기본 높이 유지) */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
         <AdSlot slotId="MAIN_TOP" />
      </div>

      {/* 2. 네비게이션 헤더 (40px) */}
      <nav style={{ 
        height: '40px', 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
         <div style={{ 
            width: '100%', 
            maxWidth: '480px',
            padding: '0 1.5rem', // [중요] 버튼 padding(1.5rem)과 완벽 일치 → 홈으로↔일반형, 회원가입↔→ 수직 정렬
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
         }}>
            {/* 홈으로: 하단 '일반형' 글자와 폰트 속성(1rem, 700) 및 수직 라인 일치 */}
            <Link href="/" style={{ 
              textDecoration: 'none', 
              fontSize: '1rem', 
              fontWeight: '700', 
              color: '#111827',
              letterSpacing: '-0.02em',
              paddingLeft: '1.5rem'
            }}>
               홈으로
            </Link>

            {/* 회원가입/대시보드: 하단 화살표(→) 라인과 폰트 속성(1rem, 700) 및 수직 라인 일치 */}
            <Link href={user ? '/my-dashboard' : '/login?mode=signup'} style={{ 
              textDecoration: 'none', 
              fontSize: '1rem', 
              fontWeight: '700', 
              color: '#111827',
              letterSpacing: '-0.02em',
              paddingRight: '1.5rem'
            }}>
               {user ? '대시보드' : '회원가입'}
            </Link>
         </div>
      </nav>
    </div>
  );
}
