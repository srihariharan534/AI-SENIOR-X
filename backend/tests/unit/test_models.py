"""Unit tests for SQLAlchemy Database Models."""

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.security import get_password_hash
from backend.app.database.models import (
    Assessment,
    LearnerProfile,
    Question,
    User,
)


@pytest.mark.asyncio
async def test_user_and_profile_relationship(db_session: AsyncSession):
    user = User(
        email="test_model@example.com",
        hashed_password=get_password_hash("Secret123!"),
        full_name="Model User",
        role="learner",
    )
    db_session.add(user)
    await db_session.flush()

    profile = LearnerProfile(
        user_id=user.id,
        grade_level="undergraduate",
        preferred_language="en",
        learning_style="visual_interactive",
        target_goals={"focus": "AI"},
        mastery_scores={},
        cognitive_twin_state={},
    )
    db_session.add(profile)
    await db_session.commit()

    assert user.id is not None
    assert profile.user_id == user.id
    assert user.created_at is not None


@pytest.mark.asyncio
async def test_assessment_and_question_cascade(db_session: AsyncSession):
    user = User(
        email="test_assessment@example.com",
        hashed_password=get_password_hash("Secret123!"),
        full_name="Assessment User",
    )
    db_session.add(user)
    await db_session.flush()

    profile = LearnerProfile(
        user_id=user.id,
        grade_level="undergraduate",
        preferred_language="en",
        learning_style="visual_interactive",
        target_goals={},
        mastery_scores={},
        cognitive_twin_state={},
    )
    db_session.add(profile)
    await db_session.flush()

    assessment = Assessment(
        learner_profile_id=profile.id,
        title="ML Basics",
        subject="AI",
        difficulty="beginner",
    )
    db_session.add(assessment)
    await db_session.flush()

    question = Question(
        assessment_id=assessment.id,
        prompt="What is a tensor?",
        correct_answer="Multi-dimensional array",
        options={"A": "Multi-dimensional array", "B": "A database"},
        points=10.0,
    )
    db_session.add(question)
    await db_session.commit()

    assert assessment.id is not None
    assert question.assessment_id == assessment.id
