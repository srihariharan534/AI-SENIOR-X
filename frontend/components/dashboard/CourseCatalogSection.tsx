'use client';

import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Layers,
  Award,
  Clock,
  Briefcase,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Code2,
  Activity,
  Brain,
  Cpu,
  Zap,
  Globe,
  Cloud,
  FolderTree,
  Network,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { UNIVERSITY_COURSES } from '@/lib/curriculumData';
import { CourseDetail, DifficultyLevel } from '@/types/curriculum';

interface CourseCatalogSectionProps {
  onSelectCourse: (course: CourseDetail) => void;
  onOpenLesson: (lessonId: string) => void;
}

const ICON_COMPONENTS: Record<string, any> = {
  Code2,
  Layers,
  Activity,
  Brain,
  Cpu,
  Sparkles,
  Zap,
  Globe,
  Cloud,
  FolderTree,
  Network,
};

export const CourseCatalogSection: React.FC<CourseCatalogSectionProps> = ({
  onSelectCourse,
  onOpenLesson,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'recommended' | 'progress' | 'duration' | 'difficulty'>('recommended');

  const domains = useMemo(() => {
    const set = new Set<string>();
    UNIVERSITY_COURSES.forEach((c) => set.add(c.domain));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredAndSortedCourses = useMemo(() => {
    let result = UNIVERSITY_COURSES.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.domain.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDomain = selectedDomain === 'All' || c.domain === selectedDomain;
      const matchesDiff = selectedDifficulty === 'All' || c.difficulty === selectedDifficulty;
      return matchesSearch && matchesDomain && matchesDiff;
    });

    if (sortBy === 'progress') {
      result.sort((a, b) => b.progressPct - a.progressPct);
    } else if (sortBy === 'duration') {
      result.sort((a, b) => b.durationHours - a.durationHours);
    } else if (sortBy === 'difficulty') {
      const diffOrder: Record<string, number> = { Beginner: 1, Intermediate: 2, Advanced: 3, Expert: 4 };
      result.sort((a, b) => (diffOrder[b.difficulty] || 0) - (diffOrder[a.difficulty] || 0));
    }

    return result;
  }, [searchQuery, selectedDomain, selectedDifficulty, sortBy]);

  return (
    <section id="courses-section" className="border border-stone-800 bg-[#0e1017] p-6 md:p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-indigo-400 font-bold">
            <BookOpen size={14} />
            <span>AI-SENIOR-X UNIVERSITY COURSE CATALOG</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-stone-100 font-bold tracking-tight">
            12 Specialized Engineering Tracks
          </h2>
          <p className="text-xs text-stone-300 font-sans max-w-2xl">
            Complete curriculum structure from Python and SQL foundations through Deep Learning, Generative AI, Distributed Systems, and Capstone Simulations.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses, skills..."
              className="pl-9 pr-4 py-2 bg-[#121520] border border-stone-800 text-xs text-stone-100 placeholder:text-stone-500 font-mono focus:outline-none focus:border-indigo-500 w-full sm:w-52"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-[#121520] border border-stone-800 text-xs font-mono text-stone-200 focus:outline-none"
          >
            <option value="recommended">Sort: Recommended</option>
            <option value="progress">Sort: Highest Progress</option>
            <option value="duration">Sort: Duration</option>
            <option value="difficulty">Sort: Difficulty</option>
          </select>
        </div>
      </div>

      {/* DOMAIN FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs select-none">
        {domains.map((dom) => (
          <button
            key={dom}
            onClick={() => setSelectedDomain(dom)}
            className={`px-3 py-1.5 whitespace-nowrap transition-colors border ${
              selectedDomain === dom
                ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500 font-bold'
                : 'bg-[#10131d] text-stone-400 hover:text-stone-200 border-stone-800'
            }`}
          >
            {dom}
          </button>
        ))}
      </div>

      {/* 12 COURSES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAndSortedCourses.map((course) => {
          const IconComp = ICON_COMPONENTS[course.icon] || BookOpen;
          return (
            <div
              key={course.id}
              onClick={() => onSelectCourse(course)}
              className="p-6 bg-[#0c0f18] border border-stone-800 hover:border-indigo-500/50 cursor-pointer transition-all space-y-5 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Top Header Pill & Track Number */}
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#141824] border border-stone-700 flex items-center justify-center text-indigo-400">
                      <IconComp size={15} />
                    </div>
                    <span className="text-cyan-400 font-bold uppercase">{course.courseNumber}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-[#141724] border border-stone-800 text-stone-300 uppercase font-bold">
                    {course.difficulty}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="space-y-1">
                  <h3 className="font-serif text-xl text-stone-100 font-bold group-hover:text-indigo-300 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-stone-300 font-sans line-clamp-2 leading-relaxed">
                    {course.shortDescription}
                  </p>
                </div>

                {/* Progress Bar & Mastery */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-stone-400">Progress:</span>
                    <span className="text-cyan-300 font-bold">{course.progressPct}%</span>
                    <span className="text-stone-600">|</span>
                    <span className="text-stone-400">Mastery:</span>
                    <span className="text-emerald-400 font-bold">{course.masteryPct}%</span>
                  </div>
                  <div className="w-full bg-stone-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 h-full rounded-full"
                      style={{ width: `${course.progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Curriculum Stats Pill */}
                <div className="grid grid-cols-3 gap-2 font-mono text-[10px] p-2 bg-[#090b12] border border-stone-850 text-center">
                  <div>
                    <div className="text-stone-400">Subjects</div>
                    <div className="text-stone-200 font-bold text-xs">{course.subjectsCount}</div>
                  </div>
                  <div>
                    <div className="text-stone-400">Modules</div>
                    <div className="text-stone-200 font-bold text-xs">{course.modulesCount}</div>
                  </div>
                  <div>
                    <div className="text-stone-400">Lessons</div>
                    <div className="text-stone-200 font-bold text-xs">{course.lessonsCount}</div>
                  </div>
                </div>

                {/* Skill Outcomes Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {course.skillOutcomes.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-[#101422] border border-stone-800 text-stone-300 font-mono text-[10px]"
                    >
                      {skill}
                    </span>
                  ))}
                  {course.skillOutcomes.length > 3 && (
                    <span className="px-1.5 py-0.5 text-stone-500 font-mono text-[10px]">
                      +{course.skillOutcomes.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between font-mono text-xs">
                <span className="text-stone-400 text-[11px] flex items-center gap-1">
                  <Clock size={11} />
                  <span>{course.durationHours}h total</span>
                </span>

                <span className="text-indigo-400 group-hover:translate-x-1 transition-transform font-bold flex items-center gap-1">
                  <span>EXPLORE SYLLABUS</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
