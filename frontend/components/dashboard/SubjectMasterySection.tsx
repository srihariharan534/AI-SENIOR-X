'use client';

import React, { useState, useMemo } from 'react';
import {
  Layers,
  Search,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  Brain,
  Code2,
  Cpu,
} from 'lucide-react';
import { ALL_SUBJECTS } from '@/lib/curriculumData';
import { SubjectDetail } from '@/types/curriculum';

interface SubjectMasterySectionProps {
  onSelectSubject: (subject: SubjectDetail) => void;
  onOpenLesson: (lessonId: string) => void;
}

export const SubjectMasterySection: React.FC<SubjectMasterySectionProps> = ({
  onSelectSubject,
  onOpenLesson,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    ALL_SUBJECTS.forEach((s) => cats.add(s.category));
    return ['All', ...Array.from(cats)];
  }, []);

  const filteredSubjects = useMemo(() => {
    return ALL_SUBJECTS.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <section id="subjects-section" className="border border-stone-800 bg-[#0e1017] p-6 md:p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-emerald-400 font-bold">
            <Layers size={14} />
            <span>SUBJECT MASTERY DASHBOARD</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-stone-100 font-bold tracking-tight">
            Curriculum Subject Competencies
          </h2>
          <p className="text-xs text-stone-300 font-sans max-w-2xl">
            Granular Bayesian mastery scores, memory decay stability, active cognitive gap flags, and lesson hierarchies. Click any subject for full syllabus.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 48 subjects..."
              className="pl-9 pr-4 py-2 bg-[#121520] border border-stone-800 text-xs text-stone-100 placeholder:text-stone-500 font-mono focus:outline-none focus:border-indigo-500 w-full sm:w-56"
            />
          </div>
        </div>
      </div>

      {/* CATEGORY FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs select-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 whitespace-nowrap transition-colors border ${
              selectedCategory === cat
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                : 'bg-[#10131d] text-stone-400 hover:text-stone-200 border-stone-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* SUBJECT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubjects.map((subject) => {
          return (
            <div
              key={subject.id}
              onClick={() => onSelectSubject(subject)}
              className="p-5 bg-[#0c0f18] border border-stone-800 hover:border-emerald-500/40 cursor-pointer transition-all space-y-4 group flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Top Pill Bar */}
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="text-stone-400 uppercase tracking-wider">{subject.category}</span>
                  <span className="px-2 py-0.5 bg-[#141724] border border-stone-800 text-stone-300 uppercase font-bold">
                    {subject.level}
                  </span>
                </div>

                {/* Subject Title */}
                <div>
                  <h3 className="font-serif text-lg text-stone-100 font-bold group-hover:text-emerald-300 transition-colors">
                    {subject.name}
                  </h3>
                  <div className="text-[11px] font-mono text-stone-400">
                    Track: {subject.courseName}
                  </div>
                </div>

                {/* Progress Bar & Mastery Score */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-stone-400">Progress:</span>
                    <span className="text-cyan-300 font-bold">{subject.progressPct}%</span>
                    <span className="text-stone-600">|</span>
                    <span className="text-stone-400">Mastery:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span>{subject.masteryPct}%</span>
                      <TrendingUp size={12} />
                    </span>
                  </div>

                  <div className="w-full bg-stone-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full"
                      style={{ width: `${subject.progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Stats row: Lessons & Problems */}
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px] p-2 bg-[#090b12] border border-stone-850">
                  <div>
                    <span className="text-stone-400">Lessons: </span>
                    <span className="text-stone-200 font-bold">{subject.lessonsCompleted}/{subject.lessonsTotal}</span>
                  </div>
                  <div>
                    <span className="text-stone-400">Drills: </span>
                    <span className="text-stone-200 font-bold">{subject.problemsSolved}</span>
                  </div>
                  <div>
                    <span className="text-stone-400">Retention: </span>
                    <span className="text-indigo-300 font-bold">{subject.retentionPct}%</span>
                  </div>
                  <div>
                    <span className="text-stone-400">Accuracy: </span>
                    <span className="text-amber-300 font-bold">{subject.assessmentScore}%</span>
                  </div>
                </div>

                {/* Cognitive Gap Pill (if active) */}
                {subject.cognitiveGap && (
                  <div className="p-2 bg-[#140e10] border border-rose-900/40 text-[10px] font-mono text-rose-300 flex items-start gap-1.5">
                    <AlertTriangle size={12} className="shrink-0 text-rose-400 mt-0.5" />
                    <span className="truncate">Gap: {subject.cognitiveGap}</span>
                  </div>
                )}
              </div>

              {/* Bottom Recommendation & Jump CTA */}
              <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between font-mono text-[11px]">
                <span className="text-stone-400 truncate max-w-[170px]" title={subject.nextRecommendedLesson}>
                  Next: {subject.nextRecommendedLesson}
                </span>

                <span className="text-emerald-400 group-hover:translate-x-1 transition-transform font-bold flex items-center gap-1">
                  <span>OVERVIEW</span>
                  <ArrowRight size={12} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
