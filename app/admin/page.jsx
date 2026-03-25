'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Target, 
  Activity, 
  Clock, 
  Calendar,
  Layers as LayersIcon,
  ChevronDown,
  ChevronUp,
  Timer,
  BookOpen,
  Heart,
  Briefcase,
  Zap
} from 'lucide-react';

function QuestionAccordion({ title, group, icon: Icon = LayersIcon }) {
  const [isOpen, setIsOpen] = useState(false);
  const { items, avg, total } = group || { items: [], avg: 0, total: 0 };

  if (!items || items.length === 0) return null;

  return (
    <div className="mb-4 border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm transition-all hover:bg-slate-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-6 text-left"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2.5 rounded-xl ${isOpen ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-400'}`}>
            <Icon size={18} />
          </div>
          <div>
             <span className="font-black text-slate-800 text-lg block leading-none mb-1">{title}</span>
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{items.length}개 문항</span>
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">평균 {avg}s</span>
                <span className="text-[10px] font-bold text-slate-300">누적 {total.toLocaleString()}회 응답</span>
             </div>
          </div>
        </div>
        {isOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
      </button>

      {isOpen && (
        <div className="px-6 pb-6 bg-white border-t border-slate-50">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50">
                  <th className="py-4">문항 텍스트</th>
                  <th className="py-4 text-center">응답</th>
                  <th className="py-4 text-right">평균 고민</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.sort((a,b) => b.count - a.count).map(q => (
                  <tr key={q.id} className="group hover:bg-indigo-50/10 transition-colors">
                    <td className="py-4 text-sm font-bold text-slate-600 pr-10 leading-relaxed break-keep">
                       {q.content}
                       <span className="block text-[10px] text-slate-300 font-medium mt-1 uppercase tracking-tighter">{q.id}</span>
                    </td>
                    <td className="py-4 text-center text-slate-400 text-xs font-bold">{q.count.toLocaleString()}</td>
                    <td className="py-4 text-right">
                       <span className={`text-base font-black tracking-tighter ${parseFloat(q.avgSec) > 3.0 ? 'text-orange-500' : 'text-slate-900'}`}>
                         {q.avgSec}<span className="text-[10px] opacity-40 ml-0.5">s</span>
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function IntegratedTestDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch('/api/admin/test/dashboard', { cache: 'no-store' });
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Dashboard Load Failed:", e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) return null;

  const { metrics, types, daily, groupedQuestions, versionGrouped } = data || {};

  return (
    <div className="p-8 md:p-14 font-sans text-slate-900 mx-auto max-w-[1400px] bg-[#f8fafc] min-h-screen">
      <header className="mb-14">
        <h1 className="text-4xl font-black tracking-tighter italic uppercase text-slate-900 mb-2 leading-none">
           NBTI <span className="text-indigo-600">인텔리전스</span>
        </h1>
        <p className="text-slate-500 font-bold text-sm">MBTI 버전별 성과 및 문항 흐름 실시간 분석 대시보드</p>
      </header>

      {/* 1. 핵심 지표 */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-14">
        {[
          { label: '오늘 완료', value: metrics?.todayTests, unit: '건', color: 'text-indigo-600', icon: Users },
          { label: '평균 테스트 시간', value: metrics?.avgDurationSec, unit: '초', color: 'text-indigo-600', icon: Clock, border: true },
          { label: '평균 신뢰도', value: metrics?.avgConfidence, unit: '점', color: 'text-emerald-500', icon: Target },
          { label: '전체 누적 DB', value: metrics?.totalTests, unit: '건', color: 'text-slate-900', icon: Activity },
        ].map((m, i) => (
          <div key={i} className={`bg-white p-8 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md ${m.border ? 'border-l-8 border-l-indigo-600' : ''}`}>
            <div className="flex items-center gap-3 mb-6 text-slate-400 font-bold text-xs uppercase tracking-widest">
              <m.icon size={16} className={m.color} /> {m.label}
            </div>
            <p className={`text-5xl font-black tracking-tighter ${m.color}`}>
              {m.value?.toLocaleString() || 0}
              <span className="text-lg opacity-40 ml-2">{m.unit}</span>
            </p>
          </div>
        ))}
      </section>

      {/* 2. 분포 및 추이 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-14">
        <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-2 italic uppercase">
            <LayersIcon size={22} className="text-indigo-600" /> 버전 선호도 요약
          </h2>
          <div className="space-y-6">
             {Object.entries(types || {}).map(([type, count]) => {
               const percentage = metrics?.totalTests ? (count / metrics.totalTests * 100).toFixed(1) : 0;
               const label = { 'basic': '일반형', 'dynamic': '통합형', 'love': '연애형', 'work': '직장형' }[type] || '기타';
               return (
                 <div key={type}>
                   <div className="flex justify-between mb-2">
                     <span className="text-xs font-bold text-slate-500">{label}</span>
                     <span className="font-black text-slate-900 text-xs">{count}건 ({percentage}%)</span>
                   </div>
                   <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                     <div className={`h-full rounded-full ${type === 'dynamic' ? 'bg-indigo-600' : 'bg-slate-300'}`} style={{ width: `${percentage}%` }} />
                   </div>
                 </div>
               );
             })}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm overflow-hidden">
          <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-2 italic uppercase">
             <Calendar size={22} className="text-indigo-600" /> 일간 테스트량 추이
          </h2>
          <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="border-b border-slate-100">
                   <th className="py-4 font-black text-slate-400 text-[10px] uppercase">작업일자</th>
                   <th className="py-4 font-black text-slate-400 text-[10px] uppercase text-center">완료 건수</th>
                   <th className="py-4 font-black text-slate-400 text-[10px] uppercase text-right">평균 소요</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {daily?.map((d, i) => (
                   <tr key={d.date} className="hover:bg-slate-50 transition-colors group">
                     <td className="py-5 font-black text-slate-900 text-sm">
                       {i === 0 && <span className="bg-indigo-600 text-[8px] text-white px-1.5 py-0.5 rounded mr-2 uppercase italic">Today</span>}
                       {d.date}
                     </td>
                     <td className="py-5 text-center font-black text-indigo-600 italic text-xl">{d.count}</td>
                     <td className="py-5 text-right font-black text-slate-500 text-sm">{d.avgTime}s</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>
      </div>

      {/* 3. [신규] 테스트 버전별 문항 상세 분석 */}
      <section className="mb-20">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-900 italic uppercase flex items-center gap-3">
             <Heart size={28} className="text-pink-500" /> 테스트 버전별 상세 분석
          </h2>
          <p className="text-slate-400 font-bold mt-1">유저가 선택한 각 테스트 버전별 실제 문항 리스트와 소요 시간을 분석합니다.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {versionGrouped && Object.entries(versionGrouped).map(([key, group]) => {
             const icons = { 'basic': BookOpen, 'love': Heart, 'work': Briefcase, 'dynamic': Zap };
             return (
               <QuestionAccordion 
                 key={key} 
                 title={`${group.title} 문항 분석`} 
                 group={group} 
                 icon={icons[key]} 
               />
             );
           })}
        </div>
      </section>

      {/* 4. 심리 지표별 인게이지먼트 최적화 */}
      <section className="mb-20">
        <div className="mb-8 border-t border-slate-200 pt-16">
          <h2 className="text-3xl font-black text-slate-900 italic uppercase flex items-center gap-3">
             <Timer size={28} className="text-indigo-600" /> 심리 지표별 흐름 분석
          </h2>
          <p className="text-slate-400 font-bold mt-1">유형 구분(EI, SN...)에 따른 문항별 고민 시간을 추적합니다.</p>
        </div>

        {groupedQuestions && Object.entries(groupedQuestions).map(([title, group]) => (
          <QuestionAccordion key={title} title={title} group={group} />
        ))}
      </section>

      <footer className="text-center pb-20 border-t border-slate-100 pt-12">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] italic leading-none">
           NBTI Operational Center • v2.1 Advanced Analysis
        </p>
      </footer>
    </div>
  );
}