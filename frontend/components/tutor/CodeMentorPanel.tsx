'use client';

import React, { useState } from 'react';
import {
  Code2,
  Bug,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Play,
  RefreshCw,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { api } from '@/lib/api';
import { CodeMentorResponse } from '@/types';

export const CodeMentorPanel: React.FC = () => {
  const [code, setCode] = useState(
    `# Paste or edit buggy code here\ndef get_user_transactions(user_id, transactions):\n    user_txs = []\n    for i in range(len(transactions) + 1):\n        if transactions[i]['user_id'] == user_id:\n            user_txs.append(transactions[i])\n    return user_txs`
  );
  const [errorMessage, setErrorMessage] = useState('IndexError: list index out of range on line 4');
  const [language, setLanguage] = useState('python');
  const [helpMode, setHelpMode] = useState<'hint' | 'step_by_step' | 'full_solution'>('step_by_step');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [response, setResponse] = useState<CodeMentorResponse | null>(null);

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setIsAnalyzing(true);

    try {
      const res = await api.mentorCode({
        code,
        language,
        error_message: errorMessage.trim() || undefined,
        help_mode: helpMode,
      });

      if (res.success && res.data) {
        setResponse(res.data);
      }
    } catch (e) {
      console.error('Failed to analyze code', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Editor & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Code2 className="text-indigo-400" size={18} />
            <h3 className="text-base font-bold text-white">AI Code Mentor & Error Diagnoser</h3>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 font-mono focus:outline-none"
            >
              <option value="python">Python</option>
              <option value="sql">SQL</option>
              <option value="javascript">JavaScript / TypeScript</option>
              <option value="java">Java</option>
              <option value="cpp">C / C++</option>
              <option value="react">React / JSX</option>
            </select>

            {/* Scaffold Selector */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setHelpMode('hint')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  helpMode === 'hint'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Hint Only
              </button>
              <button
                onClick={() => setHelpMode('step_by_step')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  helpMode === 'step_by_step'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Step-by-Step
              </button>
              <button
                onClick={() => setHelpMode('full_solution')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  helpMode === 'full_solution'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Full Solution
              </button>
            </div>
          </div>
        </div>

        {/* Code Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Source Code:
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={8}
            className="w-full p-4 font-mono text-xs bg-slate-950 border border-slate-800 rounded-2xl text-indigo-100 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
            placeholder="Paste code snippet..."
          />
        </div>

        {/* Error / Traceback Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Bug size={13} className="text-rose-400" />
            <span>Error Traceback / Issue Description (Optional):</span>
          </label>
          <input
            type="text"
            value={errorMessage}
            onChange={(e) => setErrorMessage(e.target.value)}
            placeholder="e.g. IndexError: list index out of range, or 'Why is this slow?'"
            className="w-full p-3 font-mono text-xs bg-slate-950 border border-slate-800 rounded-xl text-rose-200 focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Analyze Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !code.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Diagnosing Code & Error Mechanics...</span>
              </>
            ) : (
              <>
                <Sparkles size={14} />
                <span>Diagnose & Teach Concept</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Diagnosis & Scaffolding Results Card */}
      {response && (
        <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl space-y-5 animate-scaleUp">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/30">
                {response.error_type || 'Logic & Performance Analysis'}
              </span>
              <h4 className="text-base font-bold text-white mt-1.5">
                Related Concept: {response.underlying_concept || (response as any).related_concept}
              </h4>
            </div>
          </div>

          {/* Root Cause Diagnosis */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              Root Cause Diagnosis:
            </span>
            <p>{response.root_cause_explanation}</p>
          </div>

          {/* Hint Only Mode */}
          {helpMode === 'hint' && (
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 text-xs text-indigo-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                <Lightbulb size={15} />
                <span>Pedagogical Hint:</span>
              </div>
              <p className="leading-relaxed">{response.hint}</p>
            </div>
          )}

          {/* Step-by-Step Mode */}
          {helpMode === 'step_by_step' && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                Step-by-Step Resolution Strategy:
              </span>
              <ul className="space-y-1.5">
                {(response.step_by_step_fix || (response as any).step_by_step_explanation || []).map((s: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Full Solution Mode */}
          {helpMode === 'full_solution' && (response.corrected_code || (response as any).fixed_code) && (
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Corrected Production Implementation:
                </span>
                <pre className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 font-mono text-xs text-emerald-200 overflow-x-auto">
                  {response.corrected_code || (response as any).fixed_code}
                </pre>
              </div>
              {response.why_fix_works && (
                <p className="text-xs text-slate-400">{response.why_fix_works}</p>
              )}
            </div>
          )}

          {/* Similar Practice Challenge */}
          {(response.similar_challenge || (response as any).similar_practice_challenge) && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 to-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-0.5">
                  Independent Challenge:
                </span>
                <h5 className="text-xs font-bold text-white">
                  {response.similar_challenge?.title || (response as any).similar_practice_challenge?.title}
                </h5>
                <p className="text-[11px] text-slate-400">
                  {response.similar_challenge?.description || (response as any).similar_practice_challenge?.prompt}
                </p>
              </div>
              <a
                href="/practice"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-1"
              >
                <span>Solve Drill</span>
                <ArrowRight size={13} />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
