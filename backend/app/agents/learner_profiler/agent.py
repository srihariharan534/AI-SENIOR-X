"""AI-SENIOR-X Learner Profiler Agent."""

from backend.app.agents.contract import AgentRequest, AgentResponse, BaseEducationalAgent
from backend.app.learning_twin.evidence import FeedbackEvidence


class LearnerProfilerAgent(BaseEducationalAgent):
    """Specialized agent modeling learner cognitive dimensions, pace, goals, and style."""

    @property
    def name(self) -> str:
        return "LearnerProfilerAgent"

    @property
    def capabilities(self) -> list[str]:
        return [
            "profile_construction",
            "pace_estimation",
            "learning_style_inference",
            "cognitive_load_monitoring",
            "goal_tracking",
        ]

    async def process(self, request: AgentRequest) -> AgentResponse:
        """Analyze learner history and construct or update cognitive profile."""
        payload = request.payload
        learner_ctx = request.learner_context

        target_style = payload.get(
            "preferred_style", learner_ctx.get("preferred_style", "visual_interactive")
        )
        current_level = payload.get(
            "current_level", learner_ctx.get("current_level", "undergraduate")
        )
        goals = payload.get("learning_goals", ["Master AI/ML & Python Fundamentals"])

        # Determine evidence-based learning pace
        pace = "moderate"
        session_count = payload.get("session_count", 1)
        if session_count > 10:
            pace = "accelerated"

        # Construct twin snapshot representation
        profile_summary = {
            "learner_id": request.learner_id,
            "current_level": current_level,
            "learning_goals": goals,
            "preferred_style": target_style,
            "estimated_pace": pace,
            "recommended_starting_subject": payload.get("primary_subject", "AI/ML"),
        }

        evidence = FeedbackEvidence(
            learner_id=request.learner_id,
            session_id=request.session_id,
            rating=5,
            feedback_category="profiler_update",
            notes=f"Profiler updated style={target_style}, level={current_level}, pace={pace}",
        )

        content = (
            f"**Learner Profile Synchronized**\n\n"
            f"- **Level**: {current_level.capitalize()}\n"
            f"- **Primary Goals**: {', '.join(goals)}\n"
            f"- **Preferred Modality**: {target_style.replace('_', ' ').title()}\n"
            f"- **Learning Pace**: {pace.capitalize()}"
        )

        return AgentResponse(
            request_id=request.request_id,
            agent_name=self.name,
            status="success",
            result=profile_summary,
            content=content,
            evidence=[evidence],
            confidence=0.95,
            next_suggested_action="RECOMMEND",
        )
