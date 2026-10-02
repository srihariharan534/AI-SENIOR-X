"""Unit tests for Subject Materials Indexing and Grounded AI Tutor."""

from backend.app.services.subject_material_service import (
    MaterialAskAIRequest,
    subject_material_service,
)


def test_get_subject_materials_python():
    summary = subject_material_service.get_subject_materials("python")
    assert summary.subject_id == "python"
    assert summary.total_materials_count > 0
    assert summary.notes_count > 0
    assert summary.videos_count > 0
    assert summary.code_count > 0
    assert summary.quizzes_count > 0
    assert summary.exercises_count > 0
    assert summary.challenges_count > 0


def test_ask_ai_about_material():
    summary = subject_material_service.get_subject_materials("python")
    assert len(summary.materials) > 0
    first_material = summary.materials[0]

    req = MaterialAskAIRequest(
        material_id=first_material.id,
        user_query="Can you explain this material simply?",
        learner_id="test-learner-01",
    )
    res = subject_material_service.ask_ai_about_material(req)
    assert res.material_id == first_material.id
    assert len(res.answer) > 20
    assert len(res.suggested_followups) > 0
