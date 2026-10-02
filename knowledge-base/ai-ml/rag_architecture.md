# Retrieval-Augmented Generation (RAG) Architecture

## Overview

Retrieval-Augmented Generation (RAG) grounds Large Language Models in verified factual external knowledge bases, mitigating hallucinations and ensuring up-to-date domain accuracy.

### Core Pipeline Stages

1. **Ingestion & Chunking**: Raw documents are cleaned and split into semantically coherent text chunks. Preserving context boundaries is vital to avoid fragmenting key explanations.
2. **Dense Vector Embeddings**: Text chunks are projected into continuous high-dimensional vector spaces using embedding models such as `text-embedding-004`.
3. **Hybrid Search**: Merging dense vector semantic similarity with sparse BM25 keyword matching provides robust recall across both semantic concepts and precise technical keywords/identifiers.
4. **Cross-Relevance Reranking**: Candidate chunks are scored by a cross-encoder or cross-relevance filter to elevate the most informative context blocks.
5. **Prompt Injection & Generation**: Verified passages are structured as immutable data context for the LLM synthesis step.
