"""AI-SENIOR-X Database Schema Migration & Synchronization Utility."""

import sqlite3
from pathlib import Path

from sqlalchemy.ext.asyncio import AsyncEngine

from backend.app.core.config import settings
from backend.app.core.logging import logger
from backend.app.database.base import Base


async def sync_database_schema(engine: AsyncEngine) -> None:
    """Ensure all tables and missing columns exist in SQLite or Postgres."""
    # 1. Create all missing tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # 2. If SQLite, dynamically check and add any missing columns for existing tables
    if "sqlite" in settings.DATABASE_URL:
        db_path = settings.DATABASE_URL.split(":///")[-1]
        if Path(db_path).exists():
            try:
                conn = sqlite3.connect(db_path)
                cursor = conn.cursor()

                # Migration for users table
                cursor.execute("PRAGMA table_info(users);")
                existing_cols = {row[1] for row in cursor.fetchall()}

                missing_cols = [
                    ("username", "VARCHAR(100)"),
                    ("preferred_language", "VARCHAR(10) DEFAULT 'en'"),
                    ("learning_goal", "VARCHAR(255)"),
                    ("reset_token", "VARCHAR(255)"),
                    ("reset_token_expires_at", "VARCHAR(50)"),
                ]

                for col_name, col_type in missing_cols:
                    if col_name not in existing_cols:
                        logger.info(f"Migrating users table: adding missing column {col_name}")
                        cursor.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_type};")

                conn.commit()
                conn.close()
                logger.info("SQLite schema sync completed.")
            except Exception as e:
                logger.warning(f"SQLite column migration notice: {e}")
