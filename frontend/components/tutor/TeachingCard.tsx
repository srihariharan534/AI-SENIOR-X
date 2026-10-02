'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  Code2,
  Cpu,
  Layers,
  FileText,
  RotateCcw,
  Check,
  X,
  Volume2,
  Eye,
  Sliders,
} from 'lucide-react';
import { MultimodalDoubtResponse, UnderstandingCheck } from '@/types';
import { api } from '@/lib/api';

export type MultimodalDoubtResult = MultimodalDoubtResponse;

export interface TeachingCardProps {
  response: MultimodalDoubtResponse;
  onQuickControlClick?: (action: string) => void;
  onQuickStrategy?: (
    doubtId: string,
    action: 'simpler' | 'example' | 'visual' | 'deeper' | 'hint' | 'quiz' | 'explain_again' | 'why' | 'real_world'
  ) => void;
  onUnderstandingAnswered?: () => void;
}

export const TeachingCard: React.FC<TeachingCardProps> = ({
  response,
  onQuickControlClick,
  onQuickStrategy,
  onUnderstandingAnswered,
}) => {
  const [selectedOptionKey, setSelectedOptionKey] = useState<string | null>(null);
  const [isSubmittingCheck, setIsSubmittingCheck] = useState(false);
  const [checkFeedback, setCheckFeedback] = useState<string | null>(null);
  const [isCorrectCheck, setIsCorrectCheck] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'explanation' | 'visual' | 'example' | 'application'>('explanation');

  const check = response.understanding_check;

  const handleOptionSelect = async (key: string, optIndex?: number) => {
    if (selectedOptionKey || !check) return;
    setSelectedOptionKey(key);
    setIsSubmittingCheck(true);

    try {
      const res = await api.submitUnderstandingCheck({
        check_id: check.question_id || (check as any).id || 'check-1',
        concept_id: (response as any).concept_id || response.concept,
        selected_key: key,
        selected_option_index: optIndex,
      });

      if (res.success && res.data) {
        setIsCorrectCheck(res.data.is_correct);
        setCheckFeedback(res.data.feedback);
        if (onUnderstandingAnswered) onUnderstandingAnswered();
      } else {
        // Fallback calculation if offline
        const isCorrect = check.correct_option_index !== undefined ? optIndex === check.correct_option_index : true;
        setIsCorrectCheck(isCorrect);
        setCheckFeedback(isCorrect ? 'Correct! Strong conceptual grasp demonstrated.' : `Review the concept: ${check.hint || 'Check parameter interactions carefully.'}`);
      }
    } catch (e) {
      console.error('Failed to submit understanding check', e);
      setIsCorrectCheck(true);
      setCheckFeedback('Answer recorded into Learning Twin.');
    } finally {
      setIsSubmittingCheck(false);
    }
  };

  const quickButtons = [
    { id: 'simpler', label: 'Explain simpler', icon: Sparkles },
    { id: 'example', label: 'Give an example', icon: Lightbulb },
    { id: 'visual', label: 'Show visually', icon: Eye },
    { id: 'deeper', label: 'Go deeper', icon: Layers },
    { id: 'hint', label: 'Give me a hint', icon: HelpCircle },
    { id: 'quiz', label: 'Quiz me', icon: CheckCircle2 },
    { id: 'again', label: 'Explain again', icon: RotateCcw },
    { id: 'why', label: 'Why?', icon: HelpCircle },
    { id: 'real_world', label: 'Apply to real world', icon: Cpu },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/30 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 relative overflow-hidden animate-fadeIn">
      {/* Top Badges & Modality Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
            {response.classification || (response as any).doubt_category || 'Conceptual'}
          </span>
          <span className="text-xs font-semibold text-white">{response.concept || (response as any).concept_name}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            Strategy: {response.teaching_strategy_used}
          </span>
          {(response.why_chain_depth > 0 || ((response as any).why_chain_count > 0)) && (
            <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              Why Chain #{response.why_chain_depth || (response as any).why_chain_count}
            </span>
          )}
        </div>
      </div>

      {/* Uncertainty Clarification Warning if OCR/Image is ambiguous */}
      {response.is_uncertain && response.uncertainty_clarification_prompt && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 space-y-1">
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <AlertTriangle size={15} />
            <span>Uncertainty Clarification Needed:</span>
          </div>
          <p className="leading-relaxed">{response.uncertainty_clarification_prompt}</p>
        </div>
      )}

      {/* Missing Prerequisites Alert */}
      {((response.prerequisites_required && response.prerequisites_required.length > 0) ||
        ((response as any).missing_prerequisites && (response as any).missing_prerequisites.length > 0)) && (
        <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-indigo-300">
            <Layers size={14} />
            <span>Foundational Prerequisite Gap:</span>
          </div>
          <ul className="text-[11px] text-indigo-300 list-disc list-inside">
            {(response.prerequisites_required || (response as any).missing_prerequisites || []).map((p: string, idx: number) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Internal Navigation Tabs (Explanation, Visual, Example, Real-World) */}
      <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('explanation')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'explanation'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Explanation
        </button>
        {response.visual_diagram && (
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              activeTab === 'visual'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye size={13} />
            <span>Visual Diagram</span>
          </button>
        )}
        {response.worked_example && (
          <button
            onClick={() => setActiveTab('example')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'example'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Worked Example
          </button>
        )}
        {response.real_world_application && (
          <button
            onClick={() => setActiveTab('application')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'application'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Real-World Use
          </button>
        )}
      </div>

      {/* TAB 1: EXPLANATION MARKDOWN */}
      {activeTab === 'explanation' && (
        <div className="space-y-4 text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            {response.explanation || (response as any).explanation_markdown}
          </div>

          {/* Step-by-step breakdown if available */}
          {response.step_by_step_breakdown && response.step_by_step_breakdown.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                Step-by-Step Breakdown:
              </span>
              <ul className="space-y-1 text-slate-300">
                {response.step_by_step_breakdown.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Why It Matters */}
          {response.why_it_matters && (
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
              <Lightbulb size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold mb-0.5">Why this matters:</strong>
                <span>{response.why_it_matters}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: VISUAL CONCEPT CANVAS */}
      {activeTab === 'visual' && response.visual_diagram && (
        <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-indigo-500/30">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white">{response.visual_diagram.title}</h4>
            <span className="text-[10px] font-mono text-indigo-400 uppercase">
              {response.visual_diagram.diagram_type}
            </span>
          </div>
          {response.visual_diagram.description && (
            <p className="text-xs text-slate-300">{response.visual_diagram.description}</p>
          )}

          {/* Mermaid / Flow Diagram Preformatted Block */}
          {response.visual_diagram.mermaid_code && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-indigo-300 overflow-x-auto whitespace-pre">
              {response.visual_diagram.mermaid_code}
            </div>
          )}

          {/* Interactive Nodes Exploration */}
          {response.visual_diagram.nodes && response.visual_diagram.nodes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              {response.visual_diagram.nodes.map((node) => (
                <div key={node.id} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px]">
                  <span className="font-bold text-white block">{node.label}</span>
                  <span className="text-slate-400 text-[10px]">{node.category || node.shape}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: WORKED STEP-BY-STEP EXAMPLE */}
      {activeTab === 'example' && (
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono space-y-2 whitespace-pre-wrap">
          <span className="text-[10px] font-sans font-bold text-emerald-400 uppercase tracking-wider block">
            Step-by-Step Worked Resolution:
          </span>
          {response.worked_example}
        </div>
      )}

      {/* TAB 4: REAL-WORLD APPLICATION */}
      {activeTab === 'application' && (
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-bold">
            <Cpu size={16} />
            <span>Production Industry Use Case:</span>
          </div>
          <p className="leading-relaxed">{response.real_world_application}</p>
          <a
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs text-indigo-300 font-semibold hover:text-indigo-100"
          >
            <span>Launch Real-World Challenge Workspace</span>
            <ArrowRight size={13} />
          </a>
        </div>
      )}

      {/* Document Citations */}
      {response.citations && response.citations.length > 0 && (
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
          <FileText size={15} className="text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-slate-300 font-semibold">Grounded in Uploaded Material:</span>{' '}
            {response.citations[0].title || (response.citations[0] as any).document_title || 'Document'} (Page {response.citations[0].page || (response.citations[0] as any).page_number || 1})
          </div>
        </div>
      )}

      {/* SECTION: ACTIVE UNDERSTANDING CHECK PROBE */}
      {check && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-indigo-950/40 border border-indigo-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Check Your Understanding
              </span>
            </div>
            <span className="text-[10px] font-mono text-indigo-300">
              {((check as any).check_type || 'MULTIPLE CHOICE').toUpperCase()}
            </span>
          </div>

          <p className="text-xs text-slate-200 font-medium leading-relaxed">
            {check.question || (check as any).prompt}
          </p>

          {/* Options Grid */}
          <div className="space-y-2 pt-1">
            {(check.options || []).map((opt: any, idx: number) => {
              const optKey = typeof opt === 'string' ? opt.charAt(0) : opt.key || String.fromCharCode(65 + idx);
              const optText = typeof opt === 'string' ? opt : opt.text;
              const isOptionCorrect = typeof opt === 'string'
                ? check.correct_option_index !== undefined ? idx === check.correct_option_index : true
                : opt.is_correct;

              const isSelected = selectedOptionKey === optKey;
              const showCorrect = selectedOptionKey && isOptionCorrect;
              const showIncorrect = isSelected && !isOptionCorrect;

              return (
                <button
                  key={idx}
                  disabled={!!selectedOptionKey || isSubmittingCheck}
                  onClick={() => handleOptionSelect(optKey, idx)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start justify-between gap-3 ${
                    showCorrect
                      ? 'bg-emerald-950/60 border-emerald-500 text-white font-semibold'
                      : showIncorrect
                      ? 'bg-rose-950/60 border-rose-500 text-white font-semibold'
                      : isSelected
                      ? 'bg-indigo-950/60 border-indigo-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-indigo-500/40 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono font-bold text-indigo-400">{optKey}.</span>
                    <span>{optText}</span>
                  </div>
                  {showCorrect && <Check size={16} className="text-emerald-400 shrink-0" />}
                  {showIncorrect && <X size={16} className="text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Evaluation Feedback */}
          {checkFeedback && (
            <div
              className={`p-3 rounded-xl border text-xs leading-relaxed animate-fadeIn ${
                isCorrectCheck
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
              }`}
            >
              {checkFeedback}
            </div>
          )}
        </div>
      )}

      {/* QUICK TEACHING CONTROLS TOOLBAR (Section 32) */}
      <div className="pt-2 border-t border-slate-800">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Sliders size={11} />
          <span>Quick Teaching Strategy Controls:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickButtons.map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.id}
                onClick={() => {
                  if (onQuickStrategy) {
                    onQuickStrategy(response.doubt_id, btn.id as any);
                  } else if (onQuickControlClick) {
                    onQuickControlClick(btn.id);
                  }
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300 hover:text-white hover:bg-indigo-600/30 hover:border-indigo-500/50 transition-colors"
              >
                <Icon size={12} className="text-indigo-400" />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
