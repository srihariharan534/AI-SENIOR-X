'use client';

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Zap,
  CheckCircle2,
  Cpu,
  Globe,
  TrendingUp,
} from 'lucide-react';
import { api } from '@/lib/api';

export const RealWorldOutcomeDashboard: React.FC = () => {
  const [challengeFeed, setChallengeFeed] = useState<any[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadChallengeFeed();
  }, []);

  const loadChallengeFeed = async () => {
    try {
      const res = await api.getChallengeFeed();
      if (res.success && res.data) {
        setChallengeFeed(res.data);
      }
    } catch (e) {
      console.error('Failed to load challenge feed', e);
    } finally {
      setIsLoading(false);
    }
  };

  const outcomeStages = [
    { label: 'Concepts Learned', count: 48, icon: Layers, color: 'text-indigo-400' },
    { label: 'Skills Demonstrated', count: 24, icon: Zap, color: 'text-purple-400' },
    { label: 'Problems Solved', count: 37, icon: CheckCircle2, color: 'text-blue-400' },
    { label: 'Projects Completed', count: 4, icon: Briefcase, color: 'text-emerald-400' },
    { label: 'Portfolio Proofs', count: 4, icon: ShieldCheck, color: 'text-amber-400' },
  ];

  return (
    <div className="space-y-6">
      {/* SECTION: FROM LEARNING -> APPLICATION OUTCOME PIPELINE */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <TrendingUp size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">From Learning → Application</h3>
              <p className="text-xs text-slate-400">
                Outcome-oriented progression connecting theory to verified capability.
              </p>
            </div>
          </div>

          <a
            href="/job-readiness"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            <span>View Job Readiness</span>
            <ArrowRight size={13} />
          </a>
        </div>

        {/* 5-Stage Outcome Pipeline */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {outcomeStages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.label}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 relative overflow-hidden flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-slate-500 font-bold">0{idx + 1}</span>
                  <Icon size={16} className={stage.color} />
                </div>
                <div>
                  <div className="text-xl font-mono font-bold text-white mb-0.5">{stage.count}</div>
                  <div className="text-[11px] text-slate-400 font-medium leading-tight">
                    {stage.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION: REAL-WORLD CHALLENGE FEED */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Globe size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Domain-Specific Real-World Challenges</h3>
              <p className="text-xs text-slate-400">
                Industry problem statements dynamically matched to your skill path.
              </p>
            </div>
          </div>

          <a
            href="/projects"
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
          >
            <span>All Projects</span>
            <ArrowRight size={13} />
          </a>
        </div>

        {/* Challenge Feed Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {challengeFeed.slice(0, 6).map((chal) => (
            <div
              key={chal.id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 hover:border-purple-500/40 flex flex-col justify-between transition-all space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 uppercase">
                    {chal.domain}
                  </span>
                  <span className="text-[10px] text-slate-500">{chal.estimated_minutes} min</span>
                </div>
                <h4 className="text-xs font-bold text-white mb-1">{chal.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">{chal.summary}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                <div className="flex gap-1">
                  {chal.skills.slice(0, 2).map((s: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <a
                  href="/projects"
                  className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-0.5"
                >
                  <span>Solve</span>
                  <ArrowRight size={11} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
