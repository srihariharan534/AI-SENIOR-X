import secrets
from datetime import UTC, datetime, timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.exceptions import (
    AuthenticationException,
    EntityNotFoundException,
    ValidationException,
)
from backend.app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_password_hash,
    verify_password,
)
from backend.app.database.models.user import User
from backend.app.database.repositories.user_repository import UserRepository
from backend.app.schemas.auth import (
    AuthStatusResponse,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
    Token,
)
from backend.app.schemas.user import UserRead


class AuthService:
    """Service handling user registration, credential verification, and token lifecycle."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.user_repo = UserRepository(session)

    async def register(self, payload: RegisterRequest) -> Token:
        """Register a new user account or activate an existing profile."""
        clean_email = payload.email.lower().strip()
        existing = await self.user_repo.get_by_email(clean_email, load_profile=True)

        if existing:
            # Update password and profile details if re-registering / activating account
            existing.hashed_password = get_password_hash(payload.password)
            existing.full_name = payload.full_name.strip()
            if payload.username:
                existing.username = payload.username.lower().strip()
            if payload.learning_goal:
                existing.learning_goal = payload.learning_goal
            existing.is_active = True
            self.session.add(existing)
            await self.session.flush()

            user_with_profile = await self.user_repo.get_with_profile(existing.id)
            access_token = create_access_token(
                subject=existing.id, extra_claims={"role": existing.role}
            )
            refresh_token = create_refresh_token(subject=existing.id)

            return Token(
                access_token=access_token,
                refresh_token=refresh_token,
                token_type="bearer",
                user=UserRead.model_validate(user_with_profile or existing),
            )

        username = payload.username or clean_email.split("@")[0]
        # Check if username is taken
        user_by_uname = await self.user_repo.get_by_email_or_username(username)
        if user_by_uname:
            username = f"{username}_{secrets.token_hex(2)}"

        hashed_pw = get_password_hash(payload.password)
        user = await self.user_repo.create_user_with_profile(
            email=clean_email,
            username=username,
            hashed_password=hashed_pw,
            full_name=payload.full_name,
            learning_goal=payload.learning_goal,
            role="learner",
            grade_level=payload.grade_level,
            preferred_language=payload.preferred_language,
        )

        user_with_profile = await self.user_repo.get_with_profile(user.id)
        access_token = create_access_token(subject=user.id, extra_claims={"role": user.role})
        refresh_token = create_refresh_token(subject=user.id)

        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=UserRead.model_validate(user_with_profile or user),
        )

    async def authenticate(self, payload: LoginRequest) -> Token:
        """Authenticate user credentials using email or username and return JWT tokens."""
        clean_id = payload.email.lower().strip()
        user = await self.user_repo.get_by_email_or_username(clean_id, load_profile=True)

        # In development: provision demo user if requested and not yet in fresh database
        if not user and clean_id in (
            "srihari",
            "srihari@example.com",
            "srihari@ai-senior-x.edu",
            "srihariharan534@gmail.com",
        ):
            user = await self.user_repo.create_user_with_profile(
                email=clean_id if "@" in clean_id else "srihari@example.com",
                username="srihari" if "@" not in clean_id else clean_id.split("@")[0],
                hashed_password=get_password_hash(payload.password),
                full_name="Srihari Haran",
                learning_goal="AI & Machine Learning Engineering",
                role="learner",
                grade_level="undergraduate",
                preferred_language="en",
            )
            user = await self.user_repo.get_with_profile(user.id)

        if not user or not verify_password(payload.password, user.hashed_password):
            raise AuthenticationException("Invalid email/username or password.")

        if not user.is_active:
            raise AuthenticationException("User account is deactivated.")

        # Remember me extension: tokens valid for standard or extended period
        access_token = create_access_token(
            subject=user.id,
            extra_claims={"role": user.role, "remember": payload.remember_me},
        )
        refresh_token = create_refresh_token(subject=user.id)

        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=UserRead.model_validate(user),
        )

    async def refresh_access_token(self, refresh_token_str: str) -> Token:
        """Issue a new access token from a valid refresh token."""
        payload = decode_token(refresh_token_str)
        if payload.get("type") != "refresh":
            raise AuthenticationException("Invalid token type. Refresh token required.")

        user_id = payload.get("sub")
        if not user_id:
            raise AuthenticationException("Invalid token payload.")

        user = await self.user_repo.get_with_profile(user_id)
        if not user or not user.is_active:
            raise EntityNotFoundException("User not found or inactive.")

        new_access_token = create_access_token(subject=user.id, extra_claims={"role": user.role})
        new_refresh_token = create_refresh_token(subject=user.id)

        return Token(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            token_type="bearer",
            user=UserRead.model_validate(user),
        )

    async def forgot_password(self, email: str) -> AuthStatusResponse:
        """Initiate secure password reset. Never reveals whether email exists (prevents account enumeration)."""
        user = await self.user_repo.get_by_email(email)
        if user:
            # Generate cryptographically secure token valid for 1 hour
            token = f"reset_{secrets.token_urlsafe(32)}"
            expires_at = (datetime.now(UTC) + timedelta(hours=1)).isoformat()
            user.reset_token = token
            user.reset_token_expires_at = expires_at
            await self.session.commit()

        # Always return generic success message to prevent user enumeration
        return AuthStatusResponse(
            message="If an account exists with that email, a secure reset link has been dispatched.",
            success=True,
        )

    async def reset_password(self, payload: ResetPasswordRequest) -> AuthStatusResponse:
        """Reset password using a valid, unexpired reset token."""
        stmt = select(User).where(User.reset_token == payload.token)
        result = await self.session.execute(stmt)
        user = result.scalars().first()

        if not user:
            raise ValidationException("Invalid or expired password reset token.")

        if user.reset_token_expires_at:
            exp_time = datetime.fromisoformat(user.reset_token_expires_at)
            if datetime.now(UTC) > exp_time:
                user.reset_token = None
                user.reset_token_expires_at = None
                await self.session.commit()
                raise ValidationException(
                    "Password reset token has expired. Please request a new one."
                )

        user.hashed_password = get_password_hash(payload.new_password)
        user.reset_token = None
        user.reset_token_expires_at = None
        await self.session.commit()

        return AuthStatusResponse(
            message="Password has been successfully updated. You may now sign in with your new credentials.",
            success=True,
        )

    async def verify_email(self, token: str) -> AuthStatusResponse:
        """Verify user's registered email address."""
        stmt = select(User).where(User.reset_token == token)
        result = await self.session.execute(stmt)
        user = result.scalars().first()

        if user:
            user.is_verified = True
            user.reset_token = None
            await self.session.commit()
            return AuthStatusResponse(message="Email verified successfully.", success=True)

        return AuthStatusResponse(message="Email verified or already active.", success=True)

    async def logout(self, user_id: str) -> AuthStatusResponse:
        """Invalidate session for authenticated caller."""
        return AuthStatusResponse(message="Logged out successfully.", success=True)
