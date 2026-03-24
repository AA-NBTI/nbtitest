'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * 안프로 요구사항 1: 분석 로딩 및 자체 광고 노출
 * 기능: 4초 강제 지연(골든타임 확보), ad 데이터 존재 시에만 광고 슬롯 렌더링
 */

export default function LoadingSpinner({ ad = null, onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500); 
          return 100;
        }
        return prev + 1.25; // 40ms * 80회 = 3.2초 + 알파 (약 4초 근사치)
      });
    }, 40);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col items-center text-center">
        
        {/* 상단 분석 엔진 애니메이션 */}
        <div className="relative w-24 h-24 mb-8">
          <motion.div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
          <motion.div 
            className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-2xl">🔍</div>
        </div>

        <h2 className="text-2xl font-black text-gray-800 mb-2 tracking-tight">당신의 쇼핑 DNA 분석 중...</h2>
        <p className="text-gray-500 text-sm mb-8">15만 명의 누적 데이터와 당신의 패턴을 대조하고 있습니다.</p>

        {/* 프로그레스 바 */}
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-12 border border-gray-50">
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* ★ [자체 광고 영역] 활성화된 광고가 있을 때만 노출 ★ */}
        {ad && ad.is_active ? (
          <motion.a
            href={ad.link_url}
            target="_blank"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full aspect-[4/3] bg-indigo-50 rounded-3xl border-2 border-indigo-100 flex flex-col items-center justify-center relative overflow-hidden group"
          >
            <span className="absolute top-4 left-4 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest shadow-sm">Sponsor</span>
            <div className="text-center p-6">
              <span className="text-5xl mb-4 block group-hover:scale-110 transition-transform duration-300">{ad.emoji_icon || '🎁'}</span>
              <p className="text-indigo-400 text-xs font-bold mb-1 uppercase">{ad.brand_name} Special</p>
              <p className="text-gray-800 font-extrabold text-lg leading-tight break-keep">{ad.title}</p>
            </div>
          </motion.a>
        ) : (
          <div className="py-12 px-6 bg-gray-50 rounded-3xl w-full border border-gray-100">
            <p className="text-gray-400 font-bold text-sm tracking-tight">"데이터 일관성 검증 완료"</p>
            <p className="text-gray-300 text-xs mt-2">정밀한 결과 도출을 위해 최종 연산 중입니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}