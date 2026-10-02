'use client';

import React from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  Zap,
  Clock,
  ExternalLink,
  Code2,
  Sparkles,
  Award,
  Layers,
} from 'lucide-react';
import { SkillEvidenceItem } from '@/types';

interface SkillEvidenceProps {
  evidenceList: SkillEvidenceItem[];
  skillTitle?: string;
}

export const SkillEvidence: React.FC<SkillEvidenceProps> = ({
  evidenceList,
  skillTitle,
}) => {
  const getSourceBadge = (src: string) => {
    switch (src) {
      case 'real_world_task':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'delayed_test':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'transfer_test':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'teach_back':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-400" />
          <h4 className="text-sm font-bold text-white">
            Demonstrated Evidence Stream {skillTitle ? `— ${skillTitle}` : ''}
          </h4>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {evidenceList.length} Verified Evidence Records
        </span>
      </div>

      <div className="space-y-3">
        {evidenceList.map((ev) => (
          <div
            key={ev.evidence_id}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${getSourceBadge(
                    ev.source_type
                  )}`}
                >
                  {ev.source_type.replace(/_/g, ' ')}
                </span>
                <span className="text-xs font-bold text-white">{ev.concept_id.replace(/_/g, ' ')}</span>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ev.independence === 'INDEPENDENT'
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-amber-400 bg-amber-500/10'
                  }`}
                >
                  {ev.independence}
                </span>
                <span>•</span>
                <span>Score: {Math.round(ev.correctness * 100)}%</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{ev.summary}</p>

            {/* Context & Metadata chips */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 text-[10px] text-slate-500 font-mono">
              <div className="flex items-center gap-3">
                <span>Task: {ev.challenge_id || ev.task_id || 'Standard Assessment'}</span>
                {ev.transfer_context && (
                  <span className="text-blue-400">Context Transfer: {ev.transfer_context}</span>
                )}
                {ev.retention_status && (
                  <span className="text-purple-400">Retention: {ev.retention_status.toUpperCase()}</span>
                )}
              </div>
              <span>Verified: {ev.verified_at.split('T')[0]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
