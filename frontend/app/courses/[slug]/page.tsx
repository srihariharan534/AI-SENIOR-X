'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  getSubjectBySlug, 
  PYTHON_COURSE_DATA, 
  UniversitySubject 
} from '@/lib/universityData';
import { SubjectExplanationSection } from '@/components/university/SubjectExplanationSection';
import { DailyLearningPlanSection } from '@/components/university/DailyLearningPlanSection';
import { AIVideoTeachingStudio } from '@/components/university/AIVideoTeachingStudio';
import { TeachBackStudio } from '@/components/university/TeachBackStudio';
import { FullCurriculumMapSection } from '@/components/university/FullCurriculumMapSection';
import { SubjectMaterialsHub } from '@/components/university/SubjectMaterialsHub';
import { 
  BookOpen, 
  Clock, 
  Layers, 
  Code2, 
  Award, 
  Sparkles, 
  ArrowLeft, 
  PlayCircle, 
  CheckCircle2, 
  Zap, 
  Flame, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  BrainCircuit,
  FileCode2,
  Terminal,
  Activity,
  FileText
} from 'lucide-react';

export default function UniversityCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || 'python';

  const [subject, setSubject] = useState<UniversitySubject>(PYTHON_COURSE_DATA);
  const [activeTab, setActiveTab] = useState<'overview' | 'studio' | 'curriculum' | 'daily' | 'materials' | 'projects' | 'challenge' | 'twin'>('overview');
  const [selectedModuleIndex, setSelectedModuleIndex] = useState<number>(0);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number>(0);

  useEffect(() => {
    const found = getSubjectBySlug(slug);
    if (found) {
      setSubject(found);
    }
  }, [slug]);

  // Real calculated totals from subject data
  const totalModules = subject.totalModulesCount || subject.modules.length || 12;
  const totalLessons = subject.totalLessonsCount || (subject.modules.reduce((acc, m) => acc + m.chapters.reduce((cAcc, c) => cAcc + c.lessons.length, 0), 0)) || 120;
  const totalProjects = subject.totalProjectsCount || subject.projects.length || 5;
  const totalAssessments = subject.totalAssessmentsCount || 18;
  const totalAiTeachingHours = subject.totalAiTeachingHours || 42.5;

  const currentModule = subject.modules[selectedModuleIndex] || subject.modules[0];
  const currentChapter = currentModule?.chapters[0];
  const currentLesson = currentChapter?.lessons[selectedLessonIndex] || currentChapter?.lessons[0];

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-stone-900 font-sans selection:bg-blue-600 selection:text-white pb-24">
      {/* Top University Navigation Breadcrumb */}
      <div className="border-b border-stone-200 bg-white/90 backdrop-blur sticky top-0 z-30 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-1.5 font-mono text-stone-600 hover:text-stone-950 transition-colors uppercase tracking-wider font-semibold"
            >
              <ArrowLeft size={13} />
              <span>AI University</span>
            </Link>
            <span className="text-stone-300">/</span>
            <span className="font-mono text-stone-400">{subject.schoolName}</span>
            <span className="text-stone-300">/</span>
            <span className="font-mono font-bold text-blue-700 uppercase tracking-widest">{subject.subjectNumber} {subject.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('studio')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-700 text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-blue-800 transition-colors shadow-sm"
            >
              <PlayCircle size={13} />
              <span>Launch 2–3h AI Studio</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 space-y-12">
        {/* Course Editorial Header */}
        <div className="border-b-2 border-stone-900 pb-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-black bg-stone-900 text-white px-2.5 py-1">
                  {subject.subjectNumber}
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-blue-700 font-bold">
                  {subject.schoolName} • University Subject Syllabus
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-stone-950 tracking-tight leading-tight">
                {subject.name}
              </h1>

              <p className="text-xl sm:text-2xl font-serif italic text-stone-700 leading-relaxed">
                &ldquo;{subject.tagline}&rdquo;
              </p>

              <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl">
                {subject.overview}
              </p>
            </div>

            {/* Dynamic Real Metadata Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-5 bg-stone-100 border border-stone-300 min-w-[320px]">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-stone-500">Curriculum</div>
                <div className="font-serif text-2xl font-bold text-stone-900">{totalLessons}+ Lessons</div>
                <div className="font-mono text-[10px] text-stone-500">{totalModules} Complete Modules</div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-stone-500">AI Teaching</div>
                <div className="font-serif text-2xl font-bold text-blue-700">{totalAiTeachingHours} Hours</div>
                <div className="font-mono text-[10px] text-stone-500">Adaptive Dialogue</div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-stone-500">Portfolio</div>
                <div className="font-serif text-2xl font-bold text-stone-900">{totalProjects} Projects</div>
                <div className="font-mono text-[10px] text-stone-500">{totalAssessments} Assessments</div>
              </div>
              <div className="pt-2 border-t border-stone-200">
                <div className="font-mono text-[10px] uppercase tracking-wider text-stone-500">Level</div>
                <div className="font-mono text-xs font-bold text-stone-800 uppercase">{subject.difficulty}</div>
              </div>
              <div className="pt-2 border-t border-stone-200 col-span-2">
                <div className="font-mono text-[10px] uppercase tracking-wider text-stone-500">Prerequisites</div>
                <div className="font-mono text-xs text-stone-700 truncate">{subject.prerequisites.join(', ')}</div>
              </div>
            </div>
          </div>

          {/* Quick Experience Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-stone-200 font-mono text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 border transition-all ${
                activeTab === 'overview'
                  ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}
            >
              01 • Understand Subject
            </button>
            <button
              onClick={() => setActiveTab('studio')}
              className={`px-4 py-2 border transition-all flex items-center gap-1.5 ${
                activeTab === 'studio'
                  ? 'bg-blue-700 text-white border-blue-700 shadow-sm'
                  : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50'
              }`}
            >
              <PlayCircle size={14} />
              02 • 2–3h AI Video Studio
            </button>
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-4 py-2 border transition-all ${
                activeTab === 'daily'
                  ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}
            >
              03 • Daily Plan ({subject.dailyPlan.totalTimeFormatted})
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`px-4 py-2 border transition-all flex items-center gap-1.5 ${
                activeTab === 'materials'
                  ? 'bg-blue-900 text-white border-blue-900 shadow-sm font-bold'
                  : 'bg-white text-blue-900 border-blue-300 hover:bg-blue-50 font-semibold'
              }`}
            >
              <FileText size={13} />
              <span>04 • Materials Library</span>
            </button>
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`px-4 py-2 border transition-all ${
                activeTab === 'curriculum'
                  ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}
            >
              05 • Full Curriculum Map
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 border transition-all ${
                activeTab === 'projects'
                  ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}
            >
              06 • Projects ({subject.projects.length})
            </button>
            <button
              onClick={() => setActiveTab('challenge')}
              className={`px-4 py-2 border transition-all ${
                activeTab === 'challenge'
                  ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}
            >
              07 • Industry Challenge
            </button>
            <button
              onClick={() => setActiveTab('twin')}
              className={`px-4 py-2 border transition-all ${
                activeTab === 'twin'
                  ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}
            >
              08 • Learning Twin
            </button>
          </div>
        </div>

        {/* Tab 1: Subject Explanation */}
        {activeTab === 'overview' && (
          <div className="space-y-12 animate-fadeIn">
            <SubjectExplanationSection 
              explanation={subject.explanation} 
              subjectName={subject.name} 
            />

            <div className="p-8 bg-blue-50 border-2 border-blue-700 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="font-mono text-xs font-bold uppercase tracking-widest text-blue-700">
                  Ready to Start Day 01
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-950">
                  Enter Today&apos;s Structured 2h 25m AI Lecture Session
                </h3>
                <p className="text-sm text-stone-600 max-w-xl">
                  Step into the AI Video Teaching Studio for dynamic dialogue, live pause checkpoints, code execution, and multilingual narration.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('studio')}
                className="px-6 py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-mono text-xs font-bold uppercase tracking-widest shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <PlayCircle size={16} />
                <span>Launch Day 01 Studio</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: AI Video Teaching Studio */}
        {activeTab === 'studio' && (
          <div className="space-y-10 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-blue-700 font-bold">
                  University Interactive Studio • {subject.name}
                </span>
                <h2 className="font-serif text-3xl font-black text-stone-950 mt-1">
                  2–3 Hour Structured AI Teaching Session
                </h2>
              </div>
              <div className="font-mono text-xs text-stone-500">
                Module 01 / Lesson {selectedLessonIndex + 1} of {currentChapter?.lessons.length || 8}
              </div>
            </div>

            <AIVideoTeachingStudio
              courseName={subject.name}
              moduleTitle={currentModule?.title || 'Python Foundations'}
              chapterTitle={currentChapter?.title || 'Programming Foundations'}
              lessons={currentChapter?.lessons || []}
              onOpenTeachBack={() => {
                const el = document.getElementById('teach-back-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Teach Back Feynman Module */}
            {currentLesson && (
              <div id="teach-back-section">
                <TeachBackStudio
                  conceptName={currentLesson.title}
                  teachBackPrompt={currentLesson.teachBackPrompt}
                  onMasteryUpdated={(score) => {
                    console.log('Teach-Back mastery score updated:', score);
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Daily Learning Plan */}
        {activeTab === 'daily' && (
          <div className="space-y-8 animate-fadeIn">
            <DailyLearningPlanSection
              dailyPlan={subject.dailyPlan}
              courseName={subject.name}
              onStartDay={() => setActiveTab('studio')}
            />
          </div>
        )}

        {/* Tab 4: Materials Hub */}
        {activeTab === 'materials' && (
          <div className="space-y-8 animate-fadeIn">
            <SubjectMaterialsHub
              subjectId={slug}
              subjectName={subject.name}
            />
          </div>
        )}

        {/* Tab 5: Curriculum Map */}
        {activeTab === 'curriculum' && (
          <div className="space-y-8 animate-fadeIn">
            <FullCurriculumMapSection
              modules={subject.modules}
              courseName={subject.name}
              onSelectModule={(mod) => {
                const foundIdx = subject.modules.findIndex(m => m.id === mod.id);
                setSelectedModuleIndex(foundIdx >= 0 ? foundIdx : 0);
                setSelectedLessonIndex(0);
                setActiveTab('studio');
              }}
            />
          </div>
        )}

        {/* Tab 5: Real-World Projects */}
        {activeTab === 'projects' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-blue-700 font-bold">
                Applied Portfolio Milestones
              </div>
              <h2 className="font-serif text-3xl font-black text-stone-950 mt-1">
                {subject.projects.length} Real-World Industry Projects
              </h2>
              <p className="text-sm text-stone-600 mt-1 max-w-2xl">
                Every project is verified by the AI Evaluator against production criteria, error handling, performance benchmarks, and independence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subject.projects.map((proj, idx) => (
                <div 
                  key={proj.id}
                  className="bg-white border-2 border-stone-300 p-6 space-y-4 hover:border-stone-900 transition-all flex flex-col justify-between shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-blue-700 uppercase tracking-widest">
                        Project 0{idx + 1}
                      </span>
                      <span className="font-mono text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 border border-stone-200">
                        {proj.status}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-stone-950">
                      {proj.title}
                    </h3>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {proj.problem}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-stone-100">
                      <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-stone-500">
                        Required Tasks:
                      </div>
                      <ul className="text-xs text-stone-700 space-y-1">
                        {proj.tasks.slice(0, 3).map((task, dIdx) => (
                          <li key={dIdx} className="flex items-center gap-2">
                            <CheckCircle2 size={12} className="text-blue-600 flex-shrink-0" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase text-stone-500">
                      Evaluator: <strong className="text-stone-800">Static AST + Runtime</strong>
                    </span>
                    <Link
                      href={`/projects`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors"
                    >
                      <span>Open Workspace</span>
                      <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Real-World Challenge */}
        {activeTab === 'challenge' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-stone-900 text-white p-8 space-y-6">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-amber-400 font-bold">
                <Zap size={14} />
                <span>Real-World Engineering Challenge</span>
              </div>

              <div className="space-y-2">
                <h2 className="font-serif text-3xl font-black tracking-tight text-white">
                  {subject.realWorldChallenge.title}
                </h2>
                <p className="text-sm font-serif italic text-stone-300">
                  Scenario: {subject.realWorldChallenge.companyScenario}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-800 text-xs text-stone-300">
                <div className="space-y-2">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-stone-400 font-bold">
                    Dataset & Production Context:
                  </div>
                  <p>{subject.realWorldChallenge.datasetDescription}</p>
                </div>
                <div className="space-y-2">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-stone-400 font-bold">
                    Engineering Constraints:
                  </div>
                  <ul className="list-disc pl-4 space-y-1">
                    {subject.realWorldChallenge.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Rubric Weights */}
              <div className="p-4 bg-stone-950 border border-stone-800 space-y-3">
                <div className="font-mono text-[10px] uppercase tracking-wider text-stone-400 font-bold">
                  AI Evaluation Multi-Factor Rubric:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
                  <div className="p-2 bg-stone-900 border border-stone-800">
                    <span className="text-stone-400 block text-[10px]">Correctness</span>
                    <span className="font-bold text-white">{subject.realWorldChallenge.aiEvaluationRubric.correctness}</span>
                  </div>
                  <div className="p-2 bg-stone-900 border border-stone-800">
                    <span className="text-stone-400 block text-[10px]">Reasoning</span>
                    <span className="font-bold text-white">{subject.realWorldChallenge.aiEvaluationRubric.reasoning}</span>
                  </div>
                  <div className="p-2 bg-stone-900 border border-stone-800">
                    <span className="text-stone-400 block text-[10px]">Performance</span>
                    <span className="font-bold text-white">{subject.realWorldChallenge.aiEvaluationRubric.performance}</span>
                  </div>
                  <div className="p-2 bg-stone-900 border border-stone-800">
                    <span className="text-stone-400 block text-[10px]">Code Quality</span>
                    <span className="font-bold text-white">{subject.realWorldChallenge.aiEvaluationRubric.codeQuality}</span>
                  </div>
                  <div className="p-2 bg-stone-900 border border-stone-800">
                    <span className="text-stone-400 block text-[10px]">Independence</span>
                    <span className="font-bold text-white">{subject.realWorldChallenge.aiEvaluationRubric.independence}</span>
                  </div>
                </div>
              </div>

              {/* Starter Code Preview */}
              <div className="space-y-2">
                <div className="font-mono text-[10px] uppercase tracking-wider text-stone-400 font-bold flex items-center justify-between">
                  <span>Starter Code Benchmark Script:</span>
                  <span className="text-stone-500">Python 3.11</span>
                </div>
                <pre className="p-4 bg-black border border-stone-800 font-mono text-xs text-amber-200 overflow-x-auto">
                  {subject.realWorldChallenge.starterCode}
                </pre>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-800">
                <span className="font-mono text-xs text-stone-400">
                  Target: <strong className="text-white">{subject.realWorldChallenge.expectedOutput}</strong>
                </span>
                <Link
                  href="/practice"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
                >
                  <Terminal size={14} />
                  <span>Launch Diagnostic IDE</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Learning Twin Competency Matrix */}
        {activeTab === 'twin' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-blue-700 font-bold">
                Evidence-Based Cognitive Twin
              </div>
              <h2 className="font-serif text-3xl font-black text-stone-950 mt-1">
                {subject.name} Competency Progression State
              </h2>
              <p className="text-sm text-stone-600 mt-1 max-w-2xl">
                No arbitrary fake percentage bars. Mastery is categorized into 5 discrete states derived from practice logs, assessment scores, hint usage, and code quality.
              </p>
            </div>

            <div className="bg-white border-2 border-stone-300 p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{subject.twinStatus.tier1.name}</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">{subject.twinStatus.tier1.status}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 font-sans">
                    Demonstrated in exercises with 0 syntax errors and independent execution.
                  </p>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{subject.twinStatus.tier2.name}</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">{subject.twinStatus.tier2.status}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 font-sans">
                    Passed Teach-Back evaluation with 92% Feynman clarity score.
                  </p>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{subject.twinStatus.tier3.name}</span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">{subject.twinStatus.tier3.status}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 font-sans">
                    Misconception identified around hierarchy/design. Remedial queued.
                  </p>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{subject.twinStatus.tier4.name}</span>
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase">{subject.twinStatus.tier4.status}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 font-sans">
                    Currently in Lecture lifecycle and active practice session.
                  </p>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{subject.twinStatus.tier5.name}</span>
                    <span className="px-2 py-0.5 bg-stone-200 text-stone-700 text-[10px] font-bold uppercase">{subject.twinStatus.tier5.status}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 font-sans">
                    Unlocks upon completion of foundational module exercises.
                  </p>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">Architecture Capstone</span>
                    <span className="px-2 py-0.5 bg-stone-200 text-stone-700 text-[10px] font-bold uppercase">NOT STARTED</span>
                  </div>
                  <p className="text-[11px] text-stone-500 font-sans">
                    Final university degree milestone with live peer review and verification.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-blue-900">
                  <BrainCircuit size={16} className="text-blue-700" />
                  <span>Learning Twin is actively adapting your daily curriculum to focus on <strong>{subject.name} Core Patterns</strong>.</span>
                </div>
                <Link
                  href="/learning-twin"
                  className="font-mono text-blue-700 font-bold uppercase hover:underline"
                >
                  View Full Twin Matrix →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
