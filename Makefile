.PHONY: help install dev-backend dev-frontend test lint format typecheck migrate seed docker-up docker-down clean

help:
	@echo "AI-SENIOR-X Development Commands"
	@echo "================================"
	@echo "  make install        Install backend and frontend dependencies"
	@echo "  make dev-backend    Run backend development server (FastAPI)"
	@echo "  make dev-frontend   Run frontend development server (Next.js)"
	@echo "  make test           Run backend test suite with pytest"
	@echo "  make lint           Run ruff linting"
	@echo "  make format         Run ruff code formatter"
	@echo "  make typecheck      Run mypy static type checking"
	@echo "  make migrate        Run Alembic database migrations"
	@echo "  make seed           Seed initial curriculum and demo data"
	@echo "  make docker-up      Start containerized services (DB, backend, frontend)"
	@echo "  make docker-down    Stop containerized services"
	@echo "  make clean          Clean temporary files, build caches, and test artifacts"

install:
	pip install -e ".[dev]"
	cd frontend && npm install

dev-backend:
	python -m uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000

dev-frontend:
	cd frontend && npm run dev

test:
	python -m pytest backend/tests -v --cov=backend/app --cov-report=term-missing

lint:
	python -m ruff check backend

format:
	python -m ruff format backend

typecheck:
	python -m mypy backend/app

migrate:
	cd backend && alembic upgrade head

seed:
	python scripts/seed_database.py

docker-up:
	docker compose up -d --build

docker-down:
	docker compose down

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".ruff_cache" -exec rm -rf {} + 2>/dev/null || true
	rm -rf .coverage htmlcov build dist *.egg-info
