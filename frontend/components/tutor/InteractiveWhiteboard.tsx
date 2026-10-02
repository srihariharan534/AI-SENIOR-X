'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import {
  Layers,
  Sparkles,
  GitBranch,
  Network,
  Cpu,
  Database,
  ArrowRight,
  Maximize2,
  Minimize2,
  RefreshCw,
  Plus,
  Play,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

interface WhiteboardNode {
  id: string;
  title: string;
  description: string;
  category: 'input' | 'process' | 'formula' | 'output' | 'decision';
  status: 'active' | 'completed' | 'focus';
}

const DEFAULT_TOPICS: Record<
  string,
  {
    title: string;
    description: string;
    nodes: WhiteboardNode[];
    formula?: string;
    flowSummary: string;
  }
> = {
  neural_network: {
    title: 'Neural Network Forward & Backward Propagation',
    description: 'Interactive visualization of activation flows, loss computation, and chain-rule gradient propagation.',
    formula: 'W_{new} = W_{old} - \eta \cdot \frac{\partial L}{\partial W}',
    flowSummary: 'Input Features → Dense Layer (W·x + b) → ReLU Activation → Softmax Output → Cross-Entropy Loss → Backprop Gradients',
    nodes: [
      { id: '1', title: 'Input Layer X', description: 'Batch features [N, D_in]', category: 'input', status: 'completed' },
      { id: '2', title: 'Affine Transform', description: 'Z1 = X · W1 + b1', category: 'process', status: 'completed' },
      { id: '3', title: 'ReLU Non-Linearity', description: 'A1 = max(0, Z1)', category: 'process', status: 'focus' },
      { id: '4', title: 'Cross-Entropy Loss', description: 'L = -Σ y·log(p)', category: 'formula', status: 'active' },
      { id: '5', title: 'Gradient Flow (Chain Rule)', description: '∂L/∂W1 = ∂L/∂A1 · ∂A1/∂Z1 · ∂Z1/∂W1', category: 'output', status: 'active' },
    ],
  },
  gradient_descent: {
    title: 'Gradient Descent Optimization Dynamics',
    description: 'Loss surface contours and parameter update trajectory with momentum and adaptive learning rate.',
    formula: '\theta_{t+1} = \theta_t - \alpha \nabla_\theta J(\theta_t)',
    flowSummary: 'Random Initialization → Compute Cost J(θ) → Compute Gradients ∇J → Update Parameters θ → Check Convergence (ε < 1e-5)',
    nodes: [
      { id: '1', title: 'Initialize θ_0', description: 'Random uniform weights near 0', category: 'input', status: 'completed' },
      { id: '2', title: 'Compute Loss Surface J(θ)', description: 'Mean Squared Error / Log-Loss', category: 'formula', status: 'completed' },
      { id: '3', title: 'Calculate Jacobian ∇J', description: 'Partial derivatives with respect to each parameter', category: 'process', status: 'focus' },
      { id: '4', title: 'Learning Rate Step (α)', description: 'Scale step size: too large diverges, too small plateaus', category: 'decision', status: 'active' },
      { id: '5', title: 'Optimal Minima θ*', description: 'Global or robust local minimum reached', category: 'output', status: 'active' },
    ],
  },
  sql_joins: {
    title: 'Relational Database JOIN Topologies',
    description: 'Venn-diagram and hash-join execution plan representation of relational set operations.',
    formula: '\sigma_{Orders.customer\_id = Customers.id}(Customers \bowtie Orders)',
    flowSummary: 'Table A (Left) + Table B (Right) → Hash Join / Nested Loop Match On Key → Select Attributes → Filter Where Predicates',
    nodes: [
      { id: '1', title: 'Customers Table (Left)', description: 'Primary Key: customer_id (100k rows)', category: 'input', status: 'completed' },
      { id: '2', title: 'Orders Table (Right)', description: 'Foreign Key: customer_id (2.4M rows)', category: 'input', status: 'completed' },
      { id: '3', title: 'Join Condition Predicate', description: 'INNER vs LEFT vs FULL OUTER comparison', category: 'decision', status: 'focus' },
      { id: '4', title: 'Execution Engine', description: 'Hash Table build on Customers + Probe on Orders', category: 'process', status: 'active' },
      { id: '5', title: 'Unified Result Tuple Set', description: 'Aggregated fields: customer_name, total_spent', category: 'output', status: 'active' },
    ],
  },
};

export const InteractiveWhiteboard: React.FC = () => {
  const [selectedTopicKey, setSelectedTopicKey] = useState<string>('neural_network');
  const [activeStep, setActiveStep] = useState<number>(2);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [userNotes, setUserNotes] = useState<string>('');

  const currentTopic = DEFAULT_TOPICS[selectedTopicKey] || DEFAULT_TOPICS['neural_network'];

  const getCategoryColor = (cat: WhiteboardNode['category']) => {
    switch (cat) {
      case 'input':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'process':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'formula':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'decision':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'output':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto' : ''}`}>
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Network size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Interactive Teaching Canvas & Whiteboard
              <Badge variant="indigo" size="sm">Live Graph</Badge>
            </h2>
            <p className="text-xs text-slate-400">
              Visual reasoning diagrams, mathematical derivation maps, and runtime execution trees.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {Object.entries(DEFAULT_TOPICS).map(([key, topic]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedTopicKey(key);
                setActiveStep(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedTopicKey === key
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {topic.title.split(' ')[0]}
            </button>
          ))}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 ml-2"
            title="Toggle Canvas Maximize"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Graph & Node Map (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl min-h-[420px] flex flex-col justify-between overflow-hidden">
            {/* Grid Pattern Background */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Topic Info */}
            <div className="relative z-10 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Architecture & Concept Flow</span>
              <h3 className="text-xl font-black text-white">{currentTopic.title}</h3>
              <p className="text-xs text-slate-400 max-w-xl">{currentTopic.description}</p>
            </div>

            {/* Formula Overlay if present */}
            {currentTopic.formula && (
              <div className="relative z-10 my-4 p-3 rounded-xl bg-slate-900/90 border border-amber-500/30 text-amber-200 text-center font-mono text-sm shadow-inner">
                <span className="text-[10px] uppercase font-bold text-amber-500 block mb-0.5">Core Governing Relation</span>
                {currentTopic.formula}
              </div>
            )}

            {/* Interactive Node Graph */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-5 gap-3 my-4">
              {currentTopic.nodes.map((node, idx) => {
                const isCurrent = activeStep === idx;
                const isPassed = activeStep > idx;
                return (
                  <div
                    key={node.id}
                    onClick={() => setActiveStep(idx)}
                    className={`cursor-pointer p-3 rounded-xl border transition-all transform hover:-translate-y-0.5 flex flex-col justify-between min-h-[110px] ${
                      isCurrent
                        ? 'bg-indigo-950/70 border-indigo-400 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500/50'
                        : isPassed
                        ? 'bg-slate-900/80 border-emerald-500/40 opacity-90'
                        : 'bg-slate-900/40 border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-slate-400">Step {idx + 1}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase border ${getCategoryColor(
                            node.category
                          )}`}
                        >
                          {node.category}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white leading-tight">{node.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">{node.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Playback & Step Slider */}
            <div className="relative z-10 flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs">
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                  disabled={activeStep === 0}
                >
                  Previous Step
                </Button>
                <Button
                  variant="glow"
                  size="sm"
                  onClick={() => setActiveStep((prev) => Math.min(currentTopic.nodes.length - 1, prev + 1))}
                  disabled={activeStep === currentTopic.nodes.length - 1}
                >
                  Next Step
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveStep(0)}
                  icon={<RotateCcw size={14} />}
                >
                  Reset
                </Button>
              </div>

              <span className="text-slate-400 font-mono text-[11px]">
                Step {activeStep + 1} of {currentTopic.nodes.length}
              </span>
            </div>
          </div>

          {/* Active Node Deep Dive */}
          <Card className="p-4 bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                Active Step Analysis
              </span>
              <Badge variant="indigo" size="sm">
                {currentTopic.nodes[activeStep]?.category.toUpperCase()}
              </Badge>
            </div>
            <h4 className="text-sm font-bold text-white">
              {currentTopic.nodes[activeStep]?.title}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentTopic.nodes[activeStep]?.description}
            </p>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono">
              Pipeline: {currentTopic.flowSummary}
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Whiteboard Scratchpad & Learner Notes */}
        <div className="space-y-4">
          <Card className="p-4 bg-slate-900 border border-slate-800 space-y-3">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-white">
                <BookOpen size={16} className="text-amber-400" />
                Teaching Canvas Notes
              </CardTitle>
            </CardHeader>
            <p className="text-xs text-slate-400 leading-relaxed">
              Jot down observations, mathematical relations, or questions as you step through the visual explanation.
            </p>
            <textarea
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="e.g. When the learning rate alpha is 0.5, divergence occurs because gradient steps overshoot the local minimum..."
              rows={8}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none font-mono"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Auto-saved to session context</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUserNotes('')}
              >
                Clear Notes
              </Button>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
              <Sparkles size={15} className="text-indigo-400" />
              Socratic Visual Guidance
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Notice how modifying the forward activation changes the downstream error derivative. In multi-layer perceptrons,
              vanishing gradients happen when the derivative of the activation function saturates near 0.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
