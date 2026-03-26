'use client';

/**
 * [파일명: app/my-dashboard/page.jsx]
 * 기능: 개인 분석 대시보드 v9 – 2분할 구조 + 전체 질문 이력
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/AuthProvider';
import { useRouter } from 'next/navigation';
import {
  LogOut, History, Zap, ShieldCheck, Activity, BrainCircuit, Timer,
  ChevronRight, BarChart3, AlertCircle, Fingerprint, PlusCircle,
  Home, Menu, X, CheckSquare2, TrendingUp
} from 'lucide-react';
import Link from 'next/link';

export default function MyDashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('insights');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
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
      <div className="w-8 h-8 rounded-full border-4 border-slate-100 border-t-slate-900 animate-spin" />
      <p className="font-black text-slate-900 tracking-tight text-[15px] uppercase">데이터 동기화 중...</p>
    </div>
  );
  if (!user) return null;

  const { history = [], consistency = [] } = data || {};
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // 고민 시간 기준 정렬된 전체 질문 목록
  const allQuestions = [...consistency].sort((a, b) => parseFloat(b.avgTimeSec) - parseFloat(a.avgTimeSec));
  const maxTime = allQuestions.length > 0 ? parseFloat(allQuestions[0].avgTimeSec) : 10;

  return (
    <div className="min-h-screen bg-[#fafafa] flex font-sans text-slate-900 overflow-x-hidden relative -mt-[100px]">

      {/* ───── Mobile Header (Hamburger) ───── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#18181b] border-b border-zinc-800 z-[100] flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Home size={18} className="text-zinc-900" />
          </div>
          <span className="font-black text-lg tracking-tighter text-white uppercase block leading-none">NBTI <span className="text-zinc-500">MY</span></span>
        </Link>
        <button onClick={toggleSidebar} className="text-white p-2 hover:bg-zinc-800 rounded-lg transition-colors">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* ───── 좌측 사이드바 (Dark) ───── */}
      <aside className={`
        w-[200px] bg-[#18181b] border-r border-zinc-800 h-screen fixed left-0 top-0 flex flex-col p-6 z-[110]
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* 로고 */}
        <Link href="/" className="hidden lg:flex items-center gap-3 mb-8 group transition-all hover:opacity-80">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center overflow-hidden">
            <Home size={18} className="text-zinc-900" />
          </div>
          <div>
            <span className="font-black text-lg tracking-tighter text-white uppercase block leading-none">NBTI</span>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-0.5">MY DASH</span>
          </div>
        </Link>

        {/* 사용자 – 이니셜 아이콘만 */}
        <div className="mb-6 pb-6 border-b border-zinc-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-700 text-white flex items-center justify-center font-black text-[15px] uppercase shrink-0">
            {user.email[0]}
          </div>
          <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest leading-tight">분석 승인됨</p>
        </div>

        {/* 내비게이션 */}
        <nav className="space-y-1 flex-1">
          <button
            onClick={() => { setActiveTab('insights'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 p-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'insights' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300'}`}
          >
            <BarChart3 size={16} strokeWidth={2.5} />
            <span className="tracking-tight text-[13.5px]">통계 인사이트</span>
          </button>
          <button
            onClick={() => { setActiveTab('history'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 p-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'history' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300'}`}
          >
            <History size={16} strokeWidth={2.5} />
            <span className="tracking-tight text-[13.5px]">분석 히스토리</span>
          </button>
        </nav>

        <div className="pt-6 mt-auto border-t border-zinc-800">
          <button onClick={() => signOut()} className="w-full flex items-center gap-3 p-3 rounded-xl text-zinc-600 hover:text-red-400 transition-all font-bold text-[12px] uppercase tracking-tighter">
            <LogOut size={16} /> 로그아웃
          </button>
        </div>
      </aside>

      {/* ───── Overlay for Mobile ───── */}
      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[105] lg:hidden transition-opacity" />
      )}

      {/* ───── 메인 콘텐츠 ───── */}
      <main className="flex-1 lg:ml-[200px] overflow-y-auto min-h-screen pt-16 lg:pt-0 p-4 md:p-8 lg:p-10">

        {activeTab === 'insights' ? (
          <div className="pt-8">
            {/* ── 2분할 그리드 ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

              {/* ───── 좌열: 요약 + 일관성 카드 ───── */}
              <div className="space-y-6">

                {/* 요약 3카드 – 1행 3열 */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: '누적분석', value: history.length, icon: Activity },
                    { label: '응답문항', value: `${consistency.length}개`, icon: CheckSquare2 },
                    { label: '데이터 신뢰도', value: '매우 높음', icon: ShieldCheck }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-slate-300 transition-all group text-center">
                      <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-slate-900 group-hover:text-white transition-all">
                        <stat.icon size={16} />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
                      <p className="text-xl font-black text-slate-900 tracking-tighter leading-none">{stat.value}</p>
                    </div>
                  ))}
                </div>


                {/* 성향 인사이트 카드 */}
                {consistency.length > 0 && (() => {
                  const avgVariance = consistency.reduce((s, q) => s + Number(q.variance), 0) / consistency.length;
                  const stabilityPct = Math.round(Math.max(0, Math.min(100, (1 - avgVariance / 4) * 100)));
                  const stableSorted = [...consistency].sort((a, b) => Number(a.variance) - Number(b.variance));
                  const mostStable = stableSorted.slice(0, 3);
                  const mostUncertain = stableSorted.slice(-3).reverse();
                  return (
                    <div className="space-y-4">

                      {/* 1. 응답 안정도 점수 */}
                      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-md">
                            <BrainCircuit size={18} />
                          </div>
                          <div>
                            <p className="text-[13px] font-black text-slate-900 leading-none">나의 응답 일관성</p>
                            <p className="text-[11px] font-bold text-slate-400 mt-0.5">동일 문항을 여러 번 봤을 때 얼마나 일관된 답변을 했는지</p>
                          </div>
                        </div>
                        <div className="flex items-end justify-between mb-3">
                          <span className="text-4xl font-black text-slate-900 tracking-tighter">{stabilityPct}<span className="text-xl ml-1 text-slate-400">%</span></span>
                          <span className={`px-3 py-1.5 rounded-full text-[11px] font-black uppercase ${stabilityPct >= 80 ? 'bg-slate-900 text-white' : stabilityPct >= 60 ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-400'}`}>
                            {stabilityPct >= 80 ? '매우 안정' : stabilityPct >= 60 ? '안정' : '변동 있음'}
                          </span>
                        </div>
                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-900 rounded-full transition-all duration-700" style={{ width: `${stabilityPct}%` }} />
                        </div>
                      </div>

                      {/* 2. 가장 확신하는 응답 */}
                      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                        <p className="text-[12px] font-black text-slate-900 uppercase tracking-widest mb-1 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-slate-900 inline-block" />
                          확신하는 성향 (일관된 답변)
                        </p>
                        <p className="text-[11px] font-bold text-slate-400 mb-4">매번 비슷하게 답변한 질문 — 나의 핵심 성향</p>
                        <div className="space-y-3">
                          {mostStable.map((q, i) => (
                            <div key={q.id} className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">{i + 1}</div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-bold text-slate-800 leading-snug break-keep">{q.content || q.id}</p>
                                <p className="text-[11px] text-slate-400 font-black mt-1">평균 답변: <span className="text-slate-900">{q.avg}점</span> · {q.count}회 응답</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 3. 가장 고민스러운 응답 */}
                      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                        <p className="text-[12px] font-black text-slate-900 uppercase tracking-widest mb-1 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" />
                          흔들리는 성향 (변동 있는 답변)
                        </p>
                        <p className="text-[11px] font-bold text-slate-400 mb-4">회차마다 답변이 달라진 질문 — 아직 탐색 중인 영역</p>
                        <div className="space-y-3">
                          {mostUncertain.map((q, i) => (
                            <div key={q.id} className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-lg bg-slate-200 text-slate-500 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">{i + 1}</div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-bold text-slate-800 leading-snug break-keep">{q.content || q.id}</p>
                                <p className="text-[11px] text-slate-400 font-black mt-1">변동 지수: <span className="text-slate-600">{Number(q.variance).toFixed(1)}</span> · {q.count}회 응답</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  );
                })()}

              </div>

              {/* ───── 우열: 전체 응답 문항 목록 ───── */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                      <Timer size={18} />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">응답 문항 전체</h3>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-0.5">고민 시간 기준 정렬 · {allQuestions.length}개</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                    <TrendingUp size={12} className="text-slate-400" />
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">시간순</span>
                  </div>
                </div>

                <div className="divide-y divide-slate-50 max-h-[65vh] overflow-y-auto">
                  {allQuestions.length > 0 ? allQuestions.map((q, idx) => (
                    <div key={q.id} className="px-6 py-4 hover:bg-slate-50 transition-colors group flex items-start gap-4">
                      {/* 순위 번호 */}
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center font-black text-slate-400 text-[11px] shrink-0 mt-0.5 group-hover:bg-slate-900 group-hover:text-white transition-all">
                        {idx + 1}
                      </div>

                      {/* 질문 내용 */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-slate-800 leading-snug break-keep mb-2">
                          {q.content || q.id}
                        </p>
                        {/* 고민 시간 바 */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-slate-900 rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(5, (parseFloat(q.avgTimeSec) / maxTime) * 100)}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-black text-slate-400 shrink-0 tabular-nums">{q.avgTimeSec}s</span>
                        </div>
                      </div>

                      {/* 평균 점수 */}
                      <div className="text-right shrink-0">
                        <p className="text-[10px] font-black text-slate-300 uppercase mb-1">평균</p>
                        <p className="text-[16px] font-black text-slate-900 tracking-tighter leading-none">{q.avg}</p>
                        <p className="text-[10px] font-black text-slate-300 mt-0.5">{q.count}회</p>
                      </div>
                    </div>
                  )) : (
                    <div className="py-16 text-center">
                      <AlertCircle className="mx-auto text-slate-200 mb-4" size={36} strokeWidth={1} />
                      <p className="text-slate-300 font-black text-[13px] uppercase tracking-widest">응답 데이터 없음</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="pt-8 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-8">
              <div>
                <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">분석 히스토리</h2>
                <p className="text-[14px] font-bold text-slate-400 mt-1 uppercase tracking-widest">누적된 모든 성향 분석 결과 데이터</p>
              </div>
              <Link href="/tests/basic" className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[13px] hover:bg-black transition-all shadow-lg shadow-slate-200 uppercase">새 분석 시작</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-16">
              {history.slice(0, 15).map((h) => (
                <div key={h.id} className="p-7 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-2xl hover:shadow-slate-100 transition-all group overflow-hidden relative">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">{new Date(h.created_at).toLocaleDateString()}</span>
                    <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                      <PlusCircle size={16} />
                    </div>
                  </div>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{h.nti_type}</p>
                  <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-4">분석 엔진: {h.test_type || 'STANDARD'}</p>
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[12px] font-black text-slate-900 uppercase">분석 결과 보기</span>
                    <ChevronRight size={15} strokeWidth={4} className="text-slate-900" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
