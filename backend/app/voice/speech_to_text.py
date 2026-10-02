"""AI-SENIOR-X Speech-to-Text (STT) Abstraction."""

from abc import ABC, abstractmethod

from pydantic import BaseModel, Field


class TranscriptionResult(BaseModel):
    """Result of speech-to-text processing."""

    text: str
    detected_language: str = "en"
    confidence: float = Field(default=0.95, ge=0.0, le=1.0)
    audio_duration_seconds: float = 0.0
    provider: str = "mock"


class BaseSpeechToTextProvider(ABC):
    """Abstract interface for audio transcription."""

    @abstractmethod
    async def transcribe(
        self,
        audio_bytes: bytes,
        language_hint: str | None = None,
        mime_type: str = "audio/webm",
    ) -> TranscriptionResult:
        """Transcribe raw audio bytes into text."""
        pass


class MockSpeechToTextProvider(BaseSpeechToTextProvider):
    """Mock STT Provider for unit testing and local development."""

    def __init__(
        self, default_text: str = "Explain how neural networks learn with backpropagation"
    ):
        self.default_text = default_text

    async def transcribe(
        self,
        audio_bytes: bytes,
        language_hint: str | None = None,
        mime_type: str = "audio/webm",
    ) -> TranscriptionResult:
        """Return simulated transcription."""
        # If payload is empty
        if not audio_bytes:
            return TranscriptionResult(
                text="",
                detected_language=language_hint or "en",
                confidence=0.0,
                audio_duration_seconds=0.0,
                provider="mock-stt",
            )

        duration = min(30.0, max(1.0, len(audio_bytes) / 16000.0))
        return TranscriptionResult(
            text=self.default_text,
            detected_language=language_hint or "en",
            confidence=0.98,
            audio_duration_seconds=round(duration, 2),
            provider="mock-stt",
        )
