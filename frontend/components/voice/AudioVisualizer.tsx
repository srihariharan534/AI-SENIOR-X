'use client';

import React from 'react';

interface AudioVisualizerProps {
  level: number; // 0 to 100
  isActive: boolean;
  state?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  level,
  isActive,
  state = 'idle',
}) => {
  const bars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="flex items-center justify-center gap-1.5 h-12 px-4">
      {bars.map((bar, idx) => {
        // Compute pseudo height scaled by audio level
        const factor = Math.sin((idx / bars.length) * Math.PI);
        const dynamicHeight = isActive
          ? Math.max(6, Math.min(44, Math.round((level * factor * 0.8) + 6)))
          : 6;

        const isSpeaking = state === 'speaking';

        return (
          <div
            key={bar}
            className={`w-1.5 rounded-full transition-all duration-75 ${
              isSpeaking
                ? 'bg-gradient-to-t from-cyan-500 to-indigo-400'
                : isActive
                ? 'bg-gradient-to-t from-indigo-500 to-purple-400'
                : 'bg-slate-700/50'
            }`}
            style={{
              height: `${dynamicHeight}px`,
              boxShadow: isActive ? '0 0 8px rgba(99, 102, 241, 0.4)' : 'none',
            }}
          />
        );
      })}
    </div>
  );
};
