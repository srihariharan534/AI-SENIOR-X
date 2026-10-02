'use client';

import React, { useState } from 'react';
import { Brain, Sparkles, Layers, Activity, ArrowRight, ShieldCheck } from 'lucide-react';

export interface ConstellationNode {
  id: string;
  name: string;
  state: 'INTRODUCED' | 'LEARNING' | 'DEVELOPING' | 'DEMONSTRATED' | 'APPLIED' | 'RETAINED';
  x: number; // percentage
  y: number; // percentage
  masteryPct: number;
  evidenceCount: number;
  recentAssessmentScore?: number;
  remedialConcept?: string;
}

const DEFAULT_NODES: ConstellationNode[] = [
  { id: 'python', name: 'PYTHON', state: 'APPLIED', x: 50, y: 15, masteryPct: 92, evidenceCount: 23, recentAssessmentScore: 94 },
  { id: 'sql', name: 'SQL & DB', state: 'DEMONSTRATED', x: 22, y: 40, masteryPct: 86, evidenceCount: 14, recentAssessmentScore: 88 },
  { id: 'data', name: 'DATA SYSTEMS', state: 'DEMONSTRATED', x: 78, y: 40, masteryPct: 84, evidenceCount: 12, recentAssessmentScore: 85 },
  { id: 'ml', name: 'MACHINE LEARNING', state: 'DEVELOPING', x: 32, y: 68, masteryPct: 74, evidenceCount: 9, recentAssessmentScore: 78, remedialConcept: 'Loss Surface Convexity & Learning Rate Tuning' },
  { id: 'deep-learning', name: 'DEEP LEARNING', state: 'LEARNING', x: 68, y: 68, masteryPct: 62, evidenceCount: 6, recentAssessmentScore: 65, remedialConcept: 'Backpropagation Vector Calculus' },
  { id: 'gen-ai', name: 'GENERATIVE AI', state: 'DEVELOPING', x: 50, y: 88, masteryPct: 71, evidenceCount: 8, recentAssessmentScore: 75, remedialConcept: 'RAG Retrieval Evaluation & Re-Ranking' },
  { id: 'cloud', name: 'CLOUD & MLOPS', state: 'INTRODUCED', x: 12, y: 82, masteryPct: 45, evidenceCount: 3, remedialConcept: 'Docker Multi-Stage Builds & Kubernetes Pods' },
  { id: 'system-design', name: 'SYSTEM DESIGN', state: 'INTRODUCED', x: 88, y: 82, masteryPct: 50, evidenceCount: 4, remedialConcept: 'Distributed Caching & Sharding' },
];

const CONNECTIONS = [
  ['python', 'sql'],
  ['python', 'data'],
  ['python', 'ml'],
  ['sql', 'ml'],
  ['data', 'deep-learning'],
  ['ml', 'deep-learning'],
  ['ml', 'gen-ai'],
  ['deep-learning', 'gen-ai'],
  ['sql', 'cloud'],
  ['data', 'system-design'],
];

const STATE_STYLE_MAP: Record<string, { badge: string; dot: string; glow: string }> = {
  RETAINED: { badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', dot: 'bg-emerald-400', glow: 'shadow-emerald-500/30' },
  APPLIED: { badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', dot: 'bg-cyan-400', glow: 'shadow-cyan-500/30' },
  DEMONSTRATED: { badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40', dot: 'bg-indigo-400', glow: 'shadow-indigo-500/30' },
  DEVELOPING: { badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40', dot: 'bg-amber-400', glow: 'shadow-amber-500/30' },
  LEARNING: { badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40', dot: 'bg-blue-400', glow: 'shadow-blue-500/30' },
  INTRODUCED: { badge: 'bg-slate-700/40 text-slate-400 border-slate-700', dot: 'bg-slate-500', glow: '' },
};

export const SkillConstellationMap: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<ConstellationNode>(DEFAULT_NODES[5]); // Default to Gen AI

  return (
    <div className="border border-slate-800 bg-[#090D16] rounded-2xl p-6 sm:p-8 space-y-6 text-slate-100 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase font-bold text-indigo-400 tracking-wider">
              COGNITIVE TWIN // LIVE KNOWLEDGE CONSTELLATION
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-serif tracking-tight mt-0.5">
            Interactive Skill State Topology
          </h2>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-cyan-300"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> APPLIED</span>
          <span className="flex items-center gap-1 text-indigo-300"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> DEMONSTRATED</span>
          <span className="flex items-center gap-1 text-amber-300"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> DEVELOPING</span>
          <span className="flex items-center gap-1 text-slate-400"><span className="w-1.5 h-1.5 rounded-full bg-slate-500" /> INTRODUCED</span>
        </div>
      </div>

      {/* Main Graph Grid Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Visual Map Stage (8 cols) */}
        <div className="lg:col-span-8 relative h-[360px] sm:h-[420px] bg-black/80 rounded-2xl border border-slate-800/90 overflow-hidden">
          {/* Subtle Grid Lines */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #3B82F6 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {CONNECTIONS.map(([fromId, toId], idx) => {
              const fromNode = DEFAULT_NODES.find((n) => n.id === fromId);
              const toNode = DEFAULT_NODES.find((n) => n.id === toId);
              if (!fromNode || !toNode) return null;

              const isHighlighted =
                selectedNode.id === fromId || selectedNode.id === toId;

              return (
                <line
                  key={idx}
                  x1={`${fromNode.x}%`}
                  y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`}
                  y2={`${toNode.y}%`}
                  stroke={isHighlighted ? '#38BDF8' : '#1E293B'}
                  strokeWidth={isHighlighted ? 2 : 1}
                  strokeDasharray={isHighlighted ? 'none' : '4,4'}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {/* Interactive Constellation Nodes */}
          {DEFAULT_NODES.map((node) => {
            const isSelected = selectedNode.id === node.id;
            const style = STATE_STYLE_MAP[node.state] || STATE_STYLE_MAP['INTRODUCED'];

            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-all duration-200 z-10`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <div
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center border text-[11px] font-mono font-black transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-cyan-400 shadow-xl shadow-cyan-500/30 ring-2 ring-cyan-400 scale-110'
                      : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-indigo-400 hover:scale-105'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${style.dot} mr-1`} />
                  {node.masteryPct}%
                </div>

                <span
                  className={`text-[9px] sm:text-[10px] font-mono font-bold mt-1 px-1.5 py-0.5 rounded tracking-tight transition-colors whitespace-nowrap ${
                    isSelected
                      ? 'bg-black text-cyan-300 border border-cyan-500/50 font-black'
                      : 'text-slate-400 bg-black/60 group-hover:text-slate-200'
                  }`}
                >
                  {node.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Node Inspector (4 cols) */}
        <div className="lg:col-span-4 bg-black/70 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between h-[360px] sm:h-[420px]">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">
                NODE INSPECTION
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${STATE_STYLE_MAP[selectedNode.state]?.badge}`}>
                {selectedNode.state}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white font-serif">{selectedNode.name}</h3>
              <p className="text-xs font-mono text-indigo-300">
                Cognitive Mastery: <strong>{selectedNode.masteryPct}%</strong> ({selectedNode.evidenceCount} verified evidence items)
              </p>
            </div>

            {selectedNode.recentAssessmentScore && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Last Automated Assessment
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Score: {selectedNode.recentAssessmentScore}%</span>
                  <ShieldCheck size={14} className="text-emerald-400" />
                </div>
              </div>
            )}

            {selectedNode.remedialConcept && (
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-amber-400 block">
                  Cognitive Twin Target Gap
                </span>
                <p className="text-[11px] leading-snug">{selectedNode.remedialConcept}</p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <a
              href={`/learn/${selectedNode.id}`}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs font-mono text-center flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
            >
              <span>Explore {selectedNode.name} Syllabus</span>
              <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
