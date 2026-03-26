'use client';

/**
 * [파일명: app/admin/brands/page.jsx]
 * 기능: 광고주 브랜드 파트너 관리 (울트라 미니멀리즘 - 한글화 완료)
 */

import React, { useState, useEffect } from 'react';
import { Building2, Plus, Trash2, ChevronLeft, Search, UserPlus } from 'lucide-react';

export default function App() {
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({ brand_name: '', contact_info: '' });

  useEffect(() => { fetchBrands(); }, []);

  async function fetchBrands() {
    const res = await fetch('/api/admin/brands');
    const data = await res.json();
    setBrands(data || []);
  }

  async function addBrand() {
    if (!form.brand_name) return;
    await fetch('/api/admin/brands', {
      method: 'POST',
      body: JSON.stringify(form)
    });
    setForm({ brand_name: '', contact_info: '' });
    fetchBrands();
  }

  async function deleteBrand(id) {
    if (!confirm('브랜드를 삭제하시겠습니까? 해당 브랜드의 광고도 모두 중단됩니다.')) return;
    await fetch(`/api/admin/brands?id=${id}`, { method: 'DELETE' });
    fetchBrands();
  }

  return (
    <div className="p-6 md:p-12 bg-[#fafafa] min-h-screen font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">

        {/* HEADER: 한글화 완료 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b-4 border-slate-900 pb-12 pt-20 md:pt-0 gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-slate-900 leading-none mb-4">공식 파트너사</h1>
            <p className="text-slate-500 font-bold text-lg">NBTI 공식 광고주 브랜드 통합 관리 시스템</p>
          </div>
          <div className="relative hidden md:block">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              placeholder="파트너사 검색..." 
              className="pl-14 pr-8 py-5 bg-white rounded-[2rem] border border-slate-100 text-[15px] font-black shadow-sm focus:ring-2 focus:ring-slate-900 w-80 outline-none transition-all" 
            />
          </div>
        </div>

        {/* 브랜드 등록 폼 (한글화 완료) */}
        <div className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-slate-100 shadow-sm mb-16">
          <h2 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-3 uppercase tracking-tighter leading-none">
            <UserPlus size={28} strokeWidth={3} /> 신규 브랜드 등록
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-3">
              <label className="text-[12px] font-black text-slate-900 uppercase tracking-widest ml-1">브랜드 명칭</label>
              <input 
                placeholder="브랜드 명칭 입력"
                className="w-full p-6 bg-slate-50 rounded-2xl border-none font-black text-lg focus:ring-2 focus:ring-slate-900 transition-all"
                value={form.brand_name}
                onChange={e => setForm({...form, brand_name: e.target.value})}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[12px] font-black text-slate-900 uppercase tracking-widest ml-1">담당자 연락처</label>
              <input 
                placeholder="담당자 연락처 또는 이메일"
                className="w-full p-6 bg-slate-50 rounded-2xl border-none font-black text-lg focus:ring-2 focus:ring-slate-900 transition-all"
                value={form.contact_info}
                onChange={e => setForm({...form, contact_info: e.target.value})}
              />
            </div>
          </div>
          <button 
            onClick={addBrand}
            className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-xl hover:bg-black transition-all shadow-2xl shadow-slate-100 flex items-center justify-center gap-3 tracking-tighter"
          >
            <Plus size={24} strokeWidth={3} /> 공식 파트너 등록 완료
          </button>
        </div>

        {/* 브랜드 리스트 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {brands.map((brand) => (
            <div key={brand.brand_id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-100 transition-all group relative">
              <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-300 mb-8 border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all">
                <Building2 size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tighter uppercase leading-none">{brand.brand_name}</h3>
              <p className="text-[14px] font-bold text-slate-400 tracking-tight">{brand.contact_info || '연락처 미기입'}</p>
              
              <button 
                onClick={() => deleteBrand(brand.brand_id)}
                className="absolute top-10 right-10 p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={24} />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <footer className="mt-32 pt-20 border-t border-slate-100 text-center opacity-10">
         <p className="text-[11px] font-black tracking-[1em] text-slate-900 uppercase">NBTI Partner Hub</p>
      </footer>
    </div>
  );
}