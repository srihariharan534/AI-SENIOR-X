"""AI Voice Interaction REST Endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, status
from pydantic import BaseModel

from backend.app.agents.orchestrator.agent import orchestrator
from backend.app.api.dependencies import get_current_user
from backend.app.database.models.user import User
from backend.app.schemas.common import ApiResponse
from backend.app.voice.interruption_handler import InterruptionEvent, interruption_handler
from backend.app.voice.speech_to_text import MockSpeechToTextProvider
from backend.app.voice.text_to_speech import AudioSynthesisResult, MockTextToSpeechProvider

router = APIRouter(prefix="/voice", tags=["AI Voice & Audio"])

mock_stt = MockSpeechToTextProvider()
mock_tts = MockTextToSpeechProvider()


class VoiceTextTurnRequest(BaseModel):
    """Text-based voice turn request with synthesized audio output."""

    session_id: str
    text_prompt: str
    language_preference: str | None = None
    voice_locale: str = "en-US"


class VoiceSynthesisRequest(BaseModel):
    """Direct speech synthesis request."""

    text: str
    voice_locale: str = "en-US"
    speech_rate: float = 1.0


class InterruptionRequest(BaseModel):
    """Notify system that learner cut off speech output."""

    session_id: str
    offset_seconds: float = 0.0


@router.post(
    "/turn",
    response_model=ApiResponse[dict],
    status_code=status.HTTP_200_OK,
    summary="Execute conversational voice turn",
)
async def process_voice_turn(
    payload: VoiceTextTurnRequest,
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[dict]:
    """Process voice turn through orchestrator and synthesize audio reply."""
    # 1. Check interruption
    interruption = interruption_handler.handle_incoming_speech(
        payload.session_id, payload.offset_seconds
    )

    # 2. Call Orchestrator
    agent_resp = await orchestrator.handle_interaction(
        query=payload.text_prompt,
        learner_id=current_user.id,
        session_id=payload.session_id,
        explicit_intent="VOICE",
        language_preference=payload.language_preference,
    )

    # 3. Synthesize Voice Audio
    synthesis = await mock_tts.synthesize(
        text=agent_resp.content,
        voice_locale=payload.voice_locale,
    )

    result = {
        "session_id": payload.session_id,
        "transcribed_text": payload.text_prompt,
        "response_text": agent_resp.content,
        "spoken_text": synthesis.spoken_text,
        "audio_bytes_base64": synthesis.audio_bytes.hex(),
        "duration_seconds": synthesis.duration_seconds,
        "was_interrupted": interruption is not None,
    }
    return ApiResponse(data=result)


@router.post(
    "/synthesize",
    response_model=ApiResponse[dict],
    status_code=status.HTTP_200_OK,
    summary="Synthesize speech audio from text",
)
async def synthesize_speech(
    payload: VoiceSynthesisRequest,
) -> ApiResponse[dict]:
    """Convert educational prose into sanitized audio."""
    synthesis: AudioSynthesisResult = await mock_tts.synthesize(
        text=payload.text,
        voice_locale=payload.voice_locale,
        speech_rate=payload.speech_rate,
    )
    return ApiResponse(
        data={
            "spoken_text": synthesis.spoken_text,
            "duration_seconds": synthesis.duration_seconds,
            "mime_type": synthesis.mime_type,
            "audio_hex": synthesis.audio_bytes.hex(),
        }
    )


@router.post(
    "/interrupt",
    response_model=ApiResponse[InterruptionEvent | None],
    status_code=status.HTTP_200_OK,
    summary="Handle conversational interruption",
)
async def handle_voice_interruption(
    payload: InterruptionRequest,
) -> ApiResponse[InterruptionEvent | None]:
    """Register learner interruption and halt active playback turn."""
    event = interruption_handler.handle_incoming_speech(payload.session_id, payload.offset_seconds)
    return ApiResponse(data=event)
