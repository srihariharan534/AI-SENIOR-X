'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { LearnerProfile, User } from '@/types';
import { UserCheck, Target, Globe, BookOpen, Clock } from 'lucide-react';

interface LearningProfileProps {
  user?: User | null;
  profile?: LearnerProfile | null;
}

export const LearningProfile: React.FC<LearningProfileProps> = ({
  user,
  profile,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <UserCheck size={18} className="text-indigo-400" />
          Cognitive Twin Profile & Preferences
        </CardTitle>
        <Badge variant="indigo" size="sm">Active Model</Badge>
      </CardHeader>

      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 font-semibold block mb-1">Target Role / Goal</span>
            <div className="flex items-center gap-2 text-white font-medium">
              <Target size={14} className="text-indigo-400" />
              <span>Full-Stack AI Engineer</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 font-semibold block mb-1">Preferred Language</span>
            <div className="flex items-center gap-2 text-white font-medium">
              <Globe size={14} className="text-cyan-400" />
              <span>{profile?.preferred_language || 'English (US)'}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 font-semibold block mb-1">Pedagogy Style</span>
            <div className="flex items-center gap-2 text-white font-medium">
              <BookOpen size={14} className="text-purple-400" />
              <span>{profile?.learning_style || 'Socratic Guided Dialogue & Hands-on Code'}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 font-semibold block mb-1">Pace & Daily Target</span>
            <div className="flex items-center gap-2 text-white font-medium">
              <Clock size={14} className="text-emerald-400" />
              <span>45 mins / day (Adaptive)</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
