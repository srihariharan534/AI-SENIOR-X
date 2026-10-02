"""Question database model."""

from typing import TYPE_CHECKING, Any

from sqlalchemy import JSON, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.database.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from backend.app.database.models.answer import Answer
    from backend.app.database.models.assessment import Assessment


class Question(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Question item belonging to an assessment."""

    __tablename__ = "questions"

    assessment_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("assessments.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    question_type: Mapped[str] = mapped_column(
        String(50), default="multiple_choice", nullable=False
    )  # multiple_choice, open_ended, coding
    options: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    correct_answer: Mapped[str] = mapped_column(Text, nullable=False)
    explanation: Mapped[str] = mapped_column(Text, default="", nullable=False)
    points: Mapped[float] = mapped_column(Float, default=10.0, nullable=False)
    difficulty: Mapped[str] = mapped_column(String(50), default="medium", nullable=False)

    # Relationships
    assessment: Mapped["Assessment"] = relationship("Assessment", back_populates="questions")
    answers: Mapped[list["Answer"]] = relationship(
        "Answer",
        back_populates="question",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Question id={self.id} type={self.question_type} points={self.points}>"
