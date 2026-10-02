"""AI-SENIOR-X Hybrid Evaluator Engine."""

import re

from pydantic import BaseModel, Field

from backend.app.llm.prompts.prompt_manager import prompt_manager
from backend.app.llm.provider import BaseLLMProvider, LLMMessage
from backend.app.llm.structured_output import StructuredOutputEngine


class EvaluationResult(BaseModel):
    """Result of grading an answer or submission."""

    is_correct: bool
    score: float = Field(..., ge=0.0, le=1.0)
    feedback: str
    misconceptions_detected: list[str] = Field(default_factory=list)
    missing_concepts: list[str] = Field(default_factory=list)
    strengths: list[str] = Field(default_factory=list)
    improvement_advice: str


class SubmissionEvaluator:
    """Evaluates student submissions deterministically for MCQs and semantically for open responses."""

    def __init__(self, llm_provider: BaseLLMProvider | None = None):
        self.llm_provider = llm_provider
        self.structured_engine = StructuredOutputEngine(llm_provider) if llm_provider else None

    async def evaluate_submission(
        self,
        question_text: str,
        correct_answer: str,
        learner_response: str,
        question_type: str = "mcq",
        options: list[str] | None = None,
        distractor_map: dict[str, str] | None = None,
        rag_context: str = "",
    ) -> EvaluationResult:
        """Grade submission with objective precision and pedagogical feedback."""
        cleaned_user = learner_response.strip().lower()
        cleaned_correct = correct_answer.strip().lower()
        options = options or []
        distractor_map = distractor_map or {}

        # 1. Deterministic MCQ / Letter Matching
        if question_type in ("mcq", "multiple_choice"):
            # Check letter match: "A", "B", "C", "D"
            user_letter = None
            if len(cleaned_user) == 1 and cleaned_user.isalpha():
                letter_idx = ord(cleaned_user) - ord("a")
                if 0 <= letter_idx < len(options):
                    user_letter = options[letter_idx].lower()

            is_exact = (
                cleaned_user == cleaned_correct
                or (user_letter and user_letter == cleaned_correct)
                or (cleaned_correct in cleaned_user)
            )

            if is_exact:
                return EvaluationResult(
                    is_correct=True,
                    score=1.0,
                    feedback="Correct! Your answer accurately identifies the core concept.",
                    misconceptions_detected=[],
                    missing_concepts=[],
                    strengths=["Accurate conceptual recognition"],
                    improvement_advice="Great job! Advance to the next practice exercise.",
                )
            else:
                # Check if user selected a known distractor with associated misconception
                detected_misc: list[str] = []
                for distractor_text, misc_name in distractor_map.items():
                    if distractor_text.lower() in cleaned_user or (
                        user_letter and distractor_text.lower() == user_letter
                    ):
                        detected_misc.append(misc_name)

                if not detected_misc:
                    detected_misc.append("Conceptual misunderstanding of topic mechanics")

                return EvaluationResult(
                    is_correct=False,
                    score=0.0,
                    feedback=f"Incorrect. The correct answer is: {correct_answer}.",
                    misconceptions_detected=detected_misc,
                    missing_concepts=[correct_answer[:50]],
                    strengths=[],
                    improvement_advice=f"Review the distinction between the correct principle and {detected_misc[0]}.",
                )

        # 2. Semantic LLM Evaluation for Open / Short / Coding Answers
        if self.structured_engine:
            prompt = prompt_manager.build_grading_prompt(
                question=question_text,
                rubric=f"Correct Answer / Key Principles:\n{correct_answer}\n\nReference Context:\n{rag_context}",
                learner_submission=learner_response,
            )
            try:
                res = await self.structured_engine.generate_structured(
                    messages=[LLMMessage(role="user", content=prompt)],
                    response_model=EvaluationResult,
                    temperature=0.2,
                )
                return res
            except Exception:
                pass

        # Deterministic Heuristic Word Overlap Fallback
        user_words = set(re.findall(r"\b\w{3,}\b", cleaned_user))
        correct_words = set(re.findall(r"\b\w{3,}\b", cleaned_correct))
        overlap = len(user_words.intersection(correct_words))
        score = min(1.0, max(0.0, overlap / max(1, len(correct_words))))
        is_pass = score >= 0.60

        return EvaluationResult(
            is_correct=is_pass,
            score=round(score, 2),
            feedback="Answer received and scored against conceptual key terms."
            if is_pass
            else "Answer is missing key technical criteria.",
            misconceptions_detected=[] if is_pass else ["Incomplete concept formulation"],
            missing_concepts=[] if is_pass else ["Key algorithmic steps"],
            strengths=["Partial keyword alignment"] if overlap > 0 else [],
            improvement_advice="Deepen response with specific technical mechanisms and parameters.",
        )
