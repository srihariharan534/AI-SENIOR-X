"""AI-SENIOR-X Evidence-Based Learner Preference Model."""

from pydantic import BaseModel, Field


class PreferenceModel(BaseModel):
    """Stores observable behavioral and environmental learning preferences."""

    preferred_language: str = "en"
    preferred_learning_style: str = (
        "visual_interactive"  # visual_interactive, hands_on_coding, formal_rigorous
    )
    preferred_session_minutes: int = 30
    preferred_difficulty_progression: str = "adaptive"  # linear, accelerated, adaptive
    voice_enabled: bool = False
    interests: list[str] = Field(default_factory=lambda: ["AI/ML", "Python", "Data Science"])

    def update_from_behavior(self, session_duration_minutes: int, success_rate: float) -> None:
        """Gradually adapt preference pacing based on demonstrated study behavior."""
        if session_duration_minutes > 0:
            # Exponential moving average for session duration
            self.preferred_session_minutes = int(
                0.8 * self.preferred_session_minutes + 0.2 * session_duration_minutes
            )

        if success_rate >= 0.85:
            self.preferred_difficulty_progression = "accelerated"
        elif success_rate < 0.50:
            self.preferred_difficulty_progression = "linear"
        else:
            self.preferred_difficulty_progression = "adaptive"
