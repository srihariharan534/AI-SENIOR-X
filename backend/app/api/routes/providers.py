"""AI-SENIOR-X AI Model Providers & Workload Routing REST Endpoints."""

from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.api.dependencies import get_current_user, get_db
from backend.app.database.models.user import User
from backend.app.schemas.ai_provider import (
    AIProviderSummary,
    AIRoutingConfig,
    AIUsageStats,
    ConnectProviderRequest,
    ProviderHealthItem,
    ProviderModelInfo,
    TestConnectionRequest,
    TestConnectionResponse,
    UpdateProviderRequest,
    UpdateRoutingRequest,
)
from backend.app.schemas.common import ApiResponse
from backend.app.services.ai_provider_service import ai_provider_service

router = APIRouter(tags=["AI Model Providers & Routing"])


# =============================================================================
# Provider Directory & Status
# =============================================================================
@router.get(
    "/providers",
    response_model=ApiResponse[list[AIProviderSummary]],
    status_code=status.HTTP_200_OK,
    summary="List Supported AI Providers",
)
async def list_providers(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[list[AIProviderSummary]]:
    """Retrieve all supported model providers (OpenRouter, Gemini, Groq, NVIDIA NIM) with safe masked keys."""
    providers = await ai_provider_service.get_all_providers(db, str(current_user.id))
    return ApiResponse(data=providers)


@router.get(
    "/providers/health",
    response_model=ApiResponse[list[ProviderHealthItem]],
    status_code=status.HTTP_200_OK,
    summary="Get AI Providers Health & Latency",
)
async def get_providers_health(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[list[ProviderHealthItem]]:
    """Execute live latency and health checks across configured AI providers."""
    health_items = await ai_provider_service.get_health_status(db, str(current_user.id))
    return ApiResponse(data=health_items)


@router.get(
    "/providers/usage",
    response_model=ApiResponse[AIUsageStats],
    status_code=status.HTTP_200_OK,
    summary="Get Daily AI Provider Usage Metrics",
)
async def get_providers_usage(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[AIUsageStats]:
    """Retrieve real request counts, token usage, estimated costs, and latency metrics."""
    usage = await ai_provider_service.get_usage_metrics(db, str(current_user.id))
    return ApiResponse(data=usage)


@router.get(
    "/providers/{provider}",
    response_model=ApiResponse[AIProviderSummary],
    status_code=status.HTTP_200_OK,
    summary="Get Single AI Provider Details",
)
async def get_provider(
    provider: str,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[AIProviderSummary]:
    """Fetch status and masked configuration for specified provider."""
    summary = await ai_provider_service.get_provider(db, provider, str(current_user.id))
    if not summary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Provider '{provider}' not found.",
        )
    return ApiResponse(data=summary)


@router.post(
    "/providers/{provider}/connect",
    response_model=ApiResponse[AIProviderSummary],
    status_code=status.HTTP_200_OK,
    summary="Connect AI Provider Credentials",
)
async def connect_provider(
    provider: str,
    payload: ConnectProviderRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[AIProviderSummary]:
    """Store encrypted API key, test live connection, and activate provider."""
    try:
        summary = await ai_provider_service.connect_provider(
            db, provider, payload, str(current_user.id)
        )
        return ApiResponse(data=summary)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e


@router.post(
    "/providers/{provider}/test",
    response_model=ApiResponse[TestConnectionResponse],
    status_code=status.HTTP_200_OK,
    summary="Test Connection to AI Provider",
)
async def test_provider_connection(
    provider: str,
    payload: TestConnectionRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[TestConnectionResponse]:
    """Perform live test ping against provider with either temporary key or saved credentials."""
    result = await ai_provider_service.test_connection(db, provider, payload, str(current_user.id))
    return ApiResponse(data=result)


@router.patch(
    "/providers/{provider}",
    response_model=ApiResponse[AIProviderSummary],
    status_code=status.HTTP_200_OK,
    summary="Update AI Provider Configuration",
)
async def update_provider(
    provider: str,
    payload: UpdateProviderRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[AIProviderSummary]:
    """Update defaults, timeout, base URL, or replace API key."""
    try:
        summary = await ai_provider_service.update_provider(
            db, provider, payload, str(current_user.id)
        )
        return ApiResponse(data=summary)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e


@router.delete(
    "/providers/{provider}",
    response_model=ApiResponse[dict[str, Any]],
    status_code=status.HTTP_200_OK,
    summary="Disconnect / Delete AI Provider Credentials",
)
async def delete_provider(
    provider: str,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[dict[str, Any]]:
    """Remove user's encrypted credentials for specified provider."""
    deleted = await ai_provider_service.delete_provider(db, provider, str(current_user.id))
    return ApiResponse(
        data={"provider": provider, "deleted": deleted, "message": "Provider disconnected."}
    )


@router.get(
    "/providers/{provider}/models",
    response_model=ApiResponse[list[ProviderModelInfo]],
    status_code=status.HTTP_200_OK,
    summary="List Supported / Discovered Models for Provider",
)
async def list_provider_models(
    provider: str,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[list[ProviderModelInfo]]:
    """Discover available model list from provider."""
    models = await ai_provider_service.list_provider_models(db, provider, str(current_user.id))
    return ApiResponse(data=models)


# =============================================================================
# Workload-Specific & Default AI Routing
# =============================================================================
@router.get(
    "/ai/routing",
    response_model=ApiResponse[AIRoutingConfig],
    status_code=status.HTTP_200_OK,
    summary="Get Global and Workload AI Routing Configuration",
)
async def get_ai_routing(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[AIRoutingConfig]:
    """Fetch primary, fallback, and 10 workload-specific AI provider/model rules."""
    routing = await ai_provider_service.get_routing_config(db, str(current_user.id))
    return ApiResponse(data=routing)


@router.patch(
    "/ai/routing",
    response_model=ApiResponse[AIRoutingConfig],
    status_code=status.HTTP_200_OK,
    summary="Update AI Provider Routing Rules",
)
async def update_ai_routing(
    payload: UpdateRoutingRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[AIRoutingConfig]:
    """Update primary provider, fallback provider, and workload routing rules."""
    updated = await ai_provider_service.update_routing_config(db, payload, str(current_user.id))
    return ApiResponse(data=updated)
