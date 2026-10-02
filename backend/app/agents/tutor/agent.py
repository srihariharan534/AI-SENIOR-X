"""AI-SENIOR-X Primary Pedagogical Tutor Agent."""

from backend.app.agents.contract import AgentRequest, AgentResponse, BaseEducationalAgent
from backend.app.agents.tutor.explanation_engine import ExplanationEngine, ExplanationMode
from backend.app.agents.tutor.teaching_strategy import TutorTeachingStrategyAdapter
from backend.app.learning_twin.evidence import TutorEvidence
from backend.app.llm.prompts.prompt_manager import prompt_manager
from backend.app.llm.provider import BaseLLMProvider, LLMMessage, get_llm_provider
from backend.app.multilingual.terminology import TechnicalTerminologyKeeper
from backend.app.pedagogy.teaching_strategies import TeachingStrategyEngine


class TutorAgent(BaseEducationalAgent):
    """Primary conversational teaching agent delivering personalized Socratic and direct tutoring."""

    def __init__(self, llm_provider: BaseLLMProvider | None = None):
        self.llm_provider = llm_provider or get_llm_provider()

    @property
    def name(self) -> str:
        return "TutorAgent"

    @property
    def capabilities(self) -> list[str]:
        return [
            "socratic_tutoring",
            "concept_explanation",
            "code_walkthrough",
            "analogy_generation",
            "misconception_remediation",
            "followup_questioning",
        ]

    async def process(self, request: AgentRequest) -> AgentResponse:
        """Process learner query, retrieve context, apply pedagogical strategy, and generate response."""
        learner_ctx = request.learner_context or {}
        topic_name = request.topic_id or request.query
        mastery_score = float(learner_ctx.get("mastery", 0.40))
        preferred_style = str(learner_ctx.get("preferred_style", "visual_interactive"))
        has_misconceptions = bool(learner_ctx.get("active_misconceptions", False))

        # 1. Determine pedagogical teaching strategy
        strategy_decision = TeachingStrategyEngine.select_strategy(
            mastery_score=mastery_score,
            has_active_misconceptions=has_misconceptions,
            preferred_style=preferred_style,
            session_turn_count=int(learner_ctx.get("turn_count", 0)),
        )
        strategy_guidance = TutorTeachingStrategyAdapter.get_strategy_prompt_instructions(
            strategy_decision
        )

        # 2. Determine explanation mode
        req_mode = request.payload.get("explanation_mode", ExplanationMode.DETAILED)
        mode_instruction = ExplanationEngine.get_mode_instruction(req_mode)

        # 3. Assemble Prompt & Context
        system_prompt = prompt_manager.build_tutor_prompt(
            topic=topic_name,
            learner_grade=str(learner_ctx.get("current_level", "undergraduate")),
            preferred_style=preferred_style,
            rag_context=request.rag_context or "No specific external knowledge notes retrieved.",
            misconception_alerts=learner_ctx.get(
                "misconception_alert", "No active misconceptions."
            ),
            chat_history=request.payload.get("chat_history", ""),
        )

        # Multilingual terminology protection if non-English
        multilingual_prompt = TechnicalTerminologyKeeper.get_prompt_instruction(request.language)

        full_system = (
            f"{system_prompt}\n\n{strategy_guidance}\n\n{mode_instruction}\n\n{multilingual_prompt}"
        )

        messages = [
            LLMMessage(role="system", content=full_system),
            LLMMessage(role="user", content=request.query),
        ]

        # 4. Generate LLM response
        llm_resp = await self.llm_provider.generate(messages, temperature=0.6, max_tokens=1000)

        # 5. Formulate Learning Evidence
        evidence = TutorEvidence(
            learner_id=request.learner_id,
            session_id=request.session_id,
            concept_id=request.concept_id or topic_name.lower().replace(" ", "_"),
            topic_id=request.topic_id or "general",
            turns_engaged=1,
            comprehension_signal="positive",
            hints_requested=0,
            notes=f"Tutor strategy: {strategy_decision.strategy.value}",
        )

        return AgentResponse(
            request_id=request.request_id,
            agent_name=self.name,
            status="success",
            result={
                "topic": topic_name,
                "strategy": strategy_decision.strategy.value,
                "explanation_mode": req_mode,
                "confidence": 0.95,
            },
            content=llm_resp.text,
            evidence=[evidence],
            confidence=0.95,
            next_suggested_action="PRACTICE" if mastery_score > 0.50 else "ASK",
            metadata={"model": llm_resp.model_name, "token_usage": llm_resp.token_usage},
        )
