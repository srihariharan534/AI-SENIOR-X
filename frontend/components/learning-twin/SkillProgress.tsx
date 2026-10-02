'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Progress } from '@/components/common/Progress';
import { SkillCompetency } from '@/types';
import { Zap, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SkillProgressProps {
  skills?: SkillCompetency[];
  loading?: boolean;
}

export const SkillProgress: React.FC<SkillProgressProps> = ({
  skills = [],
  loading = false,
}) => {
  const defaultSkills: SkillCompetency[] = [
    {
      skill_id: 'sk_py_func',
      title: 'Functional Python & Scope',
      subject: 'Python',
      proficiency: 0.92,
      is_strength: true,
      is_weakness: false,
      related_concepts: ['closures', 'lambdas', 'higher_order'],
      prerequisite_blockers: [],
    },
    {
      skill_id: 'sk_grad_desc',
      title: 'Optimization & Gradient Descent',
      subject: 'AI/ML',
      proficiency: 0.74,
      is_strength: false,
      is_weakness: false,
      related_concepts: ['learning_rate', 'cost_functions', 'backprop'],
      prerequisite_blockers: [],
    },
    {
      skill_id: 'sk_sql_joins',
      title: 'Relational Joins & Set Operations',
      subject: 'SQL',
      proficiency: 0.52,
      is_strength: false,
      is_weakness: true,
      related_concepts: ['inner_join', 'left_join', 'null_matching'],
      prerequisite_blockers: ['sql_left_join'],
    },
    {
      skill_id: 'sk_dsa_trees',
      title: 'Binary Search Trees & Traversals',
      subject: 'DSA',
      proficiency: 0.81,
      is_strength: true,
      is_weakness: false,
      related_concepts: ['recursion', 'inorder', 'tree_balancing'],
      prerequisite_blockers: [],
    },
  ];

  const items = skills.length > 0 ? skills : defaultSkills;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Zap size={18} className="text-amber-400" />
          Skill Competency Index
        </CardTitle>
        <span className="text-xs text-slate-400">Bayesian Proficiency Estimates</span>
      </CardHeader>

      <div className="space-y-4">
        {items.map((skill) => {
          const pct = Math.round(skill.proficiency * 100);
          return (
            <div key={skill.skill_id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white">{skill.title}</h4>
                  <Badge variant={skill.is_strength ? 'emerald' : skill.is_weakness ? 'amber' : 'indigo'} size="sm">
                    {skill.is_strength ? 'Strength' : skill.is_weakness ? 'Gap Focus' : 'Developing'}
                  </Badge>
                </div>
                <span className="text-xs font-mono font-bold text-slate-300">{pct}%</span>
              </div>

              <Progress
                value={pct}
                color={pct >= 80 ? 'emerald' : pct >= 60 ? 'indigo' : 'amber'}
                size="sm"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-1">
                <span>Domain: <strong className="text-slate-300">{skill.subject}</strong></span>
                {skill.is_weakness && (
                  <span className="text-amber-400 flex items-center gap-1 font-medium">
                    <AlertCircle size={12} />
                    Targeted practice recommended
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
