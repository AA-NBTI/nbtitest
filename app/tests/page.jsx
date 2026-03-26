'use client';

/**
 * [파일명: app/tests/page.jsx]
 * 기능: 고성능 미니멀리즘 성향 분석 버전 선택 페이지 (다크 그레이 & 슬레이트 테마)
 */

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, ChevronRight, Activity, Zap, Target
} from 'lucide-react';

const TEST_VERSIONS = [
  {
    id: 'basic',
    title: 'NBTI 정밀형 (Basic)',
    desc: '가장 표준화된 문항으로 당신의 핵심 자아를 분석합니다.',
    tag: '표준형',
    icon: Activity
  },
  {
    id: 'love',
    title: '연애 성향형 (Love)',
    desc: '연인 관계에서의 행동 패턴과 애착 유형을 집중 분석합니다.',
    tag: '관계형',
    icon: Target
  },
  {
    id: 'work',
    title: '직장/커리어형 (Work)',
    desc: '업무 상황에서의 결정 방식과 리더십 스타일을 확인하세요.',
    tag: '사회형',
    icon: Zap
  }
];

export default function TestsListPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center pt-[80px] pb-20 px-8 font-sans text-slate-900">
      <div className="max-w-[440px] mx-auto">
        
        <header className="mb-20 text-center">
          <Link href="/my-dashboard" className="inline-flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-12 hover:text-slate-900 transition-all bg-white/80 backdrop-blur-md px-6 py-2.5 rounded-full border border-slate-100 shadow-sm hover:shadow-md">
            <ArrowLeft size={14} /> 대시보드로 돌아가기
          </Link>
          
          <div className="mb-4">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-3 leading-none">
              Dimension Selection
            </p>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
               분석 버전 <span className="text-slate-400">선택</span>
            </h1>
          </div>
          <p className="text-sm font-bold text-slate-400 mt-6 break-keep leading-relaxed">분석하고 싶은 당신의 세부 성향 테마를 선택하세요. 모든 데이터는 암호화되어 보호됩니다.</p>
        </header>

        <div className="flex flex-col gap-4">
          {TEST_VERSIONS.map((test) => (
            <Link 
              key={test.id} 
              href={`/${test.id}`}
              className="group bg-white border border-slate-100 p-7 rounded-[2rem] hover:border-slate-900 transition-all duration-500 flex items-center justify-between shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 active:scale-[0.98] relative overflow-hidden"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-slate-900 group-hover:bg-slate-100 transition-colors">
                  <test.icon size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white uppercase tracking-tighter">{test.tag}</span>
                    <h3 className="text-base font-black text-slate-900">{test.title}</h3>
                  </div>
                  <p className="text-[12px] font-bold text-slate-400 break-keep leading-snug pr-4">{test.desc}</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-200 group-hover:text-slate-900 transition-colors flex-shrink-0" />
            </Link>
          ))}

          <div className="mt-12 pt-12 border-t border-slate-100 text-center">
             <div className="flex justify-center gap-1 mb-6">
                {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-slate-200 rounded-full" />)}
             </div>
             <p className="text-[9px] font-black text-slate-200 uppercase tracking-[0.5em] leading-none mb-1">
                More Contexts Coming Soon
             </p>
          </div>
        </div>

        <footer className="mt-24 text-center">
           <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-200">NBTI Dimension Selector • v2.4.1</p>
        </footer>
      </div>
    </div>
  );
}
