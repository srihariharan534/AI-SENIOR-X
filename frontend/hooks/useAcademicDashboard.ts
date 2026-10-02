'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export interface AcademicStatusBarData {
  courses_completed: number;
  courses_total: number;
  subjects_active: number;
  subjects_mastered: number;
  subjects_total: number;
  lessons_completed: number;
  lessons_total: number;
  ai_sessions_completed: number;
  ai_sessions_total: number;
  practice_completed: number;
  practice_total: number;
  assessments_completed: number;
  assessments_total: number;
  projects_completed: number;
  projects_total: number;
  challenges_completed: number;
  challenges_total: number;
  certificates_issued: number;
  total_learning_events: number;
  total_demonstrated_skills: number;
}

export interface LearningStateData {
  current_level: string;
  current_path: string;
  current_course: string;
  current_subject_id: string;
  current_module: string;
  current_lesson: string;
  current_learning_mode: string;
  next_best_action_title: string;
  next_best_action_reason: string;
  next_best_action_evidence: string;
  next_best_action_time: string;
  next_best_action_url: string;
}

export interface CourseRecordData {
  id: string;
  name: string;
  school_name: string;
  school_id: string;
  subjects_count: number;
  subjects_completed: number;
  lessons_total: number;
  lessons_completed: number;
  practice_total: number;
  practice_completed: number;
  assessments_total: number;
  assessments_completed: number;
  projects_total: number;
  projects_completed: number;
  challenges_total: number;
  challenges_completed: number;
  ai_teaching_hours: string;
  status: 'COMPLETED' | 'IN PROGRESS' | 'LEARNING' | 'NOT STARTED';
  primary_skills: string[];
}

export interface SubjectStateData {
  id: string;
  name: string;
  school_id: string;
  school_name: string;
  headline: string;
  status: 'COMPLETED' | 'DEMONSTRATED' | 'ASSESSMENT' | 'PROJECT' | 'PRACTICING' | 'LEARNING' | 'NOT STARTED';
  modules_total: number;
  modules_completed: number;
  lessons_total: number;
  lessons_completed: number;
  ai_teaching_hours: string;
  practice_completed: number;
  practice_total: number;
  assessments_completed: number;
  assessments_total: number;
  projects_completed: number;
  projects_total: number;
  challenges_completed: number;
  challenges_total: number;
  twin_skill_state: string;
  next_lesson_title: string;
  primary_skills: string[];
}

export interface DashboardOverviewData {
  academic_status_bar: AcademicStatusBarData;
  learning_state: LearningStateData;
  course_records: CourseRecordData[];
  subjects: SubjectStateData[];
  practice_intelligence: {
    total_practice: number;
    completed: number;
    in_progress: number;
    needs_review: number;
    accuracy_rate: number;
    subject_breakdown: Array<{ subject: string; completed: number; accuracy: number }>;
  };
  assessment_intelligence: {
    completed: number;
    pending: number;
    reassessments_required: number;
    mastered: number;
    needs_improvement: number;
    average_score: number;
    subject_breakdown: Array<{ subject: string; completed: number; passed: number; reassessment: number; avg_score: number }>;
  };
  proof_of_learning: {
    subjects_completed: number;
    practice_sessions: number;
    assessments: number;
    projects: number;
    real_world_challenges: number;
    ai_teaching_hours: string;
    concepts_studied: number;
    concepts_demonstrated: number;
    evidence_items_count: number;
    portfolio_ready_projects: Array<{ id: string; title: string; subject: string; verification: string; evidence_tag: string; date: string }>;
  };
  ai_teaching_hours: {
    total_hours_formatted: string;
    this_week_formatted: string;
    this_month_formatted: string;
    subject_breakdown: Array<{ subject: string; hours: string; seconds: number }>;
  };
  daily_plan: {
    items: Array<{ step_number: string; action_type: 'WATCH' | 'PRACTICE' | 'ASSESS' | 'APPLY'; title: string; duration_minutes: number; subject_name: string; target_url: string }>;
    total_duration_formatted: string;
    learning_twin_rationale: string;
  };
  learning_twin: {
    known: Array<{ skill: string; status: string; evidence: string }>;
    developing: Array<{ skill: string; status: string; evidence: string }>;
    needs_practice: Array<{ skill: string; status: string; evidence: string }>;
    ready_for: Array<{ skill: string; status: string; evidence: string }>;
    overall_mastery_index: number;
  };
  discovered_insights: Array<{ id: string; statement: string; category: string; evidence_tag: string; actionable_recommendation: string }>;
  flight_recorder: Array<{ id: string; timestamp_formatted: string; relative_time: string; date_group: string; title: string; event_type: string; subject_name: string; badge_label: string }>;
  verified_achievements: Array<{ id: string; title: string; subject_name: string; category: string; verified_date: string; verification_hash: string; credential_url: string }>;
  what_remains: {
    subjects_remaining: number;
    courses_in_progress: number;
    assessments_pending: number;
    projects_pending: number;
    challenges_pending: number;
    next_milestone_title: string;
    next_milestone_target: string;
    path_url: string;
  };
}

export function useAcademicDashboard() {
  const [data, setData] = useState<DashboardOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getDashboardOverview();
      if (res.data) {
        setData(res.data);
      }
    } catch (err: any) {
      console.warn('Backend overview fetch fallback to local intelligence cache:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    dashboard: data,
    isLoading,
    error,
    refresh: fetchDashboard,
  };
}
