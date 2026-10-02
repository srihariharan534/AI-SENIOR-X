"""
AI-SENIOR-X Academic Intelligence Center Endpoints.
Aggregates live academic record, course matrix, 22-subject state, practice intelligence,
assessment telemetry, Learning Twin cognitive profile, and flight recorder.
"""

from fastapi import APIRouter, status

from backend.app.schemas.common import ApiResponse
from backend.app.services.dashboard_analytics_service import (
    DashboardOverviewResponse,
    dashboard_analytics_service,
)

router = APIRouter(prefix="/dashboard", tags=["Academic Intelligence Dashboard"])


@router.get(
    "/overview",
    response_model=ApiResponse[DashboardOverviewResponse],
    status_code=status.HTTP_200_OK,
    summary="Get unified Live Academic Intelligence Center dashboard state",
)
async def get_dashboard_overview() -> ApiResponse[DashboardOverviewResponse]:
    """
    Returns aggregated real data across all 22 subjects, course matrix,
    practice intelligence, assessment telemetry, verified evidence, and learning twin profile.
    """
    overview_data = dashboard_analytics_service.get_dashboard_overview()
    return ApiResponse(
        success=True,
        message="Academic Intelligence Center overview successfully retrieved.",
        data=overview_data,
    )
