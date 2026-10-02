"""AI-SENIOR-X Orchestrator Session State Representation."""

from datetime import UTC, datetime
from typing import Any

from pydantic import BaseModel, Field


class OrchestratorState(BaseModel):
    """Execution state tracked across multi-turn agent interactions."""

    session_id: str
    learner_id: str
    current_topic_id: str | None = None
    current_concept_id: str | None = None
    current_subject: str | None = None
    active_agent_name: str = "TutorAgent"
    previous_agent_name: str | None = None
    interaction_turn: int = 0
    recent_intents: list[str] = Field(default_factory=list)
    pending_action: str | None = None
    active_assessment_id: str | None = None
    active_exercise_id: str | None = None
    session_metadata: dict[str, Any] = Field(default_factory=dict)
    last_updated: datetime = Field(default_factory=lambda: datetime.now(UTC))

    def record_turn(
        self,
        agent_name: str,
        intent: str,
        topic_id: str | None = None,
        concept_id: str | None = None,
    ) -> None:
        """Update state with latest turn events."""
        self.previous_agent_name = self.active_agent_name
        self.active_agent_name = agent_name
        self.interaction_turn += 1
        self.recent_intents.append(intent)
        if len(self.recent_intents) > 10:
            self.recent_intents.pop(0)
        if topic_id:
            self.current_topic_id = topic_id
        if concept_id:
            self.current_concept_id = concept_id
        self.last_updated = datetime.now(UTC)
