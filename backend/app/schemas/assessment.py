"""Assessment and Question Pydantic schemas."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class QuestionBase(BaseModel):
    prompt: str = Field(..., min_length=5)
    question_type: str = Field("multiple_choice", description="multiple_choice, open_ended, coding")
    options: dict[str, Any] = Field(default_factory=dict)
    points: float = Field(10.0, ge=1.0)
    difficulty: str = Field("medium")


class QuestionCreate(QuestionBase):
    correct_answer: str = Field(..., min_length=1)
    explanation: str = Field("", description="Educational rationale")


class QuestionRead(QuestionBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    assessment_id: str
    explanation: str
    created_at: datetime


class AnswerSubmitRequest(BaseModel):
    """Payload when submitting an answer for a specific question."""

    question_id: str
    user_response: str = Field(..., min_length=1)
    response_time_seconds: float = Field(0.0, ge=0.0)


class AnswerResultRead(BaseModel):
    """Feedback returned to the learner upon submitting an answer."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    question_id: str
    is_correct: bool
    score_awarded: float
    feedback: str
    correct_answer: str | None = None
    explanation: str | None = None


class AssessmentCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    subject: str = Field(..., min_length=2, max_length=100)
    difficulty: str = Field("intermediate")
    max_score: float = Field(100.0, ge=10.0)
    questions: list[QuestionCreate] | None = None


class AssessmentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    learner_profile_id: str
    title: str
    subject: str
    difficulty: str
    status: str
    total_score: float
    max_score: float
    created_at: datetime


class AssessmentDetailRead(AssessmentRead):
    questions: list[QuestionRead] = Field(default_factory=list)
