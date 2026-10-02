'use client';

import React from 'react';
import {
  Play,
  Clock,
  TrendingUp,
  Brain,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface ContinueLearningHeroCardProps {
  trackName?: string;
  subjectName?: string;
  moduleName?: string;
  lessonTitle?: string;
  lessonNumber?: number;
  totalLessons?: number;
  progressPct?: number;
  estimatedRemainingMinutes?: number;
  masteryPct?: number;
  nextUpTopic?: string;
  onResumeLesson?: () => void;
}

export const ContinueLearningHeroCard: React.FC<ContinueLearningHeroCardProps> = ({
  trackName = 'Deep Learning Track',
  subjectName = 'Neural Networks & Activation Functions',
  moduleName = 'Module 03 — Forward Propagation & Activation Functions',
  lessonTitle = 'Forward Propagation & Activation Functions',
  lessonNumber = 3,
  totalLessons = 5,
  progressPct = 60,
  estimatedRemainingMinutes = 18,
  masteryPct = 61,
  nextUpTopic = 'Backpropagation & Loss Gradients',
  onResumeLesson,
}) => {
  return (
    <section className="border-2 border-indigo-500/50 bg-gradient-to-r from-[#0c0f1a] via-[#101424] to-[#0d101d] p-6 md:p-8 space-y-6 shadow-xl shadow-indigo-950/40 relative overflow-hidden">
      {/* Subtle Glow backdrop */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-500/20 pb-4 font-mono text-[11px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-bold uppercase tracking-widest">
            ACTIVE SESSION CHECKPOINT
          </span>
          <span className="text-stone-600">/</span>
          <span className="text-stone-400 uppercase">CONTINUE LEARNING</span>
        </div>

        <div className="flex items-center gap-3 text-stone-400">
          <span>
            Current Mastery: <strong className="text-emerald-400 font-bold">{masteryPct}%</strong>
          </span>
          <span className="text-stone-600">|</span>
          <span className="flex items-center gap-1 text-cyan-300">
            <Clock size={12} />
            <span>~{estimatedRemainingMinutes} min left</span>
          </span>
        </div>
      </div>

      {/* Main Continuation Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <div className="space-y-1">
            <div className="font-mono text-xs text-indigo-400 font-semibold uppercase tracking-wider flex items-center gap-2">
              <Brain size={14} />
              <span>{trackName} → {subjectName}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif text-white font-bold tracking-tight">
              {lessonTitle}
            </h2>
            <p className="text-xs text-stone-300 font-mono">
              {moduleName}
            </p>
          </div>

          {/* Progress Bar & Sub-metrics */}
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center justify-between font-mono text-[11px] text-stone-400">
              <span className="text-stone-300">
                Lesson {lessonNumber} of {totalLessons} ({progressPct}% of module complete)
              </span>
              <span className="text-stone-400">Next: {nextUpTopic}</span>
            </div>
            <div className="w-full bg-stone-900 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 h-full rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Big Action CTA Button */}
        <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center space-y-3">
          <button
            onClick={onResumeLesson}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group"
          >
            <Play size={16} className="fill-white" />
            <span>RESUME LESSON</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <div className="font-mono text-[10px] text-stone-400">
            Interactive AI lesson studio with live runnable code
          </div>
        </div>
      </div>
    </section>
  );
};
