"""AI-SENIOR-X Pedagogy Engine Module."""

from backend.app.pedagogy.difficulty_adaptation import (
    DifficultyAdaptationEngine,
    DifficultyAssessment,
)
from backend.app.pedagogy.learning_path import (
    DynamicLearningPath,
    LearningPathGenerator,
    PathStep,
    StepType,
)
from backend.app.pedagogy.mastery_learning import AdvancementDecision, MasteryLearningEngine
from backend.app.pedagogy.spaced_repetition import RepetitionSchedule, SpacedRepetitionScheduler
from backend.app.pedagogy.teaching_strategies import (
    StrategyDecision,
    TeachingStrategyEngine,
    TeachingStrategyType,
)

__all__ = [
    "AdvancementDecision",
    "DifficultyAdaptationEngine",
    "DifficultyAssessment",
    "DynamicLearningPath",
    "LearningPathGenerator",
    "MasteryLearningEngine",
    "PathStep",
    "RepetitionSchedule",
    "SpacedRepetitionScheduler",
    "StepType",
    "StrategyDecision",
    "TeachingStrategyEngine",
    "TeachingStrategyType",
]
