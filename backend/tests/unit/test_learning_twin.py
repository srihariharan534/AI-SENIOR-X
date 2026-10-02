"""Unit tests for Learning Twin, Knowledge State, Skill Graph, and Twin Updater."""

from datetime import UTC, datetime

import pytest

from backend.app.learning_twin.decay_model import ConceptRetention, MemoryDecayModel
from backend.app.learning_twin.evidence import (
    AssessmentEvidence,
    MisconceptionEvidence,
)
from backend.app.learning_twin.knowledge_state import KnowledgeState, MasteryLevel
from backend.app.learning_twin.learner_model import LearnerTwin
from backend.app.learning_twin.misconception_state import MisconceptionState
from backend.app.learning_twin.skill_graph import SkillGraph
from backend.app.learning_twin.twin_updater import TwinUpdater


def test_knowledge_state_mastery_update():
    ks = KnowledgeState()
    # Correct answer update
    c1 = ks.update_concept("recursion", "Computer Science", "Algorithms", is_correct=True)
    assert c1.mastery_score > 0.1
    assert c1.level in (MasteryLevel.LEARNING, MasteryLevel.DEVELOPING)
    assert c1.consecutive_correct == 1

    # Consecutive correct answers
    ks.update_concept("recursion", "Computer Science", "Algorithms", is_correct=True)
    ks.update_concept("recursion", "Computer Science", "Algorithms", is_correct=True)
    c3 = ks.get_concept_mastery("recursion")
    assert c3.consecutive_correct == 3
    assert c3.mastery_score >= 0.4


def test_skill_graph_synchronization():
    ks = KnowledgeState()
    ks.update_concept("variables", "Python", "Python Basics", is_correct=True)
    ks.update_concept("loops", "Python", "Python Basics", is_correct=True)

    sg = SkillGraph()
    sg.sync_from_knowledge_state(ks)

    skills = sg.get_all_skills()
    assert len(skills) > 0
    strongest = sg.get_strongest_skills(3)
    assert len(strongest) > 0


def test_misconception_state_lifecycle():
    ms = MisconceptionState()
    item = ms.record_misconception(
        concept_key="Neural Networks",
        misconception_tag="vanishing_gradient_confusion",
        description="Confused vanishing and exploding gradients.",
    )
    assert item.status == "active"
    assert len(ms.list_active()) == 1

    # Re-observation increments count
    item2 = ms.record_misconception(
        concept_key="Neural Networks",
        misconception_tag="vanishing_gradient_confusion",
        description="Confused vanishing and exploding gradients.",
    )
    assert item2.observation_count == 2

    # Resolve
    resolved = ms.resolve_misconception("vanishing_gradient_confusion", "Mastered ReLU mitigation")
    assert resolved is not None
    assert resolved.status == "resolved"
    assert len(ms.list_active()) == 0
    assert len(ms.list_resolved()) == 1


def test_memory_decay_and_spaced_repetition():
    now = datetime.now(UTC)
    retention = MemoryDecayModel.calculate_retention(now, stability_days=5.0)
    assert pytest.approx(retention, rel=1e-2) == 1.0

    record = ConceptRetention(concept_key="backpropagation")
    updated = MemoryDecayModel.update_retention_on_practice(record, is_successful=True)
    assert updated.repetition_count == 2
    assert updated.stability_factor > 3.0


def test_twin_updater_with_evidence():
    twin = LearnerTwin(learner_id="twin_1", user_id="user_1")

    evidence_assessment = AssessmentEvidence(
        learner_id="user_1",
        subject="Python",
        topic="Python Basics",
        concept="variables",
        question_id="q1",
        user_response="x = 5",
        is_correct=True,
        score_awarded=10.0,
    )
    TwinUpdater.apply_evidence(twin, evidence_assessment)
    assert "variables" in twin.knowledge_state.concepts
    assert len(twin.history.events) == 1

    evidence_misconception = MisconceptionEvidence(
        learner_id="user_1",
        subject="Python",
        topic="AsyncIO",
        concept="event_loop",
        misconception_tag="blocking_calls_in_coroutine",
        description="Used time.sleep inside async coroutine.",
    )
    TwinUpdater.apply_evidence(twin, evidence_misconception)
    assert "blocking_calls_in_coroutine" in twin.misconception_state.active_misconceptions
    assert len(twin.history.events) == 2

    summary = twin.get_summary()
    assert summary["total_concepts_tracked"] >= 1
    assert summary["active_misconceptions"] == 1
