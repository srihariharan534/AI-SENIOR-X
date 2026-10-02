'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Skeleton } from '@/components/common/Skeleton';
import {
  BookOpen,
  Clock,
  ArrowRight,
  Layers,
  Sparkles,
  Search,
  Cpu,
  BrainCircuit,
  Cloud,
  Rocket,
  FolderTree,
  CheckCircle2,
  Code,
  GraduationCap,
  Award,
  Video,
  Play,
  Briefcase,
  HelpCircle,
} from 'lucide-react';

interface UniversitySubject {
  id: string;
  subject_name: string;
  school_id: string;
  school_name: string;
  headline: string;
  level_range: string;
  modules_count: number;
  lessons_count: number;
  estimated_hours: number;
  projects_count: number;
  primary_skills: string[];
}

interface UniversitySchool {
  id: string;
  name: string;
  description: string;
  accent_color: string;
  subjects: UniversitySubject[];
}

const SCHOOL_ICON_MAP: Record<string, any> = {
  'school-cs': Cpu,
  'school-ai': BrainCircuit,
  'school-cloud': Cloud,
  'school-career': Rocket,
};

const SCHOOL_COLOR_CONFIG: Record<
  string,
  {
    borderHover: string;
    badgeBg: string;
    textAccent: string;
  }
> = {
  'school-cs': {
    borderHover: 'hover:border-sky-500/40',
    badgeBg: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
    textAccent: 'text-sky-400',
  },
  'school-ai': {
    borderHover: 'hover:border-violet-500/40',
    badgeBg: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
    textAccent: 'text-violet-400',
  },
  'school-cloud': {
    borderHover: 'hover:border-amber-500/40',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    textAccent: 'text-amber-400',
  },
  'school-career': {
    borderHover: 'hover:border-emerald-500/40',
    badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    textAccent: 'text-emerald-400',
  },
};

export default function UniversityCurriculumHubPage() {
  const [schools, setSchools] = useState<UniversitySchool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>('all');

  useEffect(() => {
    const fetchSchools = async () => {
      setLoading(true);
      try {
        const res = await api.getUniversitySchools();
        if (res && res.data) {
          setSchools(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch university schools:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchools();
  }, []);

  const totalSubjects = useMemo(
    () => schools.reduce((acc, s) => acc + s.subjects.length, 0),
    [schools]
  );

  const totalLessons = useMemo(
    () =>
      schools.reduce(
        (acc, s) =>
          acc + s.subjects.reduce((subAcc, subj) => subAcc + subj.lessons_count, 0),
        0
      ),
    [schools]
  );

  const totalHours = useMemo(
    () =>
      schools.reduce(
        (acc, s) =>
          acc + s.subjects.reduce((subAcc, subj) => subAcc + subj.estimated_hours, 0),
        0
      ),
    [schools]
  );

  const filteredSchools = useMemo(() => {
    let list = schools;
    if (selectedSchoolFilter !== 'all') {
      list = list.filter((s) => s.id === selectedSchoolFilter);
    }
    if (!searchQuery.trim()) return list;

    const query = searchQuery.toLowerCase();
    return list
      .map((s) => ({
        ...s,
        subjects: s.subjects.filter(
          (subj) =>
            subj.subject_name.toLowerCase().includes(query) ||
            subj.headline.toLowerCase().includes(query) ||
            subj.primary_skills.some((sk) => sk.toLowerCase().includes(query))
        ),
      }))
      .filter((s) => s.subjects.length > 0);
  }, [schools, selectedSchoolFilter, searchQuery]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* University Campus Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/60 border border-indigo-500/30 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30 flex items-center gap-1.5">
              <GraduationCap size={14} />
              AI-SENIOR-X University
            </span>
            <span className="text-[11px] font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/30">
              4 Schools • 22 Degree Subjects
            </span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Adaptive University Curriculum
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl mt-2 leading-relaxed">
              University-level cognitive education powered by multimodal AI professors, interactive video lectures, step-by-step code animation, and verifiable skill evidence.
            </p>
          </div>

          {/* Campus Dynamic Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-xl font-black text-white">4</span>
              <span className="block text-[11px] text-slate-400 font-semibold uppercase">Schools</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-xl font-black text-white">{totalSubjects || 22}</span>
              <span className="block text-[11px] text-slate-400 font-semibold uppercase">Subjects</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-xl font-black text-cyan-400">{totalLessons || 120}+</span>
              <span className="block text-[11px] text-slate-400 font-semibold uppercase">Lessons</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-xl font-black text-emerald-400">{totalHours || 800}+</span>
              <span className="block text-[11px] text-slate-400 font-semibold uppercase">Learning Hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH AND SCHOOL FILTER CONTROLS */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects, skills, or architectures (e.g., Python, CPython, RAG, Kubernetes)..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
          />
        </div>

        {/* School Tabs Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedSchoolFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedSchoolFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Schools ({totalSubjects || 22})
          </button>
          {schools.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSchoolFilter(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSchoolFilter === s.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s.name.split('—')[1] || s.name}
            </button>
          ))}
        </div>
      </div>

      {/* 4 SCHOOLS & 22 SUBJECTS HIERARCHY */}
      {loading ? (
        <div className="space-y-8">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : (
        <div className="space-y-10">
          {filteredSchools.map((school) => {
            const Icon = SCHOOL_ICON_MAP[school.id] || BookOpen;
            const style = SCHOOL_COLOR_CONFIG[school.id] || SCHOOL_COLOR_CONFIG['school-cs'];

            return (
              <div key={school.id} className="space-y-4">
                {/* School Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white tracking-tight">
                        {school.name}
                      </h2>
                      <p className="text-xs text-slate-400">{school.description}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800 self-start sm:self-auto">
                    {school.subjects.length} Subjects
                  </span>
                </div>

                {/* Subjects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {school.subjects.map((subj) => (
                    <Link
                      key={subj.id}
                      href={`/learn/${subj.id}`}
                      className={`group p-6 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 flex flex-col justify-between transition-all duration-200 ${style.borderHover} hover:shadow-xl hover:-translate-y-0.5`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${style.badgeBg}`}>
                            {subj.level_range}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {subj.estimated_hours}h
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                            {subj.subject_name}
                          </h3>
                          <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                            {subj.headline}
                          </p>
                        </div>

                        {/* Primary Skills */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {subj.primary_skills?.slice(0, 3).map((sk, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 font-mono"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-3 font-mono text-[11px]">
                          <span>{subj.modules_count} Modules</span>
                          <span>•</span>
                          <span>{subj.lessons_count} Lessons</span>
                        </div>
                        <span className="flex items-center gap-1 font-bold text-indigo-400 group-hover:text-indigo-300">
                          View Syllabus <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
