"""Integration tests for Authentication endpoints."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_auth_registration_and_login_flow(client: AsyncClient):
    # Register new user
    reg_payload = {
        "email": "srihari_auth@ai-senior-x.io",
        "username": "srihari_haran",
        "password": "Password123!",
        "confirm_password": "Password123!",
        "full_name": "Srihari Haran",
        "learning_goal": "Data Science / AI / Software Engineering",
        "grade_level": "undergraduate",
        "preferred_language": "en",
    }
    reg_res = await client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_res.status_code == 201
    reg_data = reg_res.json()
    assert reg_data["success"] is True
    assert "access_token" in reg_data["data"]
    assert reg_data["data"]["user"]["full_name"] == "Srihari Haran"
    assert reg_data["data"]["user"]["username"] == "srihari_haran"
    token = reg_data["data"]["access_token"]
    refresh_token = reg_data["data"]["refresh_token"]

    # Access protected /auth/me
    headers = {"Authorization": f"Bearer {token}"}
    me_res = await client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["data"]["email"] == "srihari_auth@ai-senior-x.io"
    assert me_data["data"]["full_name"] == "Srihari Haran"

    # Login using username instead of email
    login_uname_res = await client.post(
        "/api/v1/auth/login",
        json={"email": "srihari_haran", "password": "Password123!", "remember_me": True},
    )
    assert login_uname_res.status_code == 200
    assert login_uname_res.json()["data"]["user"]["full_name"] == "Srihari Haran"

    # Refresh token
    refresh_res = await client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
    assert refresh_res.status_code == 200
    refresh_data = refresh_res.json()
    assert "access_token" in refresh_data["data"]

    # Logout
    logout_res = await client.post("/api/v1/auth/logout", headers=headers)
    assert logout_res.status_code == 200
    assert logout_res.json()["data"]["success"] is True


@pytest.mark.asyncio
async def test_auth_invalid_credentials_and_enumeration_protection(client: AsyncClient):
    # Invalid login
    res = await client.post(
        "/api/v1/auth/login",
        json={"email": "nonexistent@ai-senior-x.io", "password": "WrongPassword"},
    )
    assert res.status_code == 401

    # Forgot password should always return generic 200 success (preventing enumeration)
    forgot_res = await client.post(
        "/api/v1/auth/forgot-password",
        json={"email": "unknown_address_999@ai-senior-x.io"},
    )
    assert forgot_res.status_code == 200
    assert forgot_res.json()["data"]["success"] is True


@pytest.mark.asyncio
async def test_unauthorized_access(client: AsyncClient):
    res = await client.get("/api/v1/auth/me")
    assert res.status_code == 401


@pytest.mark.asyncio
async def test_multi_user_data_isolation(client: AsyncClient):
    # User 1
    u1_res = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "user1_iso@ai-senior-x.io",
            "username": "user1_iso",
            "password": "Password123!",
            "full_name": "User One",
        },
    )
    assert u1_res.status_code == 201
    u1_token = u1_res.json()["data"]["access_token"]

    # User 2
    u2_res = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "user2_iso@ai-senior-x.io",
            "username": "user2_iso",
            "password": "Password123!",
            "full_name": "User Two",
        },
    )
    assert u2_res.status_code == 201
    u2_token = u2_res.json()["data"]["access_token"]

    # Check identities are distinct
    me1 = await client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {u1_token}"})
    me2 = await client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {u2_token}"})
    assert me1.json()["data"]["full_name"] == "User One"
    assert me2.json()["data"]["full_name"] == "User Two"
    assert me1.json()["data"]["id"] != me2.json()["data"]["id"]
