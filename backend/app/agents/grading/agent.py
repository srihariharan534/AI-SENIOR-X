"""AI-SENIOR-X Grading Agent."""

from backend.app.agents.contract import AgentRequest, AgentResponse, BaseEducationalAgent
from backend.app.agents.grading.evaluator import EvaluationResult, SubmissionEvaluator
from backend.app.learning_twin.evidence import AssessmentEvidence, MisconceptionEvidence
from backend.app.llm.provider import BaseLLMProvider, get_llm_provider


class GradingAgent(BaseEducationalAgent):
    """Specialized agent grading learner answers, extracting misconceptions, and generating learning evidence."""

    def __init__(self, llm_provider: BaseLLMProvider | None = None):
        self.llm_provider = llm_provider or get_llm_provider()
        self.evaluator = SubmissionEvaluator(self.llm_provider)

    @property
    def name(self) -> str:
        return "GradingAgent"

    @property
    def capabilities(self) -> list[str]:
        return [
            "objective_grading",
            "semantic_explanation_grading",
            "rubric_scoring",
            "misconception_extraction",
            "evidence_emission",
        ]

    async def process(self, request: AgentRequest) -> AgentResponse:
        """Evaluate learner answer, generate feedback, and formulate cognitive evidence."""
        payload = request.payload
        question_text = payload.get("question_text", "Conceptual Question")
        correct_answer = payload.get("correct_answer", "")
        learner_response = payload.get("learner_response", request.query)
        q_type = payload.get("question_type", "mcq")
        options = payload.get("options", [])
        distractor_map = payload.get("distractor_misconceptions", {})
        topic_id = request.topic_id or payload.get("topic_id", "general")
        concept_id = request.concept_id or payload.get("concept_id", "concept")

        eval_result: EvaluationResult = await self.evaluator.evaluate_submission(
            question_text=question_text,
            correct_answer=correct_answer,
            learner_response=learner_response,
            question_type=q_type,
            options=options,
            distractor_map=distractor_map,
            rag_context=request.rag_context or "",
        )

        # 1. Produce Assessment Evidence
        evidence_list = []
        assessment_ev = AssessmentEvidence(
            learner_id=request.learner_id,
            session_id=request.session_id,
            assessment_id=payload.get("assessment_id", "eval-session"),
            question_id=payload.get("question_id", "q-eval"),
            concept_id=concept_id,
            topic_id=topic_id,
            score=eval_result.score,
            is_correct=eval_result.is_correct,
            difficulty=float(payload.get("difficulty", 0.5)),
            time_taken_seconds=float(payload.get("response_time_seconds", 10.0)),
            notes=f"Graded: {eval_result.feedback}",
        )
        evidence_list.append(assessment_ev)

        # 2. Produce Misconception Evidence if detected
        if eval_result.misconceptions_detected and not eval_result.is_correct:
            misc_name = eval_result.misconceptions_detected[0]
            misc_ev = MisconceptionEvidence(
                learner_id=request.learner_id,
                session_id=request.session_id,
                concept_id=concept_id,
                misconception_id=misc_name.lower().replace(" ", "_"),
                description=misc_name,
                confidence=0.85,
                trigger_event=f"Incorrect answer on {concept_id}: '{learner_response}'",
            )
            evidence_list.append(misc_ev)

        status_tag = "Correct" if eval_result.is_correct else "Incorrect"
        feedback_content = (
            f"### Result: {status_tag} (Score: {int(eval_result.score * 100)}%)\n\n"
            f"{eval_result.feedback}\n\n"
            f"**Actionable Advice:** {eval_result.improvement_advice}"
        )

        next_action = "PRACTICE" if not eval_result.is_correct else "RECOMMEND"

        return AgentResponse(
            request_id=request.request_id,
            agent_name=self.name,
            status="success",
            result=eval_result.model_dump(),
            content=feedback_content,
            evidence=evidence_list,
            confidence=0.95,
            next_suggested_action=next_action,
        )
