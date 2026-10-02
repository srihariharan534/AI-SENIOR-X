"""AI-SENIOR-X Text-to-Speech (TTS) Abstraction with Educational Content Sanitizer."""

import re
from abc import ABC, abstractmethod

from pydantic import BaseModel


class AudioSynthesisResult(BaseModel):
    """Result of text-to-speech audio synthesis."""

    audio_bytes: bytes
    mime_type: str = "audio/mp3"
    spoken_text: str
    duration_seconds: float = 0.0
    voice_locale: str = "en-US"
    provider: str = "mock"


class EducationalSpeechSanitizer:
    """Sanitizes educational markdown, code blocks, tables, and math for natural speech synthesis."""

    @classmethod
    def sanitize_for_speech(cls, text: str) -> str:
        """Convert markdown and code blocks into clean, natural spoken prose."""
        cleaned = text

        # 1. Replace multi-line code blocks with natural audio placeholders
        cleaned = re.sub(
            r"```python[\s\S]*?```",
            " Here is the Python code displayed on your screen. ",
            cleaned,
            flags=re.IGNORECASE,
        )
        cleaned = re.sub(
            r"```sql[\s\S]*?```",
            " Here is the SQL query displayed on your screen. ",
            cleaned,
            flags=re.IGNORECASE,
        )
        cleaned = re.sub(
            r"```[\s\S]*?```",
            " Here is the code example shown on your screen. ",
            cleaned,
        )

        # 2. Strip markdown headers (#, ##, ###)
        cleaned = re.sub(r"^#{1,6}\s+", "", cleaned, flags=re.MULTILINE)

        # 3. Strip bold/italic markers (*, **, _)
        cleaned = re.sub(r"[\*_]{1,3}", "", cleaned)

        # 4. Strip bullet points and list numbers
        cleaned = re.sub(r"^\s*[-*+]\s+", "", cleaned, flags=re.MULTILINE)
        cleaned = re.sub(r"^\s*\d+\.\s+", "", cleaned, flags=re.MULTILINE)

        # 5. Simplify inline backticks
        cleaned = re.sub(r"`([^`]+)`", r"\1", cleaned)

        # 6. Normalize whitespace
        cleaned = re.sub(r"\s+", " ", cleaned).strip()

        return cleaned


class BaseTextToSpeechProvider(ABC):
    """Abstract interface for voice audio synthesis."""

    @abstractmethod
    async def synthesize(
        self,
        text: str,
        voice_locale: str = "en-US",
        speech_rate: float = 1.0,
    ) -> AudioSynthesisResult:
        """Synthesize sanitized educational text into audio."""
        pass


class MockTextToSpeechProvider(BaseTextToSpeechProvider):
    """Mock TTS Provider for unit testing and local development."""

    async def synthesize(
        self,
        text: str,
        voice_locale: str = "en-US",
        speech_rate: float = 1.0,
    ) -> AudioSynthesisResult:
        """Produce mock synthesized audio result."""
        spoken = EducationalSpeechSanitizer.sanitize_for_speech(text)
        # Approximate word count / speaking rate (150 words per minute ~ 2.5 words per sec)
        words = spoken.split()
        est_duration = max(1.0, round(len(words) / (2.5 * speech_rate), 2))
        # Simulated dummy MP3 byte header
        dummy_audio = b"\xff\xfb\x90\x44" + (b"\x00" * min(1024, len(words) * 32))

        return AudioSynthesisResult(
            audio_bytes=dummy_audio,
            mime_type="audio/mp3",
            spoken_text=spoken,
            duration_seconds=est_duration,
            voice_locale=voice_locale,
            provider="mock-tts",
        )
