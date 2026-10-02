"""Learner Misconception database model."""

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.database.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from backend.app.database.models.learner_profile import LearnerProfile


class Misconception(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Tracks detected cognitive misconceptions, diagnostic severity, and resolution status."""

    __tablename__ = "misconceptions"

    learner_profile_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("learner_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    concept_key: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    misconception_tag: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    severity: Mapped[str] = mapped_column(
        String(50), default="moderate", nullable=False
    )  # minor, moderate, critical
    status: Mapped[str] = mapped_column(
        String(50), default="active", nullable=False, index=True
    )  # active, addressed, resolved
    detected_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    learner_profile: Mapped["LearnerProfile"] = relationship(
        "LearnerProfile", back_populates="misconceptions"
    )

    def __repr__(self) -> str:
        return f"<Misconception id={self.id} concept={self.concept_key} status={self.status}>"
