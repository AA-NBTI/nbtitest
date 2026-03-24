'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Plus, Trash2, ChevronLeft, Search, UserPlus } from 'lucide-react';

/**
 * [파일명: app/admin/brands/page.jsx]
 * 기능: 광고주 브랜드 파트너 관리
 */

export default function App() {
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({ brand_name: '', contact_info: '' });

  useEffect(() => { fetchBrands(); }, []);

  async function fetchBrands() {
    const res = await fetch('/api/admin/brands');
    const data = await res.json();
    setBrands(data);
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
    <div className="p-6 md:p-12">
      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter italic uppercase">Partners</h1>
            <p className="text-slate-500 font-bold text-sm">공식 광고주 브랜드 리스트</p>
          </div>
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              placeholder="Search brands..." 
              className="pl-12 pr-6 py-4 bg-white rounded-2xl border border-slate-100 text-sm font-bold shadow-sm focus:ring-2 focus:ring-indigo-600 w-64" 
            />
          </div>
        </div>

        {/* 브랜드 등록 폼 */}
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm mb-12">
          <h2 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-2 uppercase tracking-tighter">
            <UserPlus className="text-indigo-600" size={24} /> Register New Brand
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Brand Name</label>
              <input 
                placeholder="예: 무신사, 올리브영"
                className="w-full p-5 bg-slate-50 rounded-3xl border-none font-bold text-sm focus:ring-2 focus:ring-indigo-600"
                value={form.brand_name}
                onChange={e => setForm({...form, brand_name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Contact Point</label>
              <input 
                placeholder="담당자 연락처 또는 이메일"
                className="w-full p-5 bg-slate-50 rounded-3xl border-none font-bold text-sm focus:ring-2 focus:ring-indigo-600"
                value={form.contact_info}
                onChange={e => setForm({...form, contact_info: e.target.value})}
              />
            </div>
          </div>
          <button 
            onClick={addBrand}
            className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
          >
            <Plus size={20} /> 브랜드 파트너 등록
          </button>
        </div>

        {/* 브랜드 리스트 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <div key={brand.brand_id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative">
              <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-6 group-hover:text-indigo-600 transition-colors">
                <Building2 size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-1">{brand.brand_name}</h3>
              <p className="text-xs font-bold text-slate-400 tracking-tight">{brand.contact_info || '연락처 미기입'}</p>
              
              <button 
                onClick={() => deleteBrand(brand.brand_id)}
                className="absolute top-8 right-8 p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}