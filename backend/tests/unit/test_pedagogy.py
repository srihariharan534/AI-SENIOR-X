"""Unit tests for AI-SENIOR-X Pedagogy Engine."""

from datetime import UTC, datetime

from backend.app.pedagogy.difficulty_adaptation import DifficultyAdaptationEngine
from backend.app.pedagogy.learning_path import LearningPathGenerator
from backend.app.pedagogy.mastery_learning import MasteryLearningEngine
from backend.app.pedagogy.spaced_repetition import SpacedRepetitionScheduler
from backend.app.pedagogy.teaching_strategies import TeachingStrategyEngine, TeachingStrategyType


def test_teaching_strategy_selection():
    # 1. Active misconception -> ERROR_CORRECTION
    decision = TeachingStrategyEngine.select_strategy(
        mastery_score=0.40,
        has_active_misconceptions=True,
    )
    assert decision.strategy == TeachingStrategyType.ERROR_CORRECTION
    assert decision.include_analogy is True

    # 2. Low mastery with analogy preference -> ANALOGY_FIRST
    decision = TeachingStrategyEngine.select_strategy(
        mastery_score=0.20,
        has_active_misconceptions=False,
        preferred_style="analogy",
    )
    assert decision.strategy == TeachingStrategyType.ANALOGY_FIRST

    # 3. Developing mastery -> SOCRATIC
    decision = TeachingStrategyEngine.select_strategy(
        mastery_score=0.55,
        session_turn_count=1,
    )
    assert decision.strategy == TeachingStrategyType.SOCRATIC

    # 4. Proficient mastery -> CHALLENGE
    decision = TeachingStrategyEngine.select_strategy(
        mastery_score=0.85,
    )
    assert decision.strategy == TeachingStrategyType.CHALLENGE


def test_difficulty_adaptation_streaks():
    # 3 correct streak increases difficulty
    res_boost = DifficultyAdaptationEngine.calculate_next_difficulty(
        current_mastery=0.50,
        consecutive_correct=3,
        current_difficulty=0.50,
    )
    assert res_boost.target_difficulty > 0.50
    assert "Streak of 3 correct" in res_boost.rationale

    # 2 incorrect streak drops difficulty
    res_drop = DifficultyAdaptationEngine.calculate_next_difficulty(
        current_mastery=0.40,
        consecutive_incorrect=2,
        current_difficulty=0.50,
    )
    assert res_drop.target_difficulty < 0.50
    assert "Streak of 2 incorrect" in res_drop.rationale


def test_spaced_repetition_sm2():
    now = datetime.now(UTC)
    # Failed repetition (quality=1) resets interval to 1 day
    sched_fail = SpacedRepetitionScheduler.schedule_next(
        concept_id="overfitting",
        quality=1,
        repetitions=3,
        previous_interval_days=10,
        last_reviewed=now,
    )
    assert sched_fail.repetitions == 0
    assert sched_fail.interval_days == 1

    # Successful repetition 1 -> interval 1 day
    sched_pass1 = SpacedRepetitionScheduler.schedule_next(
        concept_id="overfitting",
        quality=4,
        repetitions=0,
        last_reviewed=now,
    )
    assert sched_pass1.repetitions == 1
    assert sched_pass1.interval_days == 1

    # Successful repetition 2 -> interval 6 days
    sched_pass2 = SpacedRepetitionScheduler.schedule_next(
        concept_id="overfitting",
        quality=4,
        repetitions=1,
        last_reviewed=now,
    )
    assert sched_pass2.repetitions == 2
    assert sched_pass2.interval_days == 6


def test_mastery_advancement_gate():
    # Blocked by prerequisite
    decision_blocked = MasteryLearningEngine.evaluate_advancement_gate(
        topic_id="ml_supervised",
        concept_masteries={"regression": 0.80},
        prerequisite_masteries={"math_calculus": 0.40},
    )
    assert decision_blocked.can_advance is False
    assert decision_blocked.prerequisites_cleared is False
    assert "math_calculus" in decision_blocked.unmastered_prerequisites

    # Cleared gate
    decision_cleared = MasteryLearningEngine.evaluate_advancement_gate(
        topic_id="ml_supervised",
        concept_masteries={"regression": 0.85, "classification": 0.75},
        prerequisite_masteries={"math_calculus": 0.80, "py_basics": 0.90},
    )
    assert decision_cleared.can_advance is True
    assert decision_cleared.prerequisites_cleared is True


def test_dynamic_learning_path_solver():
    path_gen = LearningPathGenerator()
    path = path_gen.generate_path(
        target_topic_id="ml_supervised",
        current_knowledge_map={"py_basics": 0.85, "math_calculus": 0.30},
    )
    assert path.target_topic_id == "ml_supervised"
    assert path.total_steps >= 2
    # math_calculus should be included as prerequisite remediation because mastery is 0.30
    topic_ids = [s.topic_id for s in path.steps]
    assert "math_calculus" in topic_ids
    assert "ml_supervised" in topic_ids
