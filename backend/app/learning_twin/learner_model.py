"""AI-SENIOR-X Composite Learner Twin Model."""

from typing import Any

from pydantic import BaseModel, Field

from backend.app.learning_twin.decay_model import ConceptRetention
from backend.app.learning_twin.knowledge_state import KnowledgeState
from backend.app.learning_twin.learning_history import LearningHistory
from backend.app.learning_twin.misconception_state import MisconceptionState
from backend.app.learning_twin.preference_model import PreferenceModel
from backend.app.learning_twin.skill_graph import SkillGraph


class LearnerTwin(BaseModel):
    """The central cognitive model representing an individual learner."""

    learner_id: str
    user_id: str
    knowledge_state: KnowledgeState = Field(default_factory=KnowledgeState)
    misconception_state: MisconceptionState = Field(default_factory=MisconceptionState)
    history: LearningHistory = Field(default_factory=LearningHistory)
    preferences: PreferenceModel = Field(default_factory=PreferenceModel)
    retention_map: dict[str, ConceptRetention] = Field(default_factory=dict)
    cognitive_twin_metadata: dict[str, Any] = Field(default_factory=dict)

    def get_skill_graph(self) -> SkillGraph:
        """Instantiate and synchronize skill graph from current knowledge state."""
        sg = SkillGraph()
        sg.sync_from_knowledge_state(self.knowledge_state)
        return sg

    def get_summary(self) -> dict[str, Any]:
        """Return high-level summary of the cognitive twin state."""
        sg = self.get_skill_graph()
        return {
            "learner_id": self.learner_id,
            "user_id": self.user_id,
            "total_concepts_tracked": len(self.knowledge_state.concepts),
            "subject_mastery": self.knowledge_state.subject_mastery,
            "active_misconceptions": len(self.misconception_state.active_misconceptions),
            "total_events_logged": len(self.history.events),
            "strongest_skills": [s.skill_name for s in sg.get_strongest_skills(3)],
            "weakest_skills": [s.skill_name for s in sg.get_weakest_skills(3)],
            "preferred_session_minutes": self.preferences.preferred_session_minutes,
        }


class LearnerCognitiveSnapshot(BaseModel):
    """Immutable snapshot representation of the learner twin state."""

    learner_id: str
    mastery_levels: dict[str, float] = Field(default_factory=dict)
    active_misconceptions: list[Any] = Field(default_factory=list)
    preferred_learning_style: str = "visual_interactive"
    history: list[Any] = Field(default_factory=list)
    summary: dict[str, Any] = Field(default_factory=dict)
