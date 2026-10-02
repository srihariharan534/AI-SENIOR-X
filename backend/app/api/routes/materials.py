"""
AI-SENIOR-X Subject Materials API Endpoints.
Serves full subject materials libraries, notes, code examples, video lectures,
quizzes, challenges, and material-grounded AI tutor Q&A.
"""

from fastapi import APIRouter, HTTPException, Query, status

from backend.app.schemas.common import ApiResponse
from backend.app.services.subject_material_service import (
    MaterialAskAIRequest,
    MaterialAskAIResponse,
    MaterialItem,
    SubjectMaterialsSummary,
    subject_material_service,
)

router = APIRouter(prefix="/materials", tags=["Subject Materials Hub"])


@router.get(
    "/subjects/{subject_id}",
    response_model=ApiResponse[SubjectMaterialsSummary],
    status_code=status.HTTP_200_OK,
    summary="Get all indexed learning materials for a specific subject",
)
async def get_subject_materials(subject_id: str) -> ApiResponse[SubjectMaterialsSummary]:
    """Returns all notes, videos, code, quizzes, exercises, projects, and references for a subject."""
    summary = subject_material_service.get_subject_materials(subject_id)
    return ApiResponse(
        success=True,
        message=f"Materials for subject '{subject_id}' successfully retrieved.",
        data=summary,
    )


@router.get(
    "/{material_id}",
    response_model=ApiResponse[MaterialItem],
    status_code=status.HTTP_200_OK,
    summary="Get complete material item with content",
)
async def get_material_detail(material_id: str) -> ApiResponse[MaterialItem]:
    """Returns full content and metadata for a single material item."""
    material = subject_material_service.get_material_by_id(material_id)
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Material '{material_id}' not found."
        )
    return ApiResponse(
        success=True,
        message="Material details retrieved successfully.",
        data=material,
    )


@router.post(
    "/{material_id}/ask-ai",
    response_model=ApiResponse[MaterialAskAIResponse],
    status_code=status.HTTP_200_OK,
    summary="Ask AI questions strictly grounded in the selected material",
)
async def ask_ai_about_material(
    material_id: str, payload: MaterialAskAIRequest
) -> ApiResponse[MaterialAskAIResponse]:
    """Answers user queries grounded in the specific material document without hallucination."""
    payload.material_id = material_id
    res = subject_material_service.ask_ai_about_material(payload)
    return ApiResponse(
        success=True,
        message="Material-grounded AI explanation generated.",
        data=res,
    )


@router.get(
    "/search/query",
    response_model=ApiResponse[list[MaterialItem]],
    status_code=status.HTTP_200_OK,
    summary="Search materials across subjects",
)
async def search_materials(
    q: str = Query(..., min_length=2, description="Search term across materials"),
    subject_id: str | None = Query(None, description="Optional subject filter"),
) -> ApiResponse[list[MaterialItem]]:
    """Performs full-text search across titles, descriptions, and learning objectives."""
    target_subject = subject_id or "python"
    summary = subject_material_service.get_subject_materials(target_subject)
    q_lower = q.lower()

    filtered = [
        m
        for m in summary.materials
        if q_lower in m.title.lower()
        or q_lower in m.description.lower()
        or any(q_lower in tag.lower() for tag in m.tags)
    ]

    return ApiResponse(
        success=True,
        message=f"Found {len(filtered)} matching materials.",
        data=filtered,
    )
