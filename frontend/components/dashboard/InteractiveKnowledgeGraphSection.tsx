'use client';

import React, { useState } from 'react';
import {
  Network,
  Sparkles,
  CheckCircle2,
  Lock,
  AlertTriangle,
  Play,
  ArrowRight,
  TrendingUp,
  Brain,
  Layers,
} from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  track: string;
  status: 'Mastered' | 'Completed' | 'In Progress' | 'Recommended' | 'Weak' | 'Locked';
  masteryPct: number;
  prerequisites: string[];
  lessonId?: string;
  description: string;
}

const KNOWLEDGE_NODES: GraphNode[] = [
  {
    id: 'node-py',
    label: 'Python Architecture',
    track: 'Python Core',
    status: 'Mastered',
    masteryPct: 96,
    prerequisites: [],
    description: 'Memory model, closures, OOP, async concurrency, and performance optimization.',
  },
  {
    id: 'node-sql',
    label: 'Relational SQL & DBs',
    track: 'Data Systems',
    status: 'Completed',
    masteryPct: 82,
    prerequisites: ['Python Architecture'],
    description: 'Multi-table joins, subqueries, window partitions, and index tuning.',
  },
  {
    id: 'node-numpy',
    label: 'NumPy & Linear Algebra',
    track: 'Math & Vectors',
    status: 'Mastered',
    masteryPct: 92,
    prerequisites: ['Python Architecture'],
    description: 'Vectorized broadcasting, matrix multiplication, and eigenspace projections.',
  },
  {
    id: 'node-pandas',
    label: 'Pandas Data Wrangling',
    track: 'Analytics',
    status: 'Completed',
    masteryPct: 88,
    prerequisites: ['NumPy & Linear Algebra'],
    description: 'Data cleaning, groupbys, pivot tables, and time-series resampling.',
  },
  {
    id: 'node-eda',
    label: 'EDA & Statistical Metrics',
    track: 'Statistics',
    status: 'Completed',
    masteryPct: 78,
    prerequisites: ['Pandas Data Wrangling'],
    description: 'Hypothesis testing, distributions, correlation, and feature distributions.',
  },
  {
    id: 'node-ml',
    label: 'Machine Learning Models',
    track: 'Core ML',
    status: 'Completed',
    masteryPct: 76,
    prerequisites: ['EDA & Statistical Metrics'],
    description: 'Supervised regression, classification, cross-validation, and ROC-AUC.',
  },
  {
    id: 'node-feat-eng',
    label: 'Feature Engineering & Ensembles',
    track: 'Core ML',
    status: 'In Progress',
    masteryPct: 68,
    prerequisites: ['Machine Learning Models'],
    description: 'Target encoding, polynomial terms, Random Forests, and XGBoost.',
  },
  {
    id: 'node-dl-act',
    label: 'Neural Network Activations',
    track: 'Deep Learning',
    status: 'Recommended',
    masteryPct: 61,
    prerequisites: ['NumPy & Linear Algebra', 'Machine Learning Models'],
    lessonId: 'lesson-dl-act-01',
    description: 'Non-linear thresholding, ReLU, GELU, and vanishing gradient mitigation.',
  },
  {
    id: 'node-backprop',
    label: 'Backpropagation Calculus',
    track: 'Deep Learning',
    status: 'Weak',
    masteryPct: 44,
    prerequisites: ['Neural Network Activations'],
    description: 'Reverse-mode automatic differentiation DAGs and computational graph traversal.',
  },
  {
    id: 'node-cnn',
    label: 'CNN & Vision Transformers',
    track: 'Deep Learning',
    status: 'Locked',
    masteryPct: 20,
    prerequisites: ['Backpropagation Calculus'],
    description: 'Spatial convolutions, receptive fields, residual connections, and ViTs.',
  },
  {
    id: 'node-transformers',
    label: 'Transformers & Self-Attention',
    track: 'Generative AI',
    status: 'In Progress',
    masteryPct: 62,
    prerequisites: ['Neural Network Activations'],
    description: 'Query-Key-Value attention, multi-head projections, and positional encodings.',
  },
  {
    id: 'node-rag',
    label: 'RAG & Vector Retrieval',
    track: 'Generative AI',
    status: 'In Progress',
    masteryPct: 68,
    prerequisites: ['Transformers & Self-Attention'],
    description: 'Dense vector search, hybrid BM25 fusion, chunking, and reranking.',
  },
  {
    id: 'node-ai-eng',
    label: 'FastAPI & AI Model Serving',
    track: 'AI Engineering',
    status: 'In Progress',
    masteryPct: 67,
    prerequisites: ['Python Architecture', 'RAG & Vector Retrieval'],
    description: 'Async microservices, low-latency token streaming, and semantic caching.',
  },
  {
    id: 'node-production',
    label: 'Production AI & Distributed Scaling',
    track: 'System Design',
    status: 'Locked',
    masteryPct: 35,
    prerequisites: ['FastAPI & AI Model Serving'],
    description: 'Kubernetes deployment, distributed load balancing, and OpenTelemetry tracing.',
  },
];

const STATUS_STYLE_MAP: Record<string, { badgeBg: string; text: string; border: string; glow?: string }> = {
  Mastered: { badgeBg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/50' },
  Completed: { badgeBg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/40' },
  'In Progress': { badgeBg: 'bg-indigo-500/20', text: 'text-indigo-300', border: 'border-indigo-500/40' },
  Recommended: { badgeBg: 'bg-purple-500/30', text: 'text-purple-200', border: 'border-purple-400', glow: 'shadow-lg shadow-purple-500/30 animate-pulse' },
  Weak: { badgeBg: 'bg-rose-500/20', text: 'text-rose-300', border: 'border-rose-500/40' },
  Locked: { badgeBg: 'bg-stone-900', text: 'text-stone-500', border: 'border-stone-800' },
};

interface InteractiveKnowledgeGraphSectionProps {
  onOpenLesson: (lessonId: string) => void;
}

export const InteractiveKnowledgeGraphSection: React.FC<InteractiveKnowledgeGraphSectionProps> = ({
  onOpenLesson,
}) => {
  const [selectedNode, setSelectedNode] = useState<GraphNode>(KNOWLEDGE_NODES[7]); // DL Activations

  return (
    <section id="curriculum-graph" className="border border-stone-800 bg-[#0e1017] p-6 md:p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-indigo-400 font-bold">
            <Network size={14} />
            <span>KNOWLEDGE GRAPH & DEPENDENCY TOPOLOGY</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-stone-100 font-bold tracking-tight">
            Curriculum Dependency Flow
          </h2>
          <p className="text-xs text-stone-300 font-sans max-w-2xl">
            Interactive directed acyclic graph (DAG) showing conceptual prerequisites, mastered nodes, weak concepts, and AI recommended next actions.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
          <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Mastered</span>
          <span className="flex items-center gap-1 text-cyan-400"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Completed</span>
          <span className="flex items-center gap-1 text-indigo-400"><span className="w-2 h-2 rounded-full bg-indigo-400" /> In Progress</span>
          <span className="flex items-center gap-1 text-purple-300"><span className="w-2 h-2 rounded-full bg-purple-400" /> Recommended</span>
          <span className="flex items-center gap-1 text-rose-400"><span className="w-2 h-2 rounded-full bg-rose-400" /> Weak / Gap</span>
          <span className="flex items-center gap-1 text-stone-500"><span className="w-2 h-2 rounded-full bg-stone-700" /> Locked</span>
        </div>
      </div>

      {/* GRAPH CANVAS & SELECTED NODE DETAIL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visual Graph Node Grid (8 cols) */}
        <div className="lg:col-span-8 p-6 bg-[#07090f] border border-stone-800 space-y-4">
          <div className="font-mono text-xs text-stone-400 flex items-center justify-between pb-2 border-b border-stone-800/80">
            <span>DIRECTED ACYCLIC GRAPH TOPOLOGY (CLICK A NODE)</span>
            <span>14 ACTIVE NODES</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {KNOWLEDGE_NODES.map((node) => {
              const isSelected = selectedNode.id === node.id;
              const style = STATUS_STYLE_MAP[node.status] || STATUS_STYLE_MAP.Locked;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-3 text-left transition-all border font-mono space-y-2 relative ${
                    isSelected
                      ? 'bg-[#15192a] border-indigo-400 ring-2 ring-indigo-500/40 shadow-xl'
                      : `${style.badgeBg} ${style.border} hover:border-indigo-400/60`
                  } ${style.glow || ''}`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-stone-400 uppercase truncate max-w-[80px]">{node.track}</span>
                    <span className={`font-bold ${style.text}`}>{node.masteryPct}%</span>
                  </div>

                  <div className="font-serif text-xs font-bold text-stone-100 leading-tight">
                    {node.label}
                  </div>

                  <div className="text-[9px] text-stone-400 uppercase">
                    Status: <strong className={style.text}>{node.status}</strong>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Node Deep Detail Dossier (4 cols) */}
        <div className="lg:col-span-4 p-6 bg-[#0c0f18] border border-indigo-900/50 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between font-mono text-[11px] border-b border-stone-800 pb-2">
              <span className="text-indigo-400 font-bold uppercase">NODE TELEMETRY</span>
              <span className="px-2 py-0.5 bg-[#141824] border border-stone-700 text-stone-300 font-bold text-[10px]">
                {selectedNode.status}
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-mono text-stone-400 uppercase">{selectedNode.track}</div>
              <h3 className="font-serif text-xl font-bold text-white">
                {selectedNode.label}
              </h3>
            </div>

            <p className="text-xs text-stone-300 font-sans leading-relaxed">
              {selectedNode.description}
            </p>

            {/* Mastery & Prerequisites */}
            <div className="space-y-2 pt-1 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Current Mastery:</span>
                <span className="text-emerald-400 font-bold text-sm">{selectedNode.masteryPct}%</span>
              </div>

              <div className="p-3 bg-[#080a10] border border-stone-800 space-y-1 text-[11px]">
                <div className="text-stone-400 uppercase font-bold">PREREQUISITES:</div>
                {selectedNode.prerequisites.length > 0 ? (
                  <div className="space-y-1 text-stone-300">
                    {selectedNode.prerequisites.map((p, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="text-emerald-400">✓</span>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-stone-500">Root Node (No Prerequisites)</div>
                )}
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-3 border-t border-stone-800">
            {selectedNode.status === 'Locked' ? (
              <div className="p-3 bg-stone-900 border border-stone-800 text-stone-400 text-xs font-mono text-center flex items-center justify-center gap-2">
                <Lock size={13} />
                <span>Complete prerequisites to unlock node</span>
              </div>
            ) : (
              <button
                onClick={() => onOpenLesson(selectedNode.lessonId || 'lesson-dl-act-01')}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/30"
              >
                <span>DRILL CONCEPT NODE</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
