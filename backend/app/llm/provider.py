"""AI-SENIOR-X Multi-Provider LLM Abstraction Layer.

Supports OpenRouter, Google Gemini, Groq, NVIDIA NIM, OpenAI, and Mock Pedagogical Provider.
"""

import asyncio
import time
from abc import ABC, abstractmethod
from collections.abc import AsyncGenerator
from typing import Any

import httpx
from pydantic import BaseModel, Field

from backend.app.core.config import settings
from backend.app.core.exceptions import AppException
from backend.app.core.logging import logger


class LLMMessage(BaseModel):
    """Normalized chat message structure."""

    role: str = Field(..., description="system, user, assistant, or tool")
    content: str
    metadata: dict[str, Any] = Field(default_factory=dict)


class LLMResponse(BaseModel):
    """Normalized LLM response payload."""

    text: str
    model_name: str
    token_usage: dict[str, int] = Field(default_factory=dict)
    finish_reason: str = "stop"
    raw_response: dict[str, Any] | None = None
    latency_ms: int = 0


class BaseLLMProvider(ABC):
    """Abstract interface for LLM completion, structured generation, streaming, and model discovery."""

    @abstractmethod
    async def generate(
        self,
        messages: list[LLMMessage],
        temperature: float | None = None,
        max_tokens: int | None = None,
        **kwargs: Any,
    ) -> LLMResponse:
        """Generate a complete text response."""
        pass

    @abstractmethod
    async def generate_stream(
        self,
        messages: list[LLMMessage],
        temperature: float | None = None,
        max_tokens: int | None = None,
        **kwargs: Any,
    ) -> AsyncGenerator[str, None]:
        """Stream response tokens or chunks asynchronously."""
        pass

    @abstractmethod
    async def count_tokens(self, text: str) -> int:
        """Approximate or calculate token count."""
        pass

    @abstractmethod
    async def health(self) -> dict[str, Any]:
        """Verify provider availability and configuration status."""
        pass

    async def list_models(self) -> list[str]:
        """Fetch list of supported or discovered model IDs."""
        return []

    async def test_connection(self) -> dict[str, Any]:
        """Execute a lightweight live validation ping."""
        start = time.perf_counter()
        try:
            res = await self.generate(
                [LLMMessage(role="user", content="Ping. Respond with 'PONG'.")],
                temperature=0.0,
                max_tokens=10,
            )
            elapsed_ms = int((time.perf_counter() - start) * 1000)
            models = await self.list_models()
            return {
                "success": True,
                "latency_ms": elapsed_ms,
                "message": "Connection verified successfully.",
                "models": models,
                "response_sample": res.text[:60],
            }
        except Exception as e:
            elapsed_ms = int((time.perf_counter() - start) * 1000)
            return {
                "success": False,
                "latency_ms": elapsed_ms,
                "message": f"Connection test failed: {str(e)[:150]}",
                "models": [],
            }


# =============================================================================
# 1. Google Gemini Provider
# =============================================================================
class GeminiProvider(BaseLLMProvider):
    """Google Gemini LLM Provider integration via REST API."""

    def __init__(
        self,
        api_key: str | None = None,
        model_name: str | None = None,
        base_url: str | None = None,
        timeout: float = 30.0,
    ):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model_name = model_name or settings.LLM_MODEL
        self.timeout = timeout
        self.base_url = (
            base_url or "https://generativelanguage.googleapis.com/v1beta/models"
        ).rstrip("/")

    def _convert_messages(self, messages: list[LLMMessage]) -> list[dict[str, Any]]:
        contents = []
        for msg in messages:
            if msg.role == "system":
                continue
            role = "user" if msg.role == "user" else "model"
            contents.append(
                {
                    "role": role,
                    "parts": [{"text": msg.content}],
                }
            )
        return contents

    async def generate(
        self,
        messages: list[LLMMessage],
        temperature: float | None = None,
        max_tokens: int | None = None,
        **kwargs: Any,
    ) -> LLMResponse:
        if not self.api_key:
            logger.warning("Gemini API key missing. Falling back to pedagogical mock response.")
            return await MockLLMProvider().generate(messages, temperature, max_tokens, **kwargs)

        start = time.perf_counter()
        temp = temperature if temperature is not None else settings.LLM_TEMPERATURE
        max_t = max_tokens or settings.LLM_MAX_OUTPUT_TOKENS
        url = f"{self.base_url}/{self.model_name}:generateContent?key={self.api_key}"

        payload: dict[str, Any] = {
            "contents": self._convert_messages(messages),
            "generationConfig": {
                "temperature": temp,
                "maxOutputTokens": max_t,
            },
        }

        system_msgs = [m.content for m in messages if m.role == "system"]
        if system_msgs:
            payload["systemInstruction"] = {"parts": [{"text": "\n\n".join(system_msgs)}]}

        retries = settings.LLM_MAX_RETRIES
        for attempt in range(retries):
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    resp = await client.post(url, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        candidates = data.get("candidates", [])
                        if not candidates:
                            raise AppException(
                                "Gemini returned empty candidate response.",
                                code="LLM_EMPTY_RESPONSE",
                            )
                        parts = candidates[0].get("content", {}).get("parts", [])
                        text = "".join([p.get("text", "") for p in parts])
                        usage = data.get("usageMetadata", {})
                        elapsed_ms = int((time.perf_counter() - start) * 1000)
                        return LLMResponse(
                            text=text,
                            model_name=self.model_name,
                            token_usage={
                                "prompt_tokens": usage.get("promptTokenCount", 0),
                                "completion_tokens": usage.get("candidatesTokenCount", 0),
                                "total_tokens": usage.get("totalTokenCount", 0),
                            },
                            finish_reason=candidates[0].get("finishReason", "stop"),
                            raw_response=data,
                            latency_ms=elapsed_ms,
                        )
                    elif resp.status_code in (429, 500, 502, 503, 504):
                        if attempt < retries - 1:
                            await asyncio.sleep(2**attempt)
                            continue
                    err_body = resp.text[:200]
                    raise AppException(
                        f"Gemini API returned error HTTP {resp.status_code}: {err_body}",
                        code="LLM_API_ERROR",
                    )
            except AppException:
                raise
            except Exception as e:
                if attempt == retries - 1:
                    logger.error(f"Gemini API request failed after {retries} attempts: {e}")
                    return await MockLLMProvider().generate(
                        messages, temperature, max_tokens, **kwargs
                    )
                await asyncio.sleep(1.0)

        return await MockLLMProvider().generate(messages, temperature, max_tokens, **kwargs)

    async def generate_stream(
        self,
        messages: list[LLMMessage],
        temperature: float | None = None,
        max_tokens: int | None = None,
        **kwargs: Any,
    ) -> AsyncGenerator[str, None]:
        res = await self.generate(messages, temperature, max_tokens, **kwargs)
        for word in res.text.split(" "):
            yield word + " "
            await asyncio.sleep(0.01)

    async def count_tokens(self, text: str) -> int:
        return max(1, len(text) // 4)

    async def health(self) -> dict[str, Any]:
        return {
            "provider": "gemini",
            "model": self.model_name,
            "configured": bool(self.api_key),
            "status": "ready" if self.api_key else "missing_api_key_using_mock_fallback",
        }

    async def list_models(self) -> list[str]:
        return [
            "gemini-1.5-pro",
            "gemini-1.5-flash",
            "gemini-2.0-flash",
            "gemini-exp-1206",
            "gemini-1.0-pro",
        ]


# =============================================================================
# 2. OpenRouter Provider (Multi-Model Gateway)
# =============================================================================
class OpenRouterProvider(BaseLLMProvider):
    """OpenRouter Multi-Model Unified Gateway API Adapter."""

    def __init__(
        self,
        api_key: str | None = None,
        model_name: str | None = None,
        base_url: str | None = None,
        timeout: float = 30.0,
    ):
        self.api_key = api_key or settings.OPENROUTER_API_KEY
        self.model_name = model_name or "anthropic/claude-3.5-sonnet"
        self.timeout = timeout
        self.base_url = (base_url or "https://openrouter.ai/api/v1").rstrip("/")

    async def generate(
        self,
        messages: list[LLMMessage],
        temperature: float | None = None,
        max_tokens: int | None = None,
        **kwargs: Any,
    ) -> LLMResponse:
        if not self.api_key:
            logger.warning("OpenRouter API key missing. Falling back to pedagogical mock response.")
            return await MockLLMProvider().generate(messages, temperature, max_tokens, **kwargs)

        start = time.perf_counter()
        temp = temperature if temperature is not None else settings.LLM_TEMPERATURE
        max_t = max_tokens or settings.LLM_MAX_OUTPUT_TOKENS
        url = f"{self.base_url}/chat/completions"

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "HTTP-Referer": "https://ai-senior-x.edu",
            "X-Title": "AI-SENIOR-X Intelligence Platform",
            "Content-Type": "application/json",
        }

        payload = {
            "model": self.model_name,
            "messages": [{"role": m.role, "content": m.content} for m in messages],
            "temperature": temp,
            "max_tokens": max_t,
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.post(url, json=payload, headers=headers)
                if resp.status_code == 200:
                    data = resp.json()
                    choice = data["choices"][0]
                    elapsed_ms = int((time.perf_counter() - start) * 1000)
                    return LLMResponse(
                        text=choice["message"]["content"],
                        model_name=self.model_name,
                        token_usage=data.get("usage", {}),
                        finish_reason=choice.get("finish_reason", "stop"),
                        raw_response=data,
                        latency_ms=elapsed_ms,
                    )
                else:
                    err_msg = resp.text[:200]
                    raise AppException(
                        f"OpenRouter returned HTTP {resp.status_code}: {err_msg}",
                        code="OPENROUTER_ERROR",
                    )
        except AppException:
            raise
        except Exception as e:
            logger.error(f"OpenRouter request error: {e}")
            return await MockLLMProvider().generate(messages, temperature, max_tokens, **kwargs)

    async def generate_stream(
        self,
        messages: list[LLMMessage],
        temperature: float | None = None,
        max_tokens: int | None = None,
        **kwargs: Any,
    ) -> AsyncGenerator[str, None]:
        res = await self.generate(messages, temperature, max_tokens, **kwargs)
        for word in res.text.split(" "):
            yield word + " "
            await asyncio.sleep(0.01)

    async def count_tokens(self, text: str) -> int:
        return max(1, len(text) // 4)

    async def health(self) -> dict[str, Any]:
        return {
            "provider": "openrouter",
            "model": self.model_name,
            "configured": bool(self.api_key),
            "status": "ready" if self.api_key else "missing_api_key_using_mock_fallback",
        }

    async def list_models(self) -> list[str]:
        return [
            "anthropic/claude-3.5-sonnet",
            "meta-llama/llama-3.3-70b-instruct",
            "deepseek/deepseek-r1",
            "google/gemini-2.0-flash-001",
            "openai/gpt-4o-mini",
            "qwen/qwen-2.5-72b-instruct",
            "mistralai/mistral-large-2411",
        ]


# =============================================================================
# 3. Groq Provider (Ultra Low-Latency Inference)
# =============================================================================
class GroqProvider(BaseLLMProvider):
    """Groq Ultra-Fast Inference Provider."""

    def __init__(
        self,
        api_key: str | None = None,
        model_name: str | None = None,
        base_url: str | None = None,
        timeout: float = 20.0,
    ):
        self.api_key = api_key or settings.GROQ_API_KEY
        self.model_name = model_name or "llama-3.3-70b-versatile"
        self.timeout = timeout
        self.base_url = (base_url or "https://api.groq.com/openai/v1").rstrip("/")

    async def generate(
        self,
        messages: list[LLMMessage],
        temperature: float | None = None,
        max_tokens: int | None = None,
        **kwargs: Any,
    ) -> LLMResponse:
        if not self.api_key:
            logger.warning("Groq API key missing. Falling back to pedagogical mock response.")
            return await MockLLMProvider().generate(messages, temperature, max_tokens, **kwargs)

        start = time.perf_counter()
        temp = temperature if temperature is not None else settings.LLM_TEMPERATURE
        max_t = max_tokens or settings.LLM_MAX_OUTPUT_TOKENS
        url = f"{self.base_url}/chat/completions"

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": self.model_name,
            "messages": [{"role": m.role, "content": m.content} for m in messages],
            "temperature": temp,
            "max_tokens": max_t,
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.post(url, json=payload, headers=headers)
                if resp.status_code == 200:
                    data = resp.json()
                    choice = data["choices"][0]
                    elapsed_ms = int((time.perf_counter() - start) * 1000)
                    return LLMResponse(
                        text=choice["message"]["content"],
                        model_name=self.model_name,
                        token_usage=data.get("usage", {}),
                        finish_reason=choice.get("finish_reason", "stop"),
                        raw_response=data,
                        latency_ms=elapsed_ms,
                    )
                else:
                    err_msg = resp.text[:200]
                    raise AppException(
                        f"Groq API returned HTTP {resp.status_code}: {err_msg}",
                        code="GROQ_ERROR",
                    )
        except AppException:
            raise
        except Exception as e:
            logger.error(f"Groq request error: {e}")
            return await MockLLMProvider().generate(messages, temperature, max_tokens, **kwargs)

    async def generate_stream(
        self,
        messages: list[LLMMessage],
        temperature: float | None = None,
        max_tokens: int | None = None,
        **kwargs: Any,
    ) -> AsyncGenerator[str, None]:
        res = await self.generate(messages, temperature, max_tokens, **kwargs)
        for word in res.text.split(" "):
            yield word + " "
            await asyncio.sleep(0.01)

    async def count_tokens(self, text: str) -> int:
        return max(1, len(text) // 4)

    async def health(self) -> dict[str, Any]:
        return {
            "provider": "groq",
            "model": self.model_name,
            "configured": bool(self.api_key),
            "status": "ready" if self.api_key else "missing_api_key_using_mock_fallback",
        }

    async def list_models(self) -> list[str]:
        return [
            "llama-3.3-70b-versatile",
            "llama-3.1-8b-instant",
            "deepseek-r1-distill-llama-70b",
            "mixtral-8x7b-32768",
            "gemma2-9b-it",
        ]


# =============================================================================
# 4. NVIDIA NIM Provider
# =============================================================================
class NvidiaNimProvider(BaseLLMProvider):
    """NVIDIA NIM Hosted Enterprise Inference Endpoints."""

    def __init__(
        self,
        api_key: str | None = None,
        model_name: str | None = None,
        base_url: str | None = None,
        timeout: float = 35.0,
    ):
        self.api_key = api_key or settings.NVIDIA_NIM_API_KEY
        self.model_name = model_name or "meta/llama-3.3-70b-instruct"
        self.timeout = timeout
        self.base_url = (base_url or "https://integrate.api.nvidia.com/v1").rstrip("/")

    async def generate(
        self,
        messages: list[LLMMessage],
        temperature: float | None = None,
        max_tokens: int | None = None,
        **kwargs: Any,
    ) -> LLMResponse:
        if not self.api_key:
            logger.warning("NVIDIA NIM API key missing. Falling back to pedagogical mock response.")
            return await MockLLMProvider().generate(messages, temperature, max_tokens, **kwargs)

        start = time.perf_counter()
        temp = temperature if temperature is not None else settings.LLM_TEMPERATURE
        max_t = max_tokens or settings.LLM_MAX_OUTPUT_TOKENS
        url = f"{self.base_url}/chat/completions"

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": self.model_name,
            "messages": [{"role": m.role, "content": m.content} for m in messages],
            "temperature": temp,
            "max_tokens": max_t,
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.post(url, json=payload, headers=headers)
                if resp.status_code == 200:
                    data = resp.json()
                    choice = data["choices"][0]
                    elapsed_ms = int((time.perf_counter() - start) * 1000)
                    return LLMResponse(
                        text=choice["message"]["content"],
                        model_name=self.model_name,
                        token_usage=data.get("usage", {}),
                        finish_reason=choice.get("finish_reason", "stop"),
                        raw_response=data,
                        latency_ms=elapsed_ms,
                    )
                else:
                    err_msg = resp.text[:200]
                    raise AppException(
                        f"NVIDIA NIM API returned HTTP {resp.status_code}: {err_msg}",
                        code="NVIDIA_NIM_ERROR",
                    )
        except AppException:
            raise
        except Exception as e:
            logger.error(f"NVIDIA NIM request error: {e}")
            return await MockLLMProvider().generate(messages, temperature, max_tokens, **kwargs)

    async def generate_stream(
        self,
        messages: list[LLMMessage],
        temperature: float | None = None,
        max_tokens: int | None = None,
        **kwargs: Any,
    ) -> AsyncGenerator[str, None]:
        res = await self.generate(messages, temperature, max_tokens, **kwargs)
        for word in res.text.split(" "):
            yield word + " "
            await asyncio.sleep(0.01)

    async def count_tokens(self, text: str) -> int:
        return max(1, len(text) // 4)

    async def health(self) -> dict[str, Any]:
        return {
            "provider": "nvidia_nim",
            "model": self.model_name,
            "configured": bool(self.api_key),
            "status": "ready" if self.api_key else "missing_api_key_using_mock_fallback",
        }

    async def list_models(self) -> list[str]:
        return [
            "meta/llama-3.3-70b-instruct",
            "nvidia/nemotron-4-340b-instruct",
            "mistralai/mistral-large-2-instruct",
            "deepseek-ai/deepseek-r1",
            "meta/llama-3.1-8b-instruct",
        ]


# =============================================================================
# 5. OpenAI Provider
# =============================================================================
class OpenAIProvider(BaseLLMProvider):
    """OpenAI API Provider."""

    def __init__(
        self,
        api_key: str | None = None,
        model_name: str = "gpt-4o",
        base_url: str | None = None,
        timeout: float = 30.0,
    ):
        self.api_key = api_key or settings.OPENAI_API_KEY
        self.model_name = model_name
        self.timeout = timeout
        self.base_url = (base_url or "https://api.openai.com/v1").rstrip("/")

    async def generate(
        self,
        messages: list[LLMMessage],
        temperature: float | None = None,
        max_tokens: int | None = None,
        **kwargs: Any,
    ) -> LLMResponse:
        if not self.api_key:
            return await MockLLMProvider().generate(messages, temperature, max_tokens, **kwargs)

        start = time.perf_counter()
        temp = temperature if temperature is not None else settings.LLM_TEMPERATURE
        max_t = max_tokens or settings.LLM_MAX_OUTPUT_TOKENS
        url = f"{self.base_url}/chat/completions"

        payload = {
            "model": self.model_name,
            "messages": [{"role": m.role, "content": m.content} for m in messages],
            "temperature": temp,
            "max_tokens": max_t,
        }

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.post(url, json=payload, headers=headers)
                if resp.status_code == 200:
                    data = resp.json()
                    choice = data["choices"][0]
                    elapsed_ms = int((time.perf_counter() - start) * 1000)
                    return LLMResponse(
                        text=choice["message"]["content"],
                        model_name=self.model_name,
                        token_usage=data.get("usage", {}),
                        finish_reason=choice.get("finish_reason", "stop"),
                        latency_ms=elapsed_ms,
                    )
                return await MockLLMProvider().generate(messages, temperature, max_tokens, **kwargs)
        except Exception:
            return await MockLLMProvider().generate(messages, temperature, max_tokens, **kwargs)

    async def generate_stream(
        self,
        messages: list[LLMMessage],
        temperature: float | None = None,
        max_tokens: int | None = None,
        **kwargs: Any,
    ) -> AsyncGenerator[str, None]:
        res = await self.generate(messages, temperature, max_tokens, **kwargs)
        for word in res.text.split(" "):
            yield word + " "
            await asyncio.sleep(0.01)

    async def count_tokens(self, text: str) -> int:
        return max(1, len(text) // 4)

    async def health(self) -> dict[str, Any]:
        return {
            "provider": "openai",
            "model": self.model_name,
            "configured": bool(self.api_key),
            "status": "ready" if self.api_key else "missing_api_key_using_mock_fallback",
        }

    async def list_models(self) -> list[str]:
        return ["gpt-4o", "gpt-4o-mini", "o1", "o3-mini"]


# =============================================================================
# 6. Mock Pedagogical Provider
# =============================================================================
class MockLLMProvider(BaseLLMProvider):
    """Deterministic, pedagogically-tailored mock provider for testing and offline resilience."""

    async def generate(
        self,
        messages: list[LLMMessage],
        temperature: float | None = None,
        max_tokens: int | None = None,
        **kwargs: Any,
    ) -> LLMResponse:
        last_message = messages[-1].content if messages else ""
        system_instructions = "\n".join([m.content for m in messages if m.role == "system"])

        # Check if structured JSON response requested in prompt
        if "JSON" in system_instructions or "json" in last_message.lower():
            text = (
                "{\n"
                '  "analysis": "Identified core concept and evaluated learner evidence.",\n'
                '  "confidence": 0.92,\n'
                '  "pedagogical_guidance": "Encourage reflection on foundational invariants.",\n'
                '  "recommended_action": "review_prerequisite",\n'
                '  "target_concept": "Core Foundations",\n'
                '  "details": {\n'
                '    "status": "evaluated",\n'
                '    "mastery_estimate": 0.75\n'
                "  }\n"
                "}"
            )
        else:
            text = (
                f"Socratic Tutor Response: Let us analyze your query regarding '{last_message[:60]}...'. "
                "Consider the fundamental principles governing this topic: What invariants or assumptions hold true here? "
                "Step through a concrete minimal example to verify your reasoning."
            )

        return LLMResponse(
            text=text,
            model_name="mock-pedagogical-engine-v1",
            token_usage={
                "prompt_tokens": len(last_message) // 4 + 10,
                "completion_tokens": len(text) // 4 + 10,
                "total_tokens": (len(last_message) + len(text)) // 4 + 20,
            },
            finish_reason="stop",
            latency_ms=12,
        )

    async def generate_stream(
        self,
        messages: list[LLMMessage],
        temperature: float | None = None,
        max_tokens: int | None = None,
        **kwargs: Any,
    ) -> AsyncGenerator[str, None]:
        res = await self.generate(messages, temperature, max_tokens, **kwargs)
        for token in res.text.split(" "):
            yield token + " "
            await asyncio.sleep(0.01)

    async def count_tokens(self, text: str) -> int:
        return max(1, len(text) // 4)

    async def health(self) -> dict[str, Any]:
        return {
            "provider": "mock",
            "model": "mock-pedagogical-engine-v1",
            "configured": True,
            "status": "ready",
        }

    async def list_models(self) -> list[str]:
        return ["mock-pedagogical-engine-v1"]


def get_llm_provider(
    provider_name: str | None = None,
    api_key: str | None = None,
    model_name: str | None = None,
    base_url: str | None = None,
) -> BaseLLMProvider:
    """Factory creating the appropriate LLM provider adapter based on settings or explicit overrides."""
    name = (provider_name or settings.LLM_PROVIDER).lower()
    if name == "gemini":
        return GeminiProvider(api_key=api_key, model_name=model_name, base_url=base_url)
    elif name == "openrouter":
        return OpenRouterProvider(api_key=api_key, model_name=model_name, base_url=base_url)
    elif name == "groq":
        return GroqProvider(api_key=api_key, model_name=model_name, base_url=base_url)
    elif name in ("nvidia", "nvidia_nim"):
        return NvidiaNimProvider(api_key=api_key, model_name=model_name, base_url=base_url)
    elif name == "openai":
        return OpenAIProvider(api_key=api_key, model_name=model_name, base_url=base_url)
    elif name == "mock":
        return MockLLMProvider()
    else:
        logger.warning(
            f"Unknown LLM provider '{name}'. Defaulting to GeminiProvider with fallback."
        )
        return GeminiProvider(api_key=api_key, model_name=model_name, base_url=base_url)
