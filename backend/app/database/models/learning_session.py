"""Learning Session database model."""

from datetime import UTC, datetime
from typing import TYPE_CHECKING, Any

from sqlalchemy import JSON, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.database.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from backend.app.database.models.learner_profile import LearnerProfile


class LearningSession(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Represents an active or completed AI tutoring or practice session."""

    __tablename__ = "learning_sessions"

    learner_profile_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("learner_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    topic: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    session_type: Mapped[str] = mapped_column(
        String(50), default="tutoring", nullable=False
    )  # tutoring, practice, mission, review
    status: Mapped[str] = mapped_column(
        String(50), default="active", nullable=False, index=True
    )  # active, completed, paused
    session_metadata: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    learner_profile: Mapped["LearnerProfile"] = relationship(
        "LearnerProfile", back_populates="learning_sessions"
    )

    def __repr__(self) -> str:
        return f"<LearningSession id={self.id} topic={self.topic} status={self.status}>"
