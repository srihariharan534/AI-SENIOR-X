'use client';

import React from 'react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { PracticeGradingResult } from '@/types';
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

interface PracticeFeedbackCardProps {
  result: PracticeGradingResult;
  onNextExercise?: () => void;
  onStartRecovery?: () => void;
}

export const PracticeFeedbackCard: React.FC<PracticeFeedbackCardProps> = ({
  result,
  onNextExercise,
  onStartRecovery,
}) => {
  const isPass = result.is_correct;

  return (
    <Card
      className={`border-2 transition-all ${
        isPass
          ? 'bg-gradient-to-br from-emerald-950/30 via-slate-900/80 to-slate-900/80 border-emerald-500/40'
          : 'bg-gradient-to-br from-rose-950/30 via-slate-900/80 to-slate-900/80 border-rose-500/40'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isPass ? (
            <CheckCircle2 size={22} className="text-emerald-400" />
          ) : (
            <XCircle size={22} className="text-rose-400" />
          )}
          <div>
            <h4 className="text-base font-bold text-white">
              {isPass ? 'Exercise Solved Successfully!' : 'Solution Needs Revision'}
            </h4>
            <span className="text-xs text-slate-400">
              Tests Passed: {result.passed_tests}/{result.total_tests} ({Math.round((result.passed_tests / result.total_tests) * 100)}%)
            </span>
          </div>
        </div>

        <Badge variant={isPass ? 'emerald' : 'rose'} size="md">
          {Math.round(result.score * 100)}% Score
        </Badge>
      </div>

      {/* Feedback Body */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 leading-relaxed my-3 whitespace-pre-wrap">
        {result.feedback}
      </div>

      {/* Misconception Alert if triggered */}
      {result.misconception_detected && (
        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex items-start justify-between gap-2 mb-3">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Cognitive Misconception Flagged:</strong>
              <span>{result.misconception_detected.description}</span>
            </div>
          </div>
          {onStartRecovery && (
            <button
              onClick={onStartRecovery}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shrink-0 transition-colors shadow-sm"
            >
              Enter Recovery Loop
            </button>
          )}
        </div>
      )}

      {/* Next Step Action */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/80 mt-2">
        <span className="text-xs text-slate-400">
          {result.suggested_next_step || (isPass ? 'Difficulty will adapt upward.' : 'Try adjusting the logic.')}
        </span>
        <div className="flex items-center gap-2">
          {!isPass && onStartRecovery && !result.misconception_detected && (
            <button
              onClick={onStartRecovery}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
            >
              Diagnose & Recover
            </button>
          )}
          {onNextExercise && (
            <Button
              variant={isPass ? 'primary' : 'outline'}
              size="sm"
              onClick={onNextExercise}
              icon={<ArrowRight size={14} />}
            >
              <span>Next Adaptive Challenge</span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
