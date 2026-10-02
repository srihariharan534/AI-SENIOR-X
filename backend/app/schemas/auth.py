"""Authentication Pydantic schemas."""

from pydantic import BaseModel, EmailStr, Field, model_validator

from backend.app.schemas.user import UserRead


class LoginRequest(BaseModel):
    """Login payload supporting email or username."""

    email: str = Field(..., description="Email address or username")
    password: str = Field(..., min_length=1)
    remember_me: bool = Field(default=False)


class RegisterRequest(BaseModel):
    """User registration payload with canonical learner identity fields."""

    email: EmailStr
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")
    full_name: str = Field(..., min_length=2, max_length=255)
    username: str | None = Field(None, min_length=3, max_length=100)
    confirm_password: str | None = None
    learning_goal: str | None = Field("Data Science / AI / Software Engineering", max_length=255)
    grade_level: str = Field("undergraduate")
    preferred_language: str = Field("en")

    @model_validator(mode="after")
    def verify_password_match(self):
        if self.confirm_password and self.password != self.confirm_password:
            raise ValueError("Passwords do not match.")
        return self


class Token(BaseModel):
    """JWT Token response payload."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserRead


class TokenRefreshRequest(BaseModel):
    """Token refresh payload."""

    refresh_token: str


class TokenPayload(BaseModel):
    """Decoded JWT payload."""

    sub: str | None = None
    exp: int | None = None
    type: str | None = None


class ForgotPasswordRequest(BaseModel):
    """Request password reset link."""

    email: EmailStr


class ResetPasswordRequest(BaseModel):
    """Reset password payload with reset token."""

    token: str = Field(..., min_length=10)
    new_password: str = Field(..., min_length=8)


class VerifyEmailRequest(BaseModel):
    """Verify email payload."""

    token: str = Field(..., min_length=10)


class AuthStatusResponse(BaseModel):
    """Generic status message for auth actions."""

    message: str
    success: bool = True
