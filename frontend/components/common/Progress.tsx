'use client';

import React from 'react';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  color?: 'indigo' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  color = 'indigo',
  size = 'md',
  showLabel = false,
  className = '',
  ...props
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colorStyles = {
    indigo: 'bg-indigo-500 shadow-sm shadow-indigo-500/50',
    cyan: 'bg-cyan-500 shadow-sm shadow-cyan-500/50',
    emerald: 'bg-emerald-500 shadow-sm shadow-emerald-500/50',
    amber: 'bg-amber-500 shadow-sm shadow-amber-500/50',
    rose: 'bg-rose-500 shadow-sm shadow-rose-500/50',
    gradient: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 shadow-sm shadow-indigo-500/50',
  };

  return (
    <div className={`w-full ${className}`} {...props}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs text-slate-400 font-medium">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/50 ${sizeStyles[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorStyles[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
