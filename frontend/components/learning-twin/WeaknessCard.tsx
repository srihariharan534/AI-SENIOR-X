'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Misconception } from '@/types';
import { AlertTriangle, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

interface WeaknessCardProps {
  activeMisconceptions?: Misconception[];
  resolvedMisconceptions?: Misconception[];
}

export const WeaknessCard: React.FC<WeaknessCardProps> = ({
  activeMisconceptions = [],
  resolvedMisconceptions = [],
}) => {
  const defaultActive: Misconception[] = [
    {
      id: 'misc_01',
      concept_key: 'sql_left_join',
      misconception_tag: 'LEFT_VS_INNER_CONFUSION',
      description: 'Your answers indicate confusion between NULL preservation in LEFT JOIN vs strict match in INNER JOIN.',
      severity: 'medium',
      status: 'active',
      remediation_advice: 'Review table row matching behavior and practice 3 targeted queries with unmatched rows.',
      detected_at: '2 hours ago',
    },
    {
      id: 'misc_02',
      concept_key: 'gradient_vanishing',
      misconception_tag: 'SIGMOID_SATURATION',
      description: 'Assumed Sigmoid maintains large gradients during deep backpropagation passes.',
      severity: 'low',
      status: 'active',
      remediation_advice: 'Study derivative curve of Sigmoid vs ReLU in deep architectures.',
      detected_at: 'Yesterday',
    },
  ];

  const active = activeMisconceptions.length > 0 ? activeMisconceptions : defaultActive;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <AlertTriangle size={18} className="text-amber-400" />
          Detected Cognitive Gaps & Misconceptions
        </CardTitle>
        <Badge variant="amber" size="sm">
          {active.length} Active Gaps
        </Badge>
      </CardHeader>

      <div className="space-y-3">
        {active.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase">{item.concept_key.replace('_', ' ')}</span>
                <Badge variant="amber" size="sm">
                  {item.severity} severity
                </Badge>
              </div>
              <span className="text-[10px] text-slate-500">{item.detected_at || 'Recently'}</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

            {item.remediation_advice && (
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-amber-200">
                <strong className="block font-semibold text-amber-300 mb-0.5">Recommended Intervention:</strong>
                <span>{item.remediation_advice}</span>
              </div>
            )}

            <div className="flex justify-end pt-1">
              <a
                href={`/practice?topic=${item.concept_key}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white transition-all shadow-sm"
              >
                <span>Fix in Practice</span>
                <ArrowRight size={13} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
