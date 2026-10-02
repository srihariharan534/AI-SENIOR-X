"""Pydantic schemas for Multimodal Doubt Resolution, Teaching Strategies, and Specialized Mentorship."""

from datetime import UTC, datetime
from enum import StrEnum
from typing import Any

from pydantic import BaseModel, Field


class DoubtModality(StrEnum):
    """Supported input modalities for doubt submission."""

    TEXT = "text"
    IMAGE = "image"
    SCREENSHOT = "screenshot"
    HANDWRITTEN = "handwritten"
    MATH_EQUATION = "math_equation"
    DIAGRAM = "diagram"
    CODE_SNIPPET = "code_snippet"
    CODE_SCREENSHOT = "code_screenshot"
    PDF_DOCUMENT = "pdf_document"
    VOICE = "voice"
    NOTES = "notes"
    PROJECT_CRISIS = "project_crisis"
    INTERVIEW_PRACTICE = "interview_practice"


class DoubtCategory(StrEnum):
    """Categorical classification of learner doubts."""

    CONCEPTUAL = "conceptual"
    PROCEDURAL = "procedural"
    MATHEMATICAL = "mathematical"
    CODING = "coding"
    DEBUGGING = "debugging"
    DOCUMENT_BASED = "document_based"
    EXAM = "exam"
    PROJECT = "project"
    INTERVIEW = "interview"
    CAREER = "career"
    REAL_WORLD = "real_world"


class ExplanationLevel(StrEnum):
    """Target cognitive explanation style and complexity."""

    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"
    SIMPLER = "simpler"
    ANALOGY = "analogy"
    CONCRETE_EXAMPLE = "concrete_example"
    VISUAL = "visual"
    MATHEMATICAL = "mathematical"
    NO_JARGON = "no_jargon"
    STEP_BY_STEP = "step_by_step"


class CodeHelpMode(StrEnum):
    """Pedagogical scaffolding mode for code teaching."""

    HINT = "hint"
    STEP_BY_STEP = "step_by_step"
    FULL_SOLUTION = "full_solution"


class VisualDiagramType(StrEnum):
    """Types of visual diagrams and interactive teaching models."""

    FLOWCHART = "flowchart"
    NEURAL_NET = "neural_net"
    GRADIENT_DESCENT = "gradient_descent"
    DECISION_TREE = "decision_tree"
    LINKED_LIST = "linked_list"
    STACK_QUEUE = "stack_queue"
    GRAPH_TRAVERSAL = "graph_traversal"
    ER_RELATIONSHIP = "er_relationship"
    SQL_JOIN = "sql_join"
    CLOUD_ARCHITECTURE = "cloud_architecture"
    CONCEPT_MAP = "concept_map"


class VisualDiagramSpec(BaseModel):
    """Specification for visual/diagrammatic representation."""

    diagram_type: VisualDiagramType
    title: str
    description: str
    svg_data: str | None = None
    mermaid_code: str | None = None
    interactive_nodes: list[dict[str, Any]] = Field(default_factory=list)


class UnderstandingCheckOption(BaseModel):
    """Option for multiple-choice understanding check."""

    key: str
    text: str
    is_correct: bool
    explanation: str


class UnderstandingCheck(BaseModel):
    """Active comprehension probe presented to student."""

    id: str
    check_type: str  # "mcq", "prediction", "explain_in_own_words", "code_fix", "scenario"
    prompt: str
    options: list[UnderstandingCheckOption] = Field(default_factory=list)
    expected_answer_explanation: str
    related_concept: str


class UnderstandingCheckSubmission(BaseModel):
    """Student response to understanding check."""

    check_id: str
    concept_id: str
    selected_key: str | None = None
    open_response_text: str | None = None


class UnderstandingCheckResult(BaseModel):
    """Evaluation of understanding check."""

    check_id: str
    concept_id: str
    is_correct: bool
    score: float
    feedback: str
    learning_twin_updated: bool
    next_action_recommendation: str


class DocumentCitation(BaseModel):
    """Citation referencing uploaded notes or textbook page."""

    document_id: str
    document_title: str
    page_number: int | None = None
    section_title: str | None = None
    matched_quote: str | None = None
    source_confidence: float = 1.0


class MultimodalDoubtRequest(BaseModel):
    """Unified request schema for submitting doubts in any modality."""

    modality: DoubtModality = DoubtModality.TEXT
    user_query: str
    image_base64: str | None = None
    image_filename: str | None = None
    document_id: str | None = None
    code_snippet: str | None = None
    code_language: str | None = "python"
    audio_base64: str | None = None
    explanation_level: ExplanationLevel = ExplanationLevel.INTERMEDIATE
    current_topic_id: str | None = None
    session_id: str | None = None
    history_context: list[dict[str, str]] = Field(default_factory=list)
    why_chain_count: int = 0
    code_help_mode: CodeHelpMode = CodeHelpMode.STEP_BY_STEP


class MultimodalDoubtResponse(BaseModel):
    """Rich, structured teaching card response."""

    id: str
    doubt_category: DoubtCategory
    concept_id: str
    concept_name: str
    teaching_strategy_used: str
    explanation_level: str
    explanation_markdown: str
    why_it_matters: str
    prerequisite_context: str | None = None
    missing_prerequisites: list[str] = Field(default_factory=list)
    detected_misconceptions: list[str] = Field(default_factory=list)
    visual_diagram: VisualDiagramSpec | None = None
    worked_example: str | None = None
    code_fix_proposal: dict[str, Any] | None = None
    understanding_check: UnderstandingCheck | None = None
    real_world_application: str | None = None
    suggested_next_action: str
    citations: list[DocumentCitation] = Field(default_factory=list)
    is_uncertain: bool = False
    uncertainty_clarification_prompt: str | None = None
    why_chain_count: int = 0
    audio_response_base64: str | None = None


class DocumentUploadRequest(BaseModel):
    """Schema for uploading a lecture note or textbook PDF/DOC."""

    title: str
    subject: str = "AI/ML"
    file_base64: str
    filename: str
    file_type: str = "pdf"  # pdf, docx, txt, markdown
    page_count: int = 1


class DocumentUploadResponse(BaseModel):
    """Response returned upon indexing an uploaded document."""

    document_id: str
    title: str
    total_pages: int
    total_chunks: int
    extracted_topics: list[str] = Field(default_factory=list)
    key_concepts: list[str] = Field(default_factory=list)
    indexed_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    sample_questions: list[str] = Field(default_factory=list)


class DocumentTeachRequest(BaseModel):
    """Request personalized teaching or Q&A from uploaded document."""

    document_id: str
    prompt: str
    teach_mode: str = "personalized_lesson"  # personalized_lesson, explain_page, quiz_me, summarize, find_weak_areas
    page_number: int | None = None


class CodeMentorRequest(BaseModel):
    """Request for code debugging, explanation, or optimization."""

    code: str
    language: str = "python"
    error_message: str | None = None
    question: str | None = None
    help_mode: CodeHelpMode = CodeHelpMode.STEP_BY_STEP


class CodeMentorResponse(BaseModel):
    """Detailed pedagogical code feedback."""

    parsed_language: str
    has_syntax_error: bool
    error_type: str | None = None
    root_cause_explanation: str
    related_concept: str
    hint: str
    step_by_step_explanation: list[str] = Field(default_factory=list)
    fixed_code: str | None = None
    why_fix_works: str | None = None
    similar_practice_challenge: dict[str, Any] | None = None


class ProjectMentorRequest(BaseModel):
    """Project guidance, architecture planning, or debugging request."""

    project_goal: str
    domain: str = "Machine Learning"
    current_milestone_index: int = 0
    submitted_code_or_architecture: str | None = None
    error_logs: str | None = None


class ProjectMentorResponse(BaseModel):
    """Project mentor guidance and milestones."""

    project_title: str
    scope_summary: str
    prerequisites: list[str] = Field(default_factory=list)
    recommended_tech_stack: list[str] = Field(default_factory=list)
    architecture_overview: str
    milestones: list[dict[str, Any]] = Field(default_factory=list)
    current_milestone_guidance: str
    debugging_diagnosis: str | None = None
    suggested_improvements: list[str] = Field(default_factory=list)
    next_action: str


class InterviewTurnRequest(BaseModel):
    """Learner turn in interactive AI mock interview."""

    interview_type: str = "technical"  # technical, coding, sql, ml, system_design, data_analyst, hr
    target_role: str = "Senior AI Engineer"
    turn_index: int = 1
    current_question: str
    learner_answer: str


class InterviewTurnResponse(BaseModel):
    """Evaluation of learner interview response."""

    turn_index: int
    score: float
    evaluation_criteria_scores: dict[str, float] = Field(default_factory=dict)
    feedback_summary: str
    identified_gaps: list[str] = Field(default_factory=list)
    ideal_response_formulation: str
    follow_up_question: str
    is_concluded: bool = False
