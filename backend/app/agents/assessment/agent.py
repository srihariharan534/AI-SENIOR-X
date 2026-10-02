"""AI-SENIOR-X Assessment Agent."""

from backend.app.agents.assessment.difficulty_engine import AssessmentDifficultyCalibrator
from backend.app.agents.assessment.question_generator import GeneratedQuestion, QuestionGenerator
from backend.app.agents.contract import AgentRequest, AgentResponse, BaseEducationalAgent
from backend.app.learning_twin.evidence import AssessmentEvidence
from backend.app.llm.provider import BaseLLMProvider, get_llm_provider


class AssessmentAgent(BaseEducationalAgent):
    """Specialized agent constructing diagnostic, formative, and capstone assessments."""

    def __init__(self, llm_provider: BaseLLMProvider | None = None):
        self.llm_provider = llm_provider or get_llm_provider()
        self.question_generator = QuestionGenerator(self.llm_provider)

    @property
    def name(self) -> str:
        return "AssessmentAgent"

    @property
    def capabilities(self) -> list[str]:
        return [
            "diagnostic_quiz_generation",
            "formative_assessment",
            "adaptive_item_selection",
            "distractor_generation",
            "concept_mastery_testing",
        ]

    async def process(self, request: AgentRequest) -> AgentResponse:
        """Construct adaptive assessment questions for the learner."""
        learner_ctx = request.learner_context or {}
        mastery = float(learner_ctx.get("mastery", 0.50))
        topic = request.topic_id or request.query or "General AI/ML"
        concept = request.concept_id or topic.lower().replace(" ", "_")
        subject = request.subject or "AI/ML"
        num_q = int(request.payload.get("num_questions", 3))

        # 1. Calibrate difficulty
        diff_decision = AssessmentDifficultyCalibrator.calibrate(
            current_mastery=mastery,
            assessment_type=request.payload.get("assessment_type", "formative"),
        )

        # 2. Generate questions
        questions: list[GeneratedQuestion] = await self.question_generator.generate_questions(
            topic=topic,
            concept=concept,
            subject=subject,
            difficulty=diff_decision.target_difficulty,
            num_questions=num_q,
            rag_context=request.rag_context or "",
        )

        # 3. Format user-facing quiz text (hiding correct answers from the public text)
        quiz_lines = [
            f"### Assessment: {topic} ({diff_decision.level_name} Level)\n",
            f"**Target Concepts:** {concept.replace('_', ' ').title()}\n",
        ]
        for idx, q in enumerate(questions, 1):
            quiz_lines.append(f"**Question {idx}:** {q.question}")
            for opt_idx, opt in enumerate(q.options):
                opt_letter = chr(65 + opt_idx)
                quiz_lines.append(f"- **{opt_letter})** {opt}")
            quiz_lines.append("")

        quiz_content = "\n".join(quiz_lines)

        evidence = AssessmentEvidence(
            learner_id=request.learner_id,
            session_id=request.session_id,
            assessment_id=request.payload.get("assessment_id", "quiz-init"),
            question_id=questions[0].question_id if questions else "q-0",
            concept_id=concept,
            topic_id=topic,
            score=0.0,
            is_correct=False,
            difficulty=diff_decision.target_difficulty,
            time_taken_seconds=0.0,
            notes="Assessment initialized",
        )

        return AgentResponse(
            request_id=request.request_id,
            agent_name=self.name,
            status="success",
            result={
                "topic": topic,
                "concept": concept,
                "difficulty": diff_decision.target_difficulty,
                "difficulty_level": diff_decision.level_name,
                "questions": [q.model_dump() for q in questions],
            },
            content=quiz_content,
            evidence=[evidence],
            confidence=0.95,
            next_suggested_action="GRADE",
        )
