"""AI-SENIOR-X RAG Context Builder and Prompt Safety Guard."""

import re

from pydantic import BaseModel, Field

from backend.app.core.config import settings
from backend.app.rag.retrieval.reranker import RerankedResult


class Citation(BaseModel):
    """Source citation information for retrieved evidence."""

    source_id: str
    source_file: str
    topic: str
    subject: str
    snippet: str


class BuiltRAGContext(BaseModel):
    """Formatted RAG context payload for LLM injection."""

    formatted_context: str
    citations: list[Citation] = Field(default_factory=list)
    total_tokens_estimate: int = 0
    chunk_count: int = 0


def sanitize_document_text(text: str) -> str:
    """Neutralize potential prompt injection attempts within ingested educational documents."""
    # Defang common prompt injection patterns
    defanged = re.sub(
        r"(ignore previous instructions|disregard all previous commands|system prompt override)",
        "[FILTERED_PROMPT_INJECTION_PATTERN]",
        text,
        flags=re.IGNORECASE,
    )
    return defanged


class RAGContextBuilder:
    """Constructs prompt-safe, citation-linked educational context for LLM agents."""

    def __init__(self, max_tokens: int = settings.RAG_MAX_CONTEXT_TOKENS):
        self.max_tokens = max_tokens

    def build_context(
        self,
        query: str,
        results: list[RerankedResult],
        learner_topic: str | None = None,
        learner_grade: str | None = None,
    ) -> BuiltRAGContext:
        """Assemble retrieved chunks into structured context with strict token budget enforcement."""
        if not results:
            return BuiltRAGContext(
                formatted_context="No relevant background documents found in knowledge base.",
                citations=[],
                total_tokens_estimate=0,
                chunk_count=0,
            )

        context_blocks: list[str] = []
        citations: list[Citation] = []
        accumulated_chars = 0
        max_chars = self.max_tokens * 4  # Approximation: 1 token ~= 4 chars

        for idx, item in enumerate(results, start=1):
            sanitized_text = sanitize_document_text(item.text)
            source_file = item.metadata.get("source_file", "unknown")
            topic = item.metadata.get("topic", learner_topic or "General")
            subject = item.metadata.get("subject", "General")

            header = f"[Document {idx} | Source: {source_file} | Topic: {topic}]"
            block = f"{header}\n{sanitized_text}\n"

            if accumulated_chars + len(block) > max_chars:
                # Truncate or break if token budget exceeded
                remaining = max_chars - accumulated_chars
                if remaining > 100:
                    block = f"{header}\n{sanitized_text[:remaining]}... [TRUNCATED]\n"
                    context_blocks.append(block)
                    citations.append(
                        Citation(
                            source_id=item.id,
                            source_file=source_file,
                            topic=topic,
                            subject=subject,
                            snippet=sanitized_text[:120],
                        )
                    )
                break

            context_blocks.append(block)
            accumulated_chars += len(block)
            citations.append(
                Citation(
                    source_id=item.id,
                    source_file=source_file,
                    topic=topic,
                    subject=subject,
                    snippet=sanitized_text[:120],
                )
            )

        joined_context = (
            "--- START OF RETRIEVED EDUCATIONAL KNOWLEDGE (DATA ONLY) ---\n"
            + "\n".join(context_blocks)
            + "--- END OF RETRIEVED EDUCATIONAL KNOWLEDGE ---"
        )

        return BuiltRAGContext(
            formatted_context=joined_context,
            citations=citations,
            total_tokens_estimate=len(joined_context) // 4,
            chunk_count=len(citations),
        )
