'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Progress } from '@/components/common/Progress';
import { ProgressOverview as ProgressOverviewType } from '@/types';
import { Clock, Award, Target, Brain, ArrowUpRight } from 'lucide-react';

interface ProgressOverviewProps {
  data?: ProgressOverviewType | null;
  loading?: boolean;
}

export const ProgressOverview: React.FC<ProgressOverviewProps> = ({ data, loading }) => {
  const overallMastery = data?.overall_mastery ? Math.round(data.overall_mastery * 100) : 74;
  const studyMinutes = data?.total_study_minutes || 320;
  const hours = Math.floor(studyMinutes / 60);
  const mins = studyMinutes % 60;
  const missionsDone = data?.completed_missions || 12;
  const misconceptionsCount = data?.active_misconceptions_count ?? 2;

  const subjectStats = data?.subject_mastery || {
    'AI & Machine Learning': 0.82,
    'Python Foundations': 0.94,
    'Data Science & Stats': 0.68,
    'SQL & Databases': 0.58,
    'Algorithms & DSA': 0.76,
  };

  return (
    <div className="space-y-6">
      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Mastery */}
        <Card variant="interactive" className="bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-slate-900/60 border-indigo-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Overall Mastery</span>
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Target size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mb-2">{overallMastery}%</div>
          <Progress value={overallMastery} color="gradient" size="sm" />
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <ArrowUpRight size={14} className="text-emerald-400" />
            <span className="text-emerald-400 font-medium">+6%</span> this week from 8 evidence turns
          </div>
        </Card>

        {/* Study Time */}
        <Card variant="interactive" className="bg-gradient-to-br from-cyan-950/40 via-slate-900/60 to-slate-900/60 border-cyan-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Study Time</span>
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Clock size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mb-2">
            {hours}h {mins}m
          </div>
          <Progress value={75} color="cyan" size="sm" />
          <div className="text-[11px] text-slate-400 mt-2">
            Target: 6h / week (75% completed)
          </div>
        </Card>

        {/* Completed Missions */}
        <Card variant="interactive" className="bg-gradient-to-br from-purple-950/40 via-slate-900/60 to-slate-900/60 border-purple-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Missions Cleared</span>
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
              <Award size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mb-2">{missionsDone}</div>
          <Progress value={missionsDone * 7} color="indigo" size="sm" />
          <div className="text-[11px] text-slate-400 mt-2">
            Earned <span className="text-purple-300 font-semibold">1,850 XP</span> towards AI Specialist
          </div>
        </Card>

        {/* Cognitive Twin Health */}
        <Card variant="interactive" className="bg-gradient-to-br from-emerald-950/40 via-slate-900/60 to-slate-900/60 border-emerald-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Active Twin Focus</span>
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Brain size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mb-2">
            {misconceptionsCount > 0 ? `${misconceptionsCount} Gaps` : '100% Solid'}
          </div>
          <div className="flex gap-1.5 mt-2">
            <Badge variant={misconceptionsCount > 0 ? 'amber' : 'emerald'} size="sm">
              {misconceptionsCount > 0 ? 'Remediation Ready' : 'Fully Calibrated'}
            </Badge>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Based on Bayesian knowledge tracing
          </div>
        </Card>
      </div>

      {/* Subject Mastery Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Target size={18} className="text-indigo-400" />
            Curriculum Domain Mastery
          </CardTitle>
          <Badge variant="indigo" size="sm">5 Domains Tracked</Badge>
        </CardHeader>
        <div className="space-y-4">
          {Object.entries(subjectStats).map(([subject, score]) => {
            const pct = Math.round((typeof score === 'number' ? score : 0.7) * 100);
            return (
              <div key={subject} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-200 font-medium">{subject}</span>
                  <span className="text-slate-400 font-mono font-semibold">{pct}%</span>
                </div>
                <Progress
                  value={pct}
                  color={pct >= 80 ? 'emerald' : pct >= 60 ? 'indigo' : 'amber'}
                  size="md"
                />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
