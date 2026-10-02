'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Target,
  Layers,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  Plus,
  Brain,
} from 'lucide-react';
import { NEXT_BEST_ACTION } from '@/lib/curriculumData';
import { RecommendedActionDetail } from '@/types/curriculum';

interface NextBestLearningActionCardProps {
  action?: RecommendedActionDetail;
  onStartAction?: (lessonId: string) => void;
  onAddToPlan?: () => void;
}

export const NextBestLearningActionCard: React.FC<NextBestLearningActionCardProps> = ({
  action = NEXT_BEST_ACTION,
  onStartAction,
  onAddToPlan,
}) => {
  const [showWhyThis, setShowWhyThis] = useState<boolean>(false);
  const [added, setAdded] = useState<boolean>(false);

  const handleAdd = () => {
    setAdded(true);
    if (onAddToPlan) onAddToPlan();
  };

  return (
    <section className="border border-purple-500/40 bg-[#0d0f1a] p-6 md:p-8 space-y-6 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-500/20 pb-4 font-mono text-[11px]">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-purple-500/20 text-purple-300">
            <Sparkles size={13} />
          </span>
          <span className="text-purple-300 font-bold uppercase tracking-widest">
            NEXT BEST LEARNING ACTION
          </span>
          <span className="text-stone-600">/</span>
          <span className="text-stone-400 uppercase">COGNITIVE TWIN DIRECTIVE</span>
        </div>

        <div className="flex items-center gap-3 text-stone-400">
          <span>Priority Weight: <strong className="text-purple-300 font-bold">9.6 / 10</strong></span>
          <span className="text-stone-600">|</span>
          <span className="text-cyan-400 flex items-center gap-1">
            <Clock size={12} />
            <span>{action.estimatedMinutes} min</span>
          </span>
        </div>
      </div>

      {/* MAIN RECOMMENDATION CARD */}
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="font-mono text-xs text-stone-400 uppercase">
            {action.subject} → {action.module}
          </div>
          <h3 className="font-serif text-2xl md:text-3xl text-stone-100 font-bold tracking-tight">
            &ldquo;{action.title}&rdquo;
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed max-w-3xl">
          {action.whyThis.narrative}
        </p>

        {/* BUTTON BAR */}
        <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
          <button
            onClick={() => onStartAction && onStartAction(action.actionLessonId)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-lg shadow-purple-600/30"
          >
            <span>START NOW</span>
            <ArrowRight size={14} />
          </button>

          <button
            onClick={() => setShowWhyThis(!showWhyThis)}
            className="px-4 py-3 bg-[#131626] border border-purple-500/30 hover:border-purple-400 text-purple-200 transition-colors flex items-center gap-2"
          >
            <span>{showWhyThis ? 'HIDE REASONING' : 'WHY THIS? (EXPLAIN)'}</span>
            {showWhyThis ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <button
            onClick={handleAdd}
            disabled={added}
            className={`px-4 py-3 border transition-colors flex items-center gap-2 ${
              added
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-[#10131d] border-stone-800 hover:border-stone-700 text-stone-300'
            }`}
          >
            {added ? <CheckCircle2 size={14} /> : <Plus size={14} />}
            <span>{added ? 'ADDED TO TODAY’S PLAN' : 'ADD TO PLAN'}</span>
          </button>
        </div>

        {/* EXPANDABLE TRANSPARENT "WHY THIS?" REASONING PANEL */}
        {showWhyThis && (
          <div className="p-5 bg-[#080a10] border border-purple-900/50 space-y-4 font-mono text-xs animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2 text-purple-400 font-bold uppercase border-b border-stone-800 pb-2">
              <Brain size={14} />
              <span>TRANSPARENT COGNITIVE TWIN REASONING AUDIT</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-[#0d101a] border border-stone-800 space-y-1">
                <div className="text-[10px] text-stone-400 uppercase font-bold">1. PREREQUISITE STATUS:</div>
                <div className="text-stone-300">{action.whyThis.prerequisiteNote}</div>
              </div>

              <div className="p-3 bg-[#0d101a] border border-stone-800 space-y-1">
                <div className="text-[10px] text-stone-400 uppercase font-bold">2. CURRENT MASTERY:</div>
                <div className="text-emerald-400 font-bold">{action.whyThis.currentMasteryPct}% (Target threshold: 80%)</div>
              </div>

              <div className="p-3 bg-[#140e12] border border-rose-900/40 space-y-1">
                <div className="text-[10px] text-rose-400 uppercase font-bold">3. DETECTED MISCONCEPTION:</div>
                <div className="text-stone-200 font-sans">{action.whyThis.detectedMisconception}</div>
              </div>

              <div className="p-3 bg-[#0d101a] border border-stone-800 space-y-1">
                <div className="text-[10px] text-stone-400 uppercase font-bold">4. CONNECTED CAPSTONE PROJECT:</div>
                <div className="text-cyan-300 font-sans">{action.whyThis.connectedProject}</div>
              </div>
            </div>

            <div className="p-3 bg-[#0a0d14] border border-stone-800 space-y-1">
              <div className="text-[10px] text-stone-400 uppercase font-bold">5. UNLOCKS 3 UPCOMING ADVANCED MODULES:</div>
              <div className="flex flex-wrap gap-2 pt-0.5">
                {action.whyThis.requiredByUpcoming.map((item, i) => (
                  <span key={i} className="px-2 py-0.5 bg-[#121522] border border-stone-800 text-stone-300 text-[11px]">
                    🔒 {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
