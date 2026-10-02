'use client';

import React from 'react';
import Link from 'next/link';

interface LearnerStateHeroProps {
  learnerName?: string;
  roleTarget?: string;
  targetRole?: string;
  currentState?: string;
  focusAreas?: string[] | string;
  currentFocus?: string;
  currentModule?:
    | string
    | {
        track: string;
        moduleNumber: number;
        totalModules: number;
        conceptName: string;
        status: 'INTRODUCED' | 'LEARNING' | 'DEVELOPING' | 'DEMONSTRATED' | 'APPLIED' | 'RETAINED';
        diagnosis: string;
      };
  currentConcept?: string;
  conceptStatus?: 'INTRODUCED' | 'LEARNING' | 'DEVELOPING' | 'DEMONSTRATED' | 'APPLIED' | 'RETAINED';
  diagnosisSummary?: string;
}

export const LearnerStateHero: React.FC<LearnerStateHeroProps> = ({
  learnerName = 'Srihari Haran',
  roleTarget,
  targetRole = 'Senior AI & Data Engineer Path',
  currentState = 'BUILDING',
  focusAreas,
  currentFocus = 'AI Engineering + Data Systems + Production AI',
  currentModule = {
    track: 'AI Engineering',
    moduleNumber: 7,
    totalModules: 24,
    conceptName: 'Retrieval-Augmented Generation (RAG)',
    status: 'DEVELOPING',
    diagnosis:
      'You can explain RAG architecture, but still need stronger retrieval evaluation and production implementation under latency constraints.',
  },
  currentConcept,
  conceptStatus,
  diagnosisSummary,
}) => {
  const displayRole = roleTarget || targetRole;
  const displayFocus =
    typeof focusAreas === 'string'
      ? focusAreas
      : Array.isArray(focusAreas)
      ? focusAreas.join(' + ')
      : currentFocus;

  // Normalize module data
  const modTrack =
    typeof currentModule === 'object' ? currentModule.track : 'AI Engineering';
  const modNum =
    typeof currentModule === 'object' ? currentModule.moduleNumber : 7;
  const modTotal =
    typeof currentModule === 'object' ? currentModule.totalModules : 24;
  const modConcept =
    currentConcept ||
    (typeof currentModule === 'object'
      ? currentModule.conceptName
      : 'Retrieval-Augmented Generation');
  const modStatus =
    conceptStatus ||
    (typeof currentModule === 'object' ? currentModule.status : 'DEVELOPING');
  const modDiagnosis =
    diagnosisSummary ||
    (typeof currentModule === 'object'
      ? currentModule.diagnosis
      : 'You can explain RAG architecture, but still need stronger retrieval evaluation and production implementation.');

  return (
    <section className="border border-stone-800 bg-[#0e1017] p-6 md:p-8 space-y-6">
      {/* Top Dossier System Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4 font-mono text-[11px] text-stone-400">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-bold uppercase tracking-widest">
            ● SYSTEM STATE: ACTIVE
          </span>
          <span className="text-stone-600">/</span>
          <span className="text-stone-500 uppercase">DOSSIER REF: ASX-2026.10</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-stone-300">
            COGNITIVE TWIN: <strong className="text-emerald-400">SYNCHRONIZED</strong>
          </span>
          <span className="text-stone-600">|</span>
          <span>LATENCY: 18ms</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Big Editorial Statement (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-1">
            <div className="font-mono text-[11px] uppercase tracking-widest text-stone-400">
              YOUR LEARNING STATE
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-normal text-stone-100 tracking-tight">
              {learnerName}
            </h1>
            <p className="text-sm font-mono text-stone-300 tracking-wide pt-0.5">
              {displayRole}
            </p>
          </div>

          <div className="border-t border-stone-800 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
            <div className="bg-[#12151e] border border-stone-800/80 p-4 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-stone-400">
                CURRENT STATE
              </span>
              <div className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {currentState}
              </div>
            </div>

            <div className="bg-[#12151e] border border-stone-800/80 p-4 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-stone-400">
                YOUR CURRENT FOCUS
              </span>
              <div className="text-xs text-stone-200 font-sans font-medium pt-1">
                {displayFocus}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: "YOU ARE HERE" Editorial Marker (5 cols) */}
        <div className="lg:col-span-5 border border-amber-900/60 bg-[#14120e] p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between font-mono text-xs border-b border-amber-900/40 pb-3">
            <span className="text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              YOU ARE HERE →
            </span>
            <span className="px-2 py-0.5 border border-amber-800 bg-amber-950/60 text-amber-300 text-[10px] font-bold">
              {modStatus}
            </span>
          </div>

          <div className="space-y-1">
            <div className="font-mono text-[10px] uppercase tracking-wider text-stone-400">
              {modTrack} MODULE 0{modNum} / {modTotal}
            </div>
            <h3 className="font-serif text-lg text-stone-100 font-medium leading-snug">
              {modConcept}
            </h3>
          </div>

          <p className="text-xs text-stone-300 font-sans leading-relaxed italic border-l-2 border-amber-600/70 pl-3">
            &ldquo;{modDiagnosis}&rdquo;
          </p>

          <div className="pt-2 flex items-center justify-between font-mono text-[11px]">
            <span className="text-stone-400">Source: Cognitive Twin Telemetry</span>
            <Link
              href="/learn"
              className="text-amber-400 hover:text-amber-300 uppercase tracking-wider font-semibold transition-colors"
            >
              DRILL CONCEPT →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
