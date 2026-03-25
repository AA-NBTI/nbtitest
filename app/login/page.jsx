'use client';

/**
 * [파일명: app/login/page.jsx]
 * 기능: 로그인 페이지 (풀 한글화 및 UX 강화)
 */

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, LogIn, Mail, Lock, UserPlus, Home } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        setError('로그인 중 오류가 발생했습니다: ' + error.message);
      }
      setLoading(false);
    } else {
      router.push('/my-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-8 pt-12 md:pt-24 font-sans">
      <div className="w-full max-w-[400px]">
        <Link href="/" className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-12 hover:text-black transition-colors">
          <ArrowLeft size={14} /> 메인으로 돌아가기
        </Link>

        <div className="flex flex-col items-center mb-10">
           <Link href="/" className="w-14 h-14 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 mb-6 hover:scale-110 transition-transform">
              <Home size={28} />
           </Link>
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 italic uppercase">SIGN <span className="text-indigo-600">IN</span></h1>
           <p className="text-sm font-bold text-slate-400">행동 패턴 데이터 센터로 입장하세요.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">이메일 주소 (Email Address)</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="email" 
                required
                placeholder="nbti@example.com"
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">비밀번호 (Password)</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="password" 
                required
                placeholder="최소 6자 이상"
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-rose-500 text-xs font-bold pl-1">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-200 mt-4 disabled:opacity-50"
          >
            {loading ? '로그인 처리 중...' : <><LogIn size={20} /> 로그인</>}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-50 flex flex-col items-center gap-4">
           <p className="text-slate-400 text-xs font-bold">아직 계정이 없으신가요?</p>
           <Link 
             href="/signup" 
             className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-70 transition-all bg-indigo-50 px-6 py-3 rounded-full"
           >
             <UserPlus size={14} /> 계정 생성하기
           </Link>
        </div>
      </div>

      <footer className="mt-20 pb-20 text-[10px] font-black text-slate-200 uppercase tracking-[0.4em] italic leading-none">
        NBTI AUTHENTICATION CENTER
      </footer>
    </div>
  );
}
