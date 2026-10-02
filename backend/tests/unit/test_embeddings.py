"""Unit tests for Embedding generation and caching."""

import math

import pytest

from backend.app.llm.embeddings import (
    DeterministicLocalEmbeddingProvider,
    EmbeddingCache,
    get_embedding_provider,
)


@pytest.mark.asyncio
async def test_deterministic_embedding_properties():
    provider = DeterministicLocalEmbeddingProvider(dimension=768)
    assert provider.dimension == 768

    text_a = "Machine learning and gradient descent"
    text_b = "Machine learning and gradient descent"
    text_c = "Asynchronous event loops in python"

    vec_a = await provider.embed_query(text_a)
    vec_b = await provider.embed_query(text_b)
    vec_c = await provider.embed_query(text_c)

    assert len(vec_a) == 768
    # Determinism
    assert vec_a == vec_b
    assert vec_a != vec_c

    # L2 unit length
    norm = math.sqrt(sum(x * x for x in vec_a))
    assert pytest.approx(norm, rel=1e-3) == 1.0


@pytest.mark.asyncio
async def test_batch_embeddings():
    provider = get_embedding_provider("mock")
    docs = ["Doc 1", "Doc 2", "Doc 3"]
    vectors = await provider.embed_documents(docs)

    assert len(vectors) == 3
    assert all(len(v) == provider.dimension for v in vectors)


def test_embedding_cache():
    cache = EmbeddingCache(max_size=5)
    cache.set("query 1", "model_a", [0.1, 0.2])
    cached = cache.get("query 1", "model_a")
    assert cached == [0.1, 0.2]
    assert cache.get("nonexistent", "model_a") is None
