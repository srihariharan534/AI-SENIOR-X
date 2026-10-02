"""AI-SENIOR-X Assessment Difficulty Calibration."""

from backend.app.pedagogy.difficulty_adaptation import (
    DifficultyAdaptationEngine,
    DifficultyAssessment,
)


class AssessmentDifficultyCalibrator:
    """Calibrates item difficulty for diagnostic and formative assessments."""

    @classmethod
    def calibrate(
        cls,
        current_mastery: float,
        recent_scores: list[float] | None = None,
        assessment_type: str = "formative",
    ) -> DifficultyAssessment:
        """Calculate target assessment difficulty based on mastery and intent."""
        if assessment_type == "diagnostic":
            # Diagnostic assessments start at moderate difficulty to gauge full breadth
            target = 0.50
            return DifficultyAssessment(
                target_difficulty=target,
                level_name="Intermediate",
                adjustment_delta=0.0,
                rationale="Diagnostic baseline calibration across standard concept scope.",
            )

        return DifficultyAdaptationEngine.calculate_next_difficulty(
            current_mastery=current_mastery,
            recent_scores=recent_scores,
        )
