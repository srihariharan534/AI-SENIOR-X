'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface FollowUpQuestionProps {
  questions?: string[];
  onSelect: (question: string) => void;
}

export const FollowUpQuestion: React.FC<FollowUpQuestionProps> = ({
  questions = [],
  onSelect,
}) => {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="pt-2 space-y-2">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
        <Sparkles size={12} />
        <span>Suggested Follow-up Inquiries</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {questions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(q)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900/90 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-200 border border-slate-800 hover:border-indigo-500/40 transition-all text-left shadow-sm group"
          >
            <span>{q}</span>
            <ArrowRight size={12} className="text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
};
