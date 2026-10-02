"""Integration tests for Assessment and Grading endpoints."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_assessment_crud_and_submission(client: AsyncClient, auth_headers):
    # Create Assessment
    create_payload = {
        "title": "Data Structures Assessment",
        "subject": "Computer Science",
        "difficulty": "intermediate",
        "max_score": 10.0,
        "questions": [
            {
                "prompt": "What is the average time complexity of hash table lookup?",
                "question_type": "multiple_choice",
                "options": {"A": "O(1)", "B": "O(n)", "C": "O(log n)"},
                "correct_answer": "A",
                "explanation": "Hash tables compute keys to indices in O(1) expected time.",
                "points": 10.0,
                "difficulty": "medium",
            }
        ],
    }
    create_res = await client.post(
        "/api/v1/assessment/create", json=create_payload, headers=auth_headers
    )
    assert create_res.status_code == 201
    create_data = create_res.json()
    assert create_data["success"] is True
    assessment_id = create_data["data"]["id"]
    question_id = create_data["data"]["questions"][0]["id"]

    # Submit Correct Answer
    submit_payload = {
        "question_id": question_id,
        "user_response": "A",
        "response_time_seconds": 12.5,
    }
    submit_res = await client.post(
        f"/api/v1/assessment/{assessment_id}/submit",
        json=submit_payload,
        headers=auth_headers,
    )
    assert submit_res.status_code == 200
    submit_data = submit_res.json()
    assert submit_data["success"] is True
    assert submit_data["data"]["is_correct"] is True
    assert submit_data["data"]["score_awarded"] == 10.0

    # List user assessments
    list_res = await client.get("/api/v1/assessment/list", headers=auth_headers)
    assert list_res.status_code == 200
    list_data = list_res.json()
    assert len(list_data["data"]) >= 1
