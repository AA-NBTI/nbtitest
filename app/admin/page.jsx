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
  Zap,
  Filter,
  CheckCircle2,
  AlertCircle,
  LayoutDashboard,
  BrainCircuit,
  TrendingUp
} from 'lucide-react';

function QuestionAccordion({ title, group, icon: Icon = LayersIcon }) {
  const [isOpen, setIsOpen] = useState(false);
  const { items, avg, total } = group || { items: [], avg: 0, total: 0 };
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-4 border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm transition-all hover:bg-slate-50">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-6 text-left">
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
                {items.sort((a,b) => parseFloat(b.avgSec) - parseFloat(a.avgSec)).map(q => (
                  <tr key={q.id} className="group hover:bg-indigo-50/10 transition-colors">
                    <td className="py-4 text-sm font-bold text-slate-600 pr-10 leading-relaxed break-keep">
                       {q.content}
                       <span className="block text-[10px] text-slate-300 font-medium mt-1 uppercase tracking-tighter">{q.id}</span>
                    </td>
                    <td className="py-4 text-center text-slate-400 text-xs font-bold">{q.count.toLocaleString()}</td>
                    <td className="py-4 text-right pr-2">
                       <span className={`text-base font-black tracking-tighter ${parseFloat(q.avgSec) > 3.0 ? 'text-orange-500' : 'text-slate-900'}`}>{q.avgSec}s</span>
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
  const [realOnly, setRealOnly] = useState(true); 
  const [activeTab, setActiveTab] = useState('version'); 

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/test/dashboard?realOnly=${realOnly}`, { cache: 'no-store' });
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Dashboard Load Failed:", e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [realOnly]);

  if (loading && !data) return <div className="p-20 text-center font-bold text-slate-300 animate-pulse uppercase italic tracking-[0.2em]">NBTI 인텔리전스 로딩 중...</div>;

  const { metrics, types, daily, hourly, groupedQuestions, versionGrouped, summary } = data || {};

  return (
    <div className="p-8 md:p-14 font-sans text-slate-900 mx-auto max-w-[1400px] bg-[#f8fafc] min-h-screen">
      <header className="mb-14 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter italic uppercase text-slate-900 mb-2 leading-none">
             NBTI <span className="text-indigo-600">인텔리전스</span>
          </h1>
          <p className="text-slate-500 font-bold text-sm">실제 유저 성향 및 고도화된 문항 인게이지먼트 센터</p>
        </div>

        <div className="bg-white p-2 border border-slate-200 rounded-2xl flex items-center shadow-sm transition-all hover:border-indigo-100">
           <button 
             onClick={() => setRealOnly(true)}
             className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${realOnly ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400'}`}
           >
             <CheckCircle2 size={14} /> 실사용자 (60s+)
           </button>
           <button 
             onClick={() => setRealOnly(false)}
             className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${!realOnly ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}
           >
             <AlertCircle size={14} /> 실험/전체 데이터
           </button>
        </div>
      </header>

      {/* 카테고리 탭 (요청된 위치) */}
      <section className="mb-14 flex gap-4 border-b border-slate-100 pb-0">
         <button 
           onClick={() => setActiveTab('version')}
           className={`px-8 py-5 text-sm font-black italic uppercase flex items-center gap-3 transition-all border-b-4 ${activeTab === 'version' ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-3xl shadow-sm' : 'border-transparent text-slate-300 hover:text-slate-400'}`}
         >
           <LayoutDashboard size={18} /> 버전별 상세 분석
         </button>
         <button 
           onClick={() => setActiveTab('axis')}
           className={`px-8 py-5 text-sm font-black italic uppercase flex items-center gap-3 transition-all border-b-4 ${activeTab === 'axis' ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-3xl shadow-sm' : 'border-transparent text-slate-300 hover:text-slate-400'}`}
         >
           <BrainCircuit size={18} /> 심리 지표별 흐름 분석
         </button>
      </section>

      <div className="bg-white/50 rounded-[48px] p-2 md:p-10 mb-20 border border-slate-100">
        
        {/* 핵심 지표 */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-14">
            {[
            { label: '오늘 완료', value: metrics?.todayTests, unit: '건', color: 'text-indigo-600', icon: Users },
            { label: '평균 테스트 시간', value: metrics?.avgDurationSec, unit: '초', color: 'text-indigo-600', icon: Clock, border: true },
            { label: '평균 신뢰도', value: metrics?.avgConfidence, unit: '점', color: 'text-emerald-500', icon: Target },
            { label: '누적 DB', value: metrics?.totalTests, unit: '건', color: 'text-slate-900', icon: Activity },
            ].map((m, i) => (
            <div key={i} className={`bg-white p-8 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md ${m.border ? 'border-l-8 border-l-indigo-600' : ''}`}>
                <div className="flex items-center gap-3 mb-6 text-slate-400 font-bold text-xs uppercase tracking-widest">
                <m.icon size={16} className={m.color} /> {m.label}
                </div>
                <p className={`text-4xl font-black tracking-tighter ${m.color}`}>
                {m.value?.toLocaleString() || 0}
                <span className="text-lg opacity-40 ml-2">{m.unit}</span>
                </p>
            </div>
            ))}
        </section>

        {activeTab === 'version' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             
             {/* 분포 및 시간대 분석 */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
               {/* 버전 선호도 */}
               <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm flex flex-col justify-between">
                  <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2 italic uppercase">
                    <LayersIcon size={20} className="text-indigo-600" /> 버전 선호도 요약
                  </h2>
                  <div className="space-y-6">
                    {Object.entries(types || {}).map(([type, count]) => {
                      const percentage = metrics?.totalTests ? (count / metrics.totalTests * 100).toFixed(1) : 0;
                      const label = { 'basic': '일반형', 'dynamic': '통합형', 'love': '연애형', 'work': '직장형' }[type] || '기타';
                      return (
                        <div key={type}>
                          <div className="flex justify-between mb-2">
                            <span className="text-[11px] font-bold text-slate-500">{label}</span>
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

               {/* [신규] 시간대별 피크 타임 분석 */}
               <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm">
                  <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2 italic uppercase">
                    <TrendingUp size={20} className="text-indigo-600" /> 이용 시간대별 분포 (Hourly Peak)
                  </h2>
                  <div className="flex items-end justify-between h-48 gap-1 pt-10">
                     {hourly?.map((count, hour) => {
                       const maxCount = Math.max(...hourly);
                       const height = maxCount > 0 ? (count / maxCount * 100) : 0;
                       return (
                         <div key={hour} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                            <div 
                              className={`w-full rounded-t-sm transition-all group-hover:bg-indigo-600 ${count > 0 ? 'bg-indigo-300' : 'bg-slate-50'}`} 
                              style={{ height: `${height}%` }}
                            />
                            {count > 0 && (
                              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                {hour}시: {count}건
                              </div>
                            )}
                            <span className="text-[8px] font-black text-slate-300 mt-2 block transform scale-90">{hour}</span>
                         </div>
                       );
                     })}
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold mt-4 text-center">0시부터 23시까지 유저들이 가장 많이 방문하는 피크 타임을 분석합니다.</p>
               </div>
             </div>

             {/* 버전별 아코디언 */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {versionGrouped && Object.values(versionGrouped).some(g => g.items.length > 0) ? (
                    Object.entries(versionGrouped).map(([key, group]) => {
                    const icons = { 'basic': BookOpen, 'love': Heart, 'work': Briefcase, 'dynamic': Zap };
                    return (
                        <QuestionAccordion key={key} title={`${group.title} 문항 분석`} group={group} icon={icons[key]} />
                    );
                    })
                ) : (
                    <div className="col-span-2 py-12 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                        <p className="text-slate-400 font-bold text-sm">해당 모드의 버전별 상세 데이터가 아직 수집되지 않았습니다.</p>
                    </div>
                )}
             </div>
          </div>
        )}

        {activeTab === 'axis' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="mb-10 p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100">
                <p className="text-indigo-600 font-bold text-sm flex items-center gap-2 uppercase italic tracking-widest">
                   <Target size={16} /> Psychometric Analysis Mode
                </p>
                <p className="text-slate-500 text-xs mt-1 font-medium">유형 지표에 따른 유저들의 문항 몰입 흐름을 분석합니다.</p>
             </div>
             {groupedQuestions && Object.values(groupedQuestions).some(g => g.items.length > 0) ? (
                Object.entries(groupedQuestions).map(([title, group]) => (
                    <QuestionAccordion key={title} title={title} group={group} />
                ))
                ) : (
                <div className="py-20 text-center bg-white rounded-3xl border border-slate-100">
                    <div className="mb-4 flex justify-center"><Filter size={40} className="text-slate-200" /></div>
                    <p className="text-slate-400 font-bold italic">조건에 맞는 정밀 분석 데이터가 아직 없습니다.</p>
                </div>
             )}
          </div>
        )}
      </div>

      <footer className="text-center pb-20 border-t border-slate-100 pt-12">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] italic leading-none">
           NBTI Operational Center • v2.4 Temporal Insight Tracking
        </p>
      </footer>
    </div>
  );
}