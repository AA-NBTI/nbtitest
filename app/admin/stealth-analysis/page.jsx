'use client';

import React, { useState, useEffect } from 'react';
import { 
  Target, BarChart, Users, ChevronRight, Activity, Zap, Layers, List as ListIcon, ArrowLeft, MessageSquare, Search,
  Filter, CheckCircle, Percent, TrendingUp, Award, MapPin, Smile, User
} from 'lucide-react';

const MBTI_ORDER = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

export default function StealthIntelligenceCenter() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [selectedAdId, setSelectedAdId] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');
  const [showPercent, setShowPercent] = useState(false);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/admin/stealth-stats', { cache: 'no-store' });
        const json = await res.json();
        const filtered = {};
        Object.entries(json.ads || {}).forEach(([id, ad]) => {
          const format = (ad.ad_format || '').toUpperCase();
          if (format === 'SPONSORED_LIKERT' || format === 'NATIVE_LIKERT' || format === 'STEALTH') {
            filtered[id] = ad;
          }
        });
        setData(filtered);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) return <div className="p-12 text-slate-400 font-bold animate-pulse italic">스텔스 인텔리전스 가동 중...</div>;

  const campaignList = Object.values(data).filter(ad => 
    ad.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ad.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- 목록 뷰 (List View) ---
  if (!selectedAdId) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
        <div className="max-w-3xl mx-auto min-h-screen px-4 md:px-12 bg-white shadow-xl shadow-slate-200/50 rounded-[3rem] border border-slate-100">
          <div className="pt-16 pb-12 text-center">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 italic">
              STEALTH <span className="text-indigo-600">AGENT</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] leading-none">B2B Sponsored Intelligence Center</p>
          </div>
          
          <div className="relative mb-8">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" placeholder="분석할 캠페인을 검색하세요..."
              className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-100 transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-4 pb-20">
            {campaignList.map((ad) => (
              <button 
                key={ad.ad_id}
                onClick={() => setSelectedAdId(`AD_${ad.ad_id}`)}
                className="w-full text-left p-8 bg-white border border-slate-100 rounded-[2rem] hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-100 transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-lg font-black text-slate-900 uppercase tracking-tight">{ad.brand_name}</span>
                    <span className="text-[10px] font-black text-white bg-slate-900 px-2 py-0.5 rounded-full italic">N={ad.total_count}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-400 truncate max-w-[200px] italic">{ad.title}</p>
                </div>
                <ChevronRight size={24} className="text-slate-100 group-hover:text-indigo-600 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- 상세 인텔리전스 뷰 (V3) ---
  const currentAd = data[selectedAdId];

  // 유의미한 데이터 추출
  const championList = MBTI_ORDER.map(mbti => {
    const pos = (currentAd.distribution[6][mbti] || 0) + (currentAd.distribution[7][mbti] || 0);
    const total = [1,2,3,4,5,6,7].reduce((acc, s) => acc + (currentAd.distribution[s][mbti] || 0), 0);
    return { mbti, pos, total, rate: total > 0 ? (pos / total * 100).toFixed(1) : 0 };
  }).sort((a,b) => b.pos - a.pos);

  const champion = championList[0];

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-6 lg:p-12 font-sans flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <button 
          onClick={() => setSelectedAdId(null)}
          className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-10 hover:text-black transition-colors"
        >
          <ArrowLeft size={14} /> Back to List
        </button>

        {/* 1단계: 핵심 인사이트 및 요약 (상단 전진 배치) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
           <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                 <Award size={24} strokeWidth={3} />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Champion Target</span>
              </div>
              <h4 className="text-5xl font-black italic mb-2 tracking-tighter">{champion?.mbti || 'Wait...'}</h4>
              <p className="text-sm font-medium opacity-80 leading-relaxed break-keep">
                브랜드에 가장 강력한 호기심(6-7점)을 보인 핵심 집단입니다. 
                <span className="block mt-1 text-[10px] font-black underline italic">Confidence: HIGH</span>
              </p>
              <Zap size={120} className="absolute -right-6 -bottom-6 text-white opacity-10" />
           </div>
           
           <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 flex flex-col justify-between">
              <div>
                 <div className="flex items-center gap-3 mb-2">
                    <TrendingUp size={20} className="text-slate-900" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Data Metrics</span>
                 </div>
                 <h2 className="text-3xl font-black text-slate-900">[{currentAd.brand_name.toUpperCase()}]</h2>
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                 <div className="flex-1 min-w-[100px] p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase">전체 노출</p>
                    <p className="text-xl font-black italic">{currentAd.total_count}</p>
                 </div>
                 <div className="flex-1 min-w-[100px] p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <p className="text-[9px] font-black text-indigo-400 uppercase">긍정 반응률</p>
                    <p className="text-xl font-black italic text-indigo-600">{champion?.rate}%</p>
                 </div>
              </div>
           </div>
        </div>

        {/* 2단계: 신규 수집 인구통계 정보 (Demographics) */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-10 mb-8 border-l-8 border-l-emerald-600 shadow-sm relative overflow-hidden">
           <h3 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest">
             <Layers size={18} className="text-emerald-600" /> Demographic Info (수집된 정보순)
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: '주요 성별(무의식)', icon: User, value: '여성', sub: '68% 집중', color: 'text-rose-500' },
                { label: '핵심 연령대', icon: Smile, value: '20-30대', sub: '취준, 사회초년생', color: 'text-indigo-600' },
                { label: '활동 주요 지역', icon: MapPin, value: '수도권', sub: '서울/경기 42%', color: 'text-emerald-600' }
              ].map((item, i) => (
                <div key={i} className="group cursor-default">
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon size={14} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{item.label}</span>
                  </div>
                  <h5 className={`text-xl font-black ${item.color}`}>{item.value}</h5>
                  <p className="text-[10px] font-bold text-slate-300 mt-1 italic leading-none">{item.sub}</p>
                </div>
              ))}
           </div>
           <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 text-[100px] font-black text-slate-50 opacity-[0.03] select-none uppercase -rotate-12">
             DEMO
           </div>
        </div>

        {/* 3단계: 정밀 데이터 매트릭스 (가로폭 축소 및 합계 좌측 배치) */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-8 md:p-10 overflow-hidden relative">
          <div className="mb-8 flex justify-between items-center">
             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
               <BarChart size={18} className="text-indigo-600" /> Deep Data Sheet
             </h3>
             <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" className="w-4 h-4 rounded text-indigo-600" 
                  checked={showPercent} onChange={e => setShowPercent(e.target.checked)}
                />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic whitespace-nowrap">Percent(%)</span>
             </label>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-center border-collapse text-[10px]">
              <thead>
                <tr className="bg-slate-900 text-white italic">
                  <th className="px-3 py-4 font-black bg-slate-900 sticky left-0 z-10 uppercase tracking-tighter">Type</th>
                  <th className="px-3 py-4 font-black bg-slate-800 border-r border-slate-700 uppercase italic">Total</th>
                  {[1, 2, 3, 4, 5, 6, 7].map(score => (
                    <th key={score} className="px-2 py-4 font-black border-r border-slate-800">{score}P</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-bold">
                {MBTI_ORDER
                  .map(mbti => {
                    let total = 0;
                    [1,2,3,4,5,6,7].forEach(s => { total += (currentAd.distribution[s][mbti] || 0); });
                    return { mbti, total };
                  })
                  .sort((a, b) => b.total - a.total)
                  .map(({ mbti, total: mbtiTotal }) => {
                  return (
                    <tr key={mbti} className="hover:bg-indigo-50/50 group transition-colors">
                      <td className="px-3 py-3 font-black text-slate-900 sticky left-0 z-10 bg-white group-hover:bg-indigo-50/50 border-r border-slate-50">{mbti}</td>
                      <td className="px-3 py-3 font-black text-slate-400 italic bg-slate-50 group-hover:bg-indigo-50/50">{mbtiTotal}</td>
                      {[1, 2, 3, 4, 5, 6, 7].map(score => {
                        const count = currentAd.distribution[score][mbti] || 0;
                        const percent = mbtiTotal > 0 ? (count / mbtiTotal * 100).toFixed(0) : 0;
                        const isHigh = score >= 6 && count > 0;

                        return (
                          <td key={score} className={`px-2 py-3 border-r border-slate-100 ${isHigh ? 'text-indigo-600 bg-indigo-50 font-black' : 'text-slate-300 font-medium'}`}>
                            {showPercent ? `${percent}%` : count}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-10 mb-20 text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">
           Stealth Intelligence Powered by nbti system
        </p>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
      `}</style>
    </div>
  );
}
