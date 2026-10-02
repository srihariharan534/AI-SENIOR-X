'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import {
  Settings as SettingsIcon,
  User,
  Globe,
  Volume2,
  Sliders,
  Shield,
  Save,
  CheckCircle2,
  LogOut,
} from 'lucide-react';

export default function SettingsPage() {
  const { user, profile, logout } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [language, setLanguage] = useState(profile?.preferred_language || 'English (US)');
  const [voiceLocale, setVoiceLocale] = useState('en-US');
  const [speechRate, setSpeechRate] = useState(1.0);
  const [dailyTarget, setDailyTarget] = useState(45);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <SettingsIcon size={26} className="text-indigo-400" />
            Environment & Profile Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure your AI Tutor preferences, language localization, and cognitive model parameters.
          </p>
        </div>

        <Button
          variant="glow"
          size="sm"
          onClick={handleSave}
          icon={saved ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Save size={14} />}
        >
          <span>{saved ? 'Changes Saved' : 'Save Preferences'}</span>
        </Button>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <Card className="p-6 space-y-4">
          <CardHeader>
            <CardTitle>
              <User size={18} className="text-indigo-400" />
              Learner Profile &amp; Verified Certificate Identity
            </CardTitle>
          </CardHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Verified Registered Name (For Official Certificates)
              </label>
              <input
                type="text"
                value={fullName || 'SRIHARI HARAN'}
                onChange={(e) => setFullName(e.target.value.toUpperCase())}
                placeholder="e.g. SRIHARI HARAN"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-serif tracking-wider text-white uppercase placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                AI-SENIOR-X binds this verified name to all digital certificates and public verification seals.
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={email || 'learner@ai-senior-x.io'}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </Card>

        {/* Achievements & Verified Credentials Link */}
        <Card className="p-6 space-y-4 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border-indigo-500/20">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield size={16} className="text-emerald-400" />
                Verified Achievements &amp; Proof-of-Skill
              </h3>
              <p className="text-xs text-slate-400">
                Review your verified credentials, real-world challenges, and proof records.
              </p>
            </div>

            <div className="flex gap-2">
              <a
                href="/certificates"
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition shadow-sm"
              >
                My Certificates
              </a>
              <a
                href="/projects"
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
              >
                Projects
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="block text-base font-black text-indigo-400 font-mono">2</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Certificates</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="block text-base font-black text-emerald-400 font-mono">4</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Verified Skills</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="block text-base font-black text-cyan-400 font-mono">3</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Projects</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="block text-base font-black text-amber-400 font-mono">6</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Challenges</span>
            </div>
          </div>
        </Card>

        {/* Developer Field Kit / API Configuration Link */}
        <Card className="p-6 space-y-3 bg-[#FAF8F5] border-stone-300 text-stone-900 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-100 border border-amber-300 rounded text-[10px] font-mono font-bold tracking-wider text-amber-900 uppercase">
                <span>DEVELOPER FIELD KIT</span>
              </div>
              <h3 className="text-base font-serif font-bold text-stone-950 flex items-center gap-2">
                <span>Connect your AI Models &amp; API Keys</span>
              </h3>
              <p className="text-xs text-stone-600 max-w-xl">
                Configure OpenRouter, Google Gemini, Groq, and NVIDIA NIM credentials securely and manage multi-provider workload routing.
              </p>
            </div>

            <a
              href="/settings/api-keys"
              className="px-4 py-2.5 rounded-lg bg-[#0052FF] hover:bg-[#0042D0] text-white font-mono text-xs font-bold uppercase tracking-wider transition shadow-sm text-center shrink-0"
            >
              [ OPEN FIELD KIT ]
            </a>
          </div>
        </Card>

        {/* Multilingual & Voice */}
        <Card className="p-6 space-y-4">
          <CardHeader>
            <CardTitle>
              <Globe size={18} className="text-cyan-400" />
              Multilingual & Speech Synthesis
            </CardTitle>
          </CardHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Pedagogical Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="English (US)">English (US)</option>
                <option value="Spanish (Español)">Spanish (Español)</option>
                <option value="French (Français)">French (Français)</option>
                <option value="German (Deutsch)">German (Deutsch)</option>
                <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
                <option value="Tamil (தமிழ்)">Tamil (தமிழ்)</option>
                <option value="Mandarin (中文)">Mandarin (中文)</option>
                <option value="Japanese (日本語)">Japanese (日本語)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Speech Rate ({speechRate}x)</label>
              <input
                type="range"
                min={0.75}
                max={1.5}
                step={0.05}
                value={speechRate}
                onChange={(e) => setSpeechRate(Number(e.target.value))}
                className="w-full accent-cyan-500 mt-2"
              />
            </div>
          </div>
        </Card>

        {/* Learning Twin Calibration */}
        <Card className="p-6 space-y-4">
          <CardHeader>
            <CardTitle>
              <Sliders size={18} className="text-purple-400" />
              Cognitive Twin & Study Pace
            </CardTitle>
          </CardHeader>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Daily Target Commitment ({dailyTarget} minutes/day)
            </label>
            <input
              type="range"
              min={15}
              max={120}
              step={15}
              value={dailyTarget}
              onChange={(e) => setDailyTarget(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Spaced repetition intervals and daily mission complexity scale automatically according to this target.
            </p>
          </div>
        </Card>

        {/* Security & Logout */}
        <Card className="p-6 space-y-4 border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-900 text-slate-400">
              <Shield size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Active Authentication Session</h4>
              <p className="text-[11px] text-slate-400">JWT Bearer encrypted session storage</p>
            </div>
          </div>

          <Button
            variant="danger"
            size="sm"
            onClick={logout}
            icon={<LogOut size={14} />}
          >
            <span>Sign Out</span>
          </Button>
        </Card>
      </div>
    </div>
  );
}
