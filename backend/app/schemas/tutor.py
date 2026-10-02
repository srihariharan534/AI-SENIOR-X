"""AI Tutor & Learning Session schemas."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class SessionCreate(BaseModel):
    """Payload to initiate a new learning/tutoring session."""

    topic: str = Field(..., min_length=2, max_length=255)
    session_type: str = Field("tutoring", description="tutoring, practice, mission, review")
    session_metadata: dict[str, Any] = Field(default_factory=dict)


class SessionEndRequest(BaseModel):
    """Payload when completing a session."""

    final_metadata: dict[str, Any] | None = None


class SessionRead(BaseModel):
    """Read model for learning session."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    learner_profile_id: str
    topic: str
    session_type: str
    status: str
    session_metadata: dict[str, Any]
    started_at: datetime
    completed_at: datetime | None = None
    created_at: datetime


class TutorInteractionPrompt(BaseModel):
    """Prompt sent by learner to AI Tutor session."""

    session_id: str
    message: str = Field(..., min_length=1)
    context_tags: list[str] | None = None


class TutorInteractionResponse(BaseModel):
    """Structured response from Tutor agent interface."""

    session_id: str
    response_text: str
    suggested_followups: list[str] = Field(default_factory=list)
    concept_references: list[str] = Field(default_factory=list)
    confidence_score: float = 1.0
