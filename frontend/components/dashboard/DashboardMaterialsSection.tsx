'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  BookOpen,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  Bookmark,
  ArrowUpRight,
} from 'lucide-react';

export const DashboardMaterialsSection: React.FC = () => {
  const recentlyUsed = [
    {
      id: 'mat-py-funcs',
      title: 'Python Functions & Metaprogramming Notes',
      subject: 'Python Engineering',
      subjectSlug: 'python',
      type: 'NOTES',
      progress: 'Completed 100%',
      time: '25 min read',
    },
    {
      id: 'mat-sql-win',
      title: 'SQL Window Functions & Frame Specifications',
      subject: 'Relational Databases',
      subjectSlug: 'databases',
      type: 'NOTES',
      progress: 'In Progress 75%',
      time: '32 min read',
    },
    {
      id: 'mat-ml-eval',
      title: 'Machine Learning Loss Curves & ROC-AUC Evaluation',
      subject: 'AI / Machine Learning',
      subjectSlug: 'ai-machine-learning',
      type: 'CODE & NOTES',
      progress: 'In Progress 40%',
      time: '45 min read',
    },
    {
      id: 'mat-genai-rag',
      title: 'Generative AI & Agentic RAG Vector Retrieval Blueprint',
      subject: 'Generative AI',
      subjectSlug: 'generative-ai',
      type: 'SLIDES & DOCS',
      progress: 'Not Started',
      time: '50 min read',
    },
  ];

  const recommendedForYou = [
    {
      id: 'mat-py-async',
      title: 'Asyncio Task Groups & Coroutine Cancellation Guide',
      subject: 'Python Engineering',
      subjectSlug: 'python',
      reason: 'Recommended because you had a reassessment on async exception propagation.',
      type: 'REMEDIAL NOTES',
      time: '18 min',
    },
    {
      id: 'mat-sql-prac',
      title: 'SQL Partitioning & DENSE_RANK() Practice Exercises',
      subject: 'Relational Databases',
      subjectSlug: 'databases',
      reason: 'Recommended to reinforce partition boundaries before your next challenge.',
      type: 'PRACTICE SET',
      time: '25 min',
    },
    {
      id: 'mat-rag-eval',
      title: 'RAG Triad Metrics: Context Relevance & Faithfulness',
      subject: 'Generative AI',
      subjectSlug: 'generative-ai',
      reason: 'Unlocked prerequisite after completing Vector Embeddings Module.',
      type: 'STUDY GUIDE',
      time: '30 min',
    },
  ];

  return (
    <div className="w-full bg-[#fdfcf9] dark:bg-stone-900 border border-stone-300 dark:border-stone-800">
      {/* Header */}
      <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-[#f9f8f4] dark:bg-stone-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-blue-700 dark:text-blue-400" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-900 dark:text-stone-100">
            SECTION 14 // YOUR LEARNING MATERIALS & STUDY RESOURCES
          </h2>
        </div>
        <Link
          href="/courses/python"
          className="text-xs font-mono text-blue-700 hover:text-blue-900 dark:text-blue-400 font-semibold flex items-center gap-1"
        >
          <span>VIEW PYTHON MATERIALS</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recently Used Materials (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-stone-500 uppercase font-semibold">RECENTLY ACCESSED MATERIALS</span>
            <span className="text-stone-400">4 IN FLIGHT</span>
          </div>

          <div className="divide-y divide-stone-200 dark:divide-stone-800 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/60">
            {recentlyUsed.map((item) => (
              <div
                key={item.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-stone-400 uppercase">
                    <span className="text-blue-700 dark:text-blue-400 font-bold">{item.type}</span>
                    <span>•</span>
                    <span>{item.subject}</span>
                    <span>•</span>
                    <span>{item.time}</span>
                  </div>
                  <h4 className="text-sm font-serif font-bold text-stone-900 dark:text-white mt-1">
                    {item.title}
                  </h4>
                  <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 mt-0.5">
                    {item.progress}
                  </div>
                </div>

                <Link
                  href={`/courses/${item.subjectSlug}`}
                  className="shrink-0 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-950 font-mono text-[11px] font-bold uppercase inline-flex items-center gap-1 self-start sm:self-auto transition-colors"
                >
                  <span>STUDY</span>
                  <ArrowUpRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Personalized Material Recommendations (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-amber-800 dark:text-amber-400 uppercase font-bold flex items-center gap-1.5">
              <Sparkles size={13} />
              <span>RECOMMENDED BY LEARNING TWIN</span>
            </span>
          </div>

          <div className="space-y-3">
            {recommendedForYou.map((rec) => (
              <div
                key={rec.id}
                className="p-4 bg-amber-50/40 dark:bg-stone-800/80 border border-amber-200 dark:border-amber-900/60 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-stone-500 uppercase">
                    <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800">
                      {rec.type}
                    </span>
                    <span>•</span>
                    <span>{rec.subject}</span>
                  </div>
                  <h4 className="text-sm font-serif font-bold text-stone-900 dark:text-white mt-1">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-300 font-sans mt-1 leading-relaxed">
                    <strong>Why?</strong> {rec.reason}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-amber-200/60 dark:border-stone-700 font-mono text-xs">
                  <span className="text-stone-500">{rec.time}</span>
                  <Link
                    href={`/courses/${rec.subjectSlug}`}
                    className="text-blue-700 hover:text-blue-900 dark:text-blue-400 font-bold inline-flex items-center gap-1"
                  >
                    <span>STUDY NOW</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
