"""
AI-SENIOR-X Verified Learning Certificate Pydantic Schemas.
Models for strict completion eligibility checks, verified registered name binding,
cryptographic verification, audit trails, and certificate dashboard views.
"""

from enum import StrEnum
from typing import Any

from pydantic import BaseModel, Field


class CertificateCategory(StrEnum):
    COURSE_COMPLETION = "COURSE_COMPLETION"
    SUBJECT_COMPLETION = "SUBJECT_COMPLETION"
    SKILL_VERIFICATION = "SKILL_VERIFICATION"
    REAL_WORLD_CHALLENGE = "REAL_WORLD_CHALLENGE"
    PROJECT_COMPLETION = "PROJECT_COMPLETION"
    LEARNING_PATH_COMPLETION = "LEARNING_PATH_COMPLETION"


class CertificateStatus(StrEnum):
    VALID = "VALID"
    REVOKED = "REVOKED"
    EXPIRED = "EXPIRED"


class CertificateEligibilityCriteria(BaseModel):
    course_id: str
    course_title: str
    category: CertificateCategory = CertificateCategory.COURSE_COMPLETION
    required_lessons_total: int
    lessons_completed: int
    required_assessments_total: int
    assessments_passed: int
    demonstrated_mastery_pct: float
    minimum_mastery_required_pct: float = 80.0
    practical_tasks_completed: int
    real_world_challenges_completed: int
    is_eligible: bool
    eligibility_reasons: list[str]
    missing_requirements: list[str]
    learner_registered_name: str


class CertificateGenerateRequest(BaseModel):
    course_id: str
    category: CertificateCategory = CertificateCategory.COURSE_COMPLETION
    learner_id: str = "current_learner"
    custom_registered_name: str | None = None


class CertificateModel(BaseModel):
    certificate_id: str
    learner_id: str
    learner_registered_name: str
    recipient_email: str = "learner@ai-senior-x.io"
    email_delivery_status: str = "SENT"  # "SENT", "PENDING", "FAILED"
    email_sent_at: str | None = None
    resend_count: int = 0
    title: str
    category: CertificateCategory
    issued_at: str
    completion_date: str
    demonstrated_learning_areas: list[str]
    evidence_citations: list[str]
    status: CertificateStatus = CertificateStatus.VALID
    verification_url: str
    verification_code: str
    issuing_organization: str = "AI-SENIOR-X Intelligence Platform"
    signature_hash: str
    pdf_download_url: str
    metadata: dict[str, Any] = Field(default_factory=dict)


class CertificateResendResponse(BaseModel):
    success: bool
    certificate_id: str
    recipient_email: str
    email_delivery_status: str
    resend_count: int
    message: str


class CertificateVerificationResponse(BaseModel):
    is_valid: bool
    certificate_id: str
    status: CertificateStatus
    recipient_name: str
    achievement_title: str
    category: str
    issued_at: str
    demonstrated_learning_areas: list[str]
    issuing_organization: str = "AI-SENIOR-X Intelligence Platform"
    verification_authority: str = "AI-SENIOR-X Cryptographic Evidence Engine"
    signature_hash: str
    revocation_reason: str | None = None


class CertificateRevokeRequest(BaseModel):
    certificate_id: str
    reason: str
    replacement_certificate_id: str | None = None
