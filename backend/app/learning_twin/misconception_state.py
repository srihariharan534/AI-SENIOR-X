"""AI-SENIOR-X Misconception State Tracking Model."""

import uuid
from datetime import UTC, datetime

from pydantic import BaseModel, Field


class MisconceptionItem(BaseModel):
    """Detailed record of a diagnosed cognitive misconception."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    concept_key: str
    misconception_tag: str
    description: str
    severity: str = "moderate"  # minor, moderate, critical
    status: str = "active"  # active, addressed, resolved
    confidence: float = Field(0.85, ge=0.0, le=1.0)
    observation_count: int = 1
    first_detected_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    last_observed_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    resolution_notes: str | None = None

    @property
    def misconception_id(self) -> str:
        return self.misconception_tag


class MisconceptionState(BaseModel):
    """Manages active, addressed, and resolved misconceptions for a learner."""

    active_misconceptions: dict[str, MisconceptionItem] = Field(default_factory=dict)
    resolved_misconceptions: dict[str, MisconceptionItem] = Field(default_factory=dict)

    def record_misconception(
        self,
        concept_key: str,
        misconception_tag: str,
        description: str,
        severity: str = "moderate",
        confidence: float = 0.85,
    ) -> MisconceptionItem:
        """Register or increment the observation count of an active misconception."""
        # Use tag as unique key
        if misconception_tag in self.active_misconceptions:
            item = self.active_misconceptions[misconception_tag]
            item.observation_count += 1
            item.last_observed_at = datetime.now(UTC)
            item.confidence = min(0.99, item.confidence + 0.05)
            return item

        item = MisconceptionItem(
            concept_key=concept_key,
            misconception_tag=misconception_tag,
            description=description,
            severity=severity,
            status="active",
            confidence=confidence,
            observation_count=1,
        )
        self.active_misconceptions[misconception_tag] = item
        return item

    def resolve_misconception(
        self, misconception_tag: str, resolution_notes: str = ""
    ) -> MisconceptionItem | None:
        """Mark an active misconception as resolved with verified evidence."""
        if misconception_tag in self.active_misconceptions:
            item = self.active_misconceptions.pop(misconception_tag)
            item.status = "resolved"
            item.resolution_notes = resolution_notes
            item.last_observed_at = datetime.now(UTC)
            self.resolved_misconceptions[misconception_tag] = item
            return item
        return None

    def list_active(self) -> list[MisconceptionItem]:
        return list(self.active_misconceptions.values())

    def list_resolved(self) -> list[MisconceptionItem]:
        return list(self.resolved_misconceptions.values())
