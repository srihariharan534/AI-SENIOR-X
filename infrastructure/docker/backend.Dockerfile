# ==============================================================================
# AI-SENIOR-X Backend Dockerfile (Multi-stage / Production-ready)
# ==============================================================================
FROM python:3.11-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy project configuration, docs, and source code
COPY pyproject.toml README.md ./
COPY backend/ ./backend/
COPY scripts/ ./scripts/
COPY data/ ./data/

RUN pip install --upgrade pip && \
    pip install .

# Create a non-privileged user for security
RUN useradd -u 1000 -m appuser && \
    chown -R appuser:appuser /app
USER appuser

ENV PYTHONPATH="/app"

EXPOSE 8000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/api/v1/health || exit 1

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
