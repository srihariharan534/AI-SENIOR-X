"""AI-SENIOR-X Practice Agent."""

from backend.app.agents.contract import AgentRequest, AgentResponse, BaseEducationalAgent
from backend.app.agents.practice.exercise_generator import (
    PracticeExercise,
    PracticeExerciseGenerator,
)
from backend.app.learning_twin.evidence import PracticeEvidence


class PracticeAgent(BaseEducationalAgent):
    """Specialized agent creating targeted, adaptive coding and conceptual practice exercises."""

    @property
    def name(self) -> str:
        return "PracticeAgent"

    @property
    def capabilities(self) -> list[str]:
        return [
            "interactive_coding_exercises",
            "targeted_weakness_remediation",
            "debugging_challenges",
            "hint_generation",
            "practice_evidence_tracking",
        ]

    async def process(self, request: AgentRequest) -> AgentResponse:
        """Generate targeted interactive practice exercises for learner."""
        learner_ctx = request.learner_context or {}
        topic_id = request.topic_id or request.query or "py_basics"
        concept_id = request.concept_id or topic_id.lower().replace(" ", "_")
        difficulty = float(learner_ctx.get("mastery", 0.50))
        target_weakness = learner_ctx.get("active_misconception_name")

        exercise: PracticeExercise = PracticeExerciseGenerator.generate_exercise(
            topic_id=topic_id,
            concept_id=concept_id,
            difficulty=difficulty,
            target_weakness=target_weakness,
        )

        content_lines = [
            f"### Practice Challenge: {exercise.title}\n",
            f"**Objective:** {exercise.prompt_instruction}\n",
        ]
        if exercise.starter_code:
            content_lines.append(f"```python\n{exercise.starter_code}\n```\n")

        if exercise.hints:
            content_lines.append(f"💡 **Hint 1:** {exercise.hints[0]}")

        content = "\n".join(content_lines)

        evidence = PracticeEvidence(
            learner_id=request.learner_id,
            session_id=request.session_id,
            concept_id=concept_id,
            topic_id=topic_id,
            exercise_id=exercise.exercise_id,
            attempts=1,
            success=False,
            hints_used=0,
            time_spent_seconds=0.0,
            notes="Practice exercise initiated",
        )

        return AgentResponse(
            request_id=request.request_id,
            agent_name=self.name,
            status="success",
            result=exercise.model_dump(),
            content=content,
            evidence=[evidence],
            confidence=0.95,
            next_suggested_action="GRADE",
        )
