"""AI-SENIOR-X Explainable Next-Best-Lesson Engine."""

from enum import StrEnum

from pydantic import BaseModel, Field

from backend.app.curriculum.curriculum_graph import CurriculumGraph, curriculum_graph


class RecommendationActionType(StrEnum):
    """Categorical next learning actions."""

    REVIEW = "REVIEW"
    LEARN = "LEARN"
    PRACTICE = "PRACTICE"
    ASSESS = "ASSESS"
    REMEDIATE = "REMEDIATE"
    ADVANCE = "ADVANCE"


class CandidateLesson(BaseModel):
    """Ranked learning recommendation candidate."""

    topic_id: str
    topic_name: str
    subject: str
    action_type: RecommendationActionType
    priority_score: float = Field(..., ge=0.0, le=1.0)
    estimated_duration_minutes: int = 15
    rationale: str
    concepts: list[str] = Field(default_factory=list)


class NextBestLessonRanker:
    """Ranks educational candidates using explainable multi-factor scoring."""

    def __init__(self, graph: CurriculumGraph | None = None):
        self.graph = graph or curriculum_graph

    def rank_next_actions(
        self,
        knowledge_map: dict[str, float] | None = None,
        active_misconceptions: list[str] | None = None,
        overdue_reviews: list[str] | None = None,
        primary_goal_subject: str = "AI/ML",
    ) -> list[CandidateLesson]:
        """Generate an explainable list of prioritized learning actions."""
        knowledge_map = knowledge_map or {}
        active_misconceptions = active_misconceptions or []
        overdue_reviews = overdue_reviews or []

        candidates: list[CandidateLesson] = []

        # 1. Active Misconceptions have Highest Priority (REMEDIATE)
        if active_misconceptions:
            for misc_id in active_misconceptions:
                candidates.append(
                    CandidateLesson(
                        topic_id="remediation_" + misc_id,
                        topic_name=f"Fix Misconception: {misc_id.replace('_', ' ').title()}",
                        subject=primary_goal_subject,
                        action_type=RecommendationActionType.REMEDIATE,
                        priority_score=0.98,
                        estimated_duration_minutes=10,
                        rationale="Targeted correction of active conceptual confusion detected in recent assessments.",
                        concepts=[misc_id],
                    )
                )

        # 2. Overdue Spaced Repetitions (REVIEW)
        if overdue_reviews:
            for rev_id in overdue_reviews:
                node = self.graph.get_node(rev_id)
                name = node.name if node else rev_id.replace("_", " ").title()
                candidates.append(
                    CandidateLesson(
                        topic_id=rev_id,
                        topic_name=f"Spaced Review: {name}",
                        subject=node.subject if node else primary_goal_subject,
                        action_type=RecommendationActionType.REVIEW,
                        priority_score=0.92,
                        estimated_duration_minutes=10,
                        rationale="Memory retention decay threshold reached; quick review preserves mastery.",
                        concepts=node.concepts if node else [rev_id],
                    )
                )

        # 3. Unfinished / Developing topics (PRACTICE / ASSESS)
        for node in self.graph.list_nodes():
            mastery = knowledge_map.get(node.id, 0.0)

            # Check if prerequisites are satisfied
            prereqs = self.graph.get_prerequisites(node.id)
            prereqs_ok = all(knowledge_map.get(p.id, 0.0) >= 0.60 for p in prereqs)

            if 0.20 <= mastery < 0.70:
                # Developing -> Practice or Assess
                action = (
                    RecommendationActionType.PRACTICE
                    if mastery < 0.50
                    else RecommendationActionType.ASSESS
                )
                score = 0.85 + (0.10 if node.subject == primary_goal_subject else 0.0)
                candidates.append(
                    CandidateLesson(
                        topic_id=node.id,
                        topic_name=node.name,
                        subject=node.subject,
                        action_type=action,
                        priority_score=round(score, 2),
                        estimated_duration_minutes=node.estimated_duration_minutes,
                        rationale=f"In-progress topic with {int(mastery * 100)}% mastery. Complete practice to reach certification.",
                        concepts=node.concepts,
                    )
                )

            elif mastery < 0.20 and prereqs_ok:
                # Ready for new topic (LEARN)
                score = 0.75 + (0.10 if node.subject == primary_goal_subject else 0.0)
                candidates.append(
                    CandidateLesson(
                        topic_id=node.id,
                        topic_name=node.name,
                        subject=node.subject,
                        action_type=RecommendationActionType.LEARN,
                        priority_score=round(score, 2),
                        estimated_duration_minutes=node.estimated_duration_minutes,
                        rationale="All prerequisites mastered! Optimal next step on curriculum roadmap.",
                        concepts=node.concepts,
                    )
                )

        # Sort by priority score descending
        candidates.sort(key=lambda c: c.priority_score, reverse=True)
        return candidates[:5]


next_best_lesson_ranker = NextBestLessonRanker()
