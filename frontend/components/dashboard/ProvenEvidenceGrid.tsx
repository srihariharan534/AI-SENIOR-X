'use client';

import React from 'react';
import Link from 'next/link';

interface EvidenceItem {
  skill: string;
  state: 'INTRODUCED' | 'LEARNING' | 'DEVELOPING' | 'DEMONSTRATED' | 'APPLIED' | 'RETAINED';
  projects: number;
  assessments: number;
  realWorldApps: number;
  verifiedLabel: string;
  badgeCode: string;
}

interface ProvenEvidenceGridProps {
  evidenceList?: EvidenceItem[];
}

const DEFAULT_EVIDENCE: EvidenceItem[] = [
  {
    skill: 'Python Engineering',
    state: 'APPLIED',
    projects: 3,
    assessments: 18,
    realWorldApps: 2,
    verifiedLabel: 'Production FastAPI & Vector Store Pipelines',
    badgeCode: 'EVD-PY-9942',
  },
  {
    skill: 'SQL & Data Systems',
    state: 'DEMONSTRATED',
    projects: 1,
    assessments: 11,
    realWorldApps: 1,
    verifiedLabel: 'Optimized Window Queries & Analytical Views',
    badgeCode: 'EVD-SQL-4410',
  },
  {
    skill: 'Machine Learning',
    state: 'DEVELOPING',
    projects: 2,
    assessments: 8,
    realWorldApps: 1,
    verifiedLabel: 'Scikit-learn / XGBoost Feature Pipelines',
    badgeCode: 'EVD-ML-2104',
  },
  {
    skill: 'Generative AI & RAG',
    state: 'LEARNING',
    projects: 1,
    assessments: 5,
    realWorldApps: 1,
    verifiedLabel: 'Hybrid Chunking & Dense Retrieval Graph',
    badgeCode: 'EVD-RAG-8831',
  },
  {
    skill: 'Distributed Systems',
    state: 'INTRODUCED',
    projects: 0,
    assessments: 3,
    realWorldApps: 0,
    verifiedLabel: 'Event-driven message broker topology',
    badgeCode: 'EVD-SYS-1099',
  },
];

const STATE_STYLE_MAP: Record<EvidenceItem['state'], { border: string; bg: string; text: string; dot: string }> = {
  INTRODUCED: { border: 'border-stone-700/60', bg: 'bg-stone-900/40', text: 'text-stone-400', dot: 'bg-stone-500' },
  LEARNING: { border: 'border-blue-900/70', bg: 'bg-blue-950/40', text: 'text-blue-300', dot: 'bg-blue-400' },
  DEVELOPING: { border: 'border-amber-900/70', bg: 'bg-amber-950/40', text: 'text-amber-300', dot: 'bg-amber-400' },
  DEMONSTRATED: { border: 'border-cyan-900/70', bg: 'bg-cyan-950/40', text: 'text-cyan-300', dot: 'bg-cyan-400' },
  APPLIED: { border: 'border-emerald-800/80', bg: 'bg-emerald-950/50', text: 'text-emerald-300', dot: 'bg-emerald-400' },
  RETAINED: { border: 'border-indigo-800/80', bg: 'bg-indigo-950/50', text: 'text-indigo-300', dot: 'bg-indigo-400' },
};

export const ProvenEvidenceGrid: React.FC<ProvenEvidenceGridProps> = ({ evidenceList = DEFAULT_EVIDENCE }) => {
  return (
    <section className="border border-stone-800 bg-[#0e1015] rounded-none p-6 md:p-8 space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-stone-400">
            <span className="text-emerald-400 font-bold">● VERIFIED PROOF</span>
            <span className="text-stone-600">/</span>
            <span>EVIDENCE LEDGER</span>
          </div>
          <h2 className="mt-2 text-2xl md:text-3xl font-serif text-stone-100 tracking-tight">
            Proven Capability State
          </h2>
          <p className="mt-1 text-xs text-stone-400 font-mono">
            No synthetic percentages. Quantified artifacts, evaluated attempts, and verified executions.
          </p>
        </div>

        <Link
          href="/evidence"
          className="inline-flex items-center gap-2 self-start font-mono text-xs text-stone-300 hover:text-emerald-400 border border-stone-700 px-3 py-1.5 transition-colors uppercase tracking-wider"
        >
          <span>FULL AUDIT TRAIL</span>
          <span>→</span>
        </Link>
      </div>

      {/* Grid of Evidence Records */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {evidenceList.map((item, idx) => {
          const style = STATE_STYLE_MAP[item.state] || STATE_STYLE_MAP.LEARNING;

          return (
            <div
              key={item.skill}
              className="group border border-stone-800/90 bg-[#12151c] p-5 flex flex-col justify-between hover:border-stone-700 transition-colors relative"
            >
              {/* Header: Skill & Status */}
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] text-stone-500 mb-2">
                  <span>REF #{String(idx + 1).padStart(2, '0')}</span>
                  <span className="text-stone-400 tracking-wider">{item.badgeCode}</span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-serif text-lg text-stone-100 group-hover:text-white transition-colors">
                    {item.skill}
                  </h3>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 border font-mono text-[10px] uppercase font-semibold tracking-wider ${style.border} ${style.bg} ${style.text}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                    {item.state}
                  </span>
                </div>

                <p className="mt-3 text-xs text-stone-400 font-sans leading-relaxed">
                  {item.verifiedLabel}
                </p>
              </div>

              {/* Evidence Metrics (Concrete counts, not percentages) */}
              <div className="mt-6 pt-4 border-t border-stone-800/80 grid grid-cols-3 gap-2 text-center font-mono">
                <div className="bg-stone-900/60 p-2 border border-stone-800/50">
                  <div className="text-stone-100 font-bold text-sm">{String(item.projects).padStart(2, '0')}</div>
                  <div className="text-[9px] uppercase tracking-wider text-stone-500 mt-0.5">Projects</div>
                </div>
                <div className="bg-stone-900/60 p-2 border border-stone-800/50">
                  <div className="text-stone-100 font-bold text-sm">{String(item.assessments).padStart(2, '0')}</div>
                  <div className="text-[9px] uppercase tracking-wider text-stone-500 mt-0.5">Assessed</div>
                </div>
                <div className="bg-stone-900/60 p-2 border border-stone-800/50">
                  <div className="text-stone-100 font-bold text-sm">{String(item.realWorldApps).padStart(2, '0')}</div>
                  <div className="text-[9px] uppercase tracking-wider text-stone-500 mt-0.5">Applied</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
