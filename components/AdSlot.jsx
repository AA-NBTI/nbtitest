'use client';

import React, { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';

/**
 * [AdSlot.jsx]
 * 기능: 특정 슬롯 ID(예: RESULT_BOTTOM)에 맞는 광고를 가져와 렌더링
 * 특징: 
 * 1. 클라이언트 측에서 동적 로드
 * 2. 캠페인 활성 상태 및 예산 소진 여부 자동 필터링 (서버사이드 처리 권장)
 * 3. 클릭 시 카운팅 로직 포함 가능
 */

export function AdSlot({ slotId, mbtiType = 'all' }) {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAd() {
      try {
        const res = await fetch(`/api/ads?placement=${slotId}`, { cache: 'no-store' });
        const allAds = await res.json();
        
        const possibleAds = Array.isArray(allAds) ? allAds.filter(a => 
          !a.target_mbti || a.target_mbti === '' || a.target_mbti === 'all' || a.target_mbti?.includes(mbtiType)
        ) : [];

        if (possibleAds.length > 0) {
          const selected = possibleAds[Math.floor(Math.random() * possibleAds.length)];
          setAd(selected);
        } else if (slotId === 'MAIN_TOP') {
          setAd({
            link_url: 'https://nbtitest.com',
            banner_img_url: '/nbti_sticky_50.png',
            brand_name: 'NBTI 공식',
            title: '가장 정확한 성격 테스트',
            isFallback: true
          });
        } else if (slotId === 'RESULT_TOP') {
          setAd({
            link_url: 'https://nbtitest.com',
            banner_img_url: '/nbti_promo.png',
            brand_name: 'NBTI',
            title: '나의 다른 유형도 확인해보세요',
            isFallback: true
          });
        } else if (slotId === 'RESULT_BOTTOM') {
          setAd({
            link_url: 'https://nbtitest.com',
            banner_img_url: '/nbti_discovery.png',
            brand_name: 'NBTI 리포트',
            title: '내 성격의 진짜 모습을 발견하세요',
            isFallback: true
          });
        }
      } catch (err) {
        console.error('Ad load failed:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAd();
  }, [slotId, mbtiType]);

  const handleAdClick = (e) => {
    // 기본 동작(링크 이동)을 막고 커스텀 핸들링 (필요 시)
    // recordAdClick이 있다면 여기서 호출
    console.log('Ad clicked:', ad.brand_name);
  };

  if (loading) return <div className="w-full h-24 bg-gray-50 animate-pulse rounded-2xl border border-dashed border-gray-200" />;
  if (!ad) return null;

  // 05. MAIN_TOP: 상단 고정 스티키 배너
  if (slotId === 'MAIN_TOP') {
    return (
      <a
        href={ad.link_url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleAdClick}
        className="flex w-full items-center justify-center overflow-hidden bg-white relative group cursor-pointer"
        style={{ height: '100px', maxWidth: '375px', margin: '0 auto' }}
      >
        {ad.banner_img_url ? (
          <img
            src={ad.banner_img_url}
            alt={ad.brand_name || 'Ad'}
            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
            style={{ display: 'block' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center gap-3 bg-indigo-600 px-4">
            <span className="text-white font-black text-sm truncate">{ad.title}</span>
            <span className="shrink-0 text-indigo-200 text-xs font-bold border border-indigo-400 px-2 py-0.5 rounded-full">알아보기 →</span>
          </div>
        )}
        {!ad.isFallback && (
          <div className="absolute top-0 right-0 bg-slate-900/50 text-[7px] font-black text-white px-1.5 py-[2px] uppercase tracking-widest">
            AD
          </div>
        )}
      </a>
    );
  }

  const isResultSlot = slotId.includes('RESULT');
  const containerAspect = isResultSlot ? 'aspect-[3.2/1]' : 'aspect-[2/1]';

  return (
    <div className={`w-full ${isResultSlot ? 'max-w-[320px] rounded-2xl' : 'max-w-[400px] mt-8 mb-4 rounded-3xl'} overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all group relative`}>
      <a 
        href={ad.link_url} 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={handleAdClick}
        className="block relative"
      >
        <div className="absolute top-1 right-1 z-10 bg-slate-900/40 backdrop-blur-md text-[8px] font-black text-white px-2 py-[2px] rounded-sm uppercase tracking-tighter shadow-sm">
          Ad
        </div>

        {ad.banner_img_url ? (
          <div className={`w-full ${containerAspect} overflow-hidden`}>
            <img 
              src={ad.banner_img_url} 
              alt={ad.brand_name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className={`w-full ${containerAspect} bg-indigo-50 flex flex-col items-center justify-center p-4 text-center`}>
             <span className={`${isResultSlot ? 'text-2xl mb-1' : 'text-4xl mb-2'}`}>{ad.emoji_icon}</span>
             <p className="text-indigo-900 font-bold text-[11px] sm:text-sm leading-tight">{ad.title}</p>
          </div>
        )}

        <div className="px-3 py-2 flex items-center justify-between bg-white border-t border-slate-100">
          <div className="flex flex-col max-w-[75%]">
            <span className="block text-[9px] font-black text-indigo-500 uppercase tracking-widest">{ad.brand_name}</span>
            <span className="block text-[11px] font-bold text-slate-700 truncate">{ad.title}</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-50 text-indigo-600 text-[10px] font-black px-2 py-1.5 rounded-lg group-hover:bg-indigo-50 transition-colors shadow-sm border border-slate-100">
             열기 <ExternalLink size={10} />
          </div>
        </div>
      </a>
    </div>
  );
}
