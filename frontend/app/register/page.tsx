'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Brain, ArrowRight, ShieldCheck, Eye, EyeOff, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, loading: authLoading, error: authError, clearError } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [learningGoal, setLearningGoal] = useState('Data Science / AI / Software Engineering');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatedSuccess, setIsCreatedSuccess] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && !isCreatedSuccess) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isCreatedSuccess, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!fullName.trim() || fullName.trim().length < 2) {
      setLocalError('Please enter your full registered name (minimum 2 characters).');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setLocalError('Please provide a valid email address.');
      return;
    }

    if (password.length < 8) {
      setLocalError('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match. Please verify.');
      return;
    }

    setIsSubmitting(true);
    const success = await register({
      full_name: fullName.trim(),
      email: email.trim(),
      username: username.trim() || undefined,
      password,
      learning_goal: learningGoal,
      preferred_language: preferredLanguage,
    });
    setIsSubmitting(false);

    if (success) {
      setIsCreatedSuccess(true);
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
              REGISTER LEARNER IDENTITY
            </span>
          </div>
        </Link>
        <Link
          href="/login"
          className="text-xs font-semibold text-stone-600 hover:text-blue-600 transition-colors"
        >
          Sign In &rarr;
        </Link>
      </header>

      {/* Main Registration Form */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg bg-white border border-stone-200 shadow-sm rounded-xl p-6 sm:p-8 space-y-6">
          {isCreatedSuccess ? (
            <div className="text-center space-y-5 py-6 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 size={32} />
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold tracking-wider">
                  ACCOUNT CREATED ✓
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  Welcome, {fullName}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
                  Your AI-SENIOR-X learning account has been created. Sign in to access your Learning Twin, verified curriculum, and certificate credentials.
                </p>
              </div>

              <div className="pt-2 border-t border-stone-200">
                <Link
                  href="/login"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <span>Proceed to Sign In</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Header Typography */}
              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-mono font-medium mb-1">
                  <ShieldCheck size={11} className="text-blue-600" />
                  <span>VERIFIED LEARNER IDENTITY</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                  Create Your Learning Account
                </h1>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Your registered full name will be used on all official Verified Certificates and Learning Twin records.
                </p>
              </div>

              {/* Error Notice */}
              {displayError && (
                <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5 animate-fade-in">
                  <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Registration Notice</p>
                    <p className="text-red-700 mt-0.5">{displayError}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1"
              >
                Full Name (Legal / Registered Name) <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                required
                autoFocus
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (displayError) clearError();
                }}
                placeholder="e.g. Srihari Haran"
                className="w-full bg-[#FAFAF7] border border-stone-300 rounded-lg px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Will appear exactly on your verified certificates and transcript.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (displayError) clearError();
                  }}
                  placeholder="user@example.com"
                  className="w-full bg-[#FAFAF7] border border-stone-300 rounded-lg px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1"
                >
                  Username (Optional)
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (displayError) clearError();
                  }}
                  placeholder="srihari"
                  className="w-full bg-[#FAFAF7] border border-stone-300 rounded-lg px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1"
                >
                  Password (8+ chars) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (displayError) clearError();
                    }}
                    placeholder="Min 8 characters"
                    className="w-full bg-[#FAFAF7] border border-stone-300 rounded-lg pl-3.5 pr-9 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1"
                >
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (displayError) clearError();
                  }}
                  placeholder="Re-type password"
                  className="w-full bg-[#FAFAF7] border border-stone-300 rounded-lg px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="learningGoal"
                  className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1"
                >
                  Primary Learning Goal
                </label>
                <select
                  id="learningGoal"
                  value={learningGoal}
                  onChange={(e) => setLearningGoal(e.target.value)}
                  className="w-full bg-[#FAFAF7] border border-stone-300 rounded-lg px-3 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="Data Science / AI / Software Engineering">
                    AI & Machine Learning
                  </option>
                  <option value="Full-Stack Web & Systems Engineering">
                    Software Engineering
                  </option>
                  <option value="Data Analytics & SQL Analytics">Data Analytics</option>
                  <option value="Algorithms & DSA Mastery">DSA & Technical Interviews</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="preferredLanguage"
                  className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1"
                >
                  Preferred Language
                </label>
                <select
                  id="preferredLanguage"
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full bg-[#FAFAF7] border border-stone-300 rounded-lg px-3 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="en">English (Global)</option>
                  <option value="ta">Tamil (தமிழ்)</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="es">Spanish (Español)</option>
                  <option value="de">German (Deutsch)</option>
                  <option value="fr">French (Français)</option>
                  <option value="ja">Japanese (日本語)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || authLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-sm mt-2"
            >
              {isSubmitting || authLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Registering Identity...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Initialize Learning Twin</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="text-center text-xs text-stone-500 pt-1 border-t border-stone-200">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline font-semibold">
              Sign In
            </Link>
          </div>
          </>
          )}
        </div>
      </main>

      <footer className="border-t border-stone-200 px-6 py-4 text-center text-xs text-stone-400 font-mono">
        AI-SENIOR-X // REGISTERED IDENTITY INTEGRITY // CANONICAL LEARNER PROFILES
      </footer>
    </div>
  );
}
