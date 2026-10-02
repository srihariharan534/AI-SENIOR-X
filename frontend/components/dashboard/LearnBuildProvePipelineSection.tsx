'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Layers,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  Code2,
  Clock,
  ShieldCheck,
  Award,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PROJECT_CURRICULUM } from '@/lib/curriculumData';
import { ProjectCurriculumItem } from '@/types/curriculum';

export const LearnBuildProvePipelineSection: React.FC = () => {
  const [expandedProjectId, setExpandedProjectId] = useState<string>('proj-lvl-4');

  return (
    <section id="projects-section" className="border border-stone-800 bg-[#0e1017] p-6 md:p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-cyan-400 font-bold">
            <Briefcase size={14} />
            <span>LEARN → BUILD → PROVE PORTFOLIO PIPELINE</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-stone-100 font-bold tracking-tight">
            6 Progressive Capstone Levels
          </h2>
          <p className="text-xs text-stone-300 font-sans max-w-2xl">
            From foundational mini-projects to distributed industry simulations. Every completed project mints verified Git commits and cryptographic proof-of-work.
          </p>
        </div>

        {/* Pipeline Diagram Pill */}
        <div className="p-3 bg-[#0a0d14] border border-stone-800 font-mono text-[10px] text-stone-400 hidden sm:block">
          <span className="text-cyan-400 font-bold">Concept</span> → Practice → Challenge → <strong className="text-amber-400">Project</strong> → <strong className="text-emerald-400">Evidence</strong> → Job Skill
        </div>
      </div>

      {/* 6 LEVEL ACCORDION STACK */}
      <div className="space-y-4">
        {PROJECT_CURRICULUM.map((proj) => {
          const isExpanded = expandedProjectId === proj.id;
          const isCompleted = proj.status === 'Completed';
          const isInProgress = proj.status === 'In Progress';
          const isLocked = proj.status === 'Locked';

          return (
            <div
              key={proj.id}
              className={`border transition-all ${
                isInProgress
                  ? 'bg-[#101422] border-indigo-500/50 shadow-lg shadow-indigo-950/40'
                  : isCompleted
                  ? 'bg-[#0c0f18] border-stone-800 hover:border-emerald-500/40'
                  : 'bg-[#090b10] border-stone-850 opacity-60'
              }`}
            >
              {/* ACCORDION BAR */}
              <button
                onClick={() => setExpandedProjectId(isExpanded ? '' : proj.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left transition-colors font-mono"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : isInProgress
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 animate-pulse'
                        : 'bg-stone-800 text-stone-500'
                    }`}
                  >
                    {isCompleted ? '✓' : isLocked ? <Lock size={13} /> : `0${proj.levelNumber}`}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-[10px] uppercase">
                      <span className="text-cyan-400 font-bold">{proj.level}</span>
                      <span className="text-stone-600">•</span>
                      <span className="text-stone-400">{proj.domain}</span>
                    </div>
                    <div className="font-serif text-base text-stone-100 font-bold">
                      {proj.title}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="hidden sm:flex items-center gap-2">
                    <Clock size={12} className="text-stone-400" />
                    <span className="text-stone-300">{proj.estimatedHours}h</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
                      isCompleted
                        ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                        : isInProgress
                        ? 'bg-indigo-950/40 text-indigo-300 border-indigo-500/40'
                        : 'bg-stone-900 text-stone-500 border-stone-800'
                    }`}
                  >
                    {proj.status}
                  </span>

                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {/* EXPANDED PROJECT DETAILS */}
              {isExpanded && (
                <div className="p-5 sm:p-6 border-t border-stone-800 bg-[#080a10] space-y-4 font-sans text-xs">
                  <div>
                    <div className="font-mono text-[10px] text-stone-400 uppercase font-bold">
                      PROBLEM STATEMENT & ARCHITECTURAL OBJECTIVE:
                    </div>
                    <p className="text-stone-200 leading-relaxed pt-1">
                      {proj.problemStatement}
                    </p>
                  </div>

                  {/* Skills, Deliverables & AI Feedback Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                    <div className="p-3 bg-[#0d101a] border border-stone-800 space-y-1.5">
                      <div className="text-[10px] text-cyan-400 uppercase font-bold">REQUIRED SKILLS:</div>
                      <div className="flex flex-wrap gap-1">
                        {proj.requiredSkills.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 bg-[#141826] border border-stone-800 text-stone-300 text-[10px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-[#0d101a] border border-stone-800 space-y-1.5">
                      <div className="text-[10px] text-emerald-400 uppercase font-bold">SKILL EVIDENCE GENERATED:</div>
                      <div className="text-stone-300 text-[11px]">
                        ⚡ {proj.skillEvidenceGenerated}
                      </div>
                    </div>
                  </div>

                  {/* AI Feedback Audit */}
                  <div className="p-3 bg-[#0e121e] border-l-2 border-indigo-400 font-mono text-xs space-y-1">
                    <div className="text-indigo-300 text-[10px] uppercase font-bold">AI CODE REVIEW AUDIT:</div>
                    <p className="text-stone-300 font-sans text-xs italic">
                      &ldquo;{proj.aiFeedbackSummary}&rdquo;
                    </p>
                  </div>

                  {/* Actions & Verified Links */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-800/80 font-mono text-xs">
                    {proj.verifiedBadge ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-[11px]">
                        <ShieldCheck size={14} />
                        <span>{proj.verifiedBadge}</span>
                      </span>
                    ) : (
                      <span className="text-stone-500 text-[11px]">Evidence will mint upon passing test suite.</span>
                    )}

                    <div className="flex items-center gap-3">
                      {isCompleted && (
                        <a
                          href={proj.githubEvidenceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-stone-300 hover:text-white flex items-center gap-1 text-[11px] underline"
                        >
                          <span>VIEW GITHUB REPO</span>
                          <ExternalLink size={11} />
                        </a>
                      )}

                      {!isLocked && (
                        <Link
                          href="/projects"
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 text-[11px]"
                        >
                          <span>{isCompleted ? 'VIEW EVIDENCE' : 'OPEN WORKSPACE'}</span>
                          <ArrowRight size={12} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
