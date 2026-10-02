"""FastAPI Dependencies for Authentication, Database Sessions, and Services."""

from typing import Annotated

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.exceptions import AuthenticationException, AuthorizationException
from backend.app.core.security import decode_token
from backend.app.database.models.user import User
from backend.app.database.repositories.user_repository import UserRepository
from backend.app.database.session import get_db
from backend.app.services.assessment_service import AssessmentService
from backend.app.services.auth_service import AuthService
from backend.app.services.learning_service import LearningService
from backend.app.services.progress_service import ProgressService
from backend.app.services.recommendation_service import RecommendationService
from backend.app.services.tutor_service import TutorService

security_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    auth: Annotated[HTTPAuthorizationCredentials | None, Depends(security_scheme)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    """Extract and validate the currently authenticated user from Bearer token."""
    if not auth or not auth.credentials:
        raise AuthenticationException("Authentication credentials were not provided.")

    payload = decode_token(auth.credentials)
    if payload.get("type") != "access":
        raise AuthenticationException("Invalid token type. Access token required.")

    user_id = payload.get("sub")
    if not user_id:
        raise AuthenticationException("Invalid token payload.")

    user_repo = UserRepository(db)
    user = await user_repo.get_with_profile(user_id)

    if not user:
        raise AuthenticationException("User not found.")
    if not user.is_active:
        raise AuthenticationException("User account is inactive.")

    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """Ensure current user is active."""
    if not current_user.is_active:
        raise AuthenticationException("Inactive user.")
    return current_user


async def get_current_admin_user(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """Ensure current user has administrative permissions."""
    if current_user.role != "admin":
        raise AuthorizationException("Administrative privileges required.")
    return current_user


# Service Dependency Factories
def get_auth_service(db: Annotated[AsyncSession, Depends(get_db)]) -> AuthService:
    return AuthService(db)


def get_tutor_service(db: Annotated[AsyncSession, Depends(get_db)]) -> TutorService:
    return TutorService(db)


def get_assessment_service(db: Annotated[AsyncSession, Depends(get_db)]) -> AssessmentService:
    return AssessmentService(db)


def get_learning_service(db: Annotated[AsyncSession, Depends(get_db)]) -> LearningService:
    return LearningService(db)


def get_progress_service(db: Annotated[AsyncSession, Depends(get_db)]) -> ProgressService:
    return ProgressService(db)


def get_recommendation_service(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> RecommendationService:
    return RecommendationService(db)
