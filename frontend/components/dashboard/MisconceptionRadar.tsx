'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Misconception {
  id: string;
  topic: string;
  classification: 'Recurring Weakness' | 'Needs More Application' | 'Strong Concept, Weak Implementation';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  whyItMatters: string;
  whatToDo: string;
  nextLessonTitle: string;
  nextLessonHref: string;
}

const DEFAULT_MISCONCEPTIONS: Misconception[] = [
  {
    id: 'MSC-01',
    topic: 'Retrieval Evaluation in RAG',
    classification: 'Recurring Weakness',
    severity: 'HIGH',
    whyItMatters:
      'Cosine similarity scores do not guarantee grounded context. Without recall@k and faithfulness metrics, hallucinated tokens pass silently to generation.',
    whatToDo:
      'Implement Ragas or TruLens evaluation harnesses with deterministic synthetic test queries before deploying prompt iterations.',
    nextLessonTitle: 'Module 07 / Lesson 04: Grounded Retrieval Metric Frameworks',
    nextLessonHref: '/learn/rag-evaluation',
  },
  {
    id: 'MSC-02',
    topic: 'SQL Window Frame Clauses',
    classification: 'Needs More Application',
    severity: 'MEDIUM',
    whyItMatters:
      'Default framing (RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) causes subtle aggregation skew on duplicate timestamps in rolling windows.',
    whatToDo:
      'Explicitly specify ROWS BETWEEN N PRECEDING AND CURRENT ROW on all time-series running metrics.',
    nextLessonTitle: 'Module 03 / Lesson 08: Deterministic Window Partitioning',
    nextLessonHref: '/learn/sql-window-functions',
  },
  {
    id: 'MSC-03',
    topic: 'Asyncio Event Loop Blocking in Python',
    classification: 'Strong Concept, Weak Implementation',
    severity: 'HIGH',
    whyItMatters:
      'Calling synchronous disk I/O or cpu-bound serialization inside async FastAPI routes stalls the event loop worker for all concurrent requests.',
    whatToDo:
      'Offload synchronous model calls to run_in_executor or dedicated Celery/Ray background tasks.',
    nextLessonTitle: 'Module 01 / Lesson 11: Production Non-Blocking Event Loops',
    nextLessonHref: '/learn/async-python-architecture',
  },
];

export const MisconceptionRadar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(DEFAULT_MISCONCEPTIONS[0].id);

  const selected = DEFAULT_MISCONCEPTIONS.find((m) => m.id === activeTab) || DEFAULT_MISCONCEPTIONS[0];

  return (
    <section className="border border-stone-800 bg-[#0c0e14] p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-stone-400">
            <span className="text-amber-400 font-bold">● COGNITIVE RADAR</span>
            <span className="text-stone-600">/</span>
            <span>LEARNING TWIN DIAGNOSTIC</span>
          </div>
          <h2 className="mt-2 text-2xl md:text-3xl font-serif text-stone-100 tracking-tight">
            What Your Twin Noticed
          </h2>
          <p className="mt-1 text-xs text-stone-400 font-mono">
            Pattern-matched misconceptions detected across your last 12 code submissions and interactive queries.
          </p>
        </div>

        {/* Today's Insight Callout */}
        <div className="md:max-w-xs border-l-2 border-amber-500/80 bg-amber-950/20 pl-3 py-1 font-serif text-xs text-amber-200/90 italic">
          &ldquo;You don&apos;t need another tutorial. You need to apply retrieval evaluation to a real system.&rdquo;
          <div className="font-mono text-[9px] uppercase tracking-wider text-amber-400/70 not-italic mt-1">
            — Twin Synthesized Insight
          </div>
        </div>
      </div>

      {/* Misconception Tab Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {DEFAULT_MISCONCEPTIONS.map((m, idx) => {
          const isSelected = m.id === activeTab;
          return (
            <button
              key={m.id}
              onClick={() => setActiveTab(m.id)}
              className={`text-left p-4 border transition-all ${
                isSelected
                  ? 'border-amber-500/80 bg-[#161a24] shadow-sm'
                  : 'border-stone-800/80 bg-[#10131a] hover:border-stone-700 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[10px] text-stone-400 mb-1.5">
                <span>OBSERVATION 0{idx + 1}</span>
                <span
                  className={`font-bold ${
                    m.severity === 'HIGH' ? 'text-rose-400' : 'text-amber-400'
                  }`}
                >
                  {m.severity} SEVERITY
                </span>
              </div>
              <div className="font-serif text-base text-stone-100 font-medium line-clamp-1">{m.topic}</div>
              <div className="mt-2 text-[11px] font-mono text-amber-300/80">{m.classification}</div>
            </button>
          );
        })}
      </div>

      {/* Detailed Diagnostic Panel */}
      <div className="border border-stone-800 bg-[#131620] p-5 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-widest text-stone-400">
            01 / Why It Matters
          </div>
          <p className="text-xs md:text-sm text-stone-300 font-sans leading-relaxed">
            {selected.whyItMatters}
          </p>
        </div>

        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400 font-semibold">
            02 / Targeted Action
          </div>
          <p className="text-xs md:text-sm text-stone-300 font-sans leading-relaxed">
            {selected.whatToDo}
          </p>
        </div>

        <div className="space-y-3 flex flex-col justify-between border-t md:border-t-0 md:border-l border-stone-800 pt-4 md:pt-0 md:pl-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-blue-400 font-semibold">
              03 / Next Remedial Lesson
            </div>
            <p className="text-xs text-stone-200 font-serif mt-1 font-medium leading-snug">
              {selected.nextLessonTitle}
            </p>
          </div>

          <Link
            href={selected.nextLessonHref}
            className="inline-flex items-center justify-between w-full font-mono text-xs font-semibold px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black uppercase tracking-wider transition-colors"
          >
            <span>DRILL THIS CONCEPT</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
