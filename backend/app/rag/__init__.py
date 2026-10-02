"""AI-SENIOR-X RAG Package."""

from backend.app.rag.context_builder import BuiltRAGContext, Citation, RAGContextBuilder
from backend.app.rag.ingestion.chunker import DocumentChunker, TextChunk
from backend.app.rag.ingestion.document_loader import DocumentLoader, LoadedDocument
from backend.app.rag.ingestion.metadata import ChunkMetadata
from backend.app.rag.knowledge_base import (
    IngestionReport,
    KnowledgeBaseService,
    knowledge_base_service,
)
from backend.app.rag.retrieval.hybrid_search import HybridSearchEngine, HybridSearchResult
from backend.app.rag.retrieval.reranker import BaseReranker, CrossRelevanceReranker, RerankedResult
from backend.app.rag.retrieval.retriever import RetrievalQuery, SemanticRetriever
from backend.app.rag.vector_store import (
    BaseVectorStore,
    LocalVectorStore,
    SearchResult,
    VectorRecord,
    get_vector_store,
)

__all__ = [
    "ChunkMetadata",
    "LoadedDocument",
    "DocumentLoader",
    "TextChunk",
    "DocumentChunker",
    "BaseVectorStore",
    "LocalVectorStore",
    "VectorRecord",
    "SearchResult",
    "get_vector_store",
    "RetrievalQuery",
    "SemanticRetriever",
    "HybridSearchResult",
    "HybridSearchEngine",
    "BaseReranker",
    "CrossRelevanceReranker",
    "RerankedResult",
    "Citation",
    "BuiltRAGContext",
    "RAGContextBuilder",
    "IngestionReport",
    "KnowledgeBaseService",
    "knowledge_base_service",
]
