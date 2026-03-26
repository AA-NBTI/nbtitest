'use client';

/**
 * [파일명: app/admin/layout.jsx]
 * 기능: 관리자 포털 레이아웃 (컴팩트 사이드바 + 햄버거 메뉴 v8)
 * 업데이트: 사이드바 폭 30% 축소(200px), 모바일 햄버거 토글 시스템 도입
 */

import { useState } from 'react';
import { ShieldCheck, LayoutDashboard, Users, Megaphone, BarChart3, Activity, BookOpen, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { name: '통계분석', path: '/admin', icon: Activity },
    { name: '광고분석', path: '/admin/stats', icon: LayoutDashboard },
    { name: '스텔스', path: '/admin/stealth-analysis', icon: BarChart3 },
    { name: '캠페인', path: '/admin/ads', icon: Megaphone },
    { name: '광고', path: '/admin/ad-products', icon: BookOpen }
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-[#fafafa] flex font-sans text-slate-900 overflow-x-hidden relative -mt-[100px]">
      
      {/* ───── Mobile Header (Hamburger) ───── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#18181b] border-b border-zinc-800 z-[100] flex items-center justify-between px-6">
         <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
               <ShieldCheck className="text-zinc-900" size={18} />
            </div>
            <span className="font-black text-lg tracking-tighter text-white uppercase block leading-none">NBTI <span className="text-zinc-500">ADMIN</span></span>
         </Link>
         <button onClick={toggleSidebar} className="text-white p-2 hover:bg-zinc-800 rounded-lg transition-colors">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
         </button>
      </header>

      {/* ───── Admin Sidebar ───── */}
      <aside className={`
        w-[200px] bg-[#18181b] border-r border-zinc-800 h-screen fixed left-0 top-0 flex flex-col p-6 z-[110] 
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0
      `}>
        <Link href="/" className="hidden lg:flex items-center gap-3 mb-10 group transition-all hover:opacity-80">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center overflow-hidden">
            <ShieldCheck className="text-zinc-900" size={20} />
          </div>
          <div>
            <span className="font-black text-lg tracking-tighter text-white uppercase block leading-none">NBTI</span>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-0.5">ADMIN</span>
          </div>
        </Link>
        

        
        <nav className="space-y-1 flex-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                href={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 p-3.5 rounded-xl font-bold text-sm transition-all ${isActive ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300'}`}
              >
                <Icon size={16} strokeWidth={2.5} />
                <span className="tracking-tight text-[13.5px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 mt-auto border-t border-zinc-800">
           <Link href="/my-dashboard" className="flex items-center gap-3 p-3 rounded-xl text-zinc-600 hover:text-white transition-all font-bold text-[12px] uppercase tracking-tighter">
              <Users size={16} />
              USER DASH
           </Link>
        </div>
      </aside>

      {/* ───── Overlay (for Mobile Sidebar) ───── */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[105] lg:hidden transition-opacity"
        />
      )}

      {/* ───── Content Area ───── */}
      <div className="flex-1 lg:ml-[200px] overflow-y-auto min-h-screen pt-16 lg:pt-0">
        {children}
      </div>
    </div>
  );
}
