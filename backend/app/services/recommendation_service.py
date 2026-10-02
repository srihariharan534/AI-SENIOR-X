"""Recommendation Engine Service."""

from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.exceptions import EntityNotFoundException
from backend.app.database.repositories.learner_profile_repository import LearnerProfileRepository
from backend.app.database.repositories.progress_repository import ProgressRepository
from backend.app.schemas.learning import LearningRecommendation


class RecommendationService:
    """Generates personalized learning recommendations based on learner state and detected gaps."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.profile_repo = LearnerProfileRepository(session)
        self.progress_repo = ProgressRepository(session)

    async def get_personalized_recommendations(
        self, user_id: str, limit: int = 5
    ) -> list[LearningRecommendation]:
        """Compute top recommendations for the learner."""
        profile = await self.profile_repo.get_by_user_id(user_id)
        if not profile:
            raise EntityNotFoundException("Learner profile not found.")

        misconceptions = await self.progress_repo.list_active_misconceptions(profile.id)
        recommendations: list[LearningRecommendation] = []

        # 1. Address active misconceptions (Highest Priority)
        for misc in misconceptions[:3]:
            recommendations.append(
                LearningRecommendation(
                    id=f"rec-misc-{misc.id[:8]}",
                    title=f"Resolve Misconception: {misc.concept_key}",
                    recommendation_type="review",
                    reason=f"Targeted review detected from recent assessment performance: {misc.description}",
                    target_concept=misc.concept_key,
                    priority=1,
                    estimated_minutes=15,
                )
            )

        # 2. Reinforce lower-mastery subjects
        mastery_scores = profile.mastery_scores or {}
        for subject, score in mastery_scores.items():
            if score < 0.7:
                recommendations.append(
                    LearningRecommendation(
                        id=f"rec-practice-{subject[:6]}",
                        title=f"Mastery Booster: {subject}",
                        recommendation_type="practice",
                        reason=f"Current mastery is {int(score * 100)}%. Targeted practice will accelerate fluency.",
                        target_concept=subject,
                        priority=2,
                        estimated_minutes=20,
                    )
                )

        # 3. Default recommendation if no gaps detected
        if not recommendations:
            recommendations.append(
                LearningRecommendation(
                    id="rec-general-01",
                    title="Deepen Core Foundations: Python & Neural Networks",
                    recommendation_type="mission",
                    reason="Recommended starting point for building complete fluency across the AI curriculum.",
                    target_concept="Computer Science",
                    priority=3,
                    estimated_minutes=30,
                )
            )

        return recommendations[:limit]
