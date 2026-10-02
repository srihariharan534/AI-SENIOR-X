"""AI-SENIOR-X Central Multi-Agent Orchestrator."""

import uuid
from typing import Any

from backend.app.agents.assessment.agent import AssessmentAgent
from backend.app.agents.contract import AgentRequest, AgentResponse, BaseEducationalAgent
from backend.app.agents.grading.agent import GradingAgent
from backend.app.agents.learner_profiler.agent import LearnerProfilerAgent
from backend.app.agents.misconception.agent import MisconceptionAgent
from backend.app.agents.mission.agent import MissionAgent
from backend.app.agents.orchestrator.router import IntentRouter, RoutingDecision
from backend.app.agents.orchestrator.state import OrchestratorState
from backend.app.agents.practice.agent import PracticeAgent
from backend.app.agents.recommendation.agent import RecommendationAgent
from backend.app.agents.tutor.agent import TutorAgent
from backend.app.curriculum.topic_mapper import topic_mapper
from backend.app.learning_twin.twin_updater import TwinUpdater, twin_updater
from backend.app.llm.provider import BaseLLMProvider, get_llm_provider
from backend.app.multilingual.language_router import LanguageRouter
from backend.app.rag.knowledge_base import KnowledgeBaseService, knowledge_base_service


class AgentOrchestrator:
    """Central multi-agent coordinator unifying routing, RAG retrieval, agent execution, and Learning Twin evolution."""

    def __init__(
        self,
        llm_provider: BaseLLMProvider | None = None,
        rag_service: KnowledgeBaseService | None = None,
        updater: TwinUpdater | None = None,
    ):
        self.llm_provider = llm_provider or get_llm_provider()
        self.rag_service = rag_service or knowledge_base_service
        self.twin_updater = updater or twin_updater

        # Instantiate specialized agents
        self.agents: dict[str, BaseEducationalAgent] = {
            "TutorAgent": TutorAgent(self.llm_provider),
            "AssessmentAgent": AssessmentAgent(self.llm_provider),
            "GradingAgent": GradingAgent(self.llm_provider),
            "PracticeAgent": PracticeAgent(),
            "MisconceptionAgent": MisconceptionAgent(),
            "RecommendationAgent": RecommendationAgent(),
            "MissionAgent": MissionAgent(),
            "LearnerProfilerAgent": LearnerProfilerAgent(),
        }

        self._session_states: dict[str, OrchestratorState] = {}

    def get_or_create_state(self, session_id: str, learner_id: str) -> OrchestratorState:
        """Fetch or initialize session state."""
        if session_id not in self._session_states:
            self._session_states[session_id] = OrchestratorState(
                session_id=session_id,
                learner_id=learner_id,
            )
        return self._session_states[session_id]

    async def handle_interaction(
        self,
        query: str,
        learner_id: str,
        session_id: str | None = None,
        explicit_intent: str | None = None,
        language_preference: str | None = None,
        payload: dict[str, Any] | None = None,
    ) -> AgentResponse:
        """Execute full multi-agent learning cycle."""
        session_id = session_id or str(uuid.uuid4())
        payload = payload or {}
        state = self.get_or_create_state(session_id, learner_id)

        # 1. Multilingual Routing
        lang_decision = LanguageRouter.route_language(
            query, user_explicit_preference=language_preference
        )

        # 2. Intent Routing
        active_assessment = bool(state.active_assessment_id)
        routing: RoutingDecision = IntentRouter.route(
            query=query,
            explicit_intent=explicit_intent,
            active_assessment=active_assessment,
        )

        # 3. Topic & Concept Semantic Mapping
        mapped_topic = topic_mapper.map_query(query)
        topic_id = payload.get("topic_id") or state.current_topic_id or mapped_topic.topic_id
        concept_id = (
            payload.get("concept_id")
            or state.current_concept_id
            or mapped_topic.concept_matched
            or topic_id
        )
        subject = payload.get("subject") or mapped_topic.subject

        # 4. Contextual RAG Retrieval
        rag_context_text = ""
        try:
            rag_results = await self.rag_service.retrieve_context(
                query=query,
                subject=subject,
                topic=topic_id,
                top_k=2,
            )
            rag_context_text = rag_results.assembled_context
        except Exception:
            rag_context_text = ""

        # 5. Build Learner Context Snapshot
        cognitive_snapshot = self.twin_updater.get_snapshot(learner_id)
        mastery_val = cognitive_snapshot.mastery_levels.get(topic_id, 0.40)
        active_misconceptions = [
            m.misconception_id for m in cognitive_snapshot.active_misconceptions
        ]

        learner_context = {
            "mastery": mastery_val,
            "current_level": "undergraduate",
            "preferred_style": cognitive_snapshot.preferred_learning_style,
            "active_misconceptions": active_misconceptions,
            "turn_count": state.interaction_turn,
            "knowledge_map": cognitive_snapshot.mastery_levels,
            "overdue_reviews": [
                c for c, m in cognitive_snapshot.mastery_levels.items() if m < 0.60
            ],
            "primary_subject": subject,
        }

        # 6. Construct AgentRequest
        request = AgentRequest(
            learner_id=learner_id,
            session_id=session_id,
            intent=routing.intent.value,
            query=query,
            topic_id=topic_id,
            concept_id=concept_id,
            subject=subject,
            learner_context=learner_context,
            curriculum_context={
                "prerequisites": mapped_topic.prerequisites,
                "skills": mapped_topic.skills,
            },
            rag_context=rag_context_text,
            payload=payload,
            language=lang_decision.response_language,
        )

        # 7. Execute Target Specialized Agent
        agent: BaseEducationalAgent = self.agents.get(
            routing.target_agent, self.agents["TutorAgent"]
        )
        response: AgentResponse = await agent.process(request)

        # 8. Record Turn in State
        state.record_turn(
            agent_name=agent.name,
            intent=routing.intent.value,
            topic_id=topic_id,
            concept_id=concept_id,
        )

        # 9. Feed Evidence to Learning Twin Updater
        for ev in response.evidence:
            self.twin_updater.apply_evidence(ev)

        return response


orchestrator = AgentOrchestrator()
