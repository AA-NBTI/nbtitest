'use client';

/**
 * [파일명: app/admin/stealth-analysis/page.jsx]
 * 기능: 스텔스 캠페인 행동 패턴 분석 – 2분할 구조 v8
 * 좌열 (2/5): 제목 + 요약 + 검색/필터 + 캠페인 목록
 * 우열 (3/5): 선택된 캠페인 상세 분석
 */

import React, { useState, useEffect } from 'react';
import {
  Target, Users, Activity, Zap, Search, CheckCircle2,
  Timer, TrendingUp, BarChart3, MousePointer2, Brain
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
  const [isMounted, setIsMounted] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [realOnly, setRealOnly] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    async function loadStats() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/stealth-stats?realOnly=${realOnly}`, { cache: 'no-store' });
        const json = await res.json();
        const filtered = {};
        Object.entries(json.ads || {}).forEach(([id, ad]) => {
          const format = (ad.ad_format || '').toUpperCase();
          if (format === 'SPONSORED_LIKERT' || format === 'NATIVE_LIKERT' || format === 'STEALTH' || id.startsWith('AD_')) {
            filtered[id] = ad;
          }
        });
        setData(filtered);
        setLoading(false);
      } catch (err) {
        console.error('Stealth Stats Load Failed:', err);
        setLoading(false);
      }
    }
    loadStats();
  }, [realOnly]);

  if (!isMounted || (loading && Object.keys(data).length === 0)) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-20 text-center">
      <div className="w-8 h-8 rounded-full border-4 border-slate-100 border-t-slate-900 animate-spin mb-4" />
      <p className="font-black text-slate-900 tracking-widest text-[11px] uppercase opacity-20">스텔스 엔진 로딩 중...</p>
    </div>
  );

  const campaignList = Object.values(data).filter(ad =>
    ad.brand_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalResponses = campaignList.reduce((s, ad) => s + (ad.total_count || 0), 0);
  const avgScore = campaignList.length > 0
    ? (campaignList.reduce((s, ad) => s + (Number(ad.avg_val) || 0), 0) / campaignList.length).toFixed(2)
    : '0.00';

  // 선택된 캠페인 데이터
  const selectedAd = selectedAdId
    ? (data[selectedAdId.replace('AD_', '')] || data[selectedAdId])
    : null;

  const mbtiDist = selectedAd?.mbti_dist || {};
  const maxMbtiCount = Math.max(...Object.values(mbtiDist), 1);
  const topType = Object.entries(mbtiDist).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
  const lowType = Object.entries(mbtiDist).sort((a, b) => a[1] - b[1])[0]?.[0] || '-';

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans text-slate-900">
      <div className="p-4 md:p-8 lg:p-10 mx-auto max-w-[1200px]">

        <div className="pt-8 grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* ══════════════════════════════
              좌열: 제목 + 요약 + 목록
          ══════════════════════════════ */}
          <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-10">

            {/* 페이지 제목 */}
            <div className="pb-5 border-b border-slate-200">
              <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1.5 leading-none">Stealth Intelligence</p>
              <h1 className="text-2xl font-black tracking-tighter uppercase text-slate-900 leading-none">스텔스 분석</h1>
            </div>

            {/* 요약 3카드 */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '캠페인', value: campaignList.length, icon: Target },
                { label: '총 응답', value: totalResponses, icon: Users },
                { label: '평균점수', value: avgScore, icon: Zap },
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

            {/* 검색 + 필터 */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input
                  type="text"
                  placeholder="캠페인 또는 브랜드 검색..."
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-[13px] font-bold outline-none focus:ring-2 focus:ring-slate-900 shadow-sm transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-black text-slate-900 uppercase tracking-widest leading-none">데이터 필터</p>
                  <p className="text-[11px] font-bold text-slate-400 mt-0.5">{realOnly ? '실사용자 중심' : '전체 데이터'}</p>
                </div>
                <button
                  onClick={() => setRealOnly(!realOnly)}
                  className={`w-11 h-5.5 rounded-full transition-all duration-300 relative ${realOnly ? 'bg-slate-900' : 'bg-slate-200'}`}
                  style={{ height: '24px', width: '44px' }}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-[4px] transition-all duration-300 shadow-sm ${realOnly ? 'left-[24px]' : 'left-[4px]'}`} />
                </button>
              </div>
            </div>

            {/* 캠페인 목록 */}
            <nav className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden max-h-[50vh] overflow-y-auto">
              {campaignList.length === 0 ? (
                <div className="p-6 text-center text-slate-300 font-black text-[11px] uppercase tracking-widest">
                  캠페인 없음
                </div>
              ) : (
                campaignList.map((ad) => {
                  const adKey = `AD_${ad.ad_id}`;
                  const isActive = selectedAdId === adKey;
                  return (
                    <button
                      key={ad.ad_id}
                      onClick={() => setSelectedAdId(isActive ? null : adKey)}
                      className={`w-full flex items-center justify-between px-5 py-4 text-left transition-all border-b border-slate-50 last:border-0 ${isActive ? 'bg-slate-900 text-white' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <p className={`text-[13px] font-black tracking-tight truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                          {ad.brand_name}
                        </p>
                        <p className={`text-[11px] font-bold truncate mt-0.5 ${isActive ? 'text-slate-400' : 'text-slate-400'}`}>
                          {ad.title}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-[11px] font-black ${isActive ? 'text-slate-400' : 'text-slate-300'} uppercase`}>N={ad.total_count || 0}</p>
                        <p className={`text-[13px] font-black ${isActive ? 'text-white' : 'text-slate-900'}`}>{(ad.avg_val || 0).toFixed(1)}pt</p>
                      </div>
                    </button>
                  );
                })
              )}
            </nav>
          </div>

          {/* ══════════════════════════════
              우열: 상세 분석
          ══════════════════════════════ */}
          <div className="lg:col-span-3 min-h-[60vh] pb-16">

            {!selectedAd ? (
              /* 빈 상태 */
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center bg-white rounded-xl border border-slate-100 shadow-sm p-12">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                  <Brain size={28} className="text-slate-300" />
                </div>
                <p className="text-[13px] font-black text-slate-900 uppercase tracking-widest mb-2">캠페인을 선택하세요</p>
                <p className="text-[12px] font-bold text-slate-400">좌측 목록에서 분석할 캠페인을 클릭하면<br />상세 행동 패턴 분석이 표시됩니다</p>
              </div>
            ) : (
              <div className="space-y-5">

                {/* 캠페인 헤더 */}
                <div className="bg-slate-900 px-8 py-6 rounded-xl text-white relative overflow-hidden">
                  <TrendingUp className="absolute -bottom-6 -right-6 text-white/5 w-32 h-32" />
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1">STEALTH CAMPAIGN REPORT</p>
                  <h2 className="text-xl font-black tracking-tighter leading-none mb-1 uppercase">{selectedAd.brand_name}</h2>
                  <p className="text-[13px] font-bold text-slate-400 truncate">{selectedAd.title}</p>
                </div>

                {/* 핵심 지표 3카드 */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: '총 응답 표본', value: selectedAd.total_count || 0, sub: 'SAMPLE N', icon: Users },
                    { label: '평균 브랜드 점수', value: (selectedAd.avg_val || 0).toFixed(2), sub: 'AVG SCORE', icon: Zap },
                    { label: '평균 응답 속도', value: `${(selectedAd.avg_engagement_ms || 0).toLocaleString()}ms`, sub: 'AVG SPEED', icon: Timer },
                  ].map((s, i) => (
                    <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:border-slate-900 transition-all group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 bg-slate-50 rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-all">
                          <s.icon size={16} />
                        </div>
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{s.sub}</span>
                      </div>
                      <p className="text-2xl font-black text-slate-900 tracking-tighter mb-0.5 leading-none">{s.value}</p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* 상위/하위 성향 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-900 inline-block" /> 최고 반응 성향
                    </p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">{topType}</p>
                    <p className="text-[11px] text-slate-400 font-bold mt-1">{mbtiDist[topType] || 0}회 응답</p>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-200 inline-block" /> 최저 반응 성향
                    </p>
                    <p className="text-3xl font-black text-slate-300 tracking-tighter">{lowType}</p>
                    <p className="text-[11px] text-slate-400 font-bold mt-1">{mbtiDist[lowType] || 0}회 응답</p>
                  </div>
                </div>

                {/* MBTI 반응 분포 막대 차트 */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                  <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-widest mb-6 pb-4 border-b border-slate-50 flex items-center gap-2">
                    <BarChart3 size={14} className="text-slate-400" /> 16 성향 반응 분포
                  </h3>
                  <div className="grid grid-cols-8 gap-2">
                    {MBTI_ORDER.map(type => {
                      const count = mbtiDist[type] || 0;
                      const pct = (count / maxMbtiCount) * 100;
                      const isTop = type === topType;
                      return (
                        <div key={type} className="group flex flex-col items-center">
                          <div className="w-full h-24 bg-slate-50 rounded-xl overflow-hidden relative flex flex-col justify-end border border-slate-100 group-hover:border-slate-400 transition-all">
                            <div
                              className={`w-full transition-all duration-1000 ${isTop ? 'bg-slate-900' : 'bg-slate-300 group-hover:bg-slate-600'}`}
                              style={{ height: `${Math.max(pct, count > 0 ? 8 : 0)}%` }}
                            />
                            {count > 0 && (
                              <p className="absolute inset-x-0 bottom-1.5 text-center text-[9px] font-black text-white mix-blend-difference">{count}</p>
                            )}
                          </div>
                          <p className={`text-center text-[10px] font-black mt-2 tracking-tighter ${isTop ? 'text-slate-900' : 'text-slate-400'}`}>{type}</p>
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
