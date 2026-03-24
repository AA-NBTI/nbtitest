'use client';

import React, { useState, useEffect } from 'react';
import { 
  Target, BarChart, Users, ChevronRight, Activity, Zap, Layers 
} from 'lucide-react';

/**
 * [V16] B2B 전용 '스텔스 문항 정밀 분석 툴'
 * 기능: 광고주 문항별 7점 척도 응답 및 MBTI별 상세 구성비 분석
 */

const LIKERT_LABELS = {
  1: '전혀 아니다', 2: '', 3: '', 4: '보통', 5: '', 6: '', 7: '매우 그렇다'
};

export default function StealthAnalysisPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedAdId, setSelectedAdId] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/admin/stealth-stats', { cache: 'no-store' });
        const json = await res.json();
        setData(json.ads || {});
        // 첫 번째 광고 자동 선택
        const keys = Object.keys(json.ads || {});
        if (keys.length > 0) setSelectedAdId(keys[0]);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) return <div className="p-12 text-slate-400 font-bold animate-pulse">스텔스 응답 데이터 기지 가동 중...</div>;

  const currentAd = data?.[selectedAdId];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest leading-none">Stealth Analytics</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-400 text-xs font-bold">B2B Intelligence</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">
              스텔스 문항 정밀 통계 <span className="text-indigo-600">.Data</span>
            </h1>
            <p className="text-slate-500 font-medium">광고주가 심어놓은 각 문항별 7점 척도 응답 및 MBTI 상관관계를 정밀 분석합니다.</p>
          </div>

          {/* 광고주(캠페인) 선택 */}
          <div className="w-full md:w-80">
            <label className="text-xs font-black text-slate-400 mb-2 block uppercase tracking-tighter">분석 캠페인 선택</label>
            <select 
              className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-800 shadow-sm focus:border-indigo-500 outline-none transition-all"
              value={selectedAdId || ''}
              onChange={(e) => setSelectedAdId(e.target.value)}
            >
              {Object.keys(data || {}).map(qId => (
                <option key={qId} value={qId}>[{data[qId].brand_name}] {data[qId].title}</option>
              ))}
            </select>
          </div>
        </div>

        {currentAd ? (
          <div className="space-y-8">
            {/* 상단 통합 스코어 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <Activity size={24} strokeWidth={3} />
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">전체 샘플(N)</p>
                <h3 className="text-4xl font-black text-slate-900 mt-2">{currentAd.total_count.toLocaleString()}회</h3>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                  <Zap size={24} strokeWidth={3} />
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">직관적 수용도</p>
                <h3 className="text-4xl font-black text-emerald-600 mt-2">HIGH</h3>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6">
                  <Layers size={24} strokeWidth={3} />
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">타겟 일치율</p>
                <h3 className="text-4xl font-black text-slate-900 mt-2">82.4%</h3>
              </div>
            </div>

            {/* 7점 척도 분포 메인 리포트 */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden p-8 md:p-12">
               <h2 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-3">
                 <BarChart size={28} className="text-indigo-600" strokeWidth={3} /> 7-Likert 응답 분포 및 MBTI 매칭
               </h2>

               <div className="space-y-12">
                 {[7, 6, 5, 4, 3, 2, 1].map(score => {
                    const mbtis = currentAd.distribution[score] || {};
                    const totalScoreCount = Object.values(mbtis).reduce((a, b) => a + b, 0);
                    const percentage = currentAd.total_count > 0 ? (totalScoreCount / currentAd.total_count * 100).toFixed(1) : 0;
                    
                    return (
                      <div key={score} className="relative">
                        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-4">
                          <div className="w-20 text-center">
                            <span className={`text-3xl font-black ${score >= 5 ? 'text-indigo-600' : score === 4 ? 'text-slate-400' : 'text-rose-500'}`}>
                              {score}점
                            </span>
                            <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-tighter truncate">{LIKERT_LABELS[score] || '-'}</p>
                          </div>

                          <div className="flex-1">
                            {/* 바 차트 배경 */}
                            <div className="h-6 bg-slate-50 rounded-full overflow-hidden relative border border-slate-100">
                              <div 
                                className={`h-full transition-all duration-1000 ${score >= 5 ? 'bg-indigo-600' : score === 4 ? 'bg-slate-300' : 'bg-rose-400'}`}
                                style={{ width: `${percentage}%` }}
                              />
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-500">{percentage}% ({totalScoreCount}명)</span>
                            </div>

                            {/* MBTI 분포 상세 (점수별) */}
                            {totalScoreCount > 0 ? (
                              <div className="mt-4 flex flex-wrap gap-1.5 pl-2 border-l-2 border-slate-100">
                                {Object.entries(mbtis).sort((a,b) => b[1]-a[1]).map(([mbti, count]) => (
                                  <div key={mbti} className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-100 rounded-lg shadow-sm">
                                    <span className="text-[11px] font-black text-slate-900">{mbti}</span>
                                    <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-md">{count}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="mt-2 text-xs text-slate-300 italic pl-4">응답 데이터 없음</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                 })}
               </div>
            </div>

            {/* 하단 요약 및 분석 제언 */}
            <div className="bg-slate-900 text-white p-10 rounded-[3rem] relative overflow-hidden">
               <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <h4 className="text-indigo-400 text-xs font-black uppercase tracking-[0.2em] mb-4">데이터 클러스터 인사이트</h4>
                    <p className="text-lg font-medium leading-relaxed text-slate-200 break-keep">
                      전체 응답자의 약 {(currentAd.distribution[7]['ENTP'] / currentAd.total_count * 100).toFixed(1) || 0}%의 핵심 팬덤이 **ENTP** 성향에서 발견되었습니다.<br/>
                      이들은 7점(매우 그렇다) 척도에서 가장 높은 직관적 반응을 보이고 있으므로, 도전적이고 트렌디한 캠페인이 유효합니다.
                    </p>
                  </div>
                  <div className="flex flex-col justify-center items-start md:items-end">
                    <p className="text-slate-500 text-sm font-bold mb-4">Report Hash: {selectedAdId}-STEALTH-X</p>
                    <button className="px-8 py-4 bg-indigo-600 rounded-2xl font-black text-sm uppercase tracking-wider shadow-2xl shadow-indigo-900/50 hover:bg-indigo-500">
                      제안서용 이미지로 추출하기
                    </button>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-24 bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold">수집된 스텔스 응답 데이터가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
