'use client';

import React from 'react';
import Link from 'next/link';
import { Briefcase, ArrowRight, ShieldAlert, Cpu, CheckCircle2, Clock } from 'lucide-react';

export const RealWorldChallengeSection: React.FC = () => {
  return (
    <div className="border border-slate-800 bg-gradient-to-br from-[#090D16] via-[#050811] to-[#0D1527] rounded-2xl p-6 sm:p-8 space-y-6 text-slate-100 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
            ENTERPRISE SIMULATION // FROM KNOWLEDGE TO REALITY
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-serif tracking-tight mt-0.5">
            Real-World Challenge 07
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded border border-slate-800">
          Tier: Senior AI Systems Architect
        </span>
      </div>

      {/* Scenario Breakdown */}
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-black/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
            <ShieldAlert size={15} />
            <span>Incident Briefing: High-Latency Hallucination in Customer RAG Engine</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            &ldquo;Your enterprise customer-support RAG system is returning irrelevant answers and exceeding SLA limits on ambiguous user queries. Diagnose the retrieval bottleneck, re-engineer chunk metadata indexing, and implement cross-encoder re-ranking.&rdquo;
          </p>
        </div>

        {/* 4-Step Action Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            <span className="text-[10px] text-slate-500 block">PHASE 1</span>
            <strong>Identify Failure Mode</strong>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            <span className="text-[10px] text-slate-500 block">PHASE 2</span>
            <strong>Investigate Retrieval</strong>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            <span className="text-[10px] text-slate-500 block">PHASE 3</span>
            <strong>Optimize Pipeline</strong>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            <span className="text-[10px] text-slate-500 block">PHASE 4</span>
            <strong>Justify Architecture</strong>
          </div>
        </div>

        {/* Constraints */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>Dataset: 1.2M Support Transcripts</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>P95 Latency Constraint: &lt; 25ms</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Target Recall@5: &gt; 94.0%</span>
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <span className="text-xs font-mono text-slate-400">
          Generates verifiable Proof-of-Work portfolio artifact upon submission.
        </span>

        <Link
          href="/scenarios"
          className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-mono font-bold text-xs shadow-lg shadow-amber-600/20 flex items-center justify-center gap-1.5 transition-all"
        >
          <Briefcase size={14} />
          <span>[ SOLVE REAL-WORLD CHALLENGE ]</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
};
