'use client';

/**
 * [파일명: app/admin/ads/page.jsx]
 * 기능: 캠페인 관리 – 2분할 구조 v10
 * 좌열 (2/5): 제목 + 요약 카드 + 필터 + 신규 버튼
 * 우열 (3/5): 캠페인 목록 카드 + 편집 모달
 */

import React, { useState, useEffect } from 'react';
import {
  Megaphone, Plus, Target, Link as LinkIcon, X, Edit2, Trash2,
  CheckCircle2, XCircle, Filter, LayoutDashboard, Layers
} from 'lucide-react';

const PLACEMENT_MAP = {
  TEST_FIXED_TOP:    { no: '01', label: '상단 고정' },
  TEST_FIXED_BOTTOM: { no: '02', label: '하단 고정' },
  NATIVE_LIKERT:     { no: '03', label: '스텔스 문항' },
  SPONSORED_LIKERT:  { no: '03', label: '스텔스 문항' },
  STEALTH:           { no: '03', label: '스텔스 문항' },
  LOADING_BANNER:    { no: '04', label: '로딩 화면' },
  LOADING:           { no: '04', label: '로딩 화면' },
  RESULT_TOP:        { no: '05', label: '결과 상단' },
  RESULT_BOTTOM:     { no: '06', label: '결과 하단' },
  MAIN_TOP:          { no: '07', label: '메인 홈' },
  HOME_STATION:      { no: '07', label: '메인 홈' },
};

const getPlacement = (p) => PLACEMENT_MAP[p] || { no: '??', label: p };

export default function AdsDashboard() {
  const [ads, setAds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlacement, setFilterPlacement] = useState('all');

  const [form, setForm] = useState({
    brand_name: '', placement: 'TEST_FIXED_TOP', target_mbti: '',
    title: '', link_url: '', target_test: 'all', cpc: 250,
    banner_img_url: '', pricing_model: 'CPC', daily_budget: 10000, ad_format: 'BANNER'
  });

  useEffect(() => { fetchAds(); }, []);

  async function fetchAds() {
    const res = await fetch('/api/admin/ads', { cache: 'no-store' });
    const data = await res.json();
    setAds(data || []);
  }

  async function toggleStatus(id, current) {
    await fetch('/api/admin/ads', {
      method: 'PATCH',
      body: JSON.stringify({ ad_id: id, is_active: !current })
    });
    fetchAds();
  }

  function openNewModal() {
    setEditingId(null);
    setForm({
      brand_name: '', placement: 'TEST_FIXED_TOP', target_mbti: '',
      title: '', link_url: '', target_test: 'all', cpc: 250,
      banner_img_url: '', pricing_model: 'CPC', daily_budget: 10000, ad_format: 'BANNER'
    });
    setIsModalOpen(true);
  }

  function openEditModal(ad) {
    setEditingId(ad.ad_id);
    setForm({
      brand_name: ad.brand_name || '', placement: ad.placement || 'TEST_FIXED_TOP',
      target_mbti: ad.target_mbti || '', title: ad.title || '',
      link_url: ad.link_url || '', target_test: ad.target_test || 'all',
      cpc: ad.cpc || 250, banner_img_url: ad.banner_img_url || '',
      pricing_model: ad.pricing_model || 'CPC', daily_budget: ad.daily_budget || 10000,
      ad_format: ad.ad_format || 'BANNER'
    });
    setIsModalOpen(true);
  }

  async function deleteAd(id) {
    if (!confirm('이 캠페인을 삭제하시겠습니까?')) return;
    await fetch(`/api/admin/ads?id=${id}`, { method: 'DELETE' });
    fetchAds();
  }

  async function submitAd() {
    if (!form.title || !form.brand_name) return;
    if (editingId) {
      await fetch('/api/admin/ads', { method: 'PATCH', body: JSON.stringify({ ad_id: editingId, ...form }) });
    } else {
      await fetch('/api/admin/ads', { method: 'POST', body: JSON.stringify(form) });
    }
    setIsModalOpen(false);
    fetchAds();
  }

  const filteredAds = ads.filter(ad => {
    if (filterStatus === 'active' && !ad.is_active) return false;
    if (filterStatus === 'inactive' && ad.is_active) return false;
    if (filterPlacement !== 'all' && ad.placement !== filterPlacement) return false;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      if (!ad.brand_name?.toLowerCase().includes(lower) && !ad.title?.toLowerCase().includes(lower)) return false;
    }
    return true;
  });

  const activeCount = ads.filter(a => a.is_active).length;
  const inactiveCount = ads.filter(a => !a.is_active).length;

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans text-slate-900">
      <div className="p-4 md:p-8 lg:p-10 mx-auto max-w-[1200px]">

        <div className="pt-8 grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* ══════════════════════════════
              좌열: 제목 + 현황 + 필터
          ══════════════════════════════ */}
          <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-10">

            {/* 페이지 제목 */}
            <div className="pb-5 border-b border-slate-200">
              <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1.5 leading-none">Campaign Administration</p>
              <h1 className="text-2xl font-black tracking-tighter uppercase text-slate-900 leading-none">캠페인 관리</h1>
            </div>

            {/* 요약 3카드 */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '전체', value: ads.length, icon: Megaphone },
                { label: '활성', value: activeCount, icon: CheckCircle2 },
                { label: '비활성', value: inactiveCount, icon: XCircle },
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

            {/* 신규 등록 버튼 */}
            <button
              onClick={openNewModal}
              className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-black text-[13px] flex items-center justify-center gap-2 hover:bg-black transition-all shadow-sm active:scale-95 uppercase tracking-widest"
            >
              <Plus size={15} strokeWidth={2.5} /> 신규 캠페인 등록
            </button>

            {/* 검색 */}
            <div>
              <input
                type="text"
                placeholder="브랜드 또는 타이틀 검색..."
                className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-[13px] font-bold outline-none focus:ring-2 focus:ring-slate-900 shadow-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* 상태 필터 */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-2">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Filter size={12} /> 필터
              </p>
              <div className="flex gap-2">
                {[
                  { val: 'all', label: '전체' },
                  { val: 'active', label: 'ON' },
                  { val: 'inactive', label: 'OFF' },
                ].map(f => (
                  <button
                    key={f.val}
                    onClick={() => setFilterStatus(f.val)}
                    className={`flex-1 py-2 rounded-lg text-[12px] font-black uppercase tracking-wider transition-all ${filterStatus === f.val ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <select
                value={filterPlacement}
                onChange={(e) => setFilterPlacement(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border-none rounded-lg font-black text-[12px] text-slate-700 outline-none"
              >
                <option value="all">구좌: 전체</option>
                <option value="TEST_FIXED_TOP">01 - 상단 고정</option>
                <option value="TEST_FIXED_BOTTOM">02 - 하단 고정</option>
                <option value="NATIVE_LIKERT">03 - 스텔스 문항</option>
                <option value="LOADING_BANNER">04 - 로딩 화면</option>
                <option value="RESULT_TOP">05 - 결과 상단</option>
                <option value="RESULT_BOTTOM">06 - 결과 하단</option>
                <option value="MAIN_TOP">07 - 메인 홈</option>
              </select>
            </div>
          </div>

          {/* ══════════════════════════════
              우열: 캠페인 목록
          ══════════════════════════════ */}
          <div className="lg:col-span-3 min-h-[60vh] pb-16">

            {filteredAds.length === 0 ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                  <Megaphone size={24} className="text-slate-300" />
                </div>
                <p className="text-[13px] font-black text-slate-900 uppercase tracking-widest mb-2">캠페인 없음</p>
                <p className="text-[12px] font-bold text-slate-400">신규 캠페인을 등록하거나 필터를 조정하세요</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAds.map(ad => {
                  const p = getPlacement(ad.placement);
                  return (
                    <div
                      key={ad.ad_id}
                      className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:border-slate-300 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* 왼쪽: 번호 + 정보 */}
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-[14px] shrink-0">
                            {p.no}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-black text-[14px] text-slate-900 truncate">{ad.brand_name}</span>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.label}</span>
                            </div>
                            <p className="text-[13px] font-bold text-slate-500 truncate">{ad.title}</p>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-wider mt-1">{ad.ad_id?.slice(0, 12)}...</p>
                          </div>
                        </div>
                        {/* 오른쪽: 상태 + 액션 */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => toggleStatus(ad.ad_id, ad.is_active)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-black tracking-widest uppercase transition-all ${ad.is_active ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                          >
                            {ad.is_active ? 'ON' : 'OFF'}
                          </button>
                          <button
                            onClick={() => openEditModal(ad)}
                            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
                          >
                            <Edit2 size={15} strokeWidth={1.5} />
                          </button>
                          <button
                            onClick={() => deleteAd(ad.ad_id)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={15} strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 등록/편집 모달 ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h2 className="text-[15px] font-black tracking-tighter leading-none uppercase">
                  {editingId ? 'Edit Campaign' : 'New Campaign'}
                </h2>
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Master Administration Unit</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {[
                { label: '브랜드명', key: 'brand_name', placeholder: 'BRAND ID', type: 'text' },
                { label: '캠페인 타이틀', key: 'title', placeholder: '캠페인 타이틀 입력', type: 'text' },
              ].map(f => (
                <div key={f.key} className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-slate-400 ml-1">{f.label}</label>
                  <input
                    type={f.type}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg font-bold text-[13px] focus:ring-1 focus:ring-slate-900 transition-all outline-none"
                    value={form[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                  />
                </div>
              ))}

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase text-slate-400 ml-1">상품 번호</label>
                <select
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg font-bold text-[13px] outline-none"
                  value={form.placement}
                  onChange={(e) => setForm({ ...form, placement: e.target.value })}
                >
                  <option value="TEST_FIXED_TOP">01 - 상단 고정</option>
                  <option value="TEST_FIXED_BOTTOM">02 - 하단 고정</option>
                  <option value="NATIVE_LIKERT">03 - 스텔스 문항</option>
                  <option value="LOADING_BANNER">04 - 로딩 화면</option>
                  <option value="RESULT_TOP">05 - 결과 상단</option>
                  <option value="RESULT_BOTTOM">06 - 결과 하단</option>
                  <option value="MAIN_TOP">07 - 메인 홈</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase text-slate-400 ml-1">랜딩 URL</label>
                <div className="relative">
                  <LinkIcon size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="text"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg font-bold text-[13px] outline-none"
                    value={form.link_url}
                    onChange={(e) => setForm({ ...form, link_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-50 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2.5 bg-white text-slate-400 font-black rounded-lg hover:bg-slate-100 transition-all text-[13px] uppercase tracking-widest"
              >
                취소
              </button>
              <button
                onClick={submitAd}
                className="flex-1 py-2.5 bg-slate-900 text-white font-black rounded-lg hover:bg-black transition-all text-[13px] uppercase tracking-widest shadow-sm"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}