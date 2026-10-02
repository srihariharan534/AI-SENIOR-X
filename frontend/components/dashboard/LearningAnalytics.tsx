'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { BarChart3, TrendingUp, Zap, Activity } from 'lucide-react';

export const LearningAnalytics: React.FC = () => {
  const weeklyData = [
    { day: 'Mon', minutes: 45, accuracy: 88 },
    { day: 'Tue', minutes: 60, accuracy: 92 },
    { day: 'Wed', minutes: 30, accuracy: 80 },
    { day: 'Thu', minutes: 75, accuracy: 95 },
    { day: 'Fri', minutes: 50, accuracy: 84 },
    { day: 'Sat', minutes: 40, accuracy: 90 },
    { day: 'Sun', minutes: 20, accuracy: 85 },
  ];

  const maxMinutes = Math.max(...weeklyData.map((d) => d.minutes));

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <BarChart3 size={18} className="text-cyan-400" />
          Weekly Learning Velocity & Accuracy
        </CardTitle>
        <Badge variant="cyan" size="sm">Past 7 Days</Badge>
      </CardHeader>

      <div className="grid grid-cols-7 gap-2 items-end h-40 pt-6 pb-2 px-2 border-b border-slate-800">
        {weeklyData.map((item) => {
          const heightPct = Math.round((item.minutes / maxMinutes) * 100);
          return (
            <div key={item.day} className="flex flex-col items-center gap-2 h-full justify-end group">
              <div className="text-[10px] font-mono text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.minutes}m
              </div>
              <div
                className="w-full max-w-[28px] bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t-md transition-all duration-300 group-hover:brightness-125 shadow-sm shadow-indigo-500/20"
                style={{ height: `${heightPct}%` }}
              />
              <span className="text-[11px] text-slate-400 font-medium">{item.day}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 mt-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <TrendingUp size={16} />
          </div>
          <div>
            <div className="text-xs text-slate-400">Average Accuracy</div>
            <div className="text-sm font-bold text-white">88.4%</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Zap size={16} />
          </div>
          <div>
            <div className="text-xs text-slate-400">Retention Decay</div>
            <div className="text-sm font-bold text-emerald-400">Optimal (SM-2)</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
            <Activity size={16} />
          </div>
          <div>
            <div className="text-xs text-slate-400">Cognitive Load</div>
            <div className="text-sm font-bold text-purple-300">Moderate</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
