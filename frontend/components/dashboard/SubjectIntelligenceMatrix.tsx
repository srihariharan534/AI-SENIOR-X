'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SubjectStateData } from '@/hooks/useAcademicDashboard';
import { SubjectEvidenceDrawer } from './SubjectEvidenceDrawer';
import { Filter, Layers, ArrowUpRight } from 'lucide-react';

interface SubjectIntelligenceMatrixProps {
  subjects?: SubjectStateData[];
}

export const SubjectIntelligenceMatrix: React.FC<SubjectIntelligenceMatrixProps> = ({
  subjects = [],
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [activeSubject, setActiveSubject] = useState<SubjectStateData | null>(null);

  const filterOptions = [
    { id: 'ALL', label: 'ALL (22)' },
    { id: 'school-cs', label: 'COMPUTER SCIENCE (6)' },
    { id: 'school-ai', label: 'AI & DATA (7)' },
    { id: 'school-cloud', label: 'CLOUD & INFRASTRUCTURE (4)' },
    { id: 'school-career', label: 'CAREER & LEADERSHIP (5)' },
  ];

  const filteredSubjects = subjects.filter((s) => {
    if (selectedFilter === 'ALL') return true;
    return s.school_id === selectedFilter;
  });

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 font-mono text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
            COMPLETED
          </span>
        );
      case 'DEMONSTRATED':
        return (
          <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-mono text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            DEMONSTRATED
          </span>
        );
      case 'PROJECT':
        return (
          <span className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400 font-mono text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block"></span>
            PROJECT
          </span>
        );
      case 'ASSESSMENT':
        return (
          <span className="flex items-center gap-1.5 text-purple-700 dark:text-purple-400 font-mono text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-purple-600 inline-block"></span>
            ASSESSMENT
          </span>
        );
      case 'PRACTICING':
        return (
          <span className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-mono text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block animate-pulse"></span>
            PRACTICING
          </span>
        );
      case 'LEARNING':
        return (
          <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-mono text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-600 inline-block"></span>
            LEARNING
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 text-stone-400 dark:text-stone-500 font-mono text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-stone-300 dark:bg-stone-700 inline-block"></span>
            NOT STARTED
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-[#fdfcf9] dark:bg-stone-900 border border-stone-300 dark:border-stone-800">
      {/* Matrix Header */}
      <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-[#f9f8f4] dark:bg-stone-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-blue-800 dark:bg-blue-400"></span>
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-900 dark:text-stone-100">
              SECTION 03 // SUBJECT INTELLIGENCE MATRIX (ALL 22 ACADEMIC DISCIPLINES)
            </h2>
          </div>
          <p className="text-xs text-stone-500 font-serif mt-1">
            Click any subject to open its granular evidence flight profile and curriculum timeline.
          </p>
        </div>

        {/* School Filters */}
        <div className="flex flex-wrap items-center gap-1 font-mono text-xs">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedFilter(opt.id)}
              className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors border ${
                selectedFilter === opt.id
                  ? 'bg-stone-900 text-white border-stone-900 dark:bg-white dark:text-stone-950 dark:border-white'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:border-stone-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 22 Subject Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubjects.map((subj) => (
          <div
            key={subj.id}
            onClick={() => setActiveSubject(subj)}
            className="p-4 bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 hover:border-stone-900 dark:hover:border-stone-400 cursor-pointer transition-all hover:shadow-sm flex flex-col justify-between space-y-3 group"
          >
            <div>
              <div className="flex items-center justify-between font-mono text-[10px] text-stone-400 uppercase">
                <span className="truncate max-w-[170px]">{subj.school_name}</span>
                <ArrowUpRight size={13} className="group-hover:text-stone-900 dark:group-hover:text-white transition-colors" />
              </div>

              <div className="text-base font-serif font-bold text-stone-900 dark:text-white mt-1 group-hover:text-blue-900 dark:group-hover:text-blue-300 transition-colors">
                {subj.name}
              </div>

              <div className="text-xs text-stone-500 font-sans line-clamp-2 mt-1">
                {subj.headline}
              </div>
            </div>

            {/* Evidence Checklist Mini Summary */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-stone-400 uppercase">ACADEMIC STATE</span>
                {getStatusIndicator(subj.status)}
              </div>

              <div className="grid grid-cols-3 gap-1 text-center font-mono text-[10px] text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-900/60 p-1.5 border border-stone-200 dark:border-stone-700">
                <div>
                  <span className="text-stone-400 block text-[9px]">LESSONS</span>
                  <span className="font-bold">{subj.lessons_completed}/{subj.lessons_total}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[9px]">PRACTICE</span>
                  <span className="font-bold">{subj.practice_completed}/{subj.practice_total}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[9px]">PROJECTS</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{subj.projects_completed}/{subj.projects_total}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Subject Evidence Drawer Modal */}
      {activeSubject && (
        <SubjectEvidenceDrawer
          subject={activeSubject}
          onClose={() => setActiveSubject(null)}
        />
      )}
    </div>
  );
};
