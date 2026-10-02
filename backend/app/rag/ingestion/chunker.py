"""AI-SENIOR-X Semantic Document Chunker."""

import re

from pydantic import BaseModel

from backend.app.core.config import settings
from backend.app.rag.ingestion.document_loader import LoadedDocument
from backend.app.rag.ingestion.metadata import ChunkMetadata


class TextChunk(BaseModel):
    """Represents an individual text chunk ready for vectorization and indexing."""

    chunk_id: str
    doc_id: str
    text: str
    metadata: ChunkMetadata


class DocumentChunker:
    """Splits documents into contextual chunks preserving semantic paragraph and section boundaries."""

    def __init__(
        self,
        chunk_size: int = settings.RAG_CHUNK_SIZE,
        chunk_overlap: int = settings.RAG_CHUNK_OVERLAP,
    ):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def _split_into_sections(self, text: str) -> list[str]:
        """Split text by markdown headers and multi-newlines."""
        # Split on markdown headers or double newlines
        pattern = r"(?=\n#{1,4}\s)|(?:\n\s*\n)"
        sections = re.split(pattern, text)
        return [s.strip() for s in sections if s and s.strip()]

    def chunk_document(self, doc: LoadedDocument) -> list[TextChunk]:
        """Convert a LoadedDocument into an ordered list of TextChunk objects."""
        sections = self._split_into_sections(doc.text)
        chunks: list[TextChunk] = []
        current_buffer = ""
        chunk_idx = 0

        for section in sections:
            if not current_buffer:
                current_buffer = section
            elif len(current_buffer) + len(section) + 1 <= self.chunk_size:
                current_buffer += "\n\n" + section
            else:
                # Buffer is full, emit chunk
                chunk_id = f"{doc.doc_id}#chunk_{chunk_idx:03d}"
                meta = ChunkMetadata(
                    doc_id=doc.doc_id,
                    chunk_id=chunk_id,
                    subject=doc.subject,
                    topic=doc.topic,
                    concept=doc.concept,
                    difficulty=doc.difficulty,
                    source_file=doc.source_path,
                    chunk_index=chunk_idx,
                    char_count=len(current_buffer),
                    custom_tags={"title": doc.title},
                )
                chunks.append(
                    TextChunk(
                        chunk_id=chunk_id,
                        doc_id=doc.doc_id,
                        text=current_buffer,
                        metadata=meta,
                    )
                )
                chunk_idx += 1

                # Retain overlap from end of previous buffer
                overlap_text = (
                    current_buffer[-self.chunk_overlap :]
                    if len(current_buffer) > self.chunk_overlap
                    else ""
                )
                current_buffer = (overlap_text + "\n\n" + section).strip()

        if current_buffer:
            chunk_id = f"{doc.doc_id}#chunk_{chunk_idx:03d}"
            meta = ChunkMetadata(
                doc_id=doc.doc_id,
                chunk_id=chunk_id,
                subject=doc.subject,
                topic=doc.topic,
                concept=doc.concept,
                difficulty=doc.difficulty,
                source_file=doc.source_path,
                chunk_index=chunk_idx,
                char_count=len(current_buffer),
                custom_tags={"title": doc.title},
            )
            chunks.append(
                TextChunk(
                    chunk_id=chunk_id,
                    doc_id=doc.doc_id,
                    text=current_buffer,
                    metadata=meta,
                )
            )

        return chunks
