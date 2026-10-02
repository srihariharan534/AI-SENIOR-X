'use client';

import React from 'react';
import {
  BookOpen,
  HelpCircle,
  Briefcase,
  Layers,
  Sparkles,
  Target,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { CourseExplanation } from '@/lib/universityData';

interface SubjectExplanationSectionProps {
  subjectName: string;
  explanation: CourseExplanation;
}

export const SubjectExplanationSection: React.FC<SubjectExplanationSectionProps> = ({
  subjectName,
  explanation,
}) => {
  return (
    <section className="bg-[#fcfbfa] border border-stone-300 p-6 md:p-10 space-y-8 text-stone-900 font-sans">
      {/* SECTION HEADER */}
      <div className="space-y-2 border-b border-stone-200 pb-6">
        <div className="flex items-center gap-2 font-mono text-xs text-blue-700 uppercase font-bold tracking-widest">
          <BookOpen size={14} />
          <span>ORIENTATION • UNDERSTAND THE SUBJECT</span>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl text-stone-900 font-normal tracking-tight">
          Professor&apos;s Introduction to {subjectName}
        </h2>
        <p className="text-sm text-stone-600 font-sans max-w-3xl leading-relaxed">
          Before writing code or starting lectures, understand why this discipline was created, the exact enterprise problems it solves, and the engineering capabilities you will acquire.
        </p>
      </div>

      {/* 11 CORE UNIVERSITY EXPLANATION QUESTIONS (EDITORIAL 2-COLUMN GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Q1 & Q2 */}
        <div className="space-y-6">
          <div className="p-6 bg-white border border-stone-200 space-y-2">
            <h3 className="font-mono text-xs text-blue-700 uppercase font-bold tracking-wider">
              01 / WHAT IS THIS SUBJECT?
            </h3>
            <p className="text-sm text-stone-800 font-serif leading-relaxed">
              {explanation.whatIsThisSubject}
            </p>
          </div>

          <div className="p-6 bg-white border border-stone-200 space-y-2">
            <h3 className="font-mono text-xs text-blue-700 uppercase font-bold tracking-wider">
              02 / WHY WAS IT CREATED?
            </h3>
            <p className="text-sm text-stone-800 font-serif leading-relaxed">
              {explanation.whyWasItCreated}
            </p>
          </div>

          <div className="p-6 bg-white border border-stone-200 space-y-2">
            <h3 className="font-mono text-xs text-blue-700 uppercase font-bold tracking-wider">
              03 / WHY IS IT IMPORTANT?
            </h3>
            <p className="text-sm text-stone-800 font-serif leading-relaxed">
              {explanation.whyIsItImportant}
            </p>
          </div>

          <div className="p-6 bg-white border border-stone-200 space-y-2">
            <h3 className="font-mono text-xs text-blue-700 uppercase font-bold tracking-wider">
              04 / WHERE IS IT USED & WHO USES IT?
            </h3>
            <ul className="space-y-1.5 text-xs text-stone-700 font-sans pt-1">
              {explanation.whereIsItUsed.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-700 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Q5 - Q11 */}
        <div className="space-y-6">
          <div className="p-6 bg-white border border-stone-200 space-y-2">
            <h3 className="font-mono text-xs text-blue-700 uppercase font-bold tracking-wider">
              05 / WHAT REAL-WORLD PROBLEMS DOES IT SOLVE?
            </h3>
            <ul className="space-y-1.5 text-xs text-stone-700 font-sans pt-1">
              {explanation.whatRealWorldProblemsDoesItSolve.map((prob, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>{prob}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 bg-white border border-stone-200 space-y-2">
            <h3 className="font-mono text-xs text-blue-700 uppercase font-bold tracking-wider">
              06 / CAREERS & ROLES
            </h3>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {explanation.whatCareersUseIt.map((career, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-stone-100 text-stone-800 border border-stone-300 font-mono text-xs font-semibold"
                >
                  {career}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white border border-stone-200 space-y-2">
            <h3 className="font-mono text-xs text-blue-700 uppercase font-bold tracking-wider">
              07 / WHAT YOU WILL BUILD & MASTER
            </h3>
            <ul className="space-y-1.5 text-xs text-stone-700 font-sans pt-1">
              {explanation.whatWillLearnerBuild.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-700 font-bold">⚡</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 bg-[#f4f2ec] border border-stone-300 space-y-2">
            <h3 className="font-mono text-xs text-stone-900 uppercase font-bold tracking-wider">
              08 / PREREQUISITES & PROGRESSION
            </h3>
            <div className="space-y-2 text-xs text-stone-700 font-sans">
              <div>
                <strong>Required:</strong> {explanation.whatPrerequisitesAreRequired.join(' ')}
              </div>
              <div>
                <strong>Progression:</strong> {explanation.howDoesCourseProgress.join(' ')}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
