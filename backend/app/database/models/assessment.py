"""Assessment database model."""

from typing import TYPE_CHECKING

from sqlalchemy import Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.database.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from backend.app.database.models.learner_profile import LearnerProfile
    from backend.app.database.models.question import Question


class Assessment(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Represents a diagnostic, adaptive, or exam-mode assessment."""

    __tablename__ = "assessments"

    learner_profile_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("learner_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    subject: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    difficulty: Mapped[str] = mapped_column(String(50), default="intermediate", nullable=False)
    status: Mapped[str] = mapped_column(
        String(50), default="draft", nullable=False, index=True
    )  # draft, in_progress, completed
    total_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    max_score: Mapped[float] = mapped_column(Float, default=100.0, nullable=False)

    # Relationships
    learner_profile: Mapped["LearnerProfile"] = relationship(
        "LearnerProfile", back_populates="assessments"
    )
    questions: Mapped[list["Question"]] = relationship(
        "Question",
        back_populates="assessment",
        cascade="all, delete-orphan",
        order_by="Question.created_at",
    )

    def __repr__(self) -> str:
        return f"<Assessment id={self.id} title={self.title} status={self.status}>"
