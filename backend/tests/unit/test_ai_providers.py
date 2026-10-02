"""Unit and Security Tests for AI Provider Secret Management, Adapters, and Routing."""

import pytest
from httpx import AsyncClient

from backend.app.core.crypto import decrypt_api_key, encrypt_api_key, mask_api_key
from backend.app.llm.provider import (
    GeminiProvider,
    GroqProvider,
    MockLLMProvider,
    NvidiaNimProvider,
    OpenRouterProvider,
    get_llm_provider,
)


def test_crypto_encryption_and_decryption_roundtrip():
    """Ensure API keys are securely encrypted at rest and cleanly decrypted server-side."""
    original_key = "sk-or-v1-9876543210abcdef9876543210fedcba"
    encrypted = encrypt_api_key(original_key)

    assert encrypted != original_key
    assert len(encrypted) > len(original_key)

    decrypted = decrypt_api_key(encrypted)
    assert decrypted == original_key


def test_masked_key_security_invariants():
    """Verify that masked keys never expose more than trailing 4 characters."""
    sample_key = "gsk_1234567890abcdef1234567890abcdef8F2A"
    masked = mask_api_key(sample_key)

    assert masked == "••••••••8F2A"
    assert "1234567890" not in masked
    assert "abcdef" not in masked

    # Test encrypted string masking
    encrypted = encrypt_api_key(sample_key)
    masked_enc = mask_api_key(encrypted)
    assert masked_enc.endswith("8F2A")


@pytest.mark.asyncio
async def test_provider_adapters_creation_and_model_listing():
    """Verify provider adapters instantiate properly and return valid model lists."""
    gemini = get_llm_provider("gemini")
    assert isinstance(gemini, GeminiProvider)
    gemini_models = await gemini.list_models()
    assert "gemini-1.5-pro" in gemini_models

    openrouter = get_llm_provider("openrouter")
    assert isinstance(openrouter, OpenRouterProvider)
    openrouter_models = await openrouter.list_models()
    assert "anthropic/claude-3.5-sonnet" in openrouter_models

    groq = get_llm_provider("groq")
    assert isinstance(groq, GroqProvider)
    groq_models = await groq.list_models()
    assert "llama-3.3-70b-versatile" in groq_models

    nvidia = get_llm_provider("nvidia_nim")
    assert isinstance(nvidia, NvidiaNimProvider)
    nvidia_models = await nvidia.list_models()
    assert "meta/llama-3.3-70b-instruct" in nvidia_models


@pytest.mark.asyncio
async def test_mock_provider_test_connection():
    """Verify connection testing returns latency and safe metadata."""
    mock = MockLLMProvider()
    res = await mock.test_connection()

    assert res["success"] is True
    assert "latency_ms" in res
    assert res["latency_ms"] >= 0
    assert "Connection verified" in res["message"]


@pytest.mark.asyncio
async def test_provider_api_endpoints(client: AsyncClient, auth_headers):
    """Integration test for Providers directory, test connection, routing, health, and usage."""
    # 1. List Providers
    list_res = await client.get("/api/v1/providers", headers=auth_headers)
    assert list_res.status_code == 200
    providers_data = list_res.json()["data"]
    assert len(providers_data) == 4
    provider_ids = [p["provider"] for p in providers_data]
    assert "openrouter" in provider_ids
    assert "gemini" in provider_ids
    assert "groq" in provider_ids
    assert "nvidia_nim" in provider_ids

    # Verify no raw secret is exposed
    for p in providers_data:
        assert "encrypted_api_key" not in p
        assert "raw_key" not in p
        if p["masked_key"]:
            assert p["masked_key"].startswith("••••")

    # 2. Test Connection
    test_res = await client.post(
        "/api/v1/providers/groq/test",
        json={"api_key": "gsk_mock_test_key_for_unit_tests"},
        headers=auth_headers,
    )
    assert test_res.status_code == 200
    test_data = test_res.json()["data"]
    assert test_data["provider"] == "groq"
    assert "latency_ms" in test_data

    # 3. Connect Provider
    connect_res = await client.post(
        "/api/v1/providers/groq/connect",
        json={
            "api_key": "gsk_test_key_secret_1234567890abcdef",
            "default_model": "llama-3.3-70b-versatile",
            "temperature": 0.5,
            "max_tokens": 4096,
        },
        headers=auth_headers,
    )
    assert connect_res.status_code == 200
    conn_data = connect_res.json()["data"]
    assert conn_data["configured"] is True
    assert conn_data["masked_key"].endswith("cdef")

    # 4. Get Health
    health_res = await client.get("/api/v1/providers/health", headers=auth_headers)
    assert health_res.status_code == 200
    health_items = health_res.json()["data"]
    assert len(health_items) == 4

    # 5. Get and Update AI Routing
    routing_res = await client.get("/api/v1/ai/routing", headers=auth_headers)
    assert routing_res.status_code == 200
    routing_data = routing_res.json()["data"]
    assert len(routing_data["workloads"]) == 10

    patch_routing = await client.patch(
        "/api/v1/ai/routing",
        json={
            "workload_mappings": {
                "ai_tutor": {
                    "provider": "gemini",
                    "model_name": "gemini-2.0-flash",
                    "temperature": 0.8,
                    "max_tokens": 3000,
                }
            }
        },
        headers=auth_headers,
    )
    assert patch_routing.status_code == 200
    updated_routing = patch_routing.json()["data"]
    tutor_rule = next(w for w in updated_routing["workloads"] if w["workload"] == "ai_tutor")
    assert tutor_rule["model_name"] == "gemini-2.0-flash"

    # 6. Usage Stats
    usage_res = await client.get("/api/v1/providers/usage", headers=auth_headers)
    assert usage_res.status_code == 200
    usage_data = usage_res.json()["data"]
    assert usage_data["is_available"] is True
    assert usage_data["total_requests_today"] >= 0
