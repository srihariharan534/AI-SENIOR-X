'use client';

import React from 'react';
import { Activity, CheckCircle2, Video, FileCode, Award, ShieldAlert, Clock } from 'lucide-react';

interface LearningFlightRecorderProps {
  events?: Array<{
    id: string;
    timestamp_formatted: string;
    relative_time: string;
    date_group: string;
    title: string;
    event_type: string;
    subject_name: string;
    badge_label: string;
  }>;
}

export const LearningFlightRecorder: React.FC<LearningFlightRecorderProps> = ({
  events,
}) => {
  const evts = events || [
    {
      id: 'evt-01',
      timestamp_formatted: '10:42 AM',
      relative_time: '45 mins ago',
      date_group: 'TODAY',
      title: 'Passed SQL Window Functions Assessment (Score: 94%)',
      event_type: 'ASSESSMENT',
      subject_name: 'SQL Analytics',
      badge_label: 'SCORE 94%',
    },
    {
      id: 'evt-02',
      timestamp_formatted: '09:55 AM',
      relative_time: '1h 30m ago',
      date_group: 'TODAY',
      title: 'Finished 32-min AI Video Lecture on Decorator Closures',
      event_type: 'AI_TEACHING',
      subject_name: 'Python Engineering',
      badge_label: '32 MINS',
    },
    {
      id: 'evt-03',
      timestamp_formatted: '09:20 AM',
      relative_time: '2h ago',
      date_group: 'TODAY',
      title: 'Completed 5 Practice Questions on Higher-Order Functions',
      event_type: 'PRACTICE',
      subject_name: 'Python Engineering',
      badge_label: '5/5 CORRECT',
    },
    {
      id: 'evt-04',
      timestamp_formatted: '06:40 PM',
      relative_time: 'Yesterday',
      date_group: 'YESTERDAY',
      title: 'Completed Lesson: Memory Management & Garbage Collection',
      event_type: 'AI_TEACHING',
      subject_name: 'Python Engineering',
      badge_label: 'LESSON COMPLETED',
    },
    {
      id: 'evt-05',
      timestamp_formatted: '05:55 PM',
      relative_time: 'Yesterday',
      date_group: 'YESTERDAY',
      title: 'Interactive AI Tutor Socratic Dialogue on GIL & Threading',
      event_type: 'AI_TEACHING',
      subject_name: 'Python Engineering',
      badge_label: 'SOCRATIC SESSION',
    },
  ];

  const getEventBadge = (type: string, label: string) => {
    switch (type) {
      case 'ASSESSMENT':
        return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 font-mono text-[10px] font-bold border border-emerald-300 dark:border-emerald-800">{label}</span>;
      case 'AI_TEACHING':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 font-mono text-[10px] font-bold border border-blue-200 dark:border-blue-800">{label}</span>;
      case 'PRACTICE':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-mono text-[10px] font-bold border border-amber-200 dark:border-amber-800">{label}</span>;
      case 'PROJECT':
        return <span className="px-2 py-0.5 bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 font-mono text-[10px] font-bold border border-purple-200 dark:border-purple-800">{label}</span>;
      default:
        return <span className="px-2 py-0.5 bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200 font-mono text-[10px] font-bold">{label}</span>;
    }
  };

  return (
    <div className="w-full bg-[#fdfcf9] dark:bg-stone-900 border border-stone-300 dark:border-stone-800">
      <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-[#f9f8f4] dark:bg-stone-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-blue-700 dark:text-blue-400" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-900 dark:text-stone-100">
            SECTION 12 // LEARNING FLIGHT RECORDER (IMMUTABLE ACTIVITY LOG)
          </h2>
        </div>
        <span className="text-[10px] font-mono text-stone-500 uppercase">LIVE CHRONOLOGY</span>
      </div>

      <div className="p-6 md:p-8">
        <div className="relative border-l-2 border-stone-200 dark:border-stone-700 ml-4 space-y-6">
          {evts.map((evt) => (
            <div key={evt.id} className="relative pl-6">
              {/* Timeline marker */}
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-stone-900 dark:bg-white border-2 border-[#fdfcf9] dark:border-stone-900"></div>

              <div className="p-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-stone-400 uppercase">
                    <span className="font-bold text-stone-700 dark:text-stone-300">{evt.timestamp_formatted}</span>
                    <span>•</span>
                    <span>{evt.relative_time}</span>
                    <span>•</span>
                    <span className="text-blue-700 dark:text-blue-400">{evt.subject_name}</span>
                  </div>
                  <div className="font-serif font-bold text-sm text-stone-900 dark:text-white mt-1">
                    {evt.title}
                  </div>
                </div>

                <div className="shrink-0">
                  {getEventBadge(evt.event_type, evt.badge_label)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
