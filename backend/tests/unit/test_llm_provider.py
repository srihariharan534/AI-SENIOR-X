"""Unit tests for LLM provider abstraction and structured output system."""

import pytest
from pydantic import BaseModel, Field

from backend.app.llm.prompts.prompt_manager import prompt_manager
from backend.app.llm.provider import LLMMessage, MockLLMProvider
from backend.app.llm.structured_output import (
    StructuredOutputEngine,
    extract_json_from_text,
    repair_json_string,
)


class SampleAnalysisModel(BaseModel):
    analysis: str
    confidence: float
    pedagogical_guidance: str
    recommended_action: str
    target_concept: str
    details: dict = Field(default_factory=dict)


@pytest.mark.asyncio
async def test_mock_llm_provider_generate():
    provider = MockLLMProvider()
    messages = [
        LLMMessage(role="system", content="You are a tutor."),
        LLMMessage(role="user", content="Explain recursion."),
    ]
    res = await provider.generate(messages)
    assert res.text != ""
    assert res.model_name == "mock-pedagogy-v1" or "mock" in res.model_name
    assert res.token_usage["total_tokens"] > 0


@pytest.mark.asyncio
async def test_mock_llm_provider_stream():
    provider = MockLLMProvider()
    messages = [LLMMessage(role="user", content="Test stream")]
    tokens = []
    async for token in provider.generate_stream(messages):
        tokens.append(token)
    assert len(tokens) > 0


def test_extract_json_from_markdown():
    markdown_payload = 'Here is the result:\n```json\n{\n  "status": "success",\n  "score": 95\n}\n```\nHope this helps!'
    extracted = extract_json_from_text(markdown_payload)
    assert extracted.startswith("{")
    assert extracted.endswith("}")
    assert '"score": 95' in extracted


def test_repair_json_string():
    broken_json = '{\n  "items": [1, 2, 3,],\n  "name": "test",\n}'
    repaired = repair_json_string(broken_json)
    assert ",]" not in repaired
    assert ",}" not in repaired


@pytest.mark.asyncio
async def test_structured_output_engine():
    provider = MockLLMProvider()
    engine = StructuredOutputEngine(provider=provider)
    messages = [
        LLMMessage(role="user", content="Analyze learner performance on neural networks JSON")
    ]

    result = await engine.generate_structured(messages, SampleAnalysisModel)
    assert isinstance(result, SampleAnalysisModel)
    assert result.confidence > 0.0
    assert result.pedagogical_guidance != ""


def test_prompt_manager_formatting():
    formatted = prompt_manager.build_tutor_prompt(
        topic="Neural Networks",
        learner_grade="undergraduate",
        preferred_style="visual_interactive",
        rag_context="Backpropagation computes gradients via chain rule.",
        misconception_alerts="Vanishing gradient confusion.",
    )
    assert "Neural Networks" in formatted
    assert "Backpropagation computes gradients" in formatted
    assert "Vanishing gradient confusion." in formatted
