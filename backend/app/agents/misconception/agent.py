"""AI-SENIOR-X Misconception Agent."""

from backend.app.agents.contract import AgentRequest, AgentResponse, BaseEducationalAgent
from backend.app.agents.misconception.misconception_detector import (
    MisconceptionDetectionResult,
    MisconceptionDetector,
)
from backend.app.agents.misconception.misconception_library import CURATED_MISCONCEPTIONS
from backend.app.learning_twin.evidence import MisconceptionEvidence


class MisconceptionAgent(BaseEducationalAgent):
    """Specialized agent diagnosing cognitive flaws and formulating targeted remediation interventions."""

    @property
    def name(self) -> str:
        return "MisconceptionAgent"

    @property
    def capabilities(self) -> list[str]:
        return [
            "root_cause_diagnosis",
            "misconception_detection",
            "remediation_generation",
            "counterexample_synthesis",
            "cognitive_evidence_emission",
        ]

    async def process(self, request: AgentRequest) -> AgentResponse:
        """Diagnose misconception from student input or assessment mistake."""
        query_text = request.query
        concept_hint = request.concept_id or (
            request.topic_id.lower().replace(" ", "_") if request.topic_id else None
        )

        detection: MisconceptionDetectionResult | None = MisconceptionDetector.detect_from_text(
            text=query_text,
            concept_hint=concept_hint,
        )

        if not detection:
            # Default to first library item matching topic or general diagnostic
            first_key = next(iter(CURATED_MISCONCEPTIONS))
            item = CURATED_MISCONCEPTIONS[first_key]
            detection = MisconceptionDetectionResult(
                misconception_id=item.id,
                concept_id=item.concept_id,
                title=item.title,
                confidence=0.50,
                misconception_statement=item.misconception_statement,
                accurate_conception=item.accurate_conception,
                remediation_strategy=item.remediation_strategy,
                trigger_signal="General misconception diagnostic",
            )

        evidence = MisconceptionEvidence(
            learner_id=request.learner_id,
            session_id=request.session_id,
            concept_id=detection.concept_id,
            misconception_id=detection.misconception_id,
            description=detection.title,
            confidence=detection.confidence,
            trigger_event=f"Diagnosed from: '{query_text[:100]}'",
        )

        content = (
            f"### 🔍 Cognitive Diagnostic: {detection.title}\n\n"
            f'**Common Misconception:** "{detection.misconception_statement}"\n\n'
            f"**Accurate Principle:** {detection.accurate_conception}\n\n"
            f"**Recommended Remediation:** {detection.remediation_strategy}"
        )

        return AgentResponse(
            request_id=request.request_id,
            agent_name=self.name,
            status="success",
            result=detection.model_dump(),
            content=content,
            evidence=[evidence],
            confidence=detection.confidence,
            next_suggested_action="PRACTICE",
        )
