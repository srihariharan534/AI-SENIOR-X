'use client';

import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
  TrendingUp,
  Brain,
  Code2,
  Clock,
  Target,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Briefcase,
} from 'lucide-react';
import { SubjectDetail, ModuleDetail } from '@/types/curriculum';

interface SubjectOverviewModalProps {
  subject: SubjectDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenLesson: (lessonId: string) => void;
}

export const SubjectOverviewModal: React.FC<SubjectOverviewModalProps> = ({
  subject,
  isOpen,
  onClose,
  onOpenLesson,
}) => {
  const [expandedModuleIdx, setExpandedModuleIdx] = useState<number>(0);

  if (!isOpen || !subject) return null;

  // Generate dynamic sample modules if empty
  const modules: ModuleDetail[] = subject.modules.length > 0 ? subject.modules : [
    {
      id: `${subject.id}-mod-01`,
      subjectId: subject.id,
      moduleNumber: 1,
      title: `${subject.name} Foundations & Architecture`,
      description: 'Core syntax, memory model, reference semantics, and computational foundations.',
      progressPct: 100,
      estimatedMinutes: 65,
      difficulty: 'Beginner',
      assessmentStatus: 'Passed',
      masteryPct: 95,
      concepts: ['Syntax semantics', 'Memory references', 'Type system'],
      practiceProblemsCount: 14,
      lessons: [],
    },
    {
      id: `${subject.id}-mod-02`,
      subjectId: subject.id,
      moduleNumber: 2,
      title: 'Intermediate Patterns & Data Manipulation',
      description: 'Functional transformations, closures, vectorized execution, and error handling.',
      progressPct: 80,
      estimatedMinutes: 90,
      difficulty: 'Intermediate',
      assessmentStatus: 'In Progress',
      masteryPct: 82,
      concepts: ['Vectorization', 'Closures', 'Error boundaries'],
      practiceProblemsCount: 22,
      lessons: [],
    },
    {
      id: `${subject.id}-mod-03`,
      subjectId: subject.id,
      moduleNumber: 3,
      title: 'Advanced Optimization & Real-World Systems',
      description: 'Performance benchmarking, concurrency, distributed scaling, and production reliability.',
      progressPct: 40,
      estimatedMinutes: 120,
      difficulty: 'Advanced',
      assessmentStatus: 'In Progress',
      masteryPct: 58,
      concepts: ['Concurrency', 'Profiling', 'Distributed memory'],
      practiceProblemsCount: 18,
      lessons: [],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#090c14] border border-stone-800 shadow-2xl shadow-indigo-950/80 flex flex-col max-h-[92vh] overflow-hidden text-stone-100 font-sans">
        
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-stone-800 bg-[#0d101a] flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-indigo-400 font-bold uppercase">{subject.courseName}</span>
              <span className="text-stone-600">/</span>
              <span className="text-stone-400 uppercase">{subject.category}</span>
              <span className="text-stone-600">/</span>
              <span className="px-2 py-0.2 bg-stone-900 border border-stone-800 text-stone-300 text-[10px] uppercase font-bold">
                {subject.level}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif text-stone-100 font-bold">
              {subject.name}
            </h2>
            <p className="text-xs text-stone-300 max-w-3xl pt-0.5">
              {subject.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white border border-stone-800 hover:border-stone-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* 4 COGNITIVE STATE STAT CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-stone-800 border-b border-stone-800">
          <div className="p-4 bg-[#0a0d15] space-y-1">
            <div className="text-[10px] font-mono uppercase text-stone-400">Mastery Level</div>
            <div className="text-2xl font-mono font-bold text-emerald-400 flex items-center gap-1.5">
              <span>{subject.masteryPct}%</span>
              <TrendingUp size={16} />
            </div>
            <div className="text-[10px] font-mono text-stone-500">Bayesian BKT validated</div>
          </div>

          <div className="p-4 bg-[#0a0d15] space-y-1">
            <div className="text-[10px] font-mono uppercase text-stone-400">Curriculum Progress</div>
            <div className="text-2xl font-mono font-bold text-cyan-400">
              {subject.progressPct}%
            </div>
            <div className="text-[10px] font-mono text-stone-500">{subject.lessonsCompleted} of {subject.lessonsTotal} lessons done</div>
          </div>

          <div className="p-4 bg-[#0a0d15] space-y-1">
            <div className="text-[10px] font-mono uppercase text-stone-400">Retention Stability</div>
            <div className="text-2xl font-mono font-bold text-indigo-300">
              {subject.retentionPct}%
            </div>
            <div className="text-[10px] font-mono text-stone-500">Half-life: 24 days</div>
          </div>

          <div className="p-4 bg-[#0a0d15] space-y-1">
            <div className="text-[10px] font-mono uppercase text-stone-400">Problems Solved</div>
            <div className="text-2xl font-mono font-bold text-amber-300">
              {subject.problemsSolved}
            </div>
            <div className="text-[10px] font-mono text-stone-500">Avg accuracy: {subject.assessmentScore}%</div>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-6">
          
          {/* COGNITIVE GAP WARNING (IF PRESENT) */}
          {subject.cognitiveGap && (
            <div className="p-4 bg-[#140e12] border-l-4 border-rose-500 border-y border-r border-stone-800 space-y-1">
              <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase">
                <AlertTriangle size={14} />
                <span>ACTIVE COGNITIVE GAP DETECTED:</span>
              </div>
              <p className="text-xs text-stone-200 font-sans">
                {subject.cognitiveGap}
              </p>
            </div>
          )}

          {/* NEXT RECOMMENDED LESSON CTA */}
          <div className="p-5 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-[#0c0f18] border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="font-mono text-[10px] uppercase tracking-wider text-indigo-400 font-bold flex items-center gap-1.5">
                <Sparkles size={12} />
                <span>UP NEXT IN YOUR ADAPTIVE PATH</span>
              </div>
              <h3 className="font-serif text-lg text-white font-bold">
                {subject.nextRecommendedLesson}
              </h3>
              <p className="text-xs text-stone-300 font-mono">
                Estimated time: 18 min • Aligned with target role skills
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenLesson(subject.nextLessonId || 'lesson-dl-act-01');
              }}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shrink-0 shadow-lg shadow-indigo-600/30"
            >
              <span>START LESSON</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* COMPLETE MODULE HIERARCHY */}
          <div className="space-y-3">
            <div className="flex items-center justify-between font-mono text-xs text-stone-400">
              <span className="uppercase font-bold tracking-wider">COMPLETE MODULE HIERARCHY ({modules.length} MODULES)</span>
              <span>EXPAND FOR LESSONS & DRILLS</span>
            </div>

            <div className="space-y-3">
              {modules.map((mod, idx) => {
                const isExpanded = expandedModuleIdx === idx;
                return (
                  <div key={mod.id} className="border border-stone-800 bg-[#0c0f18]">
                    <button
                      onClick={() => setExpandedModuleIdx(isExpanded ? -1 : idx)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-[#101420] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded bg-[#161a28] border border-stone-700 flex items-center justify-center font-mono text-xs font-bold text-indigo-400">
                          0{mod.moduleNumber}
                        </span>
                        <div>
                          <div className="font-serif text-sm font-semibold text-stone-100">
                            {mod.title}
                          </div>
                          <div className="text-[11px] text-stone-400 font-mono">
                            {mod.estimatedMinutes} min • {mod.practiceProblemsCount} practice tasks • Status: {mod.assessmentStatus}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 font-mono text-xs">
                        <div className="hidden sm:flex items-center gap-2">
                          <span className="text-stone-400">Mastery:</span>
                          <span className="text-emerald-400 font-bold">{mod.masteryPct}%</span>
                        </div>
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-4 border-t border-stone-800 bg-[#080a10] space-y-3 font-mono text-xs">
                        <p className="text-stone-300 font-sans text-xs">
                          {mod.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="text-[10px] text-stone-400 uppercase font-bold">Concepts:</span>
                          {mod.concepts.map((c, i) => (
                            <span key={i} className="px-2 py-0.5 bg-[#121522] border border-stone-800 text-stone-300 text-[10px]">
                              {c}
                            </span>
                          ))}
                        </div>

                        <div className="pt-2 flex items-center gap-3">
                          <button
                            onClick={() => {
                              onClose();
                              onOpenLesson('lesson-dl-act-01');
                            }}
                            className="px-4 py-2 bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/40 text-white text-xs font-bold transition-colors"
                          >
                            LAUNCH MODULE LESSONS →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CONNECTED PROJECTS & PREREQUISITES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 bg-[#0c0f18] border border-stone-800 space-y-2">
              <div className="text-stone-400 uppercase font-bold flex items-center gap-1.5">
                <Target size={13} className="text-cyan-400" />
                <span>PREREQUISITES</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {subject.prerequisites.map((p, i) => (
                  <span key={i} className="px-2 py-1 bg-[#121520] border border-stone-800 text-stone-300 text-[11px]">
                    ✓ {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[#0c0f18] border border-stone-800 space-y-2">
              <div className="text-stone-400 uppercase font-bold flex items-center gap-1.5">
                <Briefcase size={13} className="text-amber-400" />
                <span>CONNECTED PORTFOLIO PROJECTS</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {subject.projectsConnected.map((prj, i) => (
                  <span key={i} className="px-2 py-1 bg-[#121520] border border-stone-800 text-stone-300 text-[11px]">
                    ⚡ {prj}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-stone-800 bg-[#0a0d14] flex items-center justify-between font-mono text-xs">
          <span className="text-stone-400">
            Last studied: <strong className="text-stone-200">{subject.lastStudied}</strong>
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white"
          >
            CLOSE OVERVIEW
          </button>
        </div>

      </div>
    </div>
  );
};
