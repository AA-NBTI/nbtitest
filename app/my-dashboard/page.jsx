'use client';

/**
 * [파일명: app/my-dashboard/page.jsx]
 * 기능: 개인 분석 대시보드 (미니멀리즘 강화 및 전수 한글화)
 * 업데이트: 영문 헤더 제거, 애니메이션 삭제, 홈 버튼 배치
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/AuthProvider';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, LogOut, History, Zap, ShieldCheck, Activity, BrainCircuit, Timer, ChevronRight, BarChart3, AlertCircle, TrendingDown, TrendingUp, LayoutDashboard, User, Settings, Sparkles, PlusCircle, CheckCircle2, AlertTriangle, Fingerprint, Home
} from 'lucide-react';
import Link from 'next/link';

export default function MyDashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('insights');
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading]);

  useEffect(() => {
    async function loadStats() {
      if (!user) return;
      try {
        const res = await fetch(`/api/user/my-stats?userId=${user.id}`, { cache: 'no-store' });
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [user]);

  if (authLoading || loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center p-20 flex-col gap-4 font-sans text-center">
       <div className="w-8 h-8 rounded-full border-2 border-slate-100 border-t-indigo-600 animate-spin" />
       <p className="font-bold text-slate-300 italic tracking-widest text-[10px] uppercase">Persona Analysis...</p>
    </div>
  );
  if (!user) return null;

  const { history = [], consistency = [] } = data || {};

  const situationalTop = consistency.filter(q => q.count > 1).sort((a,b) => b.variance - a.variance).slice(0, 4);
  const stableTop = consistency.filter(q => q.count > 1).sort((a,b) => a.variance - b.variance).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex font-sans text-slate-900 overflow-hidden">
      
      {/* ───── 최상단 네비게이션 바 (Top Header) ───── */}
      <header className="h-16 bg-white border-b border-slate-100 fixed top-0 left-0 right-0 z-[60] flex items-center px-6">
         <Link href="/" className="flex items-center gap-2 group transition-all hover:scale-105">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
               <Home size={18} strokeWidth={3} />
            </div>
            <span className="text-lg font-black tracking-tighter text-slate-900 uppercase italic">NBTI <span className="text-indigo-600">Hub</span></span>
         </Link>
         
         <div className="ml-auto flex items-center gap-4">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest hidden sm:block">Member Dashboard</p>
            <div className="w-px h-4 bg-slate-100 mx-2" />
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
               <User size={14} className="text-indigo-400" />
               {user.email}
            </div>
         </div>
      </header>
      
      {/* ───── 좌측 사이드바 (Sidebar Section) ───── */}
      <aside className="w-[280px] bg-white border-r border-slate-100 h-screen fixed left-0 top-0 flex flex-col p-8 pt-24 z-50">
          
          <div className="mb-12">
             <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center font-black text-xs text-indigo-600 border border-slate-100 italic shadow-sm">U</div>
                <div className="overflow-hidden">
                   <p className="text-[10px] font-black opacity-30 uppercase tracking-tighter leading-none mb-1">Authenticated</p>
                   <p className="text-[11px] font-bold truncate w-[140px] text-slate-600">{user.email}</p>
                </div>
             </div>
          </div>

          <nav className="flex-1 space-y-1.5">
             <button 
               onClick={() => setActiveTab('insights')}
               className={`w-full flex items-center justify-between p-4 rounded-xl transition-all group ${activeTab === 'insights' ? 'bg-indigo-50 text-indigo-600 font-black' : 'hover:bg-slate-50 opacity-60 text-slate-400'}`}
             >
                <div className="flex items-center gap-3">
                   <BarChart3 size={18} strokeWidth={2.5} />
                   <span className="text-sm tracking-tight">성향 분석</span>
                </div>
                {activeTab === 'insights' && <div className="w-1 h-3 bg-indigo-600 rounded-full" />}
             </button>

             <button 
               onClick={() => setActiveTab('history')}
               className={`w-full flex items-center justify-between p-4 rounded-xl transition-all group ${activeTab === 'history' ? 'bg-indigo-50 text-indigo-600 font-black' : 'hover:bg-slate-50 opacity-60 text-slate-400'}`}
             >
                <div className="flex items-center gap-3">
                   <History size={18} strokeWidth={2.5} />
                   <span className="text-sm tracking-tight">테스트 이력</span>
                </div>
                {activeTab === 'history' && <div className="w-1 h-3 bg-indigo-600 rounded-full" />}
             </button>
             
             <div className="h-px bg-slate-100 my-6 mx-2" />
             
             <Link 
               href="/tests" 
               className="w-full flex items-center gap-3 p-4 rounded-xl transition-all bg-slate-900 text-white font-black hover:bg-indigo-600 shadow-xl shadow-slate-200"
             >
                <PlusCircle size={18} strokeWidth={2.5} />
                <span className="text-sm tracking-tight">새 테스트 시작</span>
             </Link>
          </nav>

          <div className="pt-8 mt-auto border-t border-slate-100">
             <button 
               onClick={signOut}
               className="w-full flex items-center gap-3 p-4 rounded-xl text-slate-400 hover:text-rose-500 transition-all font-bold"
             >
                <LogOut size={18} />
                <p className="text-xs">로그아웃</p>
             </button>
          </div>
      </aside>

      {/* ───── 메인 콘텐츠 (Main Content Section) ───── */}
      <main className="flex-1 ml-[280px] min-h-screen p-8 lg:p-14 overflow-y-auto bg-white">
         
         <div className="max-w-[1000px] mx-auto">
            {activeTab === 'insights' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                  <header className="mb-14">
                     <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">성향 분석 <span className="text-indigo-600">리포트</span></h2>
                     <p className="text-sm font-bold text-slate-400 mt-4 leading-relaxed">환경 변화에 따른 당신의 무의식적 반응을 정밀 분석한 결과입니다.</p>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                      <section className="bg-slate-50/50 border border-slate-100 p-10 rounded-[2rem] relative overflow-hidden group">
                         <div className="flex items-center gap-2 mb-8">
                            <TrendingUp size={18} className="text-rose-500" />
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest leading-none">상황적 가변성</h3>
                         </div>
                         <p className="text-[11px] font-bold text-slate-400 mb-8 leading-relaxed break-keep">상황이나 기분에 따라 답변이 가장 크게 바뀌는 영역입니다. 분산 값이 높을수록 유연한 반응을 보입니다.</p>
                         <ul className="space-y-6">
                            {situationalTop.length > 0 ? situationalTop.map(q => (
                               <li key={q.id}>
                                  <div className="flex justify-between items-center mb-2">
                                     <p className="text-[10px] font-extrabold text-slate-600 line-clamp-1 flex-1 pr-4">{q.content}</p>
                                     <span className="text-[9px] font-black text-rose-500 italic uppercase">V={q.variance}</span>
                                  </div>
                                  <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                                     <div className="h-full bg-rose-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(q.variance * 20, 100)}%` }} />
                                  </div>
                               </li>
                            )) : (
                               <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                                  <Fingerprint className="mx-auto text-slate-100 mb-2" />
                                  <p className="text-[10px] font-black text-slate-200 uppercase tracking-widest italic">Insufficient Data</p>
                               </div>
                            )}
                         </ul>
                      </section>

                      <section className="bg-slate-900 p-10 rounded-[2rem] text-white relative overflow-hidden group">
                         <div className="flex items-center gap-2 mb-8">
                            <ShieldCheck size={18} className="text-indigo-400" />
                            <h3 className="text-xs font-black uppercase tracking-widest opacity-80 leading-none">핵심 고유 성향</h3>
                         </div>
                         <p className="text-[11px] font-bold opacity-40 mb-8 leading-relaxed break-keep">환경에 관계없이 일관성 있는 당신의 고정 성향입니다. 본질적인 성격적 기반을 보여줍니다.</p>
                         <ul className="space-y-6">
                            {stableTop.length > 0 ? stableTop.map(q => (
                               <li key={q.id}>
                                  <div className="flex justify-between items-center mb-2">
                                     <p className="text-[10px] font-extrabold line-clamp-1 flex-1 pr-4 text-white/80">{q.content}</p>
                                     <span className="text-[9px] font-black text-indigo-400 italic uppercase tracking-widest">STABLE</span>
                                  </div>
                                  <div className="h-1 bg-white/10 rounded-full overflow-hidden shadow-inner">
                                     <div className="h-full bg-indigo-400 rounded-full" style={{ width: '100%' }} />
                                  </div>
                               </li>
                            )) : <p className="text-[10px] font-black opacity-10 text-center py-10 tracking-[0.3em] uppercase">No Record</p>}
                         </ul>
                      </section>
                  </div>

                  {/* 행동 매트릭스 */}
                  <section className="bg-white border-y border-slate-100 py-14 overflow-hidden">
                     <div className="mb-10">
                           <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                              <Activity size={18} className="text-indigo-600" /> Behavioral Matrix
                           </h3>
                           <p className="text-[10px] font-bold text-slate-300 mt-2 uppercase tracking-widest italic">문항별 정밀 응답 및 시간 추적 데이터</p>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px]">
                           <thead>
                              <tr className="border-b border-slate-50">
                                 <th className="py-4 font-black text-slate-200 uppercase tracking-tighter">분석 문항</th>
                                 <th className="py-4 font-black text-slate-200 uppercase px-6">평균 응답</th>
                                 <th className="py-4 font-black text-slate-200 uppercase text-center">성향 분류</th>
                                 <th className="py-4 font-black text-slate-200 uppercase text-right px-4">숙고 시간</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-50">
                              {consistency.length > 0 ? consistency.map(q => (
                                <tr key={q.id} className="hover:bg-slate-50 transition-colors group">
                                   <td className="py-5 font-bold text-slate-700 break-keep max-w-[400px] leading-relaxed pr-8">{q.content}</td>
                                   <td className="py-5 px-6 font-black text-indigo-600 italic text-sm">
                                      {q.avg} <span className="text-slate-200 ml-1">/ 7</span>
                                   </td>
                                   <td className="py-5 text-center">
                                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${parseFloat(q.variance) > 1.2 ? 'bg-indigo-50 text-indigo-600' : 'text-slate-300'}`}>
                                         {parseFloat(q.variance) > 1.2 ? 'Fluid Pattern' : 'Core Pattern'}
                                      </span>
                                   </td>
                                   <td className="py-5 text-right font-black text-slate-200 italic px-4 uppercase tracking-tighter">{q.avgTimeSec}s</td>
                                 </tr>
                              )) : (
                                <tr>
                                   <td colSpan="4" className="py-24 text-center font-black text-slate-100 uppercase tracking-widest italic">No Data</td>
                                </tr>
                              )}
                           </tbody>
                        </table>
                     </div>
                  </section>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                  <header className="mb-14">
                     <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">테스트 <span className="text-indigo-600">이력</span></h2>
                     <p className="text-sm font-bold text-slate-400 mt-4 leading-relaxed">지금까지 수행한 정밀 분석 데이터와 신뢰도 추적 결과입니다.</p>
                  </header>

                  <div className="space-y-4">
                     {history.length > 0 ? history.map((res, i) => {
                       const isRealUser = (res.total_time_ms || 0) >= 60000;
                       
                       return (
                        <div 
                          key={res.session_id} 
                          className="bg-slate-50/30 border border-slate-100 p-8 rounded-[1.5rem] flex flex-wrap items-center justify-between group hover:border-indigo-600/30 transition-all duration-300 relative"
                        >
                           <div className="flex items-center gap-8">
                              <div className="text-center w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-black text-slate-200 text-lg italic group-hover:text-indigo-600 transition-colors">
                                 {history.length - i}
                              </div>
                              <div>
                                 <div className="flex items-center gap-3 mb-1">
                                    <h4 className="text-2xl font-black italic tracking-tighter leading-none text-slate-800">{res.mbti_type}</h4>
                                    
                                    {isRealUser ? (
                                       <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 italic">
                                          <CheckCircle2 size={10} strokeWidth={3} />
                                          <span className="text-[9px] font-black uppercase tracking-tighter">정상 응답 인증</span>
                                       </div>
                                    ) : (
                                       <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 italic">
                                          <AlertTriangle size={10} strokeWidth={3} />
                                          <span className="text-[9px] font-black uppercase tracking-tighter">불성실 의심</span>
                                       </div>
                                    )}
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{res.created_at.split('T')[0]}</p>
                                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                                    <p className="text-[10px] font-bold text-slate-400 italic">{(res.total_time_ms / 1000).toFixed(0)}초 소요</p>
                                 </div>
                              </div>
                           </div>
                           
                           <div className="flex items-center gap-10 mt-6 sm:mt-0">
                              <div className="text-right">
                                 <p className="text-[10px] font-black text-slate-200 uppercase leading-none mb-2 tracking-tighter italic">SCORE</p>
                                 <p className="text-2xl font-black italic text-indigo-400 leading-none">{res.nti_score}%</p>
                              </div>
                              <button 
                                onClick={() => router.push(`/results/${res.mbti_type}?score=${res.nti_score}&grade=${res.nti_grade}&testType=${res.test_type}`)}
                                className="w-12 h-12 bg-white border border-slate-100 text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all active:scale-95"
                              >
                                 <ChevronRight size={22} strokeWidth={3} />
                              </button>
                           </div>
                        </div>
                       );
                     }) : (
                        <div className="py-24 text-center border-2 border-dashed border-slate-50 rounded-[2rem]">
                           <History size={40} className="mx-auto text-slate-100 mb-4" strokeWidth={1} />
                           <p className="font-bold text-slate-200 text-xs italic tracking-widest uppercase">No Chronic Data</p>
                        </div>
                     )}
                  </div>
              </div>
            )}
         </div>

         <footer className="mt-40 text-center pb-20 opacity-20 border-t border-slate-50 pt-20">
            <p className="text-[9px] font-bold tracking-[0.5em] text-slate-400">NBTI Intelligence Hub • v4.0 Minimalist Edition</p>
         </footer>
      </main>

      <style jsx>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #fcfdfe; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
      `}</style>
    </div>
  );
}
