"""AI-SENIOR-X Immutable Learning Activity History."""

import uuid
from datetime import UTC, datetime
from typing import Any

from pydantic import BaseModel, Field


class LearningEvent(BaseModel):
    """Immutable event record representing an observable learning action."""

    event_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    event_type: str = Field(
        ..., description="e.g. assessment_attempt, session_start, module_complete"
    )
    subject: str
    topic: str
    concept: str = ""
    timestamp: datetime = Field(default_factory=lambda: datetime.now(UTC))
    outcome: str = "success"  # success, failure, neutral
    details: dict[str, Any] = Field(default_factory=dict)


class LearningHistory(BaseModel):
    """Sequence of historical learning events for progress reconstruction."""

    events: list[LearningEvent] = Field(default_factory=list)

    def log_event(
        self,
        event_type: str,
        subject: str,
        topic: str,
        concept: str = "",
        outcome: str = "success",
        details: dict[str, Any] = None,
    ) -> LearningEvent:
        """Append an event to the chronological history."""
        event = LearningEvent(
            event_type=event_type,
            subject=subject,
            topic=topic,
            concept=concept,
            outcome=outcome,
            details=details or {},
        )
        self.events.append(event)
        return event

    def get_recent_events(self, limit: int = 20) -> list[LearningEvent]:
        """Retrieve recent events in reverse chronological order."""
        return sorted(self.events, key=lambda e: e.timestamp, reverse=True)[:limit]

    def count_by_type(self, event_type: str) -> int:
        return sum(1 for e in self.events if e.event_type == event_type)
