"""Assessment and Grading Service."""

from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.exceptions import EntityNotFoundException
from backend.app.database.repositories.assessment_repository import AssessmentRepository
from backend.app.database.repositories.learner_profile_repository import LearnerProfileRepository
from backend.app.database.repositories.progress_repository import ProgressRepository
from backend.app.schemas.assessment import (
    AnswerResultRead,
    AnswerSubmitRequest,
    AssessmentCreate,
    AssessmentDetailRead,
    AssessmentRead,
)


class AssessmentService:
    """Service governing assessments, question generation, and grading."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.assessment_repo = AssessmentRepository(session)
        self.profile_repo = LearnerProfileRepository(session)
        self.progress_repo = ProgressRepository(session)

    async def create_assessment(
        self, user_id: str, payload: AssessmentCreate
    ) -> AssessmentDetailRead:
        """Create a new assessment with initial questions."""
        profile = await self.profile_repo.get_by_user_id(user_id)
        if not profile:
            raise EntityNotFoundException("Learner profile not found.")

        assessment = await self.assessment_repo.create(
            learner_profile_id=profile.id,
            title=payload.title,
            subject=payload.subject,
            difficulty=payload.difficulty,
            status="in_progress",
            total_score=0.0,
            max_score=payload.max_score,
        )

        if payload.questions:
            for q in payload.questions:
                await self.assessment_repo.add_question(
                    assessment_id=assessment.id,
                    prompt=q.prompt,
                    correct_answer=q.correct_answer,
                    options=q.options,
                    question_type=q.question_type,
                    explanation=q.explanation,
                    points=q.points,
                    difficulty=q.difficulty,
                )

        detailed = await self.assessment_repo.get_with_questions(assessment.id)
        return AssessmentDetailRead.model_validate(detailed)

    async def get_assessment(self, user_id: str, assessment_id: str) -> AssessmentDetailRead:
        """Retrieve assessment details with question items."""
        profile = await self.profile_repo.get_by_user_id(user_id)
        if not profile:
            raise EntityNotFoundException("Learner profile not found.")

        assessment = await self.assessment_repo.get_with_questions(assessment_id)
        if not assessment or assessment.learner_profile_id != profile.id:
            raise EntityNotFoundException("Assessment not found.")

        return AssessmentDetailRead.model_validate(assessment)

    async def list_user_assessments(
        self, user_id: str, limit: int = 50, skip: int = 0
    ) -> list[AssessmentRead]:
        """List assessments for learner."""
        profile = await self.profile_repo.get_by_user_id(user_id)
        if not profile:
            raise EntityNotFoundException("Learner profile not found.")
        records = await self.assessment_repo.list_by_learner(profile.id, limit=limit, skip=skip)
        return [AssessmentRead.model_validate(r) for r in records]

    async def submit_answer(
        self, user_id: str, assessment_id: str, payload: AnswerSubmitRequest
    ) -> AnswerResultRead:
        """Evaluate an answer, update assessment score, and record misconception if wrong."""
        profile = await self.profile_repo.get_by_user_id(user_id)
        if not profile:
            raise EntityNotFoundException("Learner profile not found.")

        assessment = await self.assessment_repo.get_with_questions(assessment_id)
        if not assessment or assessment.learner_profile_id != profile.id:
            raise EntityNotFoundException("Assessment not found.")

        target_question = next(
            (q for q in assessment.questions if q.id == payload.question_id), None
        )
        if not target_question:
            raise EntityNotFoundException("Question not found in this assessment.")

        # Deterministic grading
        is_correct = (
            payload.user_response.strip().lower() == target_question.correct_answer.strip().lower()
        )
        score_awarded = target_question.points if is_correct else 0.0
        feedback = (
            "Correct! Well done."
            if is_correct
            else f"Incorrect. The correct answer is: {target_question.correct_answer}"
        )

        answer = await self.assessment_repo.record_answer(
            question_id=target_question.id,
            learner_profile_id=profile.id,
            user_response=payload.user_response,
            is_correct=is_correct,
            score_awarded=score_awarded,
            feedback=feedback,
            response_time_seconds=payload.response_time_seconds,
        )

        # Update total score
        assessment.total_score += score_awarded
        self.session.add(assessment)
        await self.session.flush()

        # If incorrect, record a misconception tag for diagnostic tracking
        if not is_correct:
            await self.progress_repo.log_misconception(
                learner_profile_id=profile.id,
                concept_key=assessment.subject,
                misconception_tag=f"misconception_{target_question.id[:8]}",
                description=f"Incorrect answer on question: '{target_question.prompt[:100]}...'",
                severity="moderate",
            )

        return AnswerResultRead(
            id=answer.id,
            question_id=target_question.id,
            is_correct=is_correct,
            score_awarded=score_awarded,
            feedback=feedback,
            correct_answer=target_question.correct_answer,
            explanation=target_question.explanation,
        )
