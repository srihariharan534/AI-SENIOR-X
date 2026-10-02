"""AI-SENIOR-X Recommendation Agent."""

from backend.app.agents.contract import AgentRequest, AgentResponse, BaseEducationalAgent
from backend.app.agents.recommendation.next_best_lesson import (
    CandidateLesson,
    NextBestLessonRanker,
    next_best_lesson_ranker,
)
from backend.app.learning_twin.evidence import FeedbackEvidence


class RecommendationAgent(BaseEducationalAgent):
    """Specialized agent computing explainable, evidence-backed next-best learning actions."""

    def __init__(self, ranker: NextBestLessonRanker | None = None):
        self.ranker = ranker or next_best_lesson_ranker

    @property
    def name(self) -> str:
        return "RecommendationAgent"

    @property
    def capabilities(self) -> list[str]:
        return [
            "next_best_lesson_selection",
            "prerequisite_gap_analysis",
            "review_prioritization",
            "learning_path_recommendation",
            "explainable_pedagogical_ranking",
        ]

    async def process(self, request: AgentRequest) -> AgentResponse:
        """Compute top learning recommendations for the learner."""
        learner_ctx = request.learner_context or {}
        knowledge_map = learner_ctx.get("knowledge_map", {})
        active_misconceptions = learner_ctx.get("active_misconceptions", [])
        overdue_reviews = learner_ctx.get("overdue_reviews", [])
        goal_subject = str(learner_ctx.get("primary_subject", "AI/ML"))

        candidates: list[CandidateLesson] = self.ranker.rank_next_actions(
            knowledge_map=knowledge_map,
            active_misconceptions=active_misconceptions,
            overdue_reviews=overdue_reviews,
            primary_goal_subject=goal_subject,
        )

        top_rec = candidates[0] if candidates else None

        content_lines = ["### Recommended Next Learning Steps\n"]
        for idx, item in enumerate(candidates, 1):
            badge = f"[{item.action_type.value}]"
            content_lines.append(
                f"**{idx}. {badge} {item.topic_name}** ({item.estimated_duration_minutes} min)"
            )
            content_lines.append(f"   *Why:* {item.rationale}\n")

        content = "\n".join(content_lines)

        evidence = FeedbackEvidence(
            learner_id=request.learner_id,
            session_id=request.session_id,
            rating=5,
            feedback_category="recommendation_generated",
            notes=f"Top recommendation: {top_rec.topic_name if top_rec else 'None'}",
        )

        next_action = top_rec.action_type.value if top_rec else "LEARN"

        return AgentResponse(
            request_id=request.request_id,
            agent_name=self.name,
            status="success",
            result={"recommendations": [c.model_dump() for c in candidates]},
            content=content,
            evidence=[evidence],
            confidence=0.95,
            next_suggested_action=next_action,
        )
