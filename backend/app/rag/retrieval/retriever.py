"""AI-SENIOR-X Semantic Knowledge Base Retriever."""

from typing import Any

from pydantic import BaseModel, Field

from backend.app.llm.embeddings import BaseEmbeddingProvider, get_embedding_provider
from backend.app.rag.vector_store import BaseVectorStore, SearchResult, get_vector_store


class RetrievalQuery(BaseModel):
    """Encapsulates search query parameters with learner-aware filters."""

    query: str
    top_k: int = 5
    subject: str | None = None
    topic: str | None = None
    concept: str | None = None
    difficulty: str | None = None
    language: str | None = "en"
    filters: dict[str, Any] = Field(default_factory=dict)


class SemanticRetriever:
    """Performs dense vector retrieval over educational knowledge base."""

    def __init__(
        self,
        vector_store: BaseVectorStore | None = None,
        embedding_provider: BaseEmbeddingProvider | None = None,
    ):
        self.vector_store = vector_store or get_vector_store()
        self.embedding_provider = embedding_provider or get_embedding_provider()

    async def retrieve(self, query: RetrievalQuery) -> list[SearchResult]:
        """Generate embedding for search query and execute vector search with metadata filters."""
        query_vec = await self.embedding_provider.embed_query(query.query)

        # Assemble metadata filters
        combined_filters: dict[str, Any] = dict(query.filters)
        if query.subject:
            combined_filters["subject"] = query.subject
        if query.topic:
            combined_filters["topic"] = query.topic
        if query.concept:
            combined_filters["concept"] = query.concept
        if query.difficulty:
            combined_filters["difficulty"] = query.difficulty
        if query.language:
            combined_filters["language"] = query.language

        # Remove None values
        sanitized_filters = {k: v for k, v in combined_filters.items() if v is not None}

        results = await self.vector_store.search(
            query_vector=query_vec,
            top_k=query.top_k,
            filters=sanitized_filters if sanitized_filters else None,
        )
        return results
