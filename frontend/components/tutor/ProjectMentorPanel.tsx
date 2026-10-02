'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  Compass,
  CheckCircle2,
  Clock,
  Layers,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Cpu,
} from 'lucide-react';
import { api } from '@/lib/api';
import { ProjectMentorResponse } from '@/types';

export const ProjectMentorPanel: React.FC = () => {
  const [projectGoal, setProjectGoal] = useState('Customer Churn Prediction Pipeline with Real-Time Drift Detection');
  const [domain, setDomain] = useState('Machine Learning');
  const [errorLogs, setErrorLogs] = useState('');
  const [isGuiding, setIsGuiding] = useState(false);
  const [mentorResponse, setMentorResponse] = useState<ProjectMentorResponse | null>(null);

  const handleGuide = async () => {
    if (!projectGoal.trim()) return;
    setIsGuiding(true);

    try {
      const res = await api.guideProjectMentor({
        project_goal: projectGoal,
        domain,
        current_milestone_index: 1,
        error_logs: errorLogs.trim() || undefined,
      });

      if (res.success && res.data) {
        setMentorResponse(res.data);
      }
    } catch (e) {
      console.error('Failed to get project guidance', e);
    } finally {
      setIsGuiding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Project Launcher & Log Input */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Briefcase className="text-indigo-400" size={18} />
          <h3 className="text-base font-bold text-white">AI Project Mentor & Architecture Advisor</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Project Goal / Problem Statement:
            </label>
            <input
              type="text"
              value={projectGoal}
              onChange={(e) => setProjectGoal(e.target.value)}
              placeholder="e.g. Build a log analyzer or customer churn predictor..."
              className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Domain / Track:
            </label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none"
            >
              <option value="Machine Learning">Machine Learning</option>
              <option value="Python Engineering">Python Engineering</option>
              <option value="SQL & Data Analytics">SQL & Data Analytics</option>
              <option value="Cloud Architecture">Cloud Architecture</option>
              <option value="DSA & Optimization">DSA & Optimization</option>
            </select>
          </div>
        </div>

        {/* Optional Error Logs */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle size={13} className="text-amber-400" />
            <span>Project Debugging Error Logs / Bottlenecks (Optional):</span>
          </label>
          <textarea
            value={errorLogs}
            onChange={(e) => setErrorLogs(e.target.value)}
            rows={3}
            className="w-full p-3 font-mono text-xs bg-slate-950 border border-slate-800 rounded-xl text-amber-200 focus:outline-none focus:border-indigo-500 resize-none"
            placeholder="Paste stack traces, memory warnings, or query execution plans..."
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleGuide}
            disabled={isGuiding || !projectGoal.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            {isGuiding ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Computing Milestones & Architecture...</span>
              </>
            ) : (
              <>
                <Compass size={14} />
                <span>Generate Roadmap & Mentor Project</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mentor Roadmap & Architecture Results */}
      {mentorResponse && (
        <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl space-y-6 animate-scaleUp">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                Milestone Roadmap
              </span>
              <h4 className="text-lg font-bold text-white mt-1.5">
                {mentorResponse.project_title}
              </h4>
              <p className="text-xs text-slate-300 mt-1">{mentorResponse.scope_summary}</p>
            </div>
          </div>

          {/* Debugging Diagnosis if logs submitted */}
          {mentorResponse.debugging_diagnosis && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 space-y-1.5">
              <span className="font-bold text-amber-400 uppercase tracking-wider block">
                Project Log Debugging Diagnosis:
              </span>
              {typeof mentorResponse.debugging_diagnosis === 'string' ? (
                <p className="leading-relaxed">{mentorResponse.debugging_diagnosis}</p>
              ) : (
                <div className="space-y-1">
                  <p className="font-semibold text-white">
                    Root Cause: {(mentorResponse.debugging_diagnosis as any).root_cause}
                  </p>
                  <p className="text-slate-300">
                    {(mentorResponse.debugging_diagnosis as any).pedagogical_explanation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Architecture Overview */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <span className="font-bold text-indigo-300 uppercase tracking-wider block">
              Recommended Architecture & Tech Stack:
            </span>
            <div className="flex flex-wrap gap-1.5 pb-1">
              {mentorResponse.recommended_tech_stack.map((t, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono">
                  {t}
                </span>
              ))}
            </div>
            <p className="text-slate-400">{mentorResponse.architecture_overview}</p>
          </div>

          {/* Milestone Roadmap */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Project Milestones:
            </span>
            <div className="space-y-2">
              {mentorResponse.milestones.map((m: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border flex items-center justify-between gap-4 bg-slate-950 border-slate-800 text-slate-300 hover:border-indigo-500/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-indigo-400">0{m.milestone_number || m.index || idx + 1}</span>
                    <div>
                      <div className="text-xs font-bold text-white">{m.title}</div>
                      <div className="text-[11px] text-slate-400 opacity-90">{m.objective || m.guidance}</div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-indigo-500/30 text-indigo-300 font-semibold">
                    {m.estimated_hours ? `${m.estimated_hours} hrs` : m.status || 'Planned'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-indigo-300 border-t border-slate-800">
            <span>{mentorResponse.next_action_recommendation || (mentorResponse as any).next_action}</span>
            <a
              href="/projects"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
            >
              Open Project Workspace →
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
