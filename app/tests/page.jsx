'use client';

/**
 * [파일명: app/tests/page.jsx]
 * 기능: 사용자가 선택할 수 있는 모든 테스트 버전 리스트 노출
 */

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Heart, Briefcase, Sparkles, Zap, ChevronRight, LayoutDashboard, BrainCircuit
} from 'lucide-react';

const TEST_VERSIONS = [
  {
    id: 'basic',
    title: 'NBTI 정밀형 (Basic)',
    desc: '가장 표준화된 28문항으로 당신의 핵심 자아를 분석합니다.',
    color: 'bg-indigo-600',
    icon: BrainCircuit,
    tag: '표준형'
  },
  {
    id: 'love',
    title: '연애 성향형 (Love)',
    desc: '연인 관계에서의 행동 패턴과 애착 유형을 집중 분석합니다.',
    color: 'bg-rose-500',
    icon: Heart,
    tag: '관계형'
  },
  {
    id: 'work',
    title: '직장/커리어형 (Work)',
    desc: '업무 상황에서의 결정 방식과 리더십 스타일을 확인하세요.',
    color: 'bg-emerald-600',
    icon: Briefcase,
    tag: '사회형'
  }
];

export default function TestsListPage() {
  return (
    <div className="min-h-screen bg-[#fcfdfe] p-8 md:p-20 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-14">
          <Link href="/my-dashboard" className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-8 hover:text-black transition-colors">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">CHOOSE YOUR <span className="text-indigo-600">DIMENSION</span></h1>
          <p className="text-sm font-bold text-slate-400 mt-2">분석하고 싶은 당신의 모습을 선택하세요.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TEST_VERSIONS.map((test) => (
            <Link 
              key={test.id} 
              href={`/${test.id}`}
              className="group bg-white border border-slate-100 p-8 rounded-[2.5rem] hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300 flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-3xl ${test.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <test.icon size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 uppercase tracking-tighter">{test.tag}</span>
                    <h3 className="text-lg font-black text-slate-900">{test.title}</h3>
                  </div>
                  <p className="text-xs font-medium text-slate-400 break-keep">{test.desc}</p>
                </div>
              </div>
              <ChevronRight size={24} className="text-slate-100 group-hover:text-indigo-600 transition-colors" />
            </Link>
          ))}

          {/* 추가 예정 플레이스홀더 */}
          <div className="bg-slate-50 border-2 border-dashed border-slate-100 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center opacity-40">
             <Sparkles size={24} className="text-slate-300 mb-2" />
             <p className="text-xs font-black text-slate-300 uppercase italic">More Dimensions Coming Soon</p>
          </div>
        </div>

        <footer className="mt-20 text-center opacity-20">
           <p className="text-[9px] font-black uppercase tracking-[0.4em]">NBTI Dimension Selector • v2.1</p>
        </footer>
      </div>
    </div>
  );
}
