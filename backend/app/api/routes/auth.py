"""Authentication REST Endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, status

from backend.app.api.dependencies import get_auth_service, get_current_user
from backend.app.database.models.user import User
from backend.app.schemas.auth import (
    AuthStatusResponse,
    ForgotPasswordRequest,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
    Token,
    TokenRefreshRequest,
    VerifyEmailRequest,
)
from backend.app.schemas.common import ApiResponse
from backend.app.schemas.user import UserRead
from backend.app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=ApiResponse[Token],
    status_code=status.HTTP_201_CREATED,
    summary="Register a new learner account",
)
async def register(
    payload: RegisterRequest,
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
) -> ApiResponse[Token]:
    """Create a new user account with attached learner profile and generate JWT tokens."""
    token = await auth_service.register(payload)
    return ApiResponse(data=token)


@router.post(
    "/login",
    response_model=ApiResponse[Token],
    status_code=status.HTTP_200_OK,
    summary="Authenticate user and obtain JWT tokens",
)
async def login(
    payload: LoginRequest,
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
) -> ApiResponse[Token]:
    """Verify credentials and return access and refresh JWT tokens."""
    token = await auth_service.authenticate(payload)
    return ApiResponse(data=token)


@router.post(
    "/logout",
    response_model=ApiResponse[AuthStatusResponse],
    status_code=status.HTTP_200_OK,
    summary="Invalidate current session and logout",
)
async def logout(
    current_user: Annotated[User, Depends(get_current_user)],
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
) -> ApiResponse[AuthStatusResponse]:
    """Invalidate authenticated session."""
    res = await auth_service.logout(current_user.id)
    return ApiResponse(data=res)


@router.post(
    "/refresh",
    response_model=ApiResponse[Token],
    status_code=status.HTTP_200_OK,
    summary="Refresh access token",
)
async def refresh_token(
    payload: TokenRefreshRequest,
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
) -> ApiResponse[Token]:
    """Obtain a new access token using a valid refresh token."""
    token = await auth_service.refresh_access_token(payload.refresh_token)
    return ApiResponse(data=token)


@router.get(
    "/me",
    response_model=ApiResponse[UserRead],
    status_code=status.HTTP_200_OK,
    summary="Get current authenticated user profile",
)
async def get_current_user_profile(
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[UserRead]:
    """Retrieve identity and learner profile for the authenticated caller."""
    return ApiResponse(data=UserRead.model_validate(current_user))


@router.post(
    "/forgot-password",
    response_model=ApiResponse[AuthStatusResponse],
    status_code=status.HTTP_200_OK,
    summary="Request a password reset link",
)
async def forgot_password(
    payload: ForgotPasswordRequest,
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
) -> ApiResponse[AuthStatusResponse]:
    """Initiate password recovery flow without account enumeration."""
    res = await auth_service.forgot_password(payload.email)
    return ApiResponse(data=res)


@router.post(
    "/reset-password",
    response_model=ApiResponse[AuthStatusResponse],
    status_code=status.HTTP_200_OK,
    summary="Reset password with a valid token",
)
async def reset_password(
    payload: ResetPasswordRequest,
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
) -> ApiResponse[AuthStatusResponse]:
    """Apply new password using cryptographic reset token."""
    res = await auth_service.reset_password(payload)
    return ApiResponse(data=res)


@router.post(
    "/verify-email",
    response_model=ApiResponse[AuthStatusResponse],
    status_code=status.HTTP_200_OK,
    summary="Verify email address",
)
async def verify_email(
    payload: VerifyEmailRequest,
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
) -> ApiResponse[AuthStatusResponse]:
    """Confirm user email address using verification token."""
    res = await auth_service.verify_email(payload.token)
    return ApiResponse(data=res)
