'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Trophy, Target } from 'lucide-react';

interface PracticeAndAssessmentIntelligenceProps {
  practiceData?: {
    total_practice: number;
    completed: number;
    in_progress: number;
    needs_review: number;
    accuracy_rate: number;
    subject_breakdown: Array<{ subject: string; completed: number; accuracy: number }>;
  };
  assessmentData?: {
    completed: number;
    pending: number;
    reassessments_required: number;
    mastered: number;
    needs_improvement: number;
    average_score: number;
    subject_breakdown: Array<{ subject: string; completed: number; passed: number; reassessment: number; avg_score: number }>;
  };
}

export const PracticeAndAssessmentIntelligence: React.FC<PracticeAndAssessmentIntelligenceProps> = ({
  practiceData,
  assessmentData,
}) => {
  const p = practiceData || {
    total_practice: 124,
    completed: 87,
    in_progress: 12,
    needs_review: 25,
    accuracy_rate: 88.4,
    subject_breakdown: [
      { subject: 'Python Engineering', completed: 21, accuracy: 91.2 },
      { subject: 'SQL & Databases', completed: 18, accuracy: 94.0 },
      { subject: 'Machine Learning', completed: 11, accuracy: 82.5 },
      { subject: 'Data Analytics', completed: 14, accuracy: 93.4 },
    ],
  };

  const a = assessmentData || {
    completed: 18,
    pending: 7,
    reassessments_required: 3,
    mastered: 11,
    needs_improvement: 4,
    average_score: 86.5,
    subject_breakdown: [
      { subject: 'Python Engineering', completed: 8, passed: 7, reassessment: 1, avg_score: 89.4 },
      { subject: 'SQL Analytics', completed: 8, passed: 8, reassessment: 0, avg_score: 96.0 },
      { subject: 'Machine Learning', completed: 4, passed: 2, reassessment: 2, avg_score: 77.5 },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* SECTION 08: PRACTICE INTELLIGENCE */}
      <div className="bg-[#fdfcf9] dark:bg-stone-900 border border-stone-300 dark:border-stone-800 flex flex-col justify-between">
        <div>
          <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-[#f9f8f4] dark:bg-stone-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-blue-700 dark:bg-blue-400"></span>
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-900 dark:text-stone-100">
                SECTION 04 // PRACTICE INTELLIGENCE
              </h2>
            </div>
            <Link
              href="/practice"
              className="text-xs font-mono text-blue-700 hover:text-blue-900 dark:text-blue-400 font-semibold"
            >
              VIEW PRACTICE →
            </Link>
          </div>

          <div className="p-6 space-y-6">
            {/* Top Stat Badges */}
            <div className="grid grid-cols-4 gap-2 font-mono text-center">
              <div className="p-3 bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700">
                <span className="text-[9px] text-stone-500 uppercase block">TOTAL</span>
                <span className="text-lg font-bold text-stone-900 dark:text-white">{p.total_practice}</span>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700">
                <span className="text-[9px] text-emerald-700 dark:text-emerald-400 uppercase block font-semibold">COMPLETED</span>
                <span className="text-lg font-bold text-emerald-800 dark:text-emerald-300">{p.completed}</span>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700">
                <span className="text-[9px] text-blue-700 dark:text-blue-400 uppercase block font-semibold">IN PROGRESS</span>
                <span className="text-lg font-bold text-blue-800 dark:text-blue-300">{p.in_progress}</span>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700">
                <span className="text-[9px] text-amber-700 dark:text-amber-400 uppercase block font-semibold">NEEDS REVIEW</span>
                <span className="text-lg font-bold text-amber-800 dark:text-amber-300">{p.needs_review}</span>
              </div>
            </div>

            {/* Subject Breakdown List */}
            <div className="space-y-3 font-mono text-xs">
              <div className="text-[10px] text-stone-400 uppercase tracking-wider">
                SUBJECT-LEVEL PRACTICE SESSIONS
              </div>
              <div className="divide-y divide-stone-200 dark:divide-stone-800 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/50">
                {p.subject_breakdown.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <span className="font-medium text-stone-800 dark:text-stone-200 font-sans">{item.subject}</span>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-stone-900 dark:text-white">{item.completed} completed</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">{item.accuracy}% acc</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 pt-0">
          <Link
            href="/practice"
            className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all text-center"
          >
            <span>LAUNCH PRACTICE ENGINE</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* SECTION 09: ASSESSMENT INTELLIGENCE */}
      <div className="bg-[#fdfcf9] dark:bg-stone-900 border border-stone-300 dark:border-stone-800 flex flex-col justify-between">
        <div>
          <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-[#f9f8f4] dark:bg-stone-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-700 dark:bg-emerald-400"></span>
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-900 dark:text-stone-100">
                SECTION 05 // ASSESSMENT INTELLIGENCE
              </h2>
            </div>
            <Link
              href="/assessments"
              className="text-xs font-mono text-emerald-800 hover:text-emerald-950 dark:text-emerald-400 font-semibold"
            >
              VIEW ASSESSMENTS →
            </Link>
          </div>

          <div className="p-6 space-y-6">
            {/* Top Stat Badges */}
            <div className="grid grid-cols-5 gap-1.5 font-mono text-center">
              <div className="p-2.5 bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700">
                <span className="text-[8px] text-stone-500 uppercase block">COMPLETED</span>
                <span className="text-base font-bold text-stone-900 dark:text-white">{a.completed}</span>
              </div>
              <div className="p-2.5 bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700">
                <span className="text-[8px] text-stone-500 uppercase block">PENDING</span>
                <span className="text-base font-bold text-stone-600 dark:text-stone-400">{String(a.pending).padStart(2, '0')}</span>
              </div>
              <div className="p-2.5 bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700">
                <span className="text-[8px] text-emerald-700 dark:text-emerald-400 uppercase block font-semibold">MASTERED</span>
                <span className="text-base font-bold text-emerald-800 dark:text-emerald-300">{a.mastered}</span>
              </div>
              <div className="p-2.5 bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700">
                <span className="text-[8px] text-amber-700 dark:text-amber-400 uppercase block font-semibold">IMPROVE</span>
                <span className="text-base font-bold text-amber-800 dark:text-amber-300">{String(a.needs_improvement).padStart(2, '0')}</span>
              </div>
              <div className="p-2.5 bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700">
                <span className="text-[8px] text-rose-700 dark:text-rose-400 uppercase block font-semibold">RE-ASSESS</span>
                <span className="text-base font-bold text-rose-800 dark:text-rose-300">{String(a.reassessments_required).padStart(2, '0')}</span>
              </div>
            </div>

            {/* Subject Assessment Telemetry */}
            <div className="space-y-3 font-mono text-xs">
              <div className="text-[10px] text-stone-400 uppercase tracking-wider">
                SUBJECT-LEVEL ASSESSMENT RECORDS
              </div>
              <div className="divide-y divide-stone-200 dark:divide-stone-800 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/50">
                {a.subject_breakdown.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-stone-800 dark:text-stone-200 font-sans block">{item.subject}</span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {item.passed} passed • {item.reassessment} reassessment
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-stone-900 dark:text-white font-mono block">
                        {item.avg_score}%
                      </span>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono uppercase">
                        VERIFIED
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 pt-0">
          <Link
            href="/assessments"
            className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-700 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all text-center"
          >
            <span>TAKE NEXT ASSESSMENT</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};
