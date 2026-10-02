'use client';

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Layers,
  Sparkles,
  ArrowRight,
  Code2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  ChevronRight,
  FileCode2,
  Cpu,
  RefreshCw,
  Award,
  Terminal,
  FileText,
  Lightbulb,
} from 'lucide-react';
import { api } from '@/lib/api';
import { ProjectDefinition, ProjectEvaluation, PortfolioEvidenceRecord } from '@/types';
import { CoreProductLoop } from '@/components/common/CoreProductLoop';

export default function RealWorldProjectsPage() {
  const [projects, setProjects] = useState<ProjectDefinition[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectDefinition | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [planExplanation, setPlanExplanation] = useState<string>('');
  const [solutionCode, setSolutionCode] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<ProjectEvaluation | null>(null);
  const [portfolioEvidence, setPortfolioEvidence] = useState<PortfolioEvidenceRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'catalog' | 'workspace' | 'portfolio'>('catalog');
  const [isLoading, setIsLoading] = useState(true);

  const domains = ['All', 'Python', 'SQL', 'Machine Learning', 'Cloud', 'DSA', 'Data Analytics'];

  useEffect(() => {
    loadProjects();
    loadPortfolio();
  }, [selectedDomain]);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const res = await api.getRealWorldProjects(selectedDomain === 'All' ? undefined : selectedDomain);
      if (res.success && res.data) {
        setProjects(res.data);
      }
    } catch (e) {
      console.error('Failed to load projects', e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPortfolio = async () => {
    try {
      const res = await api.getPortfolioEvidence();
      if (res.success && res.data) {
        setPortfolioEvidence(res.data);
      }
    } catch (e) {
      console.error('Failed to load portfolio', e);
    }
  };

  const handleLaunchProject = (project: ProjectDefinition) => {
    setSelectedProject(project);
    setSolutionCode(project.starter_template || '');
    setPlanExplanation('');
    setEvaluation(null);
    setCurrentStep(1);
    setActiveTab('workspace');
  };

  const handleSubmitSolution = async () => {
    if (!selectedProject) return;
    setIsSubmitting(true);
    try {
      const res = await api.submitRealWorldProject({
        project_id: selectedProject.id,
        phase: 'Submit',
        solution_code: solutionCode,
        plan_explanation: planExplanation,
        hints_used: 0,
        time_spent_seconds: 1800,
      });

      if (res.success && res.data) {
        setEvaluation(res.data);
        setCurrentStep(5); // Evaluation step
        if (res.data.evidence_generated) {
          loadPortfolio();
        }
      }
    } catch (e) {
      console.error('Failed to submit project', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 rounded-3xl border border-indigo-500/20 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Briefcase size={16} />
            <span>REAL-WORLD PROBLEM → REAL-WORLD SOLUTION LAYER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Production Engineering Projects & Evidence
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Bridge the gap between theoretical knowledge and real-world execution. Build scalable
            data pipelines, resilient cloud microservices, and optimize real production bottlenecks.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'catalog'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Project Catalog
          </button>
          {selectedProject && (
            <button
              onClick={() => setActiveTab('workspace')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'workspace'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Active Workspace
            </button>
          )}
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'portfolio'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Portfolio ({portfolioEvidence.length})</span>
          </button>
        </div>
      </div>

      {/* Core Loop Visualizer */}
      <CoreProductLoop currentActiveStep={13} />

      {/* CATALOG VIEW */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Domain Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {domains.map((domain) => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedDomain === domain
                    ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {domain}
              </button>
            ))}
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-slate-900/90 border border-slate-800/90 hover:border-indigo-500/50 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                      {project.domain}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                      <Clock size={12} />
                      <span>{project.estimated_time_minutes} min</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-indigo-200 transition-colors mb-2">
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                    {project.problem_statement}
                  </p>

                  {/* Production Constraints Box */}
                  {project.constraints && project.constraints.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 mb-4 space-y-1.5">
                      <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                        Real-World Constraint:
                      </span>
                      <p className="text-[11px] text-slate-300 line-clamp-2">
                        {project.constraints[0].description}
                      </p>
                    </div>
                  )}

                  {/* Skills Demonstrated */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.skills_demonstrated.slice(0, 3).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleLaunchProject(project)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/90 hover:bg-indigo-600 text-white font-semibold text-xs transition-all shadow-md active:scale-[0.98]"
                >
                  <span>Launch Project Workspace</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVE WORKSPACE VIEW */}
      {activeTab === 'workspace' && selectedProject && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel: Problem Context & 8-Step Workflow */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                  {selectedProject.domain} • {selectedProject.difficulty}
                </span>
                <span className="text-xs text-slate-400">Step {currentStep} of 8</span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">{selectedProject.title}</h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {selectedProject.problem_statement}
                </p>
              </div>

              {/* Business Context Alert */}
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                  <Lightbulb size={14} />
                  <span>Business Impact Context:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedProject.business_context}
                </p>
              </div>

              {/* Production Constraints */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  Production Constraints
                </span>
                {selectedProject.constraints.map((c, i) => (
                  <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <div>
                      <strong className="text-white">{c.constraint_type}:</strong> {c.description}
                      {c.threshold && (
                        <span className="ml-1 text-amber-300 font-mono text-[10px]">
                          [{c.threshold}]
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Guided Steps Breakdown */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Implementation Steps:
                </span>
                {selectedProject.steps.map((step) => (
                  <div
                    key={step.step_number}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
                  >
                    <div className="font-bold text-white mb-0.5">
                      {step.step_number}. {step.title}
                    </div>
                    <div className="text-slate-400 text-[11px]">{step.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Solution Architecture Plan & Code Workspace */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileCode2 className="text-indigo-400" size={18} />
                  <span className="text-sm font-bold text-white">Solution Workspace</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Language / Dialect: {selectedProject.domain}
                </span>
              </div>

              {/* Step 2: Architecture Plan Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>1. Architectural Plan & Trade-off Justification:</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    Explain your design before or alongside code
                  </span>
                </label>
                <textarea
                  value={planExplanation}
                  onChange={(e) => setPlanExplanation(e.target.value)}
                  rows={3}
                  className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 resize-none font-sans"
                  placeholder="Outline your approach, time/space complexity, and how you handle real-world scale constraints..."
                />
              </div>

              {/* Step 3: Code Implementation */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>2. Production Implementation:</span>
                  <span className="text-[10px] font-mono text-emerald-400">Editor Active</span>
                </label>
                <textarea
                  value={solutionCode}
                  onChange={(e) => setSolutionCode(e.target.value)}
                  rows={14}
                  className="w-full p-4 font-mono text-xs bg-slate-950 border border-slate-800 rounded-2xl text-indigo-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed"
                  placeholder="Write your production code or queries here..."
                />
              </div>

              {/* Submit & Evaluation Button */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  ← Back to Catalog
                </button>

                <button
                  onClick={handleSubmitSolution}
                  disabled={isSubmitting || !solutionCode.trim()}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 transition-all disabled:opacity-50 active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      <span>Executing AI Rubric & Stress Tests...</span>
                    </>
                  ) : (
                    <>
                      <Cpu size={15} />
                      <span>Submit for AI Evaluation & Certification</span>
                    </>
                  )}
                </button>
              </div>

              {/* Evaluation Results Drawer */}
              {evaluation && (
                <div className="mt-6 p-6 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-4 animate-scaleUp">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                          evaluation.passed
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}
                      >
                        {evaluation.score}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {evaluation.passed ? 'Project Passed & Certified!' : 'Revision Needed'}
                        </h4>
                        <p className="text-xs text-slate-400">{evaluation.feedback_summary}</p>
                      </div>
                    </div>

                    {evaluation.evidence_badge && (
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                        {evaluation.evidence_badge}
                      </span>
                    )}
                  </div>

                  {/* Rubric Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                    {Object.entries(evaluation.rubric_scores).map(([key, val]) => (
                      <div
                        key={key}
                        className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center"
                      >
                        <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold truncate">
                          {key.replace(/_/g, ' ')}
                        </div>
                        <div className="text-xs font-mono font-bold text-indigo-400">{val}%</div>
                      </div>
                    ))}
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                    <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                      <span className="font-bold text-emerald-400 text-[11px] block">
                        Verified Strengths:
                      </span>
                      <ul className="space-y-1 text-slate-300">
                        {evaluation.strengths.map((s, i) => (
                          <li key={i}>✓ {s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1">
                      <span className="font-bold text-amber-400 text-[11px] block">
                        Identified Weaknesses & Fixes:
                      </span>
                      <ul className="space-y-1 text-slate-300">
                        {evaluation.identified_weaknesses.map((w, i) => (
                          <li key={i}>○ {w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Next Step Action */}
                  <div className="pt-2 flex items-center justify-between text-xs text-indigo-300">
                    <span>{evaluation.next_action}</span>
                    {evaluation.evidence_generated && (
                      <button
                        onClick={() => setActiveTab('portfolio')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
                      >
                        View Verified Portfolio Evidence →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PORTFOLIO EVIDENCE VIEW */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Verified Portfolio Evidence</h2>
              <p className="text-xs text-slate-400">
                Cryptographically hashed records proving real-world project mastery.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('catalog')}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors"
            >
              + Start New Real-World Project
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolioEvidence.map((record) => (
              <div
                key={record.id}
                className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/30 border border-indigo-500/30 rounded-3xl p-6 shadow-xl space-y-4 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30 uppercase">
                      {record.domain} VERIFIED
                    </span>
                    <h3 className="text-lg font-bold text-white mt-2">{record.project_title}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Award size={22} />
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{record.summary_of_work}</p>

                {/* Skills Demonstrated */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Skills Demonstrated:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {record.skills_demonstrated.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] px-2.5 py-0.5 rounded-md bg-slate-800 text-indigo-300 border border-slate-700 font-medium"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Verification Footer */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="font-mono text-[10px] text-slate-400">
                    Proof ID: <span className="text-indigo-300 font-bold">{record.verification_hash}</span>
                  </div>
                  <div className="text-emerald-400 font-bold text-xs">
                    Score: {record.score}/100
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
