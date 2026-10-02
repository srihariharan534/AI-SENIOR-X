"""AI-SENIOR-X Misconception Detection Engine."""

import re

from pydantic import BaseModel, Field

from backend.app.agents.misconception.misconception_library import (
    CURATED_MISCONCEPTIONS,
)


class MisconceptionDetectionResult(BaseModel):
    """Diagnosed misconception with confidence and intervention guidance."""

    misconception_id: str
    concept_id: str
    title: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    misconception_statement: str
    accurate_conception: str
    remediation_strategy: str
    trigger_signal: str


class MisconceptionDetector:
    """Detects cognitive flaws from student utterances, incorrect assessment choices, and reasoning traces."""

    @classmethod
    def detect_from_text(
        cls,
        text: str,
        concept_hint: str | None = None,
    ) -> MisconceptionDetectionResult | None:
        """Analyze student response against misconception library patterns."""
        cleaned = text.lower()

        # Check concept-specific match first
        for item in CURATED_MISCONCEPTIONS.values():
            if concept_hint and item.concept_id != concept_hint:
                continue

            # Check keyword / phrase overlap
            misc_words = set(re.findall(r"\b\w{3,}\b", item.misconception_statement.lower()))
            user_words = set(re.findall(r"\b\w{3,}\b", cleaned))
            overlap = len(misc_words.intersection(user_words))

            if overlap >= 2 or any(tag in cleaned for tag in item.tags):
                confidence = min(0.95, 0.60 + (overlap * 0.10))
                return MisconceptionDetectionResult(
                    misconception_id=item.id,
                    concept_id=item.concept_id,
                    title=item.title,
                    confidence=round(confidence, 2),
                    misconception_statement=item.misconception_statement,
                    accurate_conception=item.accurate_conception,
                    remediation_strategy=item.remediation_strategy,
                    trigger_signal=f"Text pattern overlap on '{item.title}'",
                )

        # Fallback to general concept match if concept_hint exists
        if concept_hint and concept_hint in CURATED_MISCONCEPTIONS:
            item = CURATED_MISCONCEPTIONS[concept_hint]
            return MisconceptionDetectionResult(
                misconception_id=item.id,
                concept_id=item.concept_id,
                title=item.title,
                confidence=0.70,
                misconception_statement=item.misconception_statement,
                accurate_conception=item.accurate_conception,
                remediation_strategy=item.remediation_strategy,
                trigger_signal=f"Concept alignment on '{concept_hint}'",
            )

        return None
