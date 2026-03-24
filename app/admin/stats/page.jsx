'use client';

import React, { useEffect, useState } from 'react';
import { 
  BarChart, TrendingUp, Users, DollarSign, Activity, Target, Zap
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function EnhancedStatsDashboard() {
  const [stats, setStats] = useState(null);
  const [showAllMbti, setShowAllMbti] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      const res = await fetch('/api/admin/stats', { cache: 'no-store' });
      const data = await res.json();
      setStats(data);
    }
    fetchStats();
  }, []);

  if (!stats) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-slate-400">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
      <p className="font-bold tracking-widest uppercase">데이터 분석 엔진 가동 중...</p>
    </div>
  );

  if (stats.error) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-3xl font-black text-red-500 mb-4 tracking-tighter">데이터베이스 심층 에러 ⚠️</h2>
        <p className="text-slate-600 font-bold mb-8">광고 성과 측정을 위한 DB 스키마가 일치하지 않습니다. 업그레이드 스크립트를 재확인하십시오.</p>
        <p className="text-sm bg-slate-900 text-green-400 p-6 rounded-2xl max-w-lg mx-auto font-mono text-left block w-full truncate">
         {stats.error}
        </p>
      </div>
    );
  }

  const { metrics, leaderboard, mbtiTargeting, testTypes, placement } = stats;

  const displayMbti = showAllMbti ? mbtiTargeting : mbtiTargeting.slice(0, 5);

  const mbtiChartData = {
    labels: displayMbti.map(m => m.mbti),
    datasets: [{
      label: '클릭 참여도',
      data: displayMbti.map(m => m.count),
      backgroundColor: displayMbti.map((_, i) => ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#facc15'][i % 5]),
      borderRadius: 8,
      borderSkipped: false,
      barThickness: 24,
    }]
  };

  const testTypeChartData = {
    labels: ['112문항 (Basic)', '28문항 (Dynamic)', '기타 (Love 등)'],
    datasets: [{
      data: [testTypes.basic, testTypes.dynamic, testTypes.etc],
      backgroundColor: ['#4f46e5', '#10b981', '#f59e0b'],
      borderWidth: 0,
    }]
  };

  return (
    <div className="p-6 md:p-12 font-sans bg-slate-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">브랜드 캠페인 애널리틱스</h1>
          <p className="text-slate-500 font-bold text-sm mt-2 flex items-center gap-2">
            <Zap size={16} className="text-yellow-500" /> 실시간 스폰서십 도달률 및 매출 예측 현황
          </p>
        </div>

        {/* 최상단: 메트릭 요약 (금액, 오늘, 전체) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 p-8 rounded-[32px] text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden flex flex-col justify-between">
            <DollarSign className="absolute -right-6 -bottom-6 w-48 h-48 opacity-10 pointer-events-none" />
            <div>
              <h3 className="text-indigo-200 font-black text-sm tracking-widest uppercase mb-2">오늘 예상 수익금 종합</h3>
              <p className="text-5xl font-black tracking-tighter">₩{metrics.estimatedRevenue}</p>
            </div>
            <div className="mt-6">
              <span className="text-xs font-bold text-indigo-300">각 캠페인별 개별 설정 단가(CPC) 누적 합산</span>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-slate-400 font-black text-sm tracking-widest uppercase">오늘 배너 인게이지먼트</h3>
              <div className="p-3 bg-emerald-50 text-emerald-500 rounded-full"><TrendingUp size={20} /></div>
            </div>
            <p className="text-5xl font-black tracking-tighter text-slate-900">{metrics.todayClicks.toLocaleString()}<span className="text-xl text-slate-300 ml-2">Hits</span></p>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-slate-400 font-black text-sm tracking-widest uppercase">총 누적 캠페인 도달</h3>
              <div className="p-3 bg-purple-50 text-purple-500 rounded-full"><Activity size={20} /></div>
            </div>
            <p className="text-5xl font-black tracking-tighter text-slate-900">{metrics.totalEngagements.toLocaleString()}<span className="text-xl text-slate-300 ml-2">Total</span></p>
          </div>
        </div>

        {/* 중단: 차트 & 랭킹보드 컴포넌트 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 중앙 집중 (MBTI 성향별 타겟 분석) */}
          <div className="lg:col-span-2 bg-white rounded-[40px] p-8 border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <Target className="text-indigo-500" /> 캠페인 반응률 성격 유형 편차 (MBTI)
                </h2>
                <p className="text-sm font-bold text-slate-400 mt-1">광고에 가장 적극적으로 반응(호기심)을 보인 심리 유형 분석</p>
              </div>
              <button 
                onClick={() => setShowAllMbti(!showAllMbti)}
                className="px-4 py-2 bg-slate-100 text-indigo-600 font-black text-xs rounded-full hover:bg-slate-200 transition-colors"
                title="데이터가 부족하면 스크롤 크기가 변하지 않을 수 있습니다."
              >
                {showAllMbti ? '💡 상위 5개만 압축 보기' : '🔥 16개 MBTI 전체 펼쳐보기'}
              </button>
            </div>
            <div className={`flex-1 flex items-center justify-center transition-all ${showAllMbti ? 'min-h-[500px]' : 'min-h-[300px]'}`}>
               {mbtiTargeting.length > 0 ? (
                 <Bar 
                   options={{ 
                     indexAxis: 'y', 
                     maintainAspectRatio: false, 
                     scales: { 
                       x: { display: false, grid: { display: false } }, 
                       y: { grid: { display: false }, border: { display: false }, ticks: { font: { weight: 'bold' }, color: '#475569' } } 
                     }, 
                     plugins: { legend: { display: false } } 
                   }} 
                   data={mbtiChartData} 
                 />
               ) : (
                 <div className="text-center text-slate-300 font-bold">집계된 데이터가 없습니다.</div>
               )}
            </div>
          </div>

          {/* 우측 배너 리더보드 */}
          <div className="bg-slate-900 rounded-[40px] p-8 shadow-2xl flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-indigo-500/20 to-transparent pointer-events-none" />
            <h2 className="text-2xl font-black text-white mb-2 relative z-10">스폰서 퍼포먼스 랭킹</h2>
            <p className="text-slate-400 text-xs font-bold mb-8 relative z-10">현재 가장 효율이 좋은 캠페인 브랜드</p>
            
            <div className="flex-1 space-y-4 relative z-10 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {leaderboard.length > 0 ? leaderboard.map((item, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl flex items-center justify-between hover:bg-slate-800 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <span className={`text-xl font-black ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-slate-300' : 'text-amber-600'}`}>
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-white font-bold text-sm">{item.brand}</p>
                      <p className="text-slate-500 text-[10px] w-32 truncate">{item.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-indigo-400 font-black text-lg">{item.clicks}</p>
                    <p className="text-slate-500 text-[10px] uppercase tracking-widest">Hits</p>
                  </div>
                </div>
              )) : (
                <div className="text-slate-500 font-bold text-sm text-center mt-10">캠페인 기록 없음</div>
              )}
            </div>
          </div>
        </div>

        {/* 하단: 비율 지표 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex items-center gap-8">
            <div className="w-40 h-40">
              <Doughnut data={testTypeChartData} options={{ cutout: '75%', plugins: { legend: { display: false } } }} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 mb-2">프론트엔드 유입 채널 (테스트 종류)</h3>
              <ul className="space-y-3 mt-4">
                <li className="flex items-center gap-2 text-sm font-bold text-slate-500"><div className="w-3 h-3 rounded-full bg-indigo-600"/> 112문항 베이직 ({testTypes.basic})</li>
                <li className="flex items-center gap-2 text-sm font-bold text-slate-500"><div className="w-3 h-3 rounded-full bg-emerald-500"/> 28문항 다이나믹 ({testTypes.dynamic})</li>
                <li className="flex items-center gap-2 text-sm font-bold text-slate-500"><div className="w-3 h-3 rounded-full bg-amber-500"/> 연애/기타 서브테스트 ({testTypes.etc})</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex flex-col justify-center">
            <h3 className="text-xl font-black text-slate-800 mb-6">최고 효율 노출 구역 (Placement)</h3>
            <div className="space-y-6">
              <div>
                 <div className="flex justify-between mb-2">
                   <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">문항 슬라이딩 (Loading) 구간 매복</span>
                   <span className="font-black text-indigo-600">{placement.LOADING} Hits</span>
                 </div>
                 <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                   <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(placement.LOADING / (placement.LOADING + placement.RESULT_CARD || 1)) * 100}%` }}/>
                 </div>
              </div>
              <div>
                 <div className="flex justify-between mb-2">
                   <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">최종 결과 카드 하단 고정 배너</span>
                   <span className="font-black text-pink-500">{placement.RESULT_CARD} Hits</span>
                 </div>
                 <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                   <div className="bg-pink-500 h-full rounded-full" style={{ width: `${(placement.RESULT_CARD / (placement.LOADING + placement.RESULT_CARD || 1)) * 100}%` }}/>
                 </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}