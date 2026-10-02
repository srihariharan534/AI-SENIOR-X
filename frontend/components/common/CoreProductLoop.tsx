'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BrainCircuit,
  Search,
  Cpu,
  Compass,
  GraduationCap,
  Code2,
  CheckCircle2,
  Activity,
  Wrench,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Briefcase,
  ShieldCheck,
  RefreshCw,
  Info,
  Video,
  Play,
} from 'lucide-react';

interface CoreProductLoopProps {
  currentActiveStep?: number; // 1 to 15
  compact?: boolean;
}

export const CoreProductLoop: React.FC<CoreProductLoopProps> = ({
  currentActiveStep = 12,
  compact = false,
}) => {
  const [selectedStep, setSelectedStep] = useState<number>(currentActiveStep);
  const [showExplainer, setShowExplainer] = useState(false);

  const loopSteps = [
    {
      id: 1,
      title: 'ASSESS',
      icon: Search,
      category: 'Understand',
      desc: 'Probe prior knowledge, initial assumptions, and baseline reasoning.',
    },
    {
      id: 2,
      title: 'UNDERSTAND',
      icon: BrainCircuit,
      category: 'Understand',
      desc: 'Detect student learning goals, pacing, and cognitive state.',
    },
    {
      id: 3,
      title: 'MODEL',
      icon: Cpu,
      category: 'Model',
      desc: 'Maintain dynamic Bayesian knowledge state and memory decay in Cognitive Twin.',
    },
    {
      id: 4,
      title: 'PLAN',
      icon: Compass,
      category: 'Plan',
      desc: 'Compute personalized prerequisite-aware DAG learning path.',
    },
    {
      id: 5,
      title: 'TEACH',
      icon: GraduationCap,
      category: 'Teach',
      desc: 'Socratic dialogue connecting concept to concrete examples.',
    },
    {
      id: 6,
      title: 'PRACTICE',
      icon: Code2,
      category: 'Practice',
      desc: 'Targeted coding exercises with progressive scaffolded hints.',
    },
    {
      id: 7,
      title: 'EVALUATE',
      icon: CheckCircle2,
      category: 'Evaluate',
      desc: 'Multi-criteria automated analysis of syntax, logic, and edge cases.',
    },
    {
      id: 8,
      title: 'DIAGNOSE',
      icon: Activity,
      category: 'Diagnose',
      desc: 'Distinguish superficial slips from root cognitive misconceptions.',
    },
    {
      id: 9,
      title: 'REMEDIATE',
      icon: Wrench,
      category: 'Remediate',
      desc: 'Targeted unlearning drill resolving prerequisite blockers.',
    },
    {
      id: 10,
      title: 'REASSESS',
      icon: RotateCcw,
      category: 'Reassess',
      desc: 'Verify conceptual recovery under varying boundary conditions.',
    },
    {
      id: 11,
      title: 'UPDATE TWIN',
      icon: Sparkles,
      category: 'Model',
      desc: 'Synchronize verified mastery, confidence, and retention parameters.',
    },
    {
      id: 12,
      title: 'NEXT ACTION',
      icon: ArrowRight,
      category: 'Action',
      desc: 'Recommend explainable next best step based on empirical evidence.',
    },
    {
      id: 13,
      title: 'APPLY PROJECT',
      icon: Briefcase,
      category: 'Apply',
      desc: 'Solve realistic problems with production scale constraints.',
    },
    {
      id: 14,
      title: 'EVIDENCE',
      icon: ShieldCheck,
      category: 'Evidence',
      desc: 'Generate verifiable cryptographic portfolio evidence artifacts.',
    },
    {
      id: 15,
      title: 'REPEAT',
      icon: RefreshCw,
      category: 'Continuous',
      desc: 'Continuous lifelong learning loop driven by career objectives.',
    },
  ];

  if (compact) {
    return (
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="text-indigo-400" size={14} />
            <span className="text-xs font-semibold text-white tracking-wide uppercase">
              Core Learning Loop
            </span>
          </div>
          <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
            Step {currentActiveStep} of 15
          </span>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin">
          {loopSteps.map((step) => {
            const isActive = step.id === currentActiveStep;
            const isPassed = step.id < currentActiveStep;
            return (
              <div
                key={step.id}
                className={`px-2 py-1 rounded text-[10px] font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white font-bold shadow-sm ring-1 ring-indigo-400'
                    : isPassed
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800/60 text-slate-400'
                }`}
              >
                {step.id}. {step.title}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900/90 via-slate-950 to-indigo-950/40 border border-indigo-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Sparkles size={18} />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              The AI-SENIOR-X Continuous Product Loop
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            LEARNING <span className="text-indigo-400">→</span> INTELLIGENCE{' '}
            <span className="text-indigo-400">→</span> ACTION{' '}
            <span className="text-indigo-400">→</span> EVIDENCE
          </p>
        </div>

        <button
          onClick={() => setShowExplainer(!showExplainer)}
          className="flex items-center gap-1.5 text-xs text-indigo-300 hover:text-indigo-100 bg-indigo-950/60 border border-indigo-800/60 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Info size={14} />
          <span>{showExplainer ? 'Hide Details' : 'Why this Loop Matters'}</span>
        </button>
      </div>

      {showExplainer && (
        <div className="my-4 p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-slate-300 leading-relaxed space-y-2 animate-fadeIn">
          <p className="font-semibold text-indigo-200">
            Not a generic quiz tracker or LLM chatbot:
          </p>
          <p>
            AI-SENIOR-X systematically isolates root misconceptions, enforces
            prerequisite mastery, and bridges theoretical learning to production-grade real-world
            projects with verifiable evidence.
          </p>
        </div>
      )}

      {/* 15-Step Pipeline Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-15 gap-2 my-5">
        {loopSteps.map((step) => {
          const Icon = step.icon;
          const isActive = step.id === currentActiveStep;
          const isSelected = step.id === selectedStep;
          const isPassed = step.id < currentActiveStep;

          return (
            <button
              key={step.id}
              onClick={() => setSelectedStep(step.id)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all duration-200 ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/20 ring-2 ring-indigo-400/50'
                  : isActive
                  ? 'bg-indigo-950/70 border-indigo-500 text-indigo-200 animate-pulse'
                  : isPassed
                  ? 'bg-slate-900/80 border-emerald-500/30 text-emerald-400 hover:bg-slate-800'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center mb-1.5 ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : isPassed
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Icon size={14} />
              </div>
              <span className="text-[9px] font-mono opacity-60">#{step.id}</span>
              <span className="text-[10px] font-bold tracking-tight truncate w-full">
                {step.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Selected Step Inspector */}
      {selectedStep && (
        <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              {React.createElement(loopSteps[selectedStep - 1].icon, { size: 20 })}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-indigo-400">
                  STEP {selectedStep}
                </span>
                <span className="text-sm font-bold text-white">
                  {loopSteps[selectedStep - 1].title}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  Phase: {loopSteps[selectedStep - 1].category}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {loopSteps[selectedStep - 1].desc}
              </p>
            </div>
          </div>

          {/* Contextual Action Button */}
          <div className="shrink-0 w-full sm:w-auto">
            {selectedStep === 5 ? (
              <Link
                href="/tutor?mode=video_studio&topic=python-foundations"
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all w-full sm:w-auto"
              >
                <Video size={14} />
                <span>Launch AI Video Teaching Studio</span>
                <ArrowRight size={13} />
              </Link>
            ) : selectedStep === 1 || selectedStep === 4 || selectedStep === 12 ? (
              <Link
                href="/learn"
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all w-full sm:w-auto"
              >
                <span>View Learning Path &amp; DAG</span>
                <ArrowRight size={13} />
              </Link>
            ) : selectedStep === 2 || selectedStep === 3 || selectedStep === 8 || selectedStep === 11 ? (
              <Link
                href="/learning-twin"
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all w-full sm:w-auto"
              >
                <span>Inspect Cognitive Twin</span>
                <ArrowRight size={13} />
              </Link>
            ) : selectedStep === 6 || selectedStep === 7 ? (
              <Link
                href="/practice"
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all w-full sm:w-auto"
              >
                <Code2 size={14} />
                <span>Open Practice Sandbox</span>
                <ArrowRight size={13} />
              </Link>
            ) : selectedStep === 9 ? (
              <Link
                href="/tutor?mode=multimodal_doubt"
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all w-full sm:w-auto"
              >
                <span>Remediate Misconceptions</span>
                <ArrowRight size={13} />
              </Link>
            ) : selectedStep === 10 ? (
              <Link
                href="/exam-mode"
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all w-full sm:w-auto"
              >
                <span>Enter Reassessment Exam</span>
                <ArrowRight size={13} />
              </Link>
            ) : selectedStep === 13 ? (
              <Link
                href="/projects"
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all w-full sm:w-auto"
              >
                <Briefcase size={14} />
                <span>Apply Real-World Projects</span>
                <ArrowRight size={13} />
              </Link>
            ) : selectedStep === 14 ? (
              <Link
                href="/certificates"
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all w-full sm:w-auto"
              >
                <ShieldCheck size={14} />
                <span>View Verified Certificates</span>
                <ArrowRight size={13} />
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all w-full sm:w-auto"
              >
                <span>Return to Dashboard</span>
                <ArrowRight size={13} />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
