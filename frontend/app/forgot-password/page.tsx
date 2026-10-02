'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Brain, ArrowRight, Mail, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setFeedback(null);
    const res = await forgotPassword(email.trim());
    setIsSubmitting(false);
    setFeedback(res);
  };

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
          Back to Sign In &rarr;
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white border border-stone-200 shadow-sm rounded-xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-mono font-medium mb-1">
              <KeyRound size={11} className="text-blue-600" />
              <span>ACCOUNT RECOVERY</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              Recover Password
            </h1>
            <p className="text-xs text-stone-500 leading-relaxed">
              Enter your registered email address. We will dispatch an expiring single-use reset token.
            </p>
          </div>

          {feedback && (
            <div
              className={`p-4 rounded-lg border text-xs flex items-start gap-2.5 ${
                feedback.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              {feedback.success ? (
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-semibold">
                  {feedback.success ? 'Recovery Dispatched' : 'Request Notice'}
                </p>
                <p>{feedback.message}</p>
                {feedback.success && (
                  <div className="pt-2">
                    <Link
                      href="/reset-password"
                      className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:underline"
                    >
                      <span>Proceed to enter token</span> &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {!feedback?.success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5"
                >
                  Registered Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full bg-[#FAFAF7] border border-stone-300 rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                  <Mail size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Dispatching Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="text-center text-xs text-stone-500 pt-1 border-t border-stone-200">
            Remembered your credentials?{' '}
            <Link href="/login" className="text-blue-600 hover:underline font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-stone-200 px-6 py-4 text-center text-xs text-stone-400 font-mono">
        AI-SENIOR-X // ZERO-ENUMERATION RECOVERY PROTOCOL
      </footer>
    </div>
  );
}
