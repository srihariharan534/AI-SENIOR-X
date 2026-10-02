"""0001_initial_foundation

Revision ID: 0001_initial_foundation
Revises: 
Create Date: 2026-09-30 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "0001_initial_foundation"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. users table
    op.create_table(
        "users",
        sa.Column("id", sa.String(length=36), primary_key=True, nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=50), nullable=False, server_default="learner"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("is_verified", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)
    op.create_index(op.f("ix_users_role"), "users", ["role"], unique=False)

    # 2. learner_profiles table
    op.create_table(
        "learner_profiles",
        sa.Column("id", sa.String(length=36), primary_key=True, nullable=False),
        sa.Column("user_id", sa.String(length=36), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("grade_level", sa.String(length=50), nullable=False, server_default="undergraduate"),
        sa.Column("preferred_language", sa.String(length=20), nullable=False, server_default="en"),
        sa.Column("learning_style", sa.String(length=50), nullable=False, server_default="visual_interactive"),
        sa.Column("target_goals", sa.JSON(), nullable=False),
        sa.Column("mastery_scores", sa.JSON(), nullable=False),
        sa.Column("cognitive_twin_state", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f("ix_learner_profiles_id"), "learner_profiles", ["id"], unique=False)
    op.create_index(op.f("ix_learner_profiles_user_id"), "learner_profiles", ["user_id"], unique=True)

    # 3. learning_sessions table
    op.create_table(
        "learning_sessions",
        sa.Column("id", sa.String(length=36), primary_key=True, nullable=False),
        sa.Column("learner_profile_id", sa.String(length=36), sa.ForeignKey("learner_profiles.id", ondelete="CASCADE"), nullable=False),
        sa.Column("topic", sa.String(length=255), nullable=False),
        sa.Column("session_type", sa.String(length=50), nullable=False, server_default="tutoring"),
        sa.Column("status", sa.String(length=50), nullable=False, server_default="active"),
        sa.Column("session_metadata", sa.JSON(), nullable=False),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f("ix_learning_sessions_id"), "learning_sessions", ["id"], unique=False)
    op.create_index(op.f("ix_learning_sessions_learner_profile_id"), "learning_sessions", ["learner_profile_id"], unique=False)
    op.create_index(op.f("ix_learning_sessions_topic"), "learning_sessions", ["topic"], unique=False)
    op.create_index(op.f("ix_learning_sessions_status"), "learning_sessions", ["status"], unique=False)

    # 4. assessments table
    op.create_table(
        "assessments",
        sa.Column("id", sa.String(length=36), primary_key=True, nullable=False),
        sa.Column("learner_profile_id", sa.String(length=36), sa.ForeignKey("learner_profiles.id", ondelete="CASCADE"), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("subject", sa.String(length=100), nullable=False),
        sa.Column("difficulty", sa.String(length=50), nullable=False, server_default="intermediate"),
        sa.Column("status", sa.String(length=50), nullable=False, server_default="draft"),
        sa.Column("total_score", sa.Float(), nullable=False, server_default="0.0"),
        sa.Column("max_score", sa.Float(), nullable=False, server_default="100.0"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f("ix_assessments_id"), "assessments", ["id"], unique=False)
    op.create_index(op.f("ix_assessments_learner_profile_id"), "assessments", ["learner_profile_id"], unique=False)
    op.create_index(op.f("ix_assessments_subject"), "assessments", ["subject"], unique=False)
    op.create_index(op.f("ix_assessments_status"), "assessments", ["status"], unique=False)

    # 5. questions table
    op.create_table(
        "questions",
        sa.Column("id", sa.String(length=36), primary_key=True, nullable=False),
        sa.Column("assessment_id", sa.String(length=36), sa.ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("prompt", sa.Text(), nullable=False),
        sa.Column("question_type", sa.String(length=50), nullable=False, server_default="multiple_choice"),
        sa.Column("options", sa.JSON(), nullable=False),
        sa.Column("correct_answer", sa.Text(), nullable=False),
        sa.Column("explanation", sa.Text(), nullable=False, server_default=""),
        sa.Column("points", sa.Float(), nullable=False, server_default="10.0"),
        sa.Column("difficulty", sa.String(length=50), nullable=False, server_default="medium"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f("ix_questions_id"), "questions", ["id"], unique=False)
    op.create_index(op.f("ix_questions_assessment_id"), "questions", ["assessment_id"], unique=False)

    # 6. answers table
    op.create_table(
        "answers",
        sa.Column("id", sa.String(length=36), primary_key=True, nullable=False),
        sa.Column("question_id", sa.String(length=36), sa.ForeignKey("questions.id", ondelete="CASCADE"), nullable=False),
        sa.Column("learner_profile_id", sa.String(length=36), sa.ForeignKey("learner_profiles.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_response", sa.Text(), nullable=False),
        sa.Column("is_correct", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("score_awarded", sa.Float(), nullable=False, server_default="0.0"),
        sa.Column("feedback", sa.Text(), nullable=False, server_default=""),
        sa.Column("response_time_seconds", sa.Float(), nullable=False, server_default="0.0"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f("ix_answers_id"), "answers", ["id"], unique=False)
    op.create_index(op.f("ix_answers_question_id"), "answers", ["question_id"], unique=False)
    op.create_index(op.f("ix_answers_learner_profile_id"), "answers", ["learner_profile_id"], unique=False)

    # 7. misconceptions table
    op.create_table(
        "misconceptions",
        sa.Column("id", sa.String(length=36), primary_key=True, nullable=False),
        sa.Column("learner_profile_id", sa.String(length=36), sa.ForeignKey("learner_profiles.id", ondelete="CASCADE"), nullable=False),
        sa.Column("concept_key", sa.String(length=100), nullable=False),
        sa.Column("misconception_tag", sa.String(length=100), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("severity", sa.String(length=50), nullable=False, server_default="moderate"),
        sa.Column("status", sa.String(length=50), nullable=False, server_default="active"),
        sa.Column("detected_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("resolved_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f("ix_misconceptions_id"), "misconceptions", ["id"], unique=False)
    op.create_index(op.f("ix_misconceptions_learner_profile_id"), "misconceptions", ["learner_profile_id"], unique=False)
    op.create_index(op.f("ix_misconceptions_concept_key"), "misconceptions", ["concept_key"], unique=False)
    op.create_index(op.f("ix_misconceptions_status"), "misconceptions", ["status"], unique=False)

    # 8. progress table
    op.create_table(
        "progress",
        sa.Column("id", sa.String(length=36), primary_key=True, nullable=False),
        sa.Column("learner_profile_id", sa.String(length=36), sa.ForeignKey("learner_profiles.id", ondelete="CASCADE"), nullable=False),
        sa.Column("subject", sa.String(length=100), nullable=False),
        sa.Column("module_id", sa.String(length=100), nullable=False),
        sa.Column("mastery_level", sa.Float(), nullable=False, server_default="0.0"),
        sa.Column("completed_missions_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("streak_days", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("total_time_spent_minutes", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("last_activity_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f("ix_progress_id"), "progress", ["id"], unique=False)
    op.create_index(op.f("ix_progress_learner_profile_id"), "progress", ["learner_profile_id"], unique=False)
    op.create_index(op.f("ix_progress_subject"), "progress", ["subject"], unique=False)
    op.create_index(op.f("ix_progress_module_id"), "progress", ["module_id"], unique=False)


def downgrade() -> None:
    op.drop_table("progress")
    op.drop_table("misconceptions")
    op.drop_table("answers")
    op.drop_table("questions")
    op.drop_table("assessments")
    op.drop_table("learning_sessions")
    op.drop_table("learner_profiles")
    op.drop_table("users")
