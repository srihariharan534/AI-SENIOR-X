"""
AI-SENIOR-X Production Email Delivery Service.
Handles transactional delivery for Verified Certificates, Attachments,
Password Resets, Welcome Emails, and Identity Verification.
"""

import logging
import os
import smtplib
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Any

logger = logging.getLogger("ai_senior_x.email_service")

# Environment configurations
EMAIL_PROVIDER = os.getenv("EMAIL_PROVIDER", "smtp")
SMTP_HOST = os.getenv("SMTP_HOST", "localhost")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "certificates@ai-senior-x.org")
FROM_NAME = os.getenv("FROM_NAME", "AI-SENIOR-X Intelligence Platform")


class EmailService:
    """Service handling transactional email delivery with PDF attachments and failover safety."""

    def __init__(self):
        self.provider = EMAIL_PROVIDER
        self.host = SMTP_HOST
        self.port = SMTP_PORT
        self.username = SMTP_USERNAME
        self.password = SMTP_PASSWORD
        self.from_email = FROM_EMAIL
        self.from_name = FROM_NAME

    async def send_certificate_email(
        self,
        recipient_email: str,
        recipient_name: str,
        certificate_id: str,
        achievement_title: str,
        issue_date: str,
        verification_url: str,
        pdf_bytes: bytes | None = None,
    ) -> dict[str, Any]:
        """
        Send official certificate issuance email with attached certificate document.
        Never crashes certificate generation even if SMTP server is offline.
        """
        subject = f"Your AI-SENIOR-X Certificate — {achievement_title}"

        body_text = f"""Hello {recipient_name},

Congratulations!

You have successfully completed:
{achievement_title}

Your verified certificate has been issued by AI-SENIOR-X.

Certificate ID: {certificate_id}
Issue Date: {issue_date}

View & Verify Certificate:
{verification_url}

Your official certificate vector document is attached to this email.

Regards,
AI-SENIOR-X
Autonomous Learning Intelligence Platform
https://ai-senior-x.org
"""

        body_html = f"""
<!DOCTYPE html>
<html>
<head>
  <style>
    body {{ font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FAFAF7; color: #111827; padding: 24px; }}
    .card {{ max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; padding: 32px; }}
    .badge {{ display: inline-block; background: #EFF6FF; color: #1D4ED8; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; letter-spacing: 0.05em; }}
    h1 {{ font-family: Georgia, serif; font-size: 24px; margin: 16px 0 8px; color: #111827; }}
    .highlight {{ color: #1D4ED8; font-weight: bold; }}
    .details {{ background: #FAFAF7; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 13px; }}
    .btn {{ display: inline-block; background: #2563EB; color: #FFFFFF !important; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: 600; margin-top: 16px; }}
    .footer {{ margin-top: 32px; font-size: 11px; color: #9CA3AF; text-align: center; border-top: 1px solid #F3F4F6; padding-top: 16px; }}
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">VERIFIED ACHIEVEMENT</div>
    <h1>Certificate of Verified Mastery</h1>
    <p>Hello <strong>{recipient_name}</strong>,</p>
    <p>Congratulations! You have successfully completed <span class="highlight">{achievement_title}</span> through demonstrated evidence and practical skill evaluation on AI-SENIOR-X.</p>

    <div class="details">
      <div><strong>Certificate ID:</strong> {certificate_id}</div>
      <div><strong>Issue Date:</strong> {issue_date}</div>
      <div><strong>Issuing Authority:</strong> AI-SENIOR-X Intelligence Engine</div>
      <div><strong>Recipient:</strong> {recipient_name}</div>
    </div>

    <a href="{verification_url}" class="btn">Verify & View Certificate Online</a>

    <p style="font-size: 12px; color: #6B7280; margin-top: 20px;">
      Your certificate document is attached to this email. You can share your unique verification link with employers and peers.
    </p>

    <div class="footer">
      AI-SENIOR-X // Autonomous Learning Intelligence Platform<br/>
      Cryptographically Signed Certificate Dispatch
    </div>
  </div>
</body>
</html>
"""

        return await self._dispatch_email(
            recipient_email=recipient_email,
            subject=subject,
            body_text=body_text,
            body_html=body_html,
            attachment_bytes=pdf_bytes,
            attachment_filename=f"{certificate_id}.svg" if pdf_bytes else None,
        )

    async def send_welcome_email(self, recipient_email: str, recipient_name: str) -> dict[str, Any]:
        """Send welcome message upon learner registration."""
        subject = "Welcome to AI-SENIOR-X — Your Learning Twin is Ready"
        body_text = f"""Hello {recipient_name},

Welcome to AI-SENIOR-X. Your autonomous Learning Twin has been initialized.

Explore curriculum tracks, resolve doubts with multimodal AI, and build verified skill evidence.

Get started: https://ai-senior-x.org/dashboard

Best,
The AI-SENIOR-X Team
"""
        return await self._dispatch_email(
            recipient_email=recipient_email,
            subject=subject,
            body_text=body_text,
        )

    async def send_password_reset_email(
        self, recipient_email: str, reset_token: str
    ) -> dict[str, Any]:
        """Send secure password reset token."""
        reset_url = f"https://ai-senior-x.org/reset-password?token={reset_token}"
        subject = "AI-SENIOR-X Password Reset Request"
        body_text = f"""Hello,

We received a request to reset your password. Use the link below or enter your reset token in the recovery portal:

Reset Link: {reset_url}
Token: {reset_token}

This token will expire in 1 hour. If you did not request this, you can ignore this message.

Regards,
AI-SENIOR-X Security
"""
        return await self._dispatch_email(
            recipient_email=recipient_email,
            subject=subject,
            body_text=body_text,
        )

    async def send_verification_email(
        self, recipient_email: str, verification_token: str
    ) -> dict[str, Any]:
        """Send email verification link."""
        verify_url = f"https://ai-senior-x.org/verify-email?token={verification_token}"
        subject = "Verify Your AI-SENIOR-X Email Address"
        body_text = f"""Hello,

Please verify your email address to enable certificate delivery:

Verification Link: {verify_url}
Token: {verification_token}

Regards,
AI-SENIOR-X Identity Service
"""
        return await self._dispatch_email(
            recipient_email=recipient_email,
            subject=subject,
            body_text=body_text,
        )

    async def _dispatch_email(
        self,
        recipient_email: str,
        subject: str,
        body_text: str,
        body_html: str | None = None,
        attachment_bytes: bytes | None = None,
        attachment_filename: str | None = None,
    ) -> dict[str, Any]:
        """Underlying dispatcher handling SMTP or graceful sandbox logging."""
        logger.info(
            f"[EmailService] Dispatching email to '{recipient_email}' with subject: '{subject}'"
        )

        # If SMTP is not actively configured in local/test environment, simulate reliable delivery
        if not self.username or self.host == "localhost":
            logger.info(
                f"[EmailService MOCK/SANDBOX] Simulated successful dispatch to {recipient_email}"
            )
            return {
                "success": True,
                "status": "SENT",
                "recipient": recipient_email,
                "provider": "sandbox",
                "attachment_included": bool(attachment_bytes),
                "message": f"Email successfully dispatched to {recipient_email}",
            }

        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"{self.from_name} <{self.from_email}>"
            msg["To"] = recipient_email

            msg.attach(MIMEText(body_text, "plain"))
            if body_html:
                msg.attach(MIMEText(body_html, "html"))

            if attachment_bytes and attachment_filename:
                part = MIMEApplication(attachment_bytes)
                part.add_header("Content-Disposition", "attachment", filename=attachment_filename)
                msg.attach(part)

            with smtplib.SMTP(self.host, self.port, timeout=10) as server:
                server.starttls()
                server.login(self.username, self.password)
                server.send_message(msg)

            return {
                "success": True,
                "status": "SENT",
                "recipient": recipient_email,
                "provider": "smtp",
                "message": f"Email successfully sent via SMTP to {recipient_email}",
            }
        except Exception as e:
            logger.warning(f"[EmailService Error] Failed to send email via SMTP: {str(e)}")
            return {
                "success": False,
                "status": "FAILED",
                "recipient": recipient_email,
                "error": str(e),
                "message": f"SMTP dispatch failed: {str(e)}",
            }


# Singleton instance
email_service = EmailService()
