"""Assessment Repository implementation."""

from collections.abc import Sequence
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.app.database.models.answer import Answer
from backend.app.database.models.assessment import Assessment
from backend.app.database.models.question import Question
from backend.app.database.repositories.base import BaseRepository


class AssessmentRepository(BaseRepository[Assessment]):
    """Repository handling database operations for Assessments, Questions, and Answers."""

    def __init__(self, session: AsyncSession):
        super().__init__(Assessment, session)

    async def get_with_questions(self, assessment_id: str) -> Assessment | None:
        """Fetch assessment with nested questions."""
        stmt = (
            select(Assessment)
            .where(Assessment.id == assessment_id)
            .options(selectinload(Assessment.questions))
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def list_by_learner(
        self, learner_profile_id: str, limit: int = 50, skip: int = 0
    ) -> Sequence[Assessment]:
        """List assessments for a specific learner profile."""
        stmt = (
            select(Assessment)
            .where(Assessment.learner_profile_id == learner_profile_id)
            .order_by(Assessment.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def add_question(
        self,
        assessment_id: str,
        prompt: str,
        correct_answer: str,
        options: dict[str, Any] | None = None,
        question_type: str = "multiple_choice",
        explanation: str = "",
        points: float = 10.0,
        difficulty: str = "medium",
    ) -> Question:
        """Add a question item to an assessment."""
        question = Question(
            assessment_id=assessment_id,
            prompt=prompt,
            correct_answer=correct_answer,
            options=options or {},
            question_type=question_type,
            explanation=explanation,
            points=points,
            difficulty=difficulty,
        )
        self.session.add(question)
        await self.session.flush()
        return question

    async def record_answer(
        self,
        question_id: str,
        learner_profile_id: str,
        user_response: str,
        is_correct: bool,
        score_awarded: float,
        feedback: str = "",
        response_time_seconds: float = 0.0,
    ) -> Answer:
        """Persist a learner's answer and score."""
        answer = Answer(
            question_id=question_id,
            learner_profile_id=learner_profile_id,
            user_response=user_response,
            is_correct=is_correct,
            score_awarded=score_awarded,
            feedback=feedback,
            response_time_seconds=response_time_seconds,
        )
        self.session.add(answer)
        await self.session.flush()
        return answer
