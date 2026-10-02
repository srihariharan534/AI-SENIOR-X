'use client';

import React from 'react';
import {
  Layers,
  CheckCircle2,
  Clock,
  ArrowDown,
  ArrowRight,
  ChevronRight,
  Lock,
  Sparkles,
} from 'lucide-react';
import { UniversityModule } from '@/lib/universityData';

interface FullCurriculumMapSectionProps {
  courseName: string;
  modules: UniversityModule[];
  onSelectModule?: (mod: UniversityModule) => void;
}

const STATUS_CONFIG: Record<string, { badge: string; text: string; bg: string; border: string }> = {
  APPLIED: { badge: '✓ APPLIED', text: 'text-emerald-800', bg: 'bg-emerald-50', border: 'border-emerald-400' },
  DEMONSTRATED: { badge: '✓ DEMONSTRATED', text: 'text-blue-800', bg: 'bg-blue-50', border: 'border-blue-400' },
  DEVELOPING: { badge: '◐ DEVELOPING', text: 'text-purple-800', bg: 'bg-purple-50', border: 'border-purple-400' },
  LEARNING: { badge: '○ LEARNING', text: 'text-amber-800', bg: 'bg-amber-50', border: 'border-amber-400' },
  'NOT STARTED': { badge: '🔒 NOT STARTED', text: 'text-stone-500', bg: 'bg-stone-100', border: 'border-stone-300' },
};

export const FullCurriculumMapSection: React.FC<FullCurriculumMapSectionProps> = ({
  courseName,
  modules,
  onSelectModule,
}) => {
  return (
    <section id="curriculum" className="bg-[#fcfbfa] border border-stone-300 p-6 md:p-10 space-y-8 text-stone-900 font-sans">
      {/* HEADER */}
      <div className="space-y-2 border-b border-stone-200 pb-6">
        <div className="flex items-center gap-2 font-mono text-xs text-blue-700 uppercase font-bold tracking-widest">
          <Layers size={14} />
          <span>COMPLETE CURRICULUM ARCHITECTURE</span>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl text-stone-900 font-normal tracking-tight">
          Visual Curriculum Map: Foundation → Production Capstone
        </h2>
        <p className="text-sm text-stone-600 font-sans max-w-3xl leading-relaxed">
          {modules.length} structured modules spanning foundational memory architectures, asynchronous event loops, microservices, and capstone engineering.
        </p>
      </div>

      {/* MODULE PROGRESSION STACK (VERTICAL FLOW WITH EDITORIAL NUMBERING) */}
      <div className="space-y-4">
        {modules.map((mod, idx) => {
          const status = STATUS_CONFIG[mod.status] || STATUS_CONFIG['NOT STARTED'];
          return (
            <div key={mod.id} className="relative">
              <div
                onClick={() => onSelectModule && onSelectModule(mod)}
                className={`p-6 bg-white border hover:border-blue-700 cursor-pointer transition-all duration-150 flex flex-col md:flex-row md:items-center justify-between gap-4 ${status.border}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-stone-900 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {mod.moduleNumber < 10 ? `0${mod.moduleNumber}` : mod.moduleNumber}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-stone-500">
                      <span className="font-bold text-blue-700">{mod.levelTier}</span>
                      <span>•</span>
                      <span>{mod.totalVideoDurationMinutes} min AI Teaching</span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-stone-900 hover:text-blue-700 transition-colors">
                      {mod.title}
                    </h3>

                    <p className="text-xs text-stone-600 font-sans line-clamp-2 max-w-2xl">
                      {mod.description}
                    </p>
                  </div>
                </div>

                {/* Status Pill & Action CTA */}
                <div className="flex items-center gap-4 shrink-0 font-mono text-xs justify-between md:justify-end">
                  <span className={`px-2.5 py-1 text-[10px] font-bold border uppercase ${status.bg} ${status.text} ${status.border}`}>
                    {status.badge}
                  </span>

                  <span className="text-blue-700 font-bold uppercase flex items-center gap-1 text-[11px] group-hover:translate-x-1 transition-transform">
                    <span>EXPLORE</span>
                    <ChevronRight size={14} />
                  </span>
                </div>
              </div>

              {/* Connecting Arrow between modules */}
              {idx < modules.length - 1 && (
                <div className="flex justify-center my-1.5 text-stone-400">
                  <ArrowDown size={14} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
