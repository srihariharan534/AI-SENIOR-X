'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UNIVERSITY_SCHOOLS,
  UniversitySchool,
  UniversitySubject,
} from '@/lib/universityData';
import {
  ArrowRight,
  BookOpen,
  Layers,
  Sparkles,
  Clock,
  Briefcase,
  Target,
  ChevronRight,
  CheckCircle2,
  Cpu,
  BrainCircuit,
  Cloud,
  Rocket,
} from 'lucide-react';

interface UniversityCourseLibraryProps {
  onSelectSubject?: (subject: UniversitySubject) => void;
}

const SCHOOL_ICON_MAP: Record<string, any> = {
  'school-cs': Cpu,
  'school-ai': BrainCircuit,
  'school-cloud': Cloud,
  'school-career': Rocket,
};

export const UniversityCourseLibrary: React.FC<UniversityCourseLibraryProps> = ({
  onSelectSubject,
}) => {
  const [activeSchoolFilter, setActiveSchoolFilter] = useState<string>('all');
  const [hoveredSubjectId, setHoveredSubjectId] = useState<string | null>(null);

  const filteredSchools =
    activeSchoolFilter === 'all'
      ? UNIVERSITY_SCHOOLS
      : UNIVERSITY_SCHOOLS.filter((s) => s.id === activeSchoolFilter);

  return (
    <section className="space-y-10 py-6">
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-300 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-mono text-xs text-blue-700 uppercase font-bold tracking-widest">
            <span>01</span>
            <span>/</span>
            <span>THE AI-SENIOR-X COURSE LIBRARY</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 font-normal tracking-tight">
            22 University-Grade Subjects
          </h2>
          <p className="text-sm text-stone-600 font-sans max-w-2xl leading-relaxed">
            Complete university-style subjects, structured from first principles to professional enterprise application. Organized across four academic schools.
          </p>
        </div>

        {/* School Filter Rail */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-mono text-xs select-none">
          <button
            onClick={() => setActiveSchoolFilter('all')}
            className={`px-3 py-1.5 transition-colors border ${
              activeSchoolFilter === 'all'
                ? 'bg-stone-900 text-white border-stone-900 font-bold'
                : 'bg-white text-stone-600 hover:text-stone-900 border-stone-300'
            }`}
          >
            ALL SCHOOLS (22)
          </button>
          {UNIVERSITY_SCHOOLS.map((school) => (
            <button
              key={school.id}
              onClick={() => setActiveSchoolFilter(school.id)}
              className={`px-3 py-1.5 whitespace-nowrap transition-colors border ${
                activeSchoolFilter === school.id
                  ? 'bg-blue-700 text-white border-blue-700 font-bold'
                  : 'bg-white text-stone-600 hover:text-stone-900 border-stone-300'
              }`}
            >
              {school.name.toUpperCase()} ({school.subjects.length})
            </button>
          ))}
        </div>
      </div>

      {/* 4 SCHOOL SECTIONS */}
      <div className="space-y-16">
        {filteredSchools.map((school) => {
          const SchoolIcon = SCHOOL_ICON_MAP[school.id] || BookOpen;
          return (
            <div key={school.id} className="space-y-6">
              {/* School Header */}
              <div className="flex items-center justify-between border-b border-stone-300 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-stone-900 text-white flex items-center justify-center font-mono text-xs font-bold">
                    {school.schoolNumber}
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-stone-900 font-semibold tracking-tight">
                      {school.name}
                    </h3>
                    <p className="text-xs text-stone-500 font-sans">
                      {school.description}
                    </p>
                  </div>
                </div>

                <div className="font-mono text-xs text-stone-500 hidden sm:block">
                  {school.subjects.length} Complete Subjects
                </div>
              </div>

              {/* Subject Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {school.subjects.map((subject) => {
                  const isHovered = hoveredSubjectId === subject.id;
                  return (
                    <div
                      key={subject.id}
                      onMouseEnter={() => setHoveredSubjectId(subject.id)}
                      onMouseLeave={() => setHoveredSubjectId(null)}
                      className="group relative bg-[#fcfbfa] border border-stone-300 hover:border-blue-700 transition-all duration-200 p-6 flex flex-col justify-between space-y-6"
                    >
                      <div className="space-y-4">
                        {/* Top Editorial Number & Level Badge */}
                        <div className="flex items-center justify-between font-mono text-xs">
                          <span className="text-stone-400 font-bold text-sm">
                            {subject.subjectNumber}
                          </span>
                          <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-stone-100 border border-stone-300 text-stone-700">
                            {subject.difficulty}
                          </span>
                        </div>

                        {/* Subject Title & Tagline */}
                        <div className="space-y-1.5">
                          <h4 className="font-serif text-2xl text-stone-900 font-semibold tracking-tight group-hover:text-blue-700 transition-colors">
                            {subject.name}
                          </h4>
                          <p className="text-xs text-stone-600 font-sans leading-relaxed">
                            {subject.tagline}
                          </p>
                        </div>

                        {/* Tier Progression Pills */}
                        <div className="flex flex-wrap gap-1 pt-1 font-mono text-[9px]">
                          {subject.levelTiers.map((tier, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-stone-100 text-stone-600 border border-stone-200 uppercase font-semibold"
                            >
                              {tier}
                            </span>
                          ))}
                        </div>

                        {/* Curriculum Real Metadata Numbers */}
                        <div className="grid grid-cols-4 gap-2 border-y border-stone-200 py-3 text-center font-mono text-[11px]">
                          <div>
                            <div className="text-stone-400 text-[9px] uppercase">LESSONS</div>
                            <div className="font-bold text-stone-900 text-xs">{subject.totalLessonsCount}</div>
                          </div>
                          <div>
                            <div className="text-stone-400 text-[9px] uppercase">MODULES</div>
                            <div className="font-bold text-stone-900 text-xs">{subject.totalModulesCount}</div>
                          </div>
                          <div>
                            <div className="text-stone-400 text-[9px] uppercase">PROJECTS</div>
                            <div className="font-bold text-stone-900 text-xs">{subject.totalProjectsCount}</div>
                          </div>
                          <div>
                            <div className="text-stone-400 text-[9px] uppercase">AI HOURS</div>
                            <div className="font-bold text-blue-700 text-xs">{subject.totalAiTeachingHours}h</div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Action Bar */}
                      <div className="space-y-2 pt-2">
                        <Link
                          href={`/courses/${subject.slug}`}
                          className="w-full py-2.5 px-4 bg-stone-900 group-hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                        >
                          <span>EXPLORE COURSE</span>
                          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                        </Link>

                        {/* Hover Quick-Links */}
                        <div className="flex items-center justify-between font-mono text-[10px] text-stone-500 pt-1">
                          <Link
                            href={`/courses/${subject.slug}#curriculum`}
                            className="hover:text-blue-700 hover:underline"
                          >
                            CURRICULUM
                          </Link>
                          <span>•</span>
                          <Link
                            href={`/courses/${subject.slug}#daily-plan`}
                            className="hover:text-blue-700 hover:underline"
                          >
                            DAILY PLAN
                          </Link>
                          <span>•</span>
                          <Link
                            href={`/courses/${subject.slug}#ai-teacher`}
                            className="hover:text-blue-700 hover:underline"
                          >
                            AI TEACHER
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
