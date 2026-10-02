'use client';

import React from 'react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { BookOpen, CheckCircle, HelpCircle } from 'lucide-react';

interface ConceptCardProps {
  conceptKey: string;
  title: string;
  definition: string;
  prerequisites?: string[];
  masteryLevel?: string;
}

export const ConceptCard: React.FC<ConceptCardProps> = ({
  conceptKey,
  title,
  definition,
  prerequisites = [],
  masteryLevel = 'DEVELOPING',
}) => {
  return (
    <Card className="bg-slate-900/90 border-slate-800 my-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-cyan-400" />
          <h4 className="text-sm font-bold text-white">{title}</h4>
        </div>
        <Badge variant={masteryLevel === 'MASTERY' ? 'emerald' : 'indigo'} size="sm">
          {masteryLevel}
        </Badge>
      </div>
      <p className="text-xs text-slate-300 mb-3">{definition}</p>

      {prerequisites.length > 0 && (
        <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
          <span>Prerequisites:</span>
          <div className="flex flex-wrap gap-1">
            {prerequisites.map((p) => (
              <span key={p} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                {p}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
