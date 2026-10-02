"""AI-SENIOR-X Prompt Template Management System."""

from pathlib import Path
from typing import Any

PROMPTS_DIR = Path(__file__).resolve().parent


class PromptManager:
    """Loads, validates, and formats prompt templates."""

    def __init__(self, templates_dir: Path | None = None):
        self.templates_dir = templates_dir or PROMPTS_DIR
        self._cache: dict[str, str] = {}

    def get_template(self, template_name: str) -> str:
        """Load template file from disk with in-memory caching."""
        if not template_name.endswith(".txt"):
            template_name = f"{template_name}.txt"

        if template_name in self._cache:
            return self._cache[template_name]

        path = self.templates_dir / template_name
        if not path.exists():
            raise FileNotFoundError(f"Prompt template '{template_name}' not found at {path}")

        content = path.read_text(encoding="utf-8")
        self._cache[template_name] = content
        return content

    def format_prompt(self, template_name: str, **kwargs: Any) -> str:
        """Format a template with provided variables."""
        template = self.get_template(template_name)
        try:
            return template.format(**kwargs)
        except KeyError as e:
            raise ValueError(
                f"Missing required parameter {e} for template '{template_name}'"
            ) from e

    def build_tutor_prompt(
        self,
        topic: str,
        learner_grade: str = "undergraduate",
        preferred_style: str = "visual_interactive",
        rag_context: str = "",
        misconception_alerts: str = "",
        chat_history: str = "",
    ) -> str:
        """Helper to build a complete Socratic tutor prompt."""
        return self.format_prompt(
            "tutor",
            topic=topic,
            learner_grade=learner_grade,
            preferred_style=preferred_style,
            rag_context=rag_context or "No specific background context retrieved.",
            misconception_alerts=misconception_alerts or "No active misconceptions detected.",
            chat_history=chat_history or "No previous conversation.",
        )

    def build_assessment_prompt(
        self,
        subject: str = "AI/ML",
        topic: str = "General",
        difficulty: str = "Intermediate",
        target_skills: str = "core_concepts",
        question_count: int = 3,
        **kwargs: Any,
    ) -> str:
        """Helper to build an adaptive question generation prompt."""
        q_count = kwargs.get("num_questions", question_count)
        return self.format_prompt(
            "assessment",
            subject=subject,
            topic=topic,
            difficulty=difficulty,
            target_skills=target_skills,
            question_count=q_count,
        )

    def build_grading_prompt(
        self,
        question_prompt: str,
        correct_answer: str,
        user_response: str,
        rubric: str = "",
    ) -> str:
        """Helper to build an evaluation prompt."""
        return self.format_prompt(
            "grading",
            question_prompt=question_prompt,
            correct_answer=correct_answer,
            user_response=user_response,
            rubric=rubric or "Standard accuracy evaluation.",
        )

    def build_misconception_prompt(
        self,
        concept: str,
        question: str,
        user_response: str,
        correct_answer: str,
    ) -> str:
        """Helper to build misconception diagnostic prompt."""
        return self.format_prompt(
            "misconception",
            concept=concept,
            question=question,
            user_response=user_response,
            correct_answer=correct_answer,
        )

    def build_recommendation_prompt(
        self,
        learner_summary: str,
        mastery_gaps: str,
        active_misconceptions: str,
        available_modules: str,
    ) -> str:
        """Helper to build recommendation prompt."""
        return self.format_prompt(
            "recommendation",
            learner_summary=learner_summary,
            mastery_gaps=mastery_gaps,
            active_misconceptions=active_misconceptions,
            available_modules=available_modules,
        )


prompt_manager = PromptManager()
