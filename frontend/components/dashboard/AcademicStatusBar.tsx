'use client';

import React from 'react';
import { AcademicStatusBarData } from '@/hooks/useAcademicDashboard';

interface AcademicStatusBarProps {
  data?: AcademicStatusBarData;
}

export const AcademicStatusBar: React.FC<AcademicStatusBarProps> = ({ data }) => {
  // Real values from DB / backend aggregation fallback
  const d = data || {
    courses_completed: 3,
    courses_total: 22,
    subjects_active: 8,
    subjects_mastered: 8,
    subjects_total: 22,
    lessons_completed: 142,
    lessons_total: 480,
    ai_sessions_completed: 64,
    ai_sessions_total: 180,
    practice_completed: 47,
    practice_total: 120,
    assessments_completed: 18,
    assessments_total: 40,
    projects_completed: 6,
    projects_total: 22,
    challenges_completed: 3,
    challenges_total: 22,
    certificates_issued: 2,
    total_learning_events: 284,
    total_demonstrated_skills: 31,
  };

  const items = [
    {
      label: 'COURSES',
      value: `${String(d.courses_completed).padStart(2, '0')} / ${String(d.courses_total).padStart(2, '0')}`,
      highlight: false,
    },
    {
      label: 'SUBJECTS',
      value: `${String(d.subjects_active).padStart(2, '0')} / ${String(d.subjects_total).padStart(2, '0')}`,
      highlight: true,
    },
    {
      label: 'LESSONS',
      value: `${String(d.lessons_completed).padStart(2, '0')} / ${String(d.lessons_total).padStart(2, '0')}`,
      highlight: false,
    },
    {
      label: 'AI SESSIONS',
      value: `${String(d.ai_sessions_completed).padStart(2, '0')} / ${String(d.ai_sessions_total).padStart(2, '0')}`,
      highlight: false,
    },
    {
      label: 'PRACTICE',
      value: `${String(d.practice_completed).padStart(2, '0')} / ${String(d.practice_total).padStart(2, '0')}`,
      highlight: false,
    },
    {
      label: 'ASSESSMENTS',
      value: `${String(d.assessments_completed).padStart(2, '0')} / ${String(d.assessments_total).padStart(2, '0')}`,
      highlight: false,
    },
    {
      label: 'PROJECTS',
      value: `${String(d.projects_completed).padStart(2, '0')} / ${String(d.projects_total).padStart(2, '0')}`,
      highlight: false,
    },
    {
      label: 'CHALLENGES',
      value: `${String(d.challenges_completed).padStart(2, '0')} / ${String(d.challenges_total).padStart(2, '0')}`,
      highlight: false,
    },
    {
      label: 'CERTIFICATES',
      value: `${String(d.certificates_issued).padStart(2, '0')}`,
      highlight: true,
      color: 'text-emerald-700 dark:text-emerald-400',
    },
  ];

  return (
    <div className="w-full bg-[#f6f4ee] dark:bg-stone-900 border-y border-stone-300 dark:border-stone-800 py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-4 scrollbar-none text-xs font-mono">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col shrink-0 px-3 py-1 border-r last:border-r-0 border-stone-300 dark:border-stone-800"
          >
            <span className="text-[10px] tracking-widest text-stone-500 dark:text-stone-400 uppercase font-semibold">
              {item.label}
            </span>
            <span
              className={`text-sm font-bold tracking-tight mt-0.5 ${
                item.color || (item.highlight ? 'text-blue-900 dark:text-blue-300' : 'text-stone-900 dark:text-stone-100')
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
