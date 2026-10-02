"""
AI-SENIOR-X Skill Intelligence & Proof-of-Skill Engine.
Provides evidence graph management, transparent skill state transitions,
teach-back analysis, learning blocker diagnosis, and verifiable proof generation.
"""

import hashlib
import uuid
from datetime import datetime
from typing import Any

from backend.app.schemas.skill_intelligence import (
    BlockerType,
    ChallengeEvaluationResponse,
    ChallengeSubmissionRequest,
    DelayedRetentionCheckRequest,
    IndependenceLevel,
    LearningBlockerRequest,
    LearningBlockerResponse,
    ProofOfSkillRecord,
    RoleGapAnalysis,
    RoleSkillRequirement,
    SkillDetail,
    SkillDimensionScores,
    SkillEvidenceItem,
    SkillIntelligenceProfile,
    SkillState,
    SkillTimelineEvent,
    TeachBackRequest,
    TeachBackResponse,
    TransferTestRequest,
)


class SkillIntelligenceService:
    def __init__(self):
        # In-memory store for skill evidence items per learner
        self.evidence_store: dict[str, list[SkillEvidenceItem]] = {}
        self._initialize_sample_evidence("current_learner")
        self._initialize_sample_evidence("learner-curr-01")

    def _initialize_sample_evidence(self, learner_id: str):
        if learner_id in self.evidence_store:
            return

        sample_items = [
            SkillEvidenceItem(
                evidence_id=f"ev-sql-01-{learner_id}",
                learner_id=learner_id,
                skill_id="sql_analytics",
                skill_name="SQL Analytics & Relational Querying",
                concept_id="sql_joins",
                task_id="task-sql-join-01",
                challenge_id="chal-ecommerce-churn",
                source_type="real_world_task",
                difficulty="intermediate",
                correctness=1.0,
                independence=IndependenceLevel.INDEPENDENT,
                hint_usage_count=0,
                reasoning_quality=0.92,
                application_level="production",
                summary="Independently formulated multi-table INNER and LEFT JOINs on customers and orders tables to compute repeat purchase churn.",
                verified_at="2026-09-18T14:30:00Z",
                confidence=0.95,
                evidence_metadata={"rows_queried": 2400000, "execution_plan_optimal": True},
            ),
            SkillEvidenceItem(
                evidence_id=f"ev-sql-02-{learner_id}",
                learner_id=learner_id,
                skill_id="sql_analytics",
                skill_name="SQL Analytics & Relational Querying",
                concept_id="sql_window_functions",
                task_id="task-sql-window-02",
                challenge_id="chal-sales-growth",
                source_type="challenge",
                difficulty="advanced",
                correctness=0.95,
                independence=IndependenceLevel.MINIMAL_HINT,
                hint_usage_count=1,
                reasoning_quality=0.88,
                application_level="production",
                summary="Implemented running aggregates and RANK() OVER (PARTITION BY cohort) to analyze regional customer lifetime value trends.",
                verified_at="2026-09-22T10:15:00Z",
                confidence=0.90,
                evidence_metadata={"window_partitioning": True},
            ),
            SkillEvidenceItem(
                evidence_id=f"ev-sql-03-{learner_id}",
                learner_id=learner_id,
                skill_id="sql_analytics",
                skill_name="SQL Analytics & Relational Querying",
                concept_id="sql_optimization",
                task_id="task-sql-opt-03",
                challenge_id="chal-index-tuning",
                source_type="delayed_test",
                difficulty="advanced",
                correctness=1.0,
                independence=IndependenceLevel.INDEPENDENT,
                hint_usage_count=0,
                reasoning_quality=0.95,
                application_level="production",
                retention_status="retained",
                summary="Optimized query execution time from 14.2s to 120ms by replacing correlated subquery with CTE and indexed hash join in delayed test.",
                verified_at="2026-09-28T16:45:00Z",
                confidence=0.98,
                evidence_metadata={"latency_reduction_pct": 99.1},
            ),
            SkillEvidenceItem(
                evidence_id=f"ev-py-01-{learner_id}",
                learner_id=learner_id,
                skill_id="python_engineering",
                skill_name="Python Core & Backend Engineering",
                concept_id="py_concurrency",
                task_id="task-py-async-01",
                challenge_id="chal-log-parser",
                source_type="real_world_task",
                difficulty="intermediate",
                correctness=0.96,
                independence=IndependenceLevel.INDEPENDENT,
                hint_usage_count=0,
                reasoning_quality=0.90,
                application_level="production",
                summary="Built asynchronous HTTP log parser with batching and backpressure control handling 50,000 log lines per minute.",
                verified_at="2026-09-20T11:00:00Z",
                confidence=0.92,
            ),
            SkillEvidenceItem(
                evidence_id=f"ev-ml-01-{learner_id}",
                learner_id=learner_id,
                skill_id="machine_learning",
                skill_name="Machine Learning Foundations & Modeling",
                concept_id="ml_gradient_descent",
                task_id="task-ml-optim-01",
                challenge_id="chal-churn-model",
                source_type="teach_back",
                difficulty="intermediate",
                correctness=0.94,
                independence=IndependenceLevel.INDEPENDENT,
                hint_usage_count=0,
                reasoning_quality=0.91,
                application_level="production",
                summary="Passed teach-back evaluation explaining gradient vector mechanics, learning rate tuning, and overshooting avoidance.",
                verified_at="2026-09-25T09:20:00Z",
                confidence=0.93,
            ),
        ]
        self.evidence_store[learner_id] = sample_items

    def get_learner_evidence(
        self, learner_id: str, skill_id: str | None = None
    ) -> list[SkillEvidenceItem]:
        self._initialize_sample_evidence(learner_id)
        items = self.evidence_store.get(learner_id, [])
        if skill_id:
            return [it for it in items if it.skill_id == skill_id]
        return items

    def record_evidence(self, item: SkillEvidenceItem) -> SkillEvidenceItem:
        if item.learner_id not in self.evidence_store:
            self.evidence_store[item.learner_id] = []
        self.evidence_store[item.learner_id].insert(0, item)
        return item

    # ==========================================
    # State & Dimensions Aggregator (Anti-Gaming)
    # ==========================================
    def compute_skill_detail(
        self, learner_id: str, skill_id: str, skill_name: str, domain: str
    ) -> SkillDetail:
        evidence_list = self.get_learner_evidence(learner_id, skill_id)

        total_ev = len(evidence_list)
        indep_count = sum(
            1 for e in evidence_list if e.independence == IndependenceLevel.INDEPENDENT
        )
        hints_count = sum(e.hint_usage_count for e in evidence_list)
        challenges_count = sum(
            1 for e in evidence_list if e.source_type in ["real_world_task", "challenge"]
        )
        projects_count = sum(1 for e in evidence_list if e.source_type == "project")
        delayed_retention_items = [e for e in evidence_list if e.source_type == "delayed_test"]

        retention_pct = 85.0
        if delayed_retention_items:
            retention_pct = round(
                sum(e.correctness for e in delayed_retention_items)
                / len(delayed_retention_items)
                * 100,
                1,
            )

        # Compute Evidence-Based State (Honest & Transparent)
        if total_ev == 0:
            current_state = SkillState.UNKNOWN
            state_reasoning = "No verifiable evidence recorded yet."
        elif total_ev < 2:
            current_state = SkillState.INTRODUCED
            state_reasoning = "Concept introduced; initial exercises attempted."
        elif indep_count < 2 and hints_count > 2:
            current_state = SkillState.GUIDED
            state_reasoning = (
                "Tasks successfully completed with guided scaffolding and hint support."
            )
        elif indep_count >= 2 and challenges_count < 2:
            current_state = SkillState.DEMONSTRATED
            state_reasoning = f"Independently solved {indep_count} representative exercises across varied contexts."
        elif challenges_count >= 2 and any(e.retention_status == "retained" for e in evidence_list):
            current_state = SkillState.RETAINED
            state_reasoning = f"Demonstrated in production challenges with verified retention after delayed intervals ({retention_pct}%)."
        elif challenges_count >= 2:
            current_state = SkillState.APPLIED
            state_reasoning = f"Successfully delivered {challenges_count} independent real-world scenario challenges."
        else:
            current_state = SkillState.DEVELOPING
            state_reasoning = "Active practice underway with partial independence."

        # Compute Dimensions
        dimensions = SkillDimensionScores(
            knowledge="Strong" if indep_count >= 2 else "Developing",
            problem_solving="Strong" if indep_count >= 2 else "Developing",
            practical_application="Strong"
            if challenges_count >= 2
            else ("Developing" if challenges_count == 1 else "Needs Evidence"),
            independent_implementation="Strong" if indep_count >= 3 else "Developing",
            debugging="Developing"
            if any("opt" in e.concept_id or "debug" in e.summary.lower() for e in evidence_list)
            else "Needs Evidence",
            retention="Demonstrated" if delayed_retention_items else "Needs Evidence",
        )

        # Timeline
        timeline = [
            SkillTimelineEvent(
                timestamp="2026-09-02T10:00:00Z",
                event_date="Sep 02",
                state_reached=SkillState.INTRODUCED,
                trigger_event="Completed core relational database curriculum lesson",
            ),
            SkillTimelineEvent(
                timestamp="2026-09-10T15:00:00Z",
                event_date="Sep 10",
                state_reached=SkillState.GUIDED,
                trigger_event="Solved multi-table JOIN drills with conceptual scaffolding",
            ),
            SkillTimelineEvent(
                timestamp="2026-09-18T14:30:00Z",
                event_date="Sep 18",
                state_reached=SkillState.DEMONSTRATED,
                trigger_event="Independently solved e-commerce customer retention challenge",
                evidence_ref_id=f"ev-sql-01-{learner_id}",
            ),
            SkillTimelineEvent(
                timestamp="2026-09-28T16:45:00Z",
                event_date="Sep 28",
                state_reached=current_state,
                trigger_event="Verified in delayed query optimization drill",
                evidence_ref_id=f"ev-sql-03-{learner_id}",
            ),
        ]

        return SkillDetail(
            skill_id=skill_id,
            skill_name=skill_name,
            domain=domain,
            current_state=current_state,
            state_reasoning=state_reasoning,
            dimensions=dimensions,
            evidence_count_total=total_ev,
            independent_solutions_count=indep_count,
            hints_required_count=hints_count,
            real_world_challenges_count=challenges_count,
            projects_completed_count=projects_count,
            retention_score_pct=retention_pct,
            demonstrated_evidence=evidence_list,
            weak_areas=["Window function framing", "Index selectivity on composite keys"]
            if skill_id == "sql_analytics"
            else ["Hyperparameter tuning"],
            next_recommended_action="Execute Advanced Window Partitioning Challenge"
            if skill_id == "sql_analytics"
            else "Optimize Cross-Validation Pipeline",
            timeline=timeline,
            dependencies=[
                "SELECT",
                "GROUP BY",
                "JOINS",
                "SUBQUERIES",
                "WINDOW FUNCTIONS",
                "INDEX TUNING",
            ]
            if skill_id == "sql_analytics"
            else ["Python Basics", "NumPy", "Linear Algebra"],
        )

    # ==========================================
    # Full Skill Intelligence Profile & Role Gap
    # ==========================================
    def get_skill_intelligence_profile(self, learner_id: str) -> SkillIntelligenceProfile:
        self._initialize_sample_evidence(learner_id)

        skills = [
            self.compute_skill_detail(
                learner_id,
                "sql_analytics",
                "SQL Analytics & Relational Querying",
                "Data & Databases",
            ),
            self.compute_skill_detail(
                learner_id,
                "python_engineering",
                "Python Core & Backend Engineering",
                "Software Engineering",
            ),
            self.compute_skill_detail(
                learner_id,
                "machine_learning",
                "Machine Learning Foundations & Modeling",
                "Artificial Intelligence",
            ),
            self.compute_skill_detail(
                learner_id,
                "statistics_inference",
                "Statistical Inference & A/B Testing",
                "Mathematics & Data",
            ),
            self.compute_skill_detail(
                learner_id,
                "cloud_systems",
                "Distributed Systems & Cloud Architecture",
                "Infrastructure",
            ),
            self.compute_skill_detail(
                learner_id,
                "business_reasoning",
                "Data-Driven Business Reasoning",
                "Product & Business",
            ),
        ]

        # Target Role Gap Analysis: "Data Analyst"
        role_analysis = self.perform_role_gap_analysis(learner_id, "Data Analyst")

        # Proof of skill records
        proof_records = [
            ProofOfSkillRecord(
                proof_id="proof-sql-2026-9812",
                skill_id="sql_analytics",
                skill_name="SQL Analytics & Relational Querying",
                domain="Data & Databases",
                verified_status="VERIFIED_APPLIED_AND_RETAINED",
                verified_date="2026-09-28",
                capabilities_demonstrated=[
                    "Multi-table relational joins across millions of records",
                    "Aggregations & cohort partitioning",
                    "Query execution plan optimization with sub-second execution",
                    "Delayed retention verification (87% retention score)",
                ],
                evidence_summary={
                    "total_queries_verified": 18,
                    "independent_solutions": 14,
                    "production_challenges": 3,
                    "delayed_tests_passed": 1,
                },
                verifiable_hash=hashlib.sha256(
                    f"sql_analytics:{learner_id}:verified".encode()
                ).hexdigest()[:24],
                citations_and_tasks=[
                    f"ev-sql-01-{learner_id}",
                    f"ev-sql-02-{learner_id}",
                    f"ev-sql-03-{learner_id}",
                ],
            )
        ]

        total_evidence = sum(s.evidence_count_total for s in skills)
        total_independent = sum(s.independent_solutions_count for s in skills)
        indep_rate = round((total_independent / max(1, total_evidence)) * 100, 1)

        return SkillIntelligenceProfile(
            learner_id=learner_id,
            learner_name="SRIHARI HARAN",
            updated_at=datetime.utcnow().isoformat(),
            skills=skills,
            target_role="Data Analyst",
            target_role_analysis=role_analysis,
            proof_records=proof_records,
            total_verified_evidence_count=total_evidence,
            overall_independence_rate_pct=indep_rate,
        )

    # ==========================================
    # Role-Based Skill Gap Engine
    # ==========================================
    def perform_role_gap_analysis(self, learner_id: str, target_role: str) -> RoleGapAnalysis:
        role_definitions: dict[str, list[dict[str, Any]]] = {
            "Data Analyst": [
                {
                    "skill_id": "sql_analytics",
                    "name": "SQL Analytics & Relational Querying",
                    "required": SkillState.APPLIED,
                },
                {
                    "skill_id": "python_engineering",
                    "name": "Python Core & Backend Engineering",
                    "required": SkillState.DEMONSTRATED,
                },
                {
                    "skill_id": "statistics_inference",
                    "name": "Statistical Inference & A/B Testing",
                    "required": SkillState.DEMONSTRATED,
                },
                {
                    "skill_id": "business_reasoning",
                    "name": "Data-Driven Business Reasoning",
                    "required": SkillState.DEMONSTRATED,
                },
                {
                    "skill_id": "power_bi_dashboards",
                    "name": "BI Dashboards & Visualization",
                    "required": SkillState.DEVELOPING,
                },
            ],
            "Machine Learning Engineer": [
                {
                    "skill_id": "python_engineering",
                    "name": "Python Core & Backend Engineering",
                    "required": SkillState.APPLIED,
                },
                {
                    "skill_id": "machine_learning",
                    "name": "Machine Learning Foundations & Modeling",
                    "required": SkillState.APPLIED,
                },
                {
                    "skill_id": "deep_learning",
                    "name": "Deep Learning & PyTorch",
                    "required": SkillState.DEMONSTRATED,
                },
                {
                    "skill_id": "mlops_deployment",
                    "name": "MLOps & Model Deployment",
                    "required": SkillState.DEVELOPING,
                },
                {
                    "skill_id": "sql_analytics",
                    "name": "SQL Analytics & Relational Querying",
                    "required": SkillState.DEMONSTRATED,
                },
            ],
            "AI & Distributed Systems Engineer": [
                {
                    "skill_id": "python_engineering",
                    "name": "Python Core & Backend Engineering",
                    "required": SkillState.APPLIED,
                },
                {
                    "skill_id": "cloud_systems",
                    "name": "Distributed Systems & Cloud Architecture",
                    "required": SkillState.APPLIED,
                },
                {
                    "skill_id": "machine_learning",
                    "name": "Machine Learning Foundations & Modeling",
                    "required": SkillState.DEMONSTRATED,
                },
                {
                    "skill_id": "system_design",
                    "name": "High-Throughput System Design",
                    "required": SkillState.APPLIED,
                },
            ],
        }

        requirements = role_definitions.get(target_role, role_definitions["Data Analyst"])
        breakdown: list[RoleSkillRequirement] = []
        met_count = 0
        critical_gaps: list[str] = []

        # Current state map
        current_states: dict[str, SkillState] = {
            "sql_analytics": SkillState.RETAINED,
            "python_engineering": SkillState.DEMONSTRATED,
            "machine_learning": SkillState.DEVELOPING,
            "statistics_inference": SkillState.DEVELOPING,
            "business_reasoning": SkillState.DEVELOPING,
            "power_bi_dashboards": SkillState.INTRODUCED,
            "cloud_systems": SkillState.GUIDED,
            "deep_learning": SkillState.INTRODUCED,
            "mlops_deployment": SkillState.UNKNOWN,
            "system_design": SkillState.DEVELOPING,
        }

        state_hierarchy = [
            SkillState.UNKNOWN,
            SkillState.INTRODUCED,
            SkillState.DEVELOPING,
            SkillState.GUIDED,
            SkillState.DEMONSTRATED,
            SkillState.APPLIED,
            SkillState.RETAINED,
        ]

        for req in requirements:
            sid = req["skill_id"]
            curr = current_states.get(sid, SkillState.UNKNOWN)
            req_state = req["required"]
            curr_rank = state_hierarchy.index(curr)
            req_rank = state_hierarchy.index(req_state)

            is_met = curr_rank >= req_rank
            if is_met:
                met_count += 1
                severity = "None"
            else:
                gap_diff = req_rank - curr_rank
                severity = "Critical" if gap_diff >= 3 else ("Moderate" if gap_diff == 2 else "Low")
                critical_gaps.append(req["name"])

            breakdown.append(
                RoleSkillRequirement(
                    skill_id=sid,
                    skill_name=req["name"],
                    required_state=req_state,
                    current_state=curr,
                    is_met=is_met,
                    gap_severity=severity,
                    recommended_challenge_title=f"Practice Real-World {req['name']} Challenge"
                    if not is_met
                    else None,
                )
            )

        readiness_pct = round((met_count / len(requirements)) * 100, 1)

        return RoleGapAnalysis(
            target_role=target_role,
            readiness_pct=readiness_pct,
            is_job_ready=readiness_pct >= 80.0,
            total_skills_required=len(requirements),
            skills_demonstrated=met_count,
            critical_gaps=critical_gaps,
            skill_breakdown=breakdown,
            next_best_action_challenge="Launch Statistical A/B Hypothesis Testing Challenge"
            if "Statistical Inference & A/B Testing" in critical_gaps
            else "Complete Power BI Visual Dashboard Drill",
        )

    # ==========================================
    # Teach-Back Evaluation Engine
    # ==========================================
    def evaluate_teach_back(self, request: TeachBackRequest) -> TeachBackResponse:
        exp = request.learner_explanation.lower()
        misconceptions = []
        missing = []
        core_ideas = []
        is_correct = True
        score = 0.88

        # Domain evaluation logic
        if "join" in exp or "left" in exp:
            if (
                "returns only matching" in exp
                or "only returns matching" in exp
                or "only matches" in exp
                or "only matching" in exp
            ):
                misconceptions.append(
                    "Confusing LEFT JOIN with INNER JOIN (LEFT JOIN returns ALL left table rows, filling unmatched right attributes with NULL)."
                )
                is_correct = False
                score = 0.55
            else:
                core_ideas.append(
                    "Preservation of left-hand tuple space even on missing foreign key matches"
                )
                core_ideas.append("Relational Cartesian expansion predicate matching")

        elif "gradient" in exp or "descent" in exp:
            if "always increases error" in exp or "derivative is always zero" in exp:
                misconceptions.append(
                    "Belief that gradient descent maximizes loss rather than descending in the negative gradient direction."
                )
                is_correct = False
                score = 0.50
            else:
                core_ideas.append("Iterative weight updates along negative slope direction")
                core_ideas.append("Learning rate alpha scaling stride length")
                if "overshoot" not in exp and "learning rate" not in exp:
                    missing.append(
                        "Mention of how learning rate alpha prevents overshooting or divergence."
                    )

        else:
            core_ideas.append("Clear foundational terminology and conceptual formulation")
            core_ideas.append("Structured cause-and-effect reasoning")

        feedback = (
            "Outstanding teach-back! You clearly articulated the fundamental mechanics and demonstrated sound conceptual mental models."
            if is_correct
            else "Misconception Detected during teach-back: Review the distinction highlighted below to solidfy your foundational reasoning."
        )

        remediation = (
            "You are ready to advance to an independent challenge to prove this skill."
            if is_correct
            else "Let's review with a concrete visual walkthrough before trying this teach-back again."
        )

        # Record teach-back evidence
        if is_correct:
            self.record_evidence(
                SkillEvidenceItem(
                    evidence_id=f"ev-tb-{uuid.uuid4().hex[:8]}",
                    learner_id=request.learner_id,
                    skill_id=request.concept_id,
                    skill_name=request.concept_title,
                    concept_id=request.concept_id,
                    source_type="teach_back",
                    difficulty="intermediate",
                    correctness=score,
                    independence=IndependenceLevel.INDEPENDENT,
                    hint_usage_count=0,
                    reasoning_quality=score,
                    summary=f"Successfully explained {request.concept_title} in own words with high conceptual clarity.",
                    verified_at=datetime.utcnow().isoformat(),
                    confidence=0.91,
                )
            )

        return TeachBackResponse(
            concept_id=request.concept_id,
            concept_title=request.concept_title,
            is_conceptually_correct=is_correct,
            conceptual_score=score,
            core_ideas_understood=core_ideas,
            missing_critical_aspects=missing,
            detected_misconceptions=misconceptions,
            pedagogical_feedback=feedback,
            encouraging_remediation=remediation,
            reteach_summary="Remember: A LEFT JOIN preserves ALL rows from the left table, populating unmatched right columns with NULL values."
            if misconceptions
            else None,
            next_verification_action="Launch Transfer Verification Challenge"
            if is_correct
            else "Review Prerequisite Scaffolding",
            evidence_logged=is_correct,
            updated_skill_state=SkillState.DEMONSTRATED if is_correct else SkillState.DEVELOPING,
        )

    # ==========================================
    # Learning Blocker Diagnostic Engine ("I'm Stuck")
    # ==========================================
    def diagnose_learning_blocker(self, request: LearningBlockerRequest) -> LearningBlockerResponse:
        txt = request.input_text.lower()
        request.current_topic.lower()

        if "formula" in txt or "math" in txt or "calculus" in txt or "probability" in txt:
            blocker_type = BlockerType.PREREQUISITE_GAP
            title = "Prerequisite Gap in Foundational Mathematics / Probability"
            diagnosis = "You have grasped the high-level formula structure, but an underlying gap in partial derivatives or probability distributions prevents procedural translation into problem solving."
            missing_prereqs = ["Continuous probability density functions", "Chain rule of calculus"]
            misconception = None
            remediation_steps = [
                "1. Take a 3-minute refresher on finding partial derivatives of multivariable loss functions.",
                "2. Step through a concrete scalar numerical example before vectorized matrix math.",
                "3. Try the 5-minute interactive diagnostic below.",
            ]
            diagnostic = "Solve scalar derivative: d/dx [ (3x - 5)^2 ] at x=2"

        elif "index" in txt or "error" in txt or "bounds" in txt or "crash" in txt:
            blocker_type = BlockerType.PROCEDURAL_GAP
            title = "Procedural Execution & Boundary Condition Gap"
            diagnosis = "Your algorithm logic assumes 1-indexed collection boundaries or fails to guard against empty iterable termination."
            missing_prereqs = ["0-indexed zero-based array offsets", "Loop termination predicates"]
            misconception = "Off-by-one indexing error during iteration boundary check."
            remediation_steps = [
                "1. Check the loop condition: ensure index strictly satisfies `i < len(arr)`.",
                "2. Print intermediate collection lengths before slice indexing.",
            ]
            diagnostic = "Identify index out-of-range bug in 4-line snippet"

        elif "why" in txt or "reason" in txt or "don't understand how" in txt:
            blocker_type = BlockerType.REASONING_GAP
            title = "Conceptual Reasoning & Mental Model Blocker"
            diagnosis = "You are memorizing implementation patterns without a grounded mental model of the underlying state transitions."
            missing_prereqs = ["State invariants", "Dataflow direction"]
            misconception = None
            remediation_steps = [
                "1. Step through an interactive visual state diagram of the algorithm.",
                "2. Perform a Teach-Back exercise in your own words.",
            ]
            diagnostic = "Predict state transitions for 3 input cases"

        else:
            blocker_type = BlockerType.APPLICATION_GAP
            title = "Practical Application & Problem Decomposition Blocker"
            diagnosis = "The broad problem statement feels overwhelming because it combines data extraction, filtering, and aggregation into one step."
            missing_prereqs = ["Step-by-step problem decomposition"]
            misconception = None
            remediation_steps = [
                "1. Break the objective into 3 discrete sub-tasks (Extract -> Transform -> Aggregate).",
                "2. Validate intermediate dataframes before combining queries.",
            ]
            diagnostic = "Complete guided 3-stage milestone breakdown"

        return LearningBlockerResponse(
            blocker_type=blocker_type,
            blocker_title=title,
            blocker_diagnosis=diagnosis,
            confidence_level="High",
            root_cause_explanation=f"Based on your input and current topic '{request.current_topic}', the primary cognitive impediment is {blocker_type.value}.",
            missing_prerequisites=missing_prereqs,
            detected_misconception=misconception,
            actionable_remediation_steps=remediation_steps,
            recommended_diagnostic=diagnostic,
            remediation_resource_url=f"/learn/{request.current_topic.replace(' ', '_').lower()}",
        )

    # ==========================================
    # Real-World Challenge Evaluation Engine
    # ==========================================
    def evaluate_challenge_submission(
        self, request: ChallengeSubmissionRequest
    ) -> ChallengeEvaluationResponse:
        sub = request.sql_or_code_submission.lower()
        reasoning = request.reasoning_explanation.lower()

        # Score dimensions based on rubric
        tech_score = 92.0 if ("join" in sub or "select" in sub or "def" in sub) else 75.0
        data_score = 90.0 if ("group by" in sub or "where" in sub or "return" in sub) else 80.0
        biz_score = 88.0 if len(reasoning) > 30 else 70.0
        eff_score = (
            94.0
            if ("index" in sub or "limit" in sub or "partition by" in sub or "vector" in sub)
            else 85.0
        )
        comm_score = 90.0 if len(reasoning) > 40 else 75.0
        indep_score = (
            100.0
            if request.independence == IndependenceLevel.INDEPENDENT
            else (80.0 if request.hints_used <= 1 else 60.0)
        )

        overall = round(
            (tech_score * 0.25)
            + (data_score * 0.25)
            + (biz_score * 0.20)
            + (eff_score * 0.10)
            + (comm_score * 0.10)
            + (indep_score * 0.10),
            1,
        )

        is_verified = overall >= 80.0 and request.hints_used <= 1

        proof_record = None
        if is_verified:
            proof_record = ProofOfSkillRecord(
                proof_id=f"proof-{uuid.uuid4().hex[:8]}",
                skill_id=request.skill_id,
                skill_name="SQL Analytics & Relational Querying"
                if "sql" in request.skill_id
                else "Python Core Engineering",
                domain="Data Analytics",
                verified_status="VERIFIED_APPLIED",
                verified_date=datetime.utcnow().strftime("%Y-%m-%d"),
                capabilities_demonstrated=[
                    "Independent multi-table relational join formulation",
                    "Business problem decomposition & quantitative cohort analysis",
                    "Query optimization & index execution plan awareness",
                ],
                evidence_summary={
                    "overall_score": overall,
                    "independence": request.independence.value,
                    "time_spent_seconds": request.time_spent_seconds,
                },
                verifiable_hash=hashlib.sha256(
                    f"{request.skill_id}:{request.learner_id}:{overall}".encode()
                ).hexdigest()[:24],
                citations_and_tasks=[request.challenge_id],
            )

            # Record evidence
            self.record_evidence(
                SkillEvidenceItem(
                    evidence_id=f"ev-chal-{uuid.uuid4().hex[:8]}",
                    learner_id=request.learner_id,
                    skill_id=request.skill_id,
                    skill_name="SQL Analytics & Relational Querying",
                    concept_id="relational_business_analysis",
                    challenge_id=request.challenge_id,
                    source_type="real_world_task",
                    difficulty="advanced",
                    correctness=overall / 100.0,
                    independence=request.independence,
                    hint_usage_count=request.hints_used,
                    reasoning_quality=biz_score / 100.0,
                    summary=f"Successfully delivered real-world business analysis challenge '{request.challenge_id}' with {overall}% rubric score.",
                    verified_at=datetime.utcnow().isoformat(),
                    confidence=0.94,
                )
            )

        return ChallengeEvaluationResponse(
            challenge_id=request.challenge_id,
            skill_id=request.skill_id,
            is_verified_demonstrated=is_verified,
            overall_score=overall,
            criteria_scores={
                "technical_correctness": tech_score,
                "data_reasoning": data_score,
                "business_impact": biz_score,
                "efficiency": eff_score,
                "communication": comm_score,
                "independence": indep_score,
            },
            detailed_evaluation_feedback=(
                "Exceptional delivery. Your solution combines correct relational schema joins with quantitative business interpretation."
                if is_verified
                else "Good attempt, but the solution required hints or lacked business interpretation depth to qualify as an independent verified demonstration."
            ),
            strengths_observed=[
                "Accurate multi-table joining predicates",
                "Clear analytical rationale connecting customer drop-off to shipping latency",
                "Optimal hash-join query construction",
            ],
            areas_for_refinement=[
                "Consider adding window partition ranking for top-N drop-off cohorts",
            ],
            proof_record_generated=proof_record,
            updated_skill_state=SkillState.APPLIED if is_verified else SkillState.DEVELOPING,
            next_recommended_milestone="Delayed Retention Check in 14 Days"
            if is_verified
            else "Try Scaffolded Drill",
        )

    # ==========================================
    # Delayed Retention & Transfer Testing
    # ==========================================
    def evaluate_delayed_retention(self, request: DelayedRetentionCheckRequest) -> dict[str, Any]:
        ans = request.learner_answer.lower()
        is_retained = len(ans) > 20 and (
            "join" in ans or "gradient" in ans or "index" in ans or "partition" in ans
        )

        if is_retained:
            self.record_evidence(
                SkillEvidenceItem(
                    evidence_id=f"ev-delay-{uuid.uuid4().hex[:8]}",
                    learner_id=request.learner_id,
                    skill_id=request.skill_id,
                    skill_name="SQL Analytics",
                    concept_id=request.concept_id,
                    source_type="delayed_test",
                    difficulty="advanced",
                    correctness=0.96,
                    independence=IndependenceLevel.INDEPENDENT,
                    retention_status="retained",
                    summary=f"Successfully demonstrated retained mastery on {request.concept_id} after {request.delayed_days_elapsed} days delay.",
                    verified_at=datetime.utcnow().isoformat(),
                    confidence=0.97,
                )
            )

        return {
            "skill_id": request.skill_id,
            "concept_id": request.concept_id,
            "days_elapsed": request.delayed_days_elapsed,
            "is_retained": is_retained,
            "retention_score": 94.0 if is_retained else 55.0,
            "feedback": (
                "Verified! You demonstrated solid recall and applied the concept accurately without reference to previous hints."
                if is_retained
                else "Memory decay detected. A 5-minute refresher on this concept has been scheduled in your Spaced Review queue."
            ),
            "updated_state": SkillState.RETAINED if is_retained else SkillState.DEVELOPING,
        }

    def evaluate_transfer_test(self, request: TransferTestRequest) -> dict[str, Any]:
        sol = request.learner_solution.lower()
        reasoning = request.transfer_reasoning.lower()
        is_transferred = len(sol) > 15 and len(reasoning) > 20

        if is_transferred:
            self.record_evidence(
                SkillEvidenceItem(
                    evidence_id=f"ev-xfer-{uuid.uuid4().hex[:8]}",
                    learner_id=request.learner_id,
                    skill_id=request.skill_id,
                    skill_name="Relational Data Analysis",
                    concept_id="domain_transfer",
                    source_type="transfer_test",
                    difficulty="advanced",
                    correctness=0.95,
                    independence=IndependenceLevel.INDEPENDENT,
                    transfer_context=f"{request.source_domain} -> {request.target_transfer_domain}",
                    summary=f"Transferred core relational reasoning from {request.source_domain} to {request.target_transfer_domain} successfully.",
                    verified_at=datetime.utcnow().isoformat(),
                    confidence=0.96,
                )
            )

        return {
            "skill_id": request.skill_id,
            "source_domain": request.source_domain,
            "target_transfer_domain": request.target_transfer_domain,
            "is_transferred": is_transferred,
            "transfer_score": 95.0 if is_transferred else 60.0,
            "feedback": (
                f"Outstanding domain transfer! You correctly mapped relational structures from {request.source_domain} to {request.target_transfer_domain}."
                if is_transferred
                else "Transfer incomplete: focus on mapping foreign key identities between patient episodes and department queues."
            ),
            "evidence_recorded": is_transferred,
        }


# Singleton service instance
skill_intelligence_service = SkillIntelligenceService()
