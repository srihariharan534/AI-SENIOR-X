"""AI Model Provider Configuration & Workload Routing database models."""

from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.database.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class AIProviderConfig(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Encrypted model provider credentials and baseline parameters."""

    __tablename__ = "ai_provider_configs"

    user_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True
    )
    provider: Mapped[str] = mapped_column(
        String(50), nullable=False, index=True
    )  # openrouter, gemini, groq, nvidia_nim, openai
    encrypted_api_key: Mapped[str] = mapped_column(Text, nullable=False)
    base_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    default_model: Mapped[str] = mapped_column(String(100), nullable=False)
    fallback_model: Mapped[str | None] = mapped_column(String(100), nullable=True)
    temperature: Mapped[float] = mapped_column(Float, default=0.7, nullable=False)
    max_tokens: Mapped[int] = mapped_column(Integer, default=2048, nullable=False)
    timeout: Mapped[float] = mapped_column(Float, default=30.0, nullable=False)
    enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    status: Mapped[str] = mapped_column(
        String(30), default="connected", nullable=False
    )  # connected, not_connected, error, disabled
    last_verified_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    last_latency_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    last_error_message: Mapped[str | None] = mapped_column(Text, nullable=True)

    def __repr__(self) -> str:
        return f"<AIProviderConfig id={self.id} provider={self.provider} default_model={self.default_model} status={self.status}>"


class AIWorkloadRouting(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Workload-to-Provider mapping for granular multi-agent AI orchestration."""

    __tablename__ = "ai_workload_routings"

    user_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True
    )
    workload: Mapped[str] = mapped_column(
        String(60), nullable=False, index=True
    )  # ai_tutor, doubt_resolution, learning_twin, assessment, practice_generation, mission_generation, skill_evaluation, certificate_explanation, voice_ai, rag_qa
    provider: Mapped[str] = mapped_column(String(50), nullable=False)
    model_name: Mapped[str] = mapped_column(String(100), nullable=False)
    temperature: Mapped[float] = mapped_column(Float, default=0.7, nullable=False)
    max_tokens: Mapped[int] = mapped_column(Integer, default=2048, nullable=False)

    def __repr__(self) -> str:
        return f"<AIWorkloadRouting workload={self.workload} provider={self.provider} model={self.model_name}>"
