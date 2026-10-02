'use client';

import React from 'react';
import Link from 'next/link';
import {
  Brain,
  Layers,
  BookOpen,
  Code2,
  Briefcase,
  Target,
  Sparkles,
  TrendingUp,
  Clock,
  Award,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface MyLearningProgramSectionProps {
  targetRole?: string;
  programTitle?: string;
  progressPct?: number;
  coursesCount?: number;
  coursesCompleted?: number;
  subjectsCount?: number;
  subjectsMastered?: number;
  modulesCount?: number;
  lessonsCount?: number;
  projectsCount?: number;
  problemsCount?: number;
  learningHours?: number;
  currentStage?: string;
  learningPhase?: string;
  onExploreCourses?: () => void;
  onExploreSubjects?: () => void;
}

export const MyLearningProgramSection: React.FC<MyLearningProgramSectionProps> = ({
  targetRole = 'Senior Full-Stack AI & Data Engineer',
  programTitle = 'AI & Data Engineering Mastery',
  progressPct = 74,
  coursesCount = 12,
  coursesCompleted = 4,
  subjectsCount = 48,
  subjectsMastered = 22,
  modulesCount = 186,
  lessonsCount = 820,
  projectsCount = 24,
  problemsCount = 500,
  learningHours = 142,
  currentStage = 'Stage 3 — Deep Learning & Production Distributed Systems',
  learningPhase = 'Phase 2 / High-Throughput Model Serving & RAG',
  onExploreCourses,
  onExploreSubjects,
}) => {
  return (
    <section className="border border-stone-800 bg-[#0e1017] p-6 md:p-8 space-y-6">
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-indigo-400 font-bold">
            <Sparkles size={14} />
            <span>MY LEARNING PROGRAM</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-stone-100 font-bold tracking-tight">
            {programTitle}
          </h2>
          <p className="text-xs text-stone-300 font-sans max-w-2xl">
            Your adaptive curriculum — dynamically generated from your target role, current knowledge, cognitive gaps and career goals.
          </p>
        </div>

        {/* Target Role & Stage Badge */}
        <div className="p-4 bg-[#121522] border border-indigo-500/30 font-mono text-xs space-y-1.5 shrink-0">
          <div className="text-[10px] text-stone-400 uppercase tracking-wider">TARGET CAREER ROLE:</div>
          <div className="font-bold text-stone-100 flex items-center gap-2">
            <Target size={14} className="text-indigo-400" />
            <span>{targetRole}</span>
          </div>
          <div className="text-[10px] text-emerald-400 pt-0.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{learningPhase}</span>
          </div>
        </div>
      </div>

      {/* CURRICULUM PROGRESS PROGRESSION BAR */}
      <div className="p-5 bg-[#0b0d14] border border-stone-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-stone-400 uppercase">OVERALL CURRICULUM PROGRESS:</span>
            <span className="text-emerald-400 font-bold text-sm">{progressPct}%</span>
            <span className="text-stone-600">|</span>
            <span className="text-stone-300 font-semibold">{currentStage}</span>
          </div>
          <div className="text-[11px] text-stone-400">
            {coursesCompleted} of {coursesCount} Courses Completed • {learningHours} Hours Logged
          </div>
        </div>

        <div className="w-full bg-stone-900 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* 6 CORE CURRICULUM STAT BOXES (EXTENSIBLE MODEL) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
        
        <div className="p-4 bg-[#111420] border border-stone-800 space-y-1 hover:border-indigo-500/40 transition-colors">
          <div className="flex items-center justify-between text-stone-400 text-[10px] uppercase">
            <span>COURSES</span>
            <BookOpen size={13} className="text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{coursesCount}</div>
          <div className="text-[10px] text-stone-500">{coursesCompleted} Completed</div>
        </div>

        <div className="p-4 bg-[#111420] border border-stone-800 space-y-1 hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between text-stone-400 text-[10px] uppercase">
            <span>SUBJECTS</span>
            <Layers size={13} className="text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white">{subjectsCount}</div>
          <div className="text-[10px] text-emerald-400">{subjectsMastered} Mastered</div>
        </div>

        <div className="p-4 bg-[#111420] border border-stone-800 space-y-1 hover:border-purple-500/40 transition-colors">
          <div className="flex items-center justify-between text-stone-400 text-[10px] uppercase">
            <span>MODULES</span>
            <Brain size={13} className="text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{modulesCount}</div>
          <div className="text-[10px] text-stone-500">Structured Paths</div>
        </div>

        <div className="p-4 bg-[#111420] border border-stone-800 space-y-1 hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between text-stone-400 text-[10px] uppercase">
            <span>LESSONS</span>
            <BookOpen size={13} className="text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">{lessonsCount}+</div>
          <div className="text-[10px] text-stone-500">Interactive A-M</div>
        </div>

        <div className="p-4 bg-[#111420] border border-stone-800 space-y-1 hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between text-stone-400 text-[10px] uppercase">
            <span>PROJECTS</span>
            <Briefcase size={13} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{projectsCount}</div>
          <div className="text-[10px] text-stone-500">6 Levels (1 to 6)</div>
        </div>

        <div className="p-4 bg-[#111420] border border-stone-800 space-y-1 hover:border-rose-500/40 transition-colors">
          <div className="flex items-center justify-between text-stone-400 text-[10px] uppercase">
            <span>PROBLEMS</span>
            <Code2 size={13} className="text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-white">{problemsCount}+</div>
          <div className="text-[10px] text-stone-500">Drills & Challenges</div>
        </div>

      </div>

      {/* QUICK JUMP LINKS */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 font-mono text-xs text-stone-400 border-t border-stone-800">
        <div className="flex items-center gap-4">
          <button
            onClick={onExploreCourses}
            className="hover:text-indigo-300 flex items-center gap-1 transition-colors font-bold uppercase"
          >
            <span>VIEW 12 COURSES CATALOG →</span>
          </button>
          <span className="text-stone-700">•</span>
          <button
            onClick={onExploreSubjects}
            className="hover:text-cyan-300 flex items-center gap-1 transition-colors font-bold uppercase"
          >
            <span>EXPLORE 48 SUBJECTS MASTERY →</span>
          </button>
        </div>

        <span className="text-[11px] text-stone-500">
          Curriculum Model: Adaptive Skill Graph v2.6
        </span>
      </div>
    </section>
  );
};
