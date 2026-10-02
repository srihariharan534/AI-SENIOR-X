"""Unit tests for RAG pipeline, chunker, vector store, and retriever."""

import pytest

from backend.app.rag.ingestion.chunker import DocumentChunker
from backend.app.rag.ingestion.document_loader import DocumentLoader, LoadedDocument
from backend.app.rag.knowledge_base import KnowledgeBaseService
from backend.app.rag.retrieval.retriever import RetrievalQuery
from backend.app.rag.vector_store import LocalVectorStore, VectorRecord


def test_document_loader_cleaning():
    dirty = "Hello\x00 World!\r\n\r\n\n\nNew Paragraph."
    cleaned = DocumentLoader.clean_text(dirty)
    assert "\x00" not in cleaned
    assert "\r" not in cleaned
    assert "\n\n\n" not in cleaned


def test_document_chunker():
    doc = LoadedDocument(
        doc_id="test_doc_01",
        title="Test Title",
        text="# Header 1\nContent under header 1.\n\n# Header 2\nContent under header 2.",
        subject="Computer Science",
        topic="Architecture",
    )
    chunker = DocumentChunker(chunk_size=100, chunk_overlap=20)
    chunks = chunker.chunk_document(doc)

    assert len(chunks) >= 1
    assert chunks[0].chunk_id.startswith("test_doc_01#chunk_")
    assert chunks[0].metadata.subject == "Computer Science"


@pytest.mark.asyncio
async def test_vector_store_operations(tmp_path):
    store_file = tmp_path / "test_store.json"
    store = LocalVectorStore(persistence_path=str(store_file))

    records = [
        VectorRecord(
            id="rec-1",
            vector=[1.0, 0.0, 0.0],
            text="Machine Learning",
            metadata={"subject": "AI", "topic": "ML"},
        ),
        VectorRecord(
            id="rec-2",
            vector=[0.0, 1.0, 0.0],
            text="Database SQL",
            metadata={"subject": "Database", "topic": "SQL"},
        ),
    ]
    upserted = await store.upsert(records)
    assert upserted == 2
    assert await store.count() == 2

    # Query matching rec-1
    results = await store.search(query_vector=[1.0, 0.0, 0.0], top_k=1)
    assert len(results) == 1
    assert results[0].id == "rec-1"
    assert results[0].score == 1.0

    # Query with metadata filter
    filtered = await store.search(
        query_vector=[1.0, 0.0, 0.0], top_k=5, filters={"subject": "Database"}
    )
    assert len(filtered) == 1
    assert filtered[0].id == "rec-2"


@pytest.mark.asyncio
async def test_hybrid_search_and_context_builder(tmp_path):
    store_file = tmp_path / "test_hybrid.json"
    store = LocalVectorStore(persistence_path=str(store_file))
    kb_service = KnowledgeBaseService(vector_store=store)

    await kb_service.ingest_text(
        title="Neural Net Basics",
        text="Backpropagation calculates gradients through the chain rule to update neural weights.",
        subject="AI/ML",
        topic="Neural Networks",
    )

    query = RetrievalQuery(
        query="backpropagation chain rule",
        top_k=3,
        subject="AI/ML",
    )
    reranked = await kb_service.search(query)
    assert len(reranked) > 0

    context = await kb_service.retrieve_context(
        query_text="How does backpropagation compute gradients?",
        subject="AI/ML",
        topic="Neural Networks",
    )
    assert "Backpropagation" in context.formatted_context
    assert len(context.citations) > 0
