"""Real-World Projects, Scenarios, and Portfolio Evidence Endpoints."""

from typing import Annotated, Any

from fastapi import APIRouter, Depends, Query, status

from backend.app.api.dependencies import get_current_user
from backend.app.database.models.user import User
from backend.app.schemas.common import ApiResponse
from backend.app.schemas.real_world import (
    DecisionEvaluationRequest,
    DecisionEvaluationResponse,
    PortfolioEvidenceRecord,
    ProjectDefinition,
    ProjectEvaluation,
    ProjectSubmission,
    RecoveryDiagnosisRequest,
    RecoveryDiagnosisResponse,
    ScenarioDefinition,
)
from backend.app.services.real_world_service import RealWorldService
from backend.app.services.recovery_engine import RecoveryEngineService

router = APIRouter(prefix="/real-world", tags=["Real-World Projects & Scenarios"])


@router.get(
    "/projects",
    response_model=ApiResponse[list[ProjectDefinition]],
    status_code=status.HTTP_200_OK,
    summary="List Curated Real-World Projects",
)
async def list_projects(
    domain: str | None = Query(None, description="Filter by domain, e.g. Python, SQL, ML, Cloud"),
) -> ApiResponse[list[ProjectDefinition]]:
    """Retrieve realistic engineering projects designed around concrete real-world problems."""
    projects = RealWorldService.get_all_projects(domain=domain)
    return ApiResponse(data=projects)


@router.get(
    "/projects/{project_id}",
    response_model=ApiResponse[ProjectDefinition],
    status_code=status.HTTP_200_OK,
    summary="Get Specific Real-World Project Details",
)
async def get_project(
    project_id: str,
) -> ApiResponse[ProjectDefinition]:
    """Retrieve detailed problem statement, constraints, steps, and starter template for a project."""
    project = RealWorldService.get_project_by_id(project_id)
    if not project:
        return ApiResponse(data=None, message="Project not found", status="error")
    return ApiResponse(data=project)


@router.post(
    "/projects/submit",
    response_model=ApiResponse[ProjectEvaluation],
    status_code=status.HTTP_200_OK,
    summary="Submit Project Solution for AI Evaluation & Portfolio Certification",
)
async def submit_project(
    payload: ProjectSubmission,
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[ProjectEvaluation]:
    """
    Evaluate real-world project against strict scale, memory, correctness, and architecture rubrics.
    Generates verifiable portfolio evidence upon completion.
    """
    evaluation = RealWorldService.evaluate_project_submission(
        submission=payload, learner_id=current_user.id
    )
    return ApiResponse(data=evaluation)


@router.get(
    "/portfolio-evidence",
    response_model=ApiResponse[list[PortfolioEvidenceRecord]],
    status_code=status.HTTP_200_OK,
    summary="Get Learner's Verifiable Portfolio Evidence",
)
async def get_portfolio_evidence(
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[list[PortfolioEvidenceRecord]]:
    """Retrieve cryptographic verified portfolio evidence records for completed projects."""
    evidence = RealWorldService.get_portfolio_evidence(current_user.id)
    return ApiResponse(data=evidence)


@router.get(
    "/scenarios",
    response_model=ApiResponse[list[ScenarioDefinition]],
    status_code=status.HTTP_200_OK,
    summary="List Real-World Engineering Scenarios",
)
async def list_scenarios() -> ApiResponse[list[ScenarioDefinition]]:
    """Retrieve situational architectural scenarios testing real-world trade-off decision making."""
    scenarios = RealWorldService.get_all_scenarios()
    return ApiResponse(data=scenarios)


@router.post(
    "/scenarios/evaluate-decision",
    response_model=ApiResponse[DecisionEvaluationResponse],
    status_code=status.HTTP_200_OK,
    summary="Evaluate Learner's Architectural Decision & Reasoning",
)
async def evaluate_decision(
    payload: DecisionEvaluationRequest,
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[DecisionEvaluationResponse]:
    """
    Evaluate learner's choice and 'Why did you choose this?' reasoning across:
    Scalability, Cost, Reliability, Complexity, and Maintainability.
    """
    result = RealWorldService.evaluate_decision_scenario(payload)
    return ApiResponse(data=result)


@router.get(
    "/challenge-feed",
    response_model=ApiResponse[list[dict[str, Any]]],
    status_code=status.HTTP_200_OK,
    summary="Get Real-World Challenge Feed Across Domains",
)
async def get_challenge_feed() -> ApiResponse[list[dict[str, Any]]]:
    """Retrieve dynamic challenge feed across E-Commerce, Fintech, Healthcare, Logistics, Agriculture, Cloud, Education."""
    feed = RealWorldService.get_challenge_feed()
    return ApiResponse(data=feed)


@router.post(
    "/recovery/diagnose",
    response_model=ApiResponse[RecoveryDiagnosisResponse],
    status_code=status.HTTP_200_OK,
    summary="Execute Failure to Recovery Diagnostic Loop",
)
async def diagnose_failure(
    payload: RecoveryDiagnosisRequest,
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[RecoveryDiagnosisResponse]:
    """
    Diagnose a failed question or task, pinpointing root misconception,
    missing prerequisite, and generating targeted remediation practice.
    """
    diagnosis = RecoveryEngineService.diagnose_learning_failure(payload)
    return ApiResponse(data=diagnosis)
