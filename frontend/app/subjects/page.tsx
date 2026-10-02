'use client';

import React, { useState } from 'react';
import { SubjectMasterySection } from '@/components/dashboard/SubjectMasterySection';
import { SubjectOverviewModal } from '@/components/dashboard/SubjectOverviewModal';
import { InteractiveLessonModal } from '@/components/dashboard/InteractiveLessonModal';
import { SubjectDetail } from '@/types/curriculum';
import { Layers } from 'lucide-react';

export default function SubjectsPage() {
  const [selectedSubject, setSelectedSubject] = useState<SubjectDetail | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      <div className="p-6 rounded-none border border-stone-800 bg-[#0e1017] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 font-bold uppercase">
            <Layers size={14} />
            <span>SUBJECT MASTERY & SYLLABUS</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white">
            48 Technical Subjects & Granular Telemetry
          </h1>
          <p className="text-xs text-stone-300 font-sans max-w-2xl">
            Detailed breakdown of knowledge masteries, prerequisites, detected misconceptions, and connected capstone projects.
          </p>
        </div>
      </div>

      <SubjectMasterySection
        onSelectSubject={(subj) => setSelectedSubject(subj)}
        onOpenLesson={(lessonId) => setActiveLessonId(lessonId)}
      />

      <SubjectOverviewModal
        subject={selectedSubject}
        isOpen={Boolean(selectedSubject)}
        onClose={() => setSelectedSubject(null)}
        onOpenLesson={(lessonId) => setActiveLessonId(lessonId)}
      />

      <InteractiveLessonModal
        lessonId={activeLessonId}
        isOpen={Boolean(activeLessonId)}
        onClose={() => setActiveLessonId(null)}
      />
    </div>
  );
}
