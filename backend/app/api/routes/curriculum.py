"""AI-SENIOR-X Curriculum Engine REST Endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from pydantic import BaseModel, Field

from backend.app.api.dependencies import get_current_user
from backend.app.curriculum.curriculum_graph import TopicNode, curriculum_graph
from backend.app.curriculum.prerequisite_engine import ReadinessEvaluation, prerequisite_engine
from backend.app.curriculum.topic_mapper import MappedTopicResult, topic_mapper
from backend.app.database.models.user import User
from backend.app.schemas.common import ApiResponse

router = APIRouter(prefix="/curriculum", tags=["Curriculum Engine"])


class MapTopicRequest(BaseModel):
    """Payload to map unstructured learner query to curriculum node."""

    query: str = Field(
        ..., min_length=2, description="Natural language query or confusion statement"
    )


class ReadinessCheckRequest(BaseModel):
    """Payload to evaluate topic readiness with optional mastery map override."""

    target_topic_id: str
    mastery_map: dict[str, float] | None = None


class TaxonomySubject(BaseModel):
    name: str
    topic_count: int
    total_minutes: int


class PillarDetail(BaseModel):
    pillar: str
    subjects: list[TaxonomySubject]
    total_topics: int
    total_minutes: int


class TaxonomyResponse(BaseModel):
    pillars: list[PillarDetail]
    total_pillars: int
    total_subjects: int
    total_topics: int


@router.get(
    "/taxonomy",
    response_model=ApiResponse[TaxonomyResponse],
    status_code=status.HTTP_200_OK,
    summary="Get 4-Pillar 22-Domain Curriculum Taxonomy Structure",
)
async def get_curriculum_taxonomy() -> ApiResponse[TaxonomyResponse]:
    """Retrieve structured 4-pillar, 22-domain curriculum taxonomy with summary stats."""
    raw_taxonomy = curriculum_graph.get_taxonomy()
    all_nodes = curriculum_graph.list_nodes()

    pillar_details: list[PillarDetail] = []
    total_subjects_count = 0
    total_topics_count = len(all_nodes)

    for pillar_name, subject_list in raw_taxonomy.items():
        subjects_data: list[TaxonomySubject] = []
        pillar_nodes = [n for n in all_nodes if n.pillar.lower() == pillar_name.lower()]
        pillar_minutes = sum(n.estimated_duration_minutes for n in pillar_nodes)

        for subj_name in subject_list:
            total_subjects_count += 1
            subj_nodes = [n for n in pillar_nodes if n.subject.lower() == subj_name.lower()]
            subj_minutes = sum(n.estimated_duration_minutes for n in subj_nodes)
            subjects_data.append(
                TaxonomySubject(
                    name=subj_name,
                    topic_count=len(subj_nodes),
                    total_minutes=subj_minutes,
                )
            )

        pillar_details.append(
            PillarDetail(
                pillar=pillar_name,
                subjects=subjects_data,
                total_topics=len(pillar_nodes),
                total_minutes=pillar_minutes,
            )
        )

    response_data = TaxonomyResponse(
        pillars=pillar_details,
        total_pillars=len(pillar_details),
        total_subjects=total_subjects_count,
        total_topics=total_topics_count,
    )
    return ApiResponse(data=response_data)


@router.get(
    "/pillars",
    response_model=ApiResponse[list[str]],
    status_code=status.HTTP_200_OK,
    summary="Get List of Curriculum Pillars",
)
async def get_curriculum_pillars() -> ApiResponse[list[str]]:
    """Retrieve list of distinct curriculum pillars."""
    return ApiResponse(data=curriculum_graph.get_pillars())


@router.get(
    "/graph",
    response_model=ApiResponse[list[TopicNode]],
    status_code=status.HTTP_200_OK,
    summary="Get Topologically Ordered Curriculum Graph",
)
async def get_curriculum_graph(
    pillar: str | None = Query(None, description="Optional pillar filter"),
    subject: str | None = Query(None, description="Optional subject filter"),
) -> ApiResponse[list[TopicNode]]:
    """Retrieve topologically sorted curriculum graph nodes, optionally filtered by pillar and subject."""
    nodes = curriculum_graph.topological_sort(pillar=pillar, subject=subject)
    return ApiResponse(data=nodes)


@router.get(
    "/node/{topic_id}",
    response_model=ApiResponse[TopicNode],
    status_code=status.HTTP_200_OK,
    summary="Get Specific Curriculum Node Details",
)
async def get_curriculum_node(topic_id: str) -> ApiResponse[TopicNode]:
    """Fetch complete metadata for a topic node including learning objectives and prerequisites."""
    node = curriculum_graph.get_node(topic_id)
    if not node:
        return ApiResponse(
            success=False,
            error={"code": "NODE_NOT_FOUND", "message": f"Topic '{topic_id}' not found."},
        )
    return ApiResponse(data=node)


@router.post(
    "/prerequisites/evaluate",
    response_model=ApiResponse[ReadinessEvaluation],
    status_code=status.HTTP_200_OK,
    summary="Evaluate Prerequisite Readiness for Topic",
)
async def evaluate_topic_readiness(
    payload: ReadinessCheckRequest,
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[ReadinessEvaluation]:
    """Assess whether learner has satisfied prerequisites for the requested topic."""
    # Use user profile mastery scores if not supplied in payload
    mastery = payload.mastery_map or {}
    if not mastery and current_user.learner_profile:
        mastery = current_user.learner_profile.mastery_scores or {}

    evaluation = prerequisite_engine.evaluate_readiness(
        target_topic_id=payload.target_topic_id,
        learner_mastery_map=mastery,
    )
    return ApiResponse(data=evaluation)


@router.post(
    "/map-topic",
    response_model=ApiResponse[MappedTopicResult],
    status_code=status.HTTP_200_OK,
    summary="Map Natural Language Query to Curriculum Node",
)
async def map_topic_from_query(
    payload: MapTopicRequest,
) -> ApiResponse[MappedTopicResult]:
    """Map learner natural language text to closest curriculum topic, concept, and prerequisites."""
    result = topic_mapper.map_query(payload.query)
    return ApiResponse(data=result)
