"""Learner Progress & Analytics Service."""

from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.exceptions import EntityNotFoundException
from backend.app.database.repositories.learner_profile_repository import LearnerProfileRepository
from backend.app.database.repositories.progress_repository import ProgressRepository
from backend.app.schemas.progress import (
    MisconceptionRead,
    ProgressOverviewRead,
    ProgressRead,
    StudyActivityLogRequest,
)


class ProgressService:
    """Service governing learner progress tracking, study activity, and misconception diagnostics."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.profile_repo = LearnerProfileRepository(session)
        self.progress_repo = ProgressRepository(session)

    async def log_activity(self, user_id: str, payload: StudyActivityLogRequest) -> ProgressRead:
        """Log study time and update mastery score."""
        profile = await self.profile_repo.get_by_user_id(user_id)
        if not profile:
            raise EntityNotFoundException("Learner profile not found.")

        record = await self.progress_repo.record_study_activity(
            learner_profile_id=profile.id,
            subject=payload.subject,
            module_id=payload.module_id,
            time_spent_minutes=payload.time_spent_minutes,
            mastery_delta=payload.mastery_delta,
        )

        # Update profile aggregate mastery
        await self.profile_repo.update_mastery(
            profile_id=profile.id,
            subject_or_topic=payload.subject,
            mastery_score=record.mastery_level,
        )

        return ProgressRead.model_validate(record)

    async def get_overview(self, user_id: str) -> ProgressOverviewRead:
        """Generate comprehensive analytics overview for the learner dashboard."""
        profile = await self.profile_repo.get_by_user_id(user_id)
        if not profile:
            raise EntityNotFoundException("Learner profile not found.")

        progress_records = await self.progress_repo.list_by_learner(profile.id)
        misconceptions = await self.progress_repo.list_active_misconceptions(profile.id)

        total_study_minutes = sum(r.total_time_spent_minutes for r in progress_records)
        max_streak = max([r.streak_days for r in progress_records], default=0)
        completed_missions = sum(r.completed_missions_count for r in progress_records)

        subject_mastery: dict[str, float] = {}
        for r in progress_records:
            subject_mastery[r.subject] = max(subject_mastery.get(r.subject, 0.0), r.mastery_level)

        overall_mastery = (
            sum(subject_mastery.values()) / len(subject_mastery) if subject_mastery else 0.0
        )

        return ProgressOverviewRead(
            total_study_minutes=total_study_minutes,
            current_streak_days=max_streak,
            overall_mastery=round(overall_mastery, 2),
            completed_missions=completed_missions,
            active_misconceptions_count=len(misconceptions),
            subject_mastery=subject_mastery,
            recent_progress=[ProgressRead.model_validate(r) for r in progress_records[:10]],
            unresolved_misconceptions=[MisconceptionRead.model_validate(m) for m in misconceptions],
        )

    async def list_misconceptions(self, user_id: str) -> list[MisconceptionRead]:
        """Fetch unresolved misconceptions for learner."""
        profile = await self.profile_repo.get_by_user_id(user_id)
        if not profile:
            raise EntityNotFoundException("Learner profile not found.")

        misconceptions = await self.progress_repo.list_active_misconceptions(profile.id)
        return [MisconceptionRead.model_validate(m) for m in misconceptions]
