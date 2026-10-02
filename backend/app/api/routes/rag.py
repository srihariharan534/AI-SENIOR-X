"""AI-SENIOR-X RAG and Knowledge Retrieval REST Endpoints."""

from typing import Annotated, Any

from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, Field

from backend.app.api.dependencies import get_current_user
from backend.app.database.models.user import User
from backend.app.rag.context_builder import BuiltRAGContext
from backend.app.rag.knowledge_base import IngestionReport, knowledge_base_service
from backend.app.rag.retrieval.reranker import RerankedResult
from backend.app.rag.retrieval.retriever import RetrievalQuery
from backend.app.schemas.common import ApiResponse

router = APIRouter(prefix="/rag", tags=["RAG & Knowledge Retrieval"])


class RAGSearchRequest(BaseModel):
    """Payload for hybrid RAG search."""

    query: str = Field(..., min_length=2)
    top_k: int = Field(5, ge=1, le=20)
    subject: str | None = None
    topic: str | None = None
    difficulty: str | None = None


class RAGContextRequest(BaseModel):
    """Payload to build prompt-ready RAG context."""

    query: str = Field(..., min_length=2)
    subject: str | None = None
    topic: str | None = None
    difficulty: str | None = None
    top_k: int = Field(4, ge=1, le=10)


class IngestTextRequest(BaseModel):
    """Payload to ingest raw text directly into knowledge base."""

    title: str = Field(..., min_length=2)
    text: str = Field(..., min_length=10)
    subject: str = Field("General")
    topic: str = Field("General")
    difficulty: str = Field("intermediate")


@router.post(
    "/search",
    response_model=ApiResponse[list[RerankedResult]],
    status_code=status.HTTP_200_OK,
    summary="Execute Hybrid Search & Reranking",
)
async def hybrid_search(
    payload: RAGSearchRequest,
) -> ApiResponse[list[RerankedResult]]:
    """Perform hybrid search (semantic dense embeddings + lexical BM25) with cross-relevance reranking."""
    query = RetrievalQuery(
        query=payload.query,
        top_k=payload.top_k,
        subject=payload.subject,
        topic=payload.topic,
        difficulty=payload.difficulty,
    )
    results = await knowledge_base_service.search(query)
    return ApiResponse(data=results)


@router.post(
    "/retrieve-context",
    response_model=ApiResponse[BuiltRAGContext],
    status_code=status.HTTP_200_OK,
    summary="Build Prompt-Ready RAG Context with Citations",
)
async def retrieve_context(
    payload: RAGContextRequest,
) -> ApiResponse[BuiltRAGContext]:
    """Retrieve and format verified educational context blocks for LLM injection."""
    context = await knowledge_base_service.retrieve_context(
        query_text=payload.query,
        subject=payload.subject,
        topic=payload.topic,
        difficulty=payload.difficulty,
        top_k=payload.top_k,
    )
    return ApiResponse(data=context)


@router.post(
    "/ingest",
    response_model=ApiResponse[dict[str, Any]],
    status_code=status.HTTP_201_CREATED,
    summary="Ingest Text Snippet into Knowledge Base",
)
async def ingest_text(
    payload: IngestTextRequest,
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[dict[str, Any]]:
    """Ingest, chunk, embed, and store a new text document in the knowledge base."""
    count = await knowledge_base_service.ingest_text(
        title=payload.title,
        text=payload.text,
        subject=payload.subject,
        topic=payload.topic,
        difficulty=payload.difficulty,
    )
    return ApiResponse(data={"message": "Document indexed successfully.", "chunks_indexed": count})


@router.post(
    "/ingest-directory",
    response_model=ApiResponse[IngestionReport],
    status_code=status.HTTP_200_OK,
    summary="Scan & Ingest Entire Knowledge Base Directory",
)
async def ingest_directory(
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[IngestionReport]:
    """Scan and index all markdown and educational materials in the knowledge base folder."""
    report = await knowledge_base_service.ingest_directory()
    return ApiResponse(data=report)


@router.get(
    "/stats",
    response_model=ApiResponse[dict[str, Any]],
    status_code=status.HTTP_200_OK,
    summary="Get Knowledge Base Index Stats",
)
async def get_knowledge_base_stats() -> ApiResponse[dict[str, Any]]:
    """Return total vector count and embedding metadata."""
    stats = await knowledge_base_service.get_stats()
    return ApiResponse(data=stats)
