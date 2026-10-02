"""AI-SENIOR-X Context Reranking Layer."""

import re
from abc import ABC, abstractmethod

from pydantic import BaseModel

from backend.app.rag.retrieval.hybrid_search import HybridSearchResult


class RerankedResult(BaseModel):
    """Result item scored and ordered by reranking model."""

    id: str
    rerank_score: float
    original_score: float
    text: str
    metadata: dict


class BaseReranker(ABC):
    """Abstract interface for candidate context reranking."""

    @abstractmethod
    async def rerank(
        self,
        query: str,
        candidates: list[HybridSearchResult],
        top_n: int = 5,
    ) -> list[RerankedResult]:
        """Rerank candidate chunks according to query relevance."""
        pass


class CrossRelevanceReranker(BaseReranker):
    """Heuristic and lexical cross-relevance reranker with semantic density scoring."""

    def _calculate_cross_relevance(self, query: str, text: str) -> float:
        """Compute cross-relevance score based on exact keyword clustering and query term coverage."""
        query_words = set(re.findall(r"\b\w{3,}\b", query.lower()))
        if not query_words:
            return 0.5

        text_lower = text.lower()
        matched_words = sum(1 for w in query_words if w in text_lower)
        coverage = matched_words / len(query_words)

        # Check for phrase co-occurrence
        phrase_bonus = 0.2 if query.lower() in text_lower else 0.0

        # Penalize very short or empty chunks
        length_multiplier = min(1.0, len(text) / 150.0)

        score = (coverage * 0.8 + phrase_bonus) * length_multiplier
        return min(1.0, score)

    async def rerank(
        self,
        query: str,
        candidates: list[HybridSearchResult],
        top_n: int = 5,
    ) -> list[RerankedResult]:
        """Apply cross-relevance scoring on hybrid search candidates."""
        if not candidates:
            return []

        reranked: list[RerankedResult] = []

        for item in candidates:
            cross_score = self._calculate_cross_relevance(query, item.text)
            # Combine original hybrid score with cross-relevance
            final_score = round(0.5 * item.combined_score + 0.5 * cross_score, 4)

            reranked.append(
                RerankedResult(
                    id=item.id,
                    rerank_score=final_score,
                    original_score=item.combined_score,
                    text=item.text,
                    metadata=item.metadata,
                )
            )

        # Sort descending by rerank score
        reranked.sort(key=lambda x: x.rerank_score, reverse=True)
        return reranked[:top_n]


def get_reranker() -> BaseReranker:
    """Return configured reranker instance."""
    return CrossRelevanceReranker()
