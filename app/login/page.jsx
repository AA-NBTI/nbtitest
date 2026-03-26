'use client';

/**
 * [파일명: app/login/page.jsx]
 * 기능: 통합 로그인/회원가입 페이지 (최종 미니멀리즘 - 보조 버튼 제거 및 한글 전용 14px 탭)
 */

import React, { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { LogIn, Mail, Lock, UserPlus } from 'lucide-react';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initialMode = searchParams.get('mode');
    if (initialMode === 'signup') {
      setMode('signup');
    }
  }, [searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message.includes('Invalid login credentials') 
        ? '이메일 또는 비밀번호가 올바르지 않습니다.' 
        : '오류가 발생했습니다: ' + error.message);
      setLoading(false);
    } else {
      router.push('/my-dashboard');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '회원가입 에러');
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw new Error('자동 로그인 실패: 다시 시도해주세요.');
      router.push('/my-dashboard');
    } catch (err) {
      setError(err.message === 'User already registered' ? '이미 등록된 이메일입니다.' : err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center px-8 pt-12 md:pt-20 font-sans">
      <div className="w-full max-w-[400px]">
        
        {/* [수정] 메인으로 돌아가기 버튼 제거 (여백 압축 적용) */}

        {/* 탭 스위처 (사용자 요청: 아래 시작하기 버튼과 색상 동일화 - Slate-900) */}
        <div className="bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl flex gap-1 mb-10 shadow-xl shadow-slate-200/50">
          <button 
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-4 text-[14px] font-bold rounded-xl transition-all ${mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            로그인
          </button>
          <button 
            onClick={() => { setMode('signup'); setError(null); }}
            className={`flex-1 py-4 text-[14px] font-bold rounded-xl transition-all ${mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            회원가입
          </button>
        </div>

        {/* 헤더 섹션 (단순 텍스트 유지) */}
        <div className="flex flex-col items-center mb-10 text-center">
           <h1 className="text-3xl font-extrabold text-slate-900 tracking-tighter uppercase">
              {mode === 'login' ? '로그인' : '회원가입'}
           </h1>
        </div>

        <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-6">
          <div className="space-y-3">
            <label className="text-[14px] font-bold text-slate-900 uppercase tracking-widest ml-1">
               이메일주소
            </label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                type="email" required
                placeholder="nbti@example.com"
                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-slate-50 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[14px] font-bold text-slate-900 uppercase tracking-widest ml-1">
               비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                type="password" required
                placeholder="최소 6자 이상"
                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-slate-50 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-slate-900 text-[11px] font-bold pl-1 underline decoration-slate-200 underline-offset-4">{error}</p>}

          <button 
            type="submit" disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-200 mt-8 disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? '처리 중...' : (
              mode === 'login' ? <><LogIn size={18} /> 시작하기</> : <><UserPlus size={18} /> 계정 생성하기</>
            )}
          </button>
        </form>

        <footer className="mt-20 text-center opacity-10">
           <p className="text-[8px] font-bold uppercase tracking-[0.4em]">NBTI Identity Gateway • v2.6</p>
        </footer>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-20 text-center">
        <div className="w-8 h-8 rounded-full border-4 border-slate-100 border-t-slate-900 animate-spin mb-4" />
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
