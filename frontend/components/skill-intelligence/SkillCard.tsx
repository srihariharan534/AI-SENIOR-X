'use client';

import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Award,
  Repeat,
} from 'lucide-react';
import { SkillDetail, SkillStateType } from '@/types';

interface SkillCardProps {
  skill: SkillDetail;
  onSelectSkill: (skill: SkillDetail) => void;
  onLaunchTeachBack?: (skill: SkillDetail) => void;
  onLaunchChallenge?: (skill: SkillDetail) => void;
}

export const SkillCard: React.FC<SkillCardProps> = ({
  skill,
  onSelectSkill,
  onLaunchTeachBack,
  onLaunchChallenge,
}) => {
  const getStateBadge = (state: SkillStateType) => {
    switch (state) {
      case 'RETAINED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'APPLIED':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'DEMONSTRATED':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'GUIDED':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'DEVELOPING':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getDimensionColor = (val: string) => {
    switch (val) {
      case 'Strong':
      case 'Demonstrated':
        return 'bg-emerald-400';
      case 'Developing':
        return 'bg-indigo-400';
      default:
        return 'bg-slate-700';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 hover:border-indigo-500/40 transition-all flex flex-col justify-between group">
      {/* Top Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            {skill.domain}
          </span>
          <span
            className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg border flex items-center gap-1 ${getStateBadge(
              skill.current_state
            )}`}
          >
            {skill.current_state === 'RETAINED' && <ShieldCheck size={12} />}
            {skill.current_state === 'APPLIED' && <Award size={12} />}
            <span>{skill.current_state}</span>
          </span>
        </div>

        <div>
          <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
            {skill.skill_name}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {skill.state_reasoning}
          </p>
        </div>

        {/* Multi-Dimensional Evidence Bars */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Knowledge &amp; Syntax</span>
            <span className="font-semibold text-white">{skill.dimensions.knowledge}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full ${getDimensionColor(skill.dimensions.knowledge)}`}
              style={{ width: skill.dimensions.knowledge === 'Strong' ? '90%' : '55%' }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Practical Application</span>
            <span className="font-semibold text-white">{skill.dimensions.practical_application}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full ${getDimensionColor(skill.dimensions.practical_application)}`}
              style={{
                width:
                  skill.dimensions.practical_application === 'Strong'
                    ? '85%'
                    : skill.dimensions.practical_application === 'Developing'
                    ? '60%'
                    : '25%',
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Independent Solutions</span>
            <span className="font-semibold text-white">{skill.dimensions.independent_implementation}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full ${getDimensionColor(skill.dimensions.independent_implementation)}`}
              style={{ width: skill.dimensions.independent_implementation === 'Strong' ? '88%' : '50%' }}
            />
          </div>
        </div>

        {/* Evidence Counters Box */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
          <div>
            <span className="text-[10px] uppercase text-slate-500 font-bold block">Verified</span>
            <span className="text-sm font-bold text-white font-mono">{skill.evidence_count_total}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-slate-500 font-bold block">Independent</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">
              {skill.independent_solutions_count}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-slate-500 font-bold block">Retention</span>
            <span className="text-sm font-bold text-indigo-400 font-mono">
              {skill.retention_score_pct}%
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <button
          onClick={() => onSelectSkill(skill)}
          className="text-xs text-slate-300 hover:text-white font-semibold flex items-center gap-1 transition-colors"
        >
          <span>Proof Evidence</span>
          <ArrowRight size={13} className="text-indigo-400" />
        </button>

        <div className="flex items-center gap-1.5">
          {onLaunchTeachBack && (
            <button
              onClick={() => onLaunchTeachBack(skill)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1 transition-colors"
              title="Perform Teach-Back explanation"
            >
              <Repeat size={12} className="text-amber-400" />
              <span>Teach-Back</span>
            </button>
          )}

          {onLaunchChallenge && (
            <button
              onClick={() => onLaunchChallenge(skill)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold shadow-sm transition-colors"
            >
              Verify Challenge
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
