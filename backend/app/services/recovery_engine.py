"""Learning Failure to Recovery Loop & Explainable Recommendations Engine."""

from backend.app.schemas.real_world import (
    ExplainableRecommendation,
    RecoveryDiagnosisRequest,
    RecoveryDiagnosisResponse,
)


class RecoveryEngineService:
    """Orchestrates the 8-step learning failure diagnosis & targeted recovery cycle."""

    @staticmethod
    def diagnose_learning_failure(request: RecoveryDiagnosisRequest) -> RecoveryDiagnosisResponse:
        """
        Diagnose a failed question or exercise.
        Identifies the underlying misconception and maps to the fundamental prerequisite.
        """
        concept_lower = request.concept_id.lower()
        ans_lower = request.user_failed_response.lower()

        if "join" in concept_lower or "join" in ans_lower:
            return RecoveryDiagnosisResponse(
                failed_concept="SQL JOINs (INNER vs LEFT JOIN)",
                root_issue="You understand the query syntax, but are confusing INNER JOIN (intersection of non-null keys) with LEFT JOIN (preserving unmatched left table rows).",
                detected_misconception="Assuming INNER JOIN includes rows with unmatched foreign keys or NULL values.",
                missing_prerequisite="Relational Set Cardinality & NULL handling in relational algebra.",
                explanation=(
                    "In relational databases, an INNER JOIN evaluates whether the predicate `a.key = b.key` is TRUE. "
                    "If `b.key` is NULL or there is no matching row in table B, the row is discarded. "
                    "A LEFT JOIN preserves every row from table A, filling table B attributes with NULL when no match exists."
                ),
                targeted_practice_exercise_id="rec-sql-join-01",
                targeted_practice_prompt="Given a `customers` table with 5 rows (1 has no orders) and an `orders` table, write a query that returns all customers and their total spend, ensuring customers with 0 orders are included with $0.00.",
                starter_code="-- Use LEFT JOIN and COALESCE\nSELECT c.name, COALESCE(SUM(o.amount), 0.0) AS total_spend\nFROM customers c\n-- TODO: Complete the join\nGROUP BY c.id, c.name;\n",
            )

        elif "overfit" in concept_lower or "bias" in concept_lower or "variance" in concept_lower:
            return RecoveryDiagnosisResponse(
                failed_concept="Bias-Variance Tradeoff & Regularization",
                root_issue="You are confusing High Bias (underfitting due to overly simplistic models) with High Variance (overfitting due to capturing training noise).",
                detected_misconception="Believing that increasing model parameters or polynomial degrees always improves generalization performance.",
                missing_prerequisite="Generalization Error Decomposition & Validation Loss Dynamics.",
                explanation=(
                    "High Bias occurs when the model assumptions are too restrictive (e.g. fitting a straight line to quadratic data). "
                    "High Variance occurs when the model fits training noise and exhibits large divergence between training loss and validation loss. "
                    "Remediation requires L1/L2 regularization, early stopping, or pruning."
                ),
                targeted_practice_exercise_id="rec-ml-bias-02",
                targeted_practice_prompt="Identify whether adding L2 regularization (Ridge penalty) increases or decreases model bias and variance, and explain why.",
                starter_code="# Explain how the lambda / alpha penalty parameter affects model weights\n",
            )

        elif "generator" in concept_lower or "memory" in concept_lower or "yield" in ans_lower:
            return RecoveryDiagnosisResponse(
                failed_concept="Python Generators & Memory Footprint",
                root_issue="You understand list comprehensions, but are materializing the entire iterable in memory instead of yielding elements lazily.",
                detected_misconception="Treating generators as return-once functions rather than resumable stateful iterators.",
                missing_prerequisite="Python Iterator Protocol (`__iter__` and `__next__`).",
                explanation=(
                    "A function containing `yield` produces a generator object without executing the body immediately. "
                    "Each call to `next()` runs until the next `yield` expression, keeping only one element in RAM at a time."
                ),
                targeted_practice_exercise_id="rec-py-gen-03",
                targeted_practice_prompt="Convert a list-building function into a lazy generator that yields filtered Fibonacci numbers up to N without allocating a list.",
                starter_code="def lazy_fibonacci(limit):\n    a, b = 0, 1\n    while a < limit:\n        yield a\n        a, b = b, a + b\n",
            )

        # Default fallback diagnostic
        return RecoveryDiagnosisResponse(
            failed_concept=request.concept_id,
            root_issue=f"Weakness detected in foundational prerequisite mechanics of '{request.concept_id}'.",
            detected_misconception=f"Incomplete mental model regarding application of {request.concept_id}.",
            missing_prerequisite=f"Foundational concepts of {request.domain}",
            explanation=f"Review the core invariant rules of {request.concept_id} and test each boundary condition step-by-step.",
            targeted_practice_exercise_id=f"rec-{request.domain.lower()}-01",
            targeted_practice_prompt=f"Complete a focused 5-minute drill to solidify your understanding of {request.concept_id}.",
            starter_code="# Focused practice drill\n",
        )

    @staticmethod
    def get_explainable_recommendations(learner_id: str) -> list[ExplainableRecommendation]:
        """
        Generate prioritized recommendations strictly answering:
        WHAT, WHY, EVIDENCE, and NEXT ACTION.
        """
        return [
            ExplainableRecommendation(
                id="rec-action-01",
                what="Review SQL Relational JOINs & Cardinality",
                why="Your last three exercises showed difficulty connecting related tables with non-matching foreign keys.",
                evidence=[
                    "2 incorrect JOIN queries in recent practice session",
                    "Confusion identified between INNER JOIN and LEFT JOIN with NULLs",
                    "1 successfully solved basic SELECT query",
                ],
                prerequisite_context="Database Relationships & Relational Algebra (Set Theory)",
                estimated_effort_minutes=25,
                next_action="Complete a 15-minute relational reasoning challenge on customer order matching.",
                action_type="practice",
                action_target_id="rec-sql-join-01",
            ),
            ExplainableRecommendation(
                id="rec-action-02",
                what="Launch Real-World Log Analyzer Project",
                why="You have demonstrated strong mastery in Python syntax and regex, and are ready to apply them to production scale streaming data.",
                evidence=[
                    "14 Python exercises completed with 78% independent solve rate",
                    "Clean regex parsing demonstration",
                    "Zero syntax errors in last 4 coding sessions",
                ],
                prerequisite_context="Streaming Generators & Error Handling",
                estimated_effort_minutes=45,
                next_action="Build the High-Throughput Web Server Log Analyzer project to earn verifiable portfolio evidence.",
                action_type="project",
                action_target_id="proj-py-01",
            ),
            ExplainableRecommendation(
                id="rec-action-03",
                what="Spaced Repetition Review: 20M Row Query Optimization",
                why="Decay model indicates knowledge retention for composite B-Tree indexing has dropped below 70% threshold.",
                evidence=[
                    "Last assessed 8 days ago",
                    "Predicted memory retention score: 64%",
                    "High relevance to your target career role (Senior Data Engineer)",
                ],
                prerequisite_context="B-Tree Page Structures & EXPLAIN ANALYZE",
                estimated_effort_minutes=15,
                next_action="Complete a 10-minute scenario decision drill on query index selection.",
                action_type="scenario",
                action_target_id="scen-query-02",
            ),
        ]
