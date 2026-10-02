"""
AI-SENIOR-X Skill Intelligence & Proof-of-Skill Pydantic Schemas.
Multi-dimensional evidence modeling, transparent skill states, teach-back evaluations,
learning blocker diagnostics, and verifiable proof of skill records.
"""

from datetime import datetime
from enum import StrEnum
from typing import Any

from pydantic import BaseModel, Field


class SkillState(StrEnum):
    UNKNOWN = "UNKNOWN"
    INTRODUCED = "INTRODUCED"
    DEVELOPING = "DEVELOPING"
    GUIDED = "GUIDED"
    DEMONSTRATED = "DEMONSTRATED"
    APPLIED = "APPLIED"
    RETAINED = "RETAINED"


class IndependenceLevel(StrEnum):
    FULL_GUIDANCE = "FULL_GUIDANCE"
    PARTIAL_GUIDANCE = "PARTIAL_GUIDANCE"
    HINT = "HINT"
    MINIMAL_HINT = "MINIMAL_HINT"
    INDEPENDENT = "INDEPENDENT"


class BlockerType(StrEnum):
    CONCEPT_GAP = "CONCEPT_GAP"
    PREREQUISITE_GAP = "PREREQUISITE_GAP"
    MISCONCEPTION = "MISCONCEPTION"
    PROCEDURAL_GAP = "PROCEDURAL_GAP"
    REASONING_GAP = "REASONING_GAP"
    APPLICATION_GAP = "APPLICATION_GAP"
    RETENTION_GAP = "RETENTION_GAP"
    CONFIDENCE_GAP = "CONFIDENCE_GAP"
    TRANSFER_GAP = "TRANSFER_GAP"


class SkillEvidenceItem(BaseModel):
    evidence_id: str
    learner_id: str
    skill_id: str
    skill_name: str
    concept_id: str
    task_id: str | None = None
    challenge_id: str | None = None
    source_type: str = (
        "real_world_task"  # drill, challenge, project, teach_back, delayed_test, transfer_test
    )
    difficulty: str = "intermediate"
    correctness: float = 1.0  # 0.0 to 1.0
    independence: IndependenceLevel = IndependenceLevel.INDEPENDENT
    hint_usage_count: int = 0
    reasoning_quality: float = 0.85
    application_level: str = "production"
    retention_status: str | None = None  # retained, decaying, refreshed
    transfer_context: str | None = None  # e.g., e-commerce -> healthcare
    summary: str
    verified_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    confidence: float = 0.90
    evidence_metadata: dict[str, Any] = Field(default_factory=dict)


class SkillDimensionScores(BaseModel):
    knowledge: str = "Strong"  # Strong, Developing, Needs Evidence
    problem_solving: str = "Strong"
    practical_application: str = "Developing"
    independent_implementation: str = "Strong"
    debugging: str = "Developing"
    retention: str = "Demonstrated"


class SkillTimelineEvent(BaseModel):
    timestamp: str
    event_date: str
    state_reached: SkillState
    trigger_event: str
    evidence_ref_id: str | None = None


class SkillDetail(BaseModel):
    skill_id: str
    skill_name: str
    domain: str
    current_state: SkillState
    state_reasoning: str
    dimensions: SkillDimensionScores
    evidence_count_total: int
    independent_solutions_count: int
    hints_required_count: int
    real_world_challenges_count: int
    projects_completed_count: int
    retention_score_pct: float
    demonstrated_evidence: list[SkillEvidenceItem]
    weak_areas: list[str]
    next_recommended_action: str
    timeline: list[SkillTimelineEvent]
    dependencies: list[str] = Field(default_factory=list)


class ProofOfSkillRecord(BaseModel):
    proof_id: str
    skill_id: str
    skill_name: str
    domain: str
    verified_status: str = "VERIFIED_DEMONSTRATED"
    verified_date: str
    capabilities_demonstrated: list[str]
    evidence_summary: dict[str, Any]
    verifiable_hash: str
    citations_and_tasks: list[str]


class RoleSkillRequirement(BaseModel):
    skill_id: str
    skill_name: str
    required_state: SkillState
    current_state: SkillState
    is_met: bool
    gap_severity: str = "None"  # Critical, Moderate, Low, None
    recommended_challenge_title: str | None = None


class RoleGapAnalysis(BaseModel):
    target_role: str
    readiness_pct: float
    is_job_ready: bool
    total_skills_required: int
    skills_demonstrated: int
    critical_gaps: list[str]
    skill_breakdown: list[RoleSkillRequirement]
    next_best_action_challenge: str


class SkillIntelligenceProfile(BaseModel):
    learner_id: str
    learner_name: str
    updated_at: str
    skills: list[SkillDetail]
    target_role: str
    target_role_analysis: RoleGapAnalysis
    proof_records: list[ProofOfSkillRecord]
    total_verified_evidence_count: int
    overall_independence_rate_pct: float


# ==========================================
# Teach-Back Schemas
# ==========================================
class TeachBackRequest(BaseModel):
    learner_id: str = "current_learner"
    concept_id: str
    concept_title: str
    learner_explanation: str
    modality: str = "text"  # text, voice, diagram_explanation


class TeachBackResponse(BaseModel):
    concept_id: str
    concept_title: str
    is_conceptually_correct: bool
    conceptual_score: float  # 0.0 to 1.0
    core_ideas_understood: list[str]
    missing_critical_aspects: list[str]
    detected_misconceptions: list[str]
    pedagogical_feedback: str
    encouraging_remediation: str
    reteach_summary: str | None = None
    next_verification_action: str
    evidence_logged: bool = True
    updated_skill_state: SkillState | None = None


# ==========================================
# Learning Blocker Schemas
# ==========================================
class LearningBlockerRequest(BaseModel):
    learner_id: str = "current_learner"
    input_text: str
    image_base64: str | None = None
    code_snippet: str | None = None
    current_topic: str
    attempted_task: str | None = None


class LearningBlockerResponse(BaseModel):
    blocker_type: BlockerType
    blocker_title: str
    blocker_diagnosis: str
    confidence_level: str  # High, Moderate, Preliminary
    root_cause_explanation: str
    missing_prerequisites: list[str]
    detected_misconception: str | None = None
    actionable_remediation_steps: list[str]
    recommended_diagnostic: str
    remediation_resource_url: str | None = None


# ==========================================
# Real-World Challenge Verification Schemas
# ==========================================
class ChallengeSubmissionRequest(BaseModel):
    learner_id: str = "current_learner"
    challenge_id: str
    skill_id: str
    sql_or_code_submission: str
    reasoning_explanation: str
    business_recommendation: str | None = None
    time_spent_seconds: int = 180
    hints_used: int = 0
    independence: IndependenceLevel = IndependenceLevel.INDEPENDENT


class ChallengeEvaluationResponse(BaseModel):
    challenge_id: str
    skill_id: str
    is_verified_demonstrated: bool
    overall_score: float  # 0 to 100
    criteria_scores: dict[
        str, float
    ]  # technical_correctness, data_reasoning, business_impact, efficiency, communication, independence
    detailed_evaluation_feedback: str
    strengths_observed: list[str]
    areas_for_refinement: list[str]
    proof_record_generated: ProofOfSkillRecord | None = None
    updated_skill_state: SkillState
    next_recommended_milestone: str


# ==========================================
# Retention & Transfer Testing Schemas
# ==========================================
class DelayedRetentionCheckRequest(BaseModel):
    learner_id: str = "current_learner"
    skill_id: str
    concept_id: str
    delayed_days_elapsed: int = 14
    learner_answer: str


class TransferTestRequest(BaseModel):
    learner_id: str = "current_learner"
    skill_id: str
    source_domain: str = "e-commerce"
    target_transfer_domain: str = "healthcare"
    learner_solution: str
    transfer_reasoning: str
