"""AI-SENIOR-X Voice Engine Module."""

from backend.app.voice.interruption_handler import (
    InterruptionEvent,
    InterruptionHandler,
    interruption_handler,
)
from backend.app.voice.speech_to_text import (
    BaseSpeechToTextProvider,
    MockSpeechToTextProvider,
    TranscriptionResult,
)
from backend.app.voice.text_to_speech import (
    AudioSynthesisResult,
    BaseTextToSpeechProvider,
    EducationalSpeechSanitizer,
    MockTextToSpeechProvider,
)
from backend.app.voice.voice_session import (
    VoiceSessionManager,
    VoiceTurnResult,
    voice_session_manager,
)

__all__ = [
    "AudioSynthesisResult",
    "BaseSpeechToTextProvider",
    "BaseTextToSpeechProvider",
    "EducationalSpeechSanitizer",
    "InterruptionEvent",
    "InterruptionHandler",
    "MockSpeechToTextProvider",
    "MockTextToSpeechProvider",
    "TranscriptionResult",
    "VoiceSessionManager",
    "VoiceTurnResult",
    "interruption_handler",
    "voice_session_manager",
]
