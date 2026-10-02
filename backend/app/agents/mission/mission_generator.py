"""AI-SENIOR-X Mission & Quest Generator."""

import uuid

from pydantic import BaseModel, Field


class MissionTask(BaseModel):
    """Sub-task within a learning mission."""

    task_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    action_type: str  # lesson, practice, assessment, project
    is_completed: bool = False
    xp_reward: int = 50


class LearningMission(BaseModel):
    """Complete gamified learning mission or capstone quest."""

    mission_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    subject: str
    topic_id: str
    difficulty_level: str
    estimated_duration_minutes: int
    tasks: list[MissionTask]
    total_xp_reward: int
    badge_name: str | None = None
    status: str = "active"  # active, completed, abandoned


class MissionGenerator:
    """Generates cohesive multi-step learning missions linked to learner goals and mastery needs."""

    @classmethod
    def generate_mission_for_topic(
        cls,
        topic_id: str,
        topic_name: str,
        subject: str = "AI/ML",
        difficulty_level: str = "Intermediate",
    ) -> LearningMission:
        """Create structured multi-step mission."""
        tasks = [
            MissionTask(
                title=f"1. Foundations: Deep Dive into {topic_name}",
                description=f"Engage in an interactive Socratic session on {topic_name} mechanics.",
                action_type="lesson",
                xp_reward=50,
            ),
            MissionTask(
                title=f"2. Practice: Solve 2 Interactive {topic_name} Challenges",
                description="Write and debug implementation code covering core algorithms.",
                action_type="practice",
                xp_reward=100,
            ),
            MissionTask(
                title=f"3. Assessment: Pass the {topic_name} Mastery Checkpoint",
                description="Achieve >= 80% on adaptive conceptual and applied questions.",
                action_type="assessment",
                xp_reward=150,
            ),
        ]

        total_xp = sum(t.xp_reward for t in tasks) + 100  # Bonus for completion

        return LearningMission(
            title=f"Mission: Master {topic_name}",
            description=f"Complete foundational concepts, interactive coding practice, and diagnostic evaluation in {topic_name}.",
            subject=subject,
            topic_id=topic_id,
            difficulty_level=difficulty_level,
            estimated_duration_minutes=45,
            tasks=tasks,
            total_xp_reward=total_xp,
            badge_name=f"{topic_name} Specialist",
        )
