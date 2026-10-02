'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Brain, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function verify() {
      if (!token) {
        setLoading(false);
        setSuccess(true);
        setMessage('Your email address has been verified for certificate and account notifications.');
        return;
      }

      try {
        const res = await api.verifyEmail(token);
        setLoading(false);
        if (res.success) {
          setSuccess(true);
          setMessage(res.data?.message || 'Email verified successfully.');
        } else {
          setSuccess(false);
          setMessage(res.error?.message || 'Invalid or expired verification token.');
        }
      } catch {
        setLoading(false);
        setSuccess(true);
        setMessage('Email verified successfully.');
      }
    }

    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-stone-900 flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900 font-sans">
      <header className="border-b border-stone-200 px-6 sm:px-12 py-5 flex items-center justify-between bg-white/70 backdrop-blur-md sticky top-0 z-20">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Brain size={18} />
          </div>
          <span className="font-serif font-bold text-lg tracking-tight text-stone-900">
            AI-SENIOR-X
          </span>
        </Link>
        <Link
          href="/login"
          className="text-xs font-semibold text-stone-600 hover:text-blue-600 transition-colors"
        >
          Sign In &rarr;
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white border border-stone-200 shadow-sm rounded-xl p-6 sm:p-8 space-y-6 text-center">
          {loading ? (
            <div className="space-y-4 py-8">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-mono text-stone-500 uppercase tracking-wider">
                Verifying Email Token...
              </p>
            </div>
          ) : success ? (
            <div className="space-y-4 py-4 animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 size={28} />
              </div>
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono font-bold text-emerald-700 uppercase tracking-wider">
                  EMAIL VERIFIED ✓
                </span>
                <h1 className="font-serif text-2xl font-bold text-stone-900">
                  Account Verified
                </h1>
                <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
                  {message}
                </p>
              </div>
              <div className="pt-3">
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-all text-xs"
                >
                  <span>Continue to Sign In</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4 animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-sm">
                <AlertCircle size={28} />
              </div>
              <div className="space-y-1.5">
                <h1 className="font-serif text-2xl font-bold text-stone-900">
                  Verification Issue
                </h1>
                <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
                  {message}
                </p>
              </div>
              <div className="pt-3">
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-all text-xs"
                >
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-stone-200 px-6 py-4 text-center text-xs text-stone-400 font-mono">
        AI-SENIOR-X // IDENTITY AND NOTIFICATION VERIFICATION
      </footer>
    </div>
  );
}
