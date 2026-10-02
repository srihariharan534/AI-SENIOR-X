"""
Unit tests for AI-SENIOR-X Skill Intelligence & Proof-of-Skill Engine.
Verifies evidence recording, anti-gaming aggregation, teach-back evaluation,
learning blocker diagnostics, real-world challenge verification, role gap analysis,
delayed retention, and transfer tests.
"""

from backend.app.schemas.skill_intelligence import (
    BlockerType,
    ChallengeSubmissionRequest,
    DelayedRetentionCheckRequest,
    IndependenceLevel,
    LearningBlockerRequest,
    SkillState,
    TeachBackRequest,
    TransferTestRequest,
)
from backend.app.services.skill_intelligence_service import skill_intelligence_service


def test_evidence_recording_and_aggregation():
    """Verify that evidence items are logged and aggregate into accurate dimensions and state."""
    learner_id = "test-learner-ev-01"
    detail = skill_intelligence_service.compute_skill_detail(
        learner_id=learner_id,
        skill_id="sql_analytics",
        skill_name="SQL Analytics",
        domain="Data & Databases",
    )

    assert detail.skill_id == "sql_analytics"
    assert detail.evidence_count_total >= 3
    assert detail.independent_solutions_count >= 2
    assert detail.current_state in [
        SkillState.APPLIED,
        SkillState.RETAINED,
        SkillState.DEMONSTRATED,
    ]
    assert detail.dimensions.knowledge == "Strong"
    assert len(detail.demonstrated_evidence) >= 3


def test_teach_back_evaluation_with_correct_mental_model():
    """Verify teach-back evaluation approves sound explanation and records verified evidence."""
    req = TeachBackRequest(
        learner_id="test-learner-tb-01",
        concept_id="sql_joins",
        concept_title="SQL Relational JOINs",
        learner_explanation="A LEFT JOIN preserves every single record from the left table, and attaches matching columns from the right table. If a left row has no match, the right attributes become NULL without dropping the left row.",
    )

    res = skill_intelligence_service.evaluate_teach_back(req)
    assert res.is_conceptually_correct is True
    assert res.conceptual_score >= 0.85
    assert len(res.core_ideas_understood) >= 1
    assert len(res.detected_misconceptions) == 0
    assert res.evidence_logged is True
    assert res.updated_skill_state == SkillState.DEMONSTRATED


def test_teach_back_evaluation_with_misconception_detection():
    """Verify teach-back evaluation catches subtle misconceptions (e.g. confusing LEFT JOIN with INNER JOIN)."""
    req = TeachBackRequest(
        learner_id="test-learner-tb-02",
        concept_id="sql_joins",
        concept_title="SQL Relational JOINs",
        learner_explanation="A LEFT JOIN only returns matching rows between both tables where IDs match exactly.",
    )

    res = skill_intelligence_service.evaluate_teach_back(req)
    assert res.is_conceptually_correct is False
    assert len(res.detected_misconceptions) >= 1
    assert "LEFT JOIN" in res.detected_misconceptions[0]
    assert res.reteach_summary is not None


def test_learning_blocker_diagnosis():
    """Verify 'I Don't Know Where I'm Stuck' blocker diagnostic across prerequisite, procedural, and reasoning gaps."""
    # Prerequisite Math Gap
    req_math = LearningBlockerRequest(
        learner_id="test-learner-block-01",
        input_text="I understand the formula for gradient descent, but I can't solve these multivariable problems because the partial derivative notation is confusing.",
        current_topic="Optimization",
    )
    res_math = skill_intelligence_service.diagnose_learning_blocker(req_math)
    assert res_math.blocker_type == BlockerType.PREREQUISITE_GAP
    assert len(res_math.missing_prerequisites) >= 1
    assert len(res_math.actionable_remediation_steps) >= 2

    # Procedural Boundary Gap
    req_code = LearningBlockerRequest(
        learner_id="test-learner-block-02",
        input_text="My loop keeps throwing an IndexError: list index out of range at the final element.",
        current_topic="Python Iteration",
    )
    res_code = skill_intelligence_service.diagnose_learning_blocker(req_code)
    assert res_code.blocker_type == BlockerType.PROCEDURAL_GAP
    assert res_code.detected_misconception is not None


def test_challenge_submission_and_proof_record_generation():
    """Verify real-world challenge grading against rubric, generating verifiable ProofOfSkillRecord."""
    req = ChallengeSubmissionRequest(
        learner_id="test-learner-chal-01",
        challenge_id="chal-churn-cohort-01",
        skill_id="sql_analytics",
        sql_or_code_submission="""
        WITH user_orders AS (
            SELECT customer_id, order_date,
                   LAG(order_date) OVER(PARTITION BY customer_id ORDER BY order_date) as prev_order
            FROM orders
        )
        SELECT customer_id, AVG(DATEDIFF(order_date, prev_order)) as avg_repurchase_days
        FROM user_orders
        GROUP BY customer_id;
        """,
        reasoning_explanation="Cohort churn is driven by shipping delays extending repurchase cycle beyond 45 days. We recommend automated re-engagement triggers at day 30.",
        hints_used=0,
        independence=IndependenceLevel.INDEPENDENT,
    )

    res = skill_intelligence_service.evaluate_challenge_submission(req)
    assert res.is_verified_demonstrated is True
    assert res.overall_score >= 85.0
    assert res.proof_record_generated is not None
    assert res.proof_record_generated.verifiable_hash != ""
    assert res.updated_skill_state == SkillState.APPLIED


def test_role_gap_analysis():
    """Verify target role skill gap comparison for Data Analyst and Machine Learning Engineer."""
    analysis = skill_intelligence_service.perform_role_gap_analysis(
        learner_id="test-learner-role-01",
        target_role="Data Analyst",
    )

    assert analysis.target_role == "Data Analyst"
    assert analysis.total_skills_required == 5
    assert isinstance(analysis.readiness_pct, float)
    assert len(analysis.skill_breakdown) == 5
    assert any(s.skill_id == "sql_analytics" for s in analysis.skill_breakdown)


def test_delayed_retention_and_transfer_testing():
    """Verify delayed retention check and cross-domain transfer testing."""
    # Delayed retention
    ret_req = DelayedRetentionCheckRequest(
        learner_id="test-learner-ret-01",
        skill_id="sql_analytics",
        concept_id="sql_window_functions",
        delayed_days_elapsed=14,
        learner_answer="Using RANK() OVER (PARTITION BY region ORDER BY revenue DESC) allows ranking sales inside each region without collapsing rows with GROUP BY.",
    )
    ret_res = skill_intelligence_service.evaluate_delayed_retention(ret_req)
    assert ret_res["is_retained"] is True
    assert ret_res["retention_score"] >= 90.0

    # Cross-domain transfer test
    xfer_req = TransferTestRequest(
        learner_id="test-learner-ret-01",
        skill_id="relational_modeling",
        source_domain="e-commerce",
        target_transfer_domain="healthcare",
        learner_solution="SELECT p.patient_name, a.appointment_date, d.department_name FROM patients p JOIN appointments a ON p.id = a.patient_id JOIN departments d ON a.dept_id = d.id WHERE a.status = 'COMPLETED'",
        transfer_reasoning="The same 1-to-N customer-orders relational pattern applies here where patient replaces customer and appointments replace order transactions.",
    )
    xfer_res = skill_intelligence_service.evaluate_transfer_test(xfer_req)
    assert xfer_res["is_transferred"] is True
    assert xfer_res["transfer_score"] >= 90.0


def test_full_skill_intelligence_profile_retrieval():
    """Verify complete Skill Intelligence profile assembly with proof records and evidence metrics."""
    profile = skill_intelligence_service.get_skill_intelligence_profile("test-learner-pass-01")
    assert profile.learner_id == "test-learner-pass-01"
    assert len(profile.skills) >= 4
    assert len(profile.proof_records) >= 1
    assert profile.total_verified_evidence_count >= 3
    assert profile.overall_independence_rate_pct > 0
