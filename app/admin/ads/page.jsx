'use client';

import React, { useState, useEffect } from 'react';
import { 
  Megaphone, Plus, Power, Layout, Target, Link as LinkIcon, X, Edit2, Trash2, DollarSign, Image as ImageIcon, CreditCard
} from 'lucide-react';

export default function AdsDashboard() {
  const [ads, setAds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    brand_name: '', placement: 'LOADING', target_mbti: '', title: '', link_url: '', emoji_icon: '🛍️', target_test: 'all', cpc: 250,
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
      brand_name: '', placement: 'LOADING', target_mbti: '', title: '', link_url: '', emoji_icon: '🛍️', target_test: 'all', cpc: 250,
      banner_img_url: '', pricing_model: 'CPC', daily_budget: 10000, ad_format: 'BANNER'
    });
    setIsModalOpen(true);
  }

  function openEditModal(ad) {
    setEditingId(ad.ad_id);
    setForm({
      brand_name: ad.brand_name || '', placement: ad.placement || 'LOADING', target_mbti: ad.target_mbti || '', title: ad.title || '', 
      link_url: ad.link_url || '', emoji_icon: ad.emoji_icon || '🛍️', target_test: ad.target_test || 'all', cpc: ad.cpc || 250,
      banner_img_url: ad.banner_img_url || '', pricing_model: ad.pricing_model || 'CPC', daily_budget: ad.daily_budget || 10000,
      ad_format: ad.ad_format || 'BANNER'
    });
    setIsModalOpen(true);
  }

  async function deleteAd(id) {
    if(!confirm('정말 이 캠페인을 삭제하시겠습니까? 데이터가 지워집니다.')) return;
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

  return (
    <div className="p-6 md:p-12 font-sans text-slate-900 mx-auto max-w-[1400px]">
      <div className="flex justify-between items-end mb-10 border-b border-slate-100 pb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter italic uppercase text-slate-900 flex items-center gap-4">
            <Megaphone className="text-indigo-600" size={36}/> 스폰서 캠페인 관리
          </h1>
          <p className="text-slate-500 font-bold text-sm mt-2">B2B 광고주 배너 수주, 과금 모델(Pricing), 이미지 에셋 및 타겟팅 통합 제어 센터</p>
        </div>
        <button 
          onClick={openNewModal}
          className="px-8 py-4 bg-indigo-600 text-white rounded-[24px] font-black text-sm flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <Plus size={20} /> 전문가용 새 캠페인 만들기
        </button>
      </div>

      {/* 리스트 뷰형 테이블 */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden mb-12">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-xs font-black text-slate-400 uppercase tracking-widest">
              <th className="py-6 px-8 rounded-tl-[32px]">광고 송출 상태</th>
              <th className="py-6 px-8">스폰서 (브랜드)</th>
              <th className="py-6 px-8">광고 카피 및 배너 URL</th>
              <th className="py-6 px-8 flex flex-col">광고 조건 <span>(타겟팅 / 과금 모델 / 예산)</span></th>
              <th className="py-6 px-8 rounded-tr-[32px] text-right">관리 액션</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ads.map((ad) => (
              <tr key={ad.ad_id} className={`transition-all hover:bg-slate-50/50 ${!ad.is_active && 'opacity-60 bg-slate-50/30'}`}>
                {/* 1. 활성 상태 (전원 스위치) */}
                <td className="py-6 px-8 w-40">
                  <button 
                    onClick={() => toggleStatus(ad.ad_id, ad.is_active)}
                    title={ad.is_active ? '크게 끄기' : '크게 켜기'}
                    className={`flex items-center justify-center gap-2 px-4 py-2 w-full rounded-full text-xs font-black tracking-widest uppercase transition-all shadow-sm border ${ad.is_active ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                  >
                    <div className={`w-2 h-2 rounded-full ${ad.is_active ? 'bg-indigo-500 animate-pulse' : 'bg-slate-300'}`} />
                    {ad.is_active ? 'ON 켜짐' : 'OFF 꺼짐'}
                  </button>
                </td>

                {/* 2. 브랜드명 및 썸네일 */}
                <td className="py-6 px-8 min-w-[200px]">
                  <div className="flex items-center gap-4">
                    {ad.banner_img_url ? (
                       <img src={ad.banner_img_url} className="w-14 h-14 object-cover rounded-2xl border border-slate-200 shadow-sm" alt="배너 썸네일"/>
                    ) : (
                       <span className="text-3xl bg-slate-50 w-14 h-14 rounded-2xl flex items-center justify-center border border-slate-100 shadow-inner group relative">
                         {ad.emoji_icon}
                         <span className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-800 text-white text-[10px] px-2 py-1 rounded-md transition-opacity">이모지 전용</span>
                       </span>
                    )}
                    <div>
                      <span className="font-black text-slate-800 tracking-wide text-lg block">{ad.brand_name}</span>
                      <span className="text-xs font-bold text-slate-400">ID: {ad.ad_id.split('-')[0]}</span>
                    </div>
                  </div>
                </td>

                {/* 3. 카피 문구 및 링크 */}
                <td className="py-6 px-8 max-w-[300px]">
                  <p className="font-bold text-slate-900 leading-snug w-full whitespace-pre-wrap text-sm" title={ad.title}>{ad.title}</p>
                  <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-indigo-400 truncate w-full bg-indigo-50/50 p-1.5 rounded-lg border border-indigo-100/50" title={ad.link_url || '링크 없음'}>
                    <LinkIcon size={12}/> {ad.link_url || '아웃바운드 링크 연결 없음 (노출 전용)'}
                  </div>
                </td>

                {/* 4. 과금 및 타겟 배치 모델 */}
                <td className="py-6 px-8 w-[280px]">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 mb-2">
                       <span className={`inline-flex items-center gap-1.5 ${ad.ad_format === 'NATIVE_LIKERT' ? 'bg-amber-50 text-amber-700' : (ad.ad_format === 'SPONSORED_LIKERT' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600')} text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest w-max`}>
                        <Layout size={12}/>
                        {ad.ad_format === 'NATIVE_LIKERT' ? '네이티브 위장' : (ad.ad_format === 'SPONSORED_LIKERT' ? '공식 스폰서형' : '전용 띠배너')}
                      </span>
                      <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest w-max">
                        <Target size={12}/>
                        {ad.target_test === 'all' ? '전체 (All)' : (ad.target_test === 'basic' ? '일반 종합' : (ad.target_test === 'love' ? '연애 전용' : (ad.target_test === 'job' ? '직장 전용' : '스피드 28문항')))}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 border border-yellow-200/50 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest w-max">
                        <CreditCard size={12}/> {ad.pricing_model} ({ad.cpc}원)
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">/ 일일 {Number(ad.daily_budget).toLocaleString()}원 한도 (노출제한)</span>
                    </div>

                    <div className="mt-3 bg-slate-100 rounded-full h-2.5 w-full overflow-hidden relative" title={`오늘 광고주 소진액: ${ad.spent_today?.toLocaleString()}원 / 총 예산: ${Number(ad.daily_budget).toLocaleString()}원`}>
                       <div className={`h-full rounded-full transition-all duration-1000 ${ad.spent_today >= ad.daily_budget ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min((ad.spent_today / (ad.daily_budget || 1)) * 100, 100)}%` }} />
                    </div>
                    <div className="flex justify-between items-center mt-1 px-1">
                      <span className="text-[10px] font-black text-slate-400">{ad.today_clicks} 클릭 발생</span>
                      <span className={`text-[10px] font-black ${ad.spent_today >= ad.daily_budget ? 'text-red-500' : 'text-emerald-600'}`}>₩{ad.spent_today?.toLocaleString()} 소진</span>
                    </div>
                  </div>
                </td>

                {/* 5. 메뉴 (액션) */}
                <td className="py-6 px-8">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => openEditModal(ad)}
                      className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md transition-all"
                      title="캠페인 수정 / 상세 에디터"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => deleteAd(ad.ad_id)}
                      className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-300 hover:bg-red-50 hover:shadow-md transition-all"
                      title="데이터베이스 영구 삭제"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {ads.length === 0 && (
              <tr>
                <td colSpan="5" className="py-20 text-center text-slate-400 font-bold text-sm bg-slate-50/50">
                  <Megaphone size={48} className="mx-auto text-slate-300 mb-4" />
                  현재 파트너십을 맺은 활성 브랜드 캠페인이 없습니다. 신규 캠페인을 등록해수제요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🚀 라이브 프리뷰 인스펙터 지원 초대형 에디터 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 lg:p-10">
           <div className="bg-white w-full max-w-6xl h-[90vh] rounded-[48px] relative shadow-2xl flex overflow-hidden">
             
             {/* 즉시 닫기 X 버튼 */}
             <button 
                onClick={() => setIsModalOpen(false)} 
                className="absolute top-6 right-6 lg:top-8 lg:right-8 p-3 bg-white/80 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full z-50 backdrop-blur-md shadow-sm border border-slate-100 transition-all hover:rotate-90"
             >
                <X size={24} />
             </button>

             {/* Left: 입력 폼 구역 */}
             <div className="w-1/2 p-12 overflow-y-auto custom-scrollbar border-r border-slate-100 flex flex-col justify-between">
               <div>
                  <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tighter">
                      <Edit2 className="text-indigo-500" /> {editingId ? '캠페인 내용 수정' : '새 광고 생성'}
                    </h2>
                    <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1 rounded-full border border-slate-200">
                      B2B 파트너 스튜디오
                    </span>
                  </div>
                 
                 <div className="space-y-6 flex-1 pt-2">
                    {/* 광고 포맷 듀얼 셀렉터 */}
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2"><Layout size={16}/> 1. 광고 송출 포맷 (Ad Format 상품) 선택</h3>
                      <div className="flex gap-3">
                        <label className={`flex-1 p-3 border rounded-2xl cursor-pointer transition-all ${form.ad_format === 'BANNER' ? 'border-indigo-500 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20' : 'border-slate-200 bg-white hover:border-slate-300'}`} onClick={() => setForm({...form, ad_format: 'BANNER'})}>
                          <span className="block text-sm font-black text-slate-800 mb-1">디스플레이 띠배너</span>
                          <span className="block text-[10px] text-slate-500 font-bold leading-snug">실제 문항 질문지 하단에 스폰서 외부 링크 전용 배너 삽입</span>
                        </label>
                        <label className={`flex-1 p-3 border rounded-2xl cursor-pointer transition-all ${form.ad_format === 'SPONSORED_LIKERT' ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20' : 'border-slate-200 bg-white hover:border-slate-300'}`} onClick={() => setForm({...form, ad_format: 'SPONSORED_LIKERT'})}>
                          <span className="block text-sm font-black text-slate-800 mb-1">공식 스폰서 문항 (오리지널)</span>
                          <span className="block text-[10px] text-slate-500 font-bold leading-snug">대형 브랜드 후원 라벨표와 함께 7점 척도 문항으로 공식 노출</span>
                        </label>
                        <label className={`flex-1 p-3 border rounded-2xl cursor-pointer transition-all ${form.ad_format === 'NATIVE_LIKERT' ? 'border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-500/20' : 'border-slate-200 bg-white hover:border-slate-300'}`} onClick={() => setForm({...form, ad_format: 'NATIVE_LIKERT'})}>
                          <span className="block text-sm font-black text-slate-800 mb-1">네이티브 문항 침투</span>
                          <span className="block text-[10px] text-slate-500 font-bold leading-snug">일반 테스트 성격 문항인 것처럼 광고를 100% 위장하여 삽입</span>
                        </label>
                      </div>
                    </div>

                    {/* 브랜딩 기초 */}
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                       <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2"><Edit2 size={16}/> 2. 디스플레이 기초 카피 정보</h3>
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                            <p className="text-xs font-bold text-slate-500 ml-2 mb-1.5">클라이언트 (브랜드명)</p>
                            <input placeholder="예: 무신사, 넷플릭스" className="w-full p-4 bg-white rounded-2xl border border-slate-200 focus:border-indigo-500 outline-none font-bold text-sm shadow-sm" value={form.brand_name} onChange={e => setForm({...form, brand_name: e.target.value})} />
                         </div>
                         <div>
                            <p className="text-xs font-bold text-slate-500 ml-2 mb-1.5">이모지 (이미지 없을 시 대체)</p>
                            <input className="w-full p-4 bg-white rounded-2xl border border-slate-200 focus:border-indigo-500 outline-none font-black text-sm text-center shadow-sm" value={form.emoji_icon} onChange={e => setForm({...form, emoji_icon: e.target.value})} maxLength={8} />
                         </div>
                       </div>
                       
                       <p className="text-xs font-bold text-slate-500 ml-2 mt-4 mb-1.5">심리 테스트형 노출 문구 (질문으로 위장)</p>
                       <textarea placeholder="예: 무의식적으로 새우깡의 바삭함을 찾게 될 때가 있다." className="w-full p-4 bg-white rounded-2xl border border-slate-200 focus:border-indigo-500 outline-none font-bold text-sm h-20 resize-none shadow-sm leading-relaxed" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                    </div>

                    {/* 랜딩 및 이미지 배너 자산 */}
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner">
                      <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2"><ImageIcon size={16}/> 3. 미디어 및 아웃바운드 링크 설정</h3>
                      <div className="mb-4">
                        <p className="text-xs font-bold text-slate-500 ml-2 mb-1">디스플레이 배너 이미지 URL 주소</p>
                        <p className="text-[10px] font-black tracking-widest text-amber-600 mb-2 ml-2 bg-amber-100 w-max px-2 py-1 rounded-md">권장 규격: 600px × 300px (2:1 와이드) IAB 모바일 표준</p>
                        <input type="text" placeholder="https://image-url.com/banner.jpg" className="w-full p-4 bg-white rounded-2xl border border-slate-200 focus:border-amber-500 outline-none font-bold text-sm text-lime-900 shadow-sm" value={form.banner_img_url} onChange={e => setForm({...form, banner_img_url: e.target.value})} />
                      </div>
                      
                      <p className="text-xs font-bold text-slate-500 ml-2 mb-1.5">최종 아웃바운드 클릭 URL (방문하기)</p>
                      <input type="text" placeholder="https://..." className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none font-bold text-sm text-emerald-700 shadow-sm" value={form.link_url} onChange={e => setForm({...form, link_url: e.target.value})} />
                    </div>

                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                       <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2"><CreditCard size={16}/> 4. 타겟팅 및 상업 (과금) 조건</h3>
                       <div className="grid grid-cols-2 gap-4 mb-4">
                         <div>
                           <p className="text-xs font-bold text-slate-500 ml-2 mb-1.5">노출 타겟팅 (Target)</p>
                           <select className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-sm text-slate-700 shadow-sm" value={form.target_test} onChange={e => setForm({...form, target_test: e.target.value})}>
                              <option value="all">모든 테스트 통합 (프리미엄 노출)</option>
                              <option value="basic">일반(종합) 심리 테스트 전용</option>
                              <option value="love">연애 세포 테스트 전용</option>
                              <option value="job">직장 생활 테스트 전용</option>
                              <option value="dynamic">스피드(다이나믹) 28문항 전용</option>
                           </select>
                         </div>
                         <div>
                           <p className="text-xs font-bold text-slate-500 ml-2 mb-1.5">구좌 위치 (Placement)</p>
                           <select className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-sm text-slate-700 shadow-sm" value={form.placement} onChange={e => setForm({...form, placement: e.target.value})}>
                              <option value="LOADING">테스트 문항 사이 (매복)</option>
                              <option value="RESULT_CARD">결과 페이지 하단 (종료)</option>
                           </select>
                         </div>
                       </div>
                       
                       <div className="grid grid-cols-3 gap-4">
                         <div>
                           <p className="text-xs font-bold text-slate-500 ml-2 mb-1.5">단가 모델</p>
                           <select className="w-full p-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-sm shadow-sm" value={form.pricing_model} onChange={e => setForm({...form, pricing_model: e.target.value})}>
                              <option value="CPC">CPC (클릭)</option>
                              <option value="CPM">CPM (노출)</option>
                              <option value="FIXED">고정(월)</option>
                           </select>
                         </div>
                         <div>
                           <p className="text-xs font-bold text-slate-500 ml-2 mb-1.5">거래 단가액 (₩)</p>
                           <input type="number" className="w-full p-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none font-black text-sm text-indigo-600 shadow-sm" value={form.cpc} onChange={e => setForm({...form, cpc: Number(e.target.value)})} />
                         </div>
                         <div>
                           <p className="text-xs font-bold text-slate-500 ml-2 mb-1.5">일일 예산 한도</p>
                           <input type="number" className="w-full p-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none font-black text-sm text-red-600 shadow-sm" value={form.daily_budget} onChange={e => setForm({...form, daily_budget: Number(e.target.value)})} />
                         </div>
                       </div>
                    </div>
                 </div>
               </div>
               
               <div className="flex gap-4 mt-8 pt-8 border-t border-slate-100 bg-white">
                 <button onClick={() => setIsModalOpen(false)} className="w-1/3 py-5 bg-slate-100 text-slate-500 rounded-[24px] font-black text-lg hover:bg-slate-200 transition-all">
                   취소
                 </button>
                 <button onClick={submitAd} className="w-2/3 py-5 bg-indigo-600 text-white rounded-[24px] font-black text-lg shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all">
                   {editingId ? '수정된 정보 덮어쓰기' : '런칭 및 활성화 승인'}
                 </button>
               </div>
             </div>

             {/* Right: 실시간 렌더링 프리뷰 구역 (Live Render) */}
             <div className="w-1/2 bg-slate-100 p-12 overflow-y-auto flex flex-col items-center relative custom-scrollbar">
                <div className="absolute top-6 right-10 flex items-center gap-2">
                   <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"/>
                   <span className="text-[10px] font-black text-slate-400 tracking-widest">LIVE PREVIEW</span>
                </div>
                
                <h3 className="text-xl font-black text-slate-800 mb-8 self-start w-full opacity-60">실제 고객에게 노출되는 형태</h3>
                
                {/* 1. 슬라이더(매복) 뷰 시뮬레이터 */}
                <div className="w-full max-w-[400px] bg-white rounded-[32px] p-8 shadow-xl mt-6 relative pb-16 transform hover:scale-[1.02] transition-transform">
                  <div className="absolute -top-3 -right-3 bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">모바일 스마트폰 뷰</div>
                  
                  {form.ad_format === 'SPONSORED_LIKERT' ? (
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl mb-4 w-full text-center relative overflow-hidden shadow-inner">
                      <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg">SPONSORED CAMPAIGN</div>
                      <span className="text-emerald-700 font-black text-xs tracking-widest mb-1 block">
                        {form.brand_name || '브랜드명'} 제휴 파트너
                      </span>
                      <h2 className="text-lg md:text-xl font-bold text-slate-800 leading-snug break-keep min-h-[4rem] px-2 w-full whitespace-pre-wrap mt-2">
                        {form.title || '공식 스폰서 광고 메시지 입력 시 표출'}
                      </h2>
                    </div>
                  ) : (
                    <>
                      <span className="text-indigo-600 font-black text-xs tracking-widest mb-3 block text-center">
                        QUESTION X
                      </span>
                      <h2 className="text-xl font-bold text-gray-800 leading-snug break-keep text-center whitespace-pre-wrap mb-4 px-4 min-h-[3rem]">
                        {form.ad_format === 'NATIVE_LIKERT' ? (form.title || '광고 메시지 입력 시 문항 내용으로 완전히 위장 표출') : '오리지널 진짜 심리 테스트 문항이 이 부분에 기본 표출됩니다.'}
                      </h2>
                    </>
                  )}

                  {/* 배너 렌더링 시뮬레이터 (BANNER 포맷일때만 보임) */}
                  { form.ad_format === 'BANNER' && (form.link_url || form.banner_img_url) && (
                    <div className="mt-4 mb-2 block w-[95%] bg-white border border-slate-200 rounded-xl p-3 shadow-sm mx-auto relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-slate-200/80 text-[8px] text-slate-500 font-black px-1.5 py-0.5 rounded-bl-lg backdrop-blur-sm z-10">스폰서 광고</div>
                      
                      {form.banner_img_url && (
                        <div className="w-full aspect-[2/1] mb-3 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                          <img src={form.banner_img_url} className="w-full h-full object-cover" alt="미리보기 배너" 
                               onError={(e) => { e.target.src="https://via.placeholder.com/600x300?text=Invalid+Ratio+Or+URL"; }}/>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between font-bold px-1">
                         <span className="text-slate-600 text-[12px] truncate pr-2 max-w-[70%]">공식 브랜드 웹사이트 알아보기</span>
                         <span className="text-indigo-500 text-[10px] group-hover:underline">방문하기 ↗</span>
                      </div>
                    </div>
                  )}

                  {/* 가상의 가짜 서베이 버튼스 */}
                  <div className="w-full mt-6 opacity-30 pointer-events-none">
                     <div className="w-[80%] mx-auto h-0.5 bg-slate-200 mb-6 absolute top-[75%] left-[10%] -z-10"/>
                     <div className="flex justify-between items-center px-4 mt-8">
                       {[...Array(7)].map((_, i) => <div key={i} className={`w-8 h-8 rounded-full border-2 border-slate-300 ${i===3 && 'bg-slate-200'}`} />)}
                     </div>
                  </div>
                </div>

                <div className="mt-8 text-center bg-white/50 backdrop-blur-sm px-6 py-4 rounded-3xl border border-slate-200 w-full max-w-[400px]">
                   <p className="text-[11px] font-bold text-slate-500 leading-relaxed text-left">
                     <span className="text-indigo-600 block mb-1">💡 B2B 영업 팁:</span>
                     현재 작성된 이 캠페인은 <strong className="text-slate-800">{form.target_test === 'all' ? '모든 유저' : form.target_test}</strong>에게 배포되며, 
                     광고주({form.brand_name || '브랜드명 미입력'})와 <strong className="text-slate-800">{form.pricing_model}</strong> 형태로 단가 <strong className="text-slate-800">{form.cpc}원</strong>에 계약되었습니다. 
                     일일 최대 노출(클릭) 한도 소진치인 <strong className="text-red-500">{form.daily_budget}원</strong> 도달 시 즉시 임시 중단됩니다.
                   </p>
                </div>
             </div>

           </div>
        </div>
      )}
    </div>
  );
}