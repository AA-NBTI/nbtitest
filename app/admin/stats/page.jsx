'use client';

/**
 * [파일명: app/admin/stats/page.jsx]
 * 기능: 광고 성과 분석 – 2분할 구조 v6
 * 좌열 (2/5): 제목 + 핵심 지표 카드 + 테스트 유형 분포
 * 우열 (3/5): MBTI 별 인게이지먼트 분석
 */

import React, { useEffect, useState } from 'react';
import {
  DollarSign, MousePointer2, Activity, Target, Zap, BarChart3, PieChart
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function AdStatsDashboard() {
  const [stats, setStats] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showAllMbti, setShowAllMbti] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats', { cache: 'no-store' });
        const data = await res.json();
        setStats(data || {
          metrics: { estimatedRevenue: 0, todayClicks: 0, totalEngagements: 0 },
          leaderboard: [], mbtiTargeting: [],
          testTypes: { basic: 0, dynamic: 0, etc: 0 }, placement: []
        });
      } catch (e) {
        console.error('Stats Data Binding Failed:', e);
      }
    }
    fetchStats();
  }, []);

  if (!isMounted || !stats) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-20 text-center">
      <div className="w-8 h-8 rounded-full border-4 border-slate-100 border-t-slate-900 animate-spin mb-4" />
      <p className="font-black text-slate-900 tracking-widest text-[11px] uppercase opacity-20">데이터 동기화 중...</p>
    </div>
  );

  const { metrics, mbtiTargeting = [], testTypes } = stats;
  const safeMbti = mbtiTargeting || [];
  const displayMbti = showAllMbti ? safeMbti : safeMbti.slice(0, 8);

  const totalTests = (testTypes?.basic || 0) + (testTypes?.dynamic || 0) + (testTypes?.etc || 0);

  const mbtiChartData = {
    labels: displayMbti.map(m => m.mbti),
    datasets: [{
      label: '클릭 참여도',
      data: displayMbti.map(m => m.count),
      backgroundColor: displayMbti.map((_, i) =>
        ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0'][i % 8]
      ),
      borderRadius: 6,
      barThickness: 28,
    }]
  };

  const testTypeItems = [
    { label: '기본형', value: testTypes?.basic || 0, color: 'bg-slate-900' },
    { label: '단축형', value: testTypes?.dynamic || 0, color: 'bg-slate-500' },
    { label: '기타', value: testTypes?.etc || 0, color: 'bg-slate-200' },
  ];

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans text-slate-900">
      <div className="p-4 md:p-8 lg:p-10 mx-auto max-w-[1200px]">

        <div className="pt-8 grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* ══════════════════════════════
              좌열: 제목 + 지표 + 유형분포
          ══════════════════════════════ */}
          <div className="lg:col-span-2 space-y-5 lg:sticky lg:top-10">

            {/* 페이지 제목 */}
            <div className="pb-5 border-b border-slate-200">
              <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1.5 leading-none">Brand Sponsorship Unit</p>
              <h1 className="text-2xl font-black tracking-tighter uppercase text-slate-900 leading-none">광고분석</h1>
            </div>

            {/* 핵심 지표 3카드 */}
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-slate-900 p-5 rounded-xl text-white relative overflow-hidden">
                <DollarSign className="absolute -right-3 -bottom-3 w-20 h-20 opacity-10" />
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 leading-none">오늘 예상 수익금</p>
                    <p className="text-2xl font-black tracking-tighter leading-none">₩{metrics?.estimatedRevenue || '0'}</p>
                  </div>
                  <div className="p-2 bg-white/10 rounded-lg">
                    <DollarSign size={16} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: '오늘 클릭', value: (metrics?.todayClicks || 0).toLocaleString(), icon: MousePointer2, sub: '일간 참여 지수' },
                  { label: '누적 도달', value: (metrics?.totalEngagements || 0).toLocaleString(), icon: Activity, sub: '캠페인 누적' },
                ].map((s, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-slate-300 transition-all group">
                    <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-slate-900 group-hover:text-white transition-all">
                      <s.icon size={14} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{s.label}</p>
                    <p className="text-xl font-black text-slate-900 tracking-tighter leading-none">{s.value}</p>
                    <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest mt-1.5">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 테스트 유형 분포 */}
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
              <p className="text-[12px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <PieChart size={13} className="text-slate-400" /> 테스트 유형 점유율
              </p>
              <div className="space-y-3">
                {testTypeItems.map((t) => {
                  const pct = totalTests > 0 ? Math.round((t.value / totalTests) * 100) : 0;
                  return (
                    <div key={t.label}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[12px] font-black text-slate-700">{t.label}</span>
                        <span className="text-[12px] font-black text-slate-900">{pct}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${t.color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════
              우열: MBTI 인게이지먼트 분석
          ══════════════════════════════ */}
          <div className="lg:col-span-3 min-h-[60vh] pb-16">
            <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-6">
                <div>
                  <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Target size={14} className="text-slate-400" /> MBTI 인게이지먼트 분석
                  </h2>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-tight mt-1">성향 유형별 광고 반응 참여도</p>
                </div>
                <button
                  onClick={() => setShowAllMbti(!showAllMbti)}
                  className="px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider border border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
                >
                  {showAllMbti ? 'TOP 8' : 'ALL'}
                </button>
              </div>

              {safeMbti.length > 0 ? (
                <div className="h-[320px]">
                  <Bar
                    data={mbtiChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        x: { grid: { display: false }, ticks: { font: { weight: 'bold', size: 11 } } },
                        y: { display: false }
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="h-[320px] flex items-center justify-center text-slate-200 font-black text-[11px] uppercase tracking-widest border-2 border-dashed border-slate-50 rounded-xl">
                  분석 데이터 입수 중...
                </div>
              )}

              {/* MBTI 수치 테이블 */}
              {safeMbti.length > 0 && (
                <div className="mt-6 grid grid-cols-4 gap-2">
                  {displayMbti.map((m, i) => (
                    <div key={m.mbti} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center hover:bg-white hover:border-slate-900 transition-all">
                      <p className="text-[13px] font-black text-slate-900 mb-0.5 leading-none">{m.mbti}</p>
                      <p className="text-[10px] font-bold text-slate-400">{m.count}회</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}