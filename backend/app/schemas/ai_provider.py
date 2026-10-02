"""AI-SENIOR-X AI Provider & Workload Routing Pydantic Schemas."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class AIProviderMetadata(BaseModel):
    """Metadata detailing official documentation, model capabilities, and endpoint URLs."""

    provider: str
    name: str
    description: str
    tagline: str
    docs_url: str
    get_key_url: str
    default_model: str
    suggested_models: list[str] = Field(default_factory=list)


class AIProviderSummary(BaseModel):
    """Public safe provider representation with masked key."""

    provider: str
    name: str
    description: str
    tagline: str
    status: str = "not_connected"  # connected, not_connected, error, disabled
    configured: bool = False
    masked_key: str | None = None
    default_model: str
    fallback_model: str | None = None
    base_url: str | None = None
    temperature: float = 0.7
    max_tokens: int = 2048
    timeout: float = 30.0
    enabled: bool = True
    is_primary: bool = False
    last_verified_at: datetime | None = None
    last_latency_ms: int | None = None
    last_error_message: str | None = None
    docs_url: str
    get_key_url: str
    supported_models: list[str] = Field(default_factory=list)


class ConnectProviderRequest(BaseModel):
    """Payload to configure and connect an AI provider with credentials."""

    api_key: str = Field(..., min_length=3, description="Provider secret API Key")
    default_model: str | None = Field(None, description="Primary default model identifier")
    fallback_model: str | None = Field(None, description="Optional fallback model")
    base_url: str | None = Field(None, description="Custom base URL override")
    temperature: float | None = Field(0.7, ge=0.0, le=2.0)
    max_tokens: int | None = Field(2048, ge=64, le=128000)
    timeout: float | None = Field(30.0, ge=1.0, le=120.0)
    enabled: bool | None = True


class UpdateProviderRequest(BaseModel):
    """Payload to modify configuration parameters or update API key."""

    api_key: str | None = Field(None, description="New secret API Key (leave empty to retain)")
    default_model: str | None = None
    fallback_model: str | None = None
    base_url: str | None = None
    temperature: float | None = Field(None, ge=0.0, le=2.0)
    max_tokens: int | None = Field(None, ge=64, le=128000)
    timeout: float | None = Field(None, ge=1.0, le=120.0)
    enabled: bool | None = None
    is_primary: bool | None = None


class TestConnectionRequest(BaseModel):
    """Payload to test credential validity and response latency."""

    api_key: str | None = Field(None, description="Optional plain API key to test prior to saving")
    model: str | None = Field(None, description="Model to test query against")
    base_url: str | None = Field(None, description="Custom base URL to test against")


class TestConnectionResponse(BaseModel):
    """Result of provider live connection verification."""

    success: bool
    provider: str
    model: str
    latency_ms: int
    message: str
    models_discovered: list[str] = Field(default_factory=list)


class ProviderModelInfo(BaseModel):
    """Discovered or available model information."""

    id: str
    name: str
    description: str | None = None
    context_length: int | None = None


class WorkloadRoutingRule(BaseModel):
    """Routing configuration for a specific AI workload."""

    workload: str
    workload_label: str
    description: str
    provider: str
    model_name: str
    temperature: float = 0.7
    max_tokens: int = 2048


class AIRoutingConfig(BaseModel):
    """Global and workload-specific routing state."""

    primary_provider: str = "gemini"
    primary_model: str = "gemini-1.5-pro"
    fallback_provider: str = "openrouter"
    fallback_model: str = "meta-llama/llama-3.3-70b-instruct"
    workloads: list[WorkloadRoutingRule] = Field(default_factory=list)


class UpdateRoutingRequest(BaseModel):
    """Payload to update primary/fallback providers and workload routing."""

    primary_provider: str | None = None
    primary_model: str | None = None
    fallback_provider: str | None = None
    fallback_model: str | None = None
    workload_mappings: dict[str, dict[str, Any]] | None = None


class ProviderHealthItem(BaseModel):
    """Live health status and ping for an AI model provider."""

    provider: str
    name: str
    status: str  # connected, not_connected, error, disabled
    latency_ms: int | None = None
    model: str
    last_checked: datetime | None = None
    error_detail: str | None = None


class AIUsageStats(BaseModel):
    """Daily request and token metrics."""

    total_requests_today: int = 0
    tokens_used_today: int = 0
    estimated_cost_usd: float = 0.0
    average_latency_ms: int = 0
    error_count_today: int = 0
    is_available: bool = True
    provider_breakdown: dict[str, Any] = Field(default_factory=dict)
