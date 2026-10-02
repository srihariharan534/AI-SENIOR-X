"""Learner Progress and Misconception schemas."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ProgressRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    learner_profile_id: str
    subject: str
    module_id: str
    mastery_level: float
    completed_missions_count: int
    streak_days: int
    total_time_spent_minutes: int
    last_activity_at: datetime


class MisconceptionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    learner_profile_id: str
    concept_key: str
    misconception_tag: str
    description: str
    severity: str
    status: str
    detected_at: datetime | None = None
    resolved_at: datetime | None = None


class StudyActivityLogRequest(BaseModel):
    """Payload to log completed study session/activity."""

    subject: str = Field(..., min_length=2)
    module_id: str = Field(..., min_length=1)
    time_spent_minutes: int = Field(..., ge=1)
    mastery_delta: float = Field(0.05, ge=-1.0, le=1.0)


class ProgressOverviewRead(BaseModel):
    """Comprehensive progress summary for dashboard."""

    total_study_minutes: int
    current_streak_days: int
    overall_mastery: float
    completed_missions: int
    active_misconceptions_count: int
    subject_mastery: dict[str, float]
    recent_progress: list[ProgressRead]
    unresolved_misconceptions: list[MisconceptionRead]
