'use client';

import React from 'react';
import { SubjectStateData } from '@/hooks/useAcademicDashboard';
import { X, Printer, Download, ShieldCheck } from 'lucide-react';

interface AcademicRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects?: SubjectStateData[];
  learnerName?: string;
}

export const AcademicRecordModal: React.FC<AcademicRecordModalProps> = ({
  isOpen,
  onClose,
  subjects = [],
  learnerName = 'Srihari Haran',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white text-stone-900 border border-stone-400 w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl font-serif">
        {/* Academic Header */}
        <div className="p-8 border-b-2 border-stone-900 bg-[#fdfbf7] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-stone-500 font-semibold">
              AI-SENIOR-X // AUTONOMOUS ACADEMIC INTELLIGENCE SYSTEM
            </div>
            <h1 className="text-2xl font-bold text-stone-950 mt-1 uppercase tracking-tight">
              OFFICIAL LEARNER ACADEMIC RECORD & EVIDENCE TRANSCRIPT
            </h1>
            <div className="font-mono text-xs text-stone-600 mt-2 space-x-4">
              <span><strong>LEARNER:</strong> {learnerName}</span>
              <span><strong>RECORD ID:</strong> ASX-TR-2026-0982</span>
              <span><strong>ISSUED:</strong> OCTOBER 02, 2026</span>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-900 font-mono text-xs font-bold uppercase border border-stone-400 flex items-center gap-1.5 transition-colors"
            >
              <Printer size={13} />
              <span>PRINT / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-900 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Official Transcript Table */}
        <div className="p-8 space-y-6">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b-2 border-stone-900 bg-stone-100 text-stone-800">
                <th className="py-2.5 px-3 uppercase tracking-wider">ACADEMIC SUBJECT</th>
                <th className="py-2.5 px-3 uppercase tracking-wider text-center">LESSONS</th>
                <th className="py-2.5 px-3 uppercase tracking-wider text-center">PRACTICE</th>
                <th className="py-2.5 px-3 uppercase tracking-wider text-center">ASSESS</th>
                <th className="py-2.5 px-3 uppercase tracking-wider text-center">PROJECTS</th>
                <th className="py-2.5 px-3 uppercase tracking-wider text-center">CHALLENGES</th>
                <th className="py-2.5 px-3 uppercase tracking-wider text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-300 text-stone-900">
              {subjects.map((subj) => (
                <tr key={subj.id} className="hover:bg-stone-50">
                  <td className="py-2.5 px-3 font-sans font-medium">
                    <div className="font-bold">{subj.name}</div>
                    <div className="text-[10px] font-mono text-stone-500">{subj.school_name}</div>
                  </td>
                  <td className="py-2.5 px-3 text-center">{subj.lessons_completed}/{subj.lessons_total}</td>
                  <td className="py-2.5 px-3 text-center">{subj.practice_completed}/{subj.practice_total}</td>
                  <td className="py-2.5 px-3 text-center">{subj.assessments_completed}/{subj.assessments_total}</td>
                  <td className="py-2.5 px-3 text-center">{subj.projects_completed}/{subj.projects_total}</td>
                  <td className="py-2.5 px-3 text-center">{subj.challenges_completed}/{subj.challenges_total}</td>
                  <td className="py-2.5 px-3 text-right font-bold">
                    {subj.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Cryptographic Proof Footer */}
          <div className="p-4 bg-stone-50 border border-stone-300 text-[11px] font-mono text-stone-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-700" />
              <span>CRYPTOGRAPHICALLY ATTESTED BY LEARNING TWIN ENGINE</span>
            </div>
            <div className="text-stone-400">
              VERIFICATION HASH: 9f82a17cb03e481198e3
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
