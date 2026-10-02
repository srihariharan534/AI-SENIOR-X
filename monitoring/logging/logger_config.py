"""Observability and Centralized Logger Configuration."""

import logging
from backend.app.core.logging import JSONFormatter, setup_logging


def get_configured_logger(name: str = "ai_senior_x.observability") -> logging.Logger:
    """Return a configured logger with standard JSON/console formatters."""
    setup_logging()
    return logging.getLogger(name)
