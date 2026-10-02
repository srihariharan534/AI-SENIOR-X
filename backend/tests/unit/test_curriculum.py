"""Unit tests for Curriculum DAG, Prerequisite Engine, and Topic Mapper."""

from backend.app.curriculum.curriculum_graph import CurriculumGraph, TopicNode, curriculum_graph
from backend.app.curriculum.prerequisite_engine import PrerequisiteEngine
from backend.app.curriculum.topic_mapper import TopicMapper


def test_curriculum_graph_topological_sort():
    graph = CurriculumGraph()
    n1 = TopicNode(id="t1", name="Basic", subject="Math", description="Base")
    n2 = TopicNode(
        id="t2", name="Intermediate", subject="Math", description="Mid", prerequisites=["t1"]
    )
    n3 = TopicNode(
        id="t3", name="Advanced", subject="Math", description="Top", prerequisites=["t2"]
    )

    graph.add_node(n1)
    graph.add_node(n2)
    graph.add_node(n3)

    sorted_nodes = graph.topological_sort()
    order = [n.id for n in sorted_nodes]
    assert order.index("t1") < order.index("t2") < order.index("t3")


def test_prerequisite_engine_evaluation():
    engine = PrerequisiteEngine(curriculum_graph, default_mastery_threshold=0.7)

    # Test topic with satisfied prerequisites
    eval_ready = engine.evaluate_readiness(
        target_topic_id="py_oop",
        learner_mastery_map={"py_basics": 0.85},
    )
    assert eval_ready.is_ready is True
    assert len(eval_ready.blocking_prerequisites) == 0

    # Test topic with missing/insufficient prerequisite
    eval_blocked = engine.evaluate_readiness(
        target_topic_id="py_oop",
        learner_mastery_map={"py_basics": 0.40},
    )
    assert eval_blocked.is_ready is False
    assert len(eval_blocked.blocking_prerequisites) == 1
    assert eval_blocked.blocking_prerequisites[0].topic_id == "py_basics"
    assert eval_blocked.recommended_preparation_step is not None


def test_topic_mapper():
    mapper = TopicMapper(curriculum_graph)
    mapped = mapper.map_query("I am confused about async await event loop coroutines in Python")

    assert mapped.pillar == "Computer Science"
    assert mapped.subject == "Python"
    assert mapped.topic_id == "py_async"
    assert mapped.concept_matched in ("async_await", "coroutines", "event_loop")
    assert mapped.confidence > 0.5


def test_curriculum_taxonomy_pillars_and_subjects():
    taxonomy = curriculum_graph.get_taxonomy()
    assert len(taxonomy) == 4
    assert set(taxonomy.keys()) == {
        "Computer Science",
        "AI & Data",
        "Cloud & Infrastructure",
        "Career & Innovation",
    }

    # Verify all 22 subjects are present in their corresponding pillars
    cs_subjects = set(taxonomy["Computer Science"])
    assert cs_subjects == {
        "Python",
        "DSA",
        "Software Engineering",
        "Databases",
        "Web Development",
        "System Design",
    }

    ai_subjects = set(taxonomy["AI & Data"])
    assert ai_subjects == {
        "AI & Machine Learning",
        "Deep Learning",
        "Generative AI",
        "Data Science",
        "Data Analytics",
        "Mathematics",
        "Statistics",
    }

    cloud_subjects = set(taxonomy["Cloud & Infrastructure"])
    assert cloud_subjects == {
        "Cloud",
        "DevOps",
        "MLOps",
        "Cybersecurity",
    }

    career_subjects = set(taxonomy["Career & Innovation"])
    assert career_subjects == {
        "Communication",
        "Interview Preparation",
        "Entrepreneurship",
        "Product Management",
        "UI/UX",
    }


def test_curriculum_graph_filtering_by_pillar_and_subject():
    cs_nodes = curriculum_graph.list_nodes(pillar="Computer Science")
    assert len(cs_nodes) >= 6
    assert all(n.pillar == "Computer Science" for n in cs_nodes)

    ai_nodes = curriculum_graph.list_nodes(pillar="AI & Data")
    assert len(ai_nodes) >= 7
    assert all(n.pillar == "AI & Data" for n in ai_nodes)

    cloud_nodes = curriculum_graph.list_nodes(pillar="Cloud & Infrastructure")
    assert len(cloud_nodes) >= 4

    career_nodes = curriculum_graph.list_nodes(pillar="Career & Innovation")
    assert len(career_nodes) >= 5

    # Filter by specific subject
    py_nodes = curriculum_graph.list_nodes(subject="Python")
    assert len(py_nodes) >= 4
    assert all(n.subject == "Python" for n in py_nodes)
