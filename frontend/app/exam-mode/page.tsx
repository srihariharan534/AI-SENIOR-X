'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Progress } from '@/components/common/Progress';
import {
  FileCheck2,
  Timer,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

interface ExamQuestion {
  id: string;
  prompt: string;
  concept_key: string;
  options: { key: string; text: string }[];
  correct_option: string;
  explanation: string;
}

export default function ExamModePage() {
  const searchParams = useSearchParams();
  const topicId = searchParams.get('topic') || 'ml_supervised';

  const [questions] = useState<ExamQuestion[]>([
    {
      id: 'q1',
      prompt: 'When training a deep neural network, what is the primary cause of vanishing gradients when using Sigmoid activation functions in hidden layers?',
      concept_key: 'gradient_vanishing',
      options: [
        { key: 'A', text: 'The derivative of Sigmoid has a maximum value of 0.25, causing multiplicative gradient decay.' },
        { key: 'B', text: 'Sigmoid activation functions produce unbounded positive outputs that overflow floats.' },
        { key: 'C', text: 'The learning rate dynamically scales to zero during the second epoch.' },
        { key: 'D', text: 'Backpropagation does not compute chain rule products for transcendental functions.' },
      ],
      correct_option: 'A',
      explanation: 'Because d/dx(Sigmoid) <= 0.25, repeated multiplication through N hidden layers causes gradients to vanish exponentially toward zero.',
    },
    {
      id: 'q2',
      prompt: 'In SQL relational databases, what distinguishes a LEFT OUTER JOIN from an INNER JOIN when table A has rows with no matching foreign key in table B?',
      concept_key: 'sql_left_join',
      options: [
        { key: 'A', text: 'LEFT JOIN discards unmatched rows from table A.' },
        { key: 'B', text: 'LEFT JOIN preserves all rows from table A, filling columns of table B with NULL.' },
        { key: 'C', text: 'INNER JOIN automatically generates synthetic keys to match unmatched rows.' },
        { key: 'D', text: 'LEFT JOIN converts string columns into integer indices.' },
      ],
      correct_option: 'B',
      explanation: 'A LEFT JOIN preserves every row from the left table, populating missing matching attributes from the right table with NULL values.',
    },
    {
      id: 'q3',
      prompt: 'In supervised machine learning, if your model achieves 99.5% training accuracy but only 64.0% validation accuracy, which phenomenon is occurring?',
      concept_key: 'overfitting',
      options: [
        { key: 'A', text: 'High Bias / Underfitting' },
        { key: 'B', text: 'Optimal Generalization' },
        { key: 'C', text: 'High Variance / Overfitting' },
        { key: 'D', text: 'Data Leakage between folds' },
      ],
      correct_option: 'C',
      explanation: 'A large discrepancy between high training accuracy and low validation accuracy is the hallmark of high variance / overfitting.',
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSelectOption = (optionKey: string) => {
    if (isSubmitted) return;
    const qId = questions[currentIndex].id;
    setSelectedAnswers({ ...selectedAnswers, [qId]: optionKey });
  };

  const toggleMarkReview = () => {
    const qId = questions[currentIndex].id;
    setMarkedForReview({ ...markedForReview, [qId]: !markedForReview[qId] });
  };

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  // Calculate Results
  const computeResults = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct_option) {
        correct++;
      }
    });
    return {
      score: correct,
      total: questions.length,
      pct: Math.round((correct / questions.length) * 100),
    };
  };

  const results = computeResults();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Exam Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <FileCheck2 size={24} className="text-emerald-400" />
              Diagnostic Evaluation Checkpoint
            </h1>
            <Badge variant="emerald" size="sm">
              Exam Mode
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Focus: <strong className="text-slate-200">{topicId.replace('_', ' ').toUpperCase()}</strong> | Question {currentIndex + 1} of {questions.length}
          </p>
        </div>

        {!isSubmitted && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm font-bold text-amber-400">
              <Timer size={16} />
              <span>{formatTime(timeLeft)}</span>
            </div>
            <Button
              variant="glow"
              size="sm"
              onClick={() => setIsSubmitted(true)}
              disabled={answeredCount === 0}
            >
              <span>Submit Exam</span>
            </Button>
          </div>
        )}
      </div>

      {!isSubmitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Question Area (Left 8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <Card className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <Badge variant="indigo" size="sm">
                  Question {currentIndex + 1}
                </Badge>
                <button
                  onClick={toggleMarkReview}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                    markedForReview[currentQ.id]
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Bookmark size={13} />
                  <span>{markedForReview[currentQ.id] ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                {currentQ.prompt}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedAnswers[currentQ.id] === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectOption(opt.key)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {opt.key}
                      </span>
                      <span className="mt-0.5 leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  icon={<ArrowLeft size={14} />}
                >
                  <span>Previous</span>
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  disabled={currentIndex === questions.length - 1}
                  icon={<ArrowRight size={14} />}
                >
                  <span>Next Question</span>
                </Button>
              </div>
            </Card>
          </div>

          {/* Question Navigator (Right 4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="p-4 space-y-4">
              <CardHeader>
                <CardTitle className="text-xs">Question Navigator</CardTitle>
                <span className="text-[11px] font-mono text-slate-400">{answeredCount}/{questions.length} Answered</span>
              </CardHeader>

              <div className="grid grid-cols-4 gap-2">
                {questions.map((q, idx) => {
                  const isAnswered = !!selectedAnswers[q.id];
                  const isCurrent = idx === currentIndex;
                  const isMarked = markedForReview[q.id];

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-10 rounded-xl font-bold text-xs transition-all relative ${
                        isCurrent
                          ? 'border-2 border-indigo-400 text-white'
                          : ''
                      } ${
                        isAnswered
                          ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      <span>{idx + 1}</span>
                      {isMarked && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500/40 border border-emerald-500 inline-block" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block" />
                  <span>Marked for review</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* Results Report */
        <div className="space-y-6">
          <Card className="p-6 space-y-6 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border-indigo-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Diagnostic Exam Completed
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  Overall Score: {results.pct}% ({results.score}/{results.total} Correct)
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Evidence successfully synchronized with your Learning Twin.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="/learning-twin"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
                >
                  View Updated Twin
                </a>
              </div>
            </div>

            {/* Detailed Question Review */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold text-white">Question by Question Breakdown</h3>

              {questions.map((q, idx) => {
                const userAns = selectedAnswers[q.id];
                const isCorrect = userAns === q.correct_option;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border space-y-2 ${
                      isCorrect
                        ? 'bg-emerald-950/20 border-emerald-500/30'
                        : 'bg-rose-950/20 border-rose-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <CheckCircle2 size={18} className="text-emerald-400" />
                        ) : (
                          <XCircle size={18} className="text-rose-400" />
                        )}
                        <h4 className="text-xs font-bold text-white">
                          Question {idx + 1}: {q.concept_key.replace('_', ' ').toUpperCase()}
                        </h4>
                      </div>
                      <Badge variant={isCorrect ? 'emerald' : 'rose'} size="sm">
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-300">{q.prompt}</p>

                    <div className="text-xs font-mono text-slate-400 space-y-0.5">
                      <div>Your Answer: <strong className={isCorrect ? 'text-emerald-300' : 'text-rose-300'}>{userAns || 'None'}</strong></div>
                      <div>Correct Answer: <strong className="text-emerald-300">{q.correct_option}</strong></div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300">
                      <strong className="block text-indigo-300 mb-0.5">Explanation:</strong>
                      <span>{q.explanation}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
