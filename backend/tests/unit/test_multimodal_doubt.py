"""Unit tests for Multimodal Doubt Resolution, Teaching Strategy Progression, Code Mentor, Document Teacher, and Interview Coach."""

from backend.app.schemas.multimodal_doubt import (
    CodeHelpMode,
    CodeMentorRequest,
    DocumentTeachRequest,
    DocumentUploadRequest,
    DoubtCategory,
    DoubtModality,
    ExplanationLevel,
    InterviewTurnRequest,
    MultimodalDoubtRequest,
    ProjectMentorRequest,
    UnderstandingCheckSubmission,
)
from backend.app.services.multimodal_doubt_service import MultimodalDoubtService


def test_text_and_mathematical_doubt_resolution():
    """Test standard calculus problem doubt resolution with understanding check."""
    req = MultimodalDoubtRequest(
        modality=DoubtModality.TEXT,
        user_query="How do I differentiate y = (3x^2 + 1)^4 using the chain rule?",
        explanation_level=ExplanationLevel.INTERMEDIATE,
    )
    resp = MultimodalDoubtService.resolve_doubt(req, learner_id="learner_test_01")
    assert resp.concept_name == "Chain Rule in Differentiation"
    assert resp.doubt_category == DoubtCategory.MATHEMATICAL
    assert resp.understanding_check is not None
    assert len(resp.understanding_check.options) >= 2


def test_image_doubt_resolution_with_uncertainty():
    """Test handling of unclear / handwritten question with safety clarification prompt."""
    req = MultimodalDoubtRequest(
        modality=DoubtModality.HANDWRITTEN,
        user_query="unclear problem from paper",
        image_base64="corrupt_mock_bytes",
        explanation_level=ExplanationLevel.INTERMEDIATE,
    )
    resp = MultimodalDoubtService.resolve_doubt(req, learner_id="learner_test_01")
    assert resp.is_uncertain is True
    assert resp.uncertainty_clarification_prompt is not None


def test_explain_again_strategy_ladder():
    """Test progressive strategy ladder when learner asks 'Explain again'."""
    # Turn 0: Direct Explanation
    s0 = MultimodalDoubtService.get_strategy_progression(
        why_chain_count=0, level=ExplanationLevel.INTERMEDIATE
    )
    assert "Direct" in s0

    # Turn 1: Simpler
    s1 = MultimodalDoubtService.get_strategy_progression(
        why_chain_count=1, level=ExplanationLevel.INTERMEDIATE
    )
    assert "Simpler" in s1

    # Turn 2: Analogy First
    s2 = MultimodalDoubtService.get_strategy_progression(
        why_chain_count=2, level=ExplanationLevel.INTERMEDIATE
    )
    assert "Analogy" in s2

    # Turn 3: Concrete Worked Example
    s3 = MultimodalDoubtService.get_strategy_progression(
        why_chain_count=3, level=ExplanationLevel.INTERMEDIATE
    )
    assert "Worked Example" in s3

    # Turn 4: Visual Diagrammatic
    s4 = MultimodalDoubtService.get_strategy_progression(
        why_chain_count=4, level=ExplanationLevel.INTERMEDIATE
    )
    assert "Visual" in s4


def test_document_upload_and_grounded_personalized_teaching():
    """Test document indexing and grounded personalized teaching from uploaded notes."""
    upload_req = DocumentUploadRequest(
        title="CS229 Lecture Notes: Neural Networks & Backpropagation",
        subject="AI/ML",
        file_base64="mock_pdf_base64_data",
        filename="cs229_notes.pdf",
        page_count=24,
    )
    upload_resp = MultimodalDoubtService.upload_document(upload_req, learner_id="learner_test_01")
    assert upload_resp.document_id is not None
    assert upload_resp.total_pages == 24

    teach_req = DocumentTeachRequest(
        document_id=upload_resp.document_id,
        prompt="Explain backpropagation and loss gradients from page 5",
        page_number=5,
    )
    teach_resp = MultimodalDoubtService.teach_from_document(teach_req, learner_id="learner_test_01")
    assert len(teach_resp.citations) >= 1
    assert teach_resp.citations[0].document_id == upload_resp.document_id
    assert teach_resp.citations[0].page_number == 5


def test_ai_code_mentor_debugging_and_scaffolding():
    """Test Code Mentor parsing IndexError, providing hints, and generating similar challenge."""
    req_hint = CodeMentorRequest(
        code="items = [1, 2, 3]\nfor i in range(len(items) + 1):\n    print(items[i])",
        language="python",
        error_message="IndexError: list index out of range",
        help_mode=CodeHelpMode.HINT,
    )
    resp_hint = MultimodalDoubtService.mentor_code(req_hint, learner_id="learner_test_01")
    assert resp_hint.has_syntax_error is True
    assert "IndexError" in resp_hint.error_type
    assert resp_hint.hint is not None
    assert resp_hint.fixed_code is None  # Scaffolding: Hint mode does not reveal full code!
    assert resp_hint.similar_practice_challenge is not None

    req_full = CodeMentorRequest(
        code="items = [1, 2, 3]\nfor i in range(len(items) + 1):\n    print(items[i])",
        language="python",
        error_message="IndexError: list index out of range",
        help_mode=CodeHelpMode.FULL_SOLUTION,
    )
    resp_full = MultimodalDoubtService.mentor_code(req_full, learner_id="learner_test_01")
    assert resp_full.fixed_code is not None
    assert "len(items)" in resp_full.fixed_code


def test_ai_project_mentor():
    """Test AI Project Mentor milestone roadmap & debugging."""
    req = ProjectMentorRequest(
        project_goal="Customer Churn Prediction Model",
        domain="Machine Learning",
        current_milestone_index=1,
        error_logs="Pandas apply memory bottleneck on 2M rows",
    )
    resp = MultimodalDoubtService.guide_project(req, learner_id="learner_test_01")
    assert len(resp.milestones) >= 3
    assert resp.debugging_diagnosis is not None
    assert "vectorized" in resp.debugging_diagnosis.lower()


def test_ai_interview_mentor_turn():
    """Test AI Mock Interview evaluation and follow-up generation."""
    req = InterviewTurnRequest(
        interview_type="system_design",
        target_role="Senior Distributed Systems Engineer",
        turn_index=1,
        current_question="How would you design a scalable rate limiter for 200,000 QPS?",
        learner_answer="First, I would use a distributed Redis token bucket algorithm with Lua scripts for atomic increments across regions.",
    )
    resp = MultimodalDoubtService.evaluate_interview_turn(req, learner_id="learner_test_01")
    assert resp.score >= 70.0
    assert resp.follow_up_question is not None


def test_understanding_check_submission():
    """Test active comprehension check evaluation and Learning Twin update."""
    sub = UnderstandingCheckSubmission(
        check_id="chk-diff-01", concept_id="chain_rule", selected_key="A"
    )
    result = MultimodalDoubtService.submit_understanding_check(sub, learner_id="learner_test_01")
    assert result.is_correct is True
    assert result.score == 1.0
    assert result.learning_twin_updated is True
