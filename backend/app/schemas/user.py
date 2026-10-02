"""User and LearnerProfile Pydantic validation schemas."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class LearnerProfileBase(BaseModel):
    """Base fields for learner profile."""

    grade_level: str = Field("undergraduate", description="Educational level")
    preferred_language: str = Field("en", description="ISO 639-1 language code")
    learning_style: str = Field("visual_interactive", description="Preferred cognitive modality")
    target_goals: dict[str, Any] = Field(default_factory=dict)


class LearnerProfileCreate(LearnerProfileBase):
    pass


class LearnerProfileUpdate(BaseModel):
    grade_level: str | None = None
    preferred_language: str | None = None
    learning_style: str | None = None
    target_goals: dict[str, Any] | None = None


class LearnerProfileRead(LearnerProfileBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    mastery_scores: dict[str, Any] = Field(default_factory=dict)
    cognitive_twin_state: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime
    updated_at: datetime


class UserBase(BaseModel):
    """Base fields for user account."""

    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=255)
    username: str | None = None
    role: str = Field("learner", description="User role: learner, tutor, admin")
    preferred_language: str = Field("en", description="Preferred language code")
    learning_goal: str | None = Field(None, description="Primary learning objective")


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="Plaintext password")
    grade_level: str | None = "undergraduate"


class UserUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None
    username: str | None = None
    learning_goal: str | None = None
    preferred_language: str | None = None
    password: str | None = Field(None, min_length=8)


class UserRead(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    learner_profile: LearnerProfileRead | None = None
