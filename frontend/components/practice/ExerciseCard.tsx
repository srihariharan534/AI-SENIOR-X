'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { PracticeExercise } from '@/types';
import { HelpCircle, ChevronDown, ChevronUp, Code2, Sparkles, CheckCircle2 } from 'lucide-react';

interface ExerciseCardProps {
  exercise: PracticeExercise;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
  const [showHints, setShowHints] = useState(false);

  return (
    <Card className="h-full flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="indigo" size="sm">
            {exercise.topic_id.toUpperCase()}
          </Badge>
          <span className="text-xs font-mono text-slate-400">
            Difficulty: <strong className="text-indigo-300">{Math.round(exercise.difficulty * 100)}%</strong>
          </span>
        </div>

        <h3 className="text-base font-bold text-white">{exercise.title}</h3>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
          {exercise.instructions}
        </div>

        {/* Test Cases Preview */}
        {exercise.test_cases && exercise.test_cases.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Example Test Cases
            </h4>
            <div className="space-y-1.5 font-mono text-xs">
              {exercise.test_cases.map((tc, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px]"
                >
                  <span className="text-slate-300">Input: <code className="text-cyan-300">{tc.input}</code></span>
                  <span className="text-slate-400">Expected: <code className="text-emerald-300">{tc.expected_output}</code></span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hints Drawer */}
      {exercise.hints && exercise.hints.length > 0 && (
        <div className="pt-4 mt-4 border-t border-slate-800">
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center justify-between w-full text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <HelpCircle size={14} />
              <span>Pedagogical Hints ({exercise.hints.length})</span>
            </div>
            {showHints ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showHints && (
            <div className="mt-2.5 space-y-1.5">
              {exercise.hints.map((hint, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200"
                >
                  {hint}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
