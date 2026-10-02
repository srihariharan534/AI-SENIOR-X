'use client';

import React from 'react';
import { Card } from '@/components/common/Card';
import { Flame, CheckCircle2 } from 'lucide-react';

interface StreakCardProps {
  streakDays?: number;
}

export const StreakCard: React.FC<StreakCardProps> = ({ streakDays = 4 }) => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const activeDays = [true, true, true, true, false, false, false];

  return (
    <Card className="bg-gradient-to-br from-amber-950/30 via-slate-900/60 to-slate-900/60 border-amber-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <Flame size={20} className="animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Daily Streak Active</h4>
            <p className="text-xs text-slate-400">Consistent learning strengthens memory retention</p>
          </div>
        </div>
        <div className="text-2xl font-black text-amber-400 flex items-center gap-1 font-mono">
          <span>{streakDays}</span>
          <span className="text-xs uppercase font-sans text-amber-300/80">days</span>
        </div>
      </div>

      {/* 7-day activity pills */}
      <div className="grid grid-cols-7 gap-2 pt-2 border-t border-slate-800/80">
        {daysOfWeek.map((day, idx) => {
          const isActive = activeDays[idx];
          return (
            <div key={day} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] text-slate-400 font-medium">{day}</span>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm shadow-amber-500/20'
                    : 'bg-slate-800/50 text-slate-600 border border-slate-700/40'
                }`}
              >
                {isActive ? <CheckCircle2 size={14} /> : <span className="text-[10px]">•</span>}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
