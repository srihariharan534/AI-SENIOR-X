'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  AlertTriangle,
  X,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { api } from '@/lib/api';
import { LearningBlockerResponse } from '@/types';

interface LearningBlockerModalProps {
  currentTopic?: string;
  onClose: () => void;
}

export const LearningBlockerModal: React.FC<LearningBlockerModalProps> = ({
  currentTopic = 'Machine Learning & Optimization',
  onClose,
}) => {
  const [inputText, setInputText] = useState('');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<LearningBlockerResponse | null>(null);

  const handleDiagnose = async () => {
    if (!inputText.trim()) return;
    setIsDiagnosing(true);

    try {
      const res = await api.diagnoseLearningBlocker({
        input_text: inputText,
        current_topic: currentTopic,
      });

      if (res.success && res.data) {
        setDiagnosis(res.data);
      }
    } catch (e) {
      console.error('Failed to diagnose learning blocker', e);
    } finally {
      setIsDiagnosing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl max-w-2xl w-full space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <HelpCircle size={22} />
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                LEARNING BLOCKER DETECTOR
              </span>
              <h3 className="text-lg font-bold text-white">I Don't Know Where I'm Stuck</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Tell us what you are trying to solve or what feels confusing. The AI will analyze whether your blocker is a
          missing prerequisite, a subtle misconception, or a procedural gap.
        </p>

        {/* Input Area */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Describe what feels confusing or paste error context:
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={4}
            placeholder="e.g. I understand the formula for gradient descent, but I can't solve the matrix problems because the calculus notation is overwhelming..."
            className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 resize-none font-sans leading-relaxed"
          />
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-500">Analyzes 9 cognitive blocker dimensions</span>
          <button
            onClick={handleDiagnose}
            disabled={isDiagnosing || !inputText.trim()}
            className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isDiagnosing ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Diagnosing Blocker...</span>
              </>
            ) : (
              <>
                <Sparkles size={14} />
                <span>Diagnose Learning Blocker</span>
              </>
            )}
          </button>
        </div>

        {/* Diagnosis Results */}
        {diagnosis && (
          <div className="p-5 rounded-3xl bg-slate-950 border border-amber-500/40 shadow-xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-400" />
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                    {diagnosis.blocker_type}
                  </span>
                  <h4 className="text-sm font-bold text-white">{diagnosis.blocker_title}</h4>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Confidence: {diagnosis.confidence_level}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{diagnosis.blocker_diagnosis}</p>

            {/* Missing Prerequisites */}
            {diagnosis.missing_prerequisites && diagnosis.missing_prerequisites.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200 space-y-1">
                <span className="font-bold text-indigo-300 uppercase tracking-wider block">
                  Identified Prerequisite Gaps:
                </span>
                <ul className="space-y-1">
                  {diagnosis.missing_prerequisites.map((p, i) => (
                    <li key={i}>• {p}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended 5-Minute Diagnostic */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-200 space-y-1">
              <span className="font-bold text-emerald-400 uppercase tracking-wider block">
                Recommended 5-Minute Targeted Diagnostic:
              </span>
              <p className="font-mono text-[11px] text-emerald-300">{diagnosis.recommended_diagnostic}</p>
            </div>

            {/* Remediation Steps */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Actionable Remediation Roadmap:
              </span>
              <ul className="space-y-1 text-xs text-slate-300">
                {diagnosis.actionable_remediation_steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                Apply Remediation & Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
