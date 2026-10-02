'use client';

import React from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Play,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { DailyLearningPlan } from '@/lib/universityData';

interface DailyLearningPlanSectionProps {
  courseName: string;
  dailyPlan: DailyLearningPlan;
  onStartDay?: () => void;
}

const TYPE_STYLE_MAP: Record<string, { bg: string; text: string; border: string }> = {
  INTRO: { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-300' },
  LECTURE: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-300' },
  CONCEPT: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-300' },
  INTERACTIVE: { bg: 'bg-cyan-50', text: 'text-cyan-800', border: 'border-cyan-300' },
  PRACTICE: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-300' },
  QUIZ: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300' },
  CHALLENGE: { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-300' },
  REVIEW: { bg: 'bg-stone-100', text: 'text-stone-800', border: 'border-stone-300' },
};

export const DailyLearningPlanSection: React.FC<DailyLearningPlanSectionProps> = ({
  courseName,
  dailyPlan,
  onStartDay,
}) => {
  return (
    <section id="daily-plan" className="bg-[#fcfbfa] border border-stone-300 p-6 md:p-10 space-y-8 text-stone-900 font-sans">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 font-mono text-xs text-blue-700 uppercase font-bold tracking-widest">
            <Calendar size={14} />
            <span>DAY 0{dailyPlan.dayNumber} PERSONALIZED PLAN</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 font-normal tracking-tight">
            {dailyPlan.dayTitle}
          </h2>
          <p className="text-xs text-stone-600 font-sans max-w-xl">
            Dynamically synthesized using your Learning Twin state, active cognitive gaps, and target role career milestones.
          </p>
        </div>

        {/* Start Button & Time Budget Pill */}
        <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
          <div className="p-3 bg-white border border-stone-300 font-mono text-xs space-y-0.5">
            <div className="text-[10px] text-stone-500 uppercase">TOTAL LEARNING TIME:</div>
            <div className="text-lg font-bold text-blue-800 flex items-center gap-1.5">
              <Clock size={16} />
              <span>{dailyPlan.totalTimeFormatted}</span>
            </div>
          </div>

          <button
            onClick={onStartDay}
            className="px-6 py-3 bg-stone-900 hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-sm"
          >
            <Play size={13} className="fill-white" />
            <span>START DAY 0{dailyPlan.dayNumber}</span>
          </button>
        </div>
      </div>

      {/* TIMELINE SCHEDULE (2-COLUMN GRID / TIMELINE) */}
      <div className="space-y-3 font-mono text-xs">
        {dailyPlan.schedule.map((item, idx) => {
          const style = TYPE_STYLE_MAP[item.type] || TYPE_STYLE_MAP.LECTURE;
          return (
            <div
              key={idx}
              className={`p-4 bg-white border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                item.completed ? 'border-emerald-300 bg-emerald-50/20 opacity-70' : 'border-stone-300 hover:border-blue-700'
              }`}
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-16 text-stone-500 font-bold shrink-0">
                  {item.time}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[9px] uppercase font-bold border ${style.bg} ${style.text} ${style.border}`}>
                      {item.type}
                    </span>
                    <span className="font-serif text-sm font-bold text-stone-900">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 font-sans">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                <span className="text-stone-500 font-semibold">{item.durationMinutes} min</span>
                {item.completed ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 size={14} />
                    <span>DONE</span>
                  </span>
                ) : (
                  <span className="text-stone-400 text-[11px] flex items-center gap-1">
                    <Circle size={14} />
                    <span>PENDING</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
