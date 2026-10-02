"""Unit tests for AI-SENIOR-X Voice Engine."""

import pytest

from backend.app.voice.interruption_handler import InterruptionHandler
from backend.app.voice.speech_to_text import MockSpeechToTextProvider
from backend.app.voice.text_to_speech import EducationalSpeechSanitizer, MockTextToSpeechProvider
from backend.app.voice.voice_session import VoiceSessionManager


def test_educational_speech_sanitizer():
    raw_markdown = (
        "### Python Basics\n\n"
        "Here is the code to review:\n"
        "```python\n"
        "def add(a, b):\n"
        "    return a + b\n"
        "```\n\n"
        "Make sure to test with **positive** and *negative* inputs."
    )
    sanitized = EducationalSpeechSanitizer.sanitize_for_speech(raw_markdown)
    assert "```" not in sanitized
    assert "###" not in sanitized
    assert "**" not in sanitized
    assert "Here is the Python code displayed on your screen." in sanitized
    assert "Make sure to test with positive and negative inputs." in sanitized


def test_interruption_handler():
    handler = InterruptionHandler()
    session_id = "sess-voice-test-1"

    assert handler.is_playing(session_id) is False
    handler.register_audio_start(session_id, turn_index=2)
    assert handler.is_playing(session_id) is True

    # Incoming speech triggers interruption event
    event = handler.handle_incoming_speech(session_id, offset_seconds=1.5)
    assert event is not None
    assert event.session_id == session_id
    assert event.interrupted_turn_index == 2
    assert handler.is_playing(session_id) is False


@pytest.mark.asyncio
async def test_mock_stt_and_tts():
    stt = MockSpeechToTextProvider(default_text="Explain gradient descent")
    transcription = await stt.transcribe(b"dummy_audio_bytes_12345")
    assert transcription.text == "Explain gradient descent"
    assert transcription.confidence > 0.90

    tts = MockTextToSpeechProvider()
    synthesis = await tts.synthesize("Welcome to machine learning with AI-SENIOR-X.")
    assert len(synthesis.audio_bytes) > 0
    assert synthesis.duration_seconds > 0.0


@pytest.mark.asyncio
async def test_voice_session_turn():
    manager = VoiceSessionManager()

    async def mock_orchestrator_callback(text, language, session_id, learner_id):
        return f"Echo response to '{text}' in {language}"

    result = await manager.process_voice_turn(
        session_id="sess-voice-2",
        learner_id="learner-test",
        audio_bytes=b"sample_audio",
        orchestrator_callback=mock_orchestrator_callback,
    )
    assert result.session_id == "sess-voice-2"
    assert result.turn_index == 1
    assert "Echo response" in result.agent_response_text
    assert len(result.spoken_audio_bytes) > 0
