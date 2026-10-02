"""AI-SENIOR-X Multi-Modal Explanation Engine."""

from enum import StrEnum

from pydantic import BaseModel


class ExplanationMode(StrEnum):
    """Available explanation perspectives and depths."""

    SIMPLE = "simple"
    DETAILED = "detailed"
    ANALOGY = "analogy"
    STEP_BY_STEP = "step_by_step"
    CODE_WALKTHROUGH = "code_walkthrough"
    COUNTEREXAMPLE = "counterexample"
    EXAM_FOCUSED = "exam_focused"


class ExplanationRequest(BaseModel):
    """Configuration for an explanation."""

    concept: str
    topic: str
    mode: ExplanationMode = ExplanationMode.DETAILED
    learner_level: str = "undergraduate"
    include_visual_ascii: bool = True


class ExplanationEngine:
    """Provides structured explanation guidelines tailored to learner requirements."""

    @classmethod
    def get_mode_instruction(cls, mode: ExplanationMode) -> str:
        """Return system prompt directives for the chosen explanation mode."""
        if mode == ExplanationMode.SIMPLE:
            return "Explain this concept in plain, beginner-friendly terms with zero unnecessary jargon (ELI5 style)."
        elif mode == ExplanationMode.ANALOGY:
            return "Lead with a memorable real-world analogy that builds immediate intuitive mental models."
        elif mode == ExplanationMode.STEP_BY_STEP:
            return "Break down the mechanics of the concept into sequential numbered steps from first principles."
        elif mode == ExplanationMode.CODE_WALKTHROUGH:
            return "Focus on the code implementation, walking through each line with comments and variable state tracking."
        elif mode == ExplanationMode.COUNTEREXAMPLE:
            return "Provide a clear example where the naive approach fails, illustrating why this concept or algorithm is necessary."
        elif mode == ExplanationMode.EXAM_FOCUSED:
            return (
                "Highlight key definitions, formulas, common exam traps, and interview edge cases."
            )
        return "Provide a comprehensive, clear educational explanation balancing theory, mechanics, and practical code."
