'use client';

import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  X,
  Send,
  Sparkles,
  RefreshCw,
  Lightbulb,
  ShieldCheck,
} from 'lucide-react';
import { api } from '@/lib/api';
import { ChallengeEvaluationResponse, SkillDetail } from '@/types';

interface SkillChallengeModalProps {
  skill: SkillDetail;
  onClose: () => void;
  onChallengeVerified?: () => void;
}

export const SkillChallengeModal: React.FC<SkillChallengeModalProps> = ({
  skill,
  onClose,
  onChallengeVerified,
}) => {
  const [codeSubmission, setCodeSubmission] = useState(`-- E-Commerce Repeat Purchase Drop-off Analysis
WITH customer_order_intervals AS (
    SELECT customer_id, order_date,
           LAG(order_date) OVER(PARTITION BY customer_id ORDER BY order_date) as prev_order_date
    FROM orders
)
SELECT customer_id, AVG(DATEDIFF(day, prev_order_date, order_date)) as avg_repurchase_days
FROM customer_order_intervals
GROUP BY customer_id;`);
  const [reasoning, setReasoning] = useState(
    'The 14% decrease in repeat orders correlates with delivery delays stretching the median repurchase interval from 24 days to 41 days. Triggering proactive notifications at day 28 can re-engage at-risk cohorts.'
  );
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<ChallengeEvaluationResponse | null>(null);

  const handleEvaluate = async () => {
    if (!codeSubmission.trim() || !reasoning.trim()) return;
    setIsEvaluating(true);

    try {
      const res = await api.evaluateSkillChallenge({
        challenge_id: 'chal-ecommerce-churn-01',
        skill_id: skill.skill_id,
        sql_or_code_submission: codeSubmission,
        reasoning_explanation: reasoning,
        hints_used: hintsUsed,
        independence: hintsUsed === 0 ? 'INDEPENDENT' : 'MINIMAL_HINT',
      });

      if (res.success && res.data) {
        setEvaluation(res.data);
        if (res.data.is_verified_demonstrated && onChallengeVerified) {
          onChallengeVerified();
        }
      }
    } catch (e) {
      console.error('Failed to evaluate skill challenge', e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 shadow-2xl max-w-3xl w-full space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Award size={22} />
            </div>
            <div>
              <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">
                REAL-WORLD SKILL VERIFICATION CHALLENGE
              </span>
              <h3 className="text-lg font-bold text-white">
                Customer Churn &amp; Retention Analytics — {skill.skill_name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Business Scenario Prompt */}
        <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-indigo-300 uppercase tracking-wider">Business Context:</span>
            <span className="text-slate-400 font-mono">Dataset: 2.4M records (customers, orders, payments)</span>
          </div>
          <p className="text-slate-200 leading-relaxed">
            An e-commerce marketplace has experienced a <strong>14% quarter-over-quarter drop</strong> in repeat customer purchases.
            Formulate the analytical query to compute customer repurchase intervals and provide data-backed recommendations.
          </p>
        </div>

        {/* Editor Inputs */}
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              1. SQL / Code Implementation:
            </label>
            <textarea
              value={codeSubmission}
              onChange={(e) => setCodeSubmission(e.target.value)}
              rows={6}
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-200 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              2. Data Reasoning &amp; Business Impact Explanation:
            </label>
            <textarea
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              rows={3}
              className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none font-sans"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={() => setHintsUsed((prev) => prev + 1)}
            className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <Lightbulb size={13} className="text-amber-400" />
            <span>Request Hint ({hintsUsed} used)</span>
          </button>

          <button
            onClick={handleEvaluate}
            disabled={isEvaluating}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isEvaluating ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Evaluating Submission Rubric...</span>
              </>
            ) : (
              <>
                <Send size={14} />
                <span>Submit Work for Proof-of-Skill Evaluation</span>
              </>
            )}
          </button>
        </div>

        {/* Evaluation Output */}
        {evaluation && (
          <div className="p-5 rounded-3xl bg-slate-950 border border-indigo-500/40 shadow-xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border ${
                    evaluation.is_verified_demonstrated
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  }`}
                >
                  {evaluation.overall_score}%
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {evaluation.is_verified_demonstrated
                      ? 'PROOF OF SKILL VERIFIED & RECORDED!'
                      : 'Challenge Evaluated — Needs Minor Refinement'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    State Transition: <strong className="text-indigo-300">{evaluation.updated_skill_state}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Rubric Breakdown Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
              {Object.entries(evaluation.criteria_scores).map(([k, v]) => (
                <div key={k} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block truncate">
                    {k.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-300">{v}%</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {evaluation.detailed_evaluation_feedback}
            </p>

            {/* Proof Record Chip if generated */}
            {evaluation.proof_record_generated && (
              <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-purple-400" />
                  <span>Verifiable Proof Record Created: <strong>{evaluation.proof_record_generated.proof_id}</strong></span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">
                  {evaluation.proof_record_generated.verifiable_hash.slice(0, 12)}...
                </span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
              <span>Next Milestone: {evaluation.next_recommended_milestone}</span>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                Close &amp; Return
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
