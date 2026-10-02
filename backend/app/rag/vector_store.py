"""AI-SENIOR-X Vector Store Abstraction and Local Store Implementation."""

import json
import math
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Any

from pydantic import BaseModel, Field

from backend.app.core.config import settings
from backend.app.core.logging import logger


class VectorRecord(BaseModel):
    """Normalized stored vector entry."""

    id: str
    vector: list[float]
    text: str
    metadata: dict[str, Any] = Field(default_factory=dict)


class SearchResult(BaseModel):
    """Vector similarity search result item."""

    id: str
    score: float
    text: str
    metadata: dict[str, Any]


class BaseVectorStore(ABC):
    """Abstract interface for Vector Storage and Similarity Search."""

    @abstractmethod
    async def upsert(self, records: list[VectorRecord]) -> int:
        """Insert or replace vector records."""
        pass

    @abstractmethod
    async def search(
        self,
        query_vector: list[float],
        top_k: int = 5,
        filters: dict[str, Any] | None = None,
    ) -> list[SearchResult]:
        """Perform cosine similarity search with optional metadata filtering."""
        pass

    @abstractmethod
    async def delete(self, record_ids: list[str]) -> int:
        """Remove records by identifier."""
        pass

    @abstractmethod
    async def count(self) -> int:
        """Return total indexed vector count."""
        pass

    @abstractmethod
    async def clear(self) -> None:
        """Clear all records from storage."""
        pass


def cosine_similarity(v1: list[float], v2: list[float]) -> float:
    """Compute cosine similarity between two normalized or unnormalized float vectors."""
    if not v1 or not v2 or len(v1) != len(v2):
        return 0.0

    dot_product = sum(a * b for a, b in zip(v1, v2, strict=False))
    norm_a = math.sqrt(sum(a * a for a in v1))
    norm_b = math.sqrt(sum(b * b for b in v2))

    if norm_a == 0.0 or norm_b == 0.0:
        return 0.0

    return dot_product / (norm_a * norm_b)


class LocalVectorStore(BaseVectorStore):
    """In-memory vector store with disk persistence and metadata filtering."""

    def __init__(self, persistence_path: str | None = None):
        self.persistence_path = Path(persistence_path or settings.VECTOR_STORE_PATH)
        self._records: dict[str, VectorRecord] = {}
        self._load_from_disk()

    def _load_from_disk(self) -> None:
        if self.persistence_path.exists():
            try:
                data = json.loads(self.persistence_path.read_text(encoding="utf-8"))
                for item in data.get("records", []):
                    rec = VectorRecord(**item)
                    self._records[rec.id] = rec
                logger.info(
                    f"Loaded {len(self._records)} vector records from {self.persistence_path}"
                )
            except Exception as e:
                logger.warning(f"Failed to load vector store from {self.persistence_path}: {e}")

    def _persist_to_disk(self) -> None:
        try:
            self.persistence_path.parent.mkdir(parents=True, exist_ok=True)
            payload = {
                "version": "1.0",
                "count": len(self._records),
                "records": [r.model_dump() for r in self._records.values()],
            }
            self.persistence_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
        except Exception as e:
            logger.warning(f"Failed to persist vector store to disk: {e}")

    async def upsert(self, records: list[VectorRecord]) -> int:
        for r in records:
            self._records[r.id] = r
        self._persist_to_disk()
        return len(records)

    async def search(
        self,
        query_vector: list[float],
        top_k: int = 5,
        filters: dict[str, Any] | None = None,
    ) -> list[SearchResult]:
        if not self._records:
            return []

        candidates: list[SearchResult] = []

        for r in self._records.values():
            # Apply metadata filters if provided
            if filters:
                match = True
                for k, v in filters.items():
                    if v is not None:
                        record_val = r.metadata.get(k)
                        if isinstance(v, str) and isinstance(record_val, str):
                            if record_val.lower() != v.lower():
                                match = False
                                break
                        elif record_val != v:
                            match = False
                            break
                if not match:
                    continue

            sim = cosine_similarity(query_vector, r.vector)
            candidates.append(
                SearchResult(
                    id=r.id,
                    score=round(sim, 4),
                    text=r.text,
                    metadata=r.metadata,
                )
            )

        # Sort descending by similarity score
        candidates.sort(key=lambda x: x.score, reverse=True)
        return candidates[:top_k]

    async def delete(self, record_ids: list[str]) -> int:
        deleted = 0
        for rid in record_ids:
            if rid in self._records:
                del self._records[rid]
                deleted += 1
        if deleted > 0:
            self._persist_to_disk()
        return deleted

    async def count(self) -> int:
        return len(self._records)

    async def clear(self) -> None:
        self._records.clear()
        self._persist_to_disk()


_vector_store_instance: BaseVectorStore | None = None


def get_vector_store() -> BaseVectorStore:
    """Return singleton vector store instance."""
    global _vector_store_instance
    if _vector_store_instance is None:
        _vector_store_instance = LocalVectorStore()
    return _vector_store_instance
