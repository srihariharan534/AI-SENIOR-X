"""
AI-SENIOR-X Skill Intelligence & Proof-of-Skill API Routes.
Exposes endpoints for evidence graph, proof of skill records, teach-back evaluations,
learning blocker diagnostics, real-world challenge grading, and role gap analysis.
"""

from typing import Any

from fastapi import APIRouter, Query

from backend.app.schemas.common import ApiResponse
from backend.app.schemas.skill_intelligence import (
    ChallengeEvaluationResponse,
    ChallengeSubmissionRequest,
    DelayedRetentionCheckRequest,
    LearningBlockerRequest,
    LearningBlockerResponse,
    RoleGapAnalysis,
    SkillDetail,
    SkillIntelligenceProfile,
    TeachBackRequest,
    TeachBackResponse,
    TransferTestRequest,
)
from backend.app.services.skill_intelligence_service import skill_intelligence_service

router = APIRouter(prefix="/skill-intelligence", tags=["Skill Intelligence & Proof-of-Skill"])


@router.get("/profile", response_model=ApiResponse[SkillIntelligenceProfile])
async def get_skill_intelligence_profile(
    learner_id: str = Query("current_learner", description="Learner ID"),
):
    """
    Retrieve full verified Skill Intelligence profile with multi-dimensional evidence,
    demonstrated proof records, transparent skill state transitions, and role gap analysis.
    """
    profile = skill_intelligence_service.get_skill_intelligence_profile(learner_id)
    return ApiResponse(
        success=True,
        data=profile,
    )


@router.get("/skill/{skill_id}", response_model=ApiResponse[SkillDetail])
async def get_skill_detail(
    skill_id: str,
    learner_id: str = Query("current_learner", description="Learner ID"),
):
    """
    Retrieve deep-dive evidence detail, timeline progression, weak areas,
    and next recommended action for a specific skill.
    """
    detail = skill_intelligence_service.compute_skill_detail(
        learner_id=learner_id,
        skill_id=skill_id,
        skill_name=skill_id.replace("_", " ").title(),
        domain="Core Engineering & Data",
    )
    return ApiResponse(
        success=True,
        data=detail,
    )


@router.post("/teach-back/submit", response_model=ApiResponse[TeachBackResponse])
async def submit_teach_back(request: TeachBackRequest):
    """
    Evaluate learner teach-back explanation ('teach this concept back to me').
    Analyzes conceptual correctness, detects misconceptions, and records verified evidence.
    """
    response = skill_intelligence_service.evaluate_teach_back(request)
    return ApiResponse(
        success=True,
        data=response,
    )


@router.post("/blocker/diagnose", response_model=ApiResponse[LearningBlockerResponse])
async def diagnose_learning_blocker(request: LearningBlockerRequest):
    """
    Diagnose 'I Don't Know Where I'm Stuck' blocker across 9 cognitive blocker types.
    Returns root-cause explanation, missing prerequisites, and actionable 5-minute diagnostic.
    """
    response = skill_intelligence_service.diagnose_learning_blocker(request)
    return ApiResponse(
        success=True,
        data=response,
    )


@router.post("/challenge/evaluate", response_model=ApiResponse[ChallengeEvaluationResponse])
async def evaluate_challenge(request: ChallengeSubmissionRequest):
    """
    Grade real-world skill challenge submission against multi-criteria domain rubric.
    Generates verifiable proof-of-skill records for independent successful solutions.
    """
    response = skill_intelligence_service.evaluate_challenge_submission(request)
    return ApiResponse(
        success=True,
        data=response,
    )


@router.post("/retention-check", response_model=ApiResponse[dict[str, Any]])
async def check_delayed_retention(request: DelayedRetentionCheckRequest):
    """
    Verify skill retention after delayed interval (e.g. 14 days) to prevent memory decay.
    """
    result = skill_intelligence_service.evaluate_delayed_retention(request)
    return ApiResponse(
        success=True,
        data=result,
    )


@router.post("/transfer-test", response_model=ApiResponse[dict[str, Any]])
async def check_transfer_test(request: TransferTestRequest):
    """
    Evaluate cross-domain concept transfer (e.g., e-commerce relational join -> healthcare).
    """
    result = skill_intelligence_service.evaluate_transfer_test(request)
    return ApiResponse(
        success=True,
        data=result,
    )


@router.get("/roles/gap-analysis", response_model=ApiResponse[RoleGapAnalysis])
async def get_role_gap_analysis(
    target_role: str = Query("Data Analyst", description="Target Career Role"),
    learner_id: str = Query("current_learner", description="Learner ID"),
):
    """
    Compare learner's verified evidence against target industry role skill requirements.
    """
    analysis = skill_intelligence_service.perform_role_gap_analysis(learner_id, target_role)
    return ApiResponse(
        success=True,
        data=analysis,
    )
