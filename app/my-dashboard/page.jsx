'use client';

/**
 * [파일명: app/my-dashboard/page.jsx]
 * 기능: 개인 분석 대시보드 (사이드바 메뉴 + 메인 분석 패널 구조)
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/AuthProvider';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, LogOut, History, Zap, ShieldCheck, Activity, BrainCircuit, Timer, ChevronRight, BarChart3, AlertCircle, TrendingDown, TrendingUp, LayoutDashboard, User, Settings, Sparkles, PlusCircle
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
       <p className="font-black text-slate-300 animate-pulse italic uppercase tracking-[0.3em]">Analyzing Persona...</p>
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
               <h1 className="text-2xl font-black italic tracking-tighter">NBTI <span className="text-indigo-400">AGENT</span></h1>
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mt-1">Personal Intelligence Center</p>
             </Link>
             
             <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 mt-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center font-black italic">U</div>
                <div>
                   <p className="text-[10px] font-black opacity-30 uppercase tracking-tighter leading-none mb-1">Authenticated Account</p>
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
                   <span className="text-sm font-black">내 성향 인텔리전스</span>
                </div>
                {activeTab === 'insights' && <div className="w-1 h-3 bg-white/40 rounded-full" />}
             </button>

             <button 
               onClick={() => setActiveTab('history')}
               className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${activeTab === 'history' ? 'bg-indigo-600 shadow-xl shadow-indigo-900/40' : 'hover:bg-white/5 opacity-60'}`}
             >
                <div className="flex items-center gap-3">
                   <History size={18} />
                   <span className="text-sm font-black">테스트 히스토리</span>
                </div>
                {activeTab === 'history' && <div className="w-1 h-3 bg-white/40 rounded-full" />}
             </button>
             
             <div className="h-px bg-white/10 my-8 mx-2" />
             
             <Link 
               href="/basic" 
               className="w-full flex items-center gap-3 p-4 rounded-2xl transition-all hover:bg-white/5 bg-indigo-50/5 border border-indigo-500/20 text-indigo-300"
             >
                <PlusCircle size={18} />
                <span className="text-sm font-black">새로운 테스트 시작</span>
             </Link>
          </nav>

          <div className="pt-8 mt-auto border-t border-white/5">
             <button 
               onClick={signOut}
               className="w-full flex items-center gap-3 p-4 rounded-2xl text-rose-400 hover:bg-rose-500/10 transition-all font-black"
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
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">PERSONA <span className="text-indigo-600">INSIGHTS</span></h2>
                        <p className="text-sm font-bold text-slate-400 mt-1">상황별로 요동치는 당신의 행동 패턴을 정밀 분석합니다.</p>
                     </div>
                     <span className="text-[10px] font-black text-white bg-slate-900 px-4 py-1 rounded-full italic uppercase">Total {history.length} Tests</span>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
                      {/* 일관성 분석 카드 */}
                      <section className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
                         <div className="flex items-center gap-2 mb-8">
                            <TrendingUp size={18} className="text-rose-500" />
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Situational Traits (유동성)</h3>
                         </div>
                         <p className="text-[11px] font-bold text-slate-400 mb-8 leading-relaxed break-keep">상황이나 여건에 따라 답변이 가장 크게 요동치는 지점입니다. 분산(Variance) 수치가 높을수록 유동적인 성향입니다.</p>
                         <ul className="space-y-6">
                            {situationalTop.length > 0 ? situationalTop.map(q => (
                               <li key={q.id}>
                                  <div className="flex justify-between items-center mb-2">
                                     <p className="text-[10px] font-extrabold text-slate-700 line-clamp-1 flex-1 pr-4">{q.content}</p>
                                     <span className="text-[9px] font-black text-rose-500 italic uppercase">V={q.variance}</span>
                                  </div>
                                  <div className="h-1 bg-slate-50 rounded-full overflow-hidden">
                                     <div className="h-full bg-rose-400 rounded-full transition-all duration-1000" style={{ width: `${Math.min(q.variance * 20, 100)}%` }} />
                                  </div>
                               </li>
                            )) : (
                               <div className="py-10 text-center border-2 border-dashed border-slate-50 rounded-3xl">
                                  <Sparkles className="mx-auto text-slate-200 mb-2" />
                                  <p className="text-[11px] font-bold text-slate-300">데이터가 확보되면 유동성 분석이 시작됩니다.</p>
                               </div>
                            )}
                         </ul>
                      </section>

                      {/* 확고함 분석 카드 */}
                      <section className="bg-indigo-600 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
                         <div className="flex items-center gap-2 mb-8">
                            <ShieldCheck size={18} className="text-indigo-300" />
                            <h3 className="text-xs font-black uppercase tracking-widest opacity-80">Stable Core (확고함)</h3>
                         </div>
                         <p className="text-[11px] font-bold opacity-60 mb-8 leading-relaxed break-keep">상황과 환경이 바뀌어도 변하지 않는 당신의 진정한 핵심 자아(Stable Persona)입니다.</p>
                         <ul className="space-y-6">
                            {stableTop.length > 0 ? stableTop.map(q => (
                               <li key={q.id}>
                                  <div className="flex justify-between items-center mb-2">
                                     <p className="text-[10px] font-extrabold line-clamp-1 flex-1 pr-4 text-white opacity-90">{q.content}</p>
                                     <span className="text-[9px] font-black text-indigo-300 italic uppercase">STABLE</span>
                                  </div>
                                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                     <div className="h-full bg-indigo-300 rounded-full" style={{ width: '100%' }} />
                                  </div>
                               </li>
                            )) : <p className="text-[11px] font-bold opacity-30 text-center py-10">데이터 수집 중...</p>}
                         </ul>
                      </section>
                  </div>

                  {/* 정밀 데이터 시트 */}
                  <section className="bg-white border-2 border-slate-50 rounded-[3rem] p-10 overflow-hidden">
                     <div className="flex justify-between items-center mb-8">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                           <Activity size={18} className="text-indigo-600" /> Behavioral Detail Matrix
                        </h3>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px]">
                           <thead>
                              <tr className="border-b border-slate-100">
                                 <th className="py-4 font-black text-slate-300 uppercase tracking-tighter">문항 식별자</th>
                                 <th className="py-4 font-black text-slate-300 uppercase px-4">평균 강도(1~7)</th>
                                 <th className="py-4 font-black text-slate-300 uppercase text-center">정적 유연성</th>
                                 <th className="py-4 font-black text-slate-300 uppercase text-right">평균 고민</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-50">
                              {consistency.length > 0 ? consistency.map(q => (
                                <tr key={q.id} className="hover:bg-slate-50 transition-colors group">
                                   <td className="py-5 font-bold text-slate-800 break-keep max-w-[300px]">{q.content}</td>
                                   <td className="py-5 px-4 font-black text-indigo-600 italic text-sm">{q.avg}</td>
                                   <td className="py-5 text-center">
                                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${parseFloat(q.variance) > 1.2 ? 'bg-pink-100 text-pink-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                         {parseFloat(q.variance) > 1.2 ? 'Fluid' : 'Direct'}
                                      </span>
                                   </td>
                                   <td className="py-5 text-right font-black text-slate-300 italic">{q.avgTimeSec}s</td>
                                </tr>
                              )) : (
                                <tr>
                                   <td colSpan="4" className="py-20 text-center font-bold text-slate-200">아직 테스트 데이터가 기록되지 않았습니다.</td>
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
                     <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">TEST <span className="text-indigo-600">HISTORY</span></h2>
                     <p className="text-sm font-bold text-slate-400 mt-2">시간의 흐름에 따른 당신의 페르소나 궤적입니다.</p>
                  </header>

                  <div className="space-y-4">
                     {history.length > 0 ? history.map((res, i) => (
                       <div 
                         key={res.session_id} 
                         className="bg-white border border-slate-100 p-8 rounded-[2.5rem] flex flex-wrap items-center justify-between group hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-300"
                       >
                          <div className="flex items-center gap-8">
                             <div className="text-center w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-300 italic group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                {history.length - i}
                             </div>
                             <div>
                                <h4 className="text-3xl font-black italic tracking-tighter leading-none">{res.mbti_type}</h4>
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">{res.created_at.split('T')[0]}</p>
                             </div>
                          </div>
                          
                          <div className="flex items-center gap-12 mt-4 sm:mt-0">
                             <div className="text-center">
                                <p className="text-[9px] font-black text-slate-300 uppercase leading-none mb-1">인텔리전스 점수</p>
                                <p className="text-2xl font-black italic text-indigo-600">{res.nti_score}%</p>
                             </div>
                             <button 
                               onClick={() => router.push(`/results/${res.mbti_type}?score=${res.nti_score}&grade=${res.nti_grade}&testType=${res.test_type}`)}
                               className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 group-hover:shadow-indigo-200"
                             >
                                <ChevronRight size={20} />
                             </button>
                          </div>
                       </div>
                     )) : (
                       <div className="py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                          <History size={40} className="mx-auto text-slate-200 mb-4" strokeWidth={1} />
                          <p className="font-bold text-slate-400">기록된 히스토리가 없습니다.</p>
                       </div>
                     )}
                  </div>
              </div>
            )}
         </div>

         <footer className="mt-20 text-center pb-20 opacity-30">
            <p className="text-[9px] font-black uppercase tracking-[0.4em]">NBTI Intelligence Hub • Powered by Antigravity</p>
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
