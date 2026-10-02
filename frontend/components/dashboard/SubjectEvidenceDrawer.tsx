'use client';

import React from 'react';
import Link from 'next/link';
import { SubjectStateData } from '@/hooks/useAcademicDashboard';
import { X, CheckCircle2, Play, BookOpen, BrainCircuit, Award, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

interface SubjectEvidenceDrawerProps {
  subject: SubjectStateData | null;
  onClose: () => void;
}

export const SubjectEvidenceDrawer: React.FC<SubjectEvidenceDrawerProps> = ({
  subject,
  onClose,
}) => {
  if (!subject) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#fcfbfa] dark:bg-stone-900 border border-stone-400 dark:border-stone-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Drawer Header */}
        <div className="p-6 border-b border-stone-200 dark:border-stone-800 bg-[#f7f5ee] dark:bg-stone-950 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-blue-900 dark:text-blue-400 font-bold">
              <span>{subject.school_name}</span>
              <span>•</span>
              <span>SUBJECT EVIDENCE PROFILE</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-white mt-1">
              {subject.name}
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-300 font-sans mt-1">
              {subject.headline}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Evidence Flow Pipeline Representation */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-semibold">
              EVIDENCE VERIFICATION PIPELINE
            </div>
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-stone-700 dark:text-stone-300">
              <span className="px-2 py-1 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700">SUBJECT</span>
              <span>→</span>
              <span className="px-2 py-1 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700">MODULES</span>
              <span>→</span>
              <span className="px-2 py-1 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700">LESSONS</span>
              <span>→</span>
              <span className="px-2 py-1 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700">AI TEACHING</span>
              <span>→</span>
              <span className="px-2 py-1 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700">PRACTICE</span>
              <span>→</span>
              <span className="px-2 py-1 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700">ASSESSMENTS</span>
              <span>→</span>
              <span className="px-2 py-1 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700">PROJECTS</span>
              <span>→</span>
              <span className="px-2 py-1 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700">TWIN</span>
              <span>→</span>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-bold">CERTIFICATE</span>
            </div>
          </div>

          {/* Detailed Academic Evidence Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
              <div className="text-[10px] uppercase text-stone-500">MODULES</div>
              <div className="text-base font-bold text-stone-900 dark:text-white mt-1">
                {String(subject.modules_completed).padStart(2, '0')} / {String(subject.modules_total).padStart(2, '0')}
              </div>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
              <div className="text-[10px] uppercase text-stone-500">LESSONS</div>
              <div className="text-base font-bold text-blue-900 dark:text-blue-300 mt-1">
                {String(subject.lessons_completed).padStart(2, '0')} / {String(subject.lessons_total).padStart(2, '0')}
              </div>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
              <div className="text-[10px] uppercase text-stone-500">AI TEACHING</div>
              <div className="text-base font-bold text-stone-900 dark:text-white mt-1">
                {subject.ai_teaching_hours}
              </div>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
              <div className="text-[10px] uppercase text-stone-500">PRACTICE</div>
              <div className="text-base font-bold text-stone-900 dark:text-white mt-1">
                {String(subject.practice_completed).padStart(2, '0')} / {String(subject.practice_total).padStart(2, '0')}
              </div>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
              <div className="text-[10px] uppercase text-stone-500">ASSESSMENTS</div>
              <div className="text-base font-bold text-stone-900 dark:text-white mt-1">
                {String(subject.assessments_completed).padStart(2, '0')} / {String(subject.assessments_total).padStart(2, '0')}
              </div>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
              <div className="text-[10px] uppercase text-stone-500">PROJECTS</div>
              <div className="text-base font-bold text-emerald-800 dark:text-emerald-300 mt-1">
                {String(subject.projects_completed).padStart(2, '0')} / {String(subject.projects_total).padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* Cognitive Twin State */}
          <div className="p-4 bg-[#f8f7f2] dark:bg-stone-800/60 border border-stone-300 dark:border-stone-700 space-y-2">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-stone-500 uppercase">LEARNING TWIN COGNITIVE STATE:</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                {subject.twin_skill_state}
              </span>
            </div>
            <div className="text-xs text-stone-700 dark:text-stone-300 font-sans">
              <strong>Primary Skills:</strong> {subject.primary_skills.join(' • ')}
            </div>
          </div>

          {/* Next Recommended Step */}
          <div className="p-4 bg-stone-950 text-white border border-stone-800 space-y-3">
            <div className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider">
              NEXT RECOMMENDED LESSON / ACTION
            </div>
            <div className="font-serif font-bold text-base text-stone-100">
              {subject.next_lesson_title}
            </div>
            <div className="pt-2">
              <Link
                href={`/courses/${subject.id}`}
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <span>OPEN SUBJECT CURRICULUM</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
