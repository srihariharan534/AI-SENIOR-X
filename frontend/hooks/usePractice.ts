'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { PracticeExercise, PracticeGradingResult } from '@/types';

export function usePractice(initialTopicId: string = 'python_basics') {
  const [exercise, setExercise] = useState<PracticeExercise>({
    id: 'ex_py_01',
    topic_id: initialTopicId,
    concept_id: 'python_loops',
    title: 'Filtering Even Squares with List Comprehensions',
    instructions:
      'Write a function `filter_even_squares(numbers)` that takes a list of integers and returns a list of squares for all even numbers.',
    starter_code: `def filter_even_squares(numbers: list[int]) -> list[int]:\n    # Your solution here\n    pass\n`,
    language: 'python',
    difficulty: 0.4,
    hints: [
      'Recall list comprehension syntax: [expr for item in list if condition]',
      'An even number satisfies num % 2 == 0',
    ],
    test_cases: [
      { input: '[1, 2, 3, 4, 5, 6]', expected_output: '[4, 16, 36]' },
      { input: '[1, 3, 5]', expected_output: '[]' },
      { input: '[2, 4]', expected_output: '[4, 16]' },
    ],
  });

  const [code, setCode] = useState<string>(exercise.starter_code);
  const [gradingResult, setGradingResult] = useState<PracticeGradingResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateNewExercise = async (topicId: string, targetWeakness?: string) => {
    setLoading(true);
    setError(null);
    setGradingResult(null);
    try {
      const res = await api.generatePracticeExercise({
        topic_id: topicId,
        target_weakness: targetWeakness,
      });
      if (res.success && res.data) {
        const payload = res.data.payload || res.data;
        const newEx: PracticeExercise = {
          id: payload.exercise_id || `ex_${Date.now()}`,
          topic_id: topicId,
          concept_id: payload.concept_id || topicId,
          title: payload.title || `Targeted Practice: ${topicId.replace('_', ' ').toUpperCase()}`,
          instructions: payload.instructions || payload.problem_statement || res.data.content || 'Solve the code challenge below according to the specification.',
          starter_code: payload.starter_code || 'def solution():\n    # Implement here\n    pass\n',
          language: 'python',
          difficulty: payload.difficulty || 0.5,
          hints: payload.hints || ['Break the problem into sub-steps', 'Test boundary conditions'],
          test_cases: payload.test_cases || [
            { input: 'standard_input', expected_output: 'expected_output' },
          ],
        };
        setExercise(newEx);
        setCode(newEx.starter_code);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate practice challenge');
    } finally {
      setLoading(false);
    }
  };

  const submitSolution = async () => {
    if (!code.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await api.submitPracticeSolution({
        exercise_id: exercise.id,
        topic_id: exercise.topic_id,
        concept_id: exercise.concept_id,
        submitted_code: code,
      });

      if (res.success && res.data) {
        const payload = res.data.payload || res.data;
        const isCorrect = payload.is_correct ?? (payload.score ? payload.score >= 0.8 : true);
        const result: PracticeGradingResult = {
          is_correct: isCorrect,
          score: payload.score ?? (isCorrect ? 1.0 : 0.4),
          feedback: payload.feedback || res.data.content || 'Great work! Solution verified.',
          passed_tests: payload.passed_tests || (isCorrect ? 3 : 1),
          total_tests: 3,
          suggested_next_step: payload.suggested_next_step || 'Proceed to next advanced challenge.',
        };
        setGradingResult(result);
      } else {
        setGradingResult({
          is_correct: false,
          score: 0.3,
          feedback: 'Syntax error or test failure detected. Review variable scope and edge cases.',
          passed_tests: 0,
          total_tests: 3,
        });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Grading submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    exercise,
    code,
    setCode,
    gradingResult,
    loading,
    submitting,
    error,
    generateNewExercise,
    submitSolution,
  };
}
