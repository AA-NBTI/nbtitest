'use client';

import React from 'react';
import { 
  BookOpen, Star, Zap, MapPin, Tablet, MousePointer2, BarChart, 
  ChevronRight, BadgeDollarSign, Info, LayoutTemplate
} from 'lucide-react';

/**
 * [파일명: app/admin/ad-products/page.jsx]
 * 기능: NBTI 광고 상품 미디어킷 (지면별 설명 및 단가 가이드)
 */

export default function AdProductsPage() {
  const products = [
    {
      id: 'TEST_FIXED_TOP',
      name: '상단 고정 전광판 (프리미엄)',
      tag: 'PREMIUM',
      icon: Tablet,
      desc: '테스트가 진행되는 내내 가장 시선이 많이 가는 화면 최상단에 고정 노출됩니다. 압도적인 브랜드 노출량(CPM)과 각인 효과를 보장하는 최우수 구좌입니다.',
      specs: ['노출 위치: 테스트 문항 화면 최상단', '권장 포맷: 와이드 배너 (600x300)', '가치: 유저가 문항을 푸는 내내 시야에 고정'],
      price: 'CPM 12,000원 ~ / 주간 단독 고정액 협의',
      mockup: (
        <div className="w-full bg-slate-900 rounded-[32px] p-6 shadow-2xl relative overflow-hidden flex flex-col items-center">
           <div className="w-full aspect-[2/1] rounded-xl mb-4 border border-white/20 overflow-hidden relative group">
              <img src="/nbti_promo.png" className="w-full h-full object-cover" alt="NBTI Promo"/>
              <div className="absolute inset-0 bg-indigo-600/20 mix-blend-overlay"/>
              <div className="absolute top-0 right-0 bg-white text-slate-900 text-[8px] font-black px-2 py-0.5 rounded-bl-lg">TOP FIXED AD</div>
           </div>
           <div className="w-full space-y-3 opacity-30 px-2 mt-2">
              <div className="w-full h-3 bg-white/10 rounded-full"/>
              <div className="w-2/3 h-3 bg-white/10 rounded-full"/>
              <div className="flex justify-between pt-4">
                 {[...Array(5)].map((_, i) => <div key={i} className="w-5 h-5 rounded-full border border-white/20"/>)}
              </div>
           </div>
        </div>
      )
    },
    {
      id: 'TEST_FIXED_BOTTOM',
      name: '하단 고정 스티키 (320x50)',
      tag: '1순위',
      icon: Tablet,
      desc: '문항 조작부 방해 없이 모바일 화면 최하단에 항상 떠 있는 업계 표준 1순위 규격(320x50) 배너입니다. 문항을 푸는 내내 계속 노출되어 압도적인 노출량(CPM)과 가장 높은 클릭률(CTR)을 동시에 달성합니다.',
      specs: ['노출 위치: 테스트 진행 중 화면 하단 스티키 플로팅', '권장 포맷: 모바일 고정 배너 (320x50 또는 375x50)', '특징: 스크롤해도 사라지지 않는 상시 노출'],
      price: 'CPM 8,000원 ~',
      mockup: (
        <div className="w-full bg-slate-100 rounded-[32px] p-4 shadow-sm relative overflow-hidden flex flex-col items-center border border-slate-200" style={{ height: '300px' }}>
           {/* Mockup content */}
           <div className="w-full bg-white rounded-xl shadow-sm p-4 mt-6 mb-2">
              <div className="w-1/2 h-3 bg-slate-200 rounded-full mb-6 mx-auto"/>
              <div className="flex justify-between w-full px-4 mt-4">
                 {[...Array(5)].map((_, i) => <div key={i} className={`w-6 h-6 rounded-full border-2 ${i===2 ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300'}`}/>)}
              </div>
           </div>
           
           {/* Sticky Bottom Mockup representing 320x50 */}
           <div className="absolute bottom-0 w-full h-[50px] bg-slate-900 flex items-center justify-center px-4">
              <span className="text-white text-xs font-black tracking-wider">320 × 50 STICKY BANNER</span>
              <div className="absolute top-0.5 right-1 bg-white/20 text-white text-[7px] font-black px-1.5 py-[1px] rounded uppercase">AD</div>
           </div>
        </div>
      )
    },
    {
      id: 'NATIVE_LIKERT',
      name: '스텔스 테스트',
      tag: 'VIRAL',
      icon: Zap,
      desc: '광고 표식 없이 오리지널 심리 질문지 속에 완전히 스며들어 노출됩니다. 유저가 광고임을 전혀 인지하지 못해 무의식적으로 긍정적인 브랜드 각인을 이끌어냅니다.',
      specs: ['노출 위치: 일반 문항과 동일 (순서 랜덤화)', '포맷: 스폰서 표식 없음 (원형 문항 UI 유지)', '가치: 피험자의 강력한 심리적 동화 및 무의식 각인'],
      price: 'CPA(응답당) 450원 ~',
      mockup: (
         <div className="w-full bg-slate-50 rounded-[32px] p-4 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col items-center justify-center">
           <div className="w-full flex justify-center mb-4"><div className="w-16 h-1 bg-indigo-200 rounded-full"></div></div>
           <div className="text-indigo-600 font-black text-[10px] tracking-widest mb-2">QUESTION X</div>
           <div className="text-sm font-bold text-slate-800 text-center break-keep leading-snug mb-8">
             "스트레스를 받으면 나도 모르게<br/>새우깡의 바삭함을 찾게 된다."
           </div>
           <div className="w-full px-2 opacity-70 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                 {[...Array(7)].map((_, i) => <div key={i} className={`rounded-full border-[3px] border-slate-300 ${i===3 ? 'w-5 h-5 bg-slate-200' : 'w-6 h-6 bg-white'}`}/>)}
              </div>
           </div>
        </div>
      )
    },
    {
      id: 'LOADING',
      name: '브랜드 삽입',
      tag: 'HIGH DATA',
      icon: LayoutTemplate,
      desc: '테스트 문항 본문 바로 하단에 자연스럽게 끼워 넣어지는 띠배너 컴포넌트입니다. 문항을 풀이하는 시선의 흐름 상 클릭 유도가 매우 폭발적으로 일어납니다.',
      specs: ['노출 위치: 테스트 문항(Question)과 답변(Scale) 사이', '포맷: 스폰서 배너 박스 + 이동 버튼', '가치: 화면 이탈 없이 압도적 클릭률(CTR) 확보'],
      price: 'CPC 400원 ~ / CPA(응답당) 500원 ~',
      mockup: (
         <div className="w-full bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col items-center justify-center pt-8 pb-6">
           <div className="text-indigo-600 font-black text-[12px] tracking-widest mb-4 uppercase">QUESTION 4</div>
           <div className="text-[18px] font-black text-slate-800 text-center break-keep leading-snug mb-8">
             눈에 보이는 구체적인 애정 표현이 더 와닿는다
           </div>
           
           {/* In-Question Banner */}
           <div className="w-full relative px-2 mb-8">
             <div className="w-full border border-slate-200 rounded-xl px-4 py-3 flex justify-between items-center bg-white shadow-sm relative overflow-visible">
               <div className="absolute -top-3 right-2 bg-slate-100/90 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] font-black text-slate-400 border border-slate-200">
                 스폰서 광고
               </div>
               <span className="text-[13px] font-bold text-slate-800">넷플릭스 오징어게임 강추</span>
               <button className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-[11px] font-black flex items-center gap-1 transition-colors">
                 알아보기 ↗
               </button>
             </div>
           </div>

           <div className="w-full px-4 flex flex-col mb-4">
              <div className="flex justify-between items-center mb-2">
                 {[...Array(7)].map((_, i) => <div key={i} className={`rounded-full border-[3px] border-slate-200 ${i===3 ? 'w-6 h-6 bg-slate-100' : 'w-8 h-8 bg-white'}`}/>)}
              </div>
           </div>
           <div className="w-full flex justify-between items-center px-4">
              <span className="text-[11px] font-black text-indigo-600">매우 그렇다</span>
              <span className="text-[11px] font-black text-slate-400">보통</span>
              <span className="text-[11px] font-black text-indigo-600">전혀 아니다</span>
           </div>
        </div>
      )
    },
    {
      id: 'MAIN_TOP',
      name: '메인 상단 스티키 띠배너 (375×100)',
      tag: '최고가 BEST',
      icon: Star,
      desc: '서비스 진입 즉시 노출되고, 스크롤을 내려도 절대 사라지지 않고 화면 꼭대기에 고정되어 유저를 쫓아다닙니다. 375×100 대형 모바일 광고 규격으로 Interstitial 없이 콘텐츠 방리 없는 최장 노출을 보장합니다. 50px 배너 대비 시인성이 2배 이상 높으며, 전체 세션 동안 100% 노출량이 확보되어 가장 높은 광고 단가를 책정합니다.',
      specs: ['노출 위치: 페이지 최상단 고정 — 스크롤 무관 항시 고정', '규격: 375×100px (대형 모바일 띠배너 표준)', '특징: 테스트 시작~ 완료까지 단 한 번도 사라지지 않음', '시각적 압도감: 상단 100px 공간을 단독 점유하여 클릭률 극대화'],
      price: 'CPM 25,000원 ~ (최고가) / 주간 단독 고정 별도 협의',
      mockup: (
        <div className="w-full bg-slate-100 rounded-[32px] border border-slate-200 overflow-hidden relative shadow-inner" style={{ height: '280px' }}>

           {/* 100px 박스 내에서 50px 이미지를 object-contain으로 깔끔하게 배치 */}
           <div className="sticky top-0 z-10 w-full bg-white border-b border-slate-200 shadow-sm" style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="/nbti_sticky_50.png" className="h-full w-auto object-contain" alt="NBTI Sticky Banner" style={{ maxWidth: '375px', width: '100%' }} />
              <div className="absolute top-0 right-0 bg-slate-800/60 text-white text-[7px] font-black px-1.5 py-[2px] uppercase tracking-widest">AD</div>
           </div>
           <div className="absolute top-0 left-0 bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-br-lg z-20">375×100</div>
           
           <div className="p-4 space-y-3 mt-2">
              <div className="text-[9px] font-black text-slate-400 text-center uppercase tracking-widest mb-2">↑ 상단 100px 대형 구좌 항시 노출</div>
              <div className="w-full h-8 bg-white rounded-xl border border-slate-200 shadow-sm"/>
              <div className="w-full h-8 bg-white rounded-xl border border-slate-200 shadow-sm"/>
           </div>

           <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/80 text-white rounded-full px-3 py-1.5 text-[9px] font-bold pointer-events-none whitespace-nowrap backdrop-blur-md shadow-lg">
             📌 스크롤해도 이 100px 배너는 계속 고정
           </div>
        </div>
      )
    },
    {
      id: 'RESULT_TOP',
      name: '결과 화면 상단 (320x100)',
      tag: 'ROI',
      icon: BadgeDollarSign,
      desc: '테스트 완료 후 성격 분석 결과지가 나타날 때, 핵심 진입 버튼(NTI 개방 등) 바로 위쪽에 삽입되는 중간 삽입 배너(Interstitial)입니다. 체류시간이 가장 긴 화면이므로 노출 효과가 매우 높습니다.',
      specs: ['노출 위치: 결과 화면 상단부 (버튼 위)', '권장 포맷: Large Mobile Banner (320x100)', '특징: 긴 체류시간 활용 및 높은 인지도 상승가치'],
      price: 'CPC 400원 ~ / CPM 6,000원 ~',
      mockup: (
        <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col items-center">
           <div className="text-center mb-6"><div className="text-3xl font-black text-slate-900 mb-1">INTJ</div><div className="w-24 h-1.5 bg-slate-200 mx-auto"/></div>
           <div className="w-full aspect-[3.2/1] bg-white border border-indigo-200 shadow-sm rounded-xl flex items-center justify-center text-indigo-700 font-black text-xs relative">
              320 × 100 AD BANNER
              <div className="absolute top-1 right-1 bg-slate-200 text-slate-500 text-[6px] font-black px-1 py-0.5 rounded uppercase">AD</div>
           </div>
           <div className="w-full h-10 mt-4 bg-slate-200 rounded-lg"/>
        </div>
      )
    },
    {
      id: 'RESULT_BOTTOM',
      name: '결과 화면 하단 (320x100)',
      tag: 'CONVERSION',
      icon: BadgeDollarSign,
      desc: '모든 분석 내용과 버튼 영역(재시도 등)을 지나 화면 맨 끝에 도달했을 때 띄우는 배너입니다. 특정 MBTI를 타겟팅하여 제품 구매, 가입 등 고관여 전환을 직접적으로 이끌어내는 마무리 구좌입니다.',
      specs: ['노출 위치: 결과 화면 최하단 (모든 컨텐츠 종료 후)', '권장 포맷: Large Mobile Banner (320x100)', '특징: 정교한 MBTI 타겟팅 기반 강력한 커머스 전환'],
      price: 'CPC 400원 ~ / CPS(커머스) 별도 협의',
      mockup: (
        <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col items-center">
           <div className="w-full space-y-2 mb-4">
              <div className="w-full h-10 bg-indigo-600 rounded-lg"/>
              <div className="w-full h-10 bg-white border border-slate-200 rounded-lg"/>
           </div>
           <div className="w-full aspect-[3.2/1] bg-white border-2 border-indigo-500 shadow-md rounded-xl flex items-center justify-center text-indigo-700 font-black text-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[8px] font-black px-2 py-0.5 rounded-bl-lg">SPONSORED</div>
              320 × 100 AD BANNER
           </div>
        </div>
      )
    }
  ];

  return (
    <div className="p-10 md:p-16 max-w-[1200px] mx-auto">
      {/* HEADER */}
      <div className="mb-16 border-b border-slate-100 pb-12">
        <div className="flex items-center gap-3 text-indigo-600 font-black tracking-widest text-sm mb-4 uppercase bg-indigo-50 w-max px-4 py-1.5 rounded-full">
          <Info size={16}/> Business Media Kit
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-6 leading-[1.1]">
          NBTI 광고 상품 <br/><span className="text-indigo-600">인벤토리 가이드</span>
        </h1>
        <p className="text-slate-500 font-bold text-lg leading-relaxed max-w-[700px]">
          NBTI는 단순한 테스트를 넘어 유저의 성향 데이터를 바탕으로 <span className="text-slate-900">최적의 시점과 맥락</span>에서 브랜드 경험을 제공합니다. 아래는 광고주에게 제안 가능한 공식 구좌 구성입니다.
        </p>
      </div>

      {/* PRODUCTS LIST */}
      <div className="space-y-12">
        {products.map((product, index) => (
          <div key={product.id} className="bg-white rounded-[40px] border border-slate-200 p-8 md:p-12 flex flex-col md:flex-row gap-12 shadow-sm hover:shadow-xl transition-all duration-500 group">
            
            {/* LEFT: Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-slate-100 shadow-inner group-hover:scale-110 transition-transform">
                  <product.icon size={28}/>
                </div>
                <div>
                   <span className="text-[10px] font-black bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full mb-1 inline-block uppercase tracking-widest">{product.tag} <span className="text-indigo-300 mx-1">|</span> {product.id}</span>
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <span className="text-indigo-200 font-medium">{String(index + 1).padStart(2, '0')}.</span>
                      {product.name}
                   </h2>
                </div>
              </div>

              <p className="text-slate-600 font-bold text-sm leading-relaxed mb-10 border-l-4 border-indigo-100 pl-6">
                {product.desc}
              </p>

              <div className="space-y-6">
                 <div>
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <LayoutTemplate size={14}/> 상품 상세 스펙
                    </h3>
                    <ul className="space-y-2">
                       {product.specs.map(s => (
                         <li key={s} className="flex items-center gap-2 text-sm font-bold text-slate-800">
                           <ChevronRight size={14} className="text-indigo-500"/> {s}
                         </li>
                       ))}
                    </ul>
                 </div>

                 <div className="pt-6 border-t border-slate-100">
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <BadgeDollarSign size={14}/> 권장 단가 가이드
                    </h3>
                    <p className="text-xl font-black text-slate-900">{product.price}</p>
                 </div>
              </div>
            </div>

            {/* RIGHT: Mockup Visual */}
            <div className="w-full md:w-[350px] flex flex-col justify-center">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Implementation Mockup</h3>
               {product.mockup}
               <div className="mt-8 flex gap-3">
                  <button className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs hover:bg-slate-200 transition-all">자세히 보기</button>
                  <button className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">샘플 생성하기</button>
               </div>
            </div>

          </div>
        ))}
      </div>

      {/* FOOTER CALL TO ACTION */}
      <div className="mt-20 bg-slate-900 rounded-[48px] p-12 text-center relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"/>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"/>
         
         <h2 className="text-2xl font-black text-white mb-4 relative z-10">브랜드 협약 제안서를 준비 중이신가요?</h2>
         <p className="text-slate-400 font-bold mb-8 text-sm relative z-10">위 상품 인벤토리를 바탕으로 광고주 맞춤형 제안서를 자동 생성해 드립니다.</p>
         <button className="px-10 py-5 bg-white text-slate-950 rounded-full font-black text-sm hover:bg-indigo-50 transition-all relative z-10 shadow-xl">
           제안서 생성 도구 열기 (Beta)
         </button>
      </div>
    </div>
  );
}
