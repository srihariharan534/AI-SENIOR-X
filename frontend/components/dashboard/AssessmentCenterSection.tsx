'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Play,
  ArrowRight,
  Filter,
  ShieldCheck,
  Target,
} from 'lucide-react';
import { ASSESSMENT_CENTER_ITEMS } from '@/lib/curriculumData';
import { AssessmentCenterItem } from '@/types/curriculum';

interface AssessmentCenterSectionProps {
  onStartAssessment?: (assessment: AssessmentCenterItem) => void;
}

const STATUS_STYLE_MAP: Record<string, { bg: string; text: string; border: string }> = {
  Passed: { bg: 'bg-emerald-500/10', text: 'text-emerald-300', border: 'border-emerald-500/40' },
  Available: { bg: 'bg-cyan-500/10', text: 'text-cyan-300', border: 'border-cyan-500/40' },
  'Needs Remediation': { bg: 'bg-rose-500/10', text: 'text-rose-300', border: 'border-rose-500/40' },
  Scheduled: { bg: 'bg-stone-900', text: 'text-stone-400', border: 'border-stone-800' },
};

export const AssessmentCenterSection: React.FC<AssessmentCenterSectionProps> = ({
  onStartAssessment,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const filteredAssessments = ASSESSMENT_CENTER_ITEMS.filter((item) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Passed') return item.status === 'Passed';
    if (selectedFilter === 'Needs Remediation') return item.status === 'Needs Remediation';
    if (selectedFilter === 'Available') return item.status === 'Available' || item.status === 'Scheduled';
    return true;
  });

  return (
    <section id="assessments-section" className="border border-stone-800 bg-[#0e1017] p-6 md:p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-purple-400 font-bold">
            <Target size={14} />
            <span>RIGOROUS ASSESSMENT CENTER</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-stone-100 font-bold tracking-tight">
            Diagnostic & Mastery Assessments
          </h2>
          <p className="text-xs text-stone-300 font-sans max-w-2xl">
            10 automated assessment vectors tracking score, accuracy %, attempt history, isolated weak areas, and cognitive delta.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {['All', 'Passed', 'Needs Remediation', 'Available'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 transition-colors border ${
                selectedFilter === filter
                  ? 'bg-purple-600/30 text-purple-200 border-purple-500 font-bold'
                  : 'bg-[#10131d] text-stone-400 hover:text-stone-200 border-stone-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* ASSESSMENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAssessments.map((item) => {
          const style = STATUS_STYLE_MAP[item.status] || STATUS_STYLE_MAP.Available;
          return (
            <div
              key={item.id}
              className="p-5 bg-[#0c0f18] border border-stone-800 hover:border-purple-500/40 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="text-stone-400 uppercase tracking-wider">{item.domain}</span>
                  <span className={`px-2 py-0.5 border uppercase font-bold ${style.bg} ${style.text} ${style.border}`}>
                    {item.status}
                  </span>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-purple-400 uppercase font-bold">
                    {item.type}
                  </div>
                  <h3 className="font-serif text-base text-stone-100 font-bold">
                    {item.title}
                  </h3>
                </div>

                {/* Score & Accuracy Pills */}
                <div className="grid grid-cols-3 gap-2 font-mono text-[11px] p-2.5 bg-[#080a10] border border-stone-850 text-center">
                  <div>
                    <div className="text-stone-400 text-[10px]">Score</div>
                    <div className="text-emerald-400 font-bold text-sm">{item.score > 0 ? `${item.score}/100` : '—'}</div>
                  </div>
                  <div>
                    <div className="text-stone-400 text-[10px]">Accuracy</div>
                    <div className="text-cyan-300 font-bold text-sm">{item.accuracyPct > 0 ? `${item.accuracyPct}%` : '—'}</div>
                  </div>
                  <div>
                    <div className="text-stone-400 text-[10px]">Mastery Δ</div>
                    <div className="text-purple-300 font-bold text-sm">{item.masteryChangePct > 0 ? `+${item.masteryChangePct}%` : '—'}</div>
                  </div>
                </div>

                {/* Weak Areas Identified */}
                {item.weakAreas.length > 0 && (
                  <div className="text-[11px] font-mono space-y-1">
                    <span className="text-stone-400 uppercase">Focus Areas: </span>
                    <span className="text-rose-300">{item.weakAreas.join(' • ')}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-stone-800 flex items-center justify-between font-mono text-xs">
                <span className="text-stone-400 text-[11px] flex items-center gap-1">
                  <Clock size={11} />
                  <span>{item.timeSpentMinutes > 0 ? `${item.timeSpentMinutes} min spent` : `${item.questionsCount} questions`}</span>
                </span>

                <button
                  onClick={() => onStartAssessment && onStartAssessment(item)}
                  className="px-4 py-1.5 bg-purple-600/30 hover:bg-purple-600 border border-purple-500/40 text-purple-100 hover:text-white font-bold uppercase tracking-wider transition-colors flex items-center gap-1 text-[11px]"
                >
                  <span>{item.score > 0 ? 'RE-TEST' : 'START TEST'}</span>
                  <ArrowRight size={11} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
