'use client';

import React, { useState } from 'react';
import { AssessmentCenterSection } from '@/components/dashboard/AssessmentCenterSection';
import { InteractiveLessonModal } from '@/components/dashboard/InteractiveLessonModal';
import { AssessmentCenterItem } from '@/types/curriculum';
import { Target, CheckCircle2 } from 'lucide-react';

export default function AssessmentsPage() {
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleStart = (item: AssessmentCenterItem) => {
    if (item.type === 'Lesson Quiz') {
      setActiveLessonId('lesson-dl-act-01');
    } else {
      setToastMessage(`Initiating ${item.title} evaluation session...`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      <div className="p-6 rounded-none border border-stone-800 bg-[#0e1017] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs text-purple-400 font-bold uppercase">
            <Target size={14} />
            <span>ASSESSMENT & VALIDATION SUITE</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white">
            Diagnostic & Rigorous Skill Tests
          </h1>
          <p className="text-xs text-stone-300 font-sans max-w-2xl">
            10 multi-criteria testing tracks measuring theoretical knowledge, algorithmic implementations, and architectural trade-offs.
          </p>
        </div>
      </div>

      <AssessmentCenterSection onStartAssessment={handleStart} />

      <InteractiveLessonModal
        lessonId={activeLessonId}
        isOpen={Boolean(activeLessonId)}
        onClose={() => setActiveLessonId(null)}
      />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-[#0e1422] border border-purple-500/50 text-white font-mono text-xs shadow-2xl flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 size={16} className="text-purple-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
