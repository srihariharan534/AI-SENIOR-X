'use client';

import React from 'react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Progress } from '@/components/common/Progress';
import { Play, Sparkles, BookOpen } from 'lucide-react';

export const ContinueLearningCard: React.FC = () => {
  return (
    <Card variant="interactive" className="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border-indigo-500/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="indigo" size="sm">Resume Learning</Badge>
            <span className="text-xs text-slate-400">Lesson 3 of 5 in Module</span>
          </div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen size={18} className="text-indigo-400" />
            Neural Networks: Forward Propagation & Activation Functions
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            You were exploring ReLU vs Sigmoid vanishing gradients. Your AI Tutor has prepared an interactive visualization to conclude this section.
          </p>
          <div className="w-full max-w-md pt-1">
            <Progress value={60} color="gradient" size="sm" showLabel />
          </div>
        </div>

        <a
          href="/tutor?topic=neural_activations"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/30 transition-all shrink-0"
        >
          <Play size={16} fill="currentColor" />
          <span>Resume Topic</span>
        </a>
      </div>
    </Card>
  );
};
