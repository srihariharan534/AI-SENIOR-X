'use client';

import React, { useState } from 'react';

interface FlightEvent {
  id: string;
  time: string;
  category: 'ASSESSMENT' | 'MISCONCEPTION' | 'CHALLENGE' | 'TUTOR' | 'SYSTEM' | 'PROJECT';
  title: string;
  detail: string;
  deltaSkill?: string;
  evidenceCode?: string;
}

interface TimelineGroup {
  dayLabel: string;
  dateStr: string;
  events: FlightEvent[];
}

const DEFAULT_TIMELINE: TimelineGroup[] = [
  {
    dayLabel: 'TODAY',
    dateStr: 'OCT 01, 2026',
    events: [
      {
        id: 'FL-902',
        time: '22:14',
        category: 'ASSESSMENT',
        title: 'Completed RAG Pipeline Evaluation Assessment',
        detail: 'Scored 94% on dense vs sparse retrieval trade-offs. Weakness tagged on recall@5 under noisy queries.',
        deltaSkill: '+14 XP [Gen AI]',
        evidenceCode: 'EVD-9844',
      },
      {
        id: 'FL-901',
        time: '18:42',
        category: 'MISCONCEPTION',
        title: 'Diagnosed Retrieval Framing Misconception',
        detail: 'Resolved confusion between bi-encoder latency and cross-encoder re-ranking throughput.',
        deltaSkill: 'Twin Calibrated',
      },
      {
        id: 'FL-900',
        time: '16:20',
        category: 'CHALLENGE',
        title: 'Executed SQL High-Concurrency Challenge',
        detail: 'Refactored CTE pipeline with recursive indexing, reducing query plan execution by 420ms.',
        deltaSkill: '+22 XP [SQL]',
        evidenceCode: 'EVD-9812',
      },
    ],
  },
  {
    dayLabel: 'YESTERDAY',
    dateStr: 'SEP 30, 2026',
    events: [
      {
        id: 'FL-895',
        time: '21:03',
        category: 'PROJECT',
        title: 'Finished Python Async Production Module',
        detail: 'Passed unit tests for non-blocking task queue with structured concurrency exception groups.',
        deltaSkill: '+30 XP [Python]',
        evidenceCode: 'EVD-9740',
      },
      {
        id: 'FL-892',
        time: '14:11',
        category: 'TUTOR',
        title: 'AI Senior Architect Live Socratic Session',
        detail: 'Drilled CAP theorem tradeoffs in distributed vector databases under network partition.',
        deltaSkill: 'Insight Logged',
      },
    ],
  },
  {
    dayLabel: 'EARLIER THIS WEEK',
    dateStr: 'SEP 28, 2026',
    events: [
      {
        id: 'FL-880',
        time: '19:45',
        category: 'SYSTEM',
        title: 'Learning Twin Baseline State Updated',
        detail: 'Promoted Python from DEVELOPING to APPLIED state based on 3 passing project builds.',
        deltaSkill: 'STATUS: APPLIED',
        evidenceCode: 'SYS-AUDIT-03',
      },
    ],
  },
];

const CATEGORY_TAG_MAP: Record<FlightEvent['category'], { bg: string; text: string; border: string }> = {
  ASSESSMENT: { bg: 'bg-blue-950/60', text: 'text-blue-300', border: 'border-blue-800/60' },
  MISCONCEPTION: { bg: 'bg-amber-950/60', text: 'text-amber-300', border: 'border-amber-800/60' },
  CHALLENGE: { bg: 'bg-emerald-950/60', text: 'text-emerald-300', border: 'border-emerald-800/60' },
  TUTOR: { bg: 'bg-purple-950/60', text: 'text-purple-300', border: 'border-purple-800/60' },
  PROJECT: { bg: 'bg-cyan-950/60', text: 'text-cyan-300', border: 'border-cyan-800/60' },
  SYSTEM: { bg: 'bg-stone-900/80', text: 'text-stone-300', border: 'border-stone-700/60' },
};

export const FlightRecorderTimeline: React.FC = () => {
  const [filter, setFilter] = useState<string>('ALL');

  return (
    <section className="border border-stone-800 bg-[#0c0e14] p-6 md:p-8 space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-stone-400">
            <span className="text-cyan-400 font-bold">● FLIGHT RECORDER</span>
            <span className="text-stone-600">/</span>
            <span>TELEMETRY TIMELINE</span>
          </div>
          <h2 className="mt-2 text-2xl md:text-3xl font-serif text-stone-100 tracking-tight">
            Learning Activity Blackbox
          </h2>
          <p className="mt-1 text-xs text-stone-400 font-mono">
            Sequential ledger of actual learning actions, assessment results, and skill state mutations.
          </p>
        </div>

        {/* Filter Selector */}
        <div className="flex items-center gap-1 bg-[#12151d] p-1 border border-stone-800 font-mono text-[10px]">
          {['ALL', 'ASSESSMENT', 'CHALLENGE', 'TUTOR'].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-2.5 py-1 uppercase tracking-wider transition-colors ${
                filter === item
                  ? 'bg-stone-200 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Groups */}
      <div className="space-y-8">
        {DEFAULT_TIMELINE.map((group) => {
          const filteredEvents =
            filter === 'ALL'
              ? group.events
              : group.events.filter((e) => e.category === filter);

          if (filteredEvents.length === 0) return null;

          return (
            <div key={group.dayLabel} className="space-y-3">
              {/* Day Divider Marker */}
              <div className="flex items-center gap-3 font-mono text-[11px] text-stone-400 border-b border-stone-800/80 pb-2">
                <span className="font-bold text-stone-200 tracking-wider">{group.dayLabel}</span>
                <span className="text-stone-600">|</span>
                <span className="text-stone-400">{group.dateStr}</span>
                <span className="ml-auto text-[10px] text-stone-400">
                  {filteredEvents.length} RECORDED EVENT{filteredEvents.length > 1 ? 'S' : ''}
                </span>
              </div>

              {/* Event Rows */}
              <div className="space-y-2 font-mono">
                {filteredEvents.map((evt) => {
                  const tagStyle = CATEGORY_TAG_MAP[evt.category];

                  return (
                    <div
                      key={evt.id}
                      className="group grid grid-cols-1 md:grid-cols-12 gap-3 p-3.5 border border-stone-800/70 bg-[#11141b] hover:border-stone-700 transition-colors items-start"
                    >
                      {/* Timestamp & ID */}
                      <div className="md:col-span-2 flex items-center md:flex-col md:items-start justify-between text-stone-400">
                        <span className="text-stone-200 font-bold text-sm tracking-wider">{evt.time}</span>
                        <span className="text-[10px] text-stone-400 tracking-widest">{evt.id}</span>
                      </div>

                      {/* Category & Title & Description */}
                      <div className="md:col-span-8 space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.5 border text-[9px] font-bold uppercase tracking-wider ${tagStyle.border} ${tagStyle.bg} ${tagStyle.text}`}
                          >
                            {evt.category}
                          </span>
                          <span className="font-serif text-sm text-stone-200 group-hover:text-white font-medium">
                            {evt.title}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 font-sans leading-relaxed">
                          {evt.detail}
                        </p>
                      </div>

                      {/* Skill delta / Evidence Code */}
                      <div className="md:col-span-2 flex flex-row md:flex-col items-end justify-between md:justify-center text-right space-y-1 pt-1 md:pt-0">
                        {evt.deltaSkill && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 border border-emerald-900/60">
                            {evt.deltaSkill}
                          </span>
                        )}
                        {evt.evidenceCode && (
                          <span className="text-[9px] text-stone-400 tracking-wider">
                            {evt.evidenceCode}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
