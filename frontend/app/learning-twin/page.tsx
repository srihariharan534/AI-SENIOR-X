'use client';

import React from 'react';
import { useLearningTwin } from '@/hooks/useLearningTwin';
import { useAuth } from '@/hooks/useAuth';
import { KnowledgeMap } from '@/components/learning-twin/KnowledgeMap';
import { SkillProgress } from '@/components/learning-twin/SkillProgress';
import { WeaknessCard } from '@/components/learning-twin/WeaknessCard';
import { LearningProfile } from '@/components/learning-twin/LearningProfile';
import { LearningTimeline } from '@/components/learning-twin/LearningTimeline';
import { Card, CardHeader, CardTitle } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Skeleton } from '@/components/common/Skeleton';
import {
  Fingerprint,
  Sparkles,
  RefreshCw,
  Target,
  Brain,
  Layers,
  Award,
  Activity,
} from 'lucide-react';

export default function LearningTwinPage() {
  const { user, profile } = useAuth();
  const {
    summary,
    knowledgeState,
    skills,
    misconceptions,
    history,
    loading,
    refreshTwin,
  } = useLearningTwin();

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/50 via-purple-950/40 to-slate-900/90 border border-indigo-500/30 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <Fingerprint size={28} className="text-indigo-400" />
              Cognitive Learning Twin
            </h1>
            <Badge variant="indigo" size="sm">
              Bayesian BKT Model
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            A live digital twin of your knowledge structure, tracking concept masteries, prerequisite readiness, memory decay rates, and cognitive misconceptions.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={refreshTwin}
          loading={loading}
          icon={<RefreshCw size={14} />}
        >
          <span>Recalibrate State</span>
        </Button>
      </div>

      {/* 4 Summary Stat Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-900/60 border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Concepts Tracked</span>
            <Brain size={16} className="text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {summary?.concepts_tracked_count || 32}
          </div>
        </Card>

        <Card className="p-4 bg-slate-900/60 border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Average Mastery</span>
            <Activity size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">
            {summary?.overall_average_mastery ? Math.round(summary.overall_average_mastery * 100) : 74}%
          </div>
        </Card>

        <Card className="p-4 bg-slate-900/60 border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Skills Assessed</span>
            <Layers size={16} className="text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {summary?.skills_count || 18}
          </div>
        </Card>

        <Card className="p-4 bg-slate-900/60 border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Evidence Ingested</span>
            <Sparkles size={16} className="text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-purple-300">
            {summary?.total_learning_events || 84}
          </div>
        </Card>
      </div>

      {/* Interactive Knowledge Map */}
      <KnowledgeMap knowledgeState={knowledgeState} />

      {/* Skill Competencies & Cognitive Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillProgress skills={skills} loading={loading} />
        <WeaknessCard
          activeMisconceptions={misconceptions.active}
          resolvedMisconceptions={misconceptions.resolved}
        />
      </div>

      {/* Profile Preferences & Event-Sourced Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LearningProfile user={user} profile={profile} />
        <LearningTimeline events={history} />
      </div>
    </div>
  );
}
