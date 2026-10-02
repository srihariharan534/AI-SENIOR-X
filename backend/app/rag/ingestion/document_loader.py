"""AI-SENIOR-X Document Loader and Cleaner."""

import hashlib
import json
import re
from pathlib import Path
from typing import Any

from pydantic import BaseModel, Field


class LoadedDocument(BaseModel):
    """Represents raw document text with extracted frontmatter and source metadata."""

    doc_id: str
    title: str
    text: str
    subject: str = "General"
    topic: str = "General"
    concept: str | None = None
    difficulty: str = "intermediate"
    source_path: str = ""
    metadata: dict[str, Any] = Field(default_factory=dict)


class DocumentLoader:
    """Loads and sanitizes Markdown, text, and JSON documents for ingestion."""

    @staticmethod
    def clean_text(text: str) -> str:
        """Sanitize text, normalizing whitespace and stripping unprintable control characters."""
        # Strip null bytes and non-printable control characters
        cleaned = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", "", text)
        # Normalize carriage returns
        cleaned = cleaned.replace("\r\n", "\n").replace("\r", "\n")
        # Collapse multiple blank lines
        cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
        return cleaned.strip()

    @classmethod
    def load_file(cls, file_path: Path) -> LoadedDocument | None:
        """Load and parse a single document file."""
        if not file_path.exists() or not file_path.is_file():
            return None

        suffix = file_path.suffix.lower()
        if suffix not in (".md", ".markdown", ".txt", ".json"):
            return None

        content = file_path.read_text(encoding="utf-8", errors="replace")
        cleaned = cls.clean_text(content)
        if not cleaned:
            return None

        # Deterministic document ID from content + path
        path_str = str(file_path.as_posix())
        doc_hash = hashlib.sha256(f"{path_str}:{cleaned[:200]}".encode()).hexdigest()[:12]
        doc_id = f"doc_{file_path.stem}_{doc_hash}"

        # Default classification derived from parent directories
        parts = file_path.parts
        subject = "Computer Science"
        topic = file_path.stem.replace("_", " ").replace("-", " ").title()

        if len(parts) >= 2:
            subject = parts[-2].replace("_", " ").replace("-", " ").title()

        title = file_path.stem.replace("_", " ").replace("-", " ").title()
        metadata: dict[str, Any] = {"file_name": file_path.name, "extension": suffix}

        # Parse JSON structured curriculum files
        if suffix == ".json":
            try:
                data = json.loads(content)
                if isinstance(data, dict):
                    title = data.get("title", title)
                    subject = data.get("subject", subject)
                    topic = data.get("topic", topic)
                    cleaned = data.get("description", "") + "\n\n" + str(data.get("content", ""))
                    metadata.update(data)
            except Exception:
                pass

        # Extract markdown title if present
        first_line = cleaned.split("\n")[0]
        if first_line.startswith("# "):
            title = first_line.replace("# ", "").strip()

        return LoadedDocument(
            doc_id=doc_id,
            title=title,
            text=cleaned,
            subject=subject,
            topic=topic,
            source_path=path_str,
            metadata=metadata,
        )

    @classmethod
    def load_directory(cls, dir_path: Path) -> list[LoadedDocument]:
        """Recursively scan and load all supported documents in a directory."""
        docs: list[LoadedDocument] = []
        if not dir_path.exists() or not dir_path.is_dir():
            return docs

        for ext in ("*.md", "*.markdown", "*.txt", "*.json"):
            for file_path in dir_path.rglob(ext):
                doc = cls.load_file(file_path)
                if doc:
                    docs.append(doc)

        return docs
