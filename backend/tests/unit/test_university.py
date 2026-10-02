"""
Unit tests for AI-SENIOR-X University Learning Engine endpoints.
Verifies schools listing, course detail, 'Understand This Course' explanation,
lesson streaming, teach-back active recall, video doubt resolution, and multi-modal stuck diagnostics.
"""

import pytest
from httpx import ASGITransport, AsyncClient

from backend.app.main import create_app


@pytest.fixture
def app():
    return create_app()


@pytest.mark.asyncio
async def test_get_university_schools(app):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.get("/api/v1/university/schools")
        assert resp.status_code == 200
        data = resp.json()["data"]
        assert len(data) == 4
        school_names = [s["name"] for s in data]
        assert any("Computer Science" in s for s in school_names)
        assert any("AI & Data" in s for s in school_names)
        assert any("Cloud & Infrastructure" in s for s in school_names)
        assert any("Career & Innovation" in s for s in school_names)
        total_subjs = sum(len(s["subjects"]) for s in data)
        assert total_subjs == 22


@pytest.mark.asyncio
async def test_get_python_course_detail(app):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.get("/api/v1/university/courses/python")
        assert resp.status_code == 200
        course = resp.json()["data"]
        assert course["id"] == "python"
        assert course["school_name"] == "Computer Science"
        assert len(course["modules"]) >= 5
        assert course["explanation"]["what_is_this_subject"] is not None
        assert len(course["explanation"]["where_is_it_used"]) >= 3
        assert len(course["learning_outcomes"]) >= 4


@pytest.mark.asyncio
async def test_get_course_explanation(app):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.get("/api/v1/university/courses/python/explanation")
        assert resp.status_code == 200
        exp = resp.json()["data"]
        assert "Python" in exp["what_is_this_subject"]
        assert len(exp["projects_you_will_build"]) >= 2
        assert len(exp["careers_and_roles"]) >= 3


@pytest.mark.asyncio
async def test_get_lesson_detail(app):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.get("/api/v1/university/courses/python/lessons/py-les-101")
        assert resp.status_code == 200
        les = resp.json()["data"]
        assert les["id"] == "py-les-101"
        assert "Bytecode" in les["title"]
        assert les["knowledge_check"]["correct_index"] == 1
        assert len(les["voice_script"]) > 20


@pytest.mark.asyncio
async def test_teach_back_evaluation(app):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "user_id": "test-learner",
            "course_id": "python",
            "lesson_id": "py-les-101",
            "concept_name": "CPython Variables as Pointers",
            "explanation_text": "In Python variables do not hold raw values in memory boxes. Every value is a PyObject on the heap. When assigning b = a we copy the pointer, meaning in-place mutations affect the shared heap object.",
        }
        resp = await client.post("/api/v1/university/teach-back", json=payload)
        assert resp.status_code == 200
        eval_res = resp.json()["data"]
        assert eval_res["conceptual_accuracy_score"] >= 75.0
        assert eval_res["learning_twin_status"] == "DEMONSTRATED"


@pytest.mark.asyncio
async def test_video_doubt_resolution(app):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "user_id": "test-learner",
            "course_id": "python",
            "video_timestamp_seconds": 145,
            "current_concept": "CPython Heap Pointers",
            "question_text": "Why does b.append affect a as well?",
            "teaching_mode": "deep",
            "explanation_depth": 3,
            "language": "en",
        }
        resp = await client.post("/api/v1/university/doubt", json=payload)
        assert resp.status_code == 200
        dbt = resp.json()["data"]
        assert dbt["concept"] == "CPython Heap Pointers"
        assert len(dbt["answer_text"]) > 10


@pytest.mark.asyncio
async def test_diagnose_stuck(app):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "user_id": "test-learner",
            "current_subject": "python",
            "query_text": "I don't understand why changing b mutated a list in my code.",
        }
        resp = await client.post("/api/v1/university/diagnose-stuck", json=payload)
        assert resp.status_code == 200
        diag = resp.json()["data"]
        assert "Pointer" in diag["root_concept_gap"]
        assert diag["recommended_lesson_id"] == "py-les-101"
