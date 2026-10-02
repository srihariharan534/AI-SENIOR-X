'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  HelpCircle,
  ArrowRight,
  Clock,
  Layers,
  CheckCircle2,
  SlidersHorizontal,
  X,
  ShieldAlert,
} from 'lucide-react';
import { ExplainableRecommendation } from '@/types';

interface ExplainableRecommendationCardProps {
  recommendation: ExplainableRecommendation;
  onActionClick?: (rec: ExplainableRecommendation) => void;
}

export const ExplainableRecommendationCard: React.FC<ExplainableRecommendationCardProps> = ({
  recommendation,
  onActionClick,
}) => {
  const [showInspector, setShowInspector] = useState(false);
  const [showPreferenceModal, setShowPreferenceModal] = useState(false);
  const [goalPreference, setGoalPreference] = useState('job-ready');

  return (
    <>
      <div className="group relative bg-gradient-to-br from-slate-900/90 via-slate-950 to-indigo-950/30 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 shadow-lg transition-all duration-300">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 uppercase">
              {recommendation.action_type}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock size={12} />
              <span>{recommendation.estimated_effort_minutes} min</span>
            </div>
          </div>

          <button
            onClick={() => setShowInspector(true)}
            className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-indigo-300 transition-colors bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-800"
            title="Inspect AI Reasoning"
          >
            <HelpCircle size={13} />
            <span>Why this?</span>
          </button>
        </div>

        {/* WHAT Title */}
        <h4 className="text-base font-bold text-white group-hover:text-indigo-200 transition-colors mb-2">
          {recommendation.what}
        </h4>

        {/* WHY Summary */}
        <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {recommendation.why}
        </p>

        {/* Evidence Chips */}
        <div className="space-y-1.5 mb-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Layers size={11} />
            <span>Evidence from Learning Twin</span>
          </div>
          {recommendation.evidence.slice(0, 2).map((ev, idx) => (
            <div
              key={idx}
              className="flex items-start gap-1.5 text-xs text-slate-300"
            >
              <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{ev}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={() => onActionClick && onActionClick(recommendation)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20 active:scale-[0.98]"
        >
          <span>{recommendation.next_action || 'Start Action'}</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* "Why am I seeing this?" Inspector Modal */}
      {showInspector && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Explainable Recommendation</h3>
                  <p className="text-xs text-slate-400">Human-Centered AI Transparency</p>
                </div>
              </div>
              <button
                onClick={() => setShowInspector(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="my-5 space-y-4 text-xs text-slate-300">
              {/* WHAT */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="font-mono text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                  1. WHAT WAS RECOMMENDED
                </span>
                <p className="text-sm font-semibold text-white">{recommendation.what}</p>
              </div>

              {/* WHY */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="font-mono text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                  2. WHY THIS ACTION WAS CHOSEN
                </span>
                <p className="leading-relaxed">{recommendation.why}</p>
              </div>

              {/* EVIDENCE */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="font-mono text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-2">
                  3. EMPIRICAL EVIDENCE USED
                </span>
                <ul className="space-y-1.5">
                  {recommendation.evidence.map((ev, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-200">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* PREREQUISITES */}
              {recommendation.prerequisite_context && (
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="font-mono text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                    4. PREREQUISITE CONTEXT
                  </span>
                  <p>{recommendation.prerequisite_context}</p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setShowInspector(false);
                  setShowPreferenceModal(true);
                }}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-300 transition-colors"
              >
                <SlidersHorizontal size={14} />
                <span>Adjust Learning Preferences</span>
              </button>

              <button
                onClick={() => {
                  setShowInspector(false);
                  if (onActionClick) onActionClick(recommendation);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors"
              >
                Proceed with Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Learning Preferences Modal */}
      {showPreferenceModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Adjust Learning Direction</h3>
              <button
                onClick={() => setShowPreferenceModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="my-5 space-y-3">
              <p className="text-xs text-slate-300">
                You are in control. Override AI guidance or adapt priorities to your immediate goals:
              </p>

              {[
                { id: 'job-ready', title: 'Senior Job-Readiness & Projects', desc: 'Prioritize production scenarios and portfolio evidence.' },
                { id: 'foundations', title: 'Deep Conceptual Foundations', desc: 'Focus on prerequisite mastery and mathematical proofs.' },
                { id: 'rapid-review', title: 'Spaced Repetition & Rapid Drills', desc: 'Maximize retention and speed up review intervals.' },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    goalPreference === opt.id
                      ? 'bg-indigo-950/60 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="goal"
                    checked={goalPreference === opt.id}
                    onChange={() => setGoalPreference(opt.id)}
                    className="mt-1 accent-indigo-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">{opt.title}</div>
                    <div className="text-[11px] text-slate-400">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowPreferenceModal(false)}
                className="px-3 py-2 rounded-xl text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowPreferenceModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
