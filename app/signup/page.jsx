'use client';

/**
 * [파일명: app/signup/page.jsx]
 * 기능: 가동 시 이메일 인증 우회 즉시 가입 및 자동 로그인 지원 (풀 한글화)
 */

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, UserPlus, Mail, Lock, LogIn, ChevronRight, CheckCircle } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. 서버 API를 호출하여 즉시 승인 회원 생성 (Rate Limit 우회)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || '회원가입 에러');

      // 2. 가입 성공 시 해당 정보로 즉시 로그인 처리 (유저 편의성 극대화)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw new Error('자동 로그인 실패: 다시 로그인해주세요.');

      // 3. 대시보드로 이동
      router.push('/my-dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message === 'User already registered' ? '이미 등록된 이메일입니다.' : err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-8 pt-12 md:pt-24 font-sans">
      <div className="w-full max-w-[400px]">
        <Link 
          href="/login" 
          className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-12 hover:text-black transition-colors"
        >
          <ArrowLeft size={14} /> 로그인으로 돌아가기
        </Link>

        <div className="mb-12">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 italic uppercase">SIGN <span className="text-indigo-600">UP</span></h1>
            <p className="text-sm font-bold text-slate-400 break-keep">이메일 인증 없이 즉시 가입 가능한 스마트 회원가입 시스템입니다.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
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
                placeholder="6자 이상 입력"
                minLength="6"
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 p-4 rounded-xl flex items-center gap-3 border border-rose-100">
               <AlertCircle size={14} className="text-rose-500" />
               <p className="text-rose-500 text-[11px] font-bold">{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 mt-4 disabled:opacity-50"
          >
            {loading ? '가입 처리 중...' : <><UserPlus size={20} /> 즉시 가입하기</>}
          </button>
        </form>

        <div className="mt-12 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
           <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
             <CheckCircle size={14} /> NBTI Instant Access
           </p>
           <ul className="space-y-3">
              {[
                '이메일 인증 대기 시간 없음',
                '가입 즉시 나만의 대시보드 생성',
                '전체 테스트 이력 자동 저장 및 분석',
              ].map((txt, i) => (
                <li key={i} className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                   <div className="w-1 h-1 bg-indigo-300 rounded-full" /> {txt}
                </li>
              ))}
           </ul>
        </div>
      </div>

      <footer className="mt-20 pb-20 text-[10px] font-black text-slate-200 uppercase tracking-[0.4em] italic leading-none">
        NBTI AUTHENTICATION CENTER
      </footer>
    </div>
  );
}

// 루시드 아이콘 보조
function AlertCircle({ size, className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}
