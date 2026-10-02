"""Tests for multi-agent orchestrator coordination."""

import pytest

from backend.app.agents.orchestrator.agent import AgentOrchestrator
from backend.app.agents.orchestrator.router import IntentRouter, UserIntent
from backend.app.learning_twin.twin_updater import TwinUpdater
from backend.app.llm.provider import MockLLMProvider


def test_intent_router_classifications():
    # 1. Assessment
    d1 = IntentRouter.route("Give me a quiz on decision trees")
    assert d1.intent == UserIntent.ASSESS
    assert d1.target_agent == "AssessmentAgent"

    # 2. Practice
    d2 = IntentRouter.route("I want to practice solving SQL queries")
    assert d2.intent == UserIntent.PRACTICE
    assert d2.target_agent == "PracticeAgent"

    # 3. Recommendation
    d3 = IntentRouter.route("What should I learn next on my roadmap?")
    assert d3.intent == UserIntent.RECOMMEND
    assert d3.target_agent == "RecommendationAgent"

    # 4. Tutor / Explain
    d4 = IntentRouter.route("Explain how backpropagation works with an analogy")
    assert d4.intent == UserIntent.EXPLAIN
    assert d4.target_agent == "TutorAgent"


@pytest.mark.asyncio
async def test_orchestrator_multi_turn_interaction():
    mock_llm = MockLLMProvider()
    updater = TwinUpdater()
    orch = AgentOrchestrator(llm_provider=mock_llm, updater=updater)

    learner_id = "test-learner-orch-1"
    session_id = "test-session-orch-1"

    # Turn 1: User asks for an explanation
    resp1 = await orch.handle_interaction(
        query="What is overfitting in machine learning?",
        learner_id=learner_id,
        session_id=session_id,
    )
    assert resp1.agent_name == "TutorAgent"
    assert resp1.status == "success"

    # Verify Twin updater recorded knowledge
    snap1 = updater.get_snapshot(learner_id)
    assert snap1.learner_id == learner_id
    assert len(snap1.history) >= 1

    # Turn 2: User requests practice
    resp2 = await orch.handle_interaction(
        query="Give me a practice exercise on overfitting",
        learner_id=learner_id,
        session_id=session_id,
    )
    assert resp2.agent_name == "PracticeAgent"
    assert resp2.status == "success"

    # Verify state tracking across turns
    state = orch.get_or_create_state(session_id, learner_id)
    assert state.interaction_turn == 2
    assert state.previous_agent_name == "TutorAgent"
    assert state.active_agent_name == "PracticeAgent"
