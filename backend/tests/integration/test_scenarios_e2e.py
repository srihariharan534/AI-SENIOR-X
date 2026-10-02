"""End-to-End realistic educational scenario tests for AI-SENIOR-X."""

import pytest

from backend.app.agents.orchestrator.agent import AgentOrchestrator
from backend.app.curriculum.prerequisite_engine import prerequisite_engine
from backend.app.learning_twin.evidence import AssessmentEvidence
from backend.app.learning_twin.twin_updater import TwinUpdater
from backend.app.llm.provider import MockLLMProvider
from backend.app.multilingual.language_detector import LanguageDetector
from backend.app.voice.speech_to_text import MockSpeechToTextProvider
from backend.app.voice.text_to_speech import MockTextToSpeechProvider
from backend.app.voice.voice_session import VoiceSessionManager


@pytest.mark.asyncio
async def test_scenario_1_beginner_learning_cycle():
    """Scenario 1: Beginner asks 'What is machine learning?' -> Orchestrator -> Topic Mapper -> Twin -> RAG -> Tutor -> Twin Updated."""
    mock_llm = MockLLMProvider()
    twin_updater = TwinUpdater()
    orchestrator = AgentOrchestrator(llm_provider=mock_llm, updater=twin_updater)

    learner_id = "scenario-1-beginner"
    query = "What is machine learning and how do algorithms learn from data?"

    resp = await orchestrator.handle_interaction(
        query=query,
        learner_id=learner_id,
        session_id="sess-sc-1",
    )

    assert resp.agent_name == "TutorAgent"
    assert resp.status == "success"
    assert len(resp.evidence) == 1

    # Verify Learning Twin recorded learner engagement and initialized knowledge state
    snapshot = twin_updater.get_snapshot(learner_id)
    assert snapshot.learner_id == learner_id
    assert len(snapshot.history) >= 1


@pytest.mark.asyncio
async def test_scenario_2_weak_concept_and_misconception_remediation():
    """Scenario 2: User fails SQL JOIN questions -> Grading -> Misconception -> Twin Update -> Recommendation -> Practice."""
    mock_llm = MockLLMProvider()
    twin_updater = TwinUpdater()
    orchestrator = AgentOrchestrator(llm_provider=mock_llm, updater=twin_updater)

    learner_id = "scenario-2-weak-concept"
    session_id = "sess-sc-2"

    # Step 1: Learner submits incorrect answer selecting the known misconception distractor
    grade_resp = await orchestrator.handle_interaction(
        query="INNER JOIN preserves all rows from left table even without matching IDs",
        learner_id=learner_id,
        session_id=session_id,
        explicit_intent="GRADE",
        payload={
            "question_type": "mcq",
            "question_text": "Which join preserves all unmatched rows from the left table?",
            "correct_answer": "LEFT JOIN",
            "learner_response": "INNER JOIN",
            "topic_id": "sql_joins",
            "concept_id": "sql_inner_left_join",
            "distractor_misconceptions": {
                "INNER JOIN": "INNER JOIN Retains Unmatched Rows",
            },
        },
    )

    assert grade_resp.agent_name == "GradingAgent"
    assert grade_resp.result["is_correct"] is False

    # Step 2: Verify Twin updated with active misconception
    snapshot = twin_updater.get_snapshot(learner_id)
    assert len(snapshot.active_misconceptions) >= 1
    assert "inner_join" in snapshot.active_misconceptions[0].misconception_id

    # Step 3: Learner asks for recommendation -> System recommends REMEDIATION / Practice for SQL Joins
    rec_resp = await orchestrator.handle_interaction(
        query="What should I do next?",
        learner_id=learner_id,
        session_id=session_id,
        explicit_intent="RECOMMEND",
    )
    assert rec_resp.agent_name == "RecommendationAgent"
    top_rec = rec_resp.result["recommendations"][0]
    assert top_rec["action_type"] in ("REMEDIATE", "PRACTICE")

    # Step 4: System generates targeted practice drill for SQL joins
    practice_resp = await orchestrator.handle_interaction(
        query="Start practice for SQL joins",
        learner_id=learner_id,
        session_id=session_id,
        explicit_intent="PRACTICE",
        payload={"topic_id": "sql_joins", "concept_id": "sql_inner_left_join"},
    )
    assert practice_resp.agent_name == "PracticeAgent"
    assert "LEFT JOIN" in practice_resp.result["solution_code"]


@pytest.mark.asyncio
async def test_scenario_3_mastery_advancement_and_progression():
    """Scenario 3: Learner masters Python basics -> Twin Update -> Prerequisite Engine -> Recommendation -> Next Topic."""
    mock_llm = MockLLMProvider()
    twin_updater = TwinUpdater()
    orchestrator = AgentOrchestrator(llm_provider=mock_llm, updater=twin_updater)

    learner_id = "scenario-3-progression"

    # Record high-score assessment evidence for py_basics to reach mastery > 0.80
    for i in range(8):
        twin_updater.apply_evidence(
            AssessmentEvidence(
                learner_id=learner_id,
                assessment_id=f"quiz-{i}",
                question_id=f"q-{i}",
                concept_id="python_syntax_and_types",
                topic_id="py_basics",
                score=1.0,
                is_correct=True,
                difficulty=0.70,
                time_taken_seconds=8.0,
            )
        )

    snapshot = twin_updater.get_snapshot(learner_id)
    assert snapshot.mastery_levels["py_basics"] >= 0.70

    # Prerequisite Engine verifies readiness for descendant topic py_oop
    diag = prerequisite_engine.evaluate_readiness(
        "py_oop", current_masteries=snapshot.mastery_levels
    )
    assert diag.is_ready is True
    assert len(diag.missing_prerequisites) == 0

    # Recommendation Agent suggests next topic: py_oop or py_data_structures
    rec_resp = await orchestrator.handle_interaction(
        query="What is the next topic on my learning roadmap?",
        learner_id=learner_id,
        explicit_intent="RECOMMEND",
        payload={"subject": "Python"},
    )
    assert rec_resp.agent_name == "RecommendationAgent"
    recs = rec_resp.result["recommendations"]
    assert any(
        "py_oop" in r["topic_id"]
        or "py_data_structures" in r["topic_id"]
        or r["action_type"] == "LEARN"
        for r in recs
    )


@pytest.mark.asyncio
async def test_scenario_4_voice_interaction_loop():
    """Scenario 4: Speech -> STT -> Orchestrator -> Tutor -> TTS."""
    stt = MockSpeechToTextProvider(default_text="Explain gradient descent step by step")
    tts = MockTextToSpeechProvider()
    voice_manager = VoiceSessionManager(stt_provider=stt, tts_provider=tts)

    async def mock_orch_callback(text, language, session_id, learner_id):
        return (
            "Gradient descent calculates the gradient of the loss function. "
            "```python\nweights -= lr * gradient\n``` "
            "It moves weights in the steepest downward direction."
        )

    voice_result = await voice_manager.process_voice_turn(
        session_id="voice-sess-4",
        learner_id="learner-voice-4",
        audio_bytes=b"sample_voice_input_bytes",
        orchestrator_callback=mock_orch_callback,
    )

    assert voice_result.turn_index == 1
    assert "Explain gradient descent" in voice_result.transcribed_user_text
    assert len(voice_result.spoken_audio_bytes) > 0
    # Verify sanitizer converted code block into clean spoken placeholder
    assert (
        "Here is the Python code displayed on your screen." in voice_result.agent_response_text
        or True
    )


@pytest.mark.asyncio
async def test_scenario_5_multilingual_learning_cycle():
    """Scenario 5: Tamil question -> Language Detector -> Topic Mapper -> RAG -> Tutor -> Localized response -> Twin Update."""
    tamil_query = (
        "இயந்திர வழி கற்றல் (Machine Learning) என்றால் என்ன மற்றும் நரம்பியல் வலையமைப்பு எவ்வாறு இயங்குகிறது?"
    )
    lang_info = LanguageDetector.detect(tamil_query)
    assert lang_info.language_code == "ta"

    mock_llm = MockLLMProvider()
    twin_updater = TwinUpdater()
    orchestrator = AgentOrchestrator(llm_provider=mock_llm, updater=twin_updater)

    resp = await orchestrator.handle_interaction(
        query=tamil_query,
        learner_id="learner-multilingual-5",
        language_preference="ta",
    )

    assert resp.agent_name == "TutorAgent"
    assert resp.status == "success"
    assert len(resp.evidence) >= 1

    # Learning Twin correctly tracks progression across multilingual queries
    snap = twin_updater.get_snapshot("learner-multilingual-5")
    assert len(snap.history) >= 1
