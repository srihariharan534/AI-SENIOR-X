"""AI-SENIOR-X Teaching Strategy Framework."""

from enum import StrEnum

from pydantic import BaseModel, Field


class TeachingStrategyType(StrEnum):
    """Pedagogical teaching strategies."""

    DIRECT_EXPLANATION = "direct_explanation"
    SOCRATIC = "socratic"
    EXAMPLE_FIRST = "example_first"
    ANALOGY_FIRST = "analogy_first"
    STEP_BY_STEP = "step_by_step"
    GUIDED_PRACTICE = "guided_practice"
    ERROR_CORRECTION = "error_correction"
    REVIEW = "review"
    CHALLENGE = "challenge"


class StrategyDecision(BaseModel):
    """Strategy recommendation with rationale."""

    strategy: TeachingStrategyType
    rationale: str
    suggested_depth: str = Field(
        default="standard", description="introductory, standard, or advanced"
    )
    include_analogy: bool = False
    include_code_example: bool = True
    scaffold_question_count: int = 1


class TeachingStrategyEngine:
    """Selects pedagogical strategies based on evidence and cognitive state."""

    @staticmethod
    def select_strategy(
        mastery_score: float,
        has_active_misconceptions: bool = False,
        recent_mistake_count: int = 0,
        preferred_style: str = "visual_interactive",
        session_turn_count: int = 0,
    ) -> StrategyDecision:
        """Deterministically choose the optimal teaching strategy for the learner."""
        # 1. Error Correction if active misconception exists
        if has_active_misconceptions or recent_mistake_count >= 2:
            return StrategyDecision(
                strategy=TeachingStrategyType.ERROR_CORRECTION,
                rationale="Active misconception or repeated errors detected; prioritizing root-cause remediation.",
                suggested_depth="standard",
                include_analogy=True,
                include_code_example=True,
                scaffold_question_count=2,
            )

        # 2. Beginner / New Concept (low mastery)
        if mastery_score < 0.30:
            if preferred_style == "analogy" or "analogy" in preferred_style:
                return StrategyDecision(
                    strategy=TeachingStrategyType.ANALOGY_FIRST,
                    rationale="Learner is new to concept and responds well to intuitive real-world analogies.",
                    suggested_depth="introductory",
                    include_analogy=True,
                    include_code_example=False,
                    scaffold_question_count=1,
                )
            return StrategyDecision(
                strategy=TeachingStrategyType.STEP_BY_STEP,
                rationale="Concept is introductory; decomposing into fundamental step-by-step principles.",
                suggested_depth="introductory",
                include_analogy=True,
                include_code_example=True,
                scaffold_question_count=1,
            )

        # 3. Developing / Intermediate (0.30 to 0.70) -> Socratic dialogue
        if mastery_score < 0.75:
            if session_turn_count > 3:
                return StrategyDecision(
                    strategy=TeachingStrategyType.GUIDED_PRACTICE,
                    rationale="Learner has foundational grasp; transitioning to active guided application.",
                    suggested_depth="standard",
                    include_analogy=False,
                    include_code_example=True,
                    scaffold_question_count=2,
                )
            return StrategyDecision(
                strategy=TeachingStrategyType.SOCRATIC,
                rationale="Learner understands basics; using targeted Socratic questioning to deepen understanding.",
                suggested_depth="standard",
                include_analogy=False,
                include_code_example=True,
                scaffold_question_count=1,
            )

        # 4. Proficient / Mastered (>= 0.75) -> Challenge / Advanced application
        return StrategyDecision(
            strategy=TeachingStrategyType.CHALLENGE,
            rationale="High mastery established; presenting advanced edge-cases, optimization, and synthesis.",
            suggested_depth="advanced",
            include_analogy=False,
            include_code_example=True,
            scaffold_question_count=3,
        )
