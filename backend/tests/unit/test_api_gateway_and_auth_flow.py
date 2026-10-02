"""Unit and Integration Tests for AI-SENIOR-X API Gateway, Health, CORS, and Auth Routes."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_root_health_and_index_endpoints(client: AsyncClient):
    """Verify root /health, /, and /api/v1/health endpoints."""
    # Test 1: GET /health
    res_health = await client.get("/health")
    assert res_health.status_code == 200
    data = res_health.json()
    assert data["status"] == "ok"
    assert data["service"] == "AI-SENIOR-X"

    # Test 2: GET /
    res_root = await client.get("/")
    assert res_root.status_code == 200
    data_root = res_root.json()
    assert data_root["status"] == "ok"
    assert data_root["docs"] == "/docs"

    # Test 3: GET /api/v1/health
    res_v1_health = await client.get("/api/v1/health")
    assert res_v1_health.status_code == 200


@pytest.mark.asyncio
async def test_auth_login_and_me_end_to_end_flow(client: AsyncClient):
    """Verify user registration, login, and profile retrieval via API gateway."""
    email = "testuser_gateway@example.com"
    password = "SecurePassword123!"

    # 1. Register new user
    reg_payload = {
        "email": email,
        "password": password,
        "full_name": "Gateway Test User",
        "username": "gateway_user",
        "learning_goal": "Full-Stack AI Architecture",
        "grade_level": "undergraduate",
        "preferred_language": "en",
    }
    res_reg = await client.post("/api/v1/auth/register", json=reg_payload)
    assert res_reg.status_code == 201
    reg_data = res_reg.json()
    assert reg_data["success"] is True
    token = reg_data["data"]["access_token"]
    assert token is not None

    # 2. Login using /api/v1/auth/login
    login_payload = {"email": email, "password": password, "remember_me": True}
    res_login = await client.post("/api/v1/auth/login", json=login_payload)
    assert res_login.status_code == 200
    login_data = res_login.json()
    assert login_data["success"] is True
    access_token = login_data["data"]["access_token"]
    assert access_token is not None
    assert login_data["data"]["user"]["email"] == email

    # 3. Login using /api/auth/login alias
    res_login_alias = await client.post("/api/auth/login", json=login_payload)
    assert res_login_alias.status_code == 200
    assert res_login_alias.json()["success"] is True

    # 4. Get Current User /api/v1/auth/me
    headers = {"Authorization": f"Bearer {access_token}"}
    res_me = await client.get("/api/v1/auth/me", headers=headers)
    assert res_me.status_code == 200
    me_data = res_me.json()
    assert me_data["success"] is True
    assert me_data["data"]["email"] == email
    assert me_data["data"]["full_name"] == "Gateway Test User"
    assert "hashed_password" not in me_data["data"]

    # 5. Invalid password returns 401
    bad_login = await client.post(
        "/api/v1/auth/login", json={"email": email, "password": "WrongPassword"}
    )
    assert bad_login.status_code == 401

    # 6. Demo user auto-seed verification
    demo_login = await client.post(
        "/api/v1/auth/login", json={"email": "srihari", "password": "Password123!"}
    )
    assert demo_login.status_code == 200
    assert demo_login.json()["success"] is True
    assert demo_login.json()["data"]["user"]["full_name"] == "Srihari Haran"
