"""AI-SENIOR-X Learning Twin Updater Engine."""

from datetime import UTC, datetime
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database.repositories.learner_profile_repository import LearnerProfileRepository
from backend.app.learning_twin.decay_model import ConceptRetention, MemoryDecayModel
from backend.app.learning_twin.evidence import (
    AssessmentEvidence,
    BaseEvidence,
    CompletionEvidence,
    MisconceptionEvidence,
    PracticeEvidence,
    TutorEvidence,
)
from backend.app.learning_twin.learner_model import LearnerCognitiveSnapshot, LearnerTwin


class TwinUpdater:
    """Consumes learning evidence and deterministically mutates the Learner Twin state."""

    @classmethod
    def apply_evidence_to_twin(cls, twin: LearnerTwin, evidence: BaseEvidence) -> LearnerTwin:
        """Process an incoming piece of learning evidence on a specific twin."""
        concept_key = evidence.concept or evidence.topic
        subject = evidence.subject
        topic = evidence.topic

        # 1. Assessment Evidence Handling
        if isinstance(evidence, AssessmentEvidence):
            twin.knowledge_state.update_concept(
                concept_key=concept_key,
                subject=subject,
                topic=topic,
                is_correct=evidence.is_correct,
                difficulty=evidence.difficulty,
            )

            # Update retention
            retention = twin.retention_map.get(concept_key)
            if not retention:
                retention = ConceptRetention(concept_key=concept_key)
            twin.retention_map[concept_key] = MemoryDecayModel.update_retention_on_practice(
                retention, is_successful=evidence.is_correct
            )

            twin.history.log_event(
                event_type="assessment_answer",
                subject=subject,
                topic=topic,
                concept=concept_key,
                outcome="correct" if evidence.is_correct else "incorrect",
                details={
                    "score_awarded": evidence.score_awarded,
                    "response_time_seconds": evidence.response_time_seconds,
                    "question_id": evidence.question_id,
                },
            )

        # 2. Practice Exercise Evidence Handling
        elif isinstance(evidence, PracticeEvidence):
            twin.knowledge_state.update_concept(
                concept_key=concept_key,
                subject=subject,
                topic=topic,
                is_correct=evidence.completed_successfully,
                difficulty="medium",
            )
            twin.history.log_event(
                event_type="practice_completion",
                subject=subject,
                topic=topic,
                concept=concept_key,
                outcome="success" if evidence.completed_successfully else "failure",
                details={
                    "exercise_id": evidence.exercise_id,
                    "attempts": evidence.attempts_count,
                    "hints": evidence.hints_used_count,
                },
            )

        # 3. Tutor Dialogue Evidence Handling
        elif isinstance(evidence, TutorEvidence):
            twin.history.log_event(
                event_type="tutor_dialogue",
                subject=subject,
                topic=topic,
                concept=concept_key,
                outcome="positive",
                details={
                    "signal": evidence.comprehension_signal,
                    "session_id": evidence.session_id,
                },
            )

        # 4. Misconception Evidence Handling
        elif isinstance(evidence, MisconceptionEvidence):
            twin.misconception_state.record_misconception(
                concept_key=concept_key,
                misconception_tag=evidence.misconception_tag,
                description=evidence.description,
                severity=evidence.severity,
            )
            twin.history.log_event(
                event_type="misconception_detected",
                subject=subject,
                topic=topic,
                concept=concept_key,
                outcome="alert",
                details={"tag": evidence.misconception_tag, "severity": evidence.severity},
            )

        # 5. Module Completion Evidence Handling
        elif isinstance(evidence, CompletionEvidence):
            twin.history.log_event(
                event_type="module_completion",
                subject=subject,
                topic=topic,
                outcome="mastery_achieved",
                details={"module_id": evidence.module_id, "xp": evidence.xp_earned},
            )

        # Periodically evaluate memory decay on all tracked concepts
        MemoryDecayModel.evaluate_decay(twin.retention_map)
        return twin

    def __init__(self):
        self._twins: dict[str, LearnerTwin] = {}

    def get_or_create_twin(self, learner_id: str, user_id: str | None = None) -> LearnerTwin:
        """Retrieve active in-memory twin or initialize new learner instance."""
        if learner_id not in self._twins:
            self._twins[learner_id] = LearnerTwin(
                learner_id=learner_id,
                user_id=user_id or learner_id,
            )
        return self._twins[learner_id]

    def apply_evidence(
        self,
        arg1: Any,
        arg2: Any = None,
    ) -> LearnerTwin:
        """Process learning evidence for the designated learner or twin."""
        if isinstance(self, LearnerTwin) and isinstance(arg1, BaseEvidence):
            return TwinUpdater.apply_evidence_to_twin(self, arg1)
        elif isinstance(arg1, LearnerTwin) and isinstance(arg2, BaseEvidence):
            return self.apply_evidence_to_twin(arg1, arg2)
        elif isinstance(arg1, BaseEvidence):
            twin = self.get_or_create_twin(arg1.learner_id)
            return self.apply_evidence_to_twin(twin, arg1)
        raise ValueError("Invalid argument types passed to apply_evidence.")

    def apply_evidence_to_learner(self, evidence: BaseEvidence) -> LearnerTwin:
        """Instance method applying evidence to the designated learner."""
        return self.apply_evidence(evidence)

    def get_snapshot(self, learner_id: str) -> LearnerCognitiveSnapshot:
        """Retrieve unified cognitive snapshot for the learner."""
        twin = self.get_or_create_twin(learner_id)
        mastery_map: dict[str, float] = {}
        for c_key, c_state in twin.knowledge_state.concepts.items():
            mastery_map[c_key] = c_state.mastery_score
            if c_state.topic:
                mastery_map[c_state.topic] = max(
                    mastery_map.get(c_state.topic, 0.0), c_state.mastery_score
                )
        for topic_key, top_score in twin.knowledge_state.subject_mastery.items():
            mastery_map[topic_key] = top_score

        from backend.app.learning_twin.learner_model import LearnerCognitiveSnapshot

        return LearnerCognitiveSnapshot(
            learner_id=learner_id,
            mastery_levels=mastery_map,
            active_misconceptions=twin.misconception_state.list_active(),
            preferred_learning_style=str(twin.preferences.preferred_learning_style),
            history=twin.history.events,
            summary=twin.get_summary(),
        )

    @classmethod
    async def sync_twin_with_db(
        cls,
        db_session: AsyncSession,
        user_id: str,
        twin: LearnerTwin,
    ) -> None:
        """Persist in-memory Learning Twin state into relational and JSON structures in PostgreSQL."""
        profile_repo = LearnerProfileRepository(db_session)
        profile = await profile_repo.get_by_user_id(user_id)
        if not profile:
            return

        # Update JSON twin state and mastery scores
        profile.mastery_scores = twin.knowledge_state.subject_mastery
        profile.cognitive_twin_state = {
            "summary": twin.get_summary(),
            "concepts_tracked": len(twin.knowledge_state.concepts),
            "active_misconceptions": [
                m.model_dump(mode="json") for m in twin.misconception_state.list_active()
            ],
            "preferences": twin.preferences.model_dump(),
            "last_synced_at": datetime.now(UTC).isoformat(),
        }
        db_session.add(profile)
        await db_session.flush()


twin_updater = TwinUpdater()
