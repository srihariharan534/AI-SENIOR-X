"""AI-SENIOR-X Learner Skill Graph and Competency Index."""

from pydantic import BaseModel, Field

from backend.app.curriculum.curriculum_graph import CurriculumGraph, curriculum_graph
from backend.app.learning_twin.knowledge_state import KnowledgeState


class SkillCompetency(BaseModel):
    """Represents competence level on an applied skill."""

    skill_name: str
    subject: str
    mastery_estimate: float = Field(0.0, ge=0.0, le=1.0)
    associated_concepts: list[str] = Field(default_factory=list)
    is_blocked: bool = False
    blocking_prerequisite: str | None = None


class SkillGraph:
    """Manages skill competencies linked to curriculum knowledge nodes."""

    def __init__(self, curriculum: CurriculumGraph | None = None):
        self.curriculum = curriculum or curriculum_graph
        self._skills: dict[str, SkillCompetency] = {}

    def sync_from_knowledge_state(self, knowledge_state: KnowledgeState) -> None:
        """Derive skill proficiencies from current concept mastery values in the KnowledgeState."""
        for node in self.curriculum.list_nodes():
            # Check node readiness
            prereqs = self.curriculum.get_prerequisites(node.id)
            blocking_prereq: str | None = None
            is_blocked = False

            for p in prereqs:
                p_mastery = knowledge_state.subject_mastery.get(p.subject, 0.0)
                if p_mastery < 0.60:
                    is_blocked = True
                    blocking_prereq = p.name
                    break

            for skill in node.skills:
                # Estimate skill mastery from node concepts
                concept_scores: list[float] = []
                for c in node.concepts:
                    m = knowledge_state.get_concept_mastery(c)
                    if m:
                        concept_scores.append(m.mastery_score)

                if concept_scores:
                    skill_mastery = round(sum(concept_scores) / len(concept_scores), 2)
                else:
                    skill_mastery = knowledge_state.subject_mastery.get(node.subject, 0.1)

                self._skills[skill] = SkillCompetency(
                    skill_name=skill,
                    subject=node.subject,
                    mastery_estimate=skill_mastery,
                    associated_concepts=node.concepts,
                    is_blocked=is_blocked,
                    blocking_prerequisite=blocking_prereq,
                )

    def get_skill(self, skill_name: str) -> SkillCompetency | None:
        return self._skills.get(skill_name)

    def get_strongest_skills(self, top_n: int = 5) -> list[SkillCompetency]:
        """Return highest mastery skills."""
        sorted_skills = sorted(
            self._skills.values(), key=lambda x: x.mastery_estimate, reverse=True
        )
        return sorted_skills[:top_n]

    def get_weakest_skills(self, top_n: int = 5) -> list[SkillCompetency]:
        """Return lowest mastery skills that are not blocked."""
        active_skills = [s for s in self._skills.values() if not s.is_blocked]
        sorted_skills = sorted(active_skills, key=lambda x: x.mastery_estimate)
        return sorted_skills[:top_n]

    def get_blocked_skills(self) -> list[SkillCompetency]:
        """Return skills blocked by unfulfilled prerequisites."""
        return [s for s in self._skills.values() if s.is_blocked]

    def get_all_skills(self) -> list[SkillCompetency]:
        return list(self._skills.values())
