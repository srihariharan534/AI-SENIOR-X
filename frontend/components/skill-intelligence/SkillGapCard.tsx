'use client';

import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Target,
} from 'lucide-react';
import { RoleGapAnalysis } from '@/types';

interface SkillGapCardProps {
  analysis: RoleGapAnalysis;
  onSelectRole: (role: string) => void;
  onLaunchChallenge?: (challengeTitle: string) => void;
}

export const SkillGapCard: React.FC<SkillGapCardProps> = ({
  analysis,
  onSelectRole,
  onLaunchChallenge,
}) => {
  const roles = [
    'Data Analyst',
    'Machine Learning Engineer',
    'AI & Distributed Systems Engineer',
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/30 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header & Role Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Target size={22} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Career Role Skill Gap Engine
              {analysis.is_job_ready ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  JOB READY (VERIFIED)
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  IN PROGRESS ({analysis.readiness_pct}%)
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              Evidence-based comparison against real-world production job requirements.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => onSelectRole(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                analysis.target_role === r
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Readiness Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300">
            Target Role Readiness: <strong className="text-white">{analysis.target_role}</strong>
          </span>
          <span className="font-mono font-bold text-indigo-300">
            {analysis.skills_demonstrated} of {analysis.total_skills_required} Skills Verified ({analysis.readiness_pct}%)
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
          <div
            className={`h-full transition-all ${
              analysis.readiness_pct >= 80 ? 'bg-emerald-400' : 'bg-gradient-to-r from-indigo-500 to-purple-500'
            }`}
            style={{ width: `${analysis.readiness_pct}%` }}
          />
        </div>
      </div>

      {/* Skills Requirement Breakdown Table */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Required Competencies &amp; Gap Severity:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {analysis.skill_breakdown.map((req) => (
            <div
              key={req.skill_id}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                req.is_met
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                  : req.gap_severity === 'Critical'
                  ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              <div className="space-y-0.5">
                <div className="text-xs font-bold flex items-center gap-1.5">
                  {req.is_met ? (
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle size={13} className="text-amber-400 shrink-0" />
                  )}
                  <span>{req.skill_name}</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Current: <strong className="text-white">{req.current_state}</strong> | Target: {req.required_state}
                </div>
              </div>

              {!req.is_met && (
                <span className="text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded border border-current">
                  {req.gap_severity} Gap
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Next Action Recommendation */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/50 to-slate-950 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 block mb-0.5">
            Next Best Action to Close Gap:
          </span>
          <p className="text-xs font-bold text-white">
            {analysis.next_best_action_challenge}
          </p>
        </div>

        {onLaunchChallenge && (
          <button
            onClick={() => onLaunchChallenge(analysis.next_best_action_challenge)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all shrink-0 flex items-center gap-1.5"
          >
            <span>Launch Gap Challenge</span>
            <ArrowRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
};
