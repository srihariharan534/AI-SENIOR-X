"""AI-SENIOR-X AI Engine Abstract Base Classes & Interfaces.

These abstract definitions ensure strict decoupling between the foundation layer
and specific model providers (Gemini, OpenAI, Anthropic, Local LLMs, Vector DBs).
Subsequent master prompts implement these interfaces without touching the core backend foundation.
"""

from abc import ABC, abstractmethod
from typing import Any, AsyncGenerator, Dict, List, Optional
from pydantic import BaseModel, Field


class LLMMessage(BaseModel):
    """Normalized chat message structure."""

    role: str = Field(..., description="system, user, assistant, or tool")
    content: str
    metadata: Dict[str, Any] = Field(default_factory=dict)


class LLMResponse(BaseModel):
    """Normalized LLM response structure."""

    text: str
    model_name: str
    token_usage: Dict[str, int] = Field(default_factory=dict)
    finish_reason: str = "stop"
    raw_response: Optional[Any] = None


class BaseLLMProvider(ABC):
    """Abstract interface for LLM completion and streaming engines."""

    @abstractmethod
    async def generate(
        self,
        messages: List[LLMMessage],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        **kwargs: Any,
    ) -> LLMResponse:
        """Generate a complete text response."""
        pass

    @abstractmethod
    async def generate_stream(
        self,
        messages: List[LLMMessage],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        **kwargs: Any,
    ) -> AsyncGenerator[str, None]:
        """Stream response chunks as they arrive."""
        pass


class BaseEmbeddingProvider(ABC):
    """Abstract interface for vector embedding generation."""

    @abstractmethod
    async def embed_query(self, text: str) -> List[float]:
        """Generate a dense vector for a single query."""
        pass

    @abstractmethod
    async def embed_documents(self, documents: List[str]) -> List[List[float]]:
        """Generate dense vectors for a batch of documents."""
        pass


class BaseVectorStore(ABC):
    """Abstract interface for Vector Store / Knowledge Retrieval."""

    @abstractmethod
    async def search(
        self,
        query_vector: List[float],
        top_k: int = 5,
        filters: Optional[Dict[str, Any]] = None,
    ) -> List[Dict[str, Any]]:
        """Retrieve top_k similar vectors with attached metadata."""
        pass

    @abstractmethod
    async def upsert(
        self,
        vectors: List[List[float]],
        documents: List[str],
        metadatas: List[Dict[str, Any]],
        ids: Optional[List[str]] = None,
    ) -> List[str]:
        """Insert or update vectorized documents."""
        pass


class BaseAgent(ABC):
    """Abstract interface for specialized AI Agents."""

    @property
    @abstractmethod
    def name(self) -> str:
        """Name/Identifier of the agent."""
        pass

    @abstractmethod
    async def execute(
        self,
        task_input: Dict[str, Any],
        context: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Run agent reasoning cycle and return structured output."""
        pass
