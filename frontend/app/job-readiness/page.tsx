'use client';

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  Award,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { api } from '@/lib/api';
import { JobReadinessProfile, ExplainableRecommendation, PortfolioEvidenceRecord } from '@/types';
import { ExplainableRecommendationCard } from '@/components/common/ExplainableRecommendationCard';
import { CoreProductLoop } from '@/components/common/CoreProductLoop';

export default function JobReadinessPage() {
  const [profile, setProfile] = useState<JobReadinessProfile | null>(null);
  const [recommendations, setRecommendations] = useState<ExplainableRecommendation[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioEvidenceRecord[]>([]);
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [resProfile, resRecs, resPortfolio] = await Promise.all([
        api.getJobReadinessProfile(),
        api.getExplainableRecommendations(),
        api.getPortfolioEvidence(),
      ]);

      if (resProfile.success && resProfile.data) {
        setProfile(resProfile.data);
      }
      if (resRecs.success && resRecs.data) {
        setRecommendations(resRecs.data);
      }
      if (resPortfolio.success && resPortfolio.data) {
        setPortfolio(resPortfolio.data);
      }
    } catch (e) {
      console.error('Failed to load readiness data', e);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Strong':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Developing':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'Needs practice':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Needs evidence':
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 sm:p-8 rounded-3xl border border-indigo-500/20 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Briefcase size={16} />
              <span>SKILL → EVIDENCE SYSTEM & JOB-READINESS LAYER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Evidence-Based Career Readiness
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              No fabricated arbitrary percentages. AI-SENIOR-X proves readiness solely through
              demonstrated mastery, independently solved tasks, and verified real-world project artifacts.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Award size={24} />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Target Role
              </div>
              <div className="text-sm font-bold text-white">
                {profile?.career_target || 'Senior Full-Stack AI & Data Engineer'}
              </div>
              <div className="text-[11px] text-emerald-400 mt-0.5">
                {profile?.total_verified_evidence_items || 15} Verified Evidence Proofs
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Product Loop */}
      <CoreProductLoop currentActiveStep={14} compact />

      {/* SECTION 1: SKILL READINESS GRID WITH DEMONSTRATED VS NEEDED EVIDENCE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Empirical Competency Matrix</h2>
            <p className="text-xs text-slate-400">
              Every status is backed by concrete logs: exercises solved, hints used, and production tasks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile?.skills.map((skill) => (
            <div
              key={skill.skill_name}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-5 hover:border-slate-700 transition-all"
            >
              <div className="space-y-4">
                {/* Header & Status */}
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white tracking-wide">
                    {skill.skill_name}
                  </h3>
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border uppercase ${getStatusBadge(
                      skill.status
                    )}`}
                  >
                    {skill.status}
                  </span>
                </div>

                {/* Quantitative Metric Counters */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <div>
                    <div className="text-xs font-mono font-bold text-white">
                      {skill.exercises_completed}
                    </div>
                    <div className="text-[9px] text-slate-500 uppercase">Solved</div>
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-emerald-400">
                      {skill.independently_solved}
                    </div>
                    <div className="text-[9px] text-slate-500 uppercase">Independent</div>
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-amber-400">
                      {skill.hints_required}
                    </div>
                    <div className="text-[9px] text-slate-500 uppercase">Hints</div>
                  </div>
                </div>

                {/* Demonstrated Evidence List */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    <span>Demonstrated Evidence:</span>
                  </span>
                  <div className="space-y-1 text-xs text-slate-300">
                    {skill.demonstrated_evidence.map((ev, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                        <span className="line-clamp-2">{ev}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing Evidence Needed */}
                {skill.missing_evidence && skill.missing_evidence.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Circle size={11} className="text-slate-500" />
                      <span>Evidence Still Needed:</span>
                    </span>
                    <div className="space-y-1 text-xs text-slate-400">
                      {skill.missing_evidence.map((mev, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <span className="text-slate-500 shrink-0">○</span>
                          <span className="line-clamp-2">{mev}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actionable CTA */}
              <button
                onClick={() => {
                  window.location.href = '/practice';
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-white font-semibold text-xs transition-colors"
              >
                <span>{skill.actionable_cta || 'PRACTICE'}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: EXPLAINABLE NEXT BEST ACTIONS */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Explainable Next Best Actions</h2>
            <p className="text-xs text-slate-400">
              Clear mathematical reasoning explaining WHAT, WHY, and EVIDENCE for every suggestion.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((rec) => (
            <ExplainableRecommendationCard
              key={rec.id}
              recommendation={rec}
              onActionClick={(item) => {
                if (item.action_type === 'project') {
                  window.location.href = '/projects';
                } else if (item.action_type === 'scenario') {
                  window.location.href = '/scenarios';
                } else {
                  window.location.href = '/practice';
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* SECTION 3: VERIFIED PORTFOLIO EVIDENCE ARTIFACTS */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Cryptographically Verified Portfolio</h2>
            <p className="text-xs text-slate-400">
              Publicly shareable evidence tokens certifying completed real-world engineering projects.
            </p>
          </div>
          <a
            href="/projects"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Launch Project Workspace →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolio.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30 uppercase">
                    {item.domain} PROOF
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5">{item.project_title}</h3>
                </div>
                <div className="text-emerald-400 font-bold font-mono text-xs">
                  Score: {item.score}/100
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{item.summary_of_work}</p>

              <div className="flex flex-wrap gap-1.5">
                {item.skills_demonstrated.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2.5 py-0.5 rounded-md bg-slate-800 text-indigo-300 border border-slate-700 font-medium"
                  >
                    ✓ {s}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono text-[10px]">Proof: {item.verification_hash}</span>
                <span className="text-indigo-400 font-semibold cursor-pointer hover:underline">
                  Export Certificate
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
