"""Learning Pathways & Curriculum Service."""

import json
from pathlib import Path

from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database.repositories.learner_profile_repository import LearnerProfileRepository
from backend.app.schemas.learning import CurriculumNode, MissionRead


class LearningService:
    """Service providing curriculum pathways, learning objectives, and mission structures."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.profile_repo = LearnerProfileRepository(session)

    async def get_curriculum_nodes(self, subject: str | None = None) -> list[CurriculumNode]:
        """Fetch curriculum nodes from seed knowledge or dynamic graph."""
        seed_path = Path("data/seed/initial_curriculum.json")
        nodes: list[CurriculumNode] = []

        if seed_path.exists():
            try:
                with open(seed_path, encoding="utf-8") as f:
                    data = json.load(f)
                    for item in data.get("modules", []):
                        if not subject or item.get("subject", "").lower() == subject.lower():
                            nodes.append(CurriculumNode(**item))
            except Exception:
                pass

        if not nodes:
            # Default fallback curriculum nodes
            nodes = [
                CurriculumNode(
                    id="py-101",
                    title="Python Programming Fundamentals",
                    subject="Computer Science",
                    description="Variables, data structures, control flow, functions, and typing.",
                    difficulty="beginner",
                    estimated_minutes=45,
                    skills=["python", "programming_basics", "data_structures"],
                ),
                CurriculumNode(
                    id="ai-201",
                    title="Neural Networks & Deep Learning",
                    subject="Artificial Intelligence",
                    description="Perceptrons, backpropagation, activation functions, and gradient descent.",
                    difficulty="intermediate",
                    prerequisites=["py-101"],
                    estimated_minutes=60,
                    skills=["neural_networks", "pytorch", "math_for_ml"],
                ),
                CurriculumNode(
                    id="rag-301",
                    title="Retrieval-Augmented Generation (RAG) Architecture",
                    subject="Artificial Intelligence",
                    description="Vector embeddings, chunking strategies, hybrid search, and hallucination reduction.",
                    difficulty="advanced",
                    prerequisites=["ai-201"],
                    estimated_minutes=75,
                    skills=["rag", "vector_databases", "prompt_engineering"],
                ),
            ]
        return nodes

    async def get_available_missions(self, user_id: str) -> list[MissionRead]:
        """Return personalized learning missions."""
        return [
            MissionRead(
                id="mission-01",
                title="Python Algorithmic Quest",
                subject="Computer Science",
                description="Master recursion and dynamic programming by solving 3 interactive challenges.",
                xp_reward=150,
                objectives=[
                    "Implement a recursive Fibonacci with memoization",
                    "Analyze time complexity",
                    "Pass the test suite",
                ],
                is_completed=False,
            ),
            MissionRead(
                id="mission-02",
                title="Vector Search Explorer",
                subject="Artificial Intelligence",
                description="Build a semantic search index using cosine similarity and document embeddings.",
                xp_reward=250,
                objectives=[
                    "Generate dense embeddings",
                    "Compute cosine similarity",
                    "Evaluate top-k retrieval accuracy",
                ],
                is_completed=False,
            ),
        ]
