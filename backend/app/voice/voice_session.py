"""AI-SENIOR-X End-to-End Voice Session Orchestration."""

from datetime import UTC, datetime

from pydantic import BaseModel, Field

from backend.app.multilingual.language_router import LanguageRouter
from backend.app.voice.interruption_handler import InterruptionHandler, interruption_handler
from backend.app.voice.speech_to_text import BaseSpeechToTextProvider, MockSpeechToTextProvider
from backend.app.voice.text_to_speech import BaseTextToSpeechProvider, MockTextToSpeechProvider


class VoiceTurnResult(BaseModel):
    """Result of a single voice conversational turn."""

    session_id: str
    turn_index: int
    transcribed_user_text: str
    detected_language: str
    agent_response_text: str
    spoken_audio_bytes: bytes
    audio_duration_seconds: float
    was_interrupted: bool = False
    timestamp: datetime = Field(default_factory=lambda: datetime.now(UTC))


class VoiceSessionManager:
    """Coordinates voice turn-taking: Audio In -> STT -> Language Routing -> AI Orchestrator -> TTS -> Audio Out."""

    def __init__(
        self,
        stt_provider: BaseSpeechToTextProvider | None = None,
        tts_provider: BaseTextToSpeechProvider | None = None,
        interrupt_handler: InterruptionHandler | None = None,
    ):
        self.stt = stt_provider or MockSpeechToTextProvider()
        self.tts = tts_provider or MockTextToSpeechProvider()
        self.interrupt_handler = interrupt_handler or interruption_handler
        self._turn_counters: dict[str, int] = {}

    async def process_voice_turn(
        self,
        session_id: str,
        learner_id: str,
        audio_bytes: bytes,
        orchestrator_callback,  # Async callable taking (text, language, session_id, learner_id) -> str
        language_preference: str | None = None,
    ) -> VoiceTurnResult:
        """Execute a full conversational voice cycle."""
        # 1. Check for interruption of previous audio
        was_interrupted = False
        interruption = self.interrupt_handler.handle_incoming_speech(session_id)
        if interruption:
            was_interrupted = True

        # 2. Increment turn counter
        current_turn = self._turn_counters.get(session_id, 0) + 1
        self._turn_counters[session_id] = current_turn

        # 3. Transcribe speech
        transcription = await self.stt.transcribe(audio_bytes, language_hint=language_preference)
        user_text = transcription.text

        # 4. Route language
        routing = LanguageRouter.route_language(
            user_text, user_explicit_preference=language_preference
        )

        # 5. Call AI Orchestrator
        agent_reply = await orchestrator_callback(
            text=user_text,
            language=routing.response_language,
            session_id=session_id,
            learner_id=learner_id,
        )

        # 6. Synthesize voice response
        self.interrupt_handler.register_audio_start(session_id, current_turn)
        synthesis = await self.tts.synthesize(
            text=agent_reply,
            voice_locale=routing.voice_locale,
        )

        return VoiceTurnResult(
            session_id=session_id,
            turn_index=current_turn,
            transcribed_user_text=user_text,
            detected_language=routing.input_language,
            agent_response_text=agent_reply,
            spoken_audio_bytes=synthesis.audio_bytes,
            audio_duration_seconds=synthesis.duration_seconds,
            was_interrupted=was_interrupted,
        )


voice_session_manager = VoiceSessionManager()
