"""AI-SENIOR-X Embedding Provider Abstraction and Caching."""

import hashlib
import math
from abc import ABC, abstractmethod
from typing import Any

import httpx
from pydantic import BaseModel, Field

from backend.app.core.config import settings
from backend.app.core.logging import logger


class EmbeddingResult(BaseModel):
    """Normalized embedding vector with rich contextual metadata."""

    vector: list[float]
    dimension: int
    metadata: dict[str, Any] = Field(default_factory=dict)


class BaseEmbeddingProvider(ABC):
    """Abstract interface for vector embedding generation."""

    @property
    @abstractmethod
    def dimension(self) -> int:
        pass

    @abstractmethod
    async def embed_query(self, text: str) -> list[float]:
        """Generate a dense embedding vector for a search query."""
        pass

    @abstractmethod
    async def embed_documents(self, documents: list[str]) -> list[list[float]]:
        """Generate dense embedding vectors for a batch of text documents."""
        pass


class EmbeddingCache:
    """In-memory LRU cache for computed embeddings."""

    def __init__(self, max_size: int = 2000):
        self._cache: dict[str, list[float]] = {}
        self._max_size = max_size

    def _hash(self, text: str, model: str) -> str:
        return hashlib.sha256(f"{model}:{text.strip().lower()}".encode()).hexdigest()

    def get(self, text: str, model: str) -> list[float] | None:
        key = self._hash(text, model)
        return self._cache.get(key)

    def set(self, text: str, model: str, vector: list[float]) -> None:
        if len(self._cache) >= self._max_size:
            # Evict first key
            first_key = next(iter(self._cache))
            del self._cache[first_key]
        key = self._hash(text, model)
        self._cache[key] = vector


_global_cache = EmbeddingCache()


class DeterministicLocalEmbeddingProvider(BaseEmbeddingProvider):
    """High-speed deterministic embedding provider for offline operation, testing, and fallback.

    Produces normalized 768-dimensional dense vectors using hashed feature projections.
    """

    def __init__(self, dimension: int = 768):
        self._dim = dimension

    @property
    def dimension(self) -> int:
        return self._dim

    def _compute_vector(self, text: str) -> list[float]:
        cleaned = text.strip().lower()
        if not cleaned:
            return [0.0] * self._dim

        vector = [0.0] * self._dim
        words = cleaned.split()

        for word_idx, word in enumerate(words):
            # Generate feature hash for word
            h = int(hashlib.md5(word.encode("utf-8")).hexdigest(), 16)
            pos_1 = h % self._dim
            pos_2 = (h >> 16) % self._dim
            pos_3 = (h >> 32) % self._dim

            weight = 1.0 / (1.0 + math.log(1 + word_idx))
            vector[pos_1] += weight
            vector[pos_2] += weight * 0.7
            vector[pos_3] -= weight * 0.5

        # L2 Normalization
        norm = math.sqrt(sum(x * x for x in vector))
        if norm > 0:
            return [x / norm for x in vector]
        return vector

    async def embed_query(self, text: str) -> list[float]:
        cached = _global_cache.get(text, "deterministic-local")
        if cached:
            return cached
        vec = self._compute_vector(text)
        _global_cache.set(text, "deterministic-local", vec)
        return vec

    async def embed_documents(self, documents: list[str]) -> list[list[float]]:
        return [await self.embed_query(doc) for doc in documents]


class GeminiEmbeddingProvider(BaseEmbeddingProvider):
    """Google Gemini Embedding API (`text-embedding-004`)."""

    def __init__(
        self,
        api_key: str | None = None,
        model_name: str | None = None,
        dimension: int = 768,
        timeout: float = 20.0,
    ):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model_name = model_name or settings.EMBEDDING_MODEL
        self._dim = dimension
        self.timeout = timeout
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"

    @property
    def dimension(self) -> int:
        return self._dim

    async def embed_query(self, text: str) -> list[float]:
        if not self.api_key:
            return await DeterministicLocalEmbeddingProvider(self._dim).embed_query(text)

        cached = _global_cache.get(text, self.model_name)
        if cached:
            return cached

        url = f"{self.base_url}/{self.model_name}:embedContent?key={self.api_key}"
        payload = {
            "model": f"models/{self.model_name}",
            "content": {"parts": [{"text": text}]},
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.post(url, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    values = data.get("embedding", {}).get("values", [])
                    if values:
                        _global_cache.set(text, self.model_name, values)
                        return values
        except Exception as e:
            logger.warning(
                f"Gemini embedding API call failed ({e}), using local deterministic fallback."
            )

        return await DeterministicLocalEmbeddingProvider(self._dim).embed_query(text)

    async def embed_documents(self, documents: list[str]) -> list[list[float]]:
        if not self.api_key:
            return await DeterministicLocalEmbeddingProvider(self._dim).embed_documents(documents)

        # Batch embed or iterate
        results: list[list[float]] = []
        for doc in documents:
            results.append(await self.embed_query(doc))
        return results


def get_embedding_provider(provider_name: str | None = None) -> BaseEmbeddingProvider:
    """Factory retrieving embedding provider instance."""
    name = (provider_name or settings.EMBEDDING_PROVIDER).lower()
    if name == "gemini" and settings.GEMINI_API_KEY:
        return GeminiEmbeddingProvider()
    return DeterministicLocalEmbeddingProvider(dimension=settings.EMBEDDING_DIMENSION)
