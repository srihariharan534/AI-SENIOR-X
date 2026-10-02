"""AI-SENIOR-X Database Seeding Script."""

import asyncio
import os
import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from backend.app.core.logging import logger, setup_logging
from backend.app.core.security import get_password_hash
from backend.app.database.session import AsyncSessionLocal, async_engine
from backend.app.database.models import (
    Assessment,
    Base,
    LearnerProfile,
    LearningSession,
    Misconception,
    Progress,
    Question,
    User,
)


async def seed() -> None:
    """Populate database with deterministic demo data and baseline curricula."""
    setup_logging()
    logger.info("Initializing database tables for seed execution...")

    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # 1. Create or verify Demo Learner User
        learner_email = "learner@ai-senior-x.io"
        user_stmt = await session.execute(
            User.__table__.select().where(User.email == learner_email)
        )
        existing_learner = user_stmt.first()

        if not existing_learner:
            logger.info("Creating demo learner user...")
            learner = User(
                email=learner_email,
                hashed_password=get_password_hash("Learner123!"),
                full_name="Alex Chen",
                role="learner",
                is_active=True,
                is_verified=True,
            )
            session.add(learner)
            await session.flush()

            profile = LearnerProfile(
                user_id=learner.id,
                grade_level="undergraduate",
                preferred_language="en",
                learning_style="visual_interactive",
                target_goals={
                    "primary_focus": "Mastering Artificial Intelligence & RAG",
                    "daily_target_minutes": 45,
                },
                mastery_scores={
                    "Computer Science": 0.85,
                    "Artificial Intelligence": 0.65,
                },
                cognitive_twin_state={
                    "knowledge_nodes_visited": 14,
                    "confidence_index": 0.78,
                    "curiosity_vector": [0.4, 0.9, 0.8],
                },
            )
            session.add(profile)
            await session.flush()

            # Seed Progress records
            progress_1 = Progress(
                learner_profile_id=profile.id,
                subject="Computer Science",
                module_id="py-101",
                mastery_level=0.85,
                completed_missions_count=2,
                streak_days=5,
                total_time_spent_minutes=120,
            )
            progress_2 = Progress(
                learner_profile_id=profile.id,
                subject="Artificial Intelligence",
                module_id="ai-201",
                mastery_level=0.65,
                completed_missions_count=1,
                streak_days=5,
                total_time_spent_minutes=90,
            )
            session.add_all([progress_1, progress_2])

            # Seed Misconception
            misconception = Misconception(
                learner_profile_id=profile.id,
                concept_key="Artificial Intelligence",
                misconception_tag="gradient_vanishing_vs_exploding",
                description="Confusion between causes of vanishing gradients vs exploding gradients in deep networks.",
                severity="moderate",
                status="active",
            )
            session.add(misconception)

            # Seed Sample Assessment & Questions
            assessment = Assessment(
                learner_profile_id=profile.id,
                title="AI & Python Diagnostic Assessment",
                subject="Artificial Intelligence",
                difficulty="intermediate",
                status="in_progress",
                total_score=0.0,
                max_score=20.0,
            )
            session.add(assessment)
            await session.flush()

            q1 = Question(
                assessment_id=assessment.id,
                prompt="Which activation function helps mitigate the vanishing gradient problem in deep neural networks?",
                question_type="multiple_choice",
                options={
                    "A": "Sigmoid",
                    "B": "Tanh",
                    "C": "ReLU",
                    "D": "Linear",
                },
                correct_answer="C",
                explanation="ReLU (Rectified Linear Unit) has a constant gradient of 1 for positive inputs, avoiding gradient saturation.",
                points=10.0,
                difficulty="medium",
            )
            q2 = Question(
                assessment_id=assessment.id,
                prompt="In a Retrieval-Augmented Generation (RAG) system, what is the primary purpose of semantic chunking?",
                question_type="multiple_choice",
                options={
                    "A": "To compress text into zip format",
                    "B": "To preserve contextual coherence within embedding tokens",
                    "C": "To encrypt user prompts",
                    "D": "To speed up SQL queries",
                },
                correct_answer="B",
                explanation="Semantic chunking keeps related thoughts and concepts together, enhancing vector similarity retrieval precision.",
                points=10.0,
                difficulty="medium",
            )
            session.add_all([q1, q2])

        # 2. Create or verify Demo Admin User
        admin_email = "admin@ai-senior-x.io"
        admin_stmt = await session.execute(
            User.__table__.select().where(User.email == admin_email)
        )
        existing_admin = admin_stmt.first()

        if not existing_admin:
            logger.info("Creating demo admin user...")
            admin = User(
                email=admin_email,
                hashed_password=get_password_hash("Admin123!"),
                full_name="Platform Administrator",
                role="admin",
                is_active=True,
                is_verified=True,
            )
            session.add(admin)

        await session.commit()
        logger.info("Database seeding completed successfully.")


if __name__ == "__main__":
    asyncio.run(seed())
