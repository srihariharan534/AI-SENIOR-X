'use client';

import React from 'react';
import { Play, RotateCcw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  onSubmit: () => void;
  submitting?: boolean;
  language?: string;
  onReset?: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  onSubmit,
  submitting = false,
  language = 'python',
  onReset,
}) => {
  const [copied, setCopied] = React.useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineNumbers = code.split('\n').map((_, i) => i + 1);

  return (
    <div className="flex flex-col h-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl">
      {/* Editor Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/60 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/60 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/60 inline-block" />
          </div>
          <span className="font-mono text-slate-300 font-semibold pl-2">solution.py</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyCode}
            className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
            title="Copy Code"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>
          {onReset && (
            <button
              onClick={onReset}
              className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
              title="Reset Starter Code"
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Editor Body with Line Numbers */}
      <div className="flex flex-1 overflow-hidden font-mono text-xs">
        {/* Line Numbers */}
        <div className="w-10 bg-slate-950/80 text-slate-600 text-right pr-3 py-4 select-none border-r border-slate-900 leading-6">
          {lineNumbers.map((num) => (
            <div key={num}>{num}</div>
          ))}
        </div>

        {/* Text Area Code Input */}
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="flex-1 bg-transparent p-4 text-cyan-200 focus:outline-none resize-none leading-6 font-mono selection:bg-indigo-600/40"
          placeholder="# Enter your Python solution here..."
        />
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-t border-slate-800">
        <span className="text-[11px] text-slate-500 font-mono">
          Language: <strong className="text-slate-300 uppercase">{language} 3.13</strong>
        </span>
        <Button
          variant="glow"
          size="sm"
          onClick={onSubmit}
          loading={submitting}
          icon={<Play size={14} fill="currentColor" />}
        >
          <span>Submit for AI Grading</span>
        </Button>
      </div>
    </div>
  );
};
