'use client';

import React from 'react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Lightbulb, Code2, AlertCircle } from 'lucide-react';

interface ExplanationCardProps {
  title?: string;
  strategy?: string;
  summary: string;
  codeSnippet?: string;
  sources?: string[];
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
  title = 'Core Pedagogical Explanation',
  strategy,
  summary,
  codeSnippet,
  sources = [],
}) => {
  return (
    <Card className="bg-slate-900/80 border-indigo-500/20 my-2 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb size={16} className="text-amber-400" />
          <h4 className="text-sm font-bold text-white">{title}</h4>
        </div>
        {strategy && (
          <Badge variant="indigo" size="sm">
            {strategy}
          </Badge>
        )}
      </div>

      <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
        {summary}
      </div>

      {codeSnippet && (
        <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mb-2 border-b border-slate-800 pb-1">
            <Code2 size={13} />
            <span>Python Snippet</span>
          </div>
          <pre className="text-xs font-mono text-cyan-300 overflow-x-auto">
            <code>{codeSnippet}</code>
          </pre>
        </div>
      )}

      {sources.length > 0 && (
        <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300">RAG Sources:</span>
          <div className="flex flex-wrap gap-1.5">
            {sources.map((src, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-[10px]">
                {src}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
