"""AI-SENIOR-X LLM Package."""

from backend.app.llm.embeddings import (
    BaseEmbeddingProvider,
    DeterministicLocalEmbeddingProvider,
    GeminiEmbeddingProvider,
    get_embedding_provider,
)
from backend.app.llm.prompts.prompt_manager import PromptManager, prompt_manager
from backend.app.llm.provider import (
    BaseLLMProvider,
    GeminiProvider,
    LLMMessage,
    LLMResponse,
    MockLLMProvider,
    OpenAIProvider,
    get_llm_provider,
)
from backend.app.llm.structured_output import (
    StructuredOutputEngine,
    extract_json_from_text,
    repair_json_string,
)

__all__ = [
    "BaseLLMProvider",
    "GeminiProvider",
    "OpenAIProvider",
    "MockLLMProvider",
    "LLMMessage",
    "LLMResponse",
    "get_llm_provider",
    "StructuredOutputEngine",
    "extract_json_from_text",
    "repair_json_string",
    "BaseEmbeddingProvider",
    "GeminiEmbeddingProvider",
    "DeterministicLocalEmbeddingProvider",
    "get_embedding_provider",
    "PromptManager",
    "prompt_manager",
]
