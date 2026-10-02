'use client';

import React, { useState } from 'react';
import {
  Mic,
  MessageSquare,
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { api } from '@/lib/api';
import { InterviewTurnResponse } from '@/types';

export const InterviewCoachPanel: React.FC = () => {
  const [interviewType, setInterviewType] = useState('system_design');
  const [targetRole, setTargetRole] = useState('Senior AI & Distributed Systems Engineer');
  const [currentQuestion, setCurrentQuestion] = useState(
    'How would you design a distributed rate limiter that handles 200,000 QPS with sub-millisecond overhead?'
  );
  const [learnerAnswer, setLearnerAnswer] = useState('');
  const [turnIndex, setTurnIndex] = useState(1);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<InterviewTurnResponse | null>(null);

  const handleEvaluateTurn = async () => {
    if (!learnerAnswer.trim()) return;
    setIsEvaluating(true);

    try {
      const res = await api.evaluateInterviewTurn({
        interview_type: interviewType,
        target_role: targetRole,
        turn_index: turnIndex,
        current_question: currentQuestion,
        learner_answer: learnerAnswer,
      });

      if (res.success && res.data) {
        setEvaluation(res.data);
        if (res.data.follow_up_question) {
          setCurrentQuestion(res.data.follow_up_question);
          setTurnIndex((prev) => prev + 1);
          setLearnerAnswer('');
        }
      }
    } catch (e) {
      console.error('Failed to evaluate interview turn', e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Session Config */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Award className="text-purple-400" size={18} />
            <h3 className="text-base font-bold text-white">AI Mock Interview Mentor</h3>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
            >
              <option value="system_design">System Design Interview</option>
              <option value="coding">Coding & Algorithms Interview</option>
              <option value="sql">SQL & Analytics Interview</option>
              <option value="ml">Machine Learning & MLOps</option>
              <option value="technical">Core Technical / CS Foundations</option>
              <option value="hr">Behavioral / Leadership (STAR)</option>
            </select>
          </div>
        </div>

        {/* Current Interview Question */}
        <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-bold text-purple-400 uppercase tracking-wider">
              INTERVIEW QUESTION #{turnIndex}
            </span>
            <span className="text-slate-400">{targetRole}</span>
          </div>
          <p className="text-sm font-bold text-white leading-relaxed">{currentQuestion}</p>
        </div>

        {/* Answer Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Your Response (Speak or Type):
          </label>
          <textarea
            value={learnerAnswer}
            onChange={(e) => setLearnerAnswer(e.target.value)}
            rows={5}
            className="w-full p-4 text-xs bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 focus:outline-none focus:border-purple-500 resize-none font-sans leading-relaxed"
            placeholder="Structure your response (e.g. 1. High-level architecture, 2. Redis token bucket with Lua scripts, 3. Multi-region latency & fallback strategies)..."
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleEvaluateTurn}
            disabled={isEvaluating || !learnerAnswer.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {isEvaluating ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Evaluating Response & Identifying Gaps...</span>
              </>
            ) : (
              <>
                <MessageSquare size={14} />
                <span>Submit Response for AI Review</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Evaluation Results */}
      {evaluation && (
        <div className="bg-slate-900 border border-purple-500/30 rounded-3xl p-6 shadow-2xl space-y-5 animate-scaleUp">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center font-bold text-sm">
                {evaluation.evaluation?.score ?? (evaluation as any).score ?? 85}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Interview Turn Evaluation</h4>
                <p className="text-xs text-slate-400">
                  {evaluation.evaluation?.pedagogical_explanation || (evaluation as any).feedback_summary || 'Detailed answer evaluation and feedback.'}
                </p>
              </div>
            </div>
          </div>

          {/* Criteria Breakdown if present */}
          {(evaluation as any).evaluation_criteria_scores && (
            <div className="grid grid-cols-3 gap-2 text-center">
              {Object.entries((evaluation as any).evaluation_criteria_scores).map(([key, val]) => (
                <div key={key} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold truncate">
                    {key.replace(/_/g, ' ')}
                  </div>
                  <div className="text-xs font-mono font-bold text-purple-400">{val as string}%</div>
                </div>
              ))}
            </div>
          )}

          {/* Identified Gaps */}
          {(evaluation.evaluation?.gaps_identified || (evaluation as any).identified_gaps) && (
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-amber-400 uppercase tracking-wider block">
                Candidate Gaps Identified:
              </span>
              <ul className="space-y-1">
                {(evaluation.evaluation?.gaps_identified || (evaluation as any).identified_gaps || []).map((g: string, i: number) => (
                  <li key={i}>○ {g}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Ideal Response Formulation */}
          {(evaluation.evaluation?.exemplary_model_answer || (evaluation as any).ideal_response_formulation) && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 space-y-1">
              <span className="font-bold text-emerald-400 uppercase tracking-wider block">
                Exemplary Formulation:
              </span>
              <p className="leading-relaxed">
                {evaluation.evaluation?.exemplary_model_answer || (evaluation as any).ideal_response_formulation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
