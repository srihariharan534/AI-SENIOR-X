"""Educational AI Evaluation Interfaces & Metric Models."""

from abc import ABC, abstractmethod
from typing import Any, Dict, List
from pydantic import BaseModel, Field


class EvaluationScore(BaseModel):
    """Normalized educational evaluation score."""

    metric_name: str
    score: float = Field(..., ge=0.0, le=1.0)
    rationale: str
    metadata: Dict[str, Any] = Field(default_factory=dict)


class BaseEvaluator(ABC):
    """Abstract interface for evaluating AI Tutor pedagogical quality, accuracy, and safety."""

    @abstractmethod
    async def evaluate_response(
        self,
        user_query: str,
        ai_response: str,
        ground_truth: str = "",
        context: List[str] = None,
    ) -> EvaluationScore:
        """Score AI output against educational rubrics."""
        pass
