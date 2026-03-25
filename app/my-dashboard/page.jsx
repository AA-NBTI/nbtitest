'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/AuthProvider';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, LogOut, History, Zap, ShieldCheck, Activity, BrainCircuit, Timer, ChevronRight, BarChart3, AlertCircle, TrendingDown, TrendingUp
} from 'lucide-react';
import Link from 'next/link';

export default function MyDashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
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

  if (authLoading || loading) return <div className="p-20 text-center font-bold text-slate-300 animate-pulse italic uppercase tracking-widest">분석 로딩 중...</div>;
  if (!user) return null;

  const { history = [], consistency = [] } = data || {};

  // 요동치는 문항 (Situational) - 분산이 큰 순
  const situationalTop = consistency.filter(q => q.count > 1).sort((a,b) => b.variance - a.variance).slice(0, 5);
  // 확고한 문항 (Stable) - 분산이 작은 순
  const stableTop = consistency.filter(q => q.count > 1).sort((a,b) => a.variance - b.variance).slice(0, 5);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-14 font-sans text-slate-900">
      <div className="max-w-[1200px] mx-auto">
        
        {/* 헤더 */}
        <header className="flex justify-between items-start mb-14">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-4 hover:text-black transition-colors">
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
              MY <span className="text-indigo-600">DASHBOARD</span>
            </h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">{user.email}</p>
          </div>
          <button 
            onClick={signOut}
            className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm"
            title="로그아웃"
          >
            <LogOut size={20} />
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* 1. 개인 일관성 레포트 (나 스스로도 답이 달라지는 요동성 분석) */}
          <div className="lg:col-span-2 space-y-8">
             <section className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                   <BrainCircuit size={28} className="opacity-60" />
                   <h2 className="text-xl font-black italic uppercase tracking-widest">Consistency Insights</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                   {/* Situational Analysis */}
                   <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                      <div className="flex items-center gap-2 mb-4 text-pink-300">
                        <TrendingUp size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Situational Traits (유동성)</span>
                      </div>
                      <p className="text-sm font-medium opacity-80 mb-6 break-keep">상황이나 여건에 따라 답변이 가장 크게 변하는 성향들입니다.</p>
                      <ul className="space-y-4">
                         {situationalTop.length > 0 ? situationalTop.map(q => (
                           <li key={q.id} className="group">
                              <p className="text-[11px] font-bold line-clamp-1 opacity-60 group-hover:opacity-100 transition-opacity">{q.content}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                   <div className="h-full bg-pink-400 rounded-full" style={{ width: `${Math.min(q.variance * 20, 100)}%` }} />
                                </div>
                                <span className="text-[9px] font-black italic uppercase">Variance {q.variance}</span>
                              </div>
                           </li>
                         )) : <p className="text-xs opacity-50 italic">분석을 위해 테스트를 2회 이상 진행해주세요.</p>}
                      </ul>
                   </div>

                   {/* Stable Analysis */}
                   <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                      <div className="flex items-center gap-2 mb-4 text-emerald-300">
                        <ShieldCheck size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Stable Core (확고함)</span>
                      </div>
                      <p className="text-sm font-medium opacity-80 mb-6 break-keep">상황과 상관없이 항상 일정한 답변을 유지하는 당신의 핵심 성향입니다.</p>
                      <ul className="space-y-4">
                         {stableTop.length > 0 ? stableTop.map(q => (
                           <li key={q.id} className="group">
                              <p className="text-[11px] font-bold line-clamp-1 opacity-60 group-hover:opacity-100 transition-opacity">{q.content}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                   <div className="h-full bg-emerald-400 rounded-full" style={{ width: '100%' }} />
                                </div>
                                <span className="text-[9px] font-black italic uppercase">STABLE</span>
                              </div>
                           </li>
                         )) : <p className="text-xs opacity-50 italic">데이터 수집 중...</p>}
                      </ul>
                   </div>
                </div>
                <Zap size={200} className="absolute -right-10 -bottom-10 text-white opacity-5" />
             </section>

             {/* 2. 상세 문항 데이터 시트 (나의 과거 모든 응답 매트릭스) */}
             <section className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-black text-slate-900 mb-8 flex items-center gap-2 uppercase tracking-widest">
                  <Activity size={18} className="text-indigo-600" /> All Behavioral Matrix
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="py-4 font-black text-slate-400 text-[10px] uppercase">분석 문항</th>
                          <th className="py-4 font-black text-slate-400 text-[10px] uppercase text-center">평균(7P)</th>
                          <th className="py-4 font-black text-slate-400 text-[10px] uppercase text-center">요동성</th>
                          <th className="py-4 font-black text-slate-400 text-[10px] uppercase text-right">평균 고민</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {consistency.map(q => (
                          <tr key={q.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="py-5 pr-10">
                               <p className="text-xs font-bold text-slate-800 break-keep">{q.content}</p>
                               <span className="text-[8px] font-black text-slate-200 uppercase tracking-widest">{q.id}</span>
                            </td>
                            <td className="py-5 text-center font-black text-slate-900">{q.avg}</td>
                            <td className="py-5 text-center">
                               <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${parseFloat(q.variance) > 1.5 ? 'bg-pink-100 text-pink-600' : 'bg-slate-100 text-slate-400'}`}>
                                 {parseFloat(q.variance) > 1.5 ? 'HIGH' : 'STABLE'}
                               </span>
                            </td>
                            <td className="py-5 text-right font-black text-slate-400 italic text-[11px]">{q.avgTimeSec}s</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </div>
             </section>
          </div>

          {/* 3. 테스트 히스토리 사이드바 */}
          <div className="space-y-6">
             <section className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                   <h3 className="text-sm font-black text-slate-900 mb-8 flex items-center gap-2 uppercase tracking-widest">
                      <History size={18} className="text-indigo-600" /> Test History
                   </h3>
                   <div className="space-y-6">
                      {history.length > 0 ? history.map((res, i) => (
                        <div key={res.session_id} className="flex items-center justify-between group cursor-default">
                           <div className="flex flex-col">
                              <span className="text-[10px] font-black text-slate-300 uppercase leading-none mb-1">{res.created_at.split('T')[0]}</span>
                              <p className="text-lg font-black text-slate-900 italic tracking-tighter">
                                 {res.mbti_type} <span className="text-xs opacity-30 ml-1">Type</span>
                              </p>
                           </div>
                           <div className="flex items-center gap-4">
                              <div className="text-right">
                                 <p className="text-[8px] font-black text-slate-300 uppercase leading-none mb-0.5">Confidence</p>
                                 <p className="text-sm font-black text-indigo-600 italic leading-none">{res.nti_score}%</p>
                              </div>
                              {i === 0 && <span className="bg-indigo-600 text-[8px] text-white px-2 py-0.5 rounded-full font-black uppercase italic">Latest</span>}
                           </div>
                        </div>
                      )) : (
                        <div className="py-10 text-center">
                           <AlertCircle className="mx-auto text-slate-200 mb-2" />
                           <p className="text-xs font-bold text-slate-300">데이터가 없습니다.</p>
                        </div>
                      )}
                   </div>
                </div>
                
                <div className="mt-14 pt-10 border-t border-slate-100">
                   <Link 
                     href="/test/basic" 
                     className="w-full bg-slate-900 text-white p-5 rounded-2xl flex items-center justify-center gap-3 font-black hover:bg-black transition-all shadow-xl shadow-slate-200 group"
                   >
                     새로운 테스트 시작 <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                   </Link>
                </div>
             </section>

             <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 mb-2">
                   <ShieldCheck size={14} /> Intelligence Tip
                </p>
                <p className="text-xs font-bold text-slate-600 leading-relaxed break-keep">
                   분산(Variance)이 높은 문항은 상황이나 스트레스 여건에 따라 당신의 페르소나가 가장 민감하게 반응하는 지점입니다. 
                   <span className="block mt-2 text-slate-400 font-medium">여러 번의 누적 테스트를 통해 자신만의 '변하지 않는 핵심(Stable Core)'을 찾아보세요.</span>
                </p>
             </div>
          </div>
        </div>

        <footer className="mt-20 text-center pb-20 border-t border-slate-100 pt-10">
           <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.5em] italic">
             NBTI Personal Intelligence Center • v2.5 Stable Core Discovery
           </p>
        </footer>
      </div>
    </div>
  );
}
