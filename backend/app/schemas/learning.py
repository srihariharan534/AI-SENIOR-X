"""Learning, Mission, and Recommendation schemas."""

from pydantic import BaseModel, Field


class CurriculumNode(BaseModel):
    """Represents a topic node within a learning pathway."""

    id: str
    title: str
    subject: str
    description: str
    difficulty: str = "intermediate"
    prerequisites: list[str] = Field(default_factory=list)
    estimated_minutes: int = 30
    skills: list[str] = Field(default_factory=list)


class LearningRecommendation(BaseModel):
    """Personalized learning recommendation from Recommendation Engine."""

    id: str
    title: str
    recommendation_type: str = "practice"  # review, mission, concept_deep_dive, practice
    reason: str
    target_concept: str
    priority: int = Field(1, ge=1, le=5)
    estimated_minutes: int = 15


class MissionRead(BaseModel):
    """Interactive learning mission/quest."""

    id: str
    title: str
    subject: str
    description: str
    xp_reward: int = 100
    objectives: list[str]
    is_completed: bool = False
