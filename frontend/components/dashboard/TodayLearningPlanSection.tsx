'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Code2,
  Layers,
  HelpCircle,
  MessageSquareText,
  RotateCcw,
} from 'lucide-react';
import { TODAY_LEARNING_PLAN } from '@/lib/curriculumData';
import { TodayPlanTask } from '@/types/curriculum';

interface TodayLearningPlanSectionProps {
  onStartTask?: (task: TodayPlanTask) => void;
}

const TYPE_COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  REVIEW: { bg: 'bg-indigo-500/10', text: 'text-indigo-300', border: 'border-indigo-500/30' },
  LEARN: { bg: 'bg-cyan-500/10', text: 'text-cyan-300', border: 'border-cyan-500/30' },
  PRACTICE: { bg: 'bg-emerald-500/10', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  BUILD: { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/30' },
  ASSESS: { bg: 'bg-purple-500/10', text: 'text-purple-300', border: 'border-purple-500/30' },
  REFLECT: { bg: 'bg-rose-500/10', text: 'text-rose-300', border: 'border-rose-500/30' },
};

export const TodayLearningPlanSection: React.FC<TodayLearningPlanSectionProps> = ({
  onStartTask,
}) => {
  const [tasks, setTasks] = useState<TodayPlanTask[]>(TODAY_LEARNING_PLAN);

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const totalMinutes = tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
  const completedMinutes = tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + t.estimatedMinutes, 0);
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <section className="border border-stone-800 bg-[#0e1017] p-6 md:p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-cyan-400 font-bold">
            <Calendar size={14} />
            <span>AUTONOMOUS DAILY SCHEDULE</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-stone-100 font-bold tracking-tight">
            Today&apos;s AI Learning Plan
          </h2>
          <p className="text-xs text-stone-300 font-sans max-w-2xl">
            Generated from your real-time Bayesian state, cognitive memory decay, and active misconception signals.
          </p>
        </div>

        {/* TIME DURATION PILL */}
        <div className="p-3 bg-[#111422] border border-stone-800 font-mono text-xs space-y-1 text-right">
          <div className="text-[10px] text-stone-400 uppercase">ESTIMATED TIME BUDGET:</div>
          <div className="text-sm font-bold text-cyan-300 flex items-center justify-end gap-1.5">
            <Clock size={14} />
            <span>1h 50m ({completedMinutes}m completed)</span>
          </div>
          <div className="text-[10px] text-emerald-400">
            {completedCount} of {tasks.length} tasks completed
          </div>
        </div>
      </div>

      {/* 6 SCHEDULED BLOCKS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => {
          const style = TYPE_COLOR_MAP[task.type] || TYPE_COLOR_MAP.LEARN;
          return (
            <div
              key={task.id}
              className={`p-4 border transition-all space-y-3 flex flex-col justify-between ${
                task.completed
                  ? 'bg-[#090b10] border-stone-800/60 opacity-60'
                  : 'bg-[#10131d] border-stone-800 hover:border-cyan-500/40'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-[#161a28] border border-stone-700 flex items-center justify-center font-bold text-[11px] text-stone-300">
                      {task.stepNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${style.bg} ${style.text} ${style.border}`}
                    >
                      {task.type}
                    </span>
                  </div>

                  <span className="text-[11px] text-stone-400 font-mono flex items-center gap-1">
                    <Clock size={11} />
                    {task.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-stone-400 uppercase">
                    {task.topic}
                  </div>
                  <h4
                    className={`font-serif text-sm font-semibold ${
                      task.completed ? 'line-through text-stone-500' : 'text-stone-100'
                    }`}
                  >
                    {task.title}
                  </h4>
                </div>

                <p className="text-[11px] text-stone-400 font-sans italic border-l-2 border-stone-700 pl-2">
                  &ldquo;{task.aiRationale}&rdquo;
                </p>
              </div>

              {/* ACTION / COMPLETE TOGGLE */}
              <div className="pt-2 border-t border-stone-800 flex items-center justify-between font-mono text-xs">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="flex items-center gap-1.5 text-stone-400 hover:text-stone-200 text-[11px]"
                >
                  {task.completed ? (
                    <>
                      <CheckCircle2 size={14} className="text-emerald-400" />
                      <span className="text-emerald-400">DONE</span>
                    </>
                  ) : (
                    <>
                      <Circle size={14} />
                      <span>MARK DONE</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onStartTask && onStartTask(task)}
                  className="text-cyan-400 hover:text-cyan-300 font-bold uppercase flex items-center gap-1 text-[11px]"
                >
                  <span>START →</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* PLAN FOOTER */}
      <div className="flex items-center justify-between font-mono text-xs text-stone-400 pt-2 border-t border-stone-800">
        <span className="flex items-center gap-1.5 text-[11px]">
          <Sparkles size={12} className="text-cyan-400" />
          <span>Plan auto-refreshes every 24 hours or after each assessment.</span>
        </span>

        <button
          onClick={() =>
            setTasks((prev) => prev.map((t) => ({ ...t, completed: false })))
          }
          className="text-stone-500 hover:text-stone-300 text-[11px] flex items-center gap-1"
        >
          <RotateCcw size={11} />
          <span>RESET CHECKLIST</span>
        </button>
      </div>
    </section>
  );
};
