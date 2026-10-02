"""AI-SENIOR-X Dynamic Personalized Learning Path Generator."""

from enum import StrEnum

from pydantic import BaseModel, Field

from backend.app.curriculum.curriculum_graph import CurriculumGraph, curriculum_graph


class StepType(StrEnum):
    """Actionable step types in a generated path."""

    PREREQUISITE_REMEDIATION = "prerequisite_remediation"
    FOUNDATIONAL_CONCEPT = "foundational_concept"
    CORE_TOPIC = "core_topic"
    PRACTICE_DRILL = "practice_drill"
    DIAGNOSTIC_ASSESSMENT = "diagnostic_assessment"
    CAPSTONE_PROJECT = "capstone_project"


class PathStep(BaseModel):
    """Individual milestone step in the dynamic learning roadmap."""

    step_number: int
    step_type: StepType
    topic_id: str
    topic_name: str
    subject: str
    estimated_minutes: int
    rationale: str
    concepts: list[str] = Field(default_factory=list)


class DynamicLearningPath(BaseModel):
    """Complete personalized curriculum roadmap."""

    target_topic_id: str
    target_topic_name: str
    total_steps: int
    estimated_total_minutes: int
    steps: list[PathStep]


class LearningPathGenerator:
    """Solves the shortest topological DAG path from learner's current mastery to target topic."""

    def __init__(self, graph: CurriculumGraph | None = None):
        self.graph = graph or curriculum_graph

    def generate_path(
        self,
        target_topic_id: str,
        current_knowledge_map: dict[str, float] | None = None,
    ) -> DynamicLearningPath:
        """Construct an ordered milestone sequence resolving prerequisite gaps before target topic."""
        current_knowledge_map = current_knowledge_map or {}
        target_node = self.graph.get_node(target_topic_id)
        if not target_node:
            raise ValueError(
                f"Target topic node '{target_topic_id}' not found in curriculum graph."
            )

        # 1. Collect all ancestor prerequisites in topological order
        ancestors = self.graph.get_prerequisites(target_topic_id)

        steps: list[PathStep] = []
        step_idx = 1

        # 2. Add unmastered prerequisites
        for node in ancestors:
            mastery = current_knowledge_map.get(node.id, 0.0)
            if mastery < 0.70:
                step_type = (
                    StepType.PREREQUISITE_REMEDIATION
                    if mastery > 0.0
                    else StepType.FOUNDATIONAL_CONCEPT
                )
                steps.append(
                    PathStep(
                        step_number=step_idx,
                        step_type=step_type,
                        topic_id=node.id,
                        topic_name=node.name,
                        subject=node.subject,
                        estimated_minutes=node.estimated_duration_minutes,
                        rationale=f"Foundational requirement for {target_node.name} (current mastery: {int(mastery * 100)}%)",
                        concepts=node.concepts,
                    )
                )
                step_idx += 1

        # 3. Add core target topic
        target_mastery = current_knowledge_map.get(target_node.id, 0.0)
        steps.append(
            PathStep(
                step_number=step_idx,
                step_type=StepType.CORE_TOPIC,
                topic_id=target_node.id,
                topic_name=target_node.name,
                subject=target_node.subject,
                estimated_minutes=target_node.estimated_duration_minutes,
                rationale=f"Core learning target (current mastery: {int(target_mastery * 100)}%)",
                concepts=target_node.concepts,
            )
        )
        step_idx += 1

        # 4. Add capstone assessment/practice
        steps.append(
            PathStep(
                step_number=step_idx,
                step_type=StepType.DIAGNOSTIC_ASSESSMENT,
                topic_id=target_node.id,
                topic_name=f"{target_node.name} Capstone Checkpoint",
                subject=target_node.subject,
                estimated_minutes=15,
                rationale="Comprehensive evaluation to certify concept proficiency.",
                concepts=target_node.concepts,
            )
        )

        total_time = sum(s.estimated_minutes for s in steps)

        return DynamicLearningPath(
            target_topic_id=target_node.id,
            target_topic_name=target_node.name,
            total_steps=len(steps),
            estimated_total_minutes=total_time,
            steps=steps,
        )


learning_path_generator = LearningPathGenerator()
