'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Brain, Eye, EyeOff, ArrowRight, Sparkles, ShieldCheck, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const { login, isAuthenticated, loading: authLoading, error: authError, clearError } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    let isMounted = true;
    const checkStatus = async () => {
      try {
        const res = await api.checkBackendStatus();
        if (isMounted) {
          setBackendStatus(res.online ? 'online' : 'offline');
        }
      } catch {
        if (isMounted) {
          setBackendStatus('offline');
        }
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectPath);
    }
  }, [isAuthenticated, redirectPath, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!identifier.trim()) {
      setLocalError('Please enter your email or username.');
      return;
    }

    if (!password) {
      setLocalError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    const success = await login(identifier.trim(), password, rememberMe);
    setIsSubmitting(false);

    if (success) {
      router.push(redirectPath);
    }
  };

  const handleDemoLogin = async () => {
    setIdentifier('srihari');
    setPassword('Password123!');
    setIsSubmitting(true);
    const success = await login('srihari', 'Password123!', true);
    setIsSubmitting(false);
    if (success) {
      router.push(redirectPath);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-stone-900 flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* Top Brand Bar */}
      <header className="border-b border-stone-200 px-6 sm:px-12 py-5 flex items-center justify-between bg-white/70 backdrop-blur-md sticky top-0 z-20">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Brain size={18} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif font-bold text-lg tracking-tight text-stone-900">
              AI-SENIOR-X
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400">
              LEARNING INTELLIGENCE
            </span>
          </div>
        </Link>
        <Link
          href="/register"
          className="text-xs font-semibold text-stone-600 hover:text-blue-600 transition-colors"
        >
          Create Account &rarr;
        </Link>
      </header>

      {/* Main Login Canvas */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white border border-stone-200 shadow-sm rounded-xl p-6 sm:p-8 space-y-6">
          {/* Header Typography */}
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-mono font-medium mb-1">
              <Lock size={11} className="text-blue-600" />
              <span>SECURE ACCESS</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              Sign In to Your Learning Twin
            </h1>
            <p className="text-xs text-stone-500 leading-relaxed">
              Continue your verified learning path, practice sessions, and skill evidence records.
            </p>
          </div>

          {/* Error Banner */}
          {displayError && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5 animate-fade-in">
              <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Authentication Notice</p>
                <p className="text-red-700 mt-0.5">{displayError}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="identifier"
                className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5"
              >
                Email or Username
              </label>
              <input
                id="identifier"
                type="text"
                required
                autoFocus
                autoComplete="username"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (displayError) clearError();
                }}
                placeholder="srihari or user@example.com"
                className="w-full bg-[#FAFAF7] border border-stone-300 rounded-lg px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-stone-700"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (displayError) clearError();
                  }}
                  placeholder="Enter your password"
                  className="w-full bg-[#FAFAF7] border border-stone-300 rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-stone-600">Remember me on this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || authLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
            >
              {isSubmitting || authLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* 1-Click Demo Login */}
          <div className="pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isSubmitting || authLoading}
              className="w-full bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles size={13} className="text-blue-600" />
              <span>Quick 1-Click Demo Sign-In (Srihari Haran)</span>
            </button>
          </div>

            {/* Backend Connectivity Status Indicator */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] font-mono text-stone-500">
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${backendStatus === 'online' ? 'bg-emerald-400' : backendStatus === 'offline' ? 'bg-red-400' : 'bg-amber-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${backendStatus === 'online' ? 'bg-emerald-600' : backendStatus === 'offline' ? 'bg-red-600' : 'bg-amber-600'}`}></span>
                </span>
                <span className="font-semibold text-stone-700">FASTAPI BACKEND :8000</span>
              </span>
              <span className={`px-2 py-0.5 rounded border uppercase text-[10px] font-bold ${
                backendStatus === 'online' 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                  : backendStatus === 'offline' 
                  ? 'bg-red-50 border-red-200 text-red-700' 
                  : 'bg-stone-50 border-stone-200 text-stone-600'
              }`}>
                {backendStatus.toUpperCase()}
              </span>
            </div>

            {/* Footer Note */}
            <div className="text-center text-xs text-stone-500 pt-1">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-blue-600 hover:underline font-semibold">
                Create Account
              </Link>
            </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 px-6 py-4 text-center text-xs text-stone-400 font-mono">
        AI-SENIOR-X // AUTHENTICATION-FIRST PROTOCOL // ZERO PASSWORDS STORED IN PLAINTEXT
      </footer>
    </div>
  );
}
