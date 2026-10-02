"""AI-SENIOR-X Prerequisite Engine."""

from pydantic import BaseModel, Field

from backend.app.curriculum.curriculum_graph import CurriculumGraph, curriculum_graph


class PrerequisiteStatus(BaseModel):
    """Detailed readiness status for a specific prerequisite node."""

    topic_id: str
    topic_name: str
    required_mastery: float = 0.70
    current_mastery: float = 0.0
    is_satisfied: bool = False
    mastery_gap: float = 0.70


class ReadinessEvaluation(BaseModel):
    """Comprehensive readiness diagnostic for a target topic."""

    target_topic_id: str
    target_topic_name: str
    is_ready: bool
    overall_readiness_score: float = Field(..., ge=0.0, le=1.0)
    prerequisites_total: int
    prerequisites_satisfied: int
    blocking_prerequisites: list[PrerequisiteStatus] = Field(default_factory=list)
    recommended_preparation_step: str | None = None

    @property
    def missing_prerequisites(self) -> list[str]:
        return [p.topic_name for p in self.blocking_prerequisites]


class PrerequisiteEngine:
    """Evaluates learner readiness against curriculum dependency trees."""

    def __init__(
        self, graph: CurriculumGraph | None = None, default_mastery_threshold: float = 0.70
    ):
        self.graph = graph or curriculum_graph
        self.mastery_threshold = default_mastery_threshold

    def evaluate_readiness(
        self,
        target_topic_id: str,
        learner_mastery_map: dict[str, float] | None = None,
        current_masteries: dict[str, float] | None = None,
    ) -> ReadinessEvaluation:
        """Assess whether a learner has sufficient prerequisite mastery to tackle a topic."""
        mastery_map = (
            learner_mastery_map if learner_mastery_map is not None else (current_masteries or {})
        )
        target_node = self.graph.get_node(target_topic_id)
        if not target_node:
            raise ValueError(f"Topic '{target_topic_id}' not found in curriculum graph.")

        direct_prereqs = self.graph.get_prerequisites(target_topic_id, recursive=False)
        if not direct_prereqs:
            # Topic has no prerequisites, immediately ready
            return ReadinessEvaluation(
                target_topic_id=target_topic_id,
                target_topic_name=target_node.name,
                is_ready=True,
                overall_readiness_score=1.0,
                prerequisites_total=0,
                prerequisites_satisfied=0,
                blocking_prerequisites=[],
                recommended_preparation_step=None,
            )

        statuses: list[PrerequisiteStatus] = []
        blocking: list[PrerequisiteStatus] = []
        scores: list[float] = []

        for prereq in direct_prereqs:
            # Lookup mastery by topic ID or topic name
            mastery = mastery_map.get(prereq.id, mastery_map.get(prereq.name, 0.0))
            is_satisfied = mastery >= self.mastery_threshold
            gap = max(0.0, self.mastery_threshold - mastery)

            status = PrerequisiteStatus(
                topic_id=prereq.id,
                topic_name=prereq.name,
                required_mastery=self.mastery_threshold,
                current_mastery=round(mastery, 2),
                is_satisfied=is_satisfied,
                mastery_gap=round(gap, 2),
            )
            statuses.append(status)
            scores.append(min(1.0, mastery / self.mastery_threshold))

            if not is_satisfied:
                blocking.append(status)

        overall_score = round(sum(scores) / len(scores), 2) if scores else 1.0
        is_ready = len(blocking) == 0

        recommended_step = None
        if blocking:
            # Recommend the lowest mastery blocker first
            blocking_sorted = sorted(blocking, key=lambda x: x.current_mastery)
            top_blocker = blocking_sorted[0]
            recommended_step = (
                f"Reinforce prerequisite '{top_blocker.topic_name}' (Current mastery: "
                f"{int(top_blocker.current_mastery * 100)}%, target: {int(self.mastery_threshold * 100)}%)."
            )

        return ReadinessEvaluation(
            target_topic_id=target_topic_id,
            target_topic_name=target_node.name,
            is_ready=is_ready,
            overall_readiness_score=overall_score,
            prerequisites_total=len(direct_prereqs),
            prerequisites_satisfied=len(direct_prereqs) - len(blocking),
            blocking_prerequisites=blocking,
            recommended_preparation_step=recommended_step,
        )


prerequisite_engine = PrerequisiteEngine()
