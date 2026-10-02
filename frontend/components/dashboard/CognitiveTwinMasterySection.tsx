'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Fingerprint,
  TrendingUp,
  Brain,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Activity,
  Info,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface CognitiveTwinMasterySectionProps {
  onExploreTwin?: () => void;
}

export const CognitiveTwinMasterySection: React.FC<CognitiveTwinMasterySectionProps> = ({
  onExploreTwin,
}) => {
  const [showFormulaModal, setShowFormulaModal] = useState<boolean>(false);

  const strongSubjects = [
    { name: 'Python Architecture', mastery: 96, confidence: 94, retention: 95 },
    { name: 'Pandas & NumPy Wrangling', mastery: 88, confidence: 86, retention: 91 },
    { name: 'Data Structures & Algorithms', mastery: 80, confidence: 84, retention: 88 },
    { name: 'Relational SQL & Query Design', mastery: 74, confidence: 79, retention: 86 },
  ];

  const developingSubjects = [
    { name: 'Full-Stack React & Next.js', mastery: 75, confidence: 83, retention: 87 },
    { name: 'AI Engineering & FastAPI Serving', mastery: 67, confidence: 66, retention: 76 },
    { name: 'Machine Learning Models', mastery: 65, confidence: 72, retention: 80 },
    { name: 'Generative AI & Enterprise RAG', mastery: 63, confidence: 69, retention: 78 },
  ];

  const weakSubjects = [
    { name: 'Data Engineering (Spark/Kafka)', mastery: 59, confidence: 64, retention: 75 },
    { name: 'Deep Learning & Neural Networks', mastery: 52, confidence: 60, retention: 71 },
    { name: 'Cloud & DevOps (Docker/K8s)', mastery: 48, confidence: 55, retention: 69 },
    { name: 'System Design & Distributed Systems', mastery: 45, confidence: 50, retention: 66 },
  ];

  const criticalGaps = [
    { name: 'Sigmoid Saturation & Vanishing Gradients', gapScore: 31, impact: 'Blocks Backprop Module & Autograd Project' },
    { name: 'Window Frame Duplication in SQL JOINs', gapScore: 48, impact: 'Causes silent double-counting in analytics queries' },
    { name: 'Continuous Probability & Hypothesis Power', gapScore: 24, impact: 'Prerequisite for rigorous A/B test experiments' },
  ];

  return (
    <section id="twin-mastery-section" className="border border-stone-800 bg-[#0e1017] p-6 md:p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-indigo-400 font-bold">
            <Fingerprint size={14} />
            <span>BAYESIAN COGNITIVE TWIN ENGINE</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-stone-100 font-bold tracking-tight">
            Knowledge State & Mastery Distribution
          </h2>
          <p className="text-xs text-stone-300 font-sans max-w-2xl">
            Live digital twin of your conceptual comprehension across 4 tiers: Strong, Developing, Weak, and Critical Gaps.
          </p>
        </div>

        {/* Explain Formula Button */}
        <button
          onClick={() => setShowFormulaModal(!showFormulaModal)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#121522] border border-indigo-500/30 hover:border-indigo-400 text-indigo-300 font-mono text-xs transition-colors shrink-0"
        >
          <Info size={13} />
          <span>HOW METRICS ARE CALCULATED</span>
        </button>
      </div>

      {/* METRICS FORMULA EXPLANATION ACCORDION */}
      {showFormulaModal && (
        <div className="p-5 bg-[#080a10] border border-indigo-500/40 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <span className="text-indigo-400 font-bold uppercase">
              TRANSPARENT PRODUCT METRICS SPECIFICATION
            </span>
            <span className="text-stone-500 text-[10px]">No pseudo-psychometrics • Deterministic telemetry</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
            <div className="p-3 bg-[#0d101a] border border-stone-800 space-y-1">
              <span className="text-stone-300 font-bold">1. Mastery (BKT):</span>
              <p className="text-stone-400">
                P(Lₙ) = P(Lₙ₋₁|Obs) + (1 - P(Lₙ₋₁|Obs)) · T. Weighted by first-attempt correctness and time-to-solve.
              </p>
            </div>
            <div className="p-3 bg-[#0d101a] border border-stone-800 space-y-1">
              <span className="text-stone-300 font-bold">2. Retention Stability:</span>
              <p className="text-stone-400">
                R(t) = exp(-t / S) where S is memory stability calibrated through spaced repetition test results.
              </p>
            </div>
            <div className="p-3 bg-[#0d101a] border border-stone-800 space-y-1">
              <span className="text-stone-300 font-bold">3. Cognitive Load Index:</span>
              <p className="text-stone-400">
                Calculated from syntax hesitation time, backspace frequency, and hint requests during practice drills.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4-TIER KNOWLEDGE STATE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* TIER 1: STRONG */}
        <div className="p-5 bg-[#0c1018] border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
              <CheckCircle2 size={14} />
              <span>STRONG (≥ 74%)</span>
            </span>
            <span className="text-[10px] font-mono text-stone-500">{strongSubjects.length} SUBJECTS</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {strongSubjects.map((s) => (
              <div key={s.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-stone-200 text-[11px] truncate max-w-[150px]">{s.name}</span>
                  <span className="text-emerald-400 font-bold">{s.mastery}%</span>
                </div>
                <div className="w-full bg-stone-900 h-1 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${s.mastery}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TIER 2: DEVELOPING */}
        <div className="p-5 bg-[#0c1018] border border-indigo-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <span className="text-xs font-mono font-bold text-indigo-300 uppercase flex items-center gap-1.5">
              <Activity size={14} />
              <span>DEVELOPING (60-74%)</span>
            </span>
            <span className="text-[10px] font-mono text-stone-500">{developingSubjects.length} SUBJECTS</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {developingSubjects.map((s) => (
              <div key={s.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-stone-200 text-[11px] truncate max-w-[150px]">{s.name}</span>
                  <span className="text-indigo-300 font-bold">{s.mastery}%</span>
                </div>
                <div className="w-full bg-stone-900 h-1 rounded-full overflow-hidden">
                  <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${s.mastery}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TIER 3: WEAK */}
        <div className="p-5 bg-[#0c1018] border border-amber-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <span className="text-xs font-mono font-bold text-amber-300 uppercase flex items-center gap-1.5">
              <AlertTriangle size={14} />
              <span>WEAK (&lt; 60%)</span>
            </span>
            <span className="text-[10px] font-mono text-stone-500">{weakSubjects.length} SUBJECTS</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {weakSubjects.map((s) => (
              <div key={s.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-stone-200 text-[11px] truncate max-w-[150px]">{s.name}</span>
                  <span className="text-amber-300 font-bold">{s.mastery}%</span>
                </div>
                <div className="w-full bg-stone-900 h-1 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: `${s.mastery}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TIER 4: CRITICAL GAPS */}
        <div className="p-5 bg-[#140e10] border border-rose-500/40 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase flex items-center gap-1.5">
              <AlertTriangle size={14} />
              <span>CRITICAL GAPS</span>
            </span>
            <span className="text-[10px] font-mono text-rose-300 font-bold">REMEDIATION NEEDED</span>
          </div>

          <div className="space-y-3 text-xs">
            {criticalGaps.map((g) => (
              <div key={g.name} className="p-2.5 bg-[#1a0f12] border border-rose-900/50 space-y-1">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-rose-200 font-bold truncate max-w-[150px]">{g.name}</span>
                  <span className="text-rose-400 font-bold">{g.gapScore}%</span>
                </div>
                <p className="text-[10px] text-stone-400 font-sans">
                  {g.impact}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* FOOTER LINK */}
      <div className="flex items-center justify-between pt-2 border-t border-stone-800 font-mono text-xs text-stone-400">
        <span>Digital Twin Latency: <strong className="text-emerald-400 font-bold">18ms</strong></span>
        <Link
          href="/learning-twin"
          className="text-indigo-400 hover:text-indigo-300 font-bold uppercase flex items-center gap-1"
        >
          <span>FULL COGNITIVE TWIN ANALYTICS →</span>
        </Link>
      </div>
    </section>
  );
};
