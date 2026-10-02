"""Tests for specialized educational agents."""

import pytest

from backend.app.agents.assessment.agent import AssessmentAgent
from backend.app.agents.contract import AgentRequest
from backend.app.agents.grading.agent import GradingAgent
from backend.app.agents.misconception.agent import MisconceptionAgent
from backend.app.agents.mission.agent import MissionAgent
from backend.app.agents.practice.agent import PracticeAgent
from backend.app.agents.recommendation.agent import RecommendationAgent
from backend.app.agents.tutor.agent import TutorAgent
from backend.app.llm.provider import MockLLMProvider


@pytest.mark.asyncio
async def test_tutor_agent_execution():
    mock_llm = MockLLMProvider()
    agent = TutorAgent(mock_llm)
    req = AgentRequest(
        learner_id="u1",
        intent="LEARN",
        query="What is overfitting in machine learning?",
        topic_id="ml_supervised",
        concept_id="overfitting",
    )
    res = await agent.process(req)
    assert res.agent_name == "TutorAgent"
    assert res.status == "success"
    assert len(res.evidence) == 1
    assert res.evidence[0].concept_id == "overfitting"


@pytest.mark.asyncio
async def test_assessment_agent_execution():
    mock_llm = MockLLMProvider()
    agent = AssessmentAgent(mock_llm)
    req = AgentRequest(
        learner_id="u1",
        intent="ASSESS",
        query="Quiz me on SQL joins",
        topic_id="sql_joins",
        concept_id="inner_join",
        payload={"num_questions": 2},
    )
    res = await agent.process(req)
    assert res.agent_name == "AssessmentAgent"
    assert len(res.result["questions"]) == 2


@pytest.mark.asyncio
async def test_grading_agent_mcq_correct():
    agent = GradingAgent()
    req = AgentRequest(
        learner_id="u1",
        intent="GRADE",
        query="A",
        topic_id="ml_supervised",
        concept_id="overfitting",
        payload={
            "question_type": "mcq",
            "question_text": "What is overfitting?",
            "correct_answer": "Model memorizes training noise and fails on unseen data.",
            "learner_response": "Model memorizes training noise and fails on unseen data.",
        },
    )
    res = await agent.process(req)
    assert res.result["is_correct"] is True
    assert res.result["score"] == 1.0


@pytest.mark.asyncio
async def test_grading_agent_mcq_misconception_detection():
    agent = GradingAgent()
    req = AgentRequest(
        learner_id="u1",
        intent="GRADE",
        query="B",
        topic_id="ml_supervised",
        concept_id="overfitting",
        payload={
            "question_type": "mcq",
            "question_text": "What is overfitting?",
            "correct_answer": "Model memorizes training noise.",
            "learner_response": "Model is always superior with 100% training accuracy.",
            "distractor_misconceptions": {
                "Model is always superior with 100% training accuracy.": "Overfitting Equates High Performance",
            },
        },
    )
    res = await agent.process(req)
    assert res.result["is_correct"] is False
    assert len(res.evidence) == 2  # AssessmentEvidence + MisconceptionEvidence
    assert res.evidence[1].misconception_id == "overfitting_equates_high_performance"


@pytest.mark.asyncio
async def test_practice_agent_generation():
    agent = PracticeAgent()
    req = AgentRequest(
        learner_id="u1",
        intent="PRACTICE",
        query="Practice Python async coroutines",
        topic_id="py_async",
        concept_id="async_await",
    )
    res = await agent.process(req)
    assert res.agent_name == "PracticeAgent"
    assert "async" in res.result["starter_code"]


@pytest.mark.asyncio
async def test_misconception_agent_diagnostic():
    agent = MisconceptionAgent()
    req = AgentRequest(
        learner_id="u1",
        intent="MISCONCEPTION",
        query="Why is my model bad if it got 100% training accuracy? Isn't overfitting good?",
        topic_id="ml_supervised",
        concept_id="overfitting",
    )
    res = await agent.process(req)
    assert res.agent_name == "MisconceptionAgent"
    assert res.result["misconception_id"] == "overfitting_accuracy"


@pytest.mark.asyncio
async def test_recommendation_and_mission_agents():
    rec_agent = RecommendationAgent()
    req = AgentRequest(
        learner_id="u1",
        intent="RECOMMEND",
        query="What next?",
        learner_context={"knowledge_map": {"py_basics": 0.90, "ml_supervised": 0.40}},
    )
    res_rec = await rec_agent.process(req)
    assert res_rec.agent_name == "RecommendationAgent"
    assert len(res_rec.result["recommendations"]) > 0

    mission_agent = MissionAgent()
    req_m = AgentRequest(
        learner_id="u1",
        intent="MISSION",
        query="Start mission",
        topic_id="py_async",
    )
    res_m = await mission_agent.process(req_m)
    assert res_m.agent_name == "MissionAgent"
    assert len(res_m.result["tasks"]) == 3
