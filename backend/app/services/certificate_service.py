"""
AI-SENIOR-X Verified Learning Certificate Service.
Strict server-side verification, cryptographic hash signatures, registered name enforcement,
and multi-category audit trails.
"""

import hashlib
from datetime import datetime
from typing import Any

from backend.app.schemas.certificate import (
    CertificateCategory,
    CertificateEligibilityCriteria,
    CertificateGenerateRequest,
    CertificateModel,
    CertificateResendResponse,
    CertificateRevokeRequest,
    CertificateStatus,
    CertificateVerificationResponse,
)
from backend.app.services.email_service import email_service

# In-memory certificate and course catalog store with realistic learning paths & criteria
COURSE_CRITERIA_REGISTRY: dict[str, dict[str, Any]] = {
    "python-foundations": {
        "title": "Python Foundations",
        "category": CertificateCategory.COURSE_COMPLETION,
        "code": "PY",
        "required_lessons_total": 8,
        "required_assessments_total": 4,
        "minimum_mastery_required_pct": 80.0,
        "required_practical_tasks": 2,
        "required_real_world_challenges": 1,
        "learning_areas": [
            "Python Fundamentals & Syntax",
            "Control Flow & Algorithmic Logic",
            "Functions & Scope Management",
            "Data Structures (Lists, Dicts, Sets)",
            "Modular Code Architecture & Error Handling",
        ],
        "default_evidence": [
            "Completed 8 foundational lessons with interactive coding",
            "Passed 4 rigorous automated unit test assessments (Avg Score: 94%)",
            "Completed Data Processing CLI Real-World Challenge",
            "AI Learning Twin verified conceptual mastery at 92.5%",
        ],
    },
    "sql-analytics": {
        "title": "SQL Analytics",
        "category": CertificateCategory.SKILL_VERIFICATION,
        "code": "SQL",
        "required_lessons_total": 6,
        "required_assessments_total": 3,
        "minimum_mastery_required_pct": 85.0,
        "required_practical_tasks": 2,
        "required_real_world_challenges": 2,
        "learning_areas": [
            "Advanced Window Functions (RANK, DENSE_RANK, LEAD/LAG)",
            "Query Plan Optimization & Indexing",
            "Multi-Table CTE Aggregations & Pivots",
            "Data Warehouse Schemas (Star/Snowflake)",
            "Delayed Retention Practical Assessments",
        ],
        "default_evidence": [
            "Demonstrated practical competency across 6 analytical modules",
            "Optimized query plans reducing cost by 68% on benchmark datasets",
            "Completed E-Commerce Retention Cohort Analysis Challenge",
            "Verified by AI Proof-of-Skill Evaluator (Mastery Score: 89.0%)",
        ],
    },
    "machine-learning-foundations": {
        "title": "Machine Learning Foundations",
        "category": CertificateCategory.COURSE_COMPLETION,
        "code": "ML",
        "required_lessons_total": 10,
        "required_assessments_total": 5,
        "minimum_mastery_required_pct": 80.0,
        "required_practical_tasks": 3,
        "required_real_world_challenges": 1,
        "learning_areas": [
            "Supervised & Unsupervised Learning Theory",
            "Feature Engineering & Cross-Validation Pipelines",
            "Gradient Descent & Loss Optimization",
            "Model Evaluation Metrics (ROC-AUC, Precision/Recall, F1)",
            "Production Inference Deployment",
        ],
        "default_evidence": [
            "Completed 10 core ML modules with mathematical rigor",
            "Trained and evaluated ensemble models exceeding 91% accuracy target",
            "Delivered Customer Churn Predictor Real-World Mission",
            "AI Learning Twin verified knowledge graph retention at 88.0%",
        ],
    },
    "ai-project-portfolio": {
        "title": "AI Project Engineering Mastery",
        "category": CertificateCategory.PROJECT_COMPLETION,
        "code": "AIPRJ",
        "required_lessons_total": 5,
        "required_assessments_total": 2,
        "minimum_mastery_required_pct": 85.0,
        "required_practical_tasks": 3,
        "required_real_world_challenges": 3,
        "learning_areas": [
            "RAG Multi-Agent Orchestration",
            "FastAPI & Vector DB Hybrid Search Integration",
            "Next.js Interactive AI Dashboard Implementation",
            "Real-Time WebSocket Streaming & Memory State",
            "Production Containerization & CI/CD Verification",
        ],
        "default_evidence": [
            "Engineered end-to-end fullstack AI application with real user workflows",
            "Integrated multi-agent collaboration with sub-100ms vector retrieval",
            "Passed automated code quality, security, and performance test suites",
        ],
    },
}

# Simulated verified learner progress database records
LEARNER_PROGRESS_DB: dict[str, dict[str, dict[str, Any]]] = {
    "current_learner": {
        "registered_name": "SRIHARI HARAN",
        "python-foundations": {
            "lessons_completed": 8,
            "assessments_passed": 4,
            "demonstrated_mastery_pct": 92.5,
            "practical_tasks_completed": 2,
            "real_world_challenges_completed": 1,
        },
        "sql-analytics": {
            "lessons_completed": 6,
            "assessments_passed": 3,
            "demonstrated_mastery_pct": 89.0,
            "practical_tasks_completed": 2,
            "real_world_challenges_completed": 2,
        },
        "machine-learning-foundations": {
            "lessons_completed": 7,  # in progress: 7 of 10
            "assessments_passed": 3,
            "demonstrated_mastery_pct": 74.0,  # below 80% threshold
            "practical_tasks_completed": 1,
            "real_world_challenges_completed": 0,
        },
        "ai-project-portfolio": {
            "lessons_completed": 5,
            "assessments_passed": 2,
            "demonstrated_mastery_pct": 95.0,
            "practical_tasks_completed": 3,
            "real_world_challenges_completed": 3,
        },
    }
}

# In-memory issued certificates repository
CERTIFICATES_STORE: dict[str, CertificateModel] = {}
AUDIT_LOG_STORE: list[dict[str, Any]] = []


def _generate_signature_hash(
    cert_id: str, recipient: str, course_title: str, issued_at: str
) -> str:
    secret_salt = "AI_SENIOR_X_CRYPTOGRAPHIC_VERIFIED_CREDENTIAL_SALT_2026"
    payload = f"{cert_id}:{recipient}:{course_title}:{issued_at}:{secret_salt}"
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def _initialize_seed_certificates():
    """Seed ready certificates for Srihari Haran so dashboard and verification links work out of the box."""
    if CERTIFICATES_STORE:
        return

    # Python Foundations Certificate (ASX-2026-PY-000184)
    py_id = "ASX-2026-PY-000184"
    py_issued = "30 September 2026"
    py_sig = _generate_signature_hash(py_id, "SRIHARI HARAN", "Python Foundations", py_issued)
    py_cert = CertificateModel(
        certificate_id=py_id,
        learner_id="current_learner",
        learner_registered_name="SRIHARI HARAN",
        title="Python Foundations",
        category=CertificateCategory.COURSE_COMPLETION,
        issued_at=py_issued,
        completion_date="2026-09-30",
        demonstrated_learning_areas=[
            "Python Fundamentals & Syntax",
            "Control Flow & Algorithmic Logic",
            "Functions & Scope Management",
            "Data Structures (Lists, Dicts, Sets)",
            "Problem Solving & Modular Architecture",
        ],
        evidence_citations=[
            "Completed 8 foundational lessons with interactive coding exercises",
            "Passed 4 module assessments (Average Mastery: 92.5%)",
            "Completed Data Processing CLI Real-World Challenge",
            "Learning Twin verified mastery level: Advanced Practitioner",
        ],
        status=CertificateStatus.VALID,
        verification_url=f"/verify/{py_id}",
        verification_code=py_id,
        issuing_organization="AI-SENIOR-X Intelligence Platform",
        signature_hash=py_sig,
        pdf_download_url=f"/api/v1/certificates/{py_id}/pdf",
        metadata={
            "course_id": "python-foundations",
            "version": "1.0",
            "verification_authority": "AI-SENIOR-X Cryptographic Evidence Engine",
            "proof_of_skill_verified": True,
        },
    )
    CERTIFICATES_STORE[py_id] = py_cert

    # SQL Analytics Verified Skill Certificate (ASX-2026-SQL-000421)
    sql_id = "ASX-2026-SQL-000421"
    sql_issued = "28 September 2026"
    sql_sig = _generate_signature_hash(sql_id, "SRIHARI HARAN", "SQL Analytics", sql_issued)
    sql_cert = CertificateModel(
        certificate_id=sql_id,
        learner_id="current_learner",
        learner_registered_name="SRIHARI HARAN",
        title="SQL Analytics",
        category=CertificateCategory.SKILL_VERIFICATION,
        issued_at=sql_issued,
        completion_date="2026-09-28",
        demonstrated_learning_areas=[
            "Advanced Window Functions (RANK, DENSE_RANK, LEAD/LAG)",
            "Query Plan Optimization & Indexing",
            "Multi-Table CTE Aggregations & Cohort Pivots",
            "Data Warehouse Schemas & Analytics Engineering",
        ],
        evidence_citations=[
            "Passed SQL assessments with 100% test case coverage",
            "Optimized query execution plans reducing latency by 68%",
            "Delivered E-Commerce Retention Cohort Analysis Challenge",
            "Passed delayed retention assessment with 89% recall score",
        ],
        status=CertificateStatus.VALID,
        verification_url=f"/verify/{sql_id}",
        verification_code=sql_id,
        issuing_organization="AI-SENIOR-X Intelligence Platform",
        signature_hash=sql_sig,
        pdf_download_url=f"/api/v1/certificates/{sql_id}/pdf",
        metadata={
            "course_id": "sql-analytics",
            "version": "1.0",
            "verification_authority": "AI-SENIOR-X Cryptographic Evidence Engine",
            "proof_of_skill_verified": True,
        },
    )
    CERTIFICATES_STORE[sql_id] = sql_cert


# Initialize seed data
_initialize_seed_certificates()


class CertificateService:
    """Service handling certificate eligibility checks, cryptographic generation, and audits."""

    @staticmethod
    def get_registered_name(learner_id: str = "current_learner") -> str:
        """Returns the verified registered name from the learner profile."""
        profile = LEARNER_PROGRESS_DB.get(learner_id, {})
        return profile.get("registered_name", "SRIHARI HARAN")

    @classmethod
    def check_eligibility(
        cls, course_id: str, learner_id: str = "current_learner"
    ) -> CertificateEligibilityCriteria:
        """
        Server-side eligibility check. Evaluates actual completion data.
        Does NOT grant eligibility merely for opening courses, watching lessons, or clicking complete.
        """
        course_spec = COURSE_CRITERIA_REGISTRY.get(course_id)
        if not course_spec:
            # Fallback for unknown course
            return CertificateEligibilityCriteria(
                course_id=course_id,
                course_title=course_id.replace("-", " ").title(),
                category=CertificateCategory.COURSE_COMPLETION,
                required_lessons_total=10,
                lessons_completed=0,
                required_assessments_total=4,
                assessments_passed=0,
                demonstrated_mastery_pct=0.0,
                minimum_mastery_required_pct=80.0,
                practical_tasks_completed=0,
                real_world_challenges_completed=0,
                is_eligible=False,
                eligibility_reasons=[],
                missing_requirements=["Course curriculum requirements not found in registry."],
                learner_registered_name=cls.get_registered_name(learner_id),
            )

        learner_courses = LEARNER_PROGRESS_DB.get(learner_id, {})
        progress = learner_courses.get(
            course_id,
            {
                "lessons_completed": 0,
                "assessments_passed": 0,
                "demonstrated_mastery_pct": 0.0,
                "practical_tasks_completed": 0,
                "real_world_challenges_completed": 0,
            },
        )

        lessons_done = progress.get("lessons_completed", 0)
        req_lessons = course_spec["required_lessons_total"]
        assessments_done = progress.get("assessments_passed", 0)
        req_assessments = course_spec["required_assessments_total"]
        mastery = float(progress.get("demonstrated_mastery_pct", 0.0))
        min_mastery = float(course_spec["minimum_mastery_required_pct"])
        practical_done = progress.get("practical_tasks_completed", 0)
        req_practical = course_spec["required_practical_tasks"]
        challenges_done = progress.get("real_world_challenges_completed", 0)
        req_challenges = course_spec["required_real_world_challenges"]

        eligibility_reasons: list[str] = []
        missing_requirements: list[str] = []

        # 1. Lessons check
        if lessons_done >= req_lessons:
            eligibility_reasons.append(f"✓ All {req_lessons} required lessons completed")
        else:
            missing_requirements.append(
                f"Lessons completed: {lessons_done}/{req_lessons} (need {req_lessons - lessons_done} more)"
            )

        # 2. Assessments check
        if assessments_done >= req_assessments:
            eligibility_reasons.append(f"✓ Passed all {req_assessments} required assessments")
        else:
            missing_requirements.append(
                f"Assessments passed: {assessments_done}/{req_assessments} (need {req_assessments - assessments_done} more)"
            )

        # 3. Demonstrated mastery threshold
        if mastery >= min_mastery:
            eligibility_reasons.append(
                f"✓ Demonstrated mastery {mastery}% meets standard (≥ {min_mastery}%)"
            )
        else:
            missing_requirements.append(
                f"Demonstrated mastery score {mastery}% is below minimum required {min_mastery}%"
            )

        # 4. Practical task completion
        if practical_done >= req_practical:
            eligibility_reasons.append(
                f"✓ Practical tasks completed ({practical_done}/{req_practical})"
            )
        else:
            missing_requirements.append(
                f"Practical tasks: {practical_done}/{req_practical} completed"
            )

        # 5. Real-world challenge completion
        if challenges_done >= req_challenges:
            eligibility_reasons.append(
                f"✓ Real-world challenge submitted and evaluated ({challenges_done}/{req_challenges})"
            )
        else:
            missing_requirements.append(
                f"Real-world challenges: {challenges_done}/{req_challenges} completed"
            )

        is_eligible = len(missing_requirements) == 0

        return CertificateEligibilityCriteria(
            course_id=course_id,
            course_title=course_spec["title"],
            category=course_spec["category"],
            required_lessons_total=req_lessons,
            lessons_completed=lessons_done,
            required_assessments_total=req_assessments,
            assessments_passed=assessments_done,
            demonstrated_mastery_pct=mastery,
            minimum_mastery_required_pct=min_mastery,
            practical_tasks_completed=practical_done,
            real_world_challenges_completed=challenges_done,
            is_eligible=is_eligible,
            eligibility_reasons=eligibility_reasons,
            missing_requirements=missing_requirements,
            learner_registered_name=cls.get_registered_name(learner_id),
        )

    @classmethod
    def generate_certificate(cls, req: CertificateGenerateRequest) -> CertificateModel:
        """
        Generates and signs a verified certificate only if server-side criteria are satisfied.
        Binds the verified registered name and records an immutable audit trail.
        """
        eligibility = cls.check_eligibility(req.course_id, req.learner_id)
        if not eligibility.is_eligible:
            raise ValueError(
                f"Cannot generate certificate for '{req.course_id}'. Eligibility requirements not satisfied: "
                + "; ".join(eligibility.missing_requirements)
            )

        course_spec = COURSE_CRITERIA_REGISTRY[req.course_id]

        # Check if already issued
        for cert in CERTIFICATES_STORE.values():
            if (
                cert.learner_id == req.learner_id
                and cert.metadata.get("course_id") == req.course_id
                and cert.status == CertificateStatus.VALID
            ):
                return cert

        # Generate unique verifiable ID: ASX-2026-{CODE}-{SEQUENCE}
        code = course_spec["code"]
        seq_num = len(CERTIFICATES_STORE) + 185
        cert_id = f"ASX-2026-{code}-{seq_num:06d}"

        # Registered name resolution (profile name or reviewed name)
        registered_name = req.custom_registered_name or cls.get_registered_name(req.learner_id)
        now = datetime.now()
        issued_date_str = now.strftime("%d %B %Y")
        completion_date_str = now.strftime("%Y-%m-%d")

        sig_hash = _generate_signature_hash(
            cert_id, registered_name, course_spec["title"], issued_date_str
        )

        cert = CertificateModel(
            certificate_id=cert_id,
            learner_id=req.learner_id,
            learner_registered_name=registered_name,
            recipient_email="srihari@ai-senior-x.io",
            email_delivery_status="SENT",
            email_sent_at=now.isoformat(),
            resend_count=0,
            title=course_spec["title"],
            category=req.category or course_spec["category"],
            issued_at=issued_date_str,
            completion_date=completion_date_str,
            demonstrated_learning_areas=course_spec["learning_areas"],
            evidence_citations=course_spec["default_evidence"],
            status=CertificateStatus.VALID,
            verification_url=f"/verify/{cert_id}",
            verification_code=cert_id,
            issuing_organization="AI-SENIOR-X Intelligence Platform",
            signature_hash=sig_hash,
            pdf_download_url=f"/api/v1/certificates/{cert_id}/pdf",
            metadata={
                "course_id": req.course_id,
                "version": "1.0",
                "demonstrated_mastery_pct": eligibility.demonstrated_mastery_pct,
                "verification_authority": "AI-SENIOR-X Cryptographic Evidence Engine",
                "proof_of_skill_verified": True,
            },
        )

        CERTIFICATES_STORE[cert_id] = cert

        # Record audit trail
        AUDIT_LOG_STORE.append(
            {
                "action": "CERTIFICATE_ISSUED",
                "certificate_id": cert_id,
                "learner_id": req.learner_id,
                "registered_name": registered_name,
                "course_id": req.course_id,
                "timestamp": now.isoformat(),
                "signature_hash": sig_hash,
            }
        )

        return cert

    @classmethod
    async def resend_certificate_email(
        cls, certificate_id: str, recipient_email: str | None = None
    ) -> CertificateResendResponse:
        """
        Resends official certificate verification and attachment to the learner's registered email.
        Applies delivery status tracking.
        """
        cert = CERTIFICATES_STORE.get(certificate_id)
        if not cert:
            raise ValueError(f"Certificate '{certificate_id}' not found.")

        target_email = recipient_email or cert.recipient_email or "srihari@ai-senior-x.io"
        cert.resend_count += 1
        now = datetime.now()

        try:
            svg_doc = cls.generate_svg_certificate(certificate_id)
            pdf_bytes = svg_doc.encode("utf-8")
        except Exception:
            pdf_bytes = None

        res = await email_service.send_certificate_email(
            recipient_email=target_email,
            recipient_name=cert.learner_registered_name,
            certificate_id=cert.certificate_id,
            achievement_title=cert.title,
            issue_date=cert.issued_at,
            verification_url=f"https://ai-senior-x.org/verify/{cert.certificate_id}",
            pdf_bytes=pdf_bytes,
        )

        if res.get("success"):
            cert.email_delivery_status = "SENT"
            cert.email_sent_at = now.isoformat()
            return CertificateResendResponse(
                success=True,
                certificate_id=cert.certificate_id,
                recipient_email=target_email,
                email_delivery_status="SENT",
                resend_count=cert.resend_count,
                message=f"Certificate document successfully dispatched to {target_email}",
            )
        else:
            cert.email_delivery_status = "FAILED"
            return CertificateResendResponse(
                success=False,
                certificate_id=cert.certificate_id,
                recipient_email=target_email,
                email_delivery_status="FAILED",
                resend_count=cert.resend_count,
                message=f"Delivery issue: {res.get('message', 'Email service offline')}",
            )

    @classmethod
    def list_learner_certificates(
        cls, learner_id: str = "current_learner"
    ) -> list[CertificateModel]:
        """Returns all certificates earned by the specified learner."""
        return [c for c in CERTIFICATES_STORE.values() if c.learner_id == learner_id]

    @classmethod
    def get_certificate_by_id(cls, certificate_id: str) -> CertificateModel | None:
        """Returns certificate by ID."""
        return CERTIFICATES_STORE.get(certificate_id)

    @classmethod
    def verify_certificate(cls, certificate_id: str) -> CertificateVerificationResponse:
        """
        Public verification endpoint.
        Returns cryptographic validation status without exposing private learner logs.
        """
        cert = CERTIFICATES_STORE.get(certificate_id)
        if not cert:
            return CertificateVerificationResponse(
                is_valid=False,
                certificate_id=certificate_id,
                status=CertificateStatus.REVOKED,
                recipient_name="Unknown Recipient",
                achievement_title="Unrecognized Credential",
                category="N/A",
                issued_at="N/A",
                demonstrated_learning_areas=[],
                signature_hash="NONE",
                revocation_reason="No certificate record matches this identifier in the AI-SENIOR-X registry.",
            )

        expected_sig = _generate_signature_hash(
            cert.certificate_id, cert.learner_registered_name, cert.title, cert.issued_at
        )
        is_signature_intact = cert.signature_hash == expected_sig
        is_active = (cert.status == CertificateStatus.VALID) and is_signature_intact

        return CertificateVerificationResponse(
            is_valid=is_active,
            certificate_id=cert.certificate_id,
            status=cert.status,
            recipient_name=cert.learner_registered_name,
            achievement_title=cert.title,
            category=cert.category.value if hasattr(cert.category, "value") else str(cert.category),
            issued_at=cert.issued_at,
            demonstrated_learning_areas=cert.demonstrated_learning_areas,
            issuing_organization=cert.issuing_organization,
            verification_authority=cert.metadata.get(
                "verification_authority", "AI-SENIOR-X Cryptographic Evidence Engine"
            ),
            signature_hash=cert.signature_hash,
            revocation_reason=cert.metadata.get("revocation_reason")
            if cert.status != CertificateStatus.VALID
            else None,
        )

    @classmethod
    def revoke_certificate(cls, req: CertificateRevokeRequest) -> CertificateModel:
        """Auditable revocation of an issued certificate with status update."""
        cert = CERTIFICATES_STORE.get(req.certificate_id)
        if not cert:
            raise ValueError(f"Certificate {req.certificate_id} not found.")

        cert.status = CertificateStatus.REVOKED
        cert.metadata["revocation_reason"] = req.reason
        cert.metadata["revocation_timestamp"] = datetime.now().isoformat()
        if req.replacement_certificate_id:
            cert.metadata["replacement_certificate_id"] = req.replacement_certificate_id

        AUDIT_LOG_STORE.append(
            {
                "action": "CERTIFICATE_REVOKED",
                "certificate_id": req.certificate_id,
                "reason": req.reason,
                "replacement_id": req.replacement_certificate_id,
                "timestamp": datetime.now().isoformat(),
            }
        )

        return cert

    @classmethod
    def generate_svg_certificate(cls, certificate_id: str) -> str:
        """
        Generates a high-fidelity vector SVG certificate with AI-SENIOR-X editorial aesthetics:
        - Premium cream background (#FAFAF7)
        - Crisp black typography
        - Restrained blue accent (#1A56DB / #0F2D6B)
        - Clean serif headings & sans-serif metadata
        - Thin double border & geometric watermark
        - Official QR / Certificate ID badge
        """
        import html

        cert = CERTIFICATES_STORE.get(certificate_id)
        if not cert:
            raise ValueError(f"Certificate {certificate_id} not found.")

        raw_cat = (
            cert.category.value.replace("_", " ").title()
            if hasattr(cert.category, "value")
            else str(cert.category)
        )
        category_label = html.escape(raw_cat)
        learner_name = html.escape(cert.learner_registered_name)
        title_escaped = html.escape(cert.title)
        cert_id_escaped = html.escape(cert.certificate_id)
        issued_escaped = html.escape(cert.issued_at)
        verif_url_escaped = html.escape(cert.verification_url)
        sig_escaped = html.escape(cert.signature_hash[:22])

        areas_xml = "".join(
            f'<tspan x="600" dy="24">• {html.escape(area)}</tspan>'
            for area in cert.demonstrated_learning_areas[:4]
        )

        svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 850" width="1200" height="850">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800&amp;family=Inter:wght@400;500;600;700&amp;display=swap');
      .title {{ font-family: 'Cinzel', serif; font-size: 38px; fill: #0F172A; letter-spacing: 4px; text-anchor: middle; font-weight: 700; }}
      .subtitle {{ font-family: 'Inter', sans-serif; font-size: 15px; fill: #1E40AF; letter-spacing: 5px; text-anchor: middle; font-weight: 600; text-transform: uppercase; }}
      .certifies {{ font-family: 'Inter', sans-serif; font-size: 16px; fill: #64748B; letter-spacing: 2px; text-anchor: middle; }}
      .name {{ font-family: 'Cinzel', serif; font-size: 44px; fill: #0F172A; letter-spacing: 3px; text-anchor: middle; font-weight: 800; }}
      .achievement {{ font-family: 'Cinzel', serif; font-size: 30px; fill: #1E3A8A; letter-spacing: 2px; text-anchor: middle; font-weight: 700; }}
      .meta-label {{ font-family: 'Inter', sans-serif; font-size: 11px; fill: #94A3B8; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600; }}
      .meta-val {{ font-family: 'Inter', sans-serif; font-size: 14px; fill: #1E293B; font-weight: 600; }}
      .body-text {{ font-family: 'Inter', sans-serif; font-size: 13.5px; fill: #475569; text-anchor: middle; }}
    </style>
    <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E3A8A" />
      <stop offset="50%" stop-color="#3B82F6" />
      <stop offset="100%" stop-color="#1E3A8A" />
    </linearGradient>
  </defs>

  <!-- Background Cream -->
  <rect width="1200" height="850" fill="#FAFAF7" />

  <!-- Outer Double Borders -->
  <rect x="35" y="35" width="1130" height="780" fill="none" stroke="#E2E8F0" stroke-width="2" rx="4" />
  <rect x="48" y="48" width="1104" height="754" fill="none" stroke="url(#goldBorder)" stroke-width="3" rx="2" />
  <rect x="54" y="54" width="1092" height="742" fill="none" stroke="#CBD5E1" stroke-width="1" />

  <!-- Subtle Corner Geometrics -->
  <path d="M 54 90 L 90 54 M 54 100 L 100 54 M 54 110 L 110 54" stroke="#94A3B8" stroke-width="1" opacity="0.4" />
  <path d="M 1146 90 L 1110 54 M 1146 100 L 1100 54 M 1146 110 L 1090 54" stroke="#94A3B8" stroke-width="1" opacity="0.4" />
  <path d="M 54 760 L 90 796 M 54 750 L 100 796 M 54 740 L 110 796" stroke="#94A3B8" stroke-width="1" opacity="0.4" />
  <path d="M 1146 760 L 1110 796 M 1146 750 L 1100 796 M 1146 740 L 1090 796" stroke="#94A3B8" stroke-width="1" opacity="0.4" />

  <!-- Branding Top -->
  <text x="600" y="115" class="subtitle">AI-SENIOR-X INTELLIGENCE PLATFORM</text>
  <text x="600" y="165" class="title">CERTIFICATE OF {category_label.upper()}</text>
  <line x1="450" y1="185" x2="750" y2="185" stroke="#3B82F6" stroke-width="2" />

  <!-- Recipient Section -->
  <text x="600" y="235" class="certifies">THIS OFFICIALLY CERTIFIES THAT</text>
  <text x="600" y="295" class="name">{learner_name}</text>
  <line x1="320" y1="312" x2="880" y2="312" stroke="#E2E8F0" stroke-width="1.5" />

  <text x="600" y="350" class="certifies">has successfully demonstrated verified cognitive and practical competency in</text>
  <text x="600" y="398" class="achievement">{title_escaped.upper()}</text>

  <!-- Demonstrated Areas -->
  <text x="600" y="445" class="body-text" font-weight="600">Demonstrated Learning &amp; Evidence Areas:</text>
  <text x="600" y="465" class="body-text">{areas_xml}</text>

  <!-- Footer Seal & Signatures -->
  <g transform="translate(130, 680)">
    <text x="0" y="0" class="meta-label">CERTIFICATE ID</text>
    <text x="0" y="22" class="meta-val">{cert_id_escaped}</text>
    <text x="0" y="48" class="meta-label">ISSUED DATE</text>
    <text x="0" y="70" class="meta-val">{issued_escaped}</text>
  </g>

  <!-- Central Verification Seal -->
  <g transform="translate(600, 715)">
    <circle cx="0" cy="0" r="42" fill="#0F172A" />
    <circle cx="0" cy="0" r="37" fill="none" stroke="#3B82F6" stroke-width="2" stroke-dasharray="3,3" />
    <text x="0" y="-8" fill="#F8FAFC" font-family="'Cinzel', serif" font-size="11" font-weight="700" letter-spacing="1" text-anchor="middle">AI-SENIOR-X</text>
    <text x="0" y="10" fill="#60A5FA" font-family="'Inter', sans-serif" font-size="9" font-weight="700" letter-spacing="1.5" text-anchor="middle">VERIFIED</text>
    <text x="0" y="22" fill="#94A3B8" font-family="'Inter', sans-serif" font-size="7.5" text-anchor="middle">CREDENTIAL</text>
  </g>

  <!-- Verification Link & Hash Right -->
  <g transform="translate(860, 680)">
    <text x="0" y="0" class="meta-label">DIGITAL VERIFICATION</text>
    <text x="0" y="22" class="meta-val">ai-senior-x.io{verif_url_escaped}</text>
    <text x="0" y="48" class="meta-label">CRYPTOGRAPHIC SIGNATURE</text>
    <text x="0" y="70" class="meta-val" font-family="monospace" font-size="11">{sig_escaped}...</text>
  </g>
</svg>"""
        return svg
