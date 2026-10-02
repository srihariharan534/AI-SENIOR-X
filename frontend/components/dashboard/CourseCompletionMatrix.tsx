'use client';

import React from 'react';
import Link from 'next/link';
import { CourseRecordData } from '@/hooks/useAcademicDashboard';
import { CheckCircle2, Clock, Play, ArrowUpRight } from 'lucide-react';

interface CourseCompletionMatrixProps {
  courseRecords?: CourseRecordData[];
  onSelectCourse?: (courseId: string) => void;
}

export const CourseCompletionMatrix: React.FC<CourseCompletionMatrixProps> = ({
  courseRecords,
  onSelectCourse,
}) => {
  const records = courseRecords || [
    {
      id: 'course-python',
      name: 'Python Engineering & Distributed Computing',
      school_name: 'Computer Science & Software Systems',
      school_id: 'school-cs',
      subjects_count: 1,
      subjects_completed: 1,
      lessons_total: 72,
      lessons_completed: 48,
      practice_total: 30,
      practice_completed: 21,
      assessments_total: 12,
      assessments_completed: 8,
      projects_total: 5,
      projects_completed: 3,
      challenges_total: 2,
      challenges_completed: 2,
      ai_teaching_hours: '18h 42m',
      status: 'IN PROGRESS' as const,
      primary_skills: ['AsyncIO', 'Metaprogramming', 'Memory Optimization'],
    },
    {
      id: 'course-sql',
      name: 'Relational Database Systems & SQL Analytics',
      school_name: 'Computer Science & Software Systems',
      school_id: 'school-cs',
      subjects_count: 1,
      subjects_completed: 1,
      lessons_total: 36,
      lessons_completed: 36,
      practice_total: 18,
      practice_completed: 18,
      assessments_total: 8,
      assessments_completed: 8,
      projects_total: 2,
      projects_completed: 2,
      challenges_total: 1,
      challenges_completed: 1,
      ai_teaching_hours: '8h 12m',
      status: 'COMPLETED' as const,
      primary_skills: ['CTEs', 'Window Functions', 'Query Execution Plans'],
    },
    {
      id: 'course-ml',
      name: 'Machine Learning & Production Model Systems',
      school_name: 'Artificial Intelligence & Data Science',
      school_id: 'school-ai',
      subjects_count: 1,
      subjects_completed: 0,
      lessons_total: 80,
      lessons_completed: 22,
      practice_total: 35,
      practice_completed: 11,
      assessments_total: 12,
      assessments_completed: 4,
      projects_total: 5,
      projects_completed: 1,
      challenges_total: 1,
      challenges_completed: 0,
      ai_teaching_hours: '10h 24m',
      status: 'LEARNING' as const,
      primary_skills: ['Gradient Descent', 'Loss Optimization', 'XGBoost'],
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 font-mono text-[11px] font-bold tracking-wider border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            COMPLETED
          </span>
        );
      case 'IN PROGRESS':
        return (
          <span className="px-2.5 py-1 bg-blue-100 text-blue-900 dark:bg-blue-950/80 dark:text-blue-300 font-mono text-[11px] font-bold tracking-wider border border-blue-300 dark:border-blue-800 flex items-center gap-1.5 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            IN PROGRESS
          </span>
        );
      case 'LEARNING':
        return (
          <span className="px-2.5 py-1 bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 font-mono text-[11px] font-bold tracking-wider border border-amber-300 dark:border-amber-800 flex items-center gap-1.5 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            LEARNING
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 font-mono text-[11px] font-bold tracking-wider border border-stone-300 dark:border-stone-700 flex items-center gap-1.5 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
            NOT STARTED
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-[#fdfcf9] dark:bg-stone-900 border border-stone-300 dark:border-stone-800">
      {/* Table Section Header */}
      <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-[#f9f8f4] dark:bg-stone-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-stone-900 dark:bg-stone-100"></span>
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-900 dark:text-stone-100">
              SECTION 02 // ACADEMIC COURSE MATRIX
            </h2>
          </div>
          <p className="text-xs text-stone-500 font-serif mt-1">
            Visual academic course completion record. Evidence-grounded progress across all enrolled programs.
          </p>
        </div>
        <div className="text-[11px] font-mono text-stone-500">
          SHOWING {records.length} ACTIVE TRACKS
        </div>
      </div>

      {/* Visual Academic Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-100/70 dark:bg-stone-800/60 text-stone-600 dark:text-stone-300">
              <th className="py-3 px-4 font-semibold uppercase tracking-wider">COURSE PROGRAM</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider text-center">SUBJECTS</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider text-center">LESSONS</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider text-center">PRACTICE</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider text-center">ASSESSMENTS</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider text-center">PROJECTS</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider text-center">AI TEACHING</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider">STATUS</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-stone-800 dark:text-stone-200">
            {records.map((rec) => (
              <tr
                key={rec.id}
                className="hover:bg-amber-50/40 dark:hover:bg-stone-800/40 transition-colors"
              >
                <td className="py-4 px-4 font-sans font-medium text-stone-900 dark:text-stone-100">
                  <div className="font-serif font-bold text-sm text-stone-900 dark:text-white">
                    {rec.name}
                  </div>
                  <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400 mt-0.5">
                    {rec.school_name}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {rec.primary_skills.slice(0, 3).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-1.5 py-0.5 bg-stone-100 dark:bg-stone-800 text-[10px] font-mono text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="py-4 px-4 text-center font-bold">
                  {String(rec.subjects_completed).padStart(2, '0')} / {String(rec.subjects_count).padStart(2, '0')}
                </td>

                <td className="py-4 px-4 text-center font-bold text-blue-900 dark:text-blue-300">
                  {String(rec.lessons_completed).padStart(2, '0')} / {String(rec.lessons_total).padStart(2, '0')}
                </td>

                <td className="py-4 px-4 text-center font-bold">
                  {String(rec.practice_completed).padStart(2, '0')} / {String(rec.practice_total).padStart(2, '0')}
                </td>

                <td className="py-4 px-4 text-center font-bold">
                  {String(rec.assessments_completed).padStart(2, '0')} / {String(rec.assessments_total).padStart(2, '0')}
                </td>

                <td className="py-4 px-4 text-center font-bold text-emerald-800 dark:text-emerald-400">
                  {String(rec.projects_completed).padStart(2, '0')} / {String(rec.projects_total).padStart(2, '0')}
                </td>

                <td className="py-4 px-4 text-center font-bold text-stone-700 dark:text-stone-300">
                  {rec.ai_teaching_hours}
                </td>

                <td className="py-4 px-4">
                  {getStatusBadge(rec.status)}
                </td>

                <td className="py-4 px-4 text-right">
                  <Link
                    href={rec.id.includes('python') ? '/courses/python' : rec.id.includes('sql') ? '/courses/databases' : '/courses/ai-machine-learning'}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white text-[11px] font-mono font-bold tracking-wider uppercase transition-colors"
                  >
                    <span>OPEN</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
