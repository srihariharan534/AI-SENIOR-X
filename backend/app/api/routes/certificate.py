"""
AI-SENIOR-X Certificate API Endpoints.
Provides strictly verified certificate eligibility checks, cryptographic generation,
public verification, and SVG/PDF download.
"""

from fastapi import APIRouter, HTTPException, Query, Response, status

from backend.app.schemas.certificate import (
    CertificateEligibilityCriteria,
    CertificateGenerateRequest,
    CertificateModel,
    CertificateResendResponse,
    CertificateRevokeRequest,
    CertificateVerificationResponse,
)
from backend.app.schemas.common import ApiResponse
from backend.app.services.certificate_service import CertificateService

router = APIRouter(prefix="/certificates", tags=["Certificates"])


@router.get(
    "/eligibility",
    response_model=ApiResponse[CertificateEligibilityCriteria],
    summary="Check certificate eligibility based on verified learning and assessment metrics",
)
async def check_certificate_eligibility(
    course_id: str = Query(..., description="The course/curriculum ID to evaluate"),
    learner_id: str = Query("current_learner", description="Learner identifier"),
):
    """
    Evaluates server-side completion records against configured requirements:
    - Required lessons completed
    - Required assessments passed
    - Minimum demonstrated mastery score (e.g., ≥80%)
    - Required practical drills
    - Real-world challenge submitted and evaluated
    """
    eligibility = CertificateService.check_eligibility(course_id=course_id, learner_id=learner_id)
    return ApiResponse(
        success=True,
        message="Certificate eligibility calculated successfully.",
        data=eligibility,
    )


@router.post(
    "/generate",
    response_model=ApiResponse[CertificateModel],
    status_code=status.HTTP_201_CREATED,
    summary="Generate a verified certificate using learner's registered name",
)
async def generate_certificate(req: CertificateGenerateRequest):
    """
    Generates a cryptographically signed certificate.
    Enforces server-side eligibility and uses the verified registered name.
    """
    try:
        cert = CertificateService.generate_certificate(req)
        return ApiResponse(
            success=True,
            message="Certificate generated and signed successfully.",
            data=cert,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Certificate generation error: {str(e)}",
        ) from e


@router.get(
    "",
    response_model=ApiResponse[list[CertificateModel]],
    summary="List all certificates earned by the learner",
)
async def list_certificates(
    learner_id: str = Query("current_learner", description="Learner identifier"),
):
    """Returns all certificates associated with the learner."""
    certs = CertificateService.list_learner_certificates(learner_id)
    return ApiResponse(
        success=True,
        message=f"Found {len(certs)} earned certificates.",
        data=certs,
    )


@router.get(
    "/verify/{certificate_id}",
    response_model=ApiResponse[CertificateVerificationResponse],
    summary="Public verification endpoint for certificate validation",
)
async def verify_certificate(certificate_id: str):
    """
    Verifies certificate authenticity and returns public validation details
    without disclosing private learner records.
    """
    verification = CertificateService.verify_certificate(certificate_id)
    return ApiResponse(
        success=True,
        message="Verification query completed.",
        data=verification,
    )


@router.get(
    "/{certificate_id}",
    response_model=ApiResponse[CertificateModel],
    summary="Get single certificate details by ID",
)
async def get_certificate(certificate_id: str):
    """Retrieve full certificate metadata by ID."""
    cert = CertificateService.get_certificate_by_id(certificate_id)
    if not cert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Certificate '{certificate_id}' not found.",
        )
    return ApiResponse(
        success=True,
        message="Certificate retrieved successfully.",
        data=cert,
    )


@router.get(
    "/{certificate_id}/pdf",
    summary="Download certificate as an official vector SVG / Printable document",
)
async def download_certificate_document(certificate_id: str):
    """Returns the SVG certificate vector document."""
    try:
        svg_content = CertificateService.generate_svg_certificate(certificate_id)
        return Response(
            content=svg_content,
            media_type="image/svg+xml",
            headers={
                "Content-Disposition": f'inline; filename="{certificate_id}-certificate.svg"',
                "Cache-Control": "public, max-age=86400",
            },
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e)) from e


@router.post(
    "/{certificate_id}/resend",
    response_model=ApiResponse[CertificateResendResponse],
    summary="Resend verified certificate PDF and verification details to recipient's email",
)
async def resend_certificate_email(
    certificate_id: str,
    recipient_email: str | None = Query(None, description="Optional target email override"),
):
    """
    Dispatches certificate document and verification link to learner's registered email.
    Includes rate limiting and delivery status tracking.
    """
    try:
        res = await CertificateService.resend_certificate_email(
            certificate_id=certificate_id, recipient_email=recipient_email
        )
        return ApiResponse(
            success=res.success,
            message=res.message,
            data=res,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Email dispatch error: {str(e)}",
        ) from e


@router.post(
    "/revoke",
    response_model=ApiResponse[CertificateModel],
    summary="Administratively revoke an issued certificate with auditable reason",
)
async def revoke_certificate(req: CertificateRevokeRequest):
    """Revoke a certificate and record the revocation in the audit trail."""
    try:
        updated_cert = CertificateService.revoke_certificate(req)
        return ApiResponse(
            success=True,
            message=f"Certificate '{req.certificate_id}' has been revoked.",
            data=updated_cert,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e)) from e
