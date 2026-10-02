'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { INDUSTRY_SIMULATIONS } from '@/lib/curriculumData';
import { IndustrySimulationItem } from '@/types/curriculum';

interface IndustrySimulationCenterSectionProps {
  onSelectSimulation: (simulation: IndustrySimulationItem) => void;
}

export const IndustrySimulationCenterSection: React.FC<IndustrySimulationCenterSectionProps> = ({
  onSelectSimulation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'FinTech', 'Healthcare', 'E-Commerce', 'Logistics', 'Cloud', 'Cybersecurity', 'Education', 'Agriculture', 'Travel', 'Manufacturing'];

  const filteredSimulations = INDUSTRY_SIMULATIONS.filter((sim) => {
    if (selectedCategory === 'All') return true;
    return sim.category === selectedCategory;
  });

  return (
    <section id="industry-simulations" className="border border-stone-800 bg-[#0e1017] p-6 md:p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-amber-400 font-bold">
            <Briefcase size={14} />
            <span>INDUSTRY SIMULATION CENTER</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-stone-100 font-bold tracking-tight">
            10 Domain-Specific High-Stakes Challenges
          </h2>
          <p className="text-xs text-stone-300 font-sans max-w-2xl">
            Realistic production scenarios evaluated across 7 dimensions: Correctness, Code Quality, Latency Performance, Reasoning, Edge Cases, Architecture, and Business Interpretation.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-mono text-xs select-none max-w-full">
          {categories.slice(0, 6).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 whitespace-nowrap transition-colors border text-[11px] ${
                selectedCategory === cat
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold'
                  : 'bg-[#10131d] text-stone-400 hover:text-stone-200 border-stone-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* SIMULATIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSimulations.map((sim) => {
          const isCompleted = sim.completedStatus === 'Completed';
          return (
            <div
              key={sim.id}
              onClick={() => onSelectSimulation(sim)}
              className="p-5 bg-[#0c0f18] border border-stone-800 hover:border-amber-500/50 cursor-pointer transition-all space-y-4 group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="px-2 py-0.5 bg-amber-950/50 border border-amber-800 text-amber-300 uppercase font-bold">
                    {sim.category}
                  </span>
                  <span className="text-stone-400 uppercase font-bold">
                    {sim.difficulty}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-base text-stone-100 font-bold group-hover:text-amber-300 transition-colors">
                    {sim.title}
                  </h3>
                  <p className="text-xs text-stone-300 font-sans line-clamp-3 pt-1 leading-relaxed">
                    {sim.businessContext}
                  </p>
                </div>

                {/* Skills Required Chips */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {sim.requiredSkills.slice(0, 3).map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-[#121522] border border-stone-800 text-stone-300 text-[10px] font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-stone-800 flex items-center justify-between font-mono text-xs">
                <span className="text-stone-400 text-[11px] flex items-center gap-1">
                  <Clock size={11} />
                  <span>{sim.timeLimitMinutes} min limit</span>
                </span>

                <span className="text-amber-400 group-hover:translate-x-1 transition-transform font-bold flex items-center gap-1">
                  <span>{isCompleted ? 'REVIEW ATTESTATION' : 'SOLVE SIMULATION'}</span>
                  <ArrowRight size={12} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
