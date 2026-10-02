'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Brain,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Target,
  Zap,
  Mic,
  Code2,
  Award,
  Layers,
  Network,
  CheckCircle2,
  BookOpen,
  ArrowUpRight,
  Flame,
  Activity,
  Globe,
  Sliders,
  Play,
  RotateCcw,
  Compass,
  Cpu,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
import { useAuth } from '@/context/AuthContext';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  const curriculumCards = [
    {
      title: 'AI & Machine Learning',
      topics: 14,
      progress: 72,
      icon: <Brain className="text-indigo-400" size={24} />,
      description: 'Supervised classification, cost functions, gradient descent & backprop.',
      badge: 'Core Track',
      href: '/learn/ml_supervised',
    },
    {
      title: 'Python Foundations',
      topics: 18,
      progress: 94,
      icon: <Code2 className="text-cyan-400" size={24} />,
      description: 'Functions, closures, list comprehensions, OOP & asymptotic efficiency.',
      badge: 'Mastered',
      href: '/learn/python_basics',
    },
    {
      title: 'Data Science & Pandas',
      topics: 12,
      progress: 68,
      icon: <Activity className="text-emerald-400" size={24} />,
      description: 'Data wrangling, matrix manipulation, feature engineering & analytics.',
      badge: 'In Progress',
      href: '/learn',
    },
    {
      title: 'Relational SQL & DBs',
      topics: 10,
      progress: 58,
      icon: <Layers className="text-amber-400" size={24} />,
      description: 'Multi-table joins, subqueries, window partitions & index tuning.',
      badge: 'Remediation Ready',
      href: '/learn/sql_joins',
    },
    {
      title: 'Data Structures & DSA',
      topics: 16,
      progress: 76,
      icon: <Cpu className="text-purple-400" size={24} />,
      description: 'Binary trees, graph traversals, dynamic programming & recursion.',
      badge: 'Core Track',
      href: '/learn',
    },
    {
      title: 'Deep Learning & LLMs',
      topics: 12,
      progress: 40,
      icon: <Sparkles className="text-rose-400" size={24} />,
      description: 'Transformers, self-attention, tokenization, embeddings & RAG pipelines.',
      badge: 'Advanced',
      href: '/learn',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 overflow-x-hidden">
      {/* 1. TOP NAVBAR */}
      <header className="fixed top-0 inset-x-0 z-50 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-200">
              <Brain size={20} className="text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">
                AI-SENIOR<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">-X</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PROD
              </span>
            </div>
          </a>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <a href="/dashboard" className="hover:text-indigo-400 transition-colors">Platform</a>
          <a href="/learn" className="hover:text-indigo-400 transition-colors">Curriculum</a>
          <a href="/learning-twin" className="hover:text-indigo-400 transition-colors">Learning Twin</a>
          <a href="/tutor" className="hover:text-indigo-400 transition-colors">AI Tutor</a>
          <a href="/practice" className="hover:text-indigo-400 transition-colors">Practice</a>
          <a href="/missions" className="hover:text-indigo-400 transition-colors">Missions</a>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/login"
            className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-8 lg:px-12 max-w-6xl mx-auto text-center space-y-8">
        {/* Glow effect in background */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-sm">
          <Sparkles size={14} className="text-indigo-400 animate-pulse" />
          <span>AI-Powered Autonomous Personalized Learning</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Your learning journey.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
              Understood. Adapted. Evolving.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            AI-SENIOR-X models your cognitive state in real-time, diagnoses root misconceptions, and dynamically adapts lessons, code challenges, and capstone quests.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href="/onboarding"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-xl shadow-indigo-600/40 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Initialize My Learning Twin</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="/learn"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all"
          >
            Explore Curriculum Graph
          </a>
        </div>

        {/* VISUAL COGNITIVE TWIN PIPELINE FLOW */}
        <div className="pt-10 max-w-4xl mx-auto">
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-indigo-500/20 shadow-2xl space-y-4">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center justify-center gap-2">
              <Network size={14} />
              <span>Closed-Loop Cognitive Feedback Architecture</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center">
                  <Network size={14} />
                </div>
                <div className="text-xs font-bold text-white">Knowledge DAG</div>
                <div className="text-[10px] text-slate-400">Prerequisite Map</div>
              </div>

              <div className="hidden sm:flex justify-center text-slate-600 font-bold">→</div>

              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-950/80 to-purple-950/80 border border-indigo-500/40 text-center space-y-1 shadow-md shadow-indigo-500/20">
                <div className="w-7 h-7 rounded-lg bg-indigo-500 text-white mx-auto flex items-center justify-center shadow-md shadow-indigo-500/40">
                  <Brain size={14} />
                </div>
                <div className="text-xs font-extrabold text-white">Learning Twin</div>
                <div className="text-[10px] text-indigo-200">Bayesian BKT Model</div>
              </div>

              <div className="hidden sm:flex justify-center text-slate-600 font-bold">→</div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center">
                  <Sparkles size={14} />
                </div>
                <div className="text-xs font-bold text-white">AI Tutor & IDE</div>
                <div className="text-[10px] text-slate-400">Adaptive Practice</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURE CARDS */}
      <section className="py-16 px-4 sm:px-8 lg:px-12 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            <Zap size={14} />
            <span>Autonomous Intelligence Capabilities</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Built for Mastery, Not Passive Watching
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Specialized micro-agents coordinate to ensure you master foundational concepts before advancing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: AI Tutor */}
          <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800 hover:border-indigo-500/40 transition-all space-y-3 group hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Brain size={20} />
            </div>
            <h3 className="text-base font-bold text-white">Socratic AI Tutor</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Personalized Socratic explanations based on demonstrated learner mastery. Switches smoothly between analogy, deep dive, and code examples.
            </p>
            <div className="pt-2">
              <Badge variant="indigo" size="sm">6 Teaching Modes</Badge>
            </div>
          </div>

          {/* Card 2: Adaptive Assessment */}
          <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3 group hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target size={20} />
            </div>
            <h3 className="text-base font-bold text-white">Adaptive Assessment</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Diagnostic checkpoints that dynamically scale difficulty to probe conceptual boundaries without frustrating the learner.
            </p>
            <div className="pt-2">
              <Badge variant="emerald" size="sm">Dynamic Difficulty</Badge>
            </div>
          </div>

          {/* Card 3: Learning Twin */}
          <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800 hover:border-purple-500/40 transition-all space-y-3 group hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Network size={20} />
            </div>
            <h3 className="text-base font-bold text-white">Cognitive Learning Twin</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              A live, event-sourced Bayesian model tracking concept mastery probabilities ($P(L_t)$), slip rates, and memory decay curves.
            </p>
            <div className="pt-2">
              <Badge variant="purple" size="sm">Bayesian BKT Model</Badge>
            </div>
          </div>

          {/* Card 4: Targeted Practice */}
          <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 group hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Code2 size={20} />
            </div>
            <h3 className="text-base font-bold text-white">Targeted Practice & IDE</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              In-browser Python code execution with unit testing and instant diagnosis when misconceptions are triggered.
            </p>
            <div className="pt-2">
              <Badge variant="cyan" size="sm">Automated Code Grading</Badge>
            </div>
          </div>

          {/* Card 5: AI Recommendations */}
          <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800 hover:border-amber-500/40 transition-all space-y-3 group hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Compass size={20} />
            </div>
            <h3 className="text-base font-bold text-white">Explainable Next Actions</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Recommendation Agent prioritizes next-best learning actions based on prerequisite gaps and goal deadlines.
            </p>
            <div className="pt-2">
              <Badge variant="amber" size="sm">DAG Pathfinder</Badge>
            </div>
          </div>

          {/* Card 6: Multilingual + Voice */}
          <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800 hover:border-rose-500/40 transition-all space-y-3 group hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mic size={20} />
            </div>
            <h3 className="text-base font-bold text-white">Multilingual & Voice</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Real-time conversational speech turns in 10 languages with instant sub-200ms interruption and technical term preservation.
            </p>
            <div className="pt-2">
              <Badge variant="rose" size="sm">10 Languages + Voice</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CURRICULUM SECTION (GRID OF CARDS) */}
      <section className="py-16 px-4 sm:px-8 lg:px-12 max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Structured Knowledge Graph</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Comprehensive Technical Curriculum</h2>
            <p className="text-xs sm:text-sm text-slate-400">Structured DAG learning paths with automatic prerequisite resolution</p>
          </div>

          <a
            href="/learn"
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>Explore All Nodes</span>
            <ArrowRight size={14} />
          </a>
        </div>

        {/* Responsive Grid: 3 cols desktop, 2 cols tablet, 1 col mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {curriculumCards.map((card) => (
            <a
              key={card.title}
              href={card.href}
              className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900/90 transition-all flex flex-col justify-between space-y-4 group hover:-translate-y-1 shadow-lg shadow-black/20"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-indigo-500/30 transition-colors">
                    {card.icon}
                  </div>
                  <Badge variant={card.progress >= 80 ? 'emerald' : card.progress >= 60 ? 'indigo' : 'amber'} size="sm">
                    {card.badge}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {card.title}
                  </h3>
                  <div className="text-xs font-mono text-slate-400 mt-0.5">
                    {card.topics} Topics Tracked
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                      style={{ width: `${card.progress}%` }}
                    />
                  </div>
                  <span className="font-mono text-slate-400 font-semibold">{card.progress}%</span>
                </div>

                <span className="text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Explore</span>
                  <ChevronRight size={14} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 5. FEATURE HIGHLIGHT: "YOUR AI LEARNING TWIN" */}
      <section className="py-16 px-4 sm:px-8 lg:px-12 max-w-6xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/30 shadow-2xl space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              <Brain size={14} />
              <span>Signature Differentiator</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Your AI Learning Twin
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Unlike static platforms that lose context between sessions, your Learning Twin evolves continuously as a living knowledge graph.
            </p>
          </div>

          {/* Connected Nodes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {[
              { label: 'Knowledge State', val: 'Bayesian Mastery P(Lt)', icon: <Network size={16} className="text-indigo-400" /> },
              { label: 'Skill Graph', val: 'Prerequisite Blockers', icon: <Cpu size={16} className="text-cyan-400" /> },
              { label: 'Learning History', val: 'Event-Sourced Stream', icon: <Activity size={16} className="text-emerald-400" /> },
              { label: 'Misconceptions', val: 'Diagnostic Flags', icon: <Target size={16} className="text-amber-400" /> },
              { label: 'Preferences', val: '10 Languages & Pace', icon: <Globe size={16} className="text-rose-400" /> },
              { label: 'Spaced Repetition', val: 'SM-2 Memory Decay', icon: <RotateCcw size={16} className="text-purple-400" /> },
              { label: 'Mastery Gates', val: "Bloom's Taxonomy", icon: <Award size={16} className="text-indigo-400" /> },
              { label: 'Recommendations', val: 'Next-Best Action', icon: <Compass size={16} className="text-cyan-400" /> },
            ].map((node) => (
              <div
                key={node.label}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  {node.icon}
                  <span className="text-xs font-bold text-white">{node.label}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">{node.val}</div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <a
              href="/learning-twin"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>Inspect Live Learning Twin Cockpit</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
          Ready to experience the future of personalized education?
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto">
          Start your personalized diagnostic assessment in 2 minutes and initialize your AI Learning Twin today.
        </p>
        <div className="pt-2">
          <a
            href="/onboarding"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-xl shadow-indigo-600/40 transition-all group"
          >
            <span>Initialize My Learning Twin</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950 pt-12 pb-8 px-4 sm:px-8 lg:px-12 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white">
                <Brain size={16} />
              </div>
              <span className="font-extrabold text-white text-sm">AI-SENIOR-X</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Autonomous Learning Intelligence Platform powered by Bayesian Cognitive Modeling & Multi-Agent Pedagogy.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Product</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><a href="/learning-twin" className="hover:text-white transition-colors">Learning Twin</a></li>
              <li><a href="/tutor" className="hover:text-white transition-colors">AI Tutor</a></li>
              <li><a href="/practice" className="hover:text-white transition-colors">Practice IDE</a></li>
              <li><a href="/missions" className="hover:text-white transition-colors">Missions & Quests</a></li>
              <li><a href="/learn" className="hover:text-white transition-colors">Curriculum DAG</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Resources</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><a href="/dashboard" className="hover:text-white transition-colors">Command Center</a></li>
              <li><a href="/exam-mode" className="hover:text-white transition-colors">Exam Mode</a></li>
              <li><a href="/settings" className="hover:text-white transition-colors">Settings</a></li>
              <li><a href="http://localhost:8000/docs" target="_blank" className="hover:text-white transition-colors">API Specification</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Technology</h4>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono">Next.js 14</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono">FastAPI</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono">PostgreSQL</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono">Multi-Agent</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono">BKT Model</span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-600">
          <div>&copy; 2026 AI-SENIOR-X Intelligence Architecture. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 font-medium">Gateway & Multi-Agent Cluster Online</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
