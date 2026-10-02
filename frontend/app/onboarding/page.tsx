'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Brain,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Globe,
  Clock,
  Target,
  BookOpen,
  Code2,
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import api from '@/lib/api';

import { useAuth } from '@/hooks/useAuth';

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Form State (Default to empty or current authenticated user)
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [targetGoal, setTargetGoal] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    'AI & Machine Learning',
  ]);
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [dailyTimeMinutes, setDailyTimeMinutes] = useState(45);
  const [learningStyle, setLearningStyle] = useState('Socratic Dialogue & Hands-on Code');

  const subjectOptions = [
    'AI & Machine Learning',
    'Python Foundations',
    'Data Science & Analytics',
    'Relational SQL & Databases',
    'Data Structures & Algorithms',
    'Cloud & System Design',
    'Mathematics & Statistics',
  ];

  const toggleSubject = (subj: string) => {
    if (selectedSubjects.includes(subj)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter((s) => s !== subj));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, subj]);
    }
  };

  const handleStep1Continue = () => {
    if (!fullName.trim()) {
      setValidationError('Please enter your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setValidationError('Please enter a valid email address.');
      return;
    }
    setValidationError('');
    setStep(2);
  };

  const handleFinishOnboarding = async () => {
    setSubmitting(true);
    try {
      // Register or update profile on backend with user's own details
      const userPassword = password.trim() || 'password123';
      await api.register({
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password: userPassword,
        grade_level: experienceLevel,
        preferred_language: preferredLanguage,
      });

      // Submit initial cognitive baseline evidence to twin
      await api.submitEvidence({
        evidence_type: 'assessment',
        topic_id: 'python_basics',
        concept_id: 'python_loops',
        score: 0.85,
        details: {
          note: 'Initial onboarding diagnostic profile calibration',
          target_goal: targetGoal.trim() || 'Software & AI Mastery',
          subjects: selectedSubjects,
        },
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch {
      router.push('/dashboard');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-indigo-500/30">
      <div className="w-full max-w-xl space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 items-center justify-center shadow-lg shadow-indigo-500/30">
            <Brain size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">Calibrate Your Learning Twin</h1>
          <p className="text-xs text-slate-400">
            Step {step} of 3 — Personalizing cognitive pedagogy and prerequisite solver
          </p>

          {/* Step Progress Dots */}
          <div className="flex justify-center gap-2 pt-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? 'w-8 bg-indigo-500' : s < step ? 'w-4 bg-emerald-400' : 'w-4 bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Goals & Subjects */}
        {step === 1 && (
          <Card className="p-6 space-y-5 bg-slate-900/90 border-slate-800">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target size={18} className="text-indigo-400" />
                Target Career Goal & Name
              </h3>
              <p className="text-xs text-slate-400">Tell us what you want to achieve with AI-SENIOR-X.</p>
            </div>

            {validationError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300">
                {validationError}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Choose your password (optional, min 6 chars)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Learning Objective</label>
                <input
                  type="text"
                  value={targetGoal}
                  onChange={(e) => setTargetGoal(e.target.value)}
                  placeholder="e.g. AI Engineer, Python Specialist, Machine Learning Researcher"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="primary"
                onClick={handleStep1Continue}
                icon={<ArrowRight size={14} />}
              >
                <span>Continue</span>
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Subject Focus */}
        {step === 2 && (
          <Card className="p-6 space-y-5 bg-slate-900/90 border-slate-800">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen size={18} className="text-cyan-400" />
                Select Domains to Focus On
              </h3>
              <p className="text-xs text-slate-400">Choose the technical domains to prioritize in your DAG map.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {subjectOptions.map((subj) => {
                const isSelected = selectedSubjects.includes(subj);
                return (
                  <button
                    key={subj}
                    onClick={() => toggleSubject(subj)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{subj}</span>
                    {isSelected && <CheckCircle2 size={14} className="text-indigo-400" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" onClick={() => setStep(1)} icon={<ArrowLeft size={14} />}>
                <span>Back</span>
              </Button>
              <Button variant="primary" onClick={() => setStep(3)} icon={<ArrowRight size={14} />}>
                <span>Continue</span>
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Pedagogy & Schedule */}
        {step === 3 && (
          <Card className="p-6 space-y-5 bg-slate-900/90 border-slate-800">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles size={18} className="text-purple-400" />
                Pedagogy, Language & Study Schedule
              </h3>
              <p className="text-xs text-slate-400">Configure how the AI Tutor and Learning Twin adapt to your routine.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Language</label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="English">English (US)</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="French">French (Français)</option>
                  <option value="German">German (Deutsch)</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                  <option value="Mandarin">Mandarin (中文)</option>
                  <option value="Japanese">Japanese (日本語)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Daily Study Goal ({dailyTimeMinutes} minutes/day)
                </label>
                <input
                  type="range"
                  min={15}
                  max={120}
                  step={15}
                  value={dailyTimeMinutes}
                  onChange={(e) => setDailyTimeMinutes(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>15 min (Micro)</span>
                  <span>45 min (Standard)</span>
                  <span>120 min (Intensive)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Experience Baseline</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setExperienceLevel(lvl)}
                      className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
                        experienceLevel === lvl
                          ? 'bg-indigo-600 text-white border-indigo-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" onClick={() => setStep(2)} icon={<ArrowLeft size={14} />}>
                <span>Back</span>
              </Button>
              <Button
                variant="glow"
                onClick={handleFinishOnboarding}
                loading={submitting}
                icon={<Sparkles size={14} />}
              >
                <span>Initialize Learning Twin</span>
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
