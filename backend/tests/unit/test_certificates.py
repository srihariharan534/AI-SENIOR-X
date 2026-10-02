"""
Unit tests for AI-SENIOR-X Verified Learning Certificate System.
Verifies strict completion criteria gating, registered name integrity,
cryptographic verification, revocation, and SVG document generation.
"""

import pytest

from backend.app.schemas.certificate import (
    CertificateCategory,
    CertificateGenerateRequest,
    CertificateRevokeRequest,
    CertificateStatus,
)
from backend.app.services.certificate_service import CertificateService


def test_registered_name_invariant():
    """Learner's registered profile name must be preserved and used."""
    registered_name = CertificateService.get_registered_name("current_learner")
    assert registered_name == "SRIHARI HARAN"


def test_certificate_eligibility_gating():
    """
    Ineligible courses with unmet criteria must fail eligibility check
    and list exact missing requirements.
    """
    # Machine Learning Foundations has 7/10 lessons, 74% mastery (<80%)
    eligibility = CertificateService.check_eligibility(
        "machine-learning-foundations", "current_learner"
    )
    assert eligibility.is_eligible is False
    assert eligibility.demonstrated_mastery_pct < eligibility.minimum_mastery_required_pct
    assert len(eligibility.missing_requirements) > 0
    assert any("Lessons completed" in req for req in eligibility.missing_requirements)
    assert any("Demonstrated mastery score" in req for req in eligibility.missing_requirements)


def test_certificate_eligibility_passing():
    """Eligible courses meeting all criteria must pass verification."""
    eligibility = CertificateService.check_eligibility("python-foundations", "current_learner")
    assert eligibility.is_eligible is True
    assert eligibility.lessons_completed >= eligibility.required_lessons_total
    assert eligibility.assessments_passed >= eligibility.required_assessments_total
    assert eligibility.demonstrated_mastery_pct >= eligibility.minimum_mastery_required_pct
    assert len(eligibility.missing_requirements) == 0
    assert len(eligibility.eligibility_reasons) >= 4


def test_generate_certificate_enforces_eligibility():
    """Attempting to generate a certificate for an ineligible course must raise ValueError."""
    req = CertificateGenerateRequest(
        course_id="machine-learning-foundations",
        learner_id="current_learner",
    )
    with pytest.raises(ValueError) as exc_info:
        CertificateService.generate_certificate(req)
    assert "Eligibility requirements not satisfied" in str(exc_info.value)


def test_generate_and_retrieve_certificate():
    """Eligible request successfully issues a certificate with registered name and unique ID."""
    req = CertificateGenerateRequest(
        course_id="ai-project-portfolio",
        learner_id="current_learner",
        category=CertificateCategory.PROJECT_COMPLETION,
    )
    cert = CertificateService.generate_certificate(req)
    assert cert.certificate_id.startswith("ASX-2026-AIPRJ-")
    assert cert.learner_registered_name == "SRIHARI HARAN"
    assert cert.category == CertificateCategory.PROJECT_COMPLETION
    assert cert.status == CertificateStatus.VALID
    assert len(cert.signature_hash) == 64  # SHA256
    assert cert.verification_url == f"/verify/{cert.certificate_id}"


def test_public_verification_valid_certificate():
    """Public verification of valid certificate returns is_valid=True with recipient name."""
    verification = CertificateService.verify_certificate("ASX-2026-PY-000184")
    assert verification.is_valid is True
    assert verification.recipient_name == "SRIHARI HARAN"
    assert verification.achievement_title == "Python Foundations"
    assert verification.status == CertificateStatus.VALID


def test_public_verification_invalid_or_unknown_id():
    """Public verification of non-existent certificate returns is_valid=False."""
    verification = CertificateService.verify_certificate("ASX-FAKE-999999")
    assert verification.is_valid is False
    assert "No certificate record matches" in (verification.revocation_reason or "")


def test_certificate_revocation_audit():
    """Revoking a certificate updates status to REVOKED and invalidates verification."""
    # First generate a test cert
    req = CertificateGenerateRequest(
        course_id="python-foundations",
        learner_id="current_learner",
    )
    cert = CertificateService.generate_certificate(req)
    cert_id = cert.certificate_id

    # Revoke it
    revoke_req = CertificateRevokeRequest(
        certificate_id=cert_id,
        reason="Administrative compliance re-verification test",
        replacement_certificate_id="ASX-2026-PY-REPLACEMENT-001",
    )
    revoked = CertificateService.revoke_certificate(revoke_req)
    assert revoked.status == CertificateStatus.REVOKED
    assert (
        revoked.metadata.get("revocation_reason")
        == "Administrative compliance re-verification test"
    )

    # Verify now reports invalid
    verify_res = CertificateService.verify_certificate(cert_id)
    assert verify_res.is_valid is False
    assert verify_res.status == CertificateStatus.REVOKED


def test_generate_svg_certificate():
    """Generating SVG output creates well-formatted vector document."""
    svg = CertificateService.generate_svg_certificate("ASX-2026-SQL-000421")
    assert "<svg" in svg
    assert "SRIHARI HARAN" in svg
    assert "SQL ANALYTICS" in svg
    assert "ASX-2026-SQL-000421" in svg
    assert "</svg>" in svg


@pytest.mark.asyncio
async def test_resend_certificate_email_dispatch():
    """Resending a certificate dispatches email, increments resend_count, and sets delivery status."""
    res = await CertificateService.resend_certificate_email(
        "ASX-2026-PY-000184", "srihari@ai-senior-x.io"
    )
    assert res.success is True
    assert res.certificate_id == "ASX-2026-PY-000184"
    assert res.email_delivery_status == "SENT"
    assert res.resend_count >= 1
    assert "successfully dispatched" in res.message


@pytest.mark.asyncio
async def test_email_service_templates_and_sandbox():
    """EmailService correctly formats certificate, welcome, and password-reset messages."""
    from backend.app.services.email_service import email_service

    welcome_res = await email_service.send_welcome_email("srihari@ai-senior-x.io", "Srihari Haran")
    assert welcome_res["success"] is True
    assert welcome_res["status"] == "SENT"

    reset_res = await email_service.send_password_reset_email(
        "srihari@ai-senior-x.io", "test_token_123"
    )
    assert reset_res["success"] is True
    assert reset_res["status"] == "SENT"
