'use client';

import React from 'react';
import { TutorPedagogyMode } from '@/types';
import { Sparkles, Layers, Code, HelpCircle, Wrench, Lightbulb, Compass } from 'lucide-react';

interface TutorModeSelectorProps {
  currentMode: TutorPedagogyMode;
  onSelectMode: (mode: TutorPedagogyMode) => void;
}

export const TutorModeSelector: React.FC<TutorModeSelectorProps> = ({
  currentMode,
  onSelectMode,
}) => {
  const modes: { mode: TutorPedagogyMode; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      mode: 'EXPLAIN_SIMPLY',
      label: 'Explain Simply',
      icon: <Lightbulb size={14} />,
      desc: 'Intuitive plain-English breakdown',
    },
    {
      mode: 'DEEP_DIVE',
      label: 'Deep Dive',
      icon: <Layers size={14} />,
      desc: 'Rigorous theoretical & mathematical detail',
    },
    {
      mode: 'GIVE_EXAMPLE',
      label: 'Give Example',
      icon: <Code size={14} />,
      desc: 'Concrete runnable code and practical use case',
    },
    {
      mode: 'ANALOGY',
      label: 'Use Analogy',
      icon: <Compass size={14} />,
      desc: 'Relatable everyday metaphors',
    },
    {
      mode: 'QUIZ_ME',
      label: 'Quiz Me',
      icon: <HelpCircle size={14} />,
      desc: 'Socratic diagnostic questions',
    },
    {
      mode: 'FIX_MISTAKE',
      label: 'Fix Mistake',
      icon: <Wrench size={14} />,
      desc: 'Analyze and debug cognitive misconceptions',
    },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
      {modes.map((m) => {
        const isSelected = currentMode === m.mode;
        return (
          <button
            key={m.mode}
            onClick={() => onSelectMode(m.mode)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              isSelected
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
            title={m.desc}
          >
            <span className={isSelected ? 'text-white' : 'text-indigo-400'}>{m.icon}</span>
            <span>{m.label}</span>
          </button>
        );
      })}
    </div>
  );
};
