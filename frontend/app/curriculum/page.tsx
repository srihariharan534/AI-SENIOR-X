'use client';

import React, { useState } from 'react';
import { InteractiveKnowledgeGraphSection } from '@/components/dashboard/InteractiveKnowledgeGraphSection';
import { MyLearningProgramSection } from '@/components/dashboard/MyLearningProgramSection';
import { InteractiveLessonModal } from '@/components/dashboard/InteractiveLessonModal';
import { Network } from 'lucide-react';

export default function CurriculumPage() {
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      <div className="p-6 rounded-none border border-stone-800 bg-[#0e1017] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs text-indigo-400 font-bold uppercase">
            <Network size={14} />
            <span>KNOWLEDGE GRAPH & DEPENDENCIES</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white">
            Adaptive Curriculum & Knowledge DAG
          </h1>
          <p className="text-xs text-stone-300 font-sans max-w-2xl">
            Live directed acyclic graph mapping prerequisite readiness, completed milestones, and upcoming high-leverage learning nodes.
          </p>
        </div>
      </div>

      <MyLearningProgramSection />
      <InteractiveKnowledgeGraphSection onOpenLesson={(id) => setActiveLessonId(id)} />

      <InteractiveLessonModal
        lessonId={activeLessonId}
        isOpen={Boolean(activeLessonId)}
        onClose={() => setActiveLessonId(null)}
      />
    </div>
  );
}
