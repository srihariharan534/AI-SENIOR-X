"""Test evaluation benchmark execution and scorecard generation."""

from monitoring.evaluation.evaluation_runner import evaluation_runner


def test_rag_evaluation_benchmark():
    """Verify RAG retrieval evaluation benchmarks pass with expected precision."""
    res = evaluation_runner.evaluate_rag_retrieval()
    assert res.total_test_cases > 0
    assert res.accuracy_score >= 0.90
    assert "top_k_recall" in res.details


def test_tutor_evaluation_benchmark():
    """Verify Tutor Socratic adherence and injection defense pass."""
    res = evaluation_runner.evaluate_pedagogical_tutor()
    assert res.passed_cases == res.total_test_cases
    assert res.details.get("prompt_injection_rejection_rate") == 1.0


def test_misconception_evaluation_benchmark():
    """Verify Misconception detection classifier meets precision thresholds."""
    res = evaluation_runner.evaluate_misconception_detection()
    assert res.accuracy_score >= 0.90
    assert res.details.get("f1_score", 0) >= 0.90


def test_recommendation_evaluation_benchmark():
    """Verify Recommendation Agent satisfies topological DAG prerequisites."""
    res = evaluation_runner.evaluate_recommendation_engine()
    assert res.details.get("dag_violation_rate") == 0.0


def test_run_all_benchmarks():
    """Verify composite benchmark scorecard generates across all 4 pillars."""
    scorecard = evaluation_runner.run_all_benchmarks()
    assert len(scorecard) == 4
    for metric in scorecard:
        assert metric.passed_cases > 0
        assert metric.accuracy_score > 0.85
