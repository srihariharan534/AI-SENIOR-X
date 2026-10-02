"""Learner Progress database model."""

from datetime import UTC, datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.database.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from backend.app.database.models.learner_profile import LearnerProfile


class Progress(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Tracks mastery metrics, streaks, study duration, and curriculum progression."""

    __tablename__ = "progress"

    learner_profile_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("learner_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    subject: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    module_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    mastery_level: Mapped[float] = mapped_column(
        Float, default=0.0, nullable=False
    )  # 0.0 to 1.0 (100%)
    completed_missions_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    streak_days: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_time_spent_minutes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_activity_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    # Relationships
    learner_profile: Mapped["LearnerProfile"] = relationship(
        "LearnerProfile", back_populates="progress_records"
    )

    def __repr__(self) -> str:
        return f"<Progress id={self.id} subject={self.subject} mastery={self.mastery_level}>"
