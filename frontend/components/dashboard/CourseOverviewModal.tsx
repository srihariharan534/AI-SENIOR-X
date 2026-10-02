'use client';

import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Layers,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  Target,
  ArrowRight,
  TrendingUp,
  Cpu,
  Brain,
  Code2,
  ShieldCheck,
  Briefcase,
} from 'lucide-react';
import { CourseDetail, SubjectDetail } from '@/types/curriculum';

interface CourseOverviewModalProps {
  course: CourseDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectSubject: (subject: SubjectDetail) => void;
  onOpenLesson: (lessonId: string) => void;
}

export const CourseOverviewModal: React.FC<CourseOverviewModalProps> = ({
  course,
  isOpen,
  onClose,
  onSelectSubject,
  onOpenLesson,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'projects' | 'certificate'>('overview');

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#090c14] border border-stone-800 shadow-2xl shadow-indigo-950/80 flex flex-col max-h-[92vh] overflow-hidden text-stone-100 font-sans">
        
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-stone-800 bg-[#0d101a] flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-cyan-400 font-bold">{course.courseNumber}</span>
              <span className="text-stone-600">/</span>
              <span className="text-stone-400 uppercase">{course.domain}</span>
              <span className="text-stone-600">/</span>
              <span className="px-2 py-0.2 bg-stone-900 border border-stone-800 text-stone-300 text-[10px] uppercase font-bold">
                {course.difficulty}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif text-stone-100 font-bold">
              {course.title}
            </h2>
            <p className="text-xs text-stone-300 max-w-3xl pt-0.5">
              {course.shortDescription}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white border border-stone-800 hover:border-stone-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* 4 STAT PILLS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-stone-800 border-b border-stone-800 font-mono">
          <div className="p-4 bg-[#0a0d15] space-y-1">
            <div className="text-[10px] uppercase text-stone-400">Track Progress</div>
            <div className="text-2xl font-bold text-cyan-400">{course.progressPct}%</div>
            <div className="text-[10px] text-stone-500">{course.lessonsCount} Total Lessons</div>
          </div>

          <div className="p-4 bg-[#0a0d15] space-y-1">
            <div className="text-[10px] uppercase text-stone-400">Mastery Level</div>
            <div className="text-2xl font-bold text-emerald-400">{course.masteryPct}%</div>
            <div className="text-[10px] text-stone-500">Bayesian BKT Verified</div>
          </div>

          <div className="p-4 bg-[#0a0d15] space-y-1">
            <div className="text-[10px] uppercase text-stone-400">Total Duration</div>
            <div className="text-2xl font-bold text-stone-200">{course.durationHours}h</div>
            <div className="text-[10px] text-stone-500">{course.modulesCount} Modules Total</div>
          </div>

          <div className="p-4 bg-[#0a0d15] space-y-1">
            <div className="text-[10px] uppercase text-stone-400">Credential Status</div>
            <div className="text-lg font-bold text-amber-300 flex items-center gap-1">
              <Award size={16} />
              <span>{course.certificateStatus}</span>
            </div>
            <div className="text-[10px] text-stone-500">{course.projectsCount} Projects Required</div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex items-center px-6 border-b border-stone-800 bg-[#070910] font-mono text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 border-b-2 font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-indigo-400 text-white bg-indigo-950/20'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen size={14} />
            <span>OVERVIEW & OUTCOMES</span>
          </button>

          <button
            onClick={() => setActiveTab('subjects')}
            className={`px-4 py-3 border-b-2 font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'subjects'
                ? 'border-cyan-400 text-white bg-cyan-950/20'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Layers size={14} />
            <span>SUBJECTS & SYLLABUS ({course.subjects.length || course.subjectsCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-3 border-b-2 font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'projects'
                ? 'border-amber-400 text-white bg-amber-950/20'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Briefcase size={14} />
            <span>REQUIRED PROJECTS ({course.projectsCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('certificate')}
            className={`px-4 py-3 border-b-2 font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'certificate'
                ? 'border-emerald-400 text-white bg-emerald-950/20'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Award size={14} />
            <span>VERIFIED CERTIFICATE</span>
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="p-5 bg-[#0c0f18] border border-stone-800 space-y-3">
                <div className="font-mono text-xs text-indigo-400 font-bold uppercase">
                  CURRENT ACTIVE FOCUS
                </div>
                <div className="font-serif text-lg text-white">
                  {course.currentModule}
                </div>
                <p className="text-xs text-stone-300 font-sans leading-relaxed">
                  This track covers comprehensive engineering foundations from first principles through production systems, backed by cryptographic portfolio proofs.
                </p>
              </div>

              <div className="space-y-3">
                <div className="font-mono text-xs text-stone-400 uppercase font-bold">
                  SKILL COMPETENCIES ACQUIRED
                </div>
                <div className="flex flex-wrap gap-2">
                  {course.skillOutcomes.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-[#101422] border border-indigo-500/30 text-indigo-300 font-mono text-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    onClose();
                    onOpenLesson('lesson-dl-act-01');
                  }}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-lg shadow-indigo-600/30"
                >
                  <span>RESUME ACTIVE COURSE LESSON</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SUBJECTS */}
          {activeTab === 'subjects' && (
            <div className="space-y-3">
              <div className="font-mono text-xs text-stone-400 uppercase font-bold">
                SUBJECT TRACKS IN THIS COURSE
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.subjects.map((subj) => (
                  <div
                    key={subj.id}
                    onClick={() => {
                      onClose();
                      onSelectSubject(subj);
                    }}
                    className="p-4 bg-[#0c0f18] border border-stone-800 hover:border-indigo-500/50 cursor-pointer transition-all space-y-3 group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-stone-400 uppercase">
                          {subj.category}
                        </span>
                        <h4 className="font-serif text-base text-stone-100 font-semibold group-hover:text-indigo-300 transition-colors">
                          {subj.name}
                        </h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {subj.masteryPct}%
                      </span>
                    </div>

                    <div className="w-full bg-stone-900 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full"
                        style={{ width: `${subj.progressPct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
                      <span>{subj.lessonsCompleted}/{subj.lessonsTotal} lessons</span>
                      <span className="text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        VIEW SUBJECT →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="font-mono text-xs text-stone-400 uppercase font-bold">
                REQUIRED PORTFOLIO CAPSTONES
              </div>
              <p className="text-xs text-stone-300 font-sans">
                Each project generates cryptographic attestation and GitHub commits verified by AI automated test suites.
              </p>
              <div className="p-4 bg-[#0c0f18] border border-stone-800 space-y-2">
                <div className="font-mono text-xs text-amber-400 font-bold uppercase">
                  ACTIVE CAPSTONE REQUIREMENT
                </div>
                <div className="font-serif text-sm text-stone-100">
                  Production-grade implementation with {'>'} 90% unit test coverage and benchmark profiling.
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CERTIFICATE */}
          {activeTab === 'certificate' && (
            <div className="p-6 bg-[#0c0f18] border border-emerald-500/30 space-y-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Award size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl text-white font-bold">
                  Verified {course.title} Specialist Credential
                </h3>
                <p className="text-xs font-mono text-stone-400 max-w-md mx-auto">
                  Requires 80% mastery threshold across all subjects, passing the comprehensive exam, and submitting verified project repositories.
                </p>
              </div>
              <div className="pt-2 font-mono text-xs text-emerald-400 font-bold">
                STATUS: {course.progressPct >= 80 ? 'ELIGIBLE TO CLAIM' : `${80 - course.progressPct}% MORE MASTERY REQUIRED`}
              </div>
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-stone-800 bg-[#0a0d14] flex items-center justify-between font-mono text-xs">
          <span className="text-stone-400">
            AI-SENIOR-X University Catalog • Track {course.courseNumber}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white"
          >
            CLOSE
          </button>
        </div>

      </div>
    </div>
  );
};
