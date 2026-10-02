'use client';

import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Compass,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Scale,
  ShieldAlert,
  HelpCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { api } from '@/lib/api';
import { ScenarioDefinition, DecisionEvaluationResponse } from '@/types';
import { CoreProductLoop } from '@/components/common/CoreProductLoop';

export default function RealWorldScenariosPage() {
  const [scenarios, setScenarios] = useState<ScenarioDefinition[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioDefinition | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [learnerReasoning, setLearnerReasoning] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<DecisionEvaluationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    setIsLoading(true);
    try {
      const res = await api.getRealWorldScenarios();
      if (res.success && res.data) {
        setScenarios(res.data);
        if (res.data.length > 0) {
          setSelectedScenario(res.data[0]);
          setSelectedOptionId(res.data[0].options[0]?.option_id || '');
        }
      }
    } catch (e) {
      console.error('Failed to load scenarios', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectScenario = (scenario: ScenarioDefinition) => {
    setSelectedScenario(scenario);
    setSelectedOptionId(scenario.options[0]?.option_id || '');
    setLearnerReasoning('');
    setEvaluationResult(null);
  };

  const handleSubmitDecision = async () => {
    if (!selectedScenario || !selectedOptionId) return;
    setIsEvaluating(true);
    try {
      const res = await api.evaluateDecisionScenario({
        scenario_id: selectedScenario.id,
        selected_option_id: selectedOptionId,
        learner_reasoning: learnerReasoning,
      });

      if (res.success && res.data) {
        setEvaluationResult(res.data);
      }
    } catch (e) {
      console.error('Failed to evaluate decision', e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 p-6 rounded-3xl border border-purple-500/20 shadow-2xl space-y-2">
        <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider">
          <Scale size={16} />
          <span>SCENARIO ENGINE & DECISION-MAKING TRAINING</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Architectural Reasoning & Trade-Off Evaluation
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Instead of generic trivia, solve situational engineering crises. Select your architectural
          approach, defend your decision, and get evaluated on Scalability, Cost, Reliability,
          Complexity, and Maintainability.
        </p>
      </div>

      {/* Core Product Loop Step 12/13 */}
      <CoreProductLoop currentActiveStep={13} compact />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scenario Selector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Production Scenarios:
          </div>

          <div className="space-y-3">
            {scenarios.map((scenario) => {
              const isSelected = selectedScenario?.id === scenario.id;
              return (
                <button
                  key={scenario.id}
                  onClick={() => handleSelectScenario(scenario)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                    isSelected
                      ? 'bg-purple-950/50 border-purple-500/70 shadow-lg shadow-purple-500/10'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 uppercase">
                      {scenario.domain}
                    </span>
                    <span className="text-[11px] text-slate-500">{scenario.difficulty}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1">{scenario.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {scenario.scenario_prompt}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Scenario Simulator & Decision Form */}
        <div className="lg:col-span-8 space-y-6">
          {selectedScenario && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              {/* Scenario Context */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                    Production Incident Scenario
                  </span>
                  <span className="text-xs text-slate-400">{selectedScenario.domain}</span>
                </div>

                <h2 className="text-xl font-bold text-white">{selectedScenario.title}</h2>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedScenario.scenario_prompt}
                </p>

                {/* Production Invariants */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                    Critical Constraints:
                  </span>
                  {selectedScenario.constraints.map((c, i) => (
                    <div key={i} className="text-xs text-slate-300 flex items-center gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Architectural Options */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Compass size={14} className="text-purple-400" />
                  <span>Choose Your Architectural Solution:</span>
                </div>

                <div className="space-y-3">
                  {selectedScenario.options.map((option) => {
                    const isChecked = selectedOptionId === option.option_id;
                    return (
                      <div
                        key={option.option_id}
                        onClick={() => setSelectedOptionId(option.option_id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-purple-950/40 border-purple-500/80 shadow-md ring-1 ring-purple-500/40'
                            : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="option"
                            checked={isChecked}
                            onChange={() => setSelectedOptionId(option.option_id)}
                            className="mt-1 accent-purple-500"
                          />
                          <div className="flex-1 space-y-2">
                            <div className="text-sm font-bold text-white">{option.title}</div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {option.description}
                            </p>

                            {/* Trade-off Matrix */}
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-1">
                              {Object.entries(option.tradeoffs).map(([dim, val]) => (
                                <div
                                  key={dim}
                                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800/80 text-[10px]"
                                >
                                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 block font-bold">
                                    {dim}
                                  </span>
                                  <span className="text-slate-300 line-clamp-1">{val}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* WHY DID YOU CHOOSE THIS? */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-purple-300 flex items-center justify-between">
                  <span>"Why did you choose this architecture?"</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    Evaluate trade-offs (Scalability, Cost, Reliability)
                  </span>
                </label>
                <textarea
                  value={learnerReasoning}
                  onChange={(e) => setLearnerReasoning(e.target.value)}
                  rows={4}
                  className="w-full p-3.5 text-xs bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none font-sans leading-relaxed"
                  placeholder="Defend your decision: Why does this option balance operational complexity against zero downtime, and why did you reject the alternatives?"
                />
              </div>

              {/* Submit Decision Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSubmitDecision}
                  disabled={isEvaluating || !selectedOptionId || !learnerReasoning.trim()}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-purple-600/30 transition-all disabled:opacity-50 active:scale-[0.98]"
                >
                  {isEvaluating ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      <span>Evaluating Engineering Trade-offs...</span>
                    </>
                  ) : (
                    <>
                      <BrainCircuit size={15} />
                      <span>Submit & Evaluate Architectural Reasoning</span>
                    </>
                  )}
                </button>
              </div>

              {/* Evaluation Results Drawer */}
              {evaluationResult && (
                <div className="mt-6 p-6 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-4 animate-scaleUp">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                          evaluationResult.is_optimal
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}
                      >
                        {evaluationResult.decision_score}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">
                          {evaluationResult.is_optimal
                            ? 'Optimal Engineering Judgment'
                            : 'Sub-Optimal Trade-Off Selection'}
                        </h4>
                        <p className="text-xs text-slate-300">
                          {evaluationResult.evaluation_feedback}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 5-Dimension Scorecard */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                      Architectural Dimension Scores:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {Object.entries(evaluationResult.dimension_scores).map(([dim, score]) => (
                        <div
                          key={dim}
                          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center"
                        >
                          <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold truncate">
                            {dim.replace(/_/g, ' ')}
                          </div>
                          <div className="text-xs font-mono font-bold text-purple-400">{score}%</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Trade-off Insight */}
                  <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-200 space-y-1">
                    <span className="font-bold block">Engineering Insight:</span>
                    <p className="leading-relaxed">{evaluationResult.key_tradeoff_insight}</p>
                  </div>

                  {/* Actionable Next Step */}
                  <div className="text-xs text-slate-400 flex items-center justify-between pt-2">
                    <span>{evaluationResult.next_action_recommendation}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
