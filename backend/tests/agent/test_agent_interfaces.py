"""Tests validating AI Engine interfaces and multi-provider decoupling contracts."""

import pytest

try:
    from interfaces import (
        BaseAgent,
        BaseLLMProvider,
        LLMMessage,
        LLMResponse,
    )
except ImportError:
    from ai_engine.interfaces import (
        BaseAgent,
        BaseLLMProvider,
        LLMMessage,
        LLMResponse,
    )


class MockLLMProvider(BaseLLMProvider):
    async def generate(self, messages, temperature=0.7, max_tokens=None, **kwargs):
        return LLMResponse(
            text="Mock response from pedagogical agent",
            model_name="mock-pedagogy-v1",
            token_usage={"total_tokens": 42},
        )

    async def generate_stream(self, messages, temperature=0.7, max_tokens=None, **kwargs):
        yield "Mock "
        yield "stream "
        yield "response"


class MockAgent(BaseAgent):
    @property
    def name(self) -> str:
        return "TutorAgent"

    async def execute(self, task_input, context=None):
        return {"status": "success", "result": f"Executed on {task_input.get('topic')}"}


@pytest.mark.asyncio
async def test_llm_provider_contract():
    provider = MockLLMProvider()
    messages = [LLMMessage(role="user", content="Hello")]
    res = await provider.generate(messages)

    assert res.model_name == "mock-pedagogy-v1"
    assert "Mock response" in res.text
    assert res.token_usage["total_tokens"] == 42


@pytest.mark.asyncio
async def test_agent_contract():
    agent = MockAgent()
    assert agent.name == "TutorAgent"
    output = await agent.execute({"topic": "Data Structures"})
    assert output["status"] == "success"
    assert "Data Structures" in output["result"]
