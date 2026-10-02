"""Integration tests for Learning curriculum, missions, and recommendations."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_curriculum(client: AsyncClient):
    res = await client.get("/api/v1/learning/curriculum")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert len(data["data"]) > 0


@pytest.mark.asyncio
async def test_get_missions_and_recommendations(client: AsyncClient, auth_headers):
    miss_res = await client.get("/api/v1/learning/missions", headers=auth_headers)
    assert miss_res.status_code == 200
    miss_data = miss_res.json()
    assert miss_data["success"] is True

    rec_res = await client.get("/api/v1/learning/recommendations", headers=auth_headers)
    assert rec_res.status_code == 200
    rec_data = rec_res.json()
    assert rec_data["success"] is True
    assert len(rec_data["data"]) > 0
