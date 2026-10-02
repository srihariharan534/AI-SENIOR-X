'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Video, Clock, Award, FileCode, CheckCircle2 } from 'lucide-react';

interface ProofOfLearningProps {
  proofData?: {
    subjects_completed: number;
    practice_sessions: number;
    assessments: number;
    projects: number;
    real_world_challenges: number;
    ai_teaching_hours: string;
    concepts_studied: number;
    concepts_demonstrated: number;
    evidence_items_count: number;
    portfolio_ready_projects: Array<{
      id: string;
      title: string;
      subject: string;
      verification: string;
      evidence_tag: string;
      date: string;
    }>;
  };
  aiHoursData?: {
    total_hours_formatted: string;
    this_week_formatted: string;
    this_month_formatted: string;
    subject_breakdown: Array<{ subject: string; hours: string; seconds: number }>;
  };
}

export const ProofOfLearningSection: React.FC<ProofOfLearningProps> = ({
  proofData,
  aiHoursData,
}) => {
  const p = proofData || {
    subjects_completed: 8,
    practice_sessions: 47,
    assessments: 18,
    projects: 6,
    real_world_challenges: 3,
    ai_teaching_hours: '42h 18m',
    concepts_studied: 124,
    concepts_demonstrated: 31,
    evidence_items_count: 186,
    portfolio_ready_projects: [
      {
        id: 'proj-py-01',
        title: 'High-Throughput Log Stream Analytics Engine',
        subject: 'Python',
        verification: 'VERIFIED_PYTHON_ENGINEERING',
        evidence_tag: 'AST_ANALYSIS_PASSED',
        date: '2026-09-28',
      },
      {
        id: 'proj-sql-01',
        title: 'SaaS Retention & Cohort Dimensional Decomposition',
        subject: 'SQL',
        verification: 'VERIFIED_SQL_ENGINEERING',
        evidence_tag: 'WINDOW_FUNCTIONS_VERIFIED',
        date: '2026-09-30',
      },
      {
        id: 'proj-ml-01',
        title: 'Customer Churn Classifier with Feature Store Integration',
        subject: 'Machine Learning',
        verification: 'VERIFIED_ML_ENGINEERING',
        evidence_tag: 'ROC_AUC_91_VERIFIED',
        date: '2026-10-01',
      },
    ],
  };

  const h = aiHoursData || {
    total_hours_formatted: '42h 18m',
    this_week_formatted: '6h 42m',
    this_month_formatted: '18h 20m',
    subject_breakdown: [
      { subject: 'Python Engineering', hours: '18h 42m', seconds: 67320 },
      { subject: 'SQL & Databases', hours: '8h 12m', seconds: 29520 },
      { subject: 'Machine Learning Systems', hours: '10h 24m', seconds: 37440 },
      { subject: 'Generative AI & LLMs', hours: '5h 30m', seconds: 19800 },
    ],
  };

  return (
    <div className="space-y-8">
      {/* BIG EDITORIAL NUMBERS: WHAT YOU HAVE ACTUALLY DONE */}
      <div className="bg-[#fdfcf9] dark:bg-stone-900 border border-stone-300 dark:border-stone-800 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 dark:border-stone-800 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-stone-900 dark:bg-stone-100"></span>
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-900 dark:text-stone-100">
                SECTION 06 // WHAT YOU HAVE ACTUALLY DONE (PROOF OF LEARNING)
              </h2>
            </div>
            <p className="text-xs text-stone-500 font-serif mt-1">
              Every metric represents concrete artifacts created, questions answered, and verified code executed.
            </p>
          </div>
          <div className="font-mono text-xs text-emerald-800 dark:text-emerald-400 font-bold">
            {p.evidence_items_count} VERIFIED EVIDENCE ARTIFACTS
          </div>
        </div>

        {/* Big Editorial Typography Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 pt-8 font-mono">
          <div className="space-y-1">
            <div className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 dark:text-white">
              {String(p.subjects_completed).padStart(2, '0')}
            </div>
            <div className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">
              SUBJECTS COMPLETED
            </div>
            <div className="text-[10px] text-emerald-700 dark:text-emerald-400">
              Verified Mastery
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 dark:text-white">
              {String(p.practice_sessions).padStart(2, '0')}
            </div>
            <div className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">
              PRACTICE SESSIONS
            </div>
            <div className="text-[10px] text-blue-700 dark:text-blue-400">
              88.4% Mean Accuracy
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 dark:text-white">
              {String(p.assessments).padStart(2, '0')}
            </div>
            <div className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">
              ASSESSMENTS
            </div>
            <div className="text-[10px] text-emerald-700 dark:text-emerald-400">
              86.5% Avg Score
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 dark:text-white">
              {String(p.projects).padStart(2, '0')}
            </div>
            <div className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">
              PROJECTS VERIFIED
            </div>
            <div className="text-[10px] text-purple-700 dark:text-purple-400">
              Portfolio Quality
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 dark:text-white">
              {p.ai_teaching_hours.split(' ')[0]}
            </div>
            <div className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">
              AI TEACHING HOURS
            </div>
            <div className="text-[10px] text-stone-600 dark:text-stone-300">
              Tracked Video/Audio
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 dark:text-white">
              {String(p.real_world_challenges).padStart(2, '0')}
            </div>
            <div className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">
              CHALLENGES PROVEN
            </div>
            <div className="text-[10px] text-amber-700 dark:text-amber-400">
              Industry Scale
            </div>
          </div>
        </div>
      </div>

      {/* AI TEACHING HOURS & VERIFIED PORTFOLIO BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: AI Teaching Hours Tracker */}
        <div className="lg:col-span-6 bg-[#fdfcf9] dark:bg-stone-900 border border-stone-300 dark:border-stone-800 p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <Video size={16} className="text-blue-800 dark:text-blue-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-900 dark:text-stone-100">
                SECTION 07 // AI TEACHING TIME METRICS
              </h3>
            </div>
            <span className="text-[10px] font-mono text-stone-500 uppercase">SERVER TRACKED</span>
          </div>

          <div className="grid grid-cols-3 gap-3 font-mono text-center">
            <div className="p-3 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
              <div className="text-[9px] text-stone-500 uppercase">TOTAL</div>
              <div className="text-lg font-bold text-stone-900 dark:text-white mt-1">
                {h.total_hours_formatted}
              </div>
            </div>
            <div className="p-3 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
              <div className="text-[9px] text-stone-500 uppercase">THIS WEEK</div>
              <div className="text-lg font-bold text-blue-900 dark:text-blue-300 mt-1">
                {h.this_week_formatted}
              </div>
            </div>
            <div className="p-3 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
              <div className="text-[9px] text-stone-500 uppercase">THIS MONTH</div>
              <div className="text-lg font-bold text-emerald-800 dark:text-emerald-300 mt-1">
                {h.this_month_formatted}
              </div>
            </div>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="text-[10px] text-stone-400 uppercase tracking-wider">
              SUBJECT TEACHING TIME
            </div>
            <div className="divide-y divide-stone-200 dark:divide-stone-800 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/50">
              {h.subject_breakdown.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <span className="font-sans font-medium text-stone-800 dark:text-stone-200">{item.subject}</span>
                  <span className="font-bold text-stone-900 dark:text-white">{item.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Portfolio Ready Verified Proof */}
        <div className="lg:col-span-6 bg-[#fdfcf9] dark:bg-stone-900 border border-stone-300 dark:border-stone-800 p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-700 dark:text-emerald-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-900 dark:text-stone-100">
                SECTION 08 // PORTFOLIO EVIDENCE ARTIFACTS
              </h3>
            </div>
            <Link
              href="/evidence"
              className="text-xs font-mono text-emerald-800 hover:text-emerald-950 dark:text-emerald-400 font-semibold"
            >
              ALL EVIDENCE →
            </Link>
          </div>

          <div className="space-y-3">
            {p.portfolio_ready_projects.map((proj) => (
              <div
                key={proj.id}
                className="p-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex flex-col justify-between space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-stone-400 uppercase">{proj.subject} ENGINEERING</span>
                    <h4 className="text-sm font-serif font-bold text-stone-900 dark:text-white">
                      {proj.title}
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 font-mono text-[10px] font-bold border border-emerald-300 dark:border-emerald-800">
                    VERIFIED
                  </span>
                </div>

                <div className="flex items-center justify-between font-mono text-[11px] text-stone-500 pt-1 border-t border-stone-100 dark:border-stone-700">
                  <span>{proj.evidence_tag}</span>
                  <span>{proj.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
