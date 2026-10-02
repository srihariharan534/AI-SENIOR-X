"""User Repository implementation."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.app.database.models.learner_profile import LearnerProfile
from backend.app.database.models.user import User
from backend.app.database.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    """Repository handling database interactions for User entities."""

    def __init__(self, session: AsyncSession):
        super().__init__(User, session)

    async def get_by_email(self, email: str, load_profile: bool = False) -> User | None:
        """Fetch user by email address."""
        stmt = select(User).where(User.email == email.lower().strip())
        if load_profile:
            stmt = stmt.options(selectinload(User.learner_profile))
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_by_email_or_username(
        self, identifier: str, load_profile: bool = False
    ) -> User | None:
        """Fetch user by email address or username."""
        clean_id = identifier.lower().strip()
        stmt = select(User).where((User.email == clean_id) | (User.username == clean_id))
        if load_profile:
            stmt = stmt.options(selectinload(User.learner_profile))
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_with_profile(self, user_id: str) -> User | None:
        """Fetch user by ID with eager loading of LearnerProfile."""
        stmt = select(User).where(User.id == user_id).options(selectinload(User.learner_profile))
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def create_user_with_profile(
        self,
        email: str,
        hashed_password: str,
        full_name: str,
        username: str | None = None,
        learning_goal: str | None = None,
        role: str = "learner",
        grade_level: str = "undergraduate",
        preferred_language: str = "en",
    ) -> User:
        """Atomically create a user and associate an initial learner profile."""
        clean_email = email.lower().strip()
        clean_username = username.lower().strip() if username else clean_email.split("@")[0]
        user = User(
            email=clean_email,
            username=clean_username,
            hashed_password=hashed_password,
            full_name=full_name.strip(),
            role=role,
            preferred_language=preferred_language,
            learning_goal=learning_goal,
            is_active=True,
            is_verified=False,
        )
        self.session.add(user)
        await self.session.flush()

        profile = LearnerProfile(
            user_id=user.id,
            grade_level=grade_level,
            preferred_language=preferred_language,
            learning_style="visual_interactive",
            target_goals={"primary_focus": learning_goal or "mastery", "daily_target_minutes": 30},
            mastery_scores={},
            cognitive_twin_state={"knowledge_nodes_visited": 0, "confidence_index": 0.5},
        )
        self.session.add(profile)
        await self.session.flush()
        await self.session.refresh(user)
        return user
