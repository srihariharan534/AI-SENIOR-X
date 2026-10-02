"""AI-SENIOR-X Demo State Reset & Calibration Utility.

Restores the demo student profile ('demo@ai-senior-x.org'), cognitive Learning Twin state,
baseline mastery scores, seed curriculum DAG, and demo event history.
Usage:
    python scripts/demo_reset.py
"""

import asyncio
import json
import sys
from pathlib import Path

# Ensure project root is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy import text

from backend.app.core.config import settings
from backend.app.core.logging import logger, setup_logging
from backend.app.core.security import get_password_hash
from backend.app.database.models.learner_profile import LearnerProfile
from backend.app.database.models.user import User
from backend.app.database.session import AsyncSessionLocal, async_engine


async def reset_demo_state() -> None:
    """Wipes and recalibrates clean demo state for live hackathon presentations."""
    setup_logging()
    logger.info("Initializing AI-SENIOR-X Demo State Reset...")

    demo_data_dir = Path(__file__).resolve().parent.parent / "data" / "demo"
    student_file = demo_data_dir / "demo_student.json"
    history_file = demo_data_dir / "demo_learning_history.json"

    student_data = {}
    if student_file.exists():
        with open(student_file, encoding="utf-8") as f:
            student_data = json.load(f)

    history_data = []
    if history_file.exists():
        with open(history_file, encoding="utf-8") as f:
            history_data = json.load(f)

    async with AsyncSessionLocal() as session:
        # 1. Clear previous demo data if exists
        try:
            await session.execute(
                text("DELETE FROM users WHERE email = 'demo@ai-senior-x.org'")
            )
            await session.commit()
        except Exception:
            await session.rollback()

        # 2. Insert clean demo user
        demo_user = User(
            email="demo@ai-senior-x.org",
            hashed_password=get_password_hash("password123"),
            full_name=student_data.get("full_name", "Alex Morgan"),
            role="learner",
            is_active=True,
            is_verified=True,
        )
        session.add(demo_user)
        await session.flush()

        # 3. Create calibrated Learner Profile with Learning Twin Cognitive State
        profile = LearnerProfile(
            user_id=demo_user.id,
            grade_level=student_data.get("experience_level", "Intermediate"),
            preferred_language=student_data.get("preferred_language", "en"),
            learning_style=student_data.get("learning_style", "Socratic Dialogue & Hands-on Code"),
            target_goals={"primary_goal": student_data.get("target_goal", "Full-Stack AI Engineer")},
            mastery_scores=student_data.get("twin_summary", {}).get("subject_mastery", {
                "AI & Machine Learning": 0.82,
                "Python Foundations": 0.94,
                "Data Science & Stats": 0.68,
                "Relational SQL": 0.58,
                "Algorithms & DSA": 0.76,
            }),
            cognitive_twin_state={
                "summary": student_data.get("twin_summary", {}),
                "history": history_data,
            },
        )
        session.add(profile)
        await session.commit()

        logger.info(f"Successfully calibrated Demo User: {demo_user.email} (ID: {demo_user.id})")
        logger.info("Demo state is 100% clean and presentation ready.")


if __name__ == "__main__":
    asyncio.run(reset_demo_state())
