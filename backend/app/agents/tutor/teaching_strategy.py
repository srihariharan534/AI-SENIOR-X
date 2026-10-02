"""AI-SENIOR-X Tutor Teaching Strategy Adapter."""

from backend.app.pedagogy.teaching_strategies import (
    StrategyDecision,
    TeachingStrategyType,
)


class TutorTeachingStrategyAdapter:
    """Adapts pedagogical strategy decisions into specific system prompt instructions for the LLM."""

    @classmethod
    def get_strategy_prompt_instructions(cls, decision: StrategyDecision) -> str:
        """Translate pedagogical decision into actionable model behavior guidelines."""
        instructions: list[str] = [
            f"PRIMARY TEACHING STRATEGY: {decision.strategy.value.upper()}",
            f"RATIONALE: {decision.rationale}",
            f"TARGET EXPLANATION DEPTH: {decision.suggested_depth.upper()}",
        ]

        if decision.strategy == TeachingStrategyType.SOCRATIC:
            instructions.append(
                "- Do NOT simply lecture or give the complete answer away immediately.\n"
                "- Guide the learner step-by-step using thought-provoking questions.\n"
                "- Ask 1 focused follow-up check question at the end to verify comprehension."
            )
        elif decision.strategy == TeachingStrategyType.ANALOGY_FIRST:
            instructions.append(
                "- Begin with a vivid, relatable real-world physical or intuitive analogy before formal theory.\n"
                "- Connect the analogy directly to the core mathematical or programmatic concept."
            )
        elif decision.strategy == TeachingStrategyType.STEP_BY_STEP:
            instructions.append(
                "- Decompose the concept into clear numbered steps or stages.\n"
                "- Keep explanations structured and easy to scan."
            )
        elif decision.strategy == TeachingStrategyType.ERROR_CORRECTION:
            instructions.append(
                "- Gently highlight why the common misconception occurs without judging.\n"
                "- Contrast the correct principle directly against the misconception using a side-by-side example."
            )
        elif decision.strategy == TeachingStrategyType.CHALLENGE:
            instructions.append(
                "- The learner has high mastery; present non-trivial edge-cases, optimization constraints, or architectural trade-offs."
            )
        else:
            instructions.append(
                "- Provide a clear, structured educational explanation combining theory, intuition, and examples."
            )

        if decision.include_code_example:
            instructions.append(
                "- Include a clean, well-commented Python/SQL code block illustrating the concept."
            )

        return "\n".join(instructions)
