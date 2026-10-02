"""AI-SENIOR-X Standardized Learning Evidence Models."""

from datetime import UTC, datetime
from enum import StrEnum
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, model_validator


class EvidenceType(StrEnum):
    """Enumeration of learning evidence categories."""

    ASSESSMENT = "assessment"
    PRACTICE = "practice"
    TUTOR = "tutor"
    COMPLETION = "completion"
    FEEDBACK = "feedback"
    MISCONCEPTION = "misconception"


class BaseEvidence(BaseModel):
    """Base schema for all incoming learning evidence."""

    model_config = ConfigDict(extra="allow")

    learner_id: str
    evidence_type: EvidenceType
    timestamp: datetime = Field(default_factory=lambda: datetime.now(UTC))
    subject: str = "AI/ML"
    topic: str = "general"
    concept: str | None = None
    session_id: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)

    @property
    def topic_id(self) -> str:
        return self.topic

    @property
    def concept_id(self) -> str | None:
        return self.concept

    @model_validator(mode="before")
    @classmethod
    def remap_compatibility_fields(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "topic_id" in data and "topic" not in data:
                data["topic"] = data.pop("topic_id")
            if "concept_id" in data and "concept" not in data:
                data["concept"] = data.pop("concept_id")
        return data


class AssessmentEvidence(BaseEvidence):
    """Evidence emitted from diagnostic or summative assessments."""

    evidence_type: EvidenceType = EvidenceType.ASSESSMENT
    assessment_id: str = "assessment-0"
    question_id: str = "q-0"
    user_response: str = ""
    is_correct: bool = True
    score_awarded: float = 1.0
    max_score: float = 10.0
    difficulty: str = "medium"  # easy, medium, hard, or float-string
    response_time_seconds: float = 0.0

    @property
    def score(self) -> float:
        return self.score_awarded

    @model_validator(mode="before")
    @classmethod
    def remap_assessment_fields(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "score" in data and "score_awarded" not in data:
                data["score_awarded"] = data.pop("score")
            if "time_taken_seconds" in data and "response_time_seconds" not in data:
                data["response_time_seconds"] = data.pop("time_taken_seconds")
            if "difficulty" in data and isinstance(data["difficulty"], (int, float)):
                diff_num = float(data["difficulty"])
                data["difficulty"] = (
                    "easy" if diff_num < 0.4 else "hard" if diff_num > 0.75 else "medium"
                )
        return data


class PracticeEvidence(BaseEvidence):
    """Evidence emitted from self-paced coding or practice exercises."""

    evidence_type: EvidenceType = EvidenceType.PRACTICE
    exercise_id: str = "ex-0"
    attempts_count: int = 1
    completed_successfully: bool = True
    time_spent_seconds: int = 60
    hints_used_count: int = 0

    @model_validator(mode="before")
    @classmethod
    def remap_practice_fields(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "attempts" in data and "attempts_count" not in data:
                data["attempts_count"] = data.pop("attempts")
            if "success" in data and "completed_successfully" not in data:
                data["completed_successfully"] = data.pop("success")
            if "hints_used" in data and "hints_used_count" not in data:
                data["hints_used_count"] = data.pop("hints_used")
        return data


class TutorEvidence(BaseEvidence):
    """Evidence emitted from Socratic tutoring interactions."""

    evidence_type: EvidenceType = EvidenceType.TUTOR
    session_id: str | None = None
    interaction_type: str = "socratic_dialogue"
    comprehension_signal: float = Field(0.8, ge=0.0, le=1.0)
    topics_covered: list[str] = Field(default_factory=list)

    @model_validator(mode="before")
    @classmethod
    def remap_tutor_fields(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "turns_engaged" in data:
                data.setdefault("metadata", {})["turns_engaged"] = data.pop("turns_engaged")
            if "comprehension_signal" in data and isinstance(data["comprehension_signal"], str):
                data["comprehension_signal"] = (
                    0.85 if data["comprehension_signal"] == "positive" else 0.5
                )
        return data


class CompletionEvidence(BaseEvidence):
    """Evidence emitted upon finishing a curriculum module or mission."""

    evidence_type: EvidenceType = EvidenceType.COMPLETION
    module_id: str = "mod-0"
    xp_earned: int = 100

    @model_validator(mode="before")
    @classmethod
    def remap_completion_fields(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "item_id" in data and "module_id" not in data:
                data["module_id"] = data.pop("item_id")
        return data


class MisconceptionEvidence(BaseEvidence):
    """Evidence emitted when a flawed mental model is detected."""

    evidence_type: EvidenceType = EvidenceType.MISCONCEPTION
    misconception_tag: str = "general"
    description: str = "Misconception detected"
    severity: str = "moderate"  # minor, moderate, critical

    @property
    def misconception_id(self) -> str:
        return self.misconception_tag

    @model_validator(mode="before")
    @classmethod
    def remap_misconception_fields(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "misconception_id" in data and "misconception_tag" not in data:
                data["misconception_tag"] = data.pop("misconception_id")
        return data


class FeedbackEvidence(BaseEvidence):
    """Evidence emitted from explicit learner feedback or confidence self-ratings."""

    evidence_type: EvidenceType = EvidenceType.FEEDBACK
    rating: float = Field(default=5.0, ge=1.0, le=5.0)
    comments: str | None = None
