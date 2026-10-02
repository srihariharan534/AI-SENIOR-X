'use client';

import React, { useState } from 'react';
import { CertificateEligibilityCriteria } from '@/types';
import { 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  HelpCircle,
  AlertCircle,
  Award
} from 'lucide-react';

interface EligibilityCheckCardProps {
  eligibility: CertificateEligibilityCriteria;
  onGenerate: (courseId: string, customName?: string) => Promise<void>;
  isGenerating?: boolean;
}

export const EligibilityCheckCard: React.FC<EligibilityCheckCardProps> = ({
  eligibility,
  onGenerate,
  isGenerating = false,
}) => {
  const [showNameModal, setShowNameModal] = useState(false);
  const [registeredName, setRegisteredName] = useState(eligibility.learner_registered_name);

  const handleStartGeneration = () => {
    setShowNameModal(true);
  };

  const handleConfirmGeneration = async () => {
    setShowNameModal(false);
    await onGenerate(eligibility.course_id, registeredName);
  };

  return (
    <div className={`p-6 rounded-2xl border transition-all ${
      eligibility.is_eligible 
        ? 'bg-gradient-to-br from-neutral-900 via-neutral-900 to-blue-950/30 border-blue-600/40 shadow-lg shadow-blue-950/20' 
        : 'bg-neutral-900/60 border-neutral-800/80'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
            {eligibility.category.replace(/_/g, ' ')}
          </span>
          <h3 className="text-lg font-bold text-white mt-0.5">
            {eligibility.course_title}
          </h3>
        </div>

        <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold ${
          eligibility.is_eligible 
            ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300' 
            : 'bg-amber-950/80 border border-amber-500/40 text-amber-300'
        }`}>
          {eligibility.is_eligible ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
          <span>{eligibility.is_eligible ? 'ELIGIBLE' : 'IN PROGRESS'}</span>
        </span>
      </div>

      {/* Criteria Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
        <div className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 text-center">
          <span className="block text-[10px] text-neutral-400 uppercase font-semibold">Lessons</span>
          <span className={`text-xs font-bold ${eligibility.lessons_completed >= eligibility.required_lessons_total ? 'text-emerald-400' : 'text-neutral-300'}`}>
            {eligibility.lessons_completed} / {eligibility.required_lessons_total}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 text-center">
          <span className="block text-[10px] text-neutral-400 uppercase font-semibold">Assessments</span>
          <span className={`text-xs font-bold ${eligibility.assessments_passed >= eligibility.required_assessments_total ? 'text-emerald-400' : 'text-neutral-300'}`}>
            {eligibility.assessments_passed} / {eligibility.required_assessments_total}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 text-center">
          <span className="block text-[10px] text-neutral-400 uppercase font-semibold">Mastery</span>
          <span className={`text-xs font-bold ${eligibility.demonstrated_mastery_pct >= eligibility.minimum_mastery_required_pct ? 'text-emerald-400' : 'text-amber-400'}`}>
            {eligibility.demonstrated_mastery_pct}% <span className="text-[9px] text-neutral-500">(≥{eligibility.minimum_mastery_required_pct}%)</span>
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 text-center">
          <span className="block text-[10px] text-neutral-400 uppercase font-semibold">Real-World</span>
          <span className={`text-xs font-bold ${eligibility.real_world_challenges_completed > 0 ? 'text-emerald-400' : 'text-neutral-400'}`}>
            {eligibility.real_world_challenges_completed > 0 ? 'Passed' : 'Pending'}
          </span>
        </div>
      </div>

      {/* Reasons / Missing Requirements */}
      <div className="my-4 text-xs space-y-1.5">
        {eligibility.is_eligible ? (
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 space-y-1">
            <div className="font-semibold flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>All rigorous criteria verified:</span>
            </div>
            {eligibility.eligibility_reasons.slice(0, 3).map((r, i) => (
              <div key={i} className="text-[11px] text-emerald-400/90 pl-5">• {r}</div>
            ))}
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-neutral-300 space-y-1">
            <div className="font-semibold flex items-center space-x-1.5 text-amber-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Remaining Completion Requirements:</span>
            </div>
            {eligibility.missing_requirements.map((req, i) => (
              <div key={i} className="text-[11px] text-neutral-400 pl-5">• {req}</div>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
        <div className="text-xs text-neutral-400">
          Registered: <span className="font-semibold text-neutral-200">{eligibility.learner_registered_name}</span>
        </div>

        {eligibility.is_eligible ? (
          <button
            onClick={handleStartGeneration}
            disabled={isGenerating}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-semibold text-white transition shadow-lg shadow-blue-900/30 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>{isGenerating ? 'Generating...' : 'Generate Certificate'}</span>
          </button>
        ) : (
          <span className="text-xs font-medium text-neutral-500 flex items-center space-x-1">
            <Lock className="w-3 h-3" />
            <span>Complete requirements to unlock</span>
          </span>
        )}
      </div>

      {/* Name Review Modal */}
      {showNameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-blue-950/80 border border-blue-700/50 text-blue-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Review Registered Name</h4>
                <p className="text-xs text-neutral-400">This verified name will be permanently sealed onto your certificate.</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">
                Official Registered Recipient Name:
              </label>
              <input
                type="text"
                value={registeredName}
                onChange={(e) => setRegisteredName(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white font-serif text-sm tracking-wider uppercase focus:outline-none focus:border-blue-500"
                placeholder="e.g. SRIHARI HARAN"
              />
              <p className="text-[11px] text-neutral-500">
                AI-SENIOR-X enforces registered identity to prevent unverified certificate issuance.
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowNameModal(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmGeneration}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition shadow-sm"
              >
                Confirm &amp; Issue Certificate
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
