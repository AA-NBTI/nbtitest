'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Target, 
  ShieldCheck, 
  AlertOctagon, 
  Timer
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

  if (loading) {
    return (
      <div className="p-12 max-w-7xl mx-auto space-y-12 animate-pulse">
        <div className="h-10 bg-slate-200 rounded w-1/3 mb-10"></div>
        <div className="grid grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>)}
        </div>
        <div className="h-96 bg-slate-200 rounded-[40px]"></div>
        <div className="h-96 bg-slate-200 rounded-[40px]"></div>
      </div>
    );
  }

  const { metrics, quality, funnel } = data || {};

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        grid: { color: '#f1f5f9' },
        border: { dash: [4, 4] }
      },
      x: { 
        grid: { display: false } 
      }
    }
  };

  const chartData = {
    labels: funnel?.labels || [],
    datasets: [
      {
        label: '이탈 유저 수',
        data: funnel?.data || [],
        backgroundColor: funnel?.data?.map(val => val > 5 ? 'rgba(239, 68, 68, 0.8)' : 'rgba(99, 102, 241, 0.6)'), // 5 이상 이탈 몰림 빨간색
        borderRadius: 6,
      }
    ]
  };

  return (
    <div className="p-8 md:p-14 font-sans text-slate-900 mx-auto max-w-[1400px]">
      <header className="mb-14">
        <h1 className="text-4xl font-black tracking-tighter italic uppercase text-slate-900 mb-2">MBTI Data Ops</h1>
        <p className="text-slate-500 font-bold text-sm">한눈에 파악하는 문항 품질 및 유저 스트림 통제 센터</p>
      </header>

      {/* 1. 상단 - 4개 지표 카드 */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-14 border-b border-slate-100 pb-14">
        
        {/* 오늘 테스트 수 */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3 mb-6 text-slate-400 font-black text-xs uppercase tracking-widest">
            <Users size={16} /> 오늘 세션
          </div>
          <p className="text-5xl font-black text-slate-900 tracking-tighter">
            {metrics?.todayTests?.toLocaleString() || 0}
            <span className="text-lg text-slate-400 ml-2">명</span>
          </p>
        </div>

        {/* 완주율 (50% 미만 빨간색) */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3 mb-6 text-slate-400 font-black text-xs uppercase tracking-widest">
            <Target size={16} /> 전체 완주율
          </div>
          <p className={`text-5xl font-black tracking-tighter ${metrics?.completionRate < 50 ? 'text-red-500' : 'text-indigo-600'}`}>
            {metrics?.completionRate || 0}
            <span className="text-lg opacity-50 ml-1">%</span>
          </p>
          {metrics?.completionRate < 50 && (
            <p className="text-xs font-bold text-red-500 mt-3 flex items-center gap-1">
              <AlertOctagon size={12}/> 완주 절반 미달. 조치 요망
            </p>
          )}
        </div>

        {/* 평균 신뢰도 */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3 mb-6 text-slate-400 font-black text-xs uppercase tracking-widest">
            <ShieldCheck size={16} /> 평균 신뢰도
          </div>
          <p className="text-5xl font-black text-emerald-500 tracking-tighter">
            {metrics?.avgConfidence || 0}
            <span className="text-lg opacity-50 ml-1">점</span>
          </p>
        </div>

        {/* 페널티 발생률 */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3 mb-6 text-slate-400 font-black text-xs uppercase tracking-widest">
            <AlertOctagon size={16} /> 어뷰징/빛의 속도
          </div>
          <p className={`text-5xl font-black tracking-tighter ${metrics?.penaltyRate > 10 ? 'text-orange-500' : 'text-slate-900'}`}>
            {metrics?.penaltyRate || 0}
            <span className="text-lg opacity-50 ml-1">%</span>
          </p>
        </div>
      </section>

      {/* 2. 중단 - 문항 품질 테이블 */}
      <section className="mb-14">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 italic uppercase">문항 변별도 품질 관리</h2>
            <p className="text-sm font-bold text-slate-500 mt-1">4점 몰림 현상이 높은 순으로 자동 정렬됩니다. 즉시 교정 대상을 색출합니다.</p>
          </div>
          <div className="text-xs font-bold text-slate-400 flex items-center gap-4">
             <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-50 border border-red-200 rounded"></div> 60%↑ 치명적 조치</span>
             <span className="flex items-center gap-1"><div className="w-3 h-3 text-red-500 font-bold border rounded"></div> 1초 미만 (스킵 의심)</span>
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">우선순위</th>
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">문항 번호</th>
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">보통이다(4점) 쏠림 비율</th>
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest text-right">평균 응답속도</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quality?.map((item, idx) => {
                const isUrgent = item.bias > 60;
                const isSkipped = item.avgTime < 1.0;
                return (
                  <tr key={item.qId} className={`transition-all hover:bg-slate-50 ${isUrgent ? 'bg-red-50/50' : 'bg-white'}`}>
                    <td className="py-5 px-8">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${idx < 3 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-5 px-8 font-black text-slate-700 italic">Question {item.qId}</td>
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-4">
                        <span className={`text-xl font-black tracking-tighter ${isUrgent ? 'text-red-500' : 'text-slate-900'}`}>{item.bias}%</span>
                        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${isUrgent ? 'bg-red-500' : 'bg-emerald-400'}`} style={{ width: `${item.bias}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-8 text-right">
                       <span className={`font-bold text-sm ${isSkipped ? 'text-red-500' : 'text-slate-500'} flex items-center gap-2 justify-end`}>
                         {isSkipped && <Timer size={14}/>} {item.avgTime} 초
                       </span>
                    </td>
                  </tr>
                );
              })}
              {(!quality || quality.length === 0) && (
                <tr><td colSpan="4" className="py-12 text-center text-slate-400 font-bold text-sm">데이터가 충분하지 않습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. 하단 - 이탈 이력 차트 */}
      <section className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm mt-8">
        <div className="mb-10">
          <h2 className="text-2xl font-black text-slate-900 italic uppercase">이탈 구간 (Funnel Dropouts) 추적</h2>
          <p className="text-sm font-bold text-slate-500 mt-1">질문 번호를 X축으로 하여, 해당 문항에서 이탈한 유저 발생 건수를 캔버스에 그립니다.</p>
        </div>
        <div className="h-[400px] w-full">
          {funnel && funnel.labels.length > 0 ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">차트 데이터 대기 중...</div>
          )}
        </div>
      </section>

    </div>
  );
}