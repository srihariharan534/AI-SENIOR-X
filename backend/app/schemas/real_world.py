"""Pydantic schemas for Real-World Projects, Scenarios, Job Readiness, and Explainable Evidence."""

from datetime import UTC, datetime
from enum import StrEnum
from typing import Any

from pydantic import BaseModel, Field


class ProjectDomain(StrEnum):
    """Domains for real-world projects and challenges."""

    PYTHON = "Python"
    SQL = "SQL"
    MACHINE_LEARNING = "Machine Learning"
    DATA_ANALYTICS = "Data Analytics"
    CLOUD = "Cloud"
    DSA = "DSA"
    FINTECH = "Fintech"
    HEALTHCARE = "Healthcare"
    ECOMMERCE = "E-Commerce"
    LOGISTICS = "Logistics"
    AGRICULTURE = "Agriculture"
    EDUCATION = "Education"


class ProjectDifficulty(StrEnum):
    """Real-world project difficulty tier."""

    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"
    SENIOR_PRACTICE = "Senior Practice"


class ProjectPhase(StrEnum):
    """The 8-step iterative project workflow phases."""

    UNDERSTAND = "Understand Problem"
    PLAN = "Plan Solution"
    IMPLEMENT = "Implement"
    SUBMIT = "Submit"
    EVALUATION = "AI Evaluation"
    DIAGNOSIS = "Identify Weaknesses"
    IMPROVE = "Improve"
    RESUBMIT = "Resubmit & Certify"


class ProjectStep(BaseModel):
    """Individual step within a real-world project."""

    step_number: int
    title: str
    description: str
    guidance: str
    hints: list[str] = Field(default_factory=list)


class RealWorldConstraint(BaseModel):
    """Realistic production constraints applied to problems."""

    constraint_type: str  # e.g., "Performance", "Noisy Data", "Scale", "Cost", "Latency"
    description: str
    threshold: str | None = None


class ProjectDefinition(BaseModel):
    """Schema for a real-world project specification."""

    id: str
    title: str
    domain: ProjectDomain
    difficulty: ProjectDifficulty
    estimated_time_minutes: int
    prerequisites: list[str] = Field(default_factory=list)
    skills_demonstrated: list[str] = Field(default_factory=list)
    problem_statement: str
    business_context: str
    dataset_description: str | None = None
    starter_template: str
    sample_solution: str | None = None
    constraints: list[RealWorldConstraint] = Field(default_factory=list)
    steps: list[ProjectStep] = Field(default_factory=list)
    evaluation_criteria: list[str] = Field(default_factory=list)


class ProjectSubmission(BaseModel):
    """Learner submission for a real-world project."""

    project_id: str
    phase: ProjectPhase = ProjectPhase.IMPLEMENT
    solution_code: str
    plan_explanation: str | None = None
    architectural_notes: str | None = None
    hints_used: int = 0
    time_spent_seconds: int = 0


class ProjectEvaluation(BaseModel):
    """AI evaluation result for a real-world project submission."""

    submission_id: str
    project_id: str
    passed: bool
    score: float = Field(..., ge=0.0, le=100.0)
    rubric_scores: dict[str, float] = Field(
        default_factory=lambda: {
            "functional_correctness": 0.0,
            "architectural_reasoning": 0.0,
            "performance_under_scale": 0.0,
            "edge_case_robustness": 0.0,
            "code_quality": 0.0,
        }
    )
    feedback_summary: str
    strengths: list[str] = Field(default_factory=list)
    identified_weaknesses: list[str] = Field(default_factory=list)
    detected_misconceptions: list[str] = Field(default_factory=list)
    suggested_improvements: list[str] = Field(default_factory=list)
    next_action: str
    evidence_generated: bool = False
    evidence_badge: str | None = None


class PortfolioEvidenceRecord(BaseModel):
    """Verifiable portfolio evidence generated from completed real-world projects."""

    id: str
    learner_id: str
    project_id: str
    project_title: str
    domain: str
    completed_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    skills_demonstrated: list[str] = Field(default_factory=list)
    evidence_metrics: dict[str, Any] = Field(default_factory=dict)
    summary_of_work: str
    score: float
    verification_hash: str


class DecisionOption(BaseModel):
    """An option in an architectural/engineering decision scenario."""

    option_id: str
    title: str
    description: str
    tradeoffs: dict[str, str] = Field(
        default_factory=lambda: {
            "scalability": "",
            "cost": "",
            "reliability": "",
            "complexity": "",
            "maintainability": "",
        }
    )
    is_optimal_for_context: bool = False


class ScenarioDefinition(BaseModel):
    """Schema for a real-world engineering scenario testing reasoning and trade-offs."""

    id: str
    title: str
    domain: str
    difficulty: str
    scenario_prompt: str
    production_context: str
    constraints: list[str] = Field(default_factory=list)
    options: list[DecisionOption] = Field(default_factory=list)
    reasoning_prompt: str = (
        "Why did you choose this architecture, and how does it balance cost vs reliability?"
    )


class DecisionEvaluationRequest(BaseModel):
    """Learner decision and reasoning response for evaluation."""

    scenario_id: str
    selected_option_id: str
    learner_reasoning: str


class DecisionEvaluationResponse(BaseModel):
    """Detailed evaluation of learner engineering decision and trade-off justification."""

    scenario_id: str
    selected_option_id: str
    is_optimal: bool
    decision_score: float
    reasoning_score: float
    dimension_scores: dict[str, float] = Field(
        default_factory=lambda: {
            "scalability": 0.0,
            "cost_awareness": 0.0,
            "reliability": 0.0,
            "complexity_management": 0.0,
            "maintainability": 0.0,
        }
    )
    evaluation_feedback: str
    key_tradeoff_insight: str
    next_action_recommendation: str


class ReadinessStatus(StrEnum):
    """Evidence-based status categories for job readiness."""

    STRONG = "Strong"
    DEVELOPING = "Developing"
    NEEDS_PRACTICE = "Needs practice"
    NEEDS_EVIDENCE = "Needs evidence"


class SkillReadinessEvidence(BaseModel):
    """Detailed evidence item for a specific skill."""

    skill_name: str
    status: ReadinessStatus
    demonstrated_evidence: list[str] = Field(default_factory=list)
    missing_evidence: list[str] = Field(default_factory=list)
    exercises_completed: int = 0
    independently_solved: int = 0
    hints_required: int = 0
    real_world_tasks_completed: int = 0
    last_assessed: str = "Recent session"
    actionable_cta: str = "PRACTICE"


class JobReadinessProfile(BaseModel):
    """Evidence-based job readiness profile without fabricated overall percentages."""

    learner_id: str
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    career_target: str = "Full-Stack AI & Data Engineer"
    skills: list[SkillReadinessEvidence] = Field(default_factory=list)
    portfolio_projects_count: int = 0
    total_verified_evidence_items: int = 0
    next_recommended_milestone: str


class ExplainableRecommendation(BaseModel):
    """Strict explainable recommendation schema answering WHAT, WHY, EVIDENCE, NEXT ACTION."""

    id: str
    what: str
    why: str
    evidence: list[str]
    prerequisite_context: str | None = None
    estimated_effort_minutes: int = 20
    next_action: str
    action_type: str  # "lesson", "practice", "project", "scenario", "review"
    action_target_id: str
    user_override_available: bool = True


class RecoveryDiagnosisRequest(BaseModel):
    """Submission for failure recovery diagnostic loop."""

    question_or_task_id: str
    domain: str
    concept_id: str
    user_failed_response: str
    expected_concept: str


class RecoveryDiagnosisResponse(BaseModel):
    """Diagnosis of failure identifying root misconception and prerequisite remediation."""

    failed_concept: str
    root_issue: str
    detected_misconception: str
    missing_prerequisite: str
    explanation: str
    targeted_practice_exercise_id: str
    targeted_practice_prompt: str
    starter_code: str | None = None
    step_actions: list[str] = Field(
        default_factory=lambda: [
            "1. Review Misconception Explanation",
            "2. Complete Targeted Prerequisite Practice",
            "3. Try Original Problem Again",
            "4. Update Cognitive Twin State",
        ]
    )
