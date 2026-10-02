"""AI-SENIOR-X High-Level Knowledge Base Service."""

from pathlib import Path
from typing import Any

from pydantic import BaseModel, Field

from backend.app.core.config import settings
from backend.app.core.logging import logger
from backend.app.llm.embeddings import BaseEmbeddingProvider, get_embedding_provider
from backend.app.rag.context_builder import BuiltRAGContext, RAGContextBuilder
from backend.app.rag.ingestion.chunker import DocumentChunker, TextChunk
from backend.app.rag.ingestion.document_loader import DocumentLoader, LoadedDocument
from backend.app.rag.retrieval.hybrid_search import HybridSearchEngine
from backend.app.rag.retrieval.reranker import BaseReranker, RerankedResult, get_reranker
from backend.app.rag.retrieval.retriever import RetrievalQuery, SemanticRetriever
from backend.app.rag.vector_store import BaseVectorStore, VectorRecord, get_vector_store


class IngestionReport(BaseModel):
    """Summary stats of an ingestion execution."""

    documents_processed: int
    chunks_created: int
    vectors_indexed: int
    errors: list[str] = Field(default_factory=list)


class KnowledgeBaseService:
    """High-level facade orchestrating document ingestion, vector storage, and RAG retrieval."""

    def __init__(
        self,
        vector_store: BaseVectorStore | None = None,
        embedding_provider: BaseEmbeddingProvider | None = None,
        reranker: BaseReranker | None = None,
    ):
        self.vector_store = vector_store or get_vector_store()
        self.embedding_provider = embedding_provider or get_embedding_provider()
        self.loader = DocumentLoader()
        self.chunker = DocumentChunker()
        self.retriever = SemanticRetriever(self.vector_store, self.embedding_provider)
        self.hybrid_engine = HybridSearchEngine(self.retriever, self.vector_store)
        self.reranker = reranker or get_reranker()
        self.context_builder = RAGContextBuilder()

    async def ingest_document(self, doc: LoadedDocument) -> int:
        """Process, chunk, embed, and store a single LoadedDocument."""
        chunks: list[TextChunk] = self.chunker.chunk_document(doc)
        if not chunks:
            return 0

        # Extract texts to generate batch embeddings
        texts = [c.text for c in chunks]
        embeddings = await self.embedding_provider.embed_documents(texts)

        records: list[VectorRecord] = []
        for chunk, vec in zip(chunks, embeddings, strict=False):
            records.append(
                VectorRecord(
                    id=chunk.chunk_id,
                    vector=vec,
                    text=chunk.text,
                    metadata=chunk.metadata.model_dump(),
                )
            )

        indexed_count = await self.vector_store.upsert(records)
        return indexed_count

    async def ingest_text(
        self,
        title: str,
        text: str,
        subject: str = "General",
        topic: str = "General",
        difficulty: str = "intermediate",
    ) -> int:
        """Ingest raw string content directly into the knowledge store."""
        cleaned = self.loader.clean_text(text)
        doc = LoadedDocument(
            doc_id=f"text_{title.lower().replace(' ', '_')}",
            title=title,
            text=cleaned,
            subject=subject,
            topic=topic,
            difficulty=difficulty,
            source_path="direct_input",
        )
        return await self.ingest_document(doc)

    async def ingest_directory(self, dir_path: Path | None = None) -> IngestionReport:
        """Scan and ingest all documents from directory."""
        target_dir = dir_path or Path(settings.KNOWLEDGE_BASE_DIR)
        docs = self.loader.load_directory(target_dir)

        report = IngestionReport(
            documents_processed=0,
            chunks_created=0,
            vectors_indexed=0,
            errors=[],
        )

        for doc in docs:
            try:
                count = await self.ingest_document(doc)
                report.documents_processed += 1
                report.vectors_indexed += count
            except Exception as e:
                logger.error(f"Error ingesting document '{doc.title}': {e}")
                report.errors.append(f"{doc.title}: {str(e)}")

        return report

    async def search(self, query: RetrievalQuery) -> list[RerankedResult]:
        """Execute hybrid search followed by cross-relevance reranking."""
        hybrid_candidates = await self.hybrid_engine.search(query)
        reranked = await self.reranker.rerank(
            query=query.query,
            candidates=hybrid_candidates,
            top_n=query.top_k,
        )
        return reranked

    async def retrieve_context(
        self,
        query_text: str,
        subject: str | None = None,
        topic: str | None = None,
        difficulty: str | None = None,
        top_k: int = 4,
    ) -> BuiltRAGContext:
        """End-to-end RAG retrieval pipeline producing prompt-ready context block."""
        query = RetrievalQuery(
            query=query_text,
            subject=subject,
            topic=topic,
            difficulty=difficulty,
            top_k=top_k,
        )
        reranked_results = await self.search(query)
        return self.context_builder.build_context(
            query=query_text,
            results=reranked_results,
            learner_topic=topic,
        )

    async def get_stats(self) -> dict[str, Any]:
        """Return knowledge base vector store statistics."""
        count = await self.vector_store.count()
        return {
            "total_chunks_indexed": count,
            "embedding_dimension": self.embedding_provider.dimension,
            "vector_store_type": settings.VECTOR_STORE_TYPE,
        }


knowledge_base_service = KnowledgeBaseService()
