'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { RecommendationAction } from '@/types';
import { Sparkles, Clock, ArrowRight, BookOpen, AlertTriangle } from 'lucide-react';

interface RecommendedLessonProps {
  recommendations?: RecommendationAction[];
  loading?: boolean;
}

export const RecommendedLesson: React.FC<RecommendedLessonProps> = ({
  recommendations = [],
  loading = false,
}) => {
  const defaultRecs: RecommendationAction[] = [
    {
      action_type: 'LESSON',
      topic_id: 'ml_supervised',
      concept_id: 'gradient_descent',
      title: 'Supervised Learning & Cost Function Minimization',
      reason:
        'Recommended because you mastered Python Functions and Linear Algebra prerequisites with 92% accuracy.',
      difficulty: 'Intermediate',
      estimated_minutes: 20,
      priority_score: 0.95,
    },
    {
      action_type: 'PRACTICE',
      topic_id: 'sql_joins',
      concept_id: 'sql_left_join',
      title: 'Targeted Remediation: LEFT JOIN vs INNER JOIN',
      reason:
        'Recommended by Misconception Agent due to confusing NULL matching logic in your recent query.',
      difficulty: 'Beginner',
      estimated_minutes: 12,
      priority_score: 0.89,
    },
  ];

  const items = recommendations.length > 0 ? recommendations : defaultRecs;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Sparkles size={18} />
          </div>
          <h3 className="text-base font-bold text-white">Recommended for You</h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">Powered by Recommendation Agent</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, idx) => {
          const isRemediation = item.action_type === 'PRACTICE' || item.action_type === 'REVISION';

          return (
            <Card
              key={`${item.topic_id}-${idx}`}
              variant="interactive"
              className={`flex flex-col justify-between ${
                isRemediation
                  ? 'border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-slate-900/60 to-slate-900/60'
                  : 'border-indigo-500/30 bg-gradient-to-br from-indigo-950/20 via-slate-900/60 to-slate-900/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={isRemediation ? 'amber' : 'indigo'} size="sm">
                    {item.action_type}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock size={13} />
                    <span>{item.estimated_minutes} min</span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white mb-1.5 hover:text-indigo-300 transition-colors">
                  {item.title}
                </h4>

                <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80 mb-4 text-xs text-slate-300 flex items-start gap-2">
                  {isRemediation ? (
                    <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <Sparkles size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                  )}
                  <span>{item.reason}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 mt-2">
                <span className="text-[11px] text-slate-400 font-mono">
                  Difficulty: <strong className="text-slate-200">{item.difficulty}</strong>
                </span>
                <a
                  href={isRemediation ? `/practice?topic=${item.topic_id}` : `/learn/${item.topic_id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30"
                >
                  <span>Start Now</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
