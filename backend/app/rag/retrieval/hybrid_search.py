"""AI-SENIOR-X Hybrid Search Engine (Semantic + BM25 Lexical Matching)."""

import re
from collections import Counter
from typing import Any

from pydantic import BaseModel, Field

from backend.app.core.config import settings
from backend.app.rag.retrieval.retriever import RetrievalQuery, SemanticRetriever
from backend.app.rag.vector_store import BaseVectorStore, get_vector_store


class HybridSearchResult(BaseModel):
    """Hybrid search scoring item combining dense and lexical match signals."""

    id: str
    combined_score: float
    semantic_score: float
    lexical_score: float
    text: str
    metadata: dict[str, Any] = Field(default_factory=dict)


def tokenize(text: str) -> list[str]:
    """Tokenize text into lowercased alphanumeric terms."""
    return re.findall(r"\b[a-zA-Z0-9_-]+\b", text.lower())


def compute_bm25_score(
    query_terms: list[str], doc_terms: list[str], avg_doc_len: float = 100.0
) -> float:
    """Compute BM25 term frequency / saturation score for document terms."""
    if not query_terms or not doc_terms:
        return 0.0

    k1 = 1.5
    b = 0.75
    doc_len = len(doc_terms)
    term_counts = Counter(doc_terms)
    score = 0.0

    for term in query_terms:
        if term in term_counts:
            tf = term_counts[term]
            # Term saturation formula
            term_score = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (doc_len / avg_doc_len)))
            score += term_score

    # Normalize roughly to 0.0 .. 1.0 range
    return min(1.0, score / (len(query_terms) * 1.5))


class HybridSearchEngine:
    """Combines dense semantic vector retrieval with BM25 lexical keyword matching."""

    def __init__(
        self,
        retriever: SemanticRetriever | None = None,
        vector_store: BaseVectorStore | None = None,
        semantic_weight: float = settings.RAG_HYBRID_SEMANTIC_WEIGHT,
        keyword_weight: float = settings.RAG_HYBRID_KEYWORD_WEIGHT,
    ):
        self.retriever = retriever or SemanticRetriever()
        self.vector_store = vector_store or get_vector_store()
        self.semantic_weight = semantic_weight
        self.keyword_weight = keyword_weight

    async def search(self, query: RetrievalQuery) -> list[HybridSearchResult]:
        """Perform hybrid search merging semantic vector search and BM25 lexical ranking."""
        # 1. Fetch top candidates via semantic search
        semantic_candidates = await self.retriever.retrieve(
            RetrievalQuery(
                query=query.query,
                top_k=max(20, query.top_k * 3),
                subject=query.subject,
                topic=query.topic,
                concept=query.concept,
                difficulty=query.difficulty,
                language=query.language,
                filters=query.filters,
            )
        )

        if not semantic_candidates:
            return []

        query_terms = tokenize(query.query)
        hybrid_results: list[HybridSearchResult] = []

        for candidate in semantic_candidates:
            doc_terms = tokenize(candidate.text)
            bm25 = compute_bm25_score(query_terms, doc_terms)

            # Check exact topic/concept matches in metadata for extra bonus
            metadata_bonus = 0.0
            if query.topic and candidate.metadata.get("topic", "").lower() == query.topic.lower():
                metadata_bonus += 0.1
            if (
                query.concept
                and candidate.metadata.get("concept", "").lower() == query.concept.lower()
            ):
                metadata_bonus += 0.15

            combined = (
                self.semantic_weight * candidate.score + self.keyword_weight * bm25 + metadata_bonus
            )

            hybrid_results.append(
                HybridSearchResult(
                    id=candidate.id,
                    combined_score=round(combined, 4),
                    semantic_score=round(candidate.score, 4),
                    lexical_score=round(bm25, 4),
                    text=candidate.text,
                    metadata=candidate.metadata,
                )
            )

        # Sort descending by combined score
        hybrid_results.sort(key=lambda x: x.combined_score, reverse=True)
        return hybrid_results[: query.top_k]
