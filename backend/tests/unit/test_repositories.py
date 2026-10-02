"""Unit tests for Repository layer."""

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.security import get_password_hash
from backend.app.database.repositories import (
    LearnerProfileRepository,
    LearningSessionRepository,
    ProgressRepository,
    UserRepository,
)


@pytest.mark.asyncio
async def test_user_repository_create_and_get(db_session: AsyncSession):
    user_repo = UserRepository(db_session)
    user = await user_repo.create_user_with_profile(
        email="repo_test@example.com",
        hashed_password=get_password_hash("RepoPass123!"),
        full_name="Repo Tester",
    )
    assert user.id is not None
    assert user.email == "repo_test@example.com"

    fetched = await user_repo.get_by_email("repo_test@example.com")
    assert fetched is not None
    assert fetched.id == user.id


@pytest.mark.asyncio
async def test_learning_session_repository(db_session: AsyncSession, test_user):
    profile_repo = LearnerProfileRepository(db_session)
    profile = await profile_repo.get_by_user_id(test_user.id)
    assert profile is not None

    session_repo = LearningSessionRepository(db_session)
    session_obj = await session_repo.create(
        learner_profile_id=profile.id,
        topic="Neural Networks",
        session_type="tutoring",
        status="active",
        session_metadata={},
    )
    assert session_obj.id is not None

    active = await session_repo.get_active_session(profile.id)
    assert active is not None
    assert active.id == session_obj.id

    completed = await session_repo.complete_session(session_obj.id)
    assert completed is not None
    assert completed.status == "completed"
    assert completed.completed_at is not None


@pytest.mark.asyncio
async def test_progress_repository(db_session: AsyncSession, test_user):
    profile_repo = LearnerProfileRepository(db_session)
    profile = await profile_repo.get_by_user_id(test_user.id)
    assert profile is not None

    progress_repo = ProgressRepository(db_session)
    record = await progress_repo.record_study_activity(
        learner_profile_id=profile.id,
        subject="Computer Science",
        module_id="py-101",
        time_spent_minutes=30,
        mastery_delta=0.1,
    )
    assert record.total_time_spent_minutes == 30
    assert record.mastery_level == 0.1

    # Update again
    record2 = await progress_repo.record_study_activity(
        learner_profile_id=profile.id,
        subject="Computer Science",
        module_id="py-101",
        time_spent_minutes=15,
        mastery_delta=0.05,
    )
    assert record2.total_time_spent_minutes == 45
    assert round(record2.mastery_level, 2) == 0.15
