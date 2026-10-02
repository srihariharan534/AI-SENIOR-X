"""AI-SENIOR-X Spaced Repetition and Memory Decay Engine."""

import math
from datetime import UTC, datetime

from pydantic import BaseModel, Field


class ConceptRetention(BaseModel):
    """Retention state for spaced repetition review tracking."""

    concept_key: str
    repetition_count: int = 1
    stability_factor: float = 3.0  # Days memory is expected to remain above threshold
    last_practiced_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    estimated_retention: float = 1.0
    review_priority: float = 0.0


class MemoryDecayModel:
    """Calculates memory decay curves and determines spaced repetition schedules."""

    @staticmethod
    def calculate_retention(last_practiced: datetime, stability_days: float) -> float:
        """Compute retention probability using exponential forgetting curve: R = exp(-t / S)."""
        now = datetime.now(UTC)
        elapsed_seconds = max(0.0, (now - last_practiced).total_seconds())
        elapsed_days = elapsed_seconds / 86400.0

        if stability_days <= 0:
            stability_days = 1.0

        retention = math.exp(-elapsed_days / stability_days)
        return max(0.05, min(1.0, retention))

    @classmethod
    def update_retention_on_practice(
        cls, current: ConceptRetention, is_successful: bool
    ) -> ConceptRetention:
        """Update stability and schedule following a practice session."""
        now = datetime.now(UTC)
        if is_successful:
            current.repetition_count += 1
            # Stability grows exponentially with successful repetitions
            current.stability_factor = round(current.stability_factor * 1.8, 2)
        else:
            # Memory lapsed, reset stability
            current.stability_factor = max(1.5, round(current.stability_factor * 0.5, 2))

        current.last_practiced_at = now
        current.estimated_retention = 1.0
        current.review_priority = 0.0
        return current

    @classmethod
    def evaluate_decay(
        cls, retention_records: dict[str, ConceptRetention]
    ) -> dict[str, ConceptRetention]:
        """Update retention estimates and review priorities across all concepts."""
        for r in retention_records.values():
            ret = cls.calculate_retention(r.last_practiced_at, r.stability_factor)
            r.estimated_retention = round(ret, 3)
            # Review priority increases as retention drops below 0.70
            r.review_priority = round(max(0.0, 1.0 - ret), 3)
        return retention_records
