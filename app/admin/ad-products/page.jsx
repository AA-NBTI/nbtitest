'use client';

/**
 * [파일명: app/admin/ad-products/page.jsx]
 * 기능: 광고 상품 카탈로그 – 2분할 구조 v12
 * 좌열 (2/5): 제목 + 요약 + 상품 목록 네비게이션
 * 우열 (3/5): 선택된 상품 상세 (설명 · 규격 · 가격 · 목업)
 */

import React, { useState } from 'react';
import {
  BookOpen, Star, Zap, Tablet, MousePointer2, Activity, Layout,
  ChevronRight, BadgeDollarSign, LayoutTemplate, Info
} from 'lucide-react';

const PRODUCTS = [
  {
    id: 'TEST_FIXED_TOP', no: '01', name: '상단 고정 전광판', tag: '프리미엄', icon: Tablet,
    desc: '테스트 내내 화면 최상단에 고정되어 압도적인 노출량(CPM)과 브랜드 각인 효과를 보장하는 최우수 구좌입니다.',
    specs: ['노출 위치: 테스트 문항 화면 최상단', '권장 포맷: 와이드 배너 (600×300)', '가치: 유저 시야 고정 점유'],
    price: 'CPM 12,000원 ~',
    mockup: (
      <div className="w-full bg-slate-900 rounded-xl p-5 border border-slate-800 relative overflow-hidden flex flex-col items-center gap-3">
        <div className="w-full aspect-[2.5/1] rounded-lg border border-white/10 overflow-hidden relative bg-slate-800 flex items-center justify-center">
          <span className="text-white/30 text-[10px] font-black uppercase tracking-widest">600 × 300 BANNER</span>
          <div className="absolute top-0 right-0 bg-white text-slate-900 text-[8px] font-black px-2 py-0.5 rounded-bl-lg">01 PREMIUM</div>
        </div>
        <div className="w-full space-y-1.5 opacity-20">
          <div className="w-full h-2 bg-white/20 rounded-full" />
          <div className="w-2/3 h-2 bg-white/20 rounded-full" />
        </div>
      </div>
    )
  },
  {
    id: 'TEST_FIXED_BOTTOM', no: '02', name: '하단 고정 스티키', tag: '스탠다드', icon: Tablet,
    desc: '모바일 화면 최하단에 항상 플로팅되어 스크롤과 무관하게 안정적인 클릭률(CTR)을 달성하는 업계 표준 상품입니다.',
    specs: ['노출 위치: 모바일 화면 하단 스티키', '권장 포맷: 모바일 표준 (320×50)', '가치: 다이렉트 전환 유입 극대화'],
    price: 'CPM 8,000원 ~',
    mockup: (
      <div className="w-full bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative flex flex-col justify-between min-h-[180px]">
        <div className="space-y-2 opacity-10">
          <div className="w-3/4 h-2 bg-slate-900 rounded-full" />
          <div className="w-full h-2 bg-slate-900 rounded-full" />
          <div className="w-1/2 h-2 bg-slate-900 rounded-full" />
        </div>
        <div className="w-full h-10 bg-slate-900 rounded-lg flex items-center justify-center mt-4">
          <span className="text-white text-[9px] font-black tracking-widest uppercase">02 STICKY BANNER</span>
        </div>
      </div>
    )
  },
  {
    id: 'NATIVE_LIKERT', no: '03', name: '스텔스 인사이트', tag: '네이티브', icon: Zap,
    desc: '광고 표식 없이 질문지 속에 완전히 스며들어 유저의 거부감 없이 심리적 브랜드 동화를 유도하는 고효율 상품입니다.',
    specs: ['노출 위치: 일반 문항 사이에 네이티브 노출', '포맷: 리커트 척도 일체형 UI', '가치: 무의식적 브랜드 긍정 반응'],
    price: 'CPA(응답당) 450원 ~',
    mockup: (
      <div className="w-full bg-slate-50 rounded-xl p-6 border border-slate-200 shadow-sm relative flex flex-col items-center justify-center min-h-[180px]">
        <p className="text-[13px] font-black text-slate-900 text-center leading-snug mb-6 break-keep">"평소 해당 브랜드의 서비스를 적극적으로 추천할 의향이 있다."</p>
        <div className="w-full flex justify-between gap-1">
          {[...Array(7)].map((_, i) => (
            <div key={i} className={`rounded-full border-2 ${i === 3 ? 'border-slate-900 bg-slate-900 w-5 h-5' : 'border-slate-300 bg-white w-5 h-5'}`} />
          ))}
        </div>
        <div className="absolute top-2 right-2 text-[7px] font-black text-slate-300 uppercase">03 STEALTH</div>
      </div>
    )
  },
  {
    id: 'LOADING_BANNER', no: '04', name: '로딩 스크린 광고', tag: '모멘텀', icon: Activity,
    desc: '데이터 분석 로딩 중 화면 전체에 단독 노출되어 유저가 결과를 간절히 기다리는 골든타임 도달률을 보장합니다.',
    specs: ['노출 위치: 분석 로딩 페이지 전면', '포맷: 풀 스크린 텍스트+이미지', '가치: 관여도 최고 시점 독점 노출'],
    price: 'CPM 10,000원 ~',
    mockup: (
      <div className="w-full bg-slate-900 rounded-xl p-6 border border-slate-800 relative flex flex-col items-center justify-center min-h-[180px] gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-white/20 border-t-white animate-spin" />
        <p className="text-white font-black text-[10px] tracking-widest uppercase text-center">Protocol Analyzing...</p>
        <div className="w-full h-14 bg-white/10 rounded-lg flex items-center justify-center border border-white/5 border-dashed">
          <span className="text-white font-black text-[9px] uppercase tracking-widest">04 SPONSORED STATION</span>
        </div>
      </div>
    )
  },
  {
    id: 'RESULT_TOP', no: '05', name: '결과 리포트 상단', tag: '컨버전', icon: Layout,
    desc: '테스트 결과지 최상단에 노출되어 분석 내용에 대한 몰입을 유입이나 구매 행동으로 즉각 연결하는 기폭제 역할을 합니다.',
    specs: ['노출 위치: 결과 데이터 리포트 상단', '권장 포맷: 가로형 하이브리드 배너', '가치: 고관여 유저 행동 전환 극대화'],
    price: 'CPM 9,500원 ~',
    mockup: (
      <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col min-h-[180px]">
        <div className="w-full h-14 bg-slate-900 rounded-lg mb-4 flex items-center justify-center shadow-lg">
          <span className="text-white text-[9px] font-black uppercase tracking-widest">05 RESULT TOP</span>
        </div>
        <div className="flex-1 space-y-2 opacity-10">
          <div className="w-3/4 h-2.5 bg-slate-900 rounded-full" />
          <div className="w-full h-2.5 bg-slate-900 rounded-full" />
          <div className="w-2/3 h-2.5 bg-slate-900 rounded-full" />
        </div>
      </div>
    )
  },
  {
    id: 'RESULT_BOTTOM', no: '06', name: '결과 리포트 하단', tag: '리텐션', icon: Layout,
    desc: '리포트 마지막 영역에 추천 방식으로 배치되어 테스트 이후의 연관 브랜드 경험을 자연스럽게 제안합니다.',
    specs: ['노출 위치: 결과지 하단 추천 영역', '권장 포맷: 리스트/버튼 형태 배너', '가치: 유저 여정 연장 및 브랜드 재접인'],
    price: 'CPM 7,000원 ~',
    mockup: (
      <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col justify-end min-h-[180px]">
        <div className="flex-1 space-y-2 opacity-10 pt-2">
          <div className="w-full h-2.5 bg-slate-900 rounded-full" />
          <div className="w-4/5 h-2.5 bg-slate-900 rounded-full" />
        </div>
        <div className="w-full h-12 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center mt-4">
          <span className="text-slate-900 text-[9px] font-black uppercase tracking-widest">06 RECOMMENDATION</span>
        </div>
      </div>
    )
  },
  {
    id: 'MAIN_TOP', no: '07', name: '메인 홈 최상단', tag: '임팩트', icon: Star,
    desc: '서비스 초기 접속 단계에서 브랜드의 존재감을 강력하게 인식시키며 전방위적인 브랜딩 파워를 제공합니다.',
    specs: ['노출 위치: 랜딩 페이지 히어로 영역', '권장 포맷: 미니 엠블럼형 배너', '가치: 플랫폼 게이트웨이 점유'],
    price: 'CPM 15,000원 ~',
    mockup: (
      <div className="w-full bg-[#fafafa] rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col items-center min-h-[180px]">
        <div className="w-full h-10 bg-white border border-slate-100 rounded-md shadow-sm mb-4 flex items-center justify-between px-3">
          <div className="w-10 h-3 bg-slate-900 rounded-full" />
          <div className="w-5 h-5 bg-slate-100 rounded-full" />
        </div>
        <div className="w-full h-14 bg-slate-900 rounded-lg shadow-xl flex items-center justify-center">
          <span className="text-white text-[9px] font-black uppercase tracking-widest">07 HOME STATION</span>
        </div>
        <div className="mt-4 w-1/2 h-2 bg-slate-200 rounded-full opacity-30" />
      </div>
    )
  }
];

export default function AdProductsPage() {
  const [selectedId, setSelectedId] = useState(PRODUCTS[0].id);
  const selected = PRODUCTS.find(p => p.id === selectedId) || PRODUCTS[0];

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans text-slate-900">
      <div className="p-4 md:p-8 lg:p-10 mx-auto max-w-[1200px]">

        <div className="pt-8 grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* ══════════════════════════════
              좌열: 제목 + 상품 네비
          ══════════════════════════════ */}
          <div className="lg:col-span-2 space-y-5 lg:sticky lg:top-10">

            {/* 페이지 제목 */}
            <div className="pb-5 border-b border-slate-200">
              <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1.5 leading-none flex items-center gap-2">
                <Info size={12} /> 광고 상품 구성 체계
              </p>
              <h1 className="text-2xl font-black tracking-tighter uppercase text-slate-900 leading-none">광고 상품</h1>
              <p className="text-[12px] font-bold text-slate-400 mt-2 leading-relaxed">7개 정밀 타겟팅 구좌 미디어킷</p>
            </div>

            {/* 요약: 가격 범위 */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">최저 단가</p>
                <p className="text-[13px] font-black text-slate-900">CPA 450원</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">최고 단가</p>
                <p className="text-[13px] font-black text-slate-900">CPM 15,000원</p>
              </div>
            </div>

            {/* 상품 목록 네비게이션 */}
            <nav className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              {PRODUCTS.map(product => {
                const Icon = product.icon;
                const isActive = selectedId === product.id;
                return (
                  <button
                    key={product.id}
                    onClick={() => setSelectedId(product.id)}
                    className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-all border-b border-slate-50 last:border-0 ${isActive ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-[11px] shrink-0 ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {product.no}
                    </div>
                    <span className="text-[13px] font-black tracking-tight flex-1">{product.name}</span>
                    <span className={`text-[10px] font-black uppercase ${isActive ? 'text-slate-400' : 'text-slate-300'}`}>{product.tag}</span>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white/50" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* ══════════════════════════════
              우열: 선택된 상품 상세
          ══════════════════════════════ */}
          <div className="lg:col-span-3 min-h-[60vh] pb-16">
            <div className="space-y-5">

              {/* 상품 헤더 */}
              <div className="bg-slate-900 text-white p-7 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 text-white/[0.03] font-black text-[80px] leading-none select-none pr-4 pt-2">
                  {selected.no}
                </div>
                <div className="flex items-start gap-4 relative">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center font-black text-xl shrink-0">
                    {selected.no}
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1">{selected.tag} PROTOCOL</p>
                    <h2 className="text-xl font-black tracking-tighter leading-none uppercase">{selected.name}</h2>
                  </div>
                </div>
              </div>

              {/* 소개 설명 */}
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <p className="text-[13px] font-black text-slate-900 leading-relaxed break-keep border-l-4 border-slate-900 pl-4">
                  {selected.desc}
                </p>
              </div>

              {/* 규격 + 가격 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                  <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <LayoutTemplate size={13} className="text-slate-400" /> 노출 최적화 규격
                  </h3>
                  <ul className="space-y-2.5">
                    {selected.specs.map(s => (
                      <li key={s} className="flex items-start gap-2 text-[12px] font-bold text-slate-600 leading-snug">
                        <ChevronRight size={13} strokeWidth={3} className="text-slate-900 mt-0.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                  <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <BadgeDollarSign size={13} className="text-slate-400" /> 과금 전략
                  </h3>
                  <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none mb-2">{selected.price}</p>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Pricing Scheme Ver 3.5</p>
                </div>
              </div>

              {/* 시각적 목업 */}
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                  <MousePointer2 size={12} /> Visual Mockup Preview
                </p>
                {selected.mockup}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
