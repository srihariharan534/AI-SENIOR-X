"""AI-SENIOR-X Structured & Privacy-Preserving Logging Configuration."""

import json
import logging
import re
import sys
from datetime import UTC, datetime
from typing import Any

from backend.app.core.config import settings

# Sensitive keyword masking patterns
SENSITIVE_PATTERNS = [
    (
        re.compile(r'(password["\']?\s*[:=]\s*["\'])([^"\']+)(["\'])', re.IGNORECASE),
        r"\1***REDACTED***\3",
    ),
    (
        re.compile(
            r"(Bearer\s+)([A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*)", re.IGNORECASE
        ),
        r"\1***TOKEN_REDACTED***",
    ),
    (
        re.compile(r'(api[_-]?key["\']?\s*[:=]\s*["\'])([^"\']+)(["\'])', re.IGNORECASE),
        r"\1***API_KEY_REDACTED***\3",
    ),
    (
        re.compile(r'(secret["\']?\s*[:=]\s*["\'])([^"\']+)(["\'])', re.IGNORECASE),
        r"\1***SECRET_REDACTED***\3",
    ),
]


def sanitize_log_message(message: str) -> str:
    """Mask sensitive credentials, tokens, and keys from log strings."""
    sanitized = message
    for pattern, replacement in SENSITIVE_PATTERNS:
        sanitized = pattern.sub(replacement, sanitized)
    return sanitized


class JSONFormatter(logging.Formatter):
    """Custom JSON formatter for structured logging in production."""

    def format(self, record: logging.LogRecord) -> str:
        raw_msg = record.getMessage()
        sanitized_msg = sanitize_log_message(raw_msg)

        log_entry: dict[str, Any] = {
            "timestamp": datetime.now(UTC).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": sanitized_msg,
            "module": record.module,
            "line": record.lineno,
        }
        if hasattr(record, "request_id"):
            log_entry["request_id"] = record.request_id
        if record.exc_info:
            log_entry["exception"] = sanitize_log_message(self.formatException(record.exc_info))
        return json.dumps(log_entry)


class PrivacyConsoleFormatter(logging.Formatter):
    """Console formatter with sensitive credential masking."""

    def format(self, record: logging.LogRecord) -> str:
        record.msg = sanitize_log_message(str(record.msg))
        return super().format(record)


def setup_logging() -> None:
    """Configures structured and sanitized logging for the application."""
    log_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)

    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)

    # Remove existing handlers
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(log_level)

    if settings.LOG_FORMAT.lower() == "json" and not settings.DEBUG:
        formatter = JSONFormatter()
    else:
        formatter = PrivacyConsoleFormatter(
            fmt="%(asctime)s [%(levelname)s] [%(name)s]: %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )

    console_handler.setFormatter(formatter)
    root_logger.addHandler(console_handler)

    # Quiet external verbose loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)


logger = logging.getLogger("ai_senior_x")
