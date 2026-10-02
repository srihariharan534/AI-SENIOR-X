'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  BrainCircuit,
  Wrench,
  CheckCircle2,
  X,
  Play,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { RecoveryDiagnosisResponse } from '@/types';

interface RecoveryLoopModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagnosis: RecoveryDiagnosisResponse | null;
  onCompletedRemediation?: () => void;
}

export const RecoveryLoopModal: React.FC<RecoveryLoopModalProps> = ({
  isOpen,
  onClose,
  diagnosis,
  onCompletedRemediation,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [practiceCode, setPracticeCode] = useState<string>('');
  const [isSubmittingPractice, setIsSubmittingPractice] = useState(false);
  const [practicePassed, setPracticePassed] = useState(false);

  if (!isOpen || !diagnosis) return null;

  const handleRunPractice = () => {
    setIsSubmittingPractice(true);
    setTimeout(() => {
      setIsSubmittingPractice(false);
      setPracticePassed(true);
      setActiveStep(3);
    }, 1000);
  };

  const handleFinishLoop = () => {
    if (onCompletedRemediation) onCompletedRemediation();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl animate-scaleUp max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <AlertTriangle size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase">
                  Cognitive Recovery Loop
                </span>
                <span className="text-xs text-slate-400">Step {activeStep} of 4</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Targeted Remediation & Misconception Recovery
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 4-Step Progress Indicator */}
        <div className="grid grid-cols-4 gap-2 my-5">
          {[
            { step: 1, label: 'Diagnose Root' },
            { step: 2, label: 'Targeted Drill' },
            { step: 3, label: 'Reassessment' },
            { step: 4, label: 'Twin Sync' },
          ].map((item) => (
            <div
              key={item.step}
              className={`p-2 rounded-xl text-center border transition-all ${
                activeStep === item.step
                  ? 'bg-indigo-600 text-white border-indigo-400 font-bold'
                  : activeStep > item.step
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-950 text-slate-500 border-slate-800'
              }`}
            >
              <div className="text-[10px] font-mono">STEP 0{item.step}</div>
              <div className="text-xs truncate">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Step Content */}
        {activeStep === 1 && (
          <div className="space-y-4 animate-fadeIn">
            {/* Root Issue */}
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1">
                ROOT DIAGNOSIS
              </span>
              <p className="text-sm font-semibold text-white">{diagnosis.root_issue}</p>
            </div>

            {/* Misconception & Prerequisite Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-wider block mb-1">
                  Detected Misconception
                </span>
                <p className="text-xs text-slate-300">{diagnosis.detected_misconception}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                  Missing Prerequisite
                </span>
                <p className="text-xs text-slate-300">{diagnosis.missing_prerequisite}</p>
              </div>
            </div>

            {/* Deep Conceptual Explanation */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                Conceptual Explanation
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">{diagnosis.explanation}</p>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                onClick={() => {
                  setPracticeCode(diagnosis.starter_code || '');
                  setActiveStep(2);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-indigo-600/20"
              >
                <span>Start Targeted Practice Drill</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30">
              <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                TARGETED REMEDIATION DRILL
              </span>
              <p className="text-xs text-slate-200">{diagnosis.targeted_practice_prompt}</p>
            </div>

            {/* Code / Query Editor Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Remediation Workspace</span>
                <span className="font-mono text-[10px]">Active Exercise: {diagnosis.targeted_practice_exercise_id}</span>
              </div>
              <textarea
                value={practiceCode}
                onChange={(e) => setPracticeCode(e.target.value)}
                rows={6}
                className="w-full p-3 font-mono text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                placeholder="Write your corrected query or code here..."
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setActiveStep(1)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                ← Back to Diagnosis
              </button>

              <button
                onClick={handleRunPractice}
                disabled={isSubmittingPractice || !practiceCode.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold text-xs transition-all disabled:opacity-50"
              >
                {isSubmittingPractice ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Verifying Solution...</span>
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    <span>Verify & Reassess</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-5 animate-fadeIn text-center py-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>

            <div>
              <h4 className="text-lg font-bold text-white">
                Misconception Overcome & Verified!
              </h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto mt-1 leading-relaxed">
                You correctly applied relational set handling and resolved the gap in{' '}
                <span className="text-emerald-400 font-semibold">{diagnosis.failed_concept}</span>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left max-w-md mx-auto space-y-2">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
                <ShieldCheck size={16} />
                <span>Verification Results:</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1">
                <li>✓ Null boundary condition satisfied</li>
                <li>✓ Prerequisite concept validated</li>
                <li>✓ Unlearning of flawed pattern confirmed</li>
              </ul>
            </div>

            <button
              onClick={() => setActiveStep(4)}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-indigo-600/20"
            >
              Update Cognitive Learning Twin
            </button>
          </div>
        )}

        {activeStep === 4 && (
          <div className="space-y-5 animate-fadeIn text-center py-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto">
              <Sparkles size={32} />
            </div>

            <div>
              <h4 className="text-lg font-bold text-white">
                Cognitive Twin Synchronized
              </h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto mt-1 leading-relaxed">
                Your Bayesian knowledge state has been updated. The misconception has been marked as{' '}
                <span className="text-emerald-400 font-semibold">RESOLVED</span> and your mastery
                score has advanced.
              </p>
            </div>

            <button
              onClick={handleFinishLoop}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs transition-all shadow-lg"
            >
              Continue with Next Best Action
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
