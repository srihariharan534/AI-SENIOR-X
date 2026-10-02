"""Integration tests for Intelligence Layer API endpoints (Curriculum, RAG, and Learning Twin)."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_curriculum_api_endpoints(client: AsyncClient, auth_headers):
    # 1. Get graph
    graph_res = await client.get("/api/v1/curriculum/graph")
    assert graph_res.status_code == 200
    graph_data = graph_res.json()
    assert graph_data["success"] is True
    assert len(graph_data["data"]) >= 5

    # 2. Get node detail
    node_res = await client.get("/api/v1/curriculum/node/py_basics")
    assert node_res.status_code == 200
    node_data = node_res.json()
    assert node_data["data"]["name"] == "Python Basics & Control Flow"

    # 3. Topic mapping
    map_res = await client.post(
        "/api/v1/curriculum/map-topic",
        json={"query": "I am struggling to understand backpropagation neural networks"},
    )
    assert map_res.status_code == 200
    map_data = map_res.json()
    assert map_data["success"] is True
    assert map_data["data"]["subject"] in (
        "Deep Learning",
        "AI & Machine Learning",
        "AI/ML",
        "Python",
        "Computer Science",
    )
    assert map_data["data"]["pillar"] in ("AI & Data", "Computer Science")

    # 3b. Taxonomy and Pillars endpoints
    tax_res = await client.get("/api/v1/curriculum/taxonomy")
    assert tax_res.status_code == 200
    tax_data = tax_res.json()["data"]
    assert tax_data["total_pillars"] == 4
    assert tax_data["total_subjects"] == 22

    pillars_res = await client.get("/api/v1/curriculum/pillars")
    assert pillars_res.status_code == 200
    assert len(pillars_res.json()["data"]) == 4

    # 4. Prerequisite evaluation
    eval_res = await client.post(
        "/api/v1/curriculum/prerequisites/evaluate",
        json={"target_topic_id": "py_oop", "mastery_map": {"py_basics": 0.85}},
        headers=auth_headers,
    )
    assert eval_res.status_code == 200
    eval_data = eval_res.json()
    assert eval_data["data"]["is_ready"] is True


@pytest.mark.asyncio
async def test_rag_api_endpoints(client: AsyncClient, auth_headers):
    # 1. Ingest text
    ingest_payload = {
        "title": "Gradient Descent Optimization",
        "text": "Stochastic Gradient Descent updates parameters by sampling mini-batches to minimize loss.",
        "subject": "Mathematics",
        "topic": "Calculus & Optimization",
        "difficulty": "intermediate",
    }
    ingest_res = await client.post("/api/v1/rag/ingest", json=ingest_payload, headers=auth_headers)
    assert ingest_res.status_code == 201
    assert ingest_res.json()["success"] is True

    # 2. Hybrid Search
    search_payload = {
        "query": "Stochastic Gradient Descent loss",
        "top_k": 3,
        "subject": "Mathematics",
    }
    search_res = await client.post("/api/v1/rag/search", json=search_payload)
    assert search_res.status_code == 200
    search_data = search_res.json()
    assert search_data["success"] is True

    # 3. Retrieve Context
    context_payload = {
        "query": "How does Stochastic Gradient Descent update parameters?",
        "subject": "Mathematics",
        "top_k": 2,
    }
    context_res = await client.post("/api/v1/rag/retrieve-context", json=context_payload)
    assert context_res.status_code == 200
    context_data = context_res.json()
    assert context_data["success"] is True
    assert "Gradient Descent" in context_data["data"]["formatted_context"]

    # 4. Stats
    stats_res = await client.get("/api/v1/rag/stats")
    assert stats_res.status_code == 200
    assert stats_res.json()["data"]["total_chunks_indexed"] >= 1


@pytest.mark.asyncio
async def test_learning_twin_api_endpoints(client: AsyncClient, auth_headers):
    # 1. Get twin summary
    summary_res = await client.get("/api/v1/learning-twin", headers=auth_headers)
    assert summary_res.status_code == 200
    assert summary_res.json()["success"] is True

    # 2. Ingest Evidence
    evidence_payload = {
        "evidence_type": "assessment",
        "subject": "Python",
        "topic": "Python Basics",
        "concept": "control_flow",
        "question_id": "q_integration_1",
        "user_response": "for i in range(10): pass",
        "is_correct": True,
        "score_awarded": 10.0,
        "difficulty": "medium",
        "response_time_seconds": 15.0,
    }
    ev_res = await client.post(
        "/api/v1/learning-twin/evidence", json=evidence_payload, headers=auth_headers
    )
    assert ev_res.status_code == 200
    ev_data = ev_res.json()
    assert ev_data["success"] is True

    # 3. Get Knowledge State
    know_res = await client.get("/api/v1/learning-twin/knowledge", headers=auth_headers)
    assert know_res.status_code == 200
    know_data = know_res.json()
    assert "control_flow" in know_data["data"]["concepts"]

    # 4. Get Skills
    skills_res = await client.get("/api/v1/learning-twin/skills", headers=auth_headers)
    assert skills_res.status_code == 200
    assert len(skills_res.json()["data"]) > 0

    # 5. Get History
    hist_res = await client.get("/api/v1/learning-twin/history", headers=auth_headers)
    assert hist_res.status_code == 200
    assert len(hist_res.json()["data"]) >= 1

    # 6. Get Misconceptions
    misc_res = await client.get("/api/v1/learning-twin/misconceptions", headers=auth_headers)
    assert misc_res.status_code == 200
    assert "active" in misc_res.json()["data"]
