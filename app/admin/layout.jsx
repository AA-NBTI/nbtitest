'use client';

import { ShieldCheck, LayoutDashboard, Users, Megaphone, BarChart3, Activity } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'MBTI 테스트 분석', path: '/admin', icon: Activity },
    { name: '광고 퍼포먼스 통계', path: '/admin/stats', icon: LayoutDashboard },
    { name: '제휴 파트너사 목록', path: '/admin/brands', icon: Users },
    { name: '스폰서 캠페인 관리', path: '/admin/ads', icon: Megaphone }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      <aside className="w-64 bg-white border-r border-slate-200 p-8 hidden lg:block">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <span className="font-black text-xl tracking-tighter italic">NBTI ADMIN</span>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                href={item.path}
                className={`flex items-center gap-3 p-4 rounded-2xl font-bold text-sm transition-all ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
