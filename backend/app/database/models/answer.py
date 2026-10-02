"""Learner Answer database model."""

from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.database.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from backend.app.database.models.learner_profile import LearnerProfile
    from backend.app.database.models.question import Question


class Answer(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Stores a learner's submitted answer and grading evaluation."""

    __tablename__ = "answers"

    question_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("questions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    learner_profile_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("learner_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_response: Mapped[str] = mapped_column(Text, nullable=False)
    is_correct: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    score_awarded: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    feedback: Mapped[str] = mapped_column(Text, default="", nullable=False)
    response_time_seconds: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    # Relationships
    question: Mapped["Question"] = relationship("Question", back_populates="answers")
    learner_profile: Mapped["LearnerProfile"] = relationship(
        "LearnerProfile", back_populates="answers"
    )

    def __repr__(self) -> str:
        return f"<Answer id={self.id} correct={self.is_correct} score={self.score_awarded}>"
