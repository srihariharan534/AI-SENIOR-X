'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Brain, ArrowRight, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get('token') || '';

  const { resetPassword } = useAuth();
  const [token, setToken] = useState(tokenParam);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!token.trim()) {
      setFeedback({ success: false, message: 'Please enter your reset token.' });
      return;
    }

    if (newPassword.length < 8) {
      setFeedback({ success: false, message: 'Password must be at least 8 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback({ success: false, message: 'Passwords do not match.' });
      return;
    }

    setIsSubmitting(true);
    const res = await resetPassword(token.trim(), newPassword);
    setIsSubmitting(false);
    setFeedback(res);

    if (res.success) {
      setTimeout(() => {
        router.push('/login');
      }, 2500);
    }
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
          Sign In &rarr;
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white border border-stone-200 shadow-sm rounded-xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-mono font-medium mb-1">
              <Lock size={11} className="text-blue-600" />
              <span>SET NEW CREDENTIALS</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              Reset Your Password
            </h1>
            <p className="text-xs text-stone-500 leading-relaxed">
              Enter the reset token received in your email and choose a strong password.
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
              <div>
                <p className="font-semibold">
                  {feedback.success ? 'Password Updated' : 'Reset Notice'}
                </p>
                <p className="mt-0.5">{feedback.message}</p>
                {feedback.success && (
                  <p className="text-[11px] text-emerald-700 font-mono mt-1">
                    Redirecting to sign in page...
                  </p>
                )}
              </div>
            </div>
          )}

          {!feedback?.success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="token"
                  className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1"
                >
                  Reset Token <span className="text-red-500">*</span>
                </label>
                <input
                  id="token"
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="e.g. reset_..."
                  className="w-full bg-[#FAFAF7] border border-stone-300 rounded-lg px-3.5 py-2.5 text-sm font-mono text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1"
                >
                  New Password (8+ characters) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-[#FAFAF7] border border-stone-300 rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1"
                >
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full bg-[#FAFAF7] border border-stone-300 rounded-lg px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Reset Password & Sign In</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="text-center text-xs text-stone-500 pt-1 border-t border-stone-200">
            <Link href="/login" className="text-blue-600 hover:underline font-semibold">
              Return to Sign In
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-stone-200 px-6 py-4 text-center text-xs text-stone-400 font-mono">
        AI-SENIOR-X // CRYPTOGRAPHIC TOKEN VERIFICATION
      </footer>
    </div>
  );
}
