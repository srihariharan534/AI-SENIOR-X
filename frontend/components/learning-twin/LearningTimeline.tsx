'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { LearningHistoryEvent } from '@/types';
import { History, Brain, Award, Code2, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface LearningTimelineProps {
  events?: LearningHistoryEvent[];
}

export const LearningTimeline: React.FC<LearningTimelineProps> = ({ events = [] }) => {
  const defaultEvents: LearningHistoryEvent[] = [
    {
      event_id: 'ev_1',
      timestamp: 'Today, 10:30 AM',
      event_type: 'practice',
      topic_id: 'python_basics',
      concept_id: 'python_loops',
      score: 1.0,
      details: { summary: 'Passed 3 test cases in List Comprehensions challenge' },
    },
    {
      event_id: 'ev_2',
      timestamp: 'Today, 09:15 AM',
      event_type: 'tutor',
      topic_id: 'neural_networks',
      concept_id: 'gradient_vanishing',
      details: { summary: 'Explored Socratic discussion on Sigmoid saturation' },
    },
    {
      event_id: 'ev_3',
      timestamp: 'Yesterday',
      event_type: 'misconception',
      topic_id: 'sql_joins',
      concept_id: 'sql_left_join',
      details: { summary: 'Flagged NULL matching misconception in SQL query' },
    },
    {
      event_id: 'ev_4',
      timestamp: '2 days ago',
      event_type: 'completion',
      topic_id: 'ml_supervised',
      concept_id: 'cost_functions',
      score: 0.92,
      details: { summary: 'Completed Capstone Mission: Neural Classifier' },
    },
  ];

  const items = events.length > 0 ? events : defaultEvents;

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'practice':
        return <Code2 size={14} className="text-cyan-400" />;
      case 'tutor':
        return <Brain size={14} className="text-indigo-400" />;
      case 'misconception':
        return <AlertTriangle size={14} className="text-amber-400" />;
      case 'completion':
        return <Award size={14} className="text-emerald-400" />;
      default:
        return <CheckCircle2 size={14} className="text-slate-400" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <History size={18} className="text-cyan-400" />
          Event-Sourced Cognitive Timeline
        </CardTitle>
        <Badge variant="cyan" size="sm">Evidence Stream</Badge>
      </CardHeader>

      <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
        {items.map((ev) => (
          <div key={ev.event_id} className="relative flex items-start gap-4 pl-8 group">
            {/* Timeline dot */}
            <div className="absolute left-1.5 top-1 w-5 h-5 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center shrink-0 shadow-sm group-hover:border-indigo-400 transition-colors">
              {getEventIcon(ev.event_type)}
            </div>

            <div className="flex-1 p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase font-mono">
                  {ev.topic_id.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-slate-500">{ev.timestamp}</span>
              </div>
              <p className="text-xs text-slate-300">
                {(ev.details as any)?.summary || `Interacted with ${ev.concept_id}`}
              </p>
              {ev.score !== undefined && (
                <div className="text-[11px] font-mono text-emerald-400">
                  Mastery Delta: +{Math.round(ev.score * 10)}%
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
