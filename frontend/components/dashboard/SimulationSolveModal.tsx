'use client';

import React, { useState } from 'react';
import {
  X,
  Briefcase,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Award,
  Clock,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { IndustrySimulationItem } from '@/types/curriculum';

interface SimulationSolveModalProps {
  simulation: IndustrySimulationItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SimulationSolveModal: React.FC<SimulationSolveModalProps> = ({
  simulation,
  isOpen,
  onClose,
}) => {
  const [code, setCode] = useState<string>(
    simulation?.starterCode ||
      `import numpy as np\nimport pandas as pd\n\ndef detect_suspicious_patterns(transactions_df: pd.DataFrame) -> pd.DataFrame:\n    # Vectorized anomaly scoring implementation\n    pass`
  );
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    overallScore: number;
    passed: boolean;
    scores: { category: string; score: number; feedback: string }[];
    evidenceHash: string;
  } | null>(null);

  if (!isOpen || !simulation) return null;

  const handleEvaluate = () => {
    setIsEvaluating(true);
    setEvaluationResult(null);

    setTimeout(() => {
      setIsEvaluating(false);
      setEvaluationResult({
        overallScore: 92,
        passed: true,
        scores: [
          { category: 'Correctness (25%)', score: 24, feedback: 'Accurate rolling 10-minute velocity and geographic delta.' },
          { category: 'Code Quality (15%)', score: 14, feedback: 'Clean vectorized operations without unneeded Python for-loops.' },
          { category: 'Performance (20%)', score: 19, feedback: 'P99 inference execution achieved in 18.4ms (within 25ms budget).' },
          { category: 'Reasoning (15%)', score: 14, feedback: 'Clear threshold logic based on precision-recall curve.' },
          { category: 'Edge Cases (10%)', score: 9, feedback: 'Handled null geolocation values gracefully.' },
          { category: 'Architecture (10%)', score: 9, feedback: 'Non-blocking async-ready modular function signature.' },
          { category: 'Business Interpretation (5%)', score: 5, feedback: 'Estimated $380k monthly reduction in merchant dispute claims.' },
        ],
        evidenceHash: '0x7e8b92d4f10c3a6e8892cb1f9a',
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#090c14] border border-stone-800 shadow-2xl shadow-indigo-950/80 flex flex-col max-h-[92vh] overflow-hidden text-stone-100 font-sans">
        
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-stone-800 bg-[#0d101a] flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-amber-400 font-bold uppercase">{simulation.category} INDUSTRY SIMULATION</span>
              <span className="text-stone-600">/</span>
              <span className="text-stone-400 uppercase">TIME LIMIT: {simulation.timeLimitMinutes} MIN</span>
              <span className="text-stone-600">/</span>
              <span className="px-2 py-0.2 bg-stone-900 border border-stone-800 text-stone-300 text-[10px] uppercase font-bold">
                {simulation.difficulty}
              </span>
            </div>
            <h2 className="text-2xl font-serif text-stone-100 font-bold">
              {simulation.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white border border-stone-800 hover:border-stone-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-6">
          
          {/* BUSINESS CONTEXT */}
          <div className="p-5 bg-[#0e111a] border border-stone-800 space-y-3">
            <div className="font-mono text-xs text-amber-400 font-bold uppercase flex items-center gap-2">
              <Briefcase size={14} />
              <span>BUSINESS CONTEXT & PROBLEM SPECIFICATION</span>
            </div>
            <p className="text-xs text-stone-300 font-sans leading-relaxed">
              {simulation.businessContext}
            </p>

            <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-3 bg-[#080a10] border border-stone-800 space-y-1">
                <div className="text-[10px] text-stone-400 uppercase font-bold">DATASET SCHEMA:</div>
                <div className="text-stone-300 text-[11px]">{simulation.dataset}</div>
              </div>
              <div className="p-3 bg-[#080a10] border border-stone-800 space-y-1">
                <div className="text-[10px] text-stone-400 uppercase font-bold">EXPECTED DELIVERABLE:</div>
                <div className="text-stone-300 text-[11px]">{simulation.expectedOutput}</div>
              </div>
            </div>
          </div>

          {/* CONSTRAINTS & REQUIRED SKILLS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 bg-[#0c0f18] border border-stone-800 space-y-2">
              <div className="text-stone-400 uppercase font-bold">HARD CONSTRAINTS:</div>
              <ul className="space-y-1 text-[11px] text-stone-300">
                {simulation.constraints.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-400 font-bold">!</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-[#0c0f18] border border-stone-800 space-y-2">
              <div className="text-stone-400 uppercase font-bold">REQUIRED SKILLS:</div>
              <div className="flex flex-wrap gap-1.5">
                {simulation.requiredSkills.map((s, i) => (
                  <span key={i} className="px-2 py-1 bg-[#121520] border border-stone-800 text-stone-300 text-[11px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CODE EDITOR */}
          <div className="border border-stone-800 bg-[#06080d]">
            <div className="flex items-center justify-between px-4 py-2 bg-[#0c0f18] border-b border-stone-800 font-mono text-xs">
              <span className="text-stone-400">solution_pipeline.py</span>
              <button
                onClick={() => setCode(simulation.starterCode)}
                className="text-stone-400 hover:text-stone-200 text-[11px]"
              >
                Reset Starter
              </button>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={8}
              className="w-full p-4 bg-transparent font-mono text-xs text-stone-100 focus:outline-none resize-none leading-relaxed"
              spellCheck={false}
            />

            <div className="px-4 py-3 bg-[#0a0d14] border-t border-stone-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-stone-400">
                AI Automated Rubric Evaluator: 7 Dimensions
              </span>
              <button
                onClick={handleEvaluate}
                disabled={isEvaluating}
                className="px-6 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-mono text-xs font-bold transition-colors flex items-center gap-2"
              >
                {isEvaluating ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>EVALUATING SOLUTION...</span>
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    <span>SUBMIT & RUN AI EVALUATION</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* EVALUATION RESULTS */}
          {evaluationResult && (
            <div className="p-5 bg-[#0a1218] border border-emerald-500/40 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3 font-mono">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 size={18} />
                  <span>SIMULATION PASSED (SCORE: {evaluationResult.overallScore}/100)</span>
                </div>
                <div className="text-[11px] text-stone-400">
                  Evidence Hash: <code className="text-stone-200">{evaluationResult.evidenceHash}</code>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans text-xs">
                {evaluationResult.scores.map((sc, i) => (
                  <div key={i} className="p-3 bg-[#070d12] border border-stone-800 space-y-1">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-stone-300 font-bold">{sc.category}</span>
                      <span className="text-emerald-400 font-bold">{sc.score} pts</span>
                    </div>
                    <p className="text-stone-400 text-[11px]">{sc.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-stone-800 bg-[#0a0d14] flex items-center justify-between font-mono text-xs">
          <span className="text-stone-400">
            Industry Simulation • Enterprise Skill Validation
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white"
          >
            CLOSE
          </button>
        </div>

      </div>
    </div>
  );
};
