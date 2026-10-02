"""Unit tests for Service layer."""

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.schemas.assessment import AnswerSubmitRequest, AssessmentCreate, QuestionCreate
from backend.app.schemas.auth import LoginRequest, RegisterRequest
from backend.app.schemas.progress import StudyActivityLogRequest
from backend.app.services import (
    AssessmentService,
    AuthService,
    ProgressService,
    RecommendationService,
)


@pytest.mark.asyncio
async def test_auth_service_register_and_login(db_session: AsyncSession):
    auth_service = AuthService(db_session)
    reg_req = RegisterRequest(
        email="service_test@example.com",
        password="ValidPassword123!",
        full_name="Service Test",
    )
    token = await auth_service.register(reg_req)
    assert token.access_token is not None
    assert token.user.email == "service_test@example.com"

    # Login with valid credentials
    login_req = LoginRequest(
        email="service_test@example.com",
        password="ValidPassword123!",
    )
    login_token = await auth_service.authenticate(login_req)
    assert login_token.access_token is not None


@pytest.mark.asyncio
async def test_assessment_service_flow(db_session: AsyncSession, test_user):
    service = AssessmentService(db_session)
    payload = AssessmentCreate(
        title="Diagnostic Quiz",
        subject="AI",
        questions=[
            QuestionCreate(
                prompt="Is Python interpreted?",
                correct_answer="Yes",
                options={"A": "Yes", "B": "No"},
                points=10.0,
            )
        ],
    )
    assessment = await service.create_assessment(test_user.id, payload)
    assert assessment.id is not None
    assert len(assessment.questions) == 1

    question_id = assessment.questions[0].id
    answer_res = await service.submit_answer(
        test_user.id,
        assessment.id,
        AnswerSubmitRequest(question_id=question_id, user_response="Yes"),
    )
    assert answer_res.is_correct is True
    assert answer_res.score_awarded == 10.0


@pytest.mark.asyncio
async def test_progress_and_recommendation_services(db_session: AsyncSession, test_user):
    progress_service = ProgressService(db_session)
    rec_service = RecommendationService(db_session)

    await progress_service.log_activity(
        test_user.id,
        StudyActivityLogRequest(
            subject="Computer Science",
            module_id="py-101",
            time_spent_minutes=25,
            mastery_delta=0.2,
        ),
    )

    overview = await progress_service.get_overview(test_user.id)
    assert overview.total_study_minutes >= 25

    recs = await rec_service.get_personalized_recommendations(test_user.id)
    assert len(recs) > 0
