'use client';

import React from 'react';
import Link from 'next/link';
import { Target, CheckCircle2, ArrowRight, Zap, Code2, Brain } from 'lucide-react';

export const DailyMissionSection: React.FC = () => {
  const missionSteps = [
    {
      stepNumber: '01',
      action: 'SOLVE',
      title: 'Diagnose a Retrieval Failure in Vector DB',
      desc: 'Inspect bad chunking strategies causing hallucinated responses.',
      status: 'READY',
      icon: Target,
    },
    {
      stepNumber: '02',
      action: 'EXPLAIN',
      title: 'Teach-Back Vector Distance Metrics',
      desc: 'Articulate difference between Cosine vs Dot Product similarity.',
      status: 'PENDING',
      icon: Brain,
    },
    {
      stepNumber: '03',
      action: 'APPLY',
      title: 'Implement Hybrid BM25 + Dense Re-Ranker',
      desc: 'Write vectorized Python logic passing automated unit tests.',
      status: 'LOCKED',
      icon: Code2,
    },
  ];

  return (
    <div className="border border-slate-800 bg-[#090D16] rounded-2xl p-6 sm:p-8 space-y-6 text-slate-100 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
            DIAGNOSTIC PROTOCOL
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-serif tracking-tight mt-0.5">
            Today&apos;s Learning Mission
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Tailored to your current cognitive blocker
        </span>
      </div>

      {/* 3-Step Pipeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {missionSteps.map((step, idx) => (
          <div
            key={step.stepNumber}
            className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 transition-all ${
              idx === 0
                ? 'bg-gradient-to-b from-slate-900 to-black border-emerald-500/40 ring-1 ring-emerald-500/30 shadow-lg'
                : 'bg-black/50 border-slate-800/80 opacity-70'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black font-serif text-slate-500">
                  {step.stepNumber}
                </span>
                <span
                  className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                    idx === 0
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}
                >
                  {step.action}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white leading-snug">{step.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
            </div>

            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
              <span className={idx === 0 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {step.status}
              </span>
              {idx === 0 && <span className="text-emerald-400">● Active</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Mission Footer CTA */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-xs font-mono text-slate-400">
          Target outcome: <strong>Resolve 1 root misconception &amp; record evidence</strong>
        </div>

        <Link
          href="/practice"
          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-all"
        >
          <Zap size={14} />
          <span>[ ENTER DAILY MISSION ]</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
};
