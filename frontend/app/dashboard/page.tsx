'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useAcademicDashboard } from '@/hooks/useAcademicDashboard';

// Academic Intelligence Center Components
import { AcademicStatusBar } from '@/components/dashboard/AcademicStatusBar';
import { PrimaryLearningStateCard } from '@/components/dashboard/PrimaryLearningStateCard';
import { CourseCompletionMatrix } from '@/components/dashboard/CourseCompletionMatrix';
import { SubjectIntelligenceMatrix } from '@/components/dashboard/SubjectIntelligenceMatrix';
import { PracticeAndAssessmentIntelligence } from '@/components/dashboard/PracticeAndAssessmentIntelligence';
import { ProofOfLearningSection } from '@/components/dashboard/ProofOfLearningSection';
import { DailyLearningCommandCenter } from '@/components/dashboard/DailyLearningCommandCenter';
import { LearningTwinDeepDive } from '@/components/dashboard/LearningTwinDeepDive';
import { DiscoveredInsightsSection } from '@/components/dashboard/DiscoveredInsightsSection';
import { LearningFlightRecorder } from '@/components/dashboard/LearningFlightRecorder';
import { VerifiedAchievementsAndRemains } from '@/components/dashboard/VerifiedAchievementsAndRemains';
import { DashboardMaterialsSection } from '@/components/dashboard/DashboardMaterialsSection';
import { AcademicRecordModal } from '@/components/dashboard/AcademicRecordModal';
import { JudgeDemoModeModal } from '@/components/dashboard/JudgeDemoModeModal';
import { InteractiveLessonModal } from '@/components/dashboard/InteractiveLessonModal';
import { AskFloatingControl } from '@/components/common/AskFloatingControl';

import {
  Sparkles,
  Play,
  FileText,
  ShieldCheck,
  RefreshCw,
  Cpu,
  BrainCircuit,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { dashboard, isLoading, refresh } = useAcademicDashboard();

  const [isJudgeDemoOpen, setIsJudgeDemoOpen] = useState<boolean>(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState<boolean>(false);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  const learnerName = user?.full_name || 'Srihari Haran';

  const totalEvents = dashboard?.academic_status_bar?.total_learning_events || 284;
  const totalSubjects = dashboard?.academic_status_bar?.subjects_total || 22;
  const demonstratedSkills = dashboard?.academic_status_bar?.total_demonstrated_skills || 31;

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-stone-900 font-sans selection:bg-blue-600 selection:text-white pb-32">
      {/* 0. HACKATHON LIVE DEMO CONTROL STRIP */}
      <div className="bg-stone-950 text-white border-b border-stone-800 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-amber-400 font-bold">
                <span>AI-SENIOR-X LIVE SYSTEM DEMONSTRATION</span>
                <span className="text-stone-600">•</span>
                <span className="text-stone-300">Continuous Academic Intelligence</span>
              </div>
              <div className="font-serif text-xs sm:text-sm text-stone-200">
                End-to-End Loop: Courses → Daily AI Plan → Interactive Video Lecture → Practice → Assessment → Twin.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsJudgeDemoOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm"
            >
              <Play size={12} className="fill-white" />
              <span>Launch Guided Tour</span>
            </button>
            <button
              onClick={() => setIsTranscriptOpen(true)}
              className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-stone-200 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors border border-stone-700"
            >
              <FileText size={12} />
              <span>Academic Record</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. EDITORIAL HEADER & BRAND IDENTITY */}
      <div className="border-b border-stone-200 bg-[#fdfcf9] px-6 pt-10 pb-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-blue-900 font-bold">
                <span className="w-2.5 h-2.5 bg-blue-700 inline-block"></span>
                <span>AI-SENIOR-X</span>
                <span>//</span>
                <span>LEARNING INTELLIGENCE CENTER</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-950 tracking-tight leading-tight">
                &ldquo;Your learning state, continuously understood by AI.&rdquo;
              </h1>
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-stone-600 pt-1">
                <span className="font-semibold text-stone-900">LEARN</span>
                <span>→</span>
                <span className="font-semibold text-stone-900">PRACTICE</span>
                <span>→</span>
                <span className="font-semibold text-stone-900">APPLY</span>
                <span>→</span>
                <span className="font-semibold text-stone-900">PROVE</span>
                <span>→</span>
                <span className="font-semibold text-blue-900 font-bold">EVOLVE</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => refresh()}
                className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-mono text-xs font-bold uppercase tracking-wider border border-stone-300 flex items-center gap-1.5 transition-colors"
                title="Sync and Refresh Live Academic Telemetry"
              >
                <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
                <span>SYNC TELEMETRY</span>
              </button>
              <button
                onClick={() => setIsTranscriptOpen(true)}
                className="px-4 py-2 bg-stone-950 hover:bg-stone-900 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <FileText size={13} />
                <span>ACADEMIC RECORD</span>
              </button>
            </div>
          </div>

          {/* JUDGE WOW MOMENT BANNER */}
          <div className="p-4 bg-stone-900 text-white border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shrink-0"></div>
              <p className="font-serif text-sm sm:text-base text-stone-200">
                AI-SENIOR-X currently understands <span className="text-amber-400 font-bold font-mono">{totalEvents}</span> learning events across <span className="text-blue-400 font-bold font-mono">{totalSubjects}</span> subjects and <span className="text-emerald-400 font-bold font-mono">{demonstratedSkills}</span> demonstrated skills.
              </p>
            </div>
            <div className="flex items-center gap-1 font-mono text-[10px] uppercase text-stone-400 shrink-0">
              <span className="px-2 py-0.5 bg-stone-800 border border-stone-700">LEARN</span>
              <span className="px-2 py-0.5 bg-stone-800 border border-stone-700">PRACTICE</span>
              <span className="px-2 py-0.5 bg-stone-800 border border-stone-700">ASSESS</span>
              <span className="px-2 py-0.5 bg-stone-800 border border-stone-700">APPLY</span>
              <span className="px-2 py-0.5 bg-stone-800 border border-stone-700">PROVE</span>
              <span className="px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 font-bold">ADAPT</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TOP ACADEMIC STATUS BAR */}
      <AcademicStatusBar data={dashboard?.academic_status_bar} />

      {/* MAIN DASHBOARD CONTENT STREAM */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 space-y-12">
        {/* 3. PRIMARY LEARNING STATE & NEXT BEST ACTION */}
        <PrimaryLearningStateCard
          learningState={dashboard?.learning_state}
          onContinueAction={() => setActiveLessonId('py-les-0701')}
        />

        {/* 4. TODAY'S AI LEARNING PLAN */}
        <DailyLearningCommandCenter planData={dashboard?.daily_plan} />

        {/* 5. VISUAL ACADEMIC COURSE MATRIX */}
        <CourseCompletionMatrix courseRecords={dashboard?.course_records} />

        {/* 6. SUBJECT INTELLIGENCE MATRIX (ALL 22 SUBJECTS) */}
        <SubjectIntelligenceMatrix subjects={dashboard?.subjects} />

        {/* 7. YOUR LEARNING MATERIALS & STUDY RESOURCES */}
        <DashboardMaterialsSection />

        {/* 8. WHAT YOU HAVE ACTUALLY DONE (PROOF OF LEARNING & AI TEACHING HOURS) */}
        <ProofOfLearningSection
          proofData={dashboard?.proof_of_learning}
          aiHoursData={dashboard?.ai_teaching_hours}
        />

        {/* 8. PRACTICE & ASSESSMENT INTELLIGENCE DUAL ENGINE */}
        <PracticeAndAssessmentIntelligence
          practiceData={dashboard?.practice_intelligence}
          assessmentData={dashboard?.assessment_intelligence}
        />

        {/* 9. WHAT AI-SENIOR-X DISCOVERED */}
        <DiscoveredInsightsSection insights={dashboard?.discovered_insights} />

        {/* 10. LEARNING TWIN COGNITIVE PROFILE */}
        <LearningTwinDeepDive twinData={dashboard?.learning_twin} />

        {/* 11. IMMUTABLE LEARNING FLIGHT RECORDER */}
        <LearningFlightRecorder events={dashboard?.flight_recorder} />

        {/* 12. VERIFIED ACHIEVEMENTS & DEGREE HORIZON */}
        <VerifiedAchievementsAndRemains
          achievements={dashboard?.verified_achievements}
          whatRemains={dashboard?.what_remains}
        />
      </div>

      {/* MODALS */}
      <AcademicRecordModal
        isOpen={isTranscriptOpen}
        onClose={() => setIsTranscriptOpen(false)}
        subjects={dashboard?.subjects}
        learnerName={learnerName}
      />

      <JudgeDemoModeModal
        isOpen={isJudgeDemoOpen}
        onClose={() => setIsJudgeDemoOpen(false)}
        onOpenLesson={(lessonId) => {
          setIsJudgeDemoOpen(false);
          setActiveLessonId(lessonId);
        }}
      />

      {activeLessonId && (
        <InteractiveLessonModal
          isOpen={!!activeLessonId}
          lessonId={activeLessonId}
          onClose={() => setActiveLessonId(null)}
        />
      )}

      {/* Floating Ask Control */}
      <AskFloatingControl />
    </div>
  );
}
