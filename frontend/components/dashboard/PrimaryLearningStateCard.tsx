'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Sparkles, CheckCircle, Clock, Zap } from 'lucide-react';
import { LearningStateData } from '@/hooks/useAcademicDashboard';

interface PrimaryLearningStateCardProps {
  learningState?: LearningStateData;
  onContinueAction?: () => void;
}

export const PrimaryLearningStateCard: React.FC<PrimaryLearningStateCardProps> = ({
  learningState,
  onContinueAction,
}) => {
  const ls = learningState || {
    current_level: 'INTERMEDIATE',
    current_path: 'AI & DATA ENGINEERING',
    current_course: 'Python Engineering',
    current_subject_id: 'python',
    current_module: 'Module 07: Advanced Functions & Metaprogramming',
    current_lesson: 'Decorators & Closures',
    current_learning_mode: 'ADAPTIVE',
    next_best_action_title: 'Complete Decorators Practice',
    next_best_action_reason:
      'Your last two assessments show strong aggregation and functional concepts but repeated mistakes with parameterized wrapper closures.',
    next_best_action_evidence: '02 assessments · 07 practice attempts · 03 mistakes identified',
    next_best_action_time: '42 minutes',
    next_best_action_url: '/courses/python',
  };

  return (
    <div className="w-full bg-[#fdfcf9] dark:bg-stone-900 border border-stone-300 dark:border-stone-800 shadow-sm">
      {/* Header section with academic typography */}
      <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-2 bg-[#f9f8f4] dark:bg-stone-950">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-blue-700 dark:bg-blue-500 rounded-none inline-block"></span>
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-900 dark:text-stone-100">
            SECTION 01 // YOUR LEARNING STATE
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-stone-500 uppercase">MODE:</span>
          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 text-[11px] font-mono font-bold tracking-wider border border-blue-200 dark:border-blue-800">
            {ls.current_learning_mode}
          </span>
        </div>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Academic State Metadata */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono">
            <div className="p-3 bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
              <div className="text-[10px] uppercase text-stone-500 tracking-wider">CURRENT LEVEL</div>
              <div className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-1">
                {ls.current_level}
              </div>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
              <div className="text-[10px] uppercase text-stone-500 tracking-wider">CURRENT PATH</div>
              <div className="text-sm font-bold text-blue-900 dark:text-blue-300 mt-1 truncate">
                {ls.current_path}
              </div>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 col-span-2 sm:col-span-1">
              <div className="text-[10px] uppercase text-stone-500 tracking-wider">PRIMARY TARGET</div>
              <div className="text-sm font-bold text-emerald-800 dark:text-emerald-300 mt-1">
                SENIOR ENGINEER
              </div>
            </div>
          </div>

          {/* Active Course & Module Stack */}
          <div className="space-y-3 font-sans">
            <div className="text-xs font-mono uppercase text-stone-500 tracking-wider">
              IN FLIGHT CURRICULUM HIERARCHY
            </div>
            <div className="p-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-mono text-stone-500 uppercase">COURSE</div>
                  <div className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
                    {ls.current_course}
                  </div>
                </div>
                <Link
                  href={`/courses/${ls.current_subject_id}`}
                  className="text-xs font-mono text-blue-700 hover:text-blue-900 dark:text-blue-400 font-semibold underline underline-offset-4"
                >
                  View Course Details →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100 dark:border-stone-700">
                <div>
                  <div className="text-[11px] font-mono text-stone-500 uppercase">CURRENT MODULE</div>
                  <div className="text-sm font-medium text-stone-800 dark:text-stone-200">
                    {ls.current_module}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-mono text-stone-500 uppercase">CURRENT LESSON</div>
                  <div className="text-sm font-medium text-stone-800 dark:text-stone-200">
                    {ls.current_lesson}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: NEXT BEST ACTION (Most Prominent Action on Dashboard) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 bg-stone-950 text-white border border-stone-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-2xl pointer-events-none"></div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-[11px] uppercase tracking-widest font-bold">
                <Zap size={14} className="fill-amber-400" />
                <span>NEXT BEST ACTION</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-400 font-mono text-[11px]">
                <Clock size={12} />
                <span>{ls.next_best_action_time}</span>
              </div>
            </div>

            <div className="text-xl font-serif font-bold text-stone-100 leading-snug">
              {ls.next_best_action_title}
            </div>

            <div className="space-y-2 pt-2 border-t border-stone-800">
              <div className="text-[11px] font-mono uppercase text-blue-400 font-semibold">WHY?</div>
              <p className="text-xs text-stone-300 leading-relaxed font-sans">
                {ls.next_best_action_reason}
              </p>
            </div>

            <div className="space-y-1 pt-2">
              <div className="text-[10px] font-mono uppercase text-stone-400">SUPPORTING EVIDENCE</div>
              <div className="text-xs font-mono text-stone-200 bg-stone-900/90 px-3 py-1.5 border border-stone-800">
                {ls.next_best_action_evidence}
              </div>
            </div>
          </div>

          <div className="pt-6">
            {onContinueAction ? (
              <button
                onClick={onContinueAction}
                className="w-full py-3 px-5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md group"
              >
                <span>START NOW</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <Link
                href={ls.next_best_action_url}
                className="w-full py-3 px-5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md group text-center"
              >
                <span>START NOW</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
