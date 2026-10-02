"""AI-SENIOR-X Spaced Repetition Scheduling Engine (SM-2 Modified)."""

from datetime import UTC, datetime, timedelta

from pydantic import BaseModel, Field


class RepetitionSchedule(BaseModel):
    """Calculated spaced repetition schedule for a concept."""

    concept_id: str
    interval_days: int
    easiness_factor: float = Field(default=2.5, ge=1.3)
    repetitions: int = 0
    next_review_date: datetime
    urgency_score: float = Field(..., ge=0.0, le=1.0)
    overdue: bool = False


class SpacedRepetitionScheduler:
    """Implements modified SuperMemo SM-2 algorithm for learning retention."""

    DEFAULT_EF = 2.5
    MIN_EF = 1.3

    @classmethod
    def schedule_next(
        cls,
        concept_id: str,
        quality: int,  # 0 to 5 rating (0-2 fail, 3-5 pass)
        repetitions: int = 0,
        previous_interval_days: int = 1,
        previous_ef: float = DEFAULT_EF,
        last_reviewed: datetime | None = None,
    ) -> RepetitionSchedule:
        """Calculate next review interval according to the SM-2 algorithm."""
        last_reviewed = last_reviewed or datetime.now(UTC)

        # Quality clamping
        q = max(0, min(5, quality))

        # 1. Update Easiness Factor (EF)
        # EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
        new_ef = previous_ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
        new_ef = max(cls.MIN_EF, round(new_ef, 2))

        # 2. Compute interval based on repetition streak
        if q < 3:
            # Failed review -> reset repetitions
            new_repetitions = 0
            new_interval = 1
        else:
            new_repetitions = repetitions + 1
            if new_repetitions == 1:
                new_interval = 1
            elif new_repetitions == 2:
                new_interval = 6
            else:
                new_interval = max(1, int(round(previous_interval_days * new_ef)))

        next_date = last_reviewed + timedelta(days=new_interval)
        now = datetime.now(UTC)
        is_overdue = now > next_date

        # Urgency calculation (0.0 to 1.0)
        if is_overdue:
            days_over = (now - next_date).total_seconds() / 86400
            urgency = min(1.0, 0.70 + (days_over * 0.05))
        else:
            time_left = (next_date - now).total_seconds() / 86400
            urgency = max(0.0, 0.50 - (time_left / max(1, new_interval)) * 0.50)

        return RepetitionSchedule(
            concept_id=concept_id,
            interval_days=new_interval,
            easiness_factor=new_ef,
            repetitions=new_repetitions,
            next_review_date=next_date,
            urgency_score=round(urgency, 2),
            overdue=is_overdue,
        )
