'use client';

import React from 'react';
import Link from 'next/link';

interface UpNextCourse {
  track: string;
  topic: string;
  moduleLabel: string;
  href: string;
  badge: string;
}

const UP_NEXT_QUEUE: UpNextCourse[] = [
  {
    track: 'SQL & DATA',
    topic: 'Window Partitioning & Moving Averages',
    moduleLabel: 'Module 03 / Lesson 08',
    href: '/learn/sql-window-functions',
    badge: 'HIGH PRIORITY',
  },
  {
    track: 'AI / ML',
    topic: 'Cross-Validation & Model Evaluation Curves',
    moduleLabel: 'Module 04 / Lesson 02',
    href: '/learn/ml-evaluation',
    badge: 'SCHEDULED',
  },
  {
    track: 'CLOUD & OPS',
    topic: 'Container Orchestration & Docker Multi-Stage',
    moduleLabel: 'Module 05 / Lesson 01',
    href: '/learn/docker-deployment',
    badge: 'PREREQUISITE',
  },
];

export const CourseContinuationSection: React.FC = () => {
  return (
    <section className="border border-stone-800 bg-[#0e1017] p-6 md:p-8 space-y-6">
      {/* Primary Continuation Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center border-b border-stone-800 pb-6">
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-stone-400">
            <span className="text-blue-400 font-bold">● ACTIVE COURSE</span>
            <span className="text-stone-600">/</span>
            <span>CONTINUE WHERE YOU LEFT OFF</span>
          </div>

          <div className="space-y-1">
            <div className="font-mono text-xs text-stone-400 uppercase tracking-wider">
              Track 01 — Python Engineering Core
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-stone-100">
              Advanced Functions, Closures & Decorators
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-stone-400 pt-1">
            <span className="bg-stone-900 px-2 py-1 border border-stone-800 text-stone-300">
              Lesson 07 / 12
            </span>
            <span>42% through module</span>
            <span className="text-stone-600">•</span>
            <span>Estimated remaining: 18 min</span>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center space-y-3">
          <Link
            href="/learn/python"
            className="inline-flex items-center gap-3 font-mono text-xs font-semibold px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white uppercase tracking-wider transition-colors w-full lg:w-auto justify-center"
          >
            <span>RESUME LESSON 07</span>
            <span>→</span>
          </Link>
          <div className="font-mono text-[10px] text-stone-500">
            Last active today at 21:03 • Auto-checkpoint saved
          </div>
        </div>
      </div>

      {/* Up Next Queue */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="font-mono text-[11px] uppercase tracking-widest text-stone-400">
            UP NEXT IN CURRICULUM QUEUE
          </div>
          <Link
            href="/courses"
            className="font-mono text-[11px] text-stone-400 hover:text-stone-200 uppercase tracking-wider"
          >
            EXPLORE ALL TRACKS →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {UP_NEXT_QUEUE.map((item, idx) => (
            <Link
              key={item.topic}
              href={item.href}
              className="group border border-stone-800/80 bg-[#12151e] p-4 flex flex-col justify-between hover:border-stone-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] text-stone-400 mb-2">
                  <span className="text-stone-300 font-bold">{item.track}</span>
                  <span className="text-amber-400/80">{item.badge}</span>
                </div>
                <h4 className="font-serif text-sm text-stone-200 group-hover:text-white transition-colors">
                  {item.topic}
                </h4>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-800/60 flex items-center justify-between font-mono text-[10px] text-stone-500">
                <span>{item.moduleLabel}</span>
                <span className="text-stone-400 group-hover:text-blue-400 transition-colors">QUEUE 0{idx + 1} →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
