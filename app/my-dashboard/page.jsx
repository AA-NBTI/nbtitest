'use client';

/**
 * [파일명: app/my-dashboard/page.jsx]
 * 기능: 개인 분석 대시보드 (사이드바 메뉴 + 메인 분석 패널 구조)
 * 업데이트: 한글화 완료 및 불성실 응답(1분 미만) 판별 로직 추가
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/AuthProvider';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, LogOut, History, Zap, ShieldCheck, Activity, BrainCircuit, Timer, ChevronRight, BarChart3, AlertCircle, TrendingDown, TrendingUp, LayoutDashboard, User, Settings, Sparkles, PlusCircle, CheckCircle2, AlertTriangle
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
    <div className="min-h-screen bg-white flex items-center justify-center p-20 flex-col gap-6 font-sans">
       <div className="w-12 h-12 rounded-full border-4 border-slate-50 border-t-indigo-600 animate-spin" />
       <p className="font-black text-slate-300 animate-pulse italic uppercase tracking-[0.3em]">페르소나 분석 중...</p>
    </div>
  );
  if (!user) return null;

  const { history = [], consistency = [] } = data || {};

  // 요동성 분석 산출 (데이터가 2개 이상일 때 의미가 있음)
  const situationalTop = consistency.filter(q => q.count > 1).sort((a,b) => b.variance - a.variance).slice(0, 4);
  const stableTop = consistency.filter(q => q.count > 1).sort((a,b) => a.variance - b.variance).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex font-sans text-slate-900 overflow-hidden">
      
      {/* ───── 좌측 사이드바 (Sidebar Section) ───── */}
      <aside className="w-[300px] bg-slate-900 h-screen fixed left-0 top-0 flex flex-col p-8 z-50 text-white">
          <div className="mb-14">
             <Link href="/" className="mb-8 block">
               <h1 className="text-2xl font-black italic tracking-tighter">NBTI <span className="text-indigo-400">인텔리전스</span></h1>
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mt-1">개인 성향 분석 센터</p>
             </Link>
             
             <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 mt-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center font-black italic shadow-lg shadow-indigo-500/20">U</div>
                <div className="overflow-hidden">
                   <p className="text-[10px] font-black opacity-30 uppercase tracking-tighter leading-none mb-1">인증된 계정</p>
                   <p className="text-xs font-black truncate w-[140px] opacity-80">{user.email}</p>
                </div>
             </div>
          </div>

          <nav className="flex-1 space-y-2">
             <button 
               onClick={() => setActiveTab('insights')}
               className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${activeTab === 'insights' ? 'bg-indigo-600 shadow-xl shadow-indigo-900/40' : 'hover:bg-white/5 opacity-60'}`}
             >
                <div className="flex items-center gap-3">
                   <LayoutDashboard size={18} />
                   <span className="text-sm font-black tracking-tight">성향 인텔리전스 분석</span>
                </div>
                {activeTab === 'insights' && <div className="w-1 h-3 bg-indigo-300 rounded-full" />}
             </button>

             <button 
               onClick={() => setActiveTab('history')}
               className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${activeTab === 'history' ? 'bg-indigo-600 shadow-xl shadow-indigo-900/40' : 'hover:bg-white/5 opacity-60'}`}
             >
                <div className="flex items-center gap-3">
                   <History size={18} />
                   <span className="text-sm font-black tracking-tight">테스트 히스토리</span>
                </div>
                {activeTab === 'history' && <div className="w-1 h-3 bg-indigo-300 rounded-full" />}
             </button>
             
             <div className="h-px bg-white/10 my-8 mx-2" />
             
             <Link 
               href="/tests" 
               className="w-full flex items-center gap-3 p-4 rounded-2xl transition-all hover:bg-indigo-500 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:text-white"
             >
                <PlusCircle size={18} />
                <span className="text-sm font-black tracking-tight">새로운 테스트 시작</span>
             </Link>
          </nav>

          <div className="pt-8 mt-auto border-t border-white/5">
             <button 
               onClick={signOut}
               className="w-full flex items-center gap-3 p-4 rounded-2xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all font-black"
             >
                <LogOut size={18} />
                <span className="text-sm">로그아웃</span>
             </button>
          </div>
      </aside>

      {/* ───── 메인 콘텐츠 (Main Content Section) ───── */}
      <main className="flex-1 ml-[300px] min-h-screen p-8 lg:p-14 overflow-y-auto">
         
         <div className="max-w-[1000px] mx-auto">
            {activeTab === 'insights' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <header className="mb-12 flex justify-between items-end">
                     <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase underline decoration-indigo-200 underline-offset-8">PERSONA <span className="text-indigo-600 font-black">INSIGHTS</span></h2>
                        <p className="text-sm font-bold text-slate-400 mt-4 leading-relaxed">상황과 여건에 따라 미묘하게 변하는 당신의 무의식적 행동 패턴을 정밀 분석합니다.</p>
                     </div>
                     <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-white bg-slate-900 px-4 py-1.5 rounded-full italic uppercase shadow-lg shadow-slate-200">Total {history.length} Tests Accumulated</span>
                     </div>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
                      {/* 유동성 분석 카드 (Situational Traits) */}
                      <section className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden group hover:border-indigo-600/20 transition-all">
                         <div className="flex items-center gap-2 mb-8">
                            <TrendingUp size={20} className="text-rose-500" />
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest leading-none">상황적 가변성 (Situational)</h3>
                         </div>
                         <p className="text-[11px] font-bold text-slate-400 mb-8 leading-relaxed break-keep">기분이나 상황에 영향을 받는 지점입니다. 분산(Variance) 수치가 높을수록 외부 요인에 민감하게 반응하는 성향입니다.</p>
                         <ul className="space-y-6">
                            {situationalTop.length > 0 ? situationalTop.map(q => (
                               <li key={q.id}>
                                  <div className="flex justify-between items-center mb-2">
                                     <p className="text-[10px] font-extrabold text-slate-700 line-clamp-1 flex-1 pr-4">{q.content}</p>
                                     <span className="text-[9px] font-black text-rose-500 italic uppercase">V={q.variance}</span>
                                  </div>
                                  <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                     <div className="h-full bg-gradient-to-r from-rose-300 to-rose-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(q.variance * 20, 100)}%` }} />
                                  </div>
                               </li>
                            )) : (
                               <div className="py-12 text-center border-2 border-dashed border-slate-50 rounded-3xl bg-slate-50/20">
                                  <Sparkles className="mx-auto text-slate-200 mb-2" />
                                  <p className="text-[11px] font-black text-slate-300 uppercase tracking-tight">데이터 확보 후 분석이 시작됩니다</p>
                               </div>
                            )}
                         </ul>
                      </section>

                      {/* 확고함 분석 카드 (Stable Core) */}
                      <section className="bg-indigo-600 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
                         <div className="flex items-center gap-2 mb-8">
                            <ShieldCheck size={20} className="text-indigo-300" />
                            <h3 className="text-xs font-black uppercase tracking-widest opacity-80 leading-none">핵심 고유 성향 (Stable Core)</h3>
                         </div>
                         <p className="text-[11px] font-bold opacity-60 mb-8 leading-relaxed break-keep">어떠한 상황에서도 흔들리지 않는 당신만의 '불변의 페르소나'입니다. 당신의 근본적인 판단 기준을 나타냅니다.</p>
                         <ul className="space-y-6">
                            {stableTop.length > 0 ? stableTop.map(q => (
                               <li key={q.id}>
                                  <div className="flex justify-between items-center mb-2">
                                     <p className="text-[10px] font-extrabold line-clamp-1 flex-1 pr-4 text-white opacity-90">{q.content}</p>
                                     <span className="text-[9px] font-black text-indigo-300 italic uppercase">STABLE</span>
                                  </div>
                                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                     <div className="h-full bg-white rounded-full opacity-60" style={{ width: '100%' }} />
                                  </div>
                               </li>
                            )) : <p className="text-[11px] font-bold opacity-30 text-center py-10">2회 이상 테스트가 필요합니다</p>}
                         </ul>
                         <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                      </section>
                  </div>

                  {/* 행동 상세 매트릭스 (Behavioral Detail Matrix) */}
                  <section className="bg-white border-2 border-slate-50 rounded-[3rem] p-10 overflow-hidden shadow-sm">
                     <div className="flex justify-between items-center mb-10">
                        <div>
                           <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                              <Activity size={20} className="text-indigo-600" /> Behavioral Detail Matrix
                           </h3>
                           <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter italic">문항별 정밀 응답 분석 결과</p>
                        </div>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px]">
                           <thead>
                              <tr className="border-b border-slate-100">
                                 <th className="py-4 font-black text-slate-300 uppercase tracking-tighter">문항 분석 상세</th>
                                 <th className="py-4 font-black text-slate-300 uppercase px-6">평균 성향 강도</th>
                                 <th className="py-4 font-black text-slate-300 uppercase text-center">성향 분류</th>
                                 <th className="py-4 font-black text-slate-300 uppercase text-right px-4">평균 숙고 시간</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-50">
                              {consistency.length > 0 ? consistency.map(q => (
                                <tr key={q.id} className="hover:bg-slate-50 transition-colors group">
                                   <td className="py-6 font-bold text-slate-800 break-keep max-w-[400px] leading-relaxed pr-8">{q.content}</td>
                                   <td className="py-6 px-6 font-black text-indigo-600 italic text-base">
                                      <div className="flex items-center gap-2">
                                         {q.avg}
                                         <div className="w-2 h-2 rounded-full bg-indigo-100" />
                                      </div>
                                   </td>
                                   <td className="py-6 text-center">
                                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${parseFloat(q.variance) > 1.2 ? 'bg-pink-100 text-pink-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                         {parseFloat(q.variance) > 1.2 ? 'Fluid Pattern' : 'Stable Core'}
                                      </span>
                                   </td>
                                   <td className="py-6 text-right font-black text-slate-300 italic px-4">{q.avgTimeSec}s</td>
                                 </tr>
                              )) : (
                                <tr>
                                   <td colSpan="4" className="py-24 text-center font-black text-slate-200 uppercase tracking-widest">분석된 문항 데이터가 없습니다</td>
                                </tr>
                              )}
                           </tbody>
                        </table>
                     </div>
                  </section>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <header className="mb-12">
                     <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none underline decoration-indigo-200 underline-offset-8">PERSONA <span className="text-indigo-600 font-black">CHRONICLES</span></h2>
                     <p className="text-sm font-bold text-slate-400 mt-6 leading-relaxed">시간에 따른 성향 변화와 데이터 신뢰도를 추적합니다.</p>
                  </header>

                  <div className="space-y-6">
                     {history.length > 0 ? history.map((res, i) => {
                       const isRealUser = (res.total_time_ms || 0) >= 60000;
                       
                       return (
                        <div 
                          key={res.session_id} 
                          className="bg-white border border-slate-100 p-8 rounded-[2.5rem] flex flex-wrap items-center justify-between group hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-300 relative"
                        >
                           <div className="flex items-center gap-8">
                              <div className="text-center w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-200 text-xl italic group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                 {history.length - i}
                              </div>
                              <div>
                                 <div className="flex items-center gap-3 mb-1">
                                    <h4 className="text-3xl font-black italic tracking-tighter leading-none">{res.mbti_type}</h4>
                                    {isRealUser ? (
                                       <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-tighter">
                                          <CheckCircle2 size={10} /> Real User Certified
                                       </span>
                                    ) : (
                                       <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-tighter">
                                          <AlertTriangle size={10} /> Rapid Response Check
                                       </span>
                                    )}
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{res.created_at.split('T')[0]}</p>
                                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter italic">Time: {(res.total_time_ms / 1000).toFixed(0)}s</p>
                                 </div>
                              </div>
                           </div>
                           
                           <div className="flex items-center gap-10 mt-6 sm:mt-0">
                              <div className="text-right">
                                 <p className="text-[10px] font-black text-slate-300 uppercase leading-none mb-2 tracking-tighter">인텔리전스 스코어</p>
                                 <p className="text-3xl font-black italic text-indigo-600 leading-none">{res.nti_score}%</p>
                              </div>
                              <button 
                                onClick={() => router.push(`/results/${res.mbti_type}?score=${res.nti_score}&grade=${res.nti_grade}&testType=${res.test_type}`)}
                                className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 group-hover:shadow-indigo-500/20"
                              >
                                 <ChevronRight size={24} />
                              </button>
                           </div>
                        </div>
                       );
                     }) : (
                        <div className="py-24 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                           <History size={48} className="mx-auto text-slate-200 mb-6" strokeWidth={1} />
                           <p className="font-black text-slate-300 uppercase tracking-widest text-xs italic">데이터 축적 전입니다</p>
                        </div>
                     )}
                  </div>
              </div>
            )}
         </div>

         <footer className="mt-24 text-center pb-20 opacity-30 border-t border-slate-50 pt-20">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">NBTI Intelligence Hub • Personal Analytics v3.2</p>
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
