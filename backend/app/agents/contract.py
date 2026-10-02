"""AI-SENIOR-X Standardized Agent Message Contracts and Base Agent."""

import uuid
from abc import ABC, abstractmethod
from datetime import UTC, datetime
from typing import Any

from pydantic import BaseModel, Field

from backend.app.learning_twin.evidence import BaseEvidence


class AgentRequest(BaseModel):
    """Normalized structured request sent to any specialized educational agent."""

    request_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    learner_id: str
    session_id: str | None = None
    intent: str
    query: str
    topic_id: str | None = None
    concept_id: str | None = None
    subject: str | None = None
    learner_context: dict[str, Any] = Field(default_factory=dict)
    curriculum_context: dict[str, Any] = Field(default_factory=dict)
    rag_context: str | None = None
    payload: dict[str, Any] = Field(default_factory=dict)
    language: str = "en"
    timestamp: datetime = Field(default_factory=lambda: datetime.now(UTC))


class AgentResponse(BaseModel):
    """Normalized structured response emitted by any specialized educational agent."""

    request_id: str
    agent_name: str
    status: str = "success"  # success, warning, error, fallback
    result: dict[str, Any] = Field(default_factory=dict)
    content: str = ""
    evidence: list[BaseEvidence] = Field(default_factory=list)
    confidence: float = Field(default=0.90, ge=0.0, le=1.0)
    next_suggested_action: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)
    timestamp: datetime = Field(default_factory=lambda: datetime.now(UTC))


class BaseEducationalAgent(ABC):
    """Base class for all specialized AI-SENIOR-X educational agents."""

    @property
    @abstractmethod
    def name(self) -> str:
        """Unique identifier of the agent."""
        pass

    @property
    @abstractmethod
    def capabilities(self) -> list[str]:
        """List of pedagogical capabilities provided by this agent."""
        pass

    @abstractmethod
    async def process(self, request: AgentRequest) -> AgentResponse:
        """Execute the agent reasoning cycle on the typed request."""
        pass

    async def execute(
        self, task_input: dict[str, Any], context: dict[str, Any] | None = None
    ) -> dict[str, Any]:
        """Backward compatibility adapter for raw BaseAgent dictionaries."""
        req = AgentRequest(
            learner_id=task_input.get("learner_id", "anonymous"),
            session_id=task_input.get("session_id"),
            intent=task_input.get("intent", "GENERAL"),
            query=task_input.get("query", task_input.get("topic", "")),
            topic_id=task_input.get("topic_id"),
            concept_id=task_input.get("concept_id"),
            payload=task_input,
            learner_context=context or {},
        )
        res = await self.process(req)
        return res.model_dump()
