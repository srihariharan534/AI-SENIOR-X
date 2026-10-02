'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Target,
  BookOpen,
  Code2,
  Search,
  Briefcase,
  Award,
  Fingerprint,
  Zap,
  Activity,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { JUDGE_DEMO_STEPS } from '@/lib/curriculumData';
import { JudgeDemoStepItem } from '@/types/curriculum';

interface JudgeDemoModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLesson?: (lessonId: string) => void;
}

const ICON_MAP: Record<string, any> = {
  Target,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Code2,
  CheckCircle2,
  Search,
  RotateCcw,
  Briefcase,
  Award,
  Fingerprint,
  Zap,
};

export const JudgeDemoModeModal: React.FC<JudgeDemoModeModalProps> = ({
  isOpen,
  onClose,
  onOpenLesson,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(3500); // 3.5s per step

  const currentStep: JudgeDemoStepItem = JUDGE_DEMO_STEPS[currentStepIdx] || JUDGE_DEMO_STEPS[0];
  const IconComponent = ICON_MAP[currentStep.iconName] || Sparkles;

  // Auto-play timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= JUDGE_DEMO_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#090c13] border border-indigo-500/40 shadow-2xl shadow-indigo-950/60 flex flex-col max-h-[92vh] overflow-hidden text-stone-100 font-sans">
        
        {/* TOP BAR */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-[#0c101a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-white uppercase font-mono">
                  30-Second Judge Experience Mode
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded uppercase font-mono">
                  Autonomous AI Learning OS
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-mono">
                Continuous Product Loop: Assess → Diagnose → Teach → Practice → Remediate → Build → Prove
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Auto-play toggle */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-semibold transition-colors border ${
                isPlaying
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause size={13} />
                  <span>PAUSE TOUR</span>
                </>
              ) : (
                <>
                  <Play size={13} />
                  <span>AUTO-PLAY TOUR</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white border border-stone-800 hover:border-stone-700 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 12-STEP STEPPER RAIL */}
        <div className="px-6 py-3 border-b border-stone-800/80 bg-[#07090f] overflow-x-auto select-none">
          <div className="flex items-center gap-2 min-w-max">
            {JUDGE_DEMO_STEPS.map((step, idx) => {
              const isActive = idx === currentStepIdx;
              const isPast = idx < currentStepIdx;
              return (
                <button
                  key={step.stepNumber}
                  onClick={() => {
                    setCurrentStepIdx(idx);
                    setIsPlaying(false);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white font-bold border border-indigo-400 shadow-md shadow-indigo-600/30'
                      : isPast
                      ? 'bg-[#121522] text-emerald-300 border border-emerald-500/30'
                      : 'bg-[#0e1017] text-stone-400 hover:text-stone-200 border border-stone-800'
                  }`}
                >
                  <span className="text-[10px] opacity-75">{step.stepNumber < 10 ? `0${step.stepNumber}` : step.stepNumber}</span>
                  <span className="truncate max-w-[90px]">{step.badge}</span>
                  {isPast && <span className="text-[10px] text-emerald-400">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN STEP CONTENT AREA */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Big Narrative Card */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${currentStep.color} text-white shadow-xl`}>
                  <IconComponent size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-indigo-400 font-bold uppercase tracking-wider">
                      STEP {currentStep.stepNumber} OF 12
                    </span>
                    <span className="text-stone-600">•</span>
                    <span className="text-stone-400 uppercase">{currentStep.badge}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif text-stone-100 font-semibold tracking-tight">
                    {currentStep.title}
                  </h2>
                </div>
              </div>

              <div className="p-4 bg-[#0e111a] border border-stone-800 space-y-2">
                <div className="font-mono text-[11px] text-stone-400 uppercase tracking-wider">
                  SYSTEM SUB-ROUTINE: <strong className="text-stone-200">{currentStep.subtitle}</strong>
                </div>
                <p className="text-sm text-stone-300 leading-relaxed font-sans">
                  {currentStep.description}
                </p>
              </div>

              {/* Action Simulation Box */}
              <div className="p-4 bg-[#111420] border-l-4 border-indigo-500 border-y border-r border-stone-800/80 space-y-2">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-indigo-300 font-bold uppercase">AUTONOMOUS AGENT ACTION:</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    EXECUTED
                  </span>
                </div>
                <p className="text-xs text-stone-200 font-mono">
                  {currentStep.systemAction}
                </p>
              </div>
            </div>

            {/* Right Column: Live Telemetry Evidence Dossier */}
            <div className="lg:col-span-5 space-y-4">
              <div className="border border-indigo-900/60 bg-[#0e111c] p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-indigo-900/40 pb-3 font-mono text-xs">
                  <span className="text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Fingerprint size={14} />
                    FLIGHT TELEMETRY
                  </span>
                  <span className="px-2 py-0.5 bg-indigo-950 border border-indigo-800 text-indigo-300 text-[10px] font-bold">
                    VERIFIED
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-[#080a10] border border-stone-800 text-emerald-400 leading-relaxed">
                    {currentStep.telemetryEvidence}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-[#0a0d14] border border-stone-800">
                      <div className="text-stone-400 text-[10px]">TWIN STATE</div>
                      <div className="text-stone-200 font-bold">SYNCHRONIZED</div>
                    </div>
                    <div className="p-2 bg-[#0a0d14] border border-stone-800">
                      <div className="text-stone-400 text-[10px]">LOOP LATENCY</div>
                      <div className="text-emerald-400 font-bold">18.4 ms</div>
                    </div>
                  </div>
                </div>

                {/* Direct Action Link if Step 4 */}
                {currentStep.stepNumber === 4 && onOpenLesson && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenLesson('lesson-dl-act-01');
                    }}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/30"
                  >
                    <span>LAUNCH AI LESSON STUDIO</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>

              {/* Hackathon Judge Summary Pill */}
              <div className="p-4 bg-[#0a0d14] border border-stone-800 text-[11px] font-mono text-stone-400 space-y-1">
                <div className="text-amber-400 font-bold uppercase">💡 JUDGE TAKEAWAY:</div>
                <p className="text-stone-300">
                  AI-SENIOR-X is not a static list of video lectures. It is an end-to-end cognitive operating system that closes the loop between diagnosis, individualized teaching, and production proof.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM CONTROLS FOOTER */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-stone-800 bg-[#0a0d14] font-mono text-xs">
          <button
            onClick={() => {
              setCurrentStepIdx((prev) => Math.max(0, prev - 1));
              setIsPlaying(false);
            }}
            disabled={currentStepIdx === 0}
            className="flex items-center gap-2 px-3.5 py-2 border border-stone-800 hover:border-stone-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft size={14} />
            <span>PREVIOUS STEP</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Step {currentStepIdx + 1} of {JUDGE_DEMO_STEPS.length}</span>
            <span className="text-stone-600">•</span>
            <button
              onClick={() => {
                setCurrentStepIdx(0);
                setIsPlaying(false);
              }}
              className="text-stone-400 hover:text-white underline text-[11px]"
            >
              Reset to Step 1
            </button>
          </div>

          <button
            onClick={() => {
              if (currentStepIdx < JUDGE_DEMO_STEPS.length - 1) {
                setCurrentStepIdx((prev) => prev + 1);
              } else {
                onClose();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors"
          >
            <span>{currentStepIdx === JUDGE_DEMO_STEPS.length - 1 ? 'FINISH TOUR' : 'NEXT STEP'}</span>
            <ChevronRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
};
