"""AI-SENIOR-X Natural Language Topic Mapper."""

import re

from pydantic import BaseModel, Field

from backend.app.curriculum.curriculum_graph import CurriculumGraph, TopicNode, curriculum_graph


class MappedTopicResult(BaseModel):
    """Structured mapping from learner input to curriculum node and concepts."""

    pillar: str = "Computer Science"
    subject: str
    topic_id: str
    topic_name: str
    concept_matched: str | None = None
    confidence: float = Field(..., ge=0.0, le=1.0)
    prerequisites: list[str] = Field(default_factory=list)
    skills: list[str] = Field(default_factory=list)
    match_rationale: str


class TopicMapper:
    """Maps unstructured user questions or learning statements into structured curriculum concepts."""

    def __init__(self, graph: CurriculumGraph | None = None):
        self.graph = graph or curriculum_graph

    def map_query(self, query_text: str) -> MappedTopicResult:
        """Analyze query string and map to the closest topic node and concept in the curriculum."""
        cleaned = query_text.lower().strip()
        words = set(re.findall(r"\b\w{3,}\b", cleaned))

        best_node: TopicNode | None = None
        best_concept: str | None = None
        highest_score = 0.0
        rationale = "General matching"

        for node in self.graph.list_nodes():
            score = 0.0
            node_concept: str | None = None
            node_rationale = f"Matched curriculum topic '{node.name}'"

            # 1. Exact topic name match
            if node.name.lower() in cleaned:
                score += 0.8
                node_rationale = f"Matched topic title: '{node.name}'"

            # 2. Concept matching (high priority)
            for concept in node.concepts:
                c_clean = concept.lower().replace("_", " ")
                if c_clean in cleaned:
                    score += 0.9
                    node_concept = concept
                    node_rationale = f"Matched concept '{concept}' under topic '{node.name}'"
                elif any(w in c_clean.split() for w in words):
                    score += 0.5
                    if not node_concept:
                        node_concept = concept
                        node_rationale = f"Matched concept '{concept}' under topic '{node.name}'"

            # 3. Skills matching
            for skill in node.skills:
                s_clean = skill.lower().replace("_", " ")
                if s_clean in cleaned:
                    score += 0.4

            # 4. Keyword overlap with description
            desc_words = set(re.findall(r"\b\w{3,}\b", node.description.lower()))
            overlap = len(words.intersection(desc_words))
            score += overlap * 0.1

            if score > highest_score:
                highest_score = score
                best_node = node
                best_concept = node_concept
                rationale = node_rationale

        # Fallback to default node if no specific match
        if not best_node or highest_score < 0.2:
            default_node = self.graph.get_node("py_basics") or self.graph.list_nodes()[0]
            prereqs = [p.name for p in self.graph.get_prerequisites(default_node.id)]
            return MappedTopicResult(
                pillar=default_node.pillar,
                subject=default_node.subject,
                topic_id=default_node.id,
                topic_name=default_node.name,
                concept_matched=None,
                confidence=0.3,
                prerequisites=prereqs,
                skills=default_node.skills,
                match_rationale="Fallback general curriculum classification",
            )

        prereqs = [p.name for p in self.graph.get_prerequisites(best_node.id)]
        confidence = min(0.98, max(0.4, round(highest_score, 2)))

        return MappedTopicResult(
            pillar=best_node.pillar,
            subject=best_node.subject,
            topic_id=best_node.id,
            topic_name=best_node.name,
            concept_matched=best_concept,
            confidence=confidence,
            prerequisites=prereqs,
            skills=best_node.skills,
            match_rationale=rationale,
        )


topic_mapper = TopicMapper()
