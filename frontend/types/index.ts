/**
 * AI-SENIOR-X Shared TypeScript Type Definitions
 * Matches backend Pydantic schemas and Multi-Agent / Learning Twin interfaces
 */

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface LearnerProfile {
  id: string;
  user_id: string;
  grade_level: string;
  preferred_language: string;
  learning_style: string;
  target_goals: Record<string, unknown>;
  mastery_scores: Record<string, number>;
  cognitive_twin_state: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  username?: string;
  full_name: string;
  role: 'learner' | 'tutor' | 'admin';
  preferred_language?: string;
  learning_goal?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  learner_profile?: LearnerProfile;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

// Curriculum & Knowledge Graph
export interface TopicNode {
  id: string;
  name?: string;
  title?: string;
  pillar?: string;
  subject: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'beginner' | 'intermediate' | 'advanced' | string;
  prerequisites: string[];
  estimated_duration_minutes?: number;
  estimated_minutes?: number;
  learning_objectives?: string[];
  concepts?: string[];
  key_concepts?: string[];
  skills?: string[];
  metadata?: Record<string, unknown>;
}

export interface ReadinessEvaluation {
  target_topic_id: string;
  is_ready: boolean;
  readiness_score: number;
  missing_prerequisites: string[];
  mastered_prerequisites: string[];
  recommendation: string;
}

export interface MappedTopicResult {
  pillar?: string;
  topic_id: string;
  topic_title: string;
  subject: string;
  confidence: number;
  matched_concepts: string[];
  prerequisites: string[];
}

export interface TaxonomySubject {
  name: string;
  topic_count: number;
  total_minutes: number;
}

export interface PillarDetail {
  pillar: string;
  subjects: TaxonomySubject[];
  total_topics: number;
  total_minutes: number;
}

export interface TaxonomyResponse {
  pillars: PillarDetail[];
  total_pillars: number;
  total_subjects: number;
  total_topics: number;
}

// Learning Twin & Cognitive State
export interface ConceptMastery {
  concept_id: string;
  mastery_score: number; // 0.0 - 1.0
  mastery_level: 'NOVICE' | 'DEVELOPING' | 'PROFICIENT' | 'MASTERY';
  confidence_rating: number; // 0.0 - 1.0
  decay_factor: number;
  last_practiced_at?: string;
  interaction_count: number;
}

export interface KnowledgeState {
  subject_mastery: Record<string, number>;
  concepts: Record<string, ConceptMastery>;
}

export interface SkillCompetency {
  skill_id: string;
  title: string;
  subject: string;
  proficiency: number; // 0.0 - 1.0
  is_strength: boolean;
  is_weakness: boolean;
  related_concepts: string[];
  prerequisite_blockers: string[];
}

export interface LearningHistoryEvent {
  event_id: string;
  timestamp: string;
  event_type: 'assessment' | 'practice' | 'tutor' | 'misconception' | 'completion' | string;
  topic_id: string;
  concept_id: string;
  score?: number;
  details?: Record<string, unknown>;
}

export interface Misconception {
  id: string;
  learner_profile_id?: string;
  concept_key: string;
  misconception_tag: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | string;
  status: 'active' | 'resolved' | string;
  remediation_advice?: string;
  detected_at?: string;
  resolved_at?: string;
}

export interface LearningTwinSummary {
  learner_id: string;
  user_id: string;
  concepts_tracked_count: number;
  overall_average_mastery: number;
  skills_count: number;
  strengths: string[];
  weaknesses: string[];
  active_misconceptions_count: number;
  total_learning_events: number;
  subject_mastery: Record<string, number>;
}

// AI Recommendations & Paths
export interface DynamicMilestone {
  topic_id: string;
  title: string;
  reason: string;
  estimated_duration_minutes: number;
  readiness_status: 'ready' | 'needs_prerequisites' | 'mastered';
}

export interface DynamicLearningPath {
  target_topic_id: string;
  estimated_total_minutes: number;
  milestones: DynamicMilestone[];
  generated_at: string;
}

export interface RecommendationAction {
  action_type: 'LESSON' | 'PRACTICE' | 'REVISION' | 'CHALLENGE';
  topic_id: string;
  concept_id?: string;
  title: string;
  reason: string;
  difficulty: string;
  estimated_minutes: number;
  priority_score: number;
}

// AI Missions & Quests
export interface MissionTask {
  id: string;
  title: string;
  description: string;
  is_completed: boolean;
  target_concept: string;
}

export interface Mission {
  id: string;
  title: string;
  subject: string;
  topic_id?: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  xp_reward: number;
  tasks: MissionTask[];
  is_completed: boolean;
  progress_percentage: number;
  created_at: string;
}

// AI Tutor & Interactive Dialogue
export type TutorPedagogyMode =
  | 'EXPLAIN_SIMPLY'
  | 'DEEP_DIVE'
  | 'GIVE_EXAMPLE'
  | 'ANALOGY'
  | 'QUIZ_ME'
  | 'PRACTICE'
  | 'FIX_MISTAKE';

export interface TutorSession {
  id: string;
  user_id: string;
  subject: string;
  topic_id?: string;
  is_active: boolean;
  started_at: string;
  ended_at?: string;
  total_turns: number;
}

export interface TutorMessage {
  id: string;
  sender: 'user' | 'tutor' | 'system';
  content: string;
  pedagogy_strategy?: string;
  detected_emotion?: string;
  concept_cards?: string[];
  suggested_follow_ups?: string[];
  sources?: string[];
  code_snippet?: string;
  created_at: string;
}

export interface TutorInteractionResponse {
  session_id: string;
  response_text?: string;
  reply?: string;
  pedagogy_strategy?: string;
  detected_emotion?: string;
  suggested_followups?: string[];
  suggested_follow_ups?: string[];
  concept_references?: string[];
  misconceptions_detected?: string[];
  confidence_score?: number;
  mastery_delta?: number;
  twin_updated?: boolean;
}

// Practice & Code Exercises
export interface TestCase {
  input: string;
  expected_output: string;
  description?: string;
}

export interface PracticeExercise {
  id: string;
  topic_id: string;
  concept_id: string;
  title: string;
  instructions: string;
  starter_code: string;
  language: string;
  difficulty: number;
  hints: string[];
  test_cases: TestCase[];
}

export interface PracticeGradingResult {
  is_correct: boolean;
  score: number;
  feedback: string;
  misconception_detected?: Misconception;
  passed_tests: number;
  total_tests: number;
  detailed_logs?: string;
  suggested_next_step?: string;
}

// Assessment & Exam Mode
export interface QuestionOption {
  key: string;
  text: string;
}

export interface Question {
  id: string;
  assessment_id?: string;
  prompt: string;
  question_type: 'multiple_choice' | 'code' | 'open_text';
  options?: Record<string, string>;
  points: number;
  difficulty: string;
  concept_key?: string;
}

export interface Assessment {
  id: string;
  learner_profile_id: string;
  title: string;
  subject: string;
  difficulty: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  total_score: number;
  max_score: number;
  created_at: string;
  questions?: Question[];
}

export interface AnswerResult {
  question_id: string;
  is_correct: boolean;
  score_awarded: number;
  correct_answer?: string;
  explanation: string;
  misconceptions_flagged: string[];
}

// Voice Session
export interface VoiceTurnResponse {
  session_id: string;
  transcribed_text: string;
  response_text: string;
  spoken_text: string;
  audio_bytes_base64: string;
  duration_seconds: number;
  was_interrupted: boolean;
}

// Progress Overview
export interface ProgressRecord {
  id: string;
  learner_profile_id: string;
  subject: string;
  module_id: string;
  mastery_level: number;
  completed_missions_count: number;
  streak_days: number;
  total_time_spent_minutes: number;
  last_activity_at: string;
}

export interface ProgressOverview {
  total_study_minutes: number;
  current_streak_days: number;
  overall_mastery: number;
  completed_missions: number;
  active_misconceptions_count: number;
  subject_mastery: Record<string, number>;
  recent_progress: ProgressRecord[];
  unresolved_misconceptions: Misconception[];
}

export interface HealthStatus {
  status: string;
  service: string;
  version: string;
  environment: string;
}

// ==========================================
// Real-World Problem -> Solution Layer Types
// ==========================================

export interface RealWorldConstraint {
  constraint_type: string;
  description: string;
  threshold?: string;
}

export interface ProjectStep {
  step_number: number;
  title: string;
  description: string;
  guidance: string;
  hints?: string[];
}

export interface ProjectDefinition {
  id: string;
  title: string;
  domain: string;
  difficulty: string;
  estimated_time_minutes: number;
  prerequisites: string[];
  skills_demonstrated: string[];
  problem_statement: string;
  business_context: string;
  dataset_description?: string;
  starter_template: string;
  sample_solution?: string;
  constraints: RealWorldConstraint[];
  steps: ProjectStep[];
  evaluation_criteria: string[];
}

export interface ProjectSubmission {
  project_id: string;
  phase: string;
  solution_code: string;
  plan_explanation?: string;
  architectural_notes?: string;
  hints_used: number;
  time_spent_seconds: number;
}

export interface ProjectEvaluation {
  submission_id: string;
  project_id: string;
  passed: boolean;
  score: number;
  rubric_scores: {
    functional_correctness: number;
    architectural_reasoning: number;
    performance_under_scale: number;
    edge_case_robustness: number;
    code_quality: number;
  };
  feedback_summary: string;
  strengths: string[];
  identified_weaknesses: string[];
  detected_misconceptions: string[];
  suggested_improvements: string[];
  next_action: string;
  evidence_generated: boolean;
  evidence_badge?: string;
}

export interface PortfolioEvidenceRecord {
  id: string;
  learner_id: string;
  project_id: string;
  project_title: string;
  domain: string;
  completed_at: string;
  skills_demonstrated: string[];
  evidence_metrics: Record<string, any>;
  summary_of_work: string;
  score: number;
  verification_hash: string;
}

export interface DecisionOption {
  option_id: string;
  title: string;
  description: string;
  tradeoffs: {
    scalability: string;
    cost: string;
    reliability: string;
    complexity: string;
    maintainability: string;
  };
  is_optimal_for_context: boolean;
}

export interface ScenarioDefinition {
  id: string;
  title: string;
  domain: string;
  difficulty: string;
  scenario_prompt: string;
  production_context: string;
  constraints: string[];
  options: DecisionOption[];
  reasoning_prompt: string;
}

export interface DecisionEvaluationResponse {
  scenario_id: string;
  selected_option_id: string;
  is_optimal: boolean;
  decision_score: number;
  reasoning_score: number;
  dimension_scores: {
    scalability: number;
    cost_awareness: number;
    reliability: number;
    complexity_management: number;
    maintainability: number;
  };
  evaluation_feedback: string;
  key_tradeoff_insight: string;
  next_action_recommendation: string;
}

export interface SkillReadinessEvidence {
  skill_name: string;
  status: 'Strong' | 'Developing' | 'Needs practice' | 'Needs evidence';
  demonstrated_evidence: string[];
  missing_evidence: string[];
  exercises_completed: number;
  independently_solved: number;
  hints_required: number;
  real_world_tasks_completed: number;
  last_assessed: string;
  actionable_cta: string;
}

export interface JobReadinessProfile {
  learner_id: string;
  updated_at: string;
  career_target: string;
  skills: SkillReadinessEvidence[];
  portfolio_projects_count: number;
  total_verified_evidence_items: number;
  next_recommended_milestone: string;
}

export interface ExplainableRecommendation {
  id: string;
  what: string;
  why: string;
  evidence: string[];
  prerequisite_context?: string;
  estimated_effort_minutes: number;
  next_action: string;
  action_type: string;
  action_target_id: string;
  user_override_available: boolean;
}

export interface RecoveryDiagnosisResponse {
  failed_concept: string;
  root_issue: string;
  detected_misconception: string;
  missing_prerequisite: string;
  explanation: string;
  targeted_practice_exercise_id: string;
  targeted_practice_prompt: string;
  starter_code?: string;
  step_actions: string[];
}

// Multimodal Doubt & Teaching Intelligence
export interface DiagramNode {
  id: string;
  label: string;
  shape?: 'rectangle' | 'circle' | 'diamond' | 'pill' | string;
  category?: 'input' | 'process' | 'output' | 'decision' | 'formula' | string;
}

export interface DiagramEdge {
  from_node: string;
  to_node: string;
  label?: string;
}

export interface VisualDiagramSpec {
  diagram_type: 'flowchart' | 'tree' | 'architecture' | 'venn' | 'graph' | 'state_machine' | string;
  title: string;
  description?: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  mermaid_code?: string;
}

export interface UnderstandingCheck {
  question_id: string;
  question: string;
  options?: string[];
  correct_option_index?: number;
  expected_short_answer?: string;
  rubric?: string;
  hint?: string;
}

export interface MultimodalDoubtRequest {
  user_id?: string;
  text_question?: string;
  image_data_base64?: string;
  image_url?: string;
  code_snippet?: string;
  code_language?: string;
  voice_transcript?: string;
  current_topic?: string;
  explanation_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | string;
  preferred_strategy?: string;
  previous_doubt_id?: string;
  why_chain_depth?: number;
}

export interface MultimodalDoubtResponse {
  doubt_id: string;
  classification: string;
  concept: string;
  why_it_matters: string;
  prerequisites_required: string[];
  prerequisite_gap_detected: boolean;
  misconception_identified?: string | null;
  teaching_strategy_used: string;
  explanation_level: string;
  explanation: string;
  step_by_step_breakdown: string[];
  worked_example?: string | null;
  real_world_application?: string | null;
  visual_diagram?: VisualDiagramSpec | null;
  understanding_check?: UnderstandingCheck | null;
  recommended_next_step: string;
  why_chain_depth: number;
  is_uncertain: boolean;
  uncertainty_clarification_prompt?: string | null;
  citations?: Array<{
    document_id: string;
    title: string;
    page: number;
    section: string;
    excerpt: string;
  }>;
}

export interface DocumentUploadResponse {
  document_id: string;
  title: string;
  subject: string;
  total_chunks_indexed: number;
  extracted_topics: string[];
  page_count: number;
  status: string;
}

export interface DocumentTeachResponse {
  document_id: string;
  query: string;
  targeted_lesson: string;
  key_concepts: string[];
  prerequisites_reviewed: string[];
  learner_customized_focus: string;
  citations: Array<{
    document_id: string;
    title: string;
    page: number;
    section: string;
    excerpt: string;
  }>;
  suggested_practice_questions: string[];
}

export interface CodeMentorResponse {
  language: string;
  help_mode: 'hint' | 'step_by_step' | 'full_solution' | string;
  error_type?: string | null;
  root_cause_explanation: string;
  underlying_concept: string;
  hint?: string | null;
  step_by_step_fix: string[];
  corrected_code?: string | null;
  why_fix_works?: string | null;
  similar_challenge: {
    title: string;
    description: string;
    starter_code?: string;
  };
}

export interface ProjectMilestone {
  milestone_number: number;
  title: string;
  objective: string;
  deliverables: string[];
  estimated_hours: number;
  prerequisites: string[];
}

export interface ProjectMentorResponse {
  project_title: string;
  domain: string;
  learner_skill_level: string;
  scope_summary: string;
  recommended_tech_stack: string[];
  architecture_overview: string;
  milestones: ProjectMilestone[];
  debugging_diagnosis?: {
    root_cause: string;
    affected_component: string;
    pedagogical_explanation: string;
    remediation_steps: string[];
  } | null;
  next_action_recommendation: string;
}

export interface InterviewTurnResponse {
  session_id: string;
  interview_mode: string;
  current_question_number: number;
  current_question: string;
  evaluation?: {
    score: number;
    strengths: string[];
    gaps_identified: string[];
    pedagogical_explanation: string;
    exemplary_model_answer: string;
  } | null;
  follow_up_question?: string | null;
  is_session_complete: boolean;
  overall_feedback?: string | null;
}

// ==========================================
// Skill Intelligence & Proof-of-Skill Types
// ==========================================
export type SkillStateType = 'UNKNOWN' | 'INTRODUCED' | 'DEVELOPING' | 'GUIDED' | 'DEMONSTRATED' | 'APPLIED' | 'RETAINED';

export type IndependenceLevelType = 'FULL_GUIDANCE' | 'PARTIAL_GUIDANCE' | 'HINT' | 'MINIMAL_HINT' | 'INDEPENDENT';

export type BlockerCategoryType =
  | 'CONCEPT_GAP'
  | 'PREREQUISITE_GAP'
  | 'MISCONCEPTION'
  | 'PROCEDURAL_GAP'
  | 'REASONING_GAP'
  | 'APPLICATION_GAP'
  | 'RETENTION_GAP'
  | 'CONFIDENCE_GAP'
  | 'TRANSFER_GAP';

export interface SkillEvidenceItem {
  evidence_id: string;
  learner_id: string;
  skill_id: string;
  skill_name: string;
  concept_id: string;
  task_id?: string;
  challenge_id?: string;
  source_type: 'drill' | 'challenge' | 'real_world_task' | 'project' | 'teach_back' | 'delayed_test' | 'transfer_test' | string;
  difficulty: string;
  correctness: number;
  independence: IndependenceLevelType;
  hint_usage_count: number;
  reasoning_quality: number;
  application_level: string;
  retention_status?: string;
  transfer_context?: string;
  summary: string;
  verified_at: string;
  confidence: number;
  evidence_metadata?: Record<string, unknown>;
}

export interface SkillDimensionScores {
  knowledge: string;
  problem_solving: string;
  practical_application: string;
  independent_implementation: string;
  debugging: string;
  retention: string;
}

export interface SkillTimelineEvent {
  timestamp: string;
  event_date: string;
  state_reached: SkillStateType;
  trigger_event: string;
  evidence_ref_id?: string;
}

export interface SkillDetail {
  skill_id: string;
  skill_name: string;
  domain: string;
  current_state: SkillStateType;
  state_reasoning: string;
  dimensions: SkillDimensionScores;
  evidence_count_total: number;
  independent_solutions_count: number;
  hints_required_count: number;
  real_world_challenges_count: number;
  projects_completed_count: number;
  retention_score_pct: number;
  demonstrated_evidence: SkillEvidenceItem[];
  weak_areas: string[];
  next_recommended_action: string;
  timeline: SkillTimelineEvent[];
  dependencies: string[];
}

export interface ProofOfSkillRecord {
  proof_id: string;
  skill_id: string;
  skill_name: string;
  domain: string;
  verified_status: string;
  verified_date: string;
  capabilities_demonstrated: string[];
  evidence_summary: Record<string, unknown>;
  verifiable_hash: string;
  citations_and_tasks: string[];
}

export interface RoleSkillRequirement {
  skill_id: string;
  skill_name: string;
  required_state: SkillStateType;
  current_state: SkillStateType;
  is_met: boolean;
  gap_severity: 'None' | 'Low' | 'Moderate' | 'Critical' | string;
  recommended_challenge_title?: string;
}

export interface RoleGapAnalysis {
  target_role: string;
  readiness_pct: number;
  is_job_ready: boolean;
  total_skills_required: number;
  skills_demonstrated: number;
  critical_gaps: string[];
  skill_breakdown: RoleSkillRequirement[];
  next_best_action_challenge: string;
}

export interface SkillIntelligenceProfile {
  learner_id: string;
  learner_name: string;
  updated_at: string;
  skills: SkillDetail[];
  target_role: string;
  target_role_analysis: RoleGapAnalysis;
  proof_records: ProofOfSkillRecord[];
  total_verified_evidence_count: number;
  overall_independence_rate_pct: number;
}

export interface TeachBackRequest {
  learner_id?: string;
  concept_id: string;
  concept_title: string;
  learner_explanation: string;
  modality?: string;
}

export interface TeachBackResponse {
  concept_id: string;
  concept_title: string;
  is_conceptually_correct: boolean;
  conceptual_score: number;
  core_ideas_understood: string[];
  missing_critical_aspects: string[];
  detected_misconceptions: string[];
  pedagogical_feedback: string;
  encouraging_remediation: string;
  reteach_summary?: string;
  next_verification_action: string;
  evidence_logged: boolean;
  updated_skill_state?: SkillStateType;
}

export interface LearningBlockerRequest {
  learner_id?: string;
  input_text: string;
  image_base64?: string;
  code_snippet?: string;
  current_topic: string;
  attempted_task?: string;
}

export interface LearningBlockerResponse {
  blocker_type: BlockerCategoryType;
  blocker_title: string;
  blocker_diagnosis: string;
  confidence_level: string;
  root_cause_explanation: string;
  missing_prerequisites: string[];
  detected_misconception?: string;
  actionable_remediation_steps: string[];
  recommended_diagnostic: string;
  remediation_resource_url?: string;
}

export interface ChallengeSubmissionRequest {
  learner_id?: string;
  challenge_id: string;
  skill_id: string;
  sql_or_code_submission: string;
  reasoning_explanation: string;
  business_recommendation?: string;
  time_spent_seconds?: number;
  hints_used?: number;
  independence?: IndependenceLevelType;
}

export interface ChallengeEvaluationResponse {
  challenge_id: string;
  skill_id: string;
  is_verified_demonstrated: boolean;
  overall_score: number;
  criteria_scores: Record<string, number>;
  detailed_evaluation_feedback: string;
  strengths_observed: string[];
  areas_for_refinement: string[];
  proof_record_generated?: ProofOfSkillRecord;
  updated_skill_state: SkillStateType;
  next_recommended_milestone: string;
}

// ==========================================
// Verified Learning Certificate System Types
// ==========================================
export type CertificateCategoryType =
  | 'COURSE_COMPLETION'
  | 'SUBJECT_COMPLETION'
  | 'SKILL_VERIFICATION'
  | 'REAL_WORLD_CHALLENGE'
  | 'PROJECT_COMPLETION'
  | 'LEARNING_PATH_COMPLETION';

export type CertificateStatusType = 'VALID' | 'REVOKED' | 'EXPIRED';

export interface CertificateEligibilityCriteria {
  course_id: string;
  course_title: string;
  category: CertificateCategoryType;
  required_lessons_total: number;
  lessons_completed: number;
  required_assessments_total: number;
  assessments_passed: number;
  demonstrated_mastery_pct: number;
  minimum_mastery_required_pct: number;
  practical_tasks_completed: number;
  real_world_challenges_completed: number;
  is_eligible: boolean;
  eligibility_reasons: string[];
  missing_requirements: string[];
  learner_registered_name: string;
}

export interface CertificateGenerateRequest {
  course_id: string;
  category?: CertificateCategoryType;
  learner_id?: string;
  custom_registered_name?: string;
}

export interface CertificateModel {
  certificate_id: string;
  learner_id: string;
  learner_registered_name: string;
  recipient_email?: string;
  email_delivery_status?: 'SENT' | 'PENDING' | 'FAILED' | string;
  email_sent_at?: string | null;
  resend_count?: number;
  title: string;
  category: CertificateCategoryType;
  issued_at: string;
  completion_date: string;
  demonstrated_learning_areas: string[];
  evidence_citations: string[];
  status: CertificateStatusType;
  verification_url: string;
  verification_code: string;
  issuing_organization: string;
  signature_hash: string;
  pdf_download_url: string;
  metadata?: Record<string, any>;
}

export interface CertificateResendResponse {
  success: boolean;
  certificate_id: string;
  recipient_email: string;
  email_delivery_status: string;
  resend_count: number;
  message: string;
}

export interface CertificateVerificationResponse {
  is_valid: boolean;
  certificate_id: string;
  status: CertificateStatusType;
  recipient_name: string;
  achievement_title: string;
  category: string;
  issued_at: string;
  demonstrated_learning_areas: string[];
  issuing_organization: string;
  verification_authority: string;
  signature_hash: string;
  revocation_reason?: string | null;
}

// AI Model Providers & Developer Field Kit
export interface AIProviderSummary {
  provider: string;
  name: string;
  description: string;
  tagline: string;
  status: 'connected' | 'not_connected' | 'error' | 'disabled' | string;
  configured: boolean;
  masked_key?: string | null;
  default_model: string;
  fallback_model?: string | null;
  base_url?: string | null;
  temperature: number;
  max_tokens: number;
  timeout: number;
  enabled: boolean;
  is_primary: boolean;
  last_verified_at?: string | null;
  last_latency_ms?: number | null;
  last_error_message?: string | null;
  docs_url: string;
  get_key_url: string;
  supported_models: string[];
}

export interface ConnectProviderRequest {
  api_key: string;
  default_model?: string;
  fallback_model?: string;
  base_url?: string;
  temperature?: number;
  max_tokens?: number;
  timeout?: number;
  enabled?: boolean;
}

export interface UpdateProviderRequest {
  api_key?: string;
  default_model?: string;
  fallback_model?: string;
  base_url?: string;
  temperature?: number;
  max_tokens?: number;
  timeout?: number;
  enabled?: boolean;
  is_primary?: boolean;
}

export interface TestConnectionRequest {
  api_key?: string;
  model?: string;
  base_url?: string;
}

export interface TestConnectionResponse {
  success: boolean;
  provider: string;
  model: string;
  latency_ms: number;
  message: string;
  models_discovered: string[];
}

export interface ProviderModelInfo {
  id: string;
  name: string;
  description?: string;
  context_length?: number;
}

export interface WorkloadRoutingRule {
  workload: string;
  workload_label: string;
  description: string;
  provider: string;
  model_name: string;
  temperature: number;
  max_tokens: number;
}

export interface AIRoutingConfig {
  primary_provider: string;
  primary_model: string;
  fallback_provider: string;
  fallback_model: string;
  workloads: WorkloadRoutingRule[];
}

export interface UpdateRoutingRequest {
  primary_provider?: string;
  primary_model?: string;
  fallback_provider?: string;
  fallback_model?: string;
  workload_mappings?: Record<string, {
    provider: string;
    model_name: string;
    temperature?: number;
    max_tokens?: number;
  }>;
}

export interface ProviderHealthItem {
  provider: string;
  name: string;
  status: 'connected' | 'not_connected' | 'error' | 'disabled' | string;
  latency_ms?: number | null;
  model: string;
  last_checked?: string | null;
  error_detail?: string | null;
}

export interface AIUsageStats {
  total_requests_today: number;
  tokens_used_today: number;
  estimated_cost_usd: number;
  average_latency_ms: number;
  error_count_today: number;
  is_available: boolean;
  provider_breakdown: Record<string, any>;
}
