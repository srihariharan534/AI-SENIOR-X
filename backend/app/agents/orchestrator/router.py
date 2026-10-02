"""AI-SENIOR-X Multi-Agent Intent Router."""

import re
from enum import StrEnum

from pydantic import BaseModel, Field


class UserIntent(StrEnum):
    """Categorized learner interaction intents."""

    LEARN = "LEARN"
    ASK = "ASK"
    EXPLAIN = "EXPLAIN"
    PRACTICE = "PRACTICE"
    ASSESS = "ASSESS"
    GRADE = "GRADE"
    REVIEW = "REVIEW"
    MISCONCEPTION = "MISCONCEPTION"
    RECOMMEND = "RECOMMEND"
    MISSION = "MISSION"
    PROGRESS = "PROGRESS"
    EXAM = "EXAM"
    VOICE = "VOICE"
    PROFILE = "PROFILE"


class RoutingDecision(BaseModel):
    """Destination agent and rationale determined by the router."""

    intent: UserIntent
    target_agent: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    extracted_topic: str | None = None
    extracted_concept: str | None = None
    rationale: str


class IntentRouter:
    """High-speed deterministic + heuristic intent classifier routing requests to specialized agents."""

    INTENT_KEYWORDS = {
        UserIntent.ASSESS: [
            "quiz",
            "test",
            "assessment",
            "assess me",
            "exam",
            "check my knowledge",
            "test me",
            "evaluate me",
            "question",
        ],
        UserIntent.PRACTICE: [
            "practice",
            "exercise",
            "drill",
            "coding challenge",
            "problem",
            "solve",
            "try solving",
            "code practice",
        ],
        UserIntent.GRADE: [
            "grade",
            "grade my answer",
            "check this code",
            "evaluate answer",
            "is this right",
            "did i solve",
            "submission",
        ],
        UserIntent.RECOMMEND: [
            "what next",
            "recommend",
            "next lesson",
            "where should i start",
            "learning path",
            "next topic",
            "roadmap",
        ],
        UserIntent.MISSION: [
            "mission",
            "quest",
            "bounty",
            "daily challenge",
            "current mission",
            "new mission",
            "capstone",
        ],
        UserIntent.PROGRESS: [
            "my progress",
            "mastery score",
            "twin state",
            "my stats",
            "how am i doing",
            "skill graph",
            "analytics",
        ],
        UserIntent.PROFILE: [
            "my profile",
            "learner style",
            "onboarding",
            "my goals",
            "change style",
            "preferred pace",
        ],
        UserIntent.EXPLAIN: [
            "explain",
            "what is",
            "why does",
            "how does",
            "analogy",
            "clarify",
            "confused about",
            "don't understand",
            "deep dive",
        ],
        UserIntent.REVIEW: [
            "review",
            "spaced repetition",
            "refresh",
            "forgetting",
            "revisit",
            "recap",
        ],
    }

    AGENT_MAPPING = {
        UserIntent.ASSESS: "AssessmentAgent",
        UserIntent.PRACTICE: "PracticeAgent",
        UserIntent.GRADE: "GradingAgent",
        UserIntent.RECOMMEND: "RecommendationAgent",
        UserIntent.MISSION: "MissionAgent",
        UserIntent.PROGRESS: "LearnerProfilerAgent",
        UserIntent.PROFILE: "LearnerProfilerAgent",
        UserIntent.EXPLAIN: "TutorAgent",
        UserIntent.LEARN: "TutorAgent",
        UserIntent.ASK: "TutorAgent",
        UserIntent.REVIEW: "TutorAgent",
        UserIntent.MISCONCEPTION: "MisconceptionAgent",
        UserIntent.EXAM: "AssessmentAgent",
        UserIntent.VOICE: "TutorAgent",
    }

    @classmethod
    def route(
        cls,
        query: str,
        explicit_intent: str | None = None,
        active_assessment: bool = False,
        active_practice: bool = False,
    ) -> RoutingDecision:
        """Route user query to appropriate specialized agent."""
        cleaned = query.strip().lower()

        # 1. Respect explicit intent if provided
        if explicit_intent:
            intent_upper = explicit_intent.upper()
            if intent_upper in UserIntent.__members__:
                matched_intent = UserIntent(intent_upper)
                agent = cls.AGENT_MAPPING.get(matched_intent, "TutorAgent")
                return RoutingDecision(
                    intent=matched_intent,
                    target_agent=agent,
                    confidence=1.0,
                    rationale=f"Explicit user or system intent provided: '{explicit_intent}'",
                )

        # 2. Contextual state overrides
        if active_assessment and any(
            k in cleaned for k in ["submit", "option", "answer", "a", "b", "c", "d"]
        ):
            return RoutingDecision(
                intent=UserIntent.GRADE,
                target_agent="GradingAgent",
                confidence=0.95,
                rationale="Active assessment answer submission detected in session context.",
            )

        # 3. Heuristic Keyword Matching
        for intent, patterns in cls.INTENT_KEYWORDS.items():
            for pattern in patterns:
                if re.search(r"\b" + re.escape(pattern) + r"\b", cleaned):
                    agent = cls.AGENT_MAPPING[intent]
                    return RoutingDecision(
                        intent=intent,
                        target_agent=agent,
                        confidence=0.90,
                        rationale=f"Matched routing trigger pattern '{pattern}' for intent {intent.value}.",
                    )

        # 4. Default: Socratic Tutor
        return RoutingDecision(
            intent=UserIntent.LEARN,
            target_agent="TutorAgent",
            confidence=0.80,
            rationale="Default conversational learning and tutoring intent.",
        )
