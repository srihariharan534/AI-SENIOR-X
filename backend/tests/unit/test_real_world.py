"""Unit tests for Real-World Projects, Scenarios, Job Readiness, and Recovery Loop."""

from backend.app.schemas.real_world import (
    DecisionEvaluationRequest,
    ProjectDomain,
    ProjectSubmission,
    RecoveryDiagnosisRequest,
)
from backend.app.services.job_readiness_service import JobReadinessService
from backend.app.services.real_world_service import RealWorldService
from backend.app.services.recovery_engine import RecoveryEngineService


def test_real_world_projects_catalog():
    """Verify that projects exist across domains with realistic constraints."""
    projects = RealWorldService.get_all_projects()
    assert len(projects) >= 6
    domains = {p.domain for p in projects}
    assert ProjectDomain.PYTHON in domains
    assert ProjectDomain.SQL in domains
    assert ProjectDomain.MACHINE_LEARNING in domains
    assert ProjectDomain.CLOUD in domains
    assert ProjectDomain.DSA in domains
    assert ProjectDomain.DATA_ANALYTICS in domains

    # Check project structure
    py_proj = next(p for p in projects if p.domain == ProjectDomain.PYTHON)
    assert len(py_proj.constraints) >= 1
    assert len(py_proj.steps) >= 3
    assert "yield" in py_proj.starter_template or "Iterator" in py_proj.starter_template


def test_real_world_project_evaluation_pass():
    """Test evaluating a valid Python log streaming solution."""
    submission = ProjectSubmission(
        project_id="proj-py-01",
        solution_code=r"""
import re
from typing import Iterator, Dict, Any

def parse_log_stream(log_lines: Iterator[str]) -> Dict[str, Any]:
    log_regex = re.compile(r'HTTP/\d\.\d" (\d{3}) (\d+)')
    failed_5xx = 0
    total = 0
    try:
        for line in log_lines:
            total += 1
            match = log_regex.search(line)
            if match and match.group(1).startswith('5'):
                failed_5xx += 1
                yield match.groups()
    except Exception as e:
        pass
    return {'total_requests': total, 'failed_5xx_count': failed_5xx}
""",
        plan_explanation="Use compiled regex and generator streaming to process log lines line-by-line without loading all into RAM.",
        hints_used=0,
        time_spent_seconds=1200,
    )

    evaluation = RealWorldService.evaluate_project_submission(submission, learner_id="test_user_01")
    assert evaluation.passed is True
    assert evaluation.score >= 70.0
    assert evaluation.evidence_generated is True
    assert evaluation.evidence_badge is not None


def test_real_world_decision_making_scenario():
    """Test architectural decision and trade-off evaluation."""
    scenarios = RealWorldService.get_all_scenarios()
    assert len(scenarios) >= 3

    req = DecisionEvaluationRequest(
        scenario_id="scen-db-01",
        selected_option_id="opt-3nf-relational",
        learner_reasoning="Option A preserves relational integrity with 3NF while utilizing Change Data Capture dual-writing to guarantee zero downtime and eliminate historical data loss.",
    )
    result = RealWorldService.evaluate_decision_scenario(req)
    assert result.is_optimal is True
    assert result.decision_score >= 80.0
    assert result.dimension_scores["reliability"] >= 80.0


def test_job_readiness_evidence_profile():
    """Verify that job readiness relies on empirical evidence without fabricated percentages."""
    profile = JobReadinessService.get_readiness_profile(learner_id="test_user_01")
    assert profile.learner_id == "test_user_01"
    assert len(profile.skills) >= 5

    # Check that Python and SQL have demonstrated evidence lists
    py_skill = next(s for s in profile.skills if s.skill_name == "PYTHON")
    assert len(py_skill.demonstrated_evidence) >= 1
    assert len(py_skill.missing_evidence) >= 1
    assert py_skill.exercises_completed > 0


def test_recovery_engine_failure_diagnosis():
    """Test learning failure diagnosis mapping to root misconceptions & prerequisites."""
    req = RecoveryDiagnosisRequest(
        question_or_task_id="q-join-01",
        domain="SQL",
        concept_id="SQL JOINs",
        user_failed_response="SELECT * FROM customers c INNER JOIN orders o ON c.id = o.customer_id",
        expected_concept="LEFT JOIN with NULL handling",
    )
    diagnosis = RecoveryEngineService.diagnose_learning_failure(req)
    assert "LEFT JOIN" in diagnosis.root_issue or "INNER JOIN" in diagnosis.root_issue
    assert "relational" in diagnosis.missing_prerequisite.lower()
    assert diagnosis.targeted_practice_exercise_id is not None
    assert len(diagnosis.step_actions) == 4


def test_explainable_recommendations():
    """Verify that recommendations contain WHAT, WHY, EVIDENCE, NEXT ACTION."""
    recs = RecoveryEngineService.get_explainable_recommendations(learner_id="test_user_01")
    assert len(recs) >= 3
    for rec in recs:
        assert rec.what != ""
        assert rec.why != ""
        assert len(rec.evidence) >= 1
        assert rec.next_action != ""
        assert rec.action_target_id != ""
