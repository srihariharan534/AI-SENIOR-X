'use client';

import React, { useState } from 'react';
import {
  Repeat,
  Sparkles,
  X,
  Send,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { api } from '@/lib/api';
import { TeachBackResponse } from '@/types';

interface TeachBackModalProps {
  conceptId: string;
  conceptTitle: string;
  onClose: () => void;
  onVerified?: () => void;
}

export const TeachBackModal: React.FC<TeachBackModalProps> = ({
  conceptId,
  conceptTitle,
  onClose,
  onVerified,
}) => {
  const [explanation, setExplanation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<TeachBackResponse | null>(null);

  const handleSubmit = async () => {
    if (!explanation.trim()) return;
    setIsSubmitting(true);

    try {
      const res = await api.submitTeachBack({
        concept_id: conceptId,
        concept_title: conceptTitle,
        learner_explanation: explanation,
      });

      if (res.success && res.data) {
        setResult(res.data);
        if (res.data.is_conceptually_correct && onVerified) {
          onVerified();
        }
      }
    } catch (e) {
      console.error('Failed to evaluate teach-back', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 shadow-2xl max-w-2xl w-full space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Repeat size={22} />
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                FLAGSHIP TEACH-BACK VERIFICATION
              </span>
              <h3 className="text-lg font-bold text-white">Teach It Back: {conceptTitle}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Prompt Card */}
        <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-1 text-xs">
          <span className="font-bold text-indigo-300 uppercase tracking-wider block">
            Pedagogical Instruction:
          </span>
          <p className="text-slate-200 leading-relaxed">
            Explain <strong>{conceptTitle}</strong> as if you were teaching another student or junior colleague from scratch.
            Detail the core intuition, mechanics, common pitfalls, and why it matters in production systems.
          </p>
        </div>

        {/* Input Area */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Your Explanation (Type or Dictate):
          </label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            rows={5}
            placeholder="e.g. When performing a LEFT JOIN, the database engine preserves all tuples from the left relation, attaching matching foreign keys from the right relation or populating NULLs if no corresponding key matches..."
            className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none font-sans leading-relaxed"
          />
        </div>

        {/* Submit Action */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-500">
            Evaluates conceptual clarity &amp; checks for misconceptions
          </span>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !explanation.trim()}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Evaluating Explanation...</span>
              </>
            ) : (
              <>
                <Send size={14} />
                <span>Submit Teach-Back for AI Review</span>
              </>
            )}
          </button>
        </div>

        {/* Evaluation Results */}
        {result && (
          <div
            className={`p-5 rounded-3xl border shadow-xl space-y-4 animate-scaleUp ${
              result.is_conceptually_correct
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="flex items-center justify-between border-b border-current/20 pb-2.5">
              <div className="flex items-center gap-2">
                {result.is_conceptually_correct ? (
                  <CheckCircle2 size={18} className="text-emerald-400" />
                ) : (
                  <AlertTriangle size={18} className="text-amber-400" />
                )}
                <h4 className="text-sm font-bold text-white">
                  {result.is_conceptually_correct
                    ? 'Teach-Back Verified & Concept Demonstrated!'
                    : 'Misconception Detected During Teach-Back'}
                </h4>
              </div>
              <span className="text-xs font-mono font-bold">
                Score: {Math.round(result.conceptual_score * 100)}%
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {result.pedagogical_feedback}
            </p>

            {/* Detected Misconceptions */}
            {result.detected_misconceptions && result.detected_misconceptions.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-rose-500/30 text-xs text-rose-300 space-y-1">
                <span className="font-bold text-rose-400 uppercase tracking-wider block">
                  Misconception Identified:
                </span>
                <ul className="space-y-1">
                  {result.detected_misconceptions.map((m, i) => (
                    <li key={i}>• {m}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reteach Summary */}
            {result.reteach_summary && (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 text-xs text-amber-200 space-y-1">
                <span className="font-bold text-amber-400 uppercase tracking-wider block">
                  Key Pedagogical Correction:
                </span>
                <p className="leading-relaxed">{result.reteach_summary}</p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-current/20">
              <span>{result.encouraging_remediation}</span>
              {result.is_conceptually_correct && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Continue Learning →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
