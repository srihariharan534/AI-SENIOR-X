"""Integration tests for Progress and Analytics endpoints."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_progress_activity_and_overview(client: AsyncClient, auth_headers):
    # Log study activity
    payload = {
        "subject": "Computer Science",
        "module_id": "py-101",
        "time_spent_minutes": 45,
        "mastery_delta": 0.25,
    }
    act_res = await client.post("/api/v1/progress/activity", json=payload, headers=auth_headers)
    assert act_res.status_code == 201
    act_data = act_res.json()
    assert act_data["success"] is True
    assert act_data["data"]["total_time_spent_minutes"] == 45

    # Get dashboard overview
    over_res = await client.get("/api/v1/progress/overview", headers=auth_headers)
    assert over_res.status_code == 200
    over_data = over_res.json()
    assert over_data["success"] is True
    assert over_data["data"]["total_study_minutes"] >= 45
