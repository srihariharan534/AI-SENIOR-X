'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMissions } from '@/hooks/useMissions';
import { Card, CardHeader, CardTitle } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Progress } from '@/components/common/Progress';
import {
  Award,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function MissionsPage() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get('topic') || 'ml_supervised';
  const { missions, loading, toggleTask, refreshMissions } = useMissions(initialTopic);

  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const filteredMissions = missions.filter((m) =>
    activeTab === 'active' ? !m.is_completed : m.is_completed
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900/90 to-slate-900/90 border border-purple-500/20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <Award size={26} className="text-purple-400" />
              Missions & Capstone Quests
            </h1>
            <Badge variant="purple" size="sm">
              Gamified Mastery
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-world applied engineering challenges designed by the Mission Agent to validate holistic competencies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-xl bg-purple-900/30 border border-purple-500/30 text-purple-200 text-xs font-bold flex items-center gap-1.5">
            <Zap size={14} className="text-amber-400" />
            <span>2,200 Total XP Earned</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'active'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Active Quests ({missions.filter((m) => !m.is_completed).length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'completed'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Completed Archive ({missions.filter((m) => m.is_completed).length})
        </button>
      </div>

      {/* Missions Grid */}
      <div className="space-y-6">
        {filteredMissions.map((mission) => (
          <Card
            key={mission.id}
            className="p-6 space-y-5 bg-slate-900/80 border-slate-800 hover:border-purple-500/30 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="purple" size="sm">
                    {mission.subject}
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">
                    Difficulty: <strong className="text-slate-200">{mission.difficulty}</strong>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{mission.title}</h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1">
                  <Sparkles size={13} />
                  <span>+{mission.xp_reward} XP</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{mission.description}</p>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Objective Checklist</span>
                <span className="font-mono text-purple-300 font-semibold">{mission.progress_percentage}% Done</span>
              </div>
              <Progress value={mission.progress_percentage} color="gradient" size="md" />
            </div>

            {/* Task Checklist */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              {mission.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(mission.id, task.id)}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-purple-500/40 cursor-pointer transition-colors group"
                >
                  <button className="mt-0.5 text-slate-500 group-hover:text-purple-400 transition-colors">
                    {task.is_completed ? (
                      <CheckCircle2 size={18} className="text-emerald-400" />
                    ) : (
                      <Circle size={18} />
                    )}
                  </button>
                  <div className="flex-1">
                    <h4
                      className={`text-xs font-bold ${
                        task.is_completed ? 'line-through text-slate-500' : 'text-slate-200'
                      }`}
                    >
                      {task.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{task.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Created by Multi-Agent Pedagogy Engine
              </span>
              <a
                href={`/practice?topic=${mission.topic_id || 'ml_supervised'}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30 transition-all"
              >
                <span>Launch Interactive Workspace</span>
                <ArrowRight size={13} />
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
