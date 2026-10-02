"""AI-SENIOR-X Adaptive Difficulty Engine."""

from pydantic import BaseModel, Field


class DifficultyAssessment(BaseModel):
    """Result of difficulty adaptation calculation."""

    target_difficulty: float = Field(..., ge=0.0, le=1.0)
    level_name: str = "Intermediate"
    adjustment_delta: float = 0.0
    rationale: str


class DifficultyAdaptationEngine:
    """Calculates dynamically adjusted assessment and practice difficulty."""

    @staticmethod
    def get_difficulty_name(score: float) -> str:
        """Map numeric difficulty to descriptive label."""
        if score < 0.35:
            return "Beginner"
        elif score < 0.65:
            return "Intermediate"
        elif score < 0.85:
            return "Advanced"
        return "Expert"

    @classmethod
    def calculate_next_difficulty(
        cls,
        current_mastery: float,
        recent_scores: list[float] | None = None,
        consecutive_correct: int = 0,
        consecutive_incorrect: int = 0,
        current_difficulty: float = 0.5,
    ) -> DifficultyAssessment:
        """Compute the next optimal challenge level within the Zone of Proximal Development (ZPD)."""
        recent_scores = recent_scores or []
        delta = 0.0
        reasons: list[str] = []

        # 1. Base anchor from mastery level (slightly above current mastery for growth)
        target = min(1.0, max(0.1, current_mastery + 0.10))

        # 2. Streak adjustments
        if consecutive_correct >= 3:
            streak_boost = min(0.15, consecutive_correct * 0.04)
            delta += streak_boost
            reasons.append(f"Streak of {consecutive_correct} correct answers (+{streak_boost:.2f})")
        elif consecutive_incorrect >= 2:
            streak_drop = min(0.20, consecutive_incorrect * 0.08)
            delta -= streak_drop
            reasons.append(
                f"Streak of {consecutive_incorrect} incorrect answers (-{streak_drop:.2f})"
            )

        # 3. Recent scoring moving average
        if recent_scores:
            avg_score = sum(recent_scores[-5:]) / len(recent_scores[-5:])
            if avg_score > 0.85:
                delta += 0.05
                reasons.append("High recent accuracy (>85%)")
            elif avg_score < 0.40:
                delta -= 0.10
                reasons.append("Low recent accuracy (<40%)")

        final_difficulty = min(0.95, max(0.15, round(target + delta, 2)))
        net_change = round(final_difficulty - current_difficulty, 2)
        level = cls.get_difficulty_name(final_difficulty)

        rationale_str = (
            "; ".join(reasons)
            if reasons
            else f"Calibrated to learner mastery of {current_mastery:.2f}"
        )

        return DifficultyAssessment(
            target_difficulty=final_difficulty,
            level_name=level,
            adjustment_delta=net_change,
            rationale=rationale_str,
        )
