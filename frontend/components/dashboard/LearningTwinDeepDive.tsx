'use client';

import React from 'react';
import Link from 'next/link';
import { BrainCircuit, CheckCircle2, TrendingUp, AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';

interface LearningTwinDeepDiveProps {
  twinData?: {
    known: Array<{ skill: string; status: string; evidence: string }>;
    developing: Array<{ skill: string; status: string; evidence: string }>;
    needs_practice: Array<{ skill: string; status: string; evidence: string }>;
    ready_for: Array<{ skill: string; status: string; evidence: string }>;
    overall_mastery_index: number;
  };
}

export const LearningTwinDeepDive: React.FC<LearningTwinDeepDiveProps> = ({
  twinData,
}) => {
  const t = twinData || {
    known: [
      { skill: 'Python Fundamentals & OOP Models', status: 'MASTERED', evidence: '48/48 Lessons · 8/8 Assessments' },
      { skill: 'SQL Relational Algebra & Aggregations', status: 'MASTERED', evidence: 'Verified 96% Score' },
      { skill: 'Exploratory Data Analysis & Pandas', status: 'MASTERED', evidence: 'Production Capstone Completed' },
    ],
    developing: [
      { skill: 'Advanced Python Metaprogramming', status: 'DEVELOPING', evidence: 'In Progress (Module 07)' },
      { skill: 'ML Model Evaluation & Loss Curves', status: 'DEVELOPING', evidence: '4/12 Modules Completed' },
      { skill: 'System Design & Distributed Ingress', status: 'DEVELOPING', evidence: '3/10 Modules Completed' },
    ],
    needs_practice: [
      { skill: 'Asyncio Task Groups & Coroutine Cancellation', status: 'NEEDS_PRACTICE', evidence: '2 Reassessment Flags' },
      { skill: 'SQL Window Framing (ROWS BETWEEN)', status: 'NEEDS_PRACTICE', evidence: '3 Telemetry Mistakes' },
    ],
    ready_for: [
      { skill: 'Production Agentic RAG Pipeline Architectures', status: 'UNLOCKED', evidence: 'Prerequisites Satisfied' },
      { skill: 'High-Throughput Distributed Data Pipelines', status: 'UNLOCKED', evidence: 'Python & SQL Verified' },
    ],
    overall_mastery_index: 84.2,
  };

  return (
    <div className="w-full bg-[#fdfcf9] dark:bg-stone-900 border border-stone-300 dark:border-stone-800">
      {/* Header */}
      <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-[#f9f8f4] dark:bg-stone-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BrainCircuit size={16} className="text-blue-700 dark:text-blue-400" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-900 dark:text-stone-100">
            SECTION 10 // COGNITIVE LEARNING TWIN STATE
          </h2>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-stone-500 uppercase">MASTERY INDEX:</span>
          <span className="font-bold text-blue-900 dark:text-blue-300 bg-blue-100 dark:bg-blue-950 px-2 py-0.5 border border-blue-200 dark:border-blue-800">
            {t.overall_mastery_index}%
          </span>
          <Link
            href="/twin"
            className="text-blue-700 hover:text-blue-900 dark:text-blue-400 font-semibold"
          >
            OPEN TWIN STUDIO →
          </Link>
        </div>
      </div>

      {/* 4 Cognitive State Quadrants */}
      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 1. KNOWN / MASTERED */}
        <div className="p-4 bg-emerald-50/50 dark:bg-stone-800/60 border border-emerald-200 dark:border-emerald-900/60 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200 dark:border-emerald-900 font-mono">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-700" />
                KNOWN (MASTERED)
              </span>
              <span className="text-xs text-emerald-800 font-bold">{t.known.length}</span>
            </div>

            <div className="space-y-2">
              {t.known.map((item, idx) => (
                <div key={idx} className="p-2.5 bg-white dark:bg-stone-800 border border-emerald-100 dark:border-stone-700 space-y-1">
                  <div className="font-sans font-medium text-xs text-stone-900 dark:text-white">
                    {item.skill}
                  </div>
                  <div className="text-[10px] font-mono text-stone-400">
                    {item.evidence}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. DEVELOPING / IN PROGRESS */}
        <div className="p-4 bg-blue-50/50 dark:bg-stone-800/60 border border-blue-200 dark:border-blue-900/60 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-blue-200 dark:border-blue-900 font-mono">
              <span className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp size={14} className="text-blue-700" />
                DEVELOPING
              </span>
              <span className="text-xs text-blue-800 font-bold">{t.developing.length}</span>
            </div>

            <div className="space-y-2">
              {t.developing.map((item, idx) => (
                <div key={idx} className="p-2.5 bg-white dark:bg-stone-800 border border-blue-100 dark:border-stone-700 space-y-1">
                  <div className="font-sans font-medium text-xs text-stone-900 dark:text-white">
                    {item.skill}
                  </div>
                  <div className="text-[10px] font-mono text-stone-400">
                    {item.evidence}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. WEAK / NEEDS PRACTICE */}
        <div className="p-4 bg-amber-50/50 dark:bg-stone-800/60 border border-amber-200 dark:border-amber-900/60 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200 dark:border-amber-900 font-mono">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-amber-700" />
                NEEDS PRACTICE
              </span>
              <span className="text-xs text-amber-800 font-bold">{t.needs_practice.length}</span>
            </div>

            <div className="space-y-2">
              {t.needs_practice.map((item, idx) => (
                <div key={idx} className="p-2.5 bg-white dark:bg-stone-800 border border-amber-100 dark:border-stone-700 space-y-1">
                  <div className="font-sans font-medium text-xs text-stone-900 dark:text-white">
                    {item.skill}
                  </div>
                  <div className="text-[10px] font-mono text-amber-700 dark:text-amber-400">
                    {item.evidence}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. READY FOR / UNLOCKED */}
        <div className="p-4 bg-purple-50/50 dark:bg-stone-800/60 border border-purple-200 dark:border-purple-900/60 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-purple-200 dark:border-purple-900 font-mono">
              <span className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-purple-700" />
                READY FOR
              </span>
              <span className="text-xs text-purple-800 font-bold">{t.ready_for.length}</span>
            </div>

            <div className="space-y-2">
              {t.ready_for.map((item, idx) => (
                <div key={idx} className="p-2.5 bg-white dark:bg-stone-800 border border-purple-100 dark:border-stone-700 space-y-1">
                  <div className="font-sans font-medium text-xs text-stone-900 dark:text-white">
                    {item.skill}
                  </div>
                  <div className="text-[10px] font-mono text-purple-700 dark:text-purple-400">
                    {item.evidence}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
