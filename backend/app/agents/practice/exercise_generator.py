"""AI-SENIOR-X Practice Exercise Generator."""

import uuid

from pydantic import BaseModel, Field


class PracticeExercise(BaseModel):
    """Schema for a targeted interactive practice task."""

    exercise_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    topic_id: str
    concept_id: str
    difficulty: float = Field(..., ge=0.0, le=1.0)
    exercise_type: str = "code_fix"  # code_fix, fill_blank, implementation, algorithmic_drill
    prompt_instruction: str
    starter_code: str | None = None
    solution_code: str | None = None
    hints: list[str] = Field(default_factory=list)
    test_cases: list[dict[str, str]] = Field(default_factory=list)


class PracticeExerciseGenerator:
    """Generates targeted exercises aimed at remediating weak concepts and cementing mastery."""

    @classmethod
    def generate_exercise(
        cls,
        topic_id: str,
        concept_id: str,
        difficulty: float = 0.5,
        target_weakness: str | None = None,
    ) -> PracticeExercise:
        """Create structured interactive practice task."""
        concept_clean = concept_id.replace("_", " ").title()

        if "join" in concept_id.lower() or "sql" in topic_id.lower():
            return PracticeExercise(
                title=f"SQL Query Practice: {concept_clean}",
                topic_id=topic_id,
                concept_id=concept_id,
                difficulty=difficulty,
                exercise_type="implementation",
                prompt_instruction=(
                    "Write an SQL query to retrieve all student names and their enrolled courses, "
                    "including students who have not enrolled in any courses yet."
                ),
                starter_code="-- Complete the query using the appropriate JOIN\nSELECT s.name, c.title\nFROM students s\n",
                solution_code="SELECT s.name, c.title\nFROM students s\nLEFT JOIN enrollments e ON s.id = e.student_id\nLEFT JOIN courses c ON e.course_id = c.id;",
                hints=[
                    "Consider which table must retain all rows even when there is no matching record.",
                    "An INNER JOIN would filter out students without courses; use a LEFT JOIN instead.",
                ],
                test_cases=[
                    {
                        "input": "students(3), enrollments(1)",
                        "expected": "3 rows returned with nulls for un-enrolled",
                    }
                ],
            )

        if "async" in concept_id.lower() or "python" in topic_id.lower():
            return PracticeExercise(
                title=f"Python Async Drill: {concept_clean}",
                topic_id=topic_id,
                concept_id=concept_id,
                difficulty=difficulty,
                exercise_type="code_fix",
                prompt_instruction=(
                    "Fix the blocking bug in the following concurrent worker function so that tasks "
                    "run asynchronously with `asyncio.gather`."
                ),
                starter_code="import asyncio\nimport time\n\nasync def fetch_data(id: int):\n    # BUG: Blocking call inside coroutine\n    time.sleep(1)\n    return f'data_{id}'\n\nasync def main():\n    results = await asyncio.gather(fetch_data(1), fetch_data(2))\n    return results\n",
                solution_code="import asyncio\n\nasync def fetch_data(id: int):\n    await asyncio.sleep(1)\n    return f'data_{id}'\n\nasync def main():\n    results = await asyncio.gather(fetch_data(1), fetch_data(2))\n    return results\n",
                hints=[
                    "Look for synchronous blocking functions like `time.sleep()` inside coroutines.",
                    "Replace blocking operations with their non-blocking `await asyncio.sleep()` counterpart.",
                ],
                test_cases=[{"input": "main()", "expected": "completes in ~1.0s rather than 2.0s"}],
            )

        # General Concept / AI / ML Practice Drill
        return PracticeExercise(
            title=f"Concept Application Drill: {concept_clean}",
            topic_id=topic_id,
            concept_id=concept_id,
            difficulty=difficulty,
            exercise_type="implementation",
            prompt_instruction=(
                f"Implement the core logic for `{concept_id}` in `{topic_id}` to prevent {target_weakness or 'errors'}."
            ),
            starter_code=f"def compute_{concept_id}(x, y):\n    # TODO: Implement robust computation\n    pass\n",
            solution_code=f"def compute_{concept_id}(x, y):\n    if y == 0:\n        raise ValueError('Invalid parameter')\n    return (x - y) / (x + y)\n",
            hints=[
                f"Identify the mathematical formula for {concept_clean}.",
                "Add defensive boundary checks for edge case inputs.",
            ],
            test_cases=[{"input": "x=10, y=5", "expected": "computed score"}],
        )
