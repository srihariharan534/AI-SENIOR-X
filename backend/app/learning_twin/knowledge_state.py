"""AI-SENIOR-X Knowledge State and Multi-Factor Mastery Engine."""

from datetime import UTC, datetime
from enum import StrEnum

from pydantic import BaseModel, Field


class MasteryLevel(StrEnum):
    """Categorical educational mastery classification."""

    UNKNOWN = "unknown"  # < 0.20
    LEARNING = "learning"  # 0.20 - 0.49
    DEVELOPING = "developing"  # 0.50 - 0.69
    PROFICIENT = "proficient"  # 0.70 - 0.89
    MASTERED = "mastered"  # >= 0.90


def get_mastery_level_from_score(score: float) -> MasteryLevel:
    """Classify numeric mastery score (0.0 to 1.0) into discrete category."""
    if score >= 0.90:
        return MasteryLevel.MASTERED
    elif score >= 0.70:
        return MasteryLevel.PROFICIENT
    elif score >= 0.50:
        return MasteryLevel.DEVELOPING
    elif score >= 0.20:
        return MasteryLevel.LEARNING
    return MasteryLevel.UNKNOWN


class ConceptMastery(BaseModel):
    """Fine-grained mastery record for a specific educational concept or topic."""

    concept_key: str
    subject: str
    topic: str
    mastery_score: float = Field(0.0, ge=0.0, le=1.0)
    level: MasteryLevel = MasteryLevel.UNKNOWN
    confidence: float = Field(0.5, ge=0.0, le=1.0)
    total_attempts: int = 0
    successful_attempts: int = 0
    last_assessed: datetime = Field(default_factory=lambda: datetime.now(UTC))
    consecutive_correct: int = 0


class KnowledgeState(BaseModel):
    """The aggregate knowledge state across all concepts and subjects."""

    concepts: dict[str, ConceptMastery] = Field(default_factory=dict)
    subject_mastery: dict[str, float] = Field(default_factory=dict)

    def get_concept_mastery(self, concept_key: str) -> ConceptMastery | None:
        return self.concepts.get(concept_key)

    def update_concept(
        self,
        concept_key: str,
        subject: str,
        topic: str,
        is_correct: bool,
        difficulty: str = "medium",
    ) -> ConceptMastery:
        """Apply deterministic, multi-factor Bayesian-style mastery update."""
        current = self.concepts.get(concept_key)
        if not current:
            current = ConceptMastery(
                concept_key=concept_key,
                subject=subject,
                topic=topic,
                mastery_score=0.2 if is_correct else 0.05,
                level=MasteryLevel.LEARNING if is_correct else MasteryLevel.UNKNOWN,
                confidence=0.4,
                total_attempts=1,
                successful_attempts=1 if is_correct else 0,
                last_assessed=datetime.now(UTC),
                consecutive_correct=1 if is_correct else 0,
            )
            self.concepts[concept_key] = current
        else:
            current.total_attempts += 1
            if is_correct:
                current.successful_attempts += 1
                current.consecutive_correct += 1
            else:
                current.consecutive_correct = 0

            # Difficulty weighting
            diff_weight = {"easy": 0.8, "medium": 1.0, "hard": 1.3}.get(difficulty.lower(), 1.0)

            # Base delta
            if is_correct:
                delta = 0.12 * diff_weight
                # Consistency bonus
                if current.consecutive_correct >= 3:
                    delta += 0.05
            else:
                delta = -0.10 * diff_weight

            new_score = max(0.0, min(1.0, current.mastery_score + delta))
            current.mastery_score = round(new_score, 3)
            current.level = get_mastery_level_from_score(current.mastery_score)
            current.confidence = min(0.99, round(current.confidence + 0.05, 2))
            current.last_assessed = datetime.now(UTC)

        self._recalculate_subject_mastery()
        return current

    def _recalculate_subject_mastery(self) -> None:
        """Recompute aggregate scores by subject domain."""
        subjects_scores: dict[str, list[float]] = {}
        for c in self.concepts.values():
            subjects_scores.setdefault(c.subject, []).append(c.mastery_score)

        self.subject_mastery = {
            subj: round(sum(scores) / len(scores), 2) for subj, scores in subjects_scores.items()
        }
