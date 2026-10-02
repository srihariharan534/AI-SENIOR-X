"""AI-SENIOR-X Voice Interruption & Cut-off Handler."""

from datetime import UTC, datetime

from pydantic import BaseModel, Field


class InterruptionEvent(BaseModel):
    """Event triggered when learner cuts off system playback."""

    session_id: str
    interrupted_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    interrupted_turn_index: int
    audio_playback_offset_seconds: float = 0.0
    action_taken: str = "halt_audio_playback"


class InterruptionHandler:
    """Manages conversational interruptions without corrupting turn-taking state."""

    def __init__(self):
        self._active_playback_sessions: dict[str, int] = {}  # session_id -> turn_index

    def register_audio_start(self, session_id: str, turn_index: int) -> None:
        """Mark that audio playback has begun for a specific turn."""
        self._active_playback_sessions[session_id] = turn_index

    def register_audio_finished(self, session_id: str) -> None:
        """Mark that audio playback concluded normally."""
        self._active_playback_sessions.pop(session_id, None)

    def is_playing(self, session_id: str) -> bool:
        """Check if audio playback is currently active."""
        return session_id in self._active_playback_sessions

    def handle_incoming_speech(
        self, session_id: str, offset_seconds: float = 0.0
    ) -> InterruptionEvent | None:
        """Process incoming speech during active playback, returning an interruption event if cut off."""
        if session_id in self._active_playback_sessions:
            turn_idx = self._active_playback_sessions.pop(session_id)
            return InterruptionEvent(
                session_id=session_id,
                interrupted_turn_index=turn_idx,
                audio_playback_offset_seconds=offset_seconds,
                action_taken="halt_audio_playback",
            )
        return None


interruption_handler = InterruptionHandler()
