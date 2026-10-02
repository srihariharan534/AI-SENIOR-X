"""AI-SENIOR-X Mission Agent."""

from backend.app.agents.contract import AgentRequest, AgentResponse, BaseEducationalAgent
from backend.app.agents.mission.mission_generator import LearningMission, MissionGenerator
from backend.app.learning_twin.evidence import CompletionEvidence


class MissionAgent(BaseEducationalAgent):
    """Specialized agent coordinating long-range learning quests and capstone missions."""

    @property
    def name(self) -> str:
        return "MissionAgent"

    @property
    def capabilities(self) -> list[str]:
        return [
            "learning_mission_generation",
            "quest_milestone_tracking",
            "reward_calculation",
            "capstone_challenge_orchestration",
        ]

    async def process(self, request: AgentRequest) -> AgentResponse:
        """Construct structured learning mission aligned to learner roadmap."""
        topic_id = request.topic_id or request.query or "ml_supervised"
        topic_name = request.payload.get("topic_name", topic_id.replace("_", " ").title())
        subject = request.subject or "AI/ML"
        difficulty = request.payload.get("difficulty_level", "Intermediate")

        mission: LearningMission = MissionGenerator.generate_mission_for_topic(
            topic_id=topic_id,
            topic_name=topic_name,
            subject=subject,
            difficulty_level=difficulty,
        )

        content_lines = [
            f"### 🎯 Active Quest: {mission.title}\n",
            f"**Objective:** {mission.description}\n",
            f"**XP Reward:** {mission.total_xp_reward} XP | **Badge:** 🏆 {mission.badge_name}\n",
            "**Milestone Steps:**",
        ]
        for t in mission.tasks:
            content_lines.append(f"- [ ] **{t.title}** (+{t.xp_reward} XP)")

        content = "\n".join(content_lines)

        evidence = CompletionEvidence(
            learner_id=request.learner_id,
            session_id=request.session_id,
            topic_id=topic_id,
            item_type="mission",
            item_id=mission.mission_id,
            time_spent_seconds=0.0,
            notes=f"Mission '{mission.title}' activated",
        )

        return AgentResponse(
            request_id=request.request_id,
            agent_name=self.name,
            status="success",
            result=mission.model_dump(),
            content=content,
            evidence=[evidence],
            confidence=0.95,
            next_suggested_action="LEARN",
        )
