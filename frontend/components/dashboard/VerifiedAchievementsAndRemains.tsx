'use client';

import React from 'react';
import Link from 'next/link';
import { Award, ShieldCheck, ArrowRight, CheckCircle2, Compass, Flag } from 'lucide-react';

interface VerifiedAchievementsAndRemainsProps {
  achievements?: Array<{
    id: string;
    title: string;
    subject_name: string;
    category: string;
    verified_date: string;
    verification_hash: string;
    credential_url: string;
  }>;
  whatRemains?: {
    subjects_remaining: number;
    courses_in_progress: number;
    assessments_pending: number;
    projects_pending: number;
    challenges_pending: number;
    next_milestone_title: string;
    next_milestone_target: string;
    path_url: string;
  };
}

export const VerifiedAchievementsAndRemains: React.FC<VerifiedAchievementsAndRemainsProps> = ({
  achievements,
  whatRemains,
}) => {
  const ach = achievements || [
    {
      id: 'ach-01',
      title: 'Python Engineering Verified Capstone (3 Projects)',
      subject_name: 'Python Engineering',
      category: 'PROJECT_PORTFOLIO',
      verified_date: 'Sep 28, 2026',
      verification_hash: 'sha256-9a8f4c21',
      credential_url: '/evidence',
    },
    {
      id: 'ach-02',
      title: 'Relational Database Systems & SQL Analytics Mastery',
      subject_name: 'Databases & SQL',
      category: 'COURSE_COMPLETION',
      verified_date: 'Sep 30, 2026',
      verification_hash: 'sha256-4b719ee2',
      credential_url: '/certificates',
    },
    {
      id: 'ach-03',
      title: 'Real-World High-Throughput Log Stream Challenge',
      subject_name: 'Software Engineering',
      category: 'REAL_WORLD_CHALLENGE',
      verified_date: 'Oct 01, 2026',
      verification_hash: 'sha256-88ef110b',
      credential_url: '/projects',
    },
  ];

  const rem = whatRemains || {
    subjects_remaining: 14,
    courses_in_progress: 3,
    assessments_pending: 7,
    projects_pending: 4,
    challenges_pending: 6,
    next_milestone_title: 'Complete Python Engineering Capstone & Metaprogramming',
    next_milestone_target: 'Module 12 Certification & Verification Badge',
    path_url: '/courses/python',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* SECTION 18: VERIFIED ACHIEVEMENTS */}
      <div className="lg:col-span-7 bg-[#fdfcf9] dark:bg-stone-900 border border-stone-300 dark:border-stone-800 flex flex-col justify-between">
        <div>
          <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-[#f9f8f4] dark:bg-stone-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award size={16} className="text-emerald-700 dark:text-emerald-400" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-900 dark:text-stone-100">
                SECTION 13 // VERIFIED ACHIEVEMENTS & CREDENTIALS
              </h2>
            </div>
            <Link
              href="/certificates"
              className="text-xs font-mono text-emerald-800 hover:text-emerald-950 dark:text-emerald-400 font-semibold"
            >
              CERTIFICATES ({ach.length}) →
            </Link>
          </div>

          <div className="p-6 space-y-4">
            {ach.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-stone-400 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-stone-400 uppercase">
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">{item.category}</span>
                    <span>•</span>
                    <span>{item.subject_name}</span>
                  </div>
                  <h4 className="text-sm font-serif font-bold text-stone-900 dark:text-white mt-0.5">
                    {item.title}
                  </h4>
                  <div className="text-[10px] font-mono text-stone-400 mt-1">
                    Verified on {item.verified_date} • Hash: {item.verification_hash}
                  </div>
                </div>

                <Link
                  href={item.credential_url}
                  className="shrink-0 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 font-mono text-[11px] font-bold uppercase border border-stone-300 dark:border-stone-600 inline-flex items-center gap-1 self-start sm:self-auto"
                >
                  <ShieldCheck size={12} className="text-emerald-600" />
                  <span>VIEW PROOF</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 pt-0">
          <Link
            href="/certificates"
            className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-700 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all text-center"
          >
            <span>VERIFY CREDENTIALS & SHARE TRANSCRIPT</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* SECTION 24: WHAT REMAINS (FUTURE HORIZON) */}
      <div className="lg:col-span-5 bg-stone-950 text-white border border-stone-800 p-6 md:p-8 flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div className="flex items-center gap-2 font-mono text-xs text-amber-400 font-bold uppercase tracking-widest">
              <Compass size={14} />
              <span>WHAT REMAINS (NEXT HORIZON)</span>
            </div>
            <span className="text-[10px] font-mono text-stone-500 uppercase">DEGREE PATH</span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 bg-stone-900 border border-stone-800">
              <span className="text-[9px] text-stone-400 uppercase block">SUBJECTS REMAINING</span>
              <span className="text-xl font-bold text-stone-100 mt-1 block">{rem.subjects_remaining}</span>
            </div>

            <div className="p-3 bg-stone-900 border border-stone-800">
              <span className="text-[9px] text-stone-400 uppercase block">COURSES IN FLIGHT</span>
              <span className="text-xl font-bold text-blue-400 mt-1 block">{rem.courses_in_progress}</span>
            </div>

            <div className="p-3 bg-stone-900 border border-stone-800">
              <span className="text-[9px] text-stone-400 uppercase block">ASSESSMENTS PENDING</span>
              <span className="text-xl font-bold text-amber-400 mt-1 block">{rem.assessments_pending}</span>
            </div>

            <div className="p-3 bg-stone-900 border border-stone-800">
              <span className="text-[9px] text-stone-400 uppercase block">CAPSTONES LEFT</span>
              <span className="text-xl font-bold text-purple-400 mt-1 block">{rem.projects_pending}</span>
            </div>
          </div>

          <div className="p-4 bg-stone-900/90 border border-stone-800 space-y-2">
            <div className="text-[10px] font-mono text-amber-400 uppercase font-bold flex items-center gap-1.5">
              <Flag size={12} />
              <span>NEXT MAJOR MILESTONE</span>
            </div>
            <div className="font-serif font-bold text-sm text-stone-100">
              {rem.next_milestone_title}
            </div>
            <p className="text-xs text-stone-400 font-sans">
              {rem.next_milestone_target}
            </p>
          </div>
        </div>

        <div className="pt-4">
          <Link
            href={rem.path_url}
            className="w-full py-3 px-5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all text-center"
          >
            <span>VIEW CURRICULUM ROADMAP</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
