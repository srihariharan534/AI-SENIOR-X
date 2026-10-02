'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { KnowledgeState } from '@/types';
import { Network, CheckCircle2, Clock, AlertCircle, Sparkles } from 'lucide-react';

interface KnowledgeMapProps {
  knowledgeState?: KnowledgeState | null;
  onSelectConcept?: (conceptId: string) => void;
}

interface NodeData {
  id: string;
  title: string;
  x: number;
  y: number;
  subject: string;
  mastery: number;
  level: 'NOVICE' | 'DEVELOPING' | 'PROFICIENT' | 'MASTERY';
  prereqs: string[];
}

export const KnowledgeMap: React.FC<KnowledgeMapProps> = ({
  knowledgeState,
  onSelectConcept,
}) => {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);

  // Curriculum Graph node layout definition
  const nodes: NodeData[] = [
    {
      id: 'python_basics',
      title: 'Python Foundations',
      x: 100,
      y: 120,
      subject: 'Python',
      mastery: 0.95,
      level: 'MASTERY',
      prereqs: [],
    },
    {
      id: 'linear_algebra',
      title: 'Linear Algebra & Vectors',
      x: 100,
      y: 280,
      subject: 'Math',
      mastery: 0.88,
      level: 'PROFICIENT',
      prereqs: [],
    },
    {
      id: 'data_processing',
      title: 'Data Wrangling & Pandas',
      x: 320,
      y: 80,
      subject: 'Data Science',
      mastery: 0.80,
      level: 'PROFICIENT',
      prereqs: ['python_basics'],
    },
    {
      id: 'ml_supervised',
      title: 'Supervised Learning',
      x: 340,
      y: 200,
      subject: 'AI/ML',
      mastery: 0.72,
      level: 'DEVELOPING',
      prereqs: ['python_basics', 'linear_algebra'],
    },
    {
      id: 'sql_joins',
      title: 'Relational SQL & JOINs',
      x: 320,
      y: 320,
      subject: 'SQL',
      mastery: 0.55,
      level: 'DEVELOPING',
      prereqs: [],
    },
    {
      id: 'neural_networks',
      title: 'Deep Neural Networks',
      x: 560,
      y: 140,
      subject: 'AI/ML',
      mastery: 0.65,
      level: 'DEVELOPING',
      prereqs: ['ml_supervised'],
    },
    {
      id: 'transformers_llm',
      title: 'Transformers & RAG Architecture',
      x: 580,
      y: 280,
      subject: 'AI/ML',
      mastery: 0.40,
      level: 'NOVICE',
      prereqs: ['neural_networks'],
    },
  ];

  // Overlay real mastery scores if present
  if (knowledgeState?.concepts) {
    nodes.forEach((n) => {
      if (knowledgeState.concepts[n.id]) {
        n.mastery = knowledgeState.concepts[n.id].mastery_score;
        n.level = knowledgeState.concepts[n.id].mastery_level;
      }
    });
  }

  const getStatusColor = (level: string) => {
    switch (level) {
      case 'MASTERY':
        return '#10b981'; // emerald
      case 'PROFICIENT':
        return '#6366f1'; // indigo
      case 'DEVELOPING':
        return '#f59e0b'; // amber
      default:
        return '#64748b'; // slate
    }
  };

  const handleNodeClick = (n: NodeData) => {
    setSelectedNode(n);
    if (onSelectConcept) onSelectConcept(n.id);
  };

  return (
    <Card className="p-4 sm:p-6 space-y-4">
      <CardHeader>
        <CardTitle>
          <Network size={18} className="text-indigo-400" />
          Cognitive Knowledge DAG Map
        </CardTitle>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Mastered
          </span>
          <span className="flex items-center gap-1 text-indigo-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block" /> Proficient
          </span>
          <span className="flex items-center gap-1 text-amber-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Developing
          </span>
          <span className="flex items-center gap-1 text-slate-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block" /> Novice
          </span>
        </div>
      </CardHeader>

      {/* SVG Canvas Map */}
      <div className="relative w-full h-96 bg-slate-950/90 rounded-2xl border border-slate-800 overflow-hidden select-none">
        <svg className="w-full h-full" viewBox="0 0 720 400">
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="20"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(99, 102, 241, 0.4)" />
            </marker>
          </defs>

          {/* Prerequisite Connection Edges */}
          {nodes.map((source) =>
            source.prereqs.map((prereqId) => {
              const target = nodes.find((n) => n.id === prereqId);
              if (!target) return null;

              return (
                <line
                  key={`${target.id}->${source.id}`}
                  x1={target.x}
                  y1={target.y}
                  x2={source.x}
                  y2={source.y}
                  stroke="rgba(99, 102, 241, 0.35)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  markerEnd="url(#arrow)"
                />
              );
            })
          )}

          {/* Knowledge Nodes */}
          {nodes.map((n) => {
            const isSelected = selectedNode?.id === n.id;
            const color = getStatusColor(n.level);

            return (
              <g
                key={n.id}
                transform={`translate(${n.x}, ${n.y})`}
                onClick={() => handleNodeClick(n)}
                className="cursor-pointer group"
              >
                {/* Glow ring */}
                <circle
                  r={isSelected ? 26 : 20}
                  fill="rgba(15, 23, 42, 0.9)"
                  stroke={color}
                  strokeWidth={isSelected ? 3 : 2}
                  style={{
                    filter: `drop-shadow(0 0 8px ${color}80)`,
                    transition: 'all 0.2s ease',
                  }}
                />

                {/* Inner Mastery Progress Circle */}
                <circle
                  r="12"
                  fill={`${color}30`}
                />

                {/* Node Title Label */}
                <text
                  y="34"
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontSize="11"
                  fontWeight="600"
                  className="pointer-events-none drop-shadow-md"
                >
                  {n.title}
                </text>

                {/* Score Pill */}
                <text
                  y="4"
                  textAnchor="middle"
                  fill={color}
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="monospace"
                  className="pointer-events-none"
                >
                  {Math.round(n.mastery * 100)}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-bold text-white">{selectedNode.title}</h4>
              <Badge variant={selectedNode.level === 'MASTERY' ? 'emerald' : 'indigo'} size="sm">
                {selectedNode.level}
              </Badge>
              <span className="text-xs text-slate-400 font-mono">
                Mastery Score: <strong className="text-white">{Math.round(selectedNode.mastery * 100)}%</strong>
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Domain: <strong className="text-indigo-300">{selectedNode.subject}</strong> | Prerequisites:{' '}
              {selectedNode.prereqs.length > 0 ? selectedNode.prereqs.join(', ') : 'None'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`/learn/${selectedNode.id}`}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30"
            >
              Study Topic
            </a>
            <a
              href={`/practice?topic=${selectedNode.id}`}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            >
              Practice
            </a>
          </div>
        </div>
      )}
    </Card>
  );
};
