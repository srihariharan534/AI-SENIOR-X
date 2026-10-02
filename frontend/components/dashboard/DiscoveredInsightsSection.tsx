'use client';

import React from 'react';
import { Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react';

interface DiscoveredInsightsProps {
  insights?: Array<{
    id: string;
    statement: string;
    category: string;
    evidence_tag: string;
    actionable_recommendation: string;
  }>;
}

export const DiscoveredInsightsSection: React.FC<DiscoveredInsightsProps> = ({
  insights,
}) => {
  const items = insights || [
    {
      id: 'ins-01',
      statement:
        'You consistently solve SQL aggregation and multi-table join problems on first attempt, but require additional structured practice with window framing specifications.',
      category: 'SYNTACTIC_PRECISION',
      evidence_tag: '08 SQL ASSESSMENTS · 18 PRACTICE RUNS',
      actionable_recommendation:
        'Complete the 25-min Window Frame drill before attempting the production capstone challenge.',
    },
    {
      id: 'ins-02',
      statement:
        'Your Python conceptual understanding (94% in Teach-Back verbal sessions) is significantly stronger than raw implementation speed under time constraints.',
      category: 'COGNITIVE_ALIGNMENT',
      evidence_tag: '12 TEACH-BACK EVALUATIONS',
      actionable_recommendation:
        'Engage in timed AST code-completion exercises to build muscle memory.',
    },
    {
      id: 'ins-03',
      statement:
        'You have mastered feature engineering foundations and are ready to transition from tabular ML to Deep Learning and Transformer embeddings.',
      category: 'CURRICULUM_UNLOCKED',
      evidence_tag: 'CAPSTONE_PROJ_ML_01 VERIFIED',
      actionable_recommendation:
        'Unlock Module 01 in Deep Learning & Neural Network Architectures.',
    },
  ];

  return (
    <div className="w-full bg-[#fdfcf9] dark:bg-stone-900 border border-stone-300 dark:border-stone-800">
      <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-[#f9f8f4] dark:bg-stone-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb size={16} className="text-amber-600 dark:text-amber-400" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-900 dark:text-stone-100">
            SECTION 11 // WHAT AI-SENIOR-X DISCOVERED ABOUT YOUR LEARNING
          </h2>
        </div>
        <span className="text-[10px] font-mono text-stone-500 uppercase">EVIDENCE-BACKED TELEMETRY</span>
      </div>

      <div className="p-6 md:p-8 space-y-4">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="p-5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:border-stone-400 transition-colors"
          >
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 font-mono text-[10px]">
                <span className="font-bold text-stone-400">0{idx + 1}</span>
                <span className="text-stone-300">•</span>
                <span className="text-blue-700 dark:text-blue-400 font-bold uppercase">{item.category}</span>
                <span className="text-stone-300">•</span>
                <span className="text-stone-500 uppercase">{item.evidence_tag}</span>
              </div>

              <p className="text-sm font-serif font-bold text-stone-900 dark:text-white leading-snug">
                &ldquo;{item.statement}&rdquo;
              </p>

              <div className="pt-2 text-xs text-stone-600 dark:text-stone-300 font-sans flex items-center gap-1.5">
                <span className="font-mono font-bold text-[10px] text-emerald-800 dark:text-emerald-400 uppercase">RECOMMENDATION:</span>
                <span>{item.actionable_recommendation}</span>
              </div>
            </div>

            <div className="shrink-0 font-mono text-[11px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 pt-1">
              <CheckCircle2 size={13} />
              <span>ACTIVE INSIGHT</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
