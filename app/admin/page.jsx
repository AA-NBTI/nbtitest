'use client';

/**
 * [파일명: app/admin/page.jsx]
 * 기능: 통합 테스트 운영 관리 시스템 – 2분할 구조 v12
 * 좌열 (2/5): 제목 + 핵심 지표 + 수직 탭 메뉴
 * 우열 (3/5): 선택된 탭 콘텐츠
 */

import React, { useEffect, useState } from 'react';
import {
  Users, Target, Activity, Clock, Layers, ChevronDown, ChevronUp,
  Timer, Zap, LayoutDashboard, BrainCircuit, PieChart
} from 'lucide-react';

function QuestionAccordion({ title, group, icon: Icon = Layers, light = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const items = (group && Array.isArray(group.questions))
    ? group.questions
    : (group && group.items) ? group.items : [];
  if (!items || items.length === 0) return null;

  return (
    <div className={`mb-2 border rounded-lg overflow-hidden transition-all hover:border-slate-400 ${light ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-200 shadow-sm'}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 text-left group">
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-md transition-colors ${isOpen ? (light ? 'bg-white text-slate-900' : 'bg-slate-900 text-white') : 'bg-slate-100 text-slate-400'}`}>
            <Icon size={14} />
          </div>
          <span className={`font-black text-[13px] uppercase tracking-tight ${light ? 'text-slate-500' : 'text-slate-900'}`}>{title}</span>
        </div>
        {isOpen ? <ChevronUp size={16} className="text-slate-900" /> : <ChevronDown size={16} className="text-slate-300" />}
      </button>

      {isOpen && (
        <div className={`px-4 pb-4 border-t ${light ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-50'}`}>
          <div className="space-y-1 mt-3">
            {items.sort((a, b) => parseFloat(b.avgSec) - parseFloat(a.avgSec)).map(q => (
              <div key={q.id} className="p-3 bg-white rounded-md border border-slate-100 flex justify-between items-center hover:border-slate-400 transition-all shadow-sm">
                <div className="flex-1 pr-3">
                  <p className="text-[0.85rem] font-black text-slate-900 leading-snug break-keep">{q.content}</p>
                  <div className="flex items-center gap-2 mt-1 opacity-40">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{q.id}</span>
                    <div className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{q.axis}</span>
                  </div>
                </div>
                <div className="text-right whitespace-nowrap pl-4">
                  <div className="text-[0.95rem] font-black text-slate-900 leading-none">{q.avgSec}<span className="text-[0.65rem] text-slate-400 ml-0.5">S</span></div>
                  <p className="text-[10px] font-black text-slate-300 mt-1 uppercase">Sample: {q.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function IntegratedTestDashboard() {
  const [data, setData] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [realOnly, setRealOnly] = useState(true);
  const [activeTab, setActiveTab] = useState('version');

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    if (!isMounted) return;
    async function loadDashboard() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/test/dashboard?realOnly=${realOnly}`, { cache: 'no-store' });
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error('Dashboard Load Failed:', e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [realOnly, isMounted]);

  if (!isMounted || (loading && !data)) return (
    <div className="min-h-screen bg-white flex items-center justify-center p-20 flex-col gap-4 font-sans text-center">
      <div className="w-8 h-8 rounded-full border-4 border-slate-100 border-t-slate-900 animate-spin" />
      <p className="font-black text-slate-900 tracking-widest text-[11px] uppercase opacity-20">PROTOCOL SYNCING...</p>
    </div>
  );

  const { dichotomyDistribution, versionGrouped, groupedQuestions, daily, hourly } = data || {};

  const totalSamples = versionGrouped
    ? Object.values(versionGrouped).reduce((s, g) => s + (g.total || 0), 0)
    : 0;

  const TABS = [
    { id: 'version',    label: '버전별 상세분석',    icon: LayoutDashboard },
    { id: 'axis',       label: '심리지표별 흐름',     icon: BrainCircuit },
    { id: 'questions',  label: '문항 정밀분석',       icon: Layers },
    { id: 'times',      label: '데이터 생성 추이',    icon: Clock },
  ];

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans text-slate-900">
      <div className="p-4 md:p-8 lg:p-10 mx-auto max-w-[1200px]">

        {/* ── 2분할 grid (좌 2/5 · 우 3/5) ── */}
        <div className="pt-8 grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* ══════════════════════════════
              좌열: 제목 + 요약 + 탭 메뉴
          ══════════════════════════════ */}
          <div className="lg:col-span-2 space-y-5 lg:sticky lg:top-10">

            {/* 페이지 제목 */}
            <div className="pb-5 border-b border-slate-200">
              <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1.5 leading-none">Intelligence Operations</p>
              <h1 className="text-2xl font-black tracking-tighter uppercase text-slate-900 leading-none">통계분석</h1>
            </div>

            {/* 핵심 요약 3카드 (1행 3열) */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '총 샘플', value: totalSamples.toLocaleString(), icon: Users },
                { label: '버전 수', value: versionGrouped ? Object.keys(versionGrouped).length : '-', icon: Target },
                { label: '모드',    value: realOnly ? '실사용' : '전체', icon: Activity },
              ].map((s, i) => (
                <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm text-center hover:border-slate-300 transition-all group">
                  <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-slate-900 group-hover:text-white transition-all">
                    <s.icon size={14} />
                  </div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
                  <p className="text-base font-black text-slate-900 tracking-tighter leading-none">{s.value}</p>
                </div>
              ))}
            </div>

            {/* 데이터 필터 토글 */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[12px] font-black text-slate-900 uppercase tracking-widest leading-none">데이터 필터</p>
                <p className="text-[11px] font-bold text-slate-400 mt-1">{realOnly ? '실제 사용자 데이터만' : '테스트 포함 전체'}</p>
              </div>
              <button
                onClick={() => setRealOnly(!realOnly)}
                className={`w-12 h-6 rounded-full transition-all duration-300 relative ${realOnly ? 'bg-slate-900' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 shadow-sm ${realOnly ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            {/* 수직 탭 메뉴 */}
            <nav className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-all border-b border-slate-50 last:border-0 ${isActive ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                  >
                    <Icon size={15} strokeWidth={2.5} />
                    <span className="text-[13px] font-black tracking-tight">{tab.label}</span>
                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* ══════════════════════════════
              우열: 탭 콘텐츠
          ══════════════════════════════ */}
          <div className="lg:col-span-3 min-h-[60vh] pb-16">

            {/* ── 버전별 상세분석 ── */}
            {activeTab === 'version' && versionGrouped && (
              <div className="grid grid-cols-1 gap-6">
                {Object.entries(versionGrouped).map(([ver, group]) => (
                  <div key={ver} className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm transition-all hover:border-slate-900 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                      <Target size={120} />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-50 pb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-xl">
                          <Target size={20} />
                        </div>
                        <div>
                          <h3 className="text-[15px] font-black uppercase text-slate-900 tracking-tighter">{group.title} 분석 엔진</h3>
                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">N={(group.total || 0).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">RELIABILITY</p>
                        <p className="text-[13px] font-black text-slate-900">STABLE</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* 문항 분석 – 전체 폭 */}
                      <div>
                        <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Layers size={13} className="text-slate-400" /> 수록 문항 정밀 분석
                        </h4>
                        <QuestionAccordion title="문항별 반응 데이터" group={group} icon={Zap} light={true} />
                      </div>

                      {/* 성향 분포 – 전체 폭 */}
                      <div>
                        <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <PieChart size={13} className="text-slate-400" /> 전체 성향 분포
                        </h4>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                          {group.mbtiDist && Object.keys(group.mbtiDist).length > 0
                            ? Object.entries(group.mbtiDist).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([type, count]) => (
                              <div key={type} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center hover:bg-white hover:border-slate-900 transition-all shadow-sm">
                                <p className="text-[13px] font-black text-slate-900 mb-0.5 leading-none">{type}</p>
                                <p className="text-[10px] font-bold text-slate-400">{((count / (group.total || 1)) * 100).toFixed(0)}%</p>
                              </div>
                            ))
                            : <div className="col-span-full py-6 text-center text-slate-200 font-black text-[11px] border-2 border-dashed border-slate-50 rounded-xl uppercase tracking-widest">DATA PENDING</div>
                          }
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* ── 심리지표별 흐름 분석 ── */}
            {activeTab === 'axis' && dichotomyDistribution && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(dichotomyDistribution).map(([axis, dist]) => {
                  const results = Object.entries(dist);
                  const total = results.reduce((sum, [, count]) => sum + count, 0);
                  const p1 = total > 0 ? (results[0][1] / total) * 100 : 50;
                  const p2 = total > 0 ? (results[1][1] / total) * 100 : 50;
                  return (
                    <div key={axis} className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm transition-all hover:border-slate-900 group">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-widest">{axis} DIMENSION</h3>
                        <div className="p-2.5 bg-slate-50 rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                          <PieChart size={15} />
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase">{results[0][0]}</p>
                            <p className="text-[13px] font-black text-slate-400 mt-1">{p1.toFixed(1)}%</p>
                          </div>
                          <div className="text-right">
                            <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase">{results[1][0]}</p>
                            <p className="text-[13px] font-black text-slate-400 mt-1">{p2.toFixed(1)}%</p>
                          </div>
                        </div>
                        <div className="h-3 bg-slate-50 rounded-full overflow-hidden flex shadow-inner border border-slate-100">
                          <div className="h-full bg-slate-900 transition-all duration-1000" style={{ width: `${p1}%` }} />
                          <div className="h-full bg-slate-200 transition-all duration-1000" style={{ width: `${p2}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── 문항 정밀분석 ── */}
            {activeTab === 'questions' && groupedQuestions && (
              <div className="space-y-2">
                {Object.entries(groupedQuestions).map(([axis, group]) => (
                  <QuestionAccordion key={axis} title={`${axis} 인지 그룹 정밀 통계`} group={group} icon={Zap} />
                ))}
              </div>
            )}

            {/* ── 데이터 생성 추이 ── */}
            {activeTab === 'times' && hourly && daily && (
              <div className="space-y-6">
                {/* 시간대 막대 차트 */}
                <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm hover:border-slate-900 transition-all group">
                  <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-6">
                    <div>
                      <h2 className="text-[13px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        <Timer size={14} className="text-slate-400" /> 24시간 행동 피크 분석
                      </h2>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-tight mt-1">시간대별 사용자 유입 패턴</p>
                    </div>
                    <div className="bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg">
                      Peak: {hourly.indexOf(Math.max(...hourly))}:00
                    </div>
                  </div>
                  <div className="flex items-end justify-between h-40 gap-1 md:gap-1.5">
                    {hourly.map((count, hr) => {
                      const max = Math.max(...hourly, 1);
                      const pct = (count / max) * 100;
                      return (
                        <div key={hr} className="flex-1 flex flex-col items-center group/bar">
                          <div className="w-full relative flex flex-col justify-end h-28 rounded-lg bg-slate-50 overflow-hidden border border-slate-100">
                            <div
                              className={`w-full transition-all duration-1000 ${count === max ? 'bg-sky-500' : 'bg-slate-900 group-hover/bar:bg-slate-600'}`}
                              style={{ height: `${pct}%` }}
                            />
                          </div>
                          <span className={`text-[8px] font-black mt-2 ${count === max ? 'text-slate-900' : 'text-slate-300'}`}>
                            {hr.toString().padStart(2, '0')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 일별 생성 현황 */}
                <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm">
                  <h2 className="text-[13px] font-black text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-50 pb-5 flex items-center gap-2">
                    <Activity size={14} className="text-slate-400" /> 일별 생성 현황
                  </h2>
                  <div className="space-y-3">
                    {daily.map((day, idx) => {
                      const maxCount = Math.max(...daily.map(d => d.count), 1);
                      const isNewest = idx === 0;
                      return (
                        <div key={day.date} className="flex items-center gap-5 p-3.5 bg-slate-50 rounded-xl border border-slate-50 hover:bg-white hover:border-slate-900 transition-all group">
                          <div className="w-16 shrink-0">
                            <p className="text-[12px] font-black text-slate-900 tracking-tighter">{day.date.split('-').slice(1).join('/')}</p>
                            <p className="text-[10px] font-bold text-slate-300 uppercase">{isNewest ? 'Latest' : 'Prev'}</p>
                          </div>
                          <div className="flex-1 h-7 bg-white border border-slate-100 rounded-full overflow-hidden relative shadow-inner">
                            <div
                              className={`h-full transition-all duration-700 ${isNewest ? 'bg-slate-900' : 'bg-slate-200 group-hover:bg-slate-400'}`}
                              style={{ width: `${(day.count / maxCount) * 100}%` }}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-black text-slate-900/40 tracking-tighter uppercase group-hover:text-slate-900 transition-all">
                              {day.count.toLocaleString()} TESTS
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}