'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, UserPlus, Mail, Lock, LogIn } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError('회원가입 중 오류가 발생했습니다: ' + error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center px-8 pt-24 font-sans text-center">
         <div className="w-full max-w-[400px]">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg shadow-emerald-50">
               <UserPlus size={36} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 italic uppercase">WELCOME <span className="text-indigo-600">ABOARD</span></h1>
            <p className="text-sm font-bold text-slate-400 mb-12 break-keep">이메일을 확인하여 계정을 활성화해주세요.<br/>(인증 후 로그인이 가능합니다.)</p>
            <Link 
              href="/login" 
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-200"
            >
              <LogIn size={20} /> 로그인하러 가기
            </Link>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-8 pt-12 md:pt-24 font-sans">
      <div className="w-full max-w-[400px]">
        <Link 
          href="/login" 
          className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-12 hover:text-black transition-colors"
        >
          <ArrowLeft size={14} /> Back to Sign In
        </Link>

        <div className="mb-12">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 italic">SIGN <span className="text-indigo-600">UP</span></h1>
            <p className="text-sm font-bold text-slate-400">당신만의 정밀 데이터 분석을 정기적으로 시작하세요.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
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
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="password" 
                required
                placeholder="최소 6자 이상"
                minLength="6"
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
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 mt-4 disabled:opacity-50"
          >
            {loading ? '처리 중...' : <><UserPlus size={20} /> 가입하기</>}
          </button>
        </form>

        <p className="mt-12 text-center text-slate-400 text-xs font-bold leading-relaxed break-keep">
           가입 시 NBTI의 서비스 이용약관 및 개인정보 처리방침에 동의한 것으로 간주됩니다.
        </p>
      </div>

      <footer className="mt-20 pb-20 text-[10px] font-black text-slate-200 uppercase tracking-[0.4em] italic leading-none">
        NBTI AUTHENTICATION CENTER
      </footer>
    </div>
  );
}
