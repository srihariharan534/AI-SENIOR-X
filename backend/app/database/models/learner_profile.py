"""Learner Profile database model."""

from typing import TYPE_CHECKING, Any

from sqlalchemy import JSON, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.database.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from backend.app.database.models.answer import Answer
    from backend.app.database.models.assessment import Assessment
    from backend.app.database.models.learning_session import LearningSession
    from backend.app.database.models.misconception import Misconception
    from backend.app.database.models.progress import Progress
    from backend.app.database.models.user import User


class LearnerProfile(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Learner profile model storing cognitive state, learning preferences, and progress hooks."""

    __tablename__ = "learner_profiles"

    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )
    grade_level: Mapped[str] = mapped_column(String(50), default="undergraduate", nullable=False)
    preferred_language: Mapped[str] = mapped_column(String(20), default="en", nullable=False)
    learning_style: Mapped[str] = mapped_column(
        String(50), default="visual_interactive", nullable=False
    )
    target_goals: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    mastery_scores: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    cognitive_twin_state: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="learner_profile")
    learning_sessions: Mapped[list["LearningSession"]] = relationship(
        "LearningSession",
        back_populates="learner_profile",
        cascade="all, delete-orphan",
    )
    assessments: Mapped[list["Assessment"]] = relationship(
        "Assessment",
        back_populates="learner_profile",
        cascade="all, delete-orphan",
    )
    misconceptions: Mapped[list["Misconception"]] = relationship(
        "Misconception",
        back_populates="learner_profile",
        cascade="all, delete-orphan",
    )
    progress_records: Mapped[list["Progress"]] = relationship(
        "Progress",
        back_populates="learner_profile",
        cascade="all, delete-orphan",
    )
    answers: Mapped[list["Answer"]] = relationship(
        "Answer",
        back_populates="learner_profile",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<LearnerProfile id={self.id} user_id={self.user_id} grade={self.grade_level}>"
