'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Card, CardHeader, CardTitle } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Skeleton } from '@/components/common/Skeleton';
import {
  BookOpen,
  Brain,
  Code2,
  FileCheck2,
  Award,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowLeft,
  Sparkles,
  Layers,
  GraduationCap,
  Video,
  Play,
  Briefcase,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Zap,
  Terminal,
  Cpu,
  Target,
  Users,
  Compass,
  DollarSign,
  Search,
  MessageSquare,
  Volume2,
  X,
} from 'lucide-react';

export default function UniversityCourseOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const rawTopic = (params?.topic as string) || 'python';
  const topicId = rawTopic.toLowerCase();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showProfessorExplanation, setShowProfessorExplanation] = useState(false);
  const [showStuckModal, setShowStuckModal] = useState(false);
  const [stuckQuery, setStuckQuery] = useState('');
  const [stuckDiagnosis, setStuckDiagnosis] = useState<any>(null);
  const [diagnosing, setDiagnosing] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'py-mod-01': true,
  });

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const res = await api.getUniversityCourse(topicId);
        if (res && res.data) {
          setCourse(res.data);
          // Default expand first module
          if (res.data.modules && res.data.modules.length > 0) {
            setExpandedModules({ [res.data.modules[0].id]: true });
          }
        }
      } catch (err) {
        console.error('Failed to load university course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [topicId]);

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  const handleDiagnoseStuck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stuckQuery.trim()) return;
    setDiagnosing(true);
    try {
      const res = await api.diagnoseStuck({
        current_subject: topicId,
        query_text: stuckQuery,
      });
      if (res && res.data) {
        setStuckDiagnosis(res.data);
      }
    } catch (err) {
      console.error('Diagnostic error:', err);
    } finally {
      setDiagnosing(false);
    }
  };

  if (loading || !course) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-8">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  const exp = course.explanation || {};

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      {/* Top Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={15} />
          <span>University Curriculum &amp; Schools</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowStuckModal(true)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all"
          >
            <HelpCircle size={14} />
            <span>I Don&apos;t Know Where I&apos;m Stuck</span>
          </button>
        </div>
      </div>

      {/* MASTER COURSE HEADER HERO */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/60 border border-indigo-500/30 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
              {course.school_name}
            </span>
            <span className="text-[11px] font-mono text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
              Level 1 to Level 5 Progression
            </span>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full">
              University Degree Standard
            </span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {course.course_title}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl mt-2 leading-relaxed">
              {course.headline}
            </p>
          </div>

          {/* Real Dynamically Calculated Course Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-3 border-t border-slate-800">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-lg font-black text-white">{course.total_modules_count}</span>
              <span className="block text-[10px] text-slate-400 font-semibold uppercase">Modules</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-lg font-black text-white">{course.total_chapters_count}</span>
              <span className="block text-[10px] text-slate-400 font-semibold uppercase">Chapters</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-lg font-black text-white">{course.total_lessons_count}</span>
              <span className="block text-[10px] text-slate-400 font-semibold uppercase">Lessons</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-lg font-black text-cyan-400">{course.total_video_duration_hours}h</span>
              <span className="block text-[10px] text-slate-400 font-semibold uppercase">AI Video</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-lg font-black text-emerald-400">{course.total_projects_count}</span>
              <span className="block text-[10px] text-slate-400 font-semibold uppercase">Projects</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-lg font-black text-purple-400">{course.total_assessments_count}</span>
              <span className="block text-[10px] text-slate-400 font-semibold uppercase">Assessments</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center col-span-2 sm:col-span-1">
              <span className="text-lg font-black text-amber-400">{course.total_challenges_count}</span>
              <span className="block text-[10px] text-slate-400 font-semibold uppercase">Challenges</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={() => setShowProfessorExplanation(true)}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <GraduationCap size={18} />
              <span>Understand This Course (Professor Introduction)</span>
            </button>

            <Link
              href={`/tutor?mode=video_studio&topic=${course.id}`}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-cyan-600/20 transition-all"
            >
              <Video size={18} />
              <span>Launch AI Video Teaching Studio</span>
            </Link>
          </div>
        </div>
      </div>

      {/* PROFESSOR "UNDERSTAND THIS COURSE" 12-POINT ACCORDION MODAL/PANEL */}
      {showProfessorExplanation && (
        <Card className="border-indigo-500/40 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 shadow-2xl animate-fadeIn">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <GraduationCap size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  University Professor Course Briefing: {course.subject_name}
                </h3>
                <p className="text-xs text-slate-400">
                  Comprehensive 12-point architectural breakdown before beginning Lesson 1.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowProfessorExplanation(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
            {/* 1 & 2 */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px]">
                  1. What is this Subject?
                </span>
                <p className="text-slate-200">{exp.what_is_this_subject}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px]">
                  2. Why Does it Matter?
                </span>
                <p className="text-slate-200">{exp.why_does_it_matter}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px]">
                  3. Where is it Used in Production?
                </span>
                <ul className="space-y-1 list-disc pl-4 text-slate-200">
                  {exp.where_is_it_used?.map((u: string, idx: number) => (
                    <li key={idx}>{u}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px]">
                  4. What Will You Learn?
                </span>
                <ul className="space-y-1 list-disc pl-4 text-slate-200">
                  {exp.what_will_you_learn?.map((w: string, idx: number) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px]">
                  5. Course Structure &amp; Progression
                </span>
                <p className="text-slate-200">{exp.how_is_subject_structured}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px]">
                  6. Prerequisites
                </span>
                <p className="text-slate-200">
                  <strong>Required:</strong> {exp.prerequisites_required?.join(', ')}
                </p>
                <p className="text-slate-400 mt-1">
                  <strong>Recommended:</strong> {exp.prerequisites_recommended?.join(', ')}
                </p>
              </div>
            </div>

            {/* 7 to 12 */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px]">
                  7. Difficulty Progression
                </span>
                <p className="text-slate-200">{exp.difficulty_progression}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px]">
                  8. Projects You Will Build
                </span>
                <ul className="space-y-1 list-disc pl-4 text-slate-200">
                  {exp.projects_you_will_build?.map((p: string, idx: number) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px]">
                  9. How You Will Be Assessed
                </span>
                <ul className="space-y-1 list-disc pl-4 text-slate-200">
                  {exp.how_you_will_be_assessed?.map((a: string, idx: number) => (
                    <li key={idx}>{a}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px]">
                  10. Real-World Skills Gained
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {exp.real_world_skills_gained?.map((sk: string, idx: number) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px]">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px]">
                  11. Career Paths &amp; Roles
                </span>
                <ul className="space-y-1 list-disc pl-4 text-emerald-300">
                  {exp.careers_and_roles?.map((c: string, idx: number) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950 to-slate-950 border border-indigo-500/40 space-y-1.5">
                <span className="font-bold text-cyan-300 uppercase tracking-wider text-[10px]">
                  12. Final Capability Vision
                </span>
                <p className="text-slate-100 font-medium">{exp.final_capability_vision}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* THREE-PILLAR OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/60 border-slate-800 p-5 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400">
            <Target size={18} />
            <h3 className="font-bold text-white text-sm">Course Purpose</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{course.purpose}</p>
          <div className="pt-2 border-t border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Problems Solved:</span>
            {course.problems_solved?.slice(0, 2).map((prob: string, idx: number) => (
              <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                <span className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                <span>{prob}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800 p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <DollarSign size={18} />
            <h3 className="font-bold text-white text-sm">Career Trajectories</h3>
          </div>
          <div className="space-y-2">
            {course.careers_using_it?.map((car: string, idx: number) => (
              <div key={idx} className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-200 flex items-center justify-between">
                <span>{car}</span>
                <CheckCircle2 size={13} className="text-emerald-400" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800 p-5 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <Award size={18} />
            <h3 className="font-bold text-white text-sm">Certificate Verification</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Evidence-backed cryptographic credential issued upon completing all 5 levels and the capstone challenge.
          </p>
          <div className="space-y-1 pt-1">
            {course.certificate_requirements?.slice(0, 3).map((req: string, idx: number) => (
              <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck size={13} className="text-cyan-400 mt-0.5 shrink-0" />
                <span>{req}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* CURRICULUM SYLLABUS TREE (LEVEL 1 TO LEVEL 5) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen size={20} className="text-indigo-400" />
              University Curriculum &amp; Module Roadmap
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Structured progressive learning from Level 1 (Foundations) to Level 5 (Production Architecture).
            </p>
          </div>
          <span className="text-xs font-mono text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-lg border border-indigo-800">
            {course.modules?.length} Structured Modules
          </span>
        </div>

        <div className="space-y-4">
          {course.modules?.map((mod: any, mIdx: number) => {
            const isExpanded = !!expandedModules[mod.id];

            return (
              <div
                key={mod.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all shadow-lg"
              >
                {/* Module Header Bar */}
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="w-full text-left p-5 flex items-start sm:items-center justify-between gap-4 bg-slate-900/90 hover:bg-slate-850 transition-colors"
                >
                  <div className="flex items-start gap-3.5 flex-1">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5 font-bold text-xs">
                      {mIdx + 1}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                          {mod.level_tier}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                          <Clock size={11} /> {mod.total_video_duration_minutes} min video
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white">{mod.title}</h3>
                      <p className="text-xs text-slate-300 mt-1">{mod.description}</p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 text-slate-400">
                    <span className="text-xs hidden sm:inline font-mono">
                      {mod.chapters?.length} Chapters
                    </span>
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </div>
                </button>

                {/* Module Expanded Details & Chapters */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-800 space-y-4 bg-slate-950/40 animate-fadeIn">
                    {/* Module Learning Objectives */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                        Demonstrated Learning Objectives:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {mod.learning_objectives?.map((obj: string, oIdx: number) => (
                          <div key={oIdx} className="flex items-start gap-2 text-xs text-slate-300">
                            <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                            <span>{obj}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Chapters List */}
                    <div className="space-y-3">
                      {mod.chapters?.map((ch: any, cIdx: number) => (
                        <div
                          key={ch.id}
                          className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-slate-800 text-[11px] flex items-center justify-center text-slate-300 font-mono">
                                  {cIdx + 1}
                                </span>
                                {ch.title}
                              </h4>
                              <p className="text-xs text-slate-400 mt-0.5">{ch.description}</p>
                            </div>
                            <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800/40 shrink-0">
                              {ch.video_duration_minutes} min video
                            </span>
                          </div>

                          {/* Lessons inside Chapter */}
                          <div className="space-y-2 pt-2 border-t border-slate-800/60">
                            {ch.lessons?.map((les: any) => (
                              <div
                                key={les.id}
                                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-indigo-500/40 transition-colors"
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-200">
                                      {les.title}
                                    </span>
                                    <span className="text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                                      {les.difficulty_level}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-400 line-clamp-1">
                                    {les.introduction}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <Link
                                    href={`/tutor?mode=video_studio&topic=${course.id}`}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
                                  >
                                    <Play size={12} />
                                    <span>Watch Video Lesson</span>
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Module Assessment & Project Footer */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs">
                      <div className="flex items-center gap-2 text-indigo-200">
                        <Award size={15} className="text-indigo-400" />
                        <span>Module Milestone: <strong>{mod.module_assessment_title}</strong></span>
                      </div>
                      <Link
                        href={`/practice`}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] text-center"
                      >
                        Launch Module Practice Sandbox
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CAPSTONE REAL-WORLD CHALLENGE */}
      {course.real_world_challenges && course.real_world_challenges.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Briefcase size={20} className="text-emerald-400" />
            <h2 className="text-xl font-bold text-white">
              University Capstone Real-World Challenge
            </h2>
          </div>

          {course.real_world_challenges.map((chal: any) => (
            <div
              key={chal.id}
              className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/30 border border-emerald-500/30 shadow-xl space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    Enterprise Capstone
                  </span>
                  <h3 className="text-lg font-black text-white mt-1">{chal.title}</h3>
                  <span className="text-xs text-slate-400">Context: {chal.company_context}</span>
                </div>
                <Link
                  href="/projects"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all shrink-0 text-center"
                >
                  Enter Project Defense
                </Link>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{chal.scenario_description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Execution Tasks:</span>
                  <ul className="space-y-1 list-disc pl-4 text-xs text-slate-200">
                    {chal.tasks?.map((t: string, idx: number) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Evaluation Constraints:</span>
                  <ul className="space-y-1 list-disc pl-4 text-xs text-slate-200">
                    {chal.constraints?.map((c: string, idx: number) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* "I DON'T KNOW WHERE I'M STUCK" DIAGNOSTIC DRAWER / MODAL */}
      {showStuckModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <HelpCircle size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    I Don&apos;t Know Where I&apos;m Stuck
                  </h3>
                  <p className="text-xs text-slate-400">
                    Multimodal AI diagnosis that pinpoints root concept gaps and recommends immediate remediation.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowStuckModal(false);
                  setStuckDiagnosis(null);
                  setStuckQuery('');
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 border border-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleDiagnoseStuck} className="space-y-3">
              <p className="text-xs text-slate-300">
                Paste any code snippet, error message, or type what is confusing you:
              </p>
              <textarea
                value={stuckQuery}
                onChange={(e) => setStuckQuery(e.target.value)}
                placeholder="e.g., I don't understand why modifying a list variable in function A changed the data in variable B..."
                rows={4}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={diagnosing || !stuckQuery.trim()}
                  className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
                >
                  {diagnosing ? 'Analyzing Cognitive Twin & Gaps...' : 'Diagnose My Root Blocker'}
                </Button>
              </div>
            </form>

            {stuckDiagnosis && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-3 text-xs animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300">Diagnosis Complete</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: {stuckDiagnosis.diagnosis_id}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <p className="text-slate-300">
                    <strong>Surface Problem:</strong> {stuckDiagnosis.surface_problem}
                  </p>
                  <p className="text-amber-200">
                    <strong>Root Concept Gap:</strong> {stuckDiagnosis.root_concept_gap}
                  </p>
                  <p className="text-slate-300">
                    <strong>Prerequisite Blocker:</strong> {stuckDiagnosis.prerequisite_blocker}
                  </p>
                  <p className="text-slate-300">
                    <strong>Action Plan:</strong> {stuckDiagnosis.remedial_action_plan}
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <Link
                    href={`/tutor?mode=video_studio&topic=${course.id}`}
                    onClick={() => setShowStuckModal(false)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                  >
                    Open Remedial Video Lesson: {stuckDiagnosis.recommended_lesson_title}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
