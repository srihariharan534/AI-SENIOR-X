"""Unit test for Academic Intelligence Center Dashboard aggregation."""

from backend.app.services.dashboard_analytics_service import dashboard_analytics_service


def test_dashboard_overview_aggregation():
    data = dashboard_analytics_service.get_dashboard_overview("test-learner-01")
    assert data is not None
    assert data.academic_status_bar.subjects_total == 22
    assert data.academic_status_bar.courses_total == 22
    assert len(data.subjects) == 22
    assert len(data.course_records) >= 3
    assert data.learning_state.current_level == "INTERMEDIATE"
    assert data.practice_intelligence.completed > 0
    assert data.assessment_intelligence.completed > 0
    assert data.proof_of_learning.concepts_studied > 0
    assert len(data.discovered_insights) >= 3
    assert len(data.flight_recorder) >= 4
    assert len(data.daily_plan.items) >= 4
