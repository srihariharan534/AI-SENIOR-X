"""AI-SENIOR-X RAG Chunk Metadata Models."""

from datetime import UTC, datetime
from typing import Any

from pydantic import BaseModel, Field


class ChunkMetadata(BaseModel):
    """Normalized metadata for vectorized educational chunks."""

    doc_id: str
    chunk_id: str
    subject: str = Field("General", description="Subject domain, e.g. Computer Science")
    topic: str = Field("General", description="Topic module, e.g. Neural Networks")
    concept: str | None = Field(None, description="Specific concept, e.g. Backpropagation")
    difficulty: str = Field("intermediate", description="beginner, intermediate, advanced")
    language: str = Field("en", description="Language code")
    source_file: str = Field("", description="File origin path or URL")
    chunk_index: int = Field(0, ge=0)
    char_count: int = Field(0, ge=0)
    created_at: str = Field(default_factory=lambda: datetime.now(UTC).isoformat())
    custom_tags: dict[str, Any] = Field(default_factory=dict)
