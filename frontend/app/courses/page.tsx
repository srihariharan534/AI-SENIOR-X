'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UniversityCourseLibrary } from '@/components/university/UniversityCourseLibrary';
import { BookOpen, ArrowLeft, Sparkles, Compass } from 'lucide-react';

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-[#fcfbfa] text-stone-900 font-sans selection:bg-blue-600 selection:text-white pb-24">
      {/* Top Header */}
      <div className="border-b border-stone-200 bg-white/90 backdrop-blur sticky top-0 z-30 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-1.5 font-mono text-stone-600 hover:text-stone-950 transition-colors uppercase tracking-wider font-semibold"
            >
              <ArrowLeft size={13} />
              <span>Back to Dashboard</span>
            </Link>
            <span className="text-stone-300">/</span>
            <span className="font-mono font-bold text-blue-700 uppercase tracking-widest">
              Course Library (22 Subjects)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/courses/python"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-blue-800 transition-colors shadow-sm"
            >
              <Sparkles size={13} />
              <span>Open Reference Course (Python)</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 space-y-10">
        {/* Editorial University Banner */}
        <div className="border-b-2 border-stone-900 pb-8 space-y-4">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-blue-700">
            <Compass size={14} />
            <span>AI-SENIOR-X ACADEMIC DIRECTORY</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-black text-stone-950 tracking-tight">
            The AI University Course Catalogue
          </h1>
          <p className="text-stone-600 font-serif italic text-lg sm:text-xl max-w-3xl leading-relaxed">
            &ldquo;Complete university-style subjects, structured from fundamentals to professional engineering application. Select any subject to access the 11-point syllabus explanation, personalized daily plan, and 2–3 hour structured AI teaching studio.&rdquo;
          </p>
        </div>

        {/* 4-School 22-Subject Library Component */}
        <UniversityCourseLibrary />
      </div>
    </div>
  );
}
