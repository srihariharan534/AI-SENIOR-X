'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePractice } from '@/hooks/usePractice';
import { ExerciseCard } from '@/components/practice/ExerciseCard';
import { CodeEditor } from '@/components/practice/CodeEditor';
import { PracticeFeedbackCard } from '@/components/practice/PracticeFeedbackCard';
import { RecoveryLoopModal } from '@/components/practice/RecoveryLoopModal';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Code2, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { api } from '@/lib/api';
import { RecoveryDiagnosisResponse } from '@/types';
import { CoreProductLoop } from '@/components/common/CoreProductLoop';

export default function PracticePage() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get('topic') || 'python_basics';

  const {
    exercise,
    code,
    setCode,
    gradingResult,
    loading,
    submitting,
    error,
    generateNewExercise,
    submitSolution,
  } = usePractice(initialTopic);

  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [recoveryDiagnosis, setRecoveryDiagnosis] = useState<RecoveryDiagnosisResponse | null>(null);

  const handleStartRecovery = async () => {
    try {
      const res = await api.diagnoseRecoveryFailure({
        question_or_task_id: exercise.id || 'ex-current',
        domain: exercise.topic_id || 'Python',
        concept_id: exercise.concept_id || exercise.topic_id || 'Core Invariant',
        user_failed_response: code,
        expected_concept: exercise.title || 'Optimal Solution',
      });

      if (res.success && res.data) {
        setRecoveryDiagnosis(res.data);
        setIsRecoveryOpen(true);
      }
    } catch (e) {
      console.error('Failed to diagnose recovery', e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <Code2 size={26} className="text-cyan-400" />
              Adaptive Practice & Code IDE
            </h1>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              AI-Graded
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Dynamic challenges generated to reinforce developing concepts and eliminate misconceptions.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => generateNewExercise(exercise.topic_id)}
          loading={loading}
          icon={<RefreshCw size={14} />}
        >
          <span>Generate New Challenge</span>
        </Button>
      </div>

      {/* Core Loop Indicator */}
      <CoreProductLoop currentActiveStep={6} compact />

      {/* Two Column Workspace: Exercise Spec on Left, IDE + Feedback on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 5 Cols: Exercise Spec */}
        <div className="lg:col-span-5 space-y-4">
          <ExerciseCard exercise={exercise} />
        </div>

        {/* Right 7 Cols: Code Editor + Feedback Output */}
        <div className="lg:col-span-7 space-y-4">
          <div className="h-[420px]">
            <CodeEditor
              code={code}
              onChange={setCode}
              onSubmit={submitSolution}
              submitting={submitting}
              onReset={() => setCode(exercise.starter_code)}
            />
          </div>

          {/* Feedback Output Card if graded */}
          {gradingResult && (
            <PracticeFeedbackCard
              result={gradingResult}
              onNextExercise={() => generateNewExercise(exercise.topic_id)}
              onStartRecovery={handleStartRecovery}
            />
          )}
        </div>
      </div>

      {/* Recovery Loop Modal */}
      <RecoveryLoopModal
        isOpen={isRecoveryOpen}
        onClose={() => setIsRecoveryOpen(false)}
        diagnosis={recoveryDiagnosis}
        onCompletedRemediation={() => {
          generateNewExercise(exercise.topic_id);
        }}
      />
    </div>
  );
}
