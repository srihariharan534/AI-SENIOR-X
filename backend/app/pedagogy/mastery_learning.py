"""AI-SENIOR-X Mastery Learning & Advancement Gate Engine."""

from pydantic import BaseModel, Field


class AdvancementDecision(BaseModel):
    """Decision on whether a learner is prepared to advance to the next topic."""

    topic_id: str
    can_advance: bool
    overall_mastery: float = Field(..., ge=0.0, le=1.0)
    prerequisites_cleared: bool
    unmastered_prerequisites: list[str] = Field(default_factory=list)
    unmastered_concepts: list[str] = Field(default_factory=list)
    recommendation: str


class MasteryLearningEngine:
    """Enforces Bloom's Mastery Learning criteria before topic advancement."""

    MASTERY_THRESHOLD = 0.70
    EXCELLENCE_THRESHOLD = 0.85

    @classmethod
    def evaluate_advancement_gate(
        cls,
        topic_id: str,
        concept_masteries: dict[str, float],
        prerequisite_masteries: dict[str, float],
        min_attempts_per_concept: int = 1,
        attempts_record: dict[str, int] | None = None,
    ) -> AdvancementDecision:
        """Verify that prerequisites and core concepts satisfy mastery criteria."""
        attempts_record = attempts_record or {}
        unmastered_prereqs: list[str] = []
        unmastered_concepts: list[str] = []

        # 1. Prerequisite gate
        for prereq_id, score in prerequisite_masteries.items():
            if score < cls.MASTERY_THRESHOLD:
                unmastered_prereqs.append(prereq_id)

        # 2. Topic concept gate
        total_score = 0.0
        for c_id, score in concept_masteries.items():
            total_score += score
            attempts = attempts_record.get(c_id, 1)
            if score < cls.MASTERY_THRESHOLD or attempts < min_attempts_per_concept:
                unmastered_concepts.append(c_id)

        avg_mastery = (total_score / max(1, len(concept_masteries))) if concept_masteries else 0.0
        prereqs_ok = len(unmastered_prereqs) == 0
        concepts_ok = len(unmastered_concepts) == 0

        can_advance = prereqs_ok and concepts_ok and (avg_mastery >= cls.MASTERY_THRESHOLD)

        if can_advance:
            rec = (
                "Mastery gate cleared. Proceed to the next curriculum topic or advanced challenge."
            )
        elif not prereqs_ok:
            rec = f"Blocked: Prerequisite gap in {', '.join(unmastered_prereqs)}. Complete prerequisite remediation first."
        else:
            rec = f"Consolidation required: Practice {', '.join(unmastered_concepts)} to reach {int(cls.MASTERY_THRESHOLD * 100)}% mastery."

        return AdvancementDecision(
            topic_id=topic_id,
            can_advance=can_advance,
            overall_mastery=round(avg_mastery, 2),
            prerequisites_cleared=prereqs_ok,
            unmastered_prerequisites=unmastered_prereqs,
            unmastered_concepts=unmastered_concepts,
            recommendation=rec,
        )
