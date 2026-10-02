'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface ReasoningDetails {
  assessmentsAnalyzed?: number;
  practiceAttempts?: number;
  projectsReviewed?: number;
  misconceptionsIdentified?: number;
  realWorldChallenges?: number;
  narrativeReason?: string;
}

interface NextBestActionCardProps {
  actionTitle?: string;
  actionWhy?: string;
  estimatedMinutes?: number;
  evidenceGain?: string;
  startHref?: string;
  reasoningDetails?: ReasoningDetails;
}

export const NextBestActionCard: React.FC<NextBestActionCardProps> = ({
  actionTitle = 'Build a Production RAG Evaluation Pipeline',
  actionWhy = 'Your recent assessments show strong RAG fundamentals but limited evidence of production evaluation and recall@k validation.',
  estimatedMinutes = 42,
  evidenceGain = 'High',
  startHref = '/practice',
  reasoningDetails = {
    assessmentsAnalyzed: 3,
    practiceAttempts: 7,
    projectsReviewed: 2,
    misconceptionsIdentified: 4,
    realWorldChallenges: 1,
    narrativeReason:
      'You are ready for this challenge because you demonstrated retrieval fundamentals in your last assessment, but your telemetry showed unverified assumptions around dense vector drift under multi-tenant traffic.',
  },
}) => {
  const [showReasoning, setShowReasoning] = useState<boolean>(false);

  return (
    <section className="border border-stone-800 bg-[#0e1017] p-6 md:p-8 space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-4 font-mono text-[11px]">
        <div className="flex items-center gap-2">
          <span className="text-blue-400 font-bold uppercase tracking-widest">
            ● DIRECTIVE // NEXT BEST ACTION
          </span>
          <span className="text-stone-600">/</span>
          <span className="text-stone-400">PRIORITY 01</span>
        </div>
        <span className="text-stone-400">HIGHEST EVIDENCE YIELD</span>
      </div>

      {/* Main Statement */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl md:text-4xl font-serif text-stone-100 tracking-tight leading-snug">
            {actionTitle}
          </h2>
          <div className="mt-3 text-xs md:text-sm text-stone-300 font-sans leading-relaxed max-w-3xl">
            <span className="font-mono text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-1">
              WHY THIS ACTION?
            </span>
            {actionWhy}
          </div>
        </div>

        {/* Metadata Strip */}
        <div className="flex flex-wrap items-center gap-4 py-2 font-mono text-xs text-stone-300">
          <div className="bg-[#12151e] border border-stone-800 px-3 py-1.5 flex items-center gap-2">
            <span className="text-stone-400 text-[10px] uppercase">ESTIMATED:</span>
            <strong className="text-stone-100">{estimatedMinutes} min</strong>
          </div>
          <div className="bg-[#12151e] border border-emerald-900/60 text-emerald-300 px-3 py-1.5 flex items-center gap-2">
            <span className="text-emerald-400 text-[10px] uppercase">EVIDENCE GAIN:</span>
            <strong className="text-emerald-200">{evidenceGain}</strong>
          </div>
          <div className="bg-[#12151e] border border-stone-800 px-3 py-1.5 flex items-center gap-2">
            <span className="text-stone-400 text-[10px] uppercase">DOMAIN:</span>
            <strong className="text-stone-200">Generative AI &amp; MLOps</strong>
          </div>
        </div>

        {/* Action Button & AI Reasoning Toggle */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <Link
            href={startHref}
            className="font-mono text-xs font-semibold px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white uppercase tracking-wider transition-colors flex items-center justify-center gap-3"
          >
            <span>[ START ACTION ]</span>
            <span>→</span>
          </Link>

          <button
            onClick={() => setShowReasoning(!showReasoning)}
            className="font-mono text-xs px-4 py-3 border border-stone-800 bg-[#12151e] text-stone-400 hover:text-stone-200 hover:border-stone-700 flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
          >
            <span>{showReasoning ? 'HIDE AI REASONING' : 'WHY AM I SEEING THIS?'}</span>
            <span>{showReasoning ? '▲' : '▼'}</span>
          </button>
        </div>
      </div>

      {/* Expandable AI Reasoning Section */}
      {showReasoning && (
        <div className="border border-stone-800 bg-[#12151e] p-5 space-y-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-stone-300 text-[11px] uppercase tracking-wider">
            <span className="text-blue-400 font-bold">AI-SENIOR-X SYNTHESIS MATRIX:</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
            <div className="p-3 bg-[#0a0c10] border border-stone-800/80">
              <div className="text-base font-bold text-stone-100">
                0{reasoningDetails.assessmentsAnalyzed || 3}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-stone-400 mt-0.5">Assessments</div>
            </div>
            <div className="p-3 bg-[#0a0c10] border border-stone-800/80">
              <div className="text-base font-bold text-stone-100">
                0{reasoningDetails.practiceAttempts || 7}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-stone-400 mt-0.5">Attempts</div>
            </div>
            <div className="p-3 bg-[#0a0c10] border border-stone-800/80">
              <div className="text-base font-bold text-stone-100">
                0{reasoningDetails.projectsReviewed || 2}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-stone-400 mt-0.5">Projects</div>
            </div>
            <div className="p-3 bg-[#0a0c10] border border-stone-800/80">
              <div className="text-base font-bold text-amber-400">
                0{reasoningDetails.misconceptionsIdentified || 4}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-stone-400 mt-0.5">Misconceptions</div>
            </div>
            <div className="p-3 bg-[#0a0c10] border border-stone-800/80">
              <div className="text-base font-bold text-emerald-400">
                0{reasoningDetails.realWorldChallenges || 1}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-stone-400 mt-0.5">Challenge</div>
            </div>
          </div>

          <p className="text-xs text-stone-300 font-sans leading-relaxed border-l-2 border-blue-500 pl-3">
            {reasoningDetails.narrativeReason}
          </p>
        </div>
      )}
    </section>
  );
};
