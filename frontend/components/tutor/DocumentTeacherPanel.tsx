'use client';

import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  BookOpen,
  Layers,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { api } from '@/lib/api';
import { DocumentUploadResponse, MultimodalDoubtResponse } from '@/types';
import { TeachingCard } from './TeachingCard';

export const DocumentTeacherPanel: React.FC = () => {
  const [uploadedDoc, setUploadedDoc] = useState<DocumentUploadResponse | null>(null);
  const [docTitle, setDocTitle] = useState('');
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [pageCount, setPageCount] = useState(12);
  const [isUploading, setIsUploading] = useState(false);
  const [teachPrompt, setTeachPrompt] = useState('');
  const [teachResponse, setTeachResponse] = useState<MultimodalDoubtResponse | null>(null);
  const [isTeaching, setIsTeaching] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setDocTitle(file.name.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();
    reader.onload = () => {
      setFileBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleIndexDocument = async () => {
    if (!docTitle.trim()) return;
    setIsUploading(true);

    try {
      const res = await api.uploadTeachingDocument({
        title: docTitle,
        subject: 'AI/ML',
        file_base64: fileBase64 || 'mock_file_data',
        filename: fileName || 'notes.pdf',
        file_type: 'pdf',
        page_count: pageCount,
      });

      if (res.success && res.data) {
        setUploadedDoc(res.data);
      }
    } catch (e) {
      console.error('Failed to index document', e);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTeachAction = async (prompt: string, pageNum?: number) => {
    if (!uploadedDoc) return;
    setIsTeaching(true);

    try {
      const res = await api.teachFromDocument({
        document_id: uploadedDoc.document_id,
        prompt: prompt,
        teach_mode: 'personalized_lesson',
        page_number: pageNum || 1,
      });

      if (res.success && res.data) {
        setTeachResponse(res.data);
      }
    } catch (e) {
      console.error('Failed to teach from document', e);
    } finally {
      setIsTeaching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Box if not uploaded yet */}
      {!uploadedDoc ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto">
            <Upload size={28} />
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Upload Notes, PDF, or Textbook Chapter</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
              AI-SENIOR-X chunks, indexes, and grounds explanations directly in your syllabus while
              adapting to your Learning Twin knowledge state.
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-3 pt-2">
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".pdf,.docx,.txt,.md"
              className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
            />

            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="Document / Lecture Title (e.g. CS229 Lecture 4 Notes)"
              className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            />

            <button
              onClick={handleIndexDocument}
              disabled={isUploading || !docTitle.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors disabled:opacity-50 shadow-lg shadow-indigo-600/20"
            >
              {isUploading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Chunking & Indexing Notes into Vector Store...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Index Document & Start Learning</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Document Grounded Q&A Interface */
        <div className="space-y-6">
          {/* Active Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{uploadedDoc.title}</h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                  <span>{uploadedDoc.page_count || (uploadedDoc as any).total_pages || 1} pages</span>
                  <span>•</span>
                  <span>{uploadedDoc.total_chunks_indexed || (uploadedDoc as any).total_chunks || 4} vector chunks indexed</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setUploadedDoc(null);
                setTeachResponse(null);
              }}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900"
            >
              Change Document
            </button>
          </div>

          {/* Quick Grounded Question Prompts */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Ask Anything About This Document:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {((uploadedDoc as any).sample_questions || [
                `Teach me ${uploadedDoc.title} from the beginning`,
                'Explain the core governing equations and formulas',
                'What are the most common exam traps or misconceptions in this document?',
                'Give me 5 practice conceptual drills from this material',
              ]).map((q: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => handleTeachAction(q, idx + 1)}
                  className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-left text-xs text-slate-300 hover:text-white hover:border-indigo-500/50 hover:bg-slate-900 transition-all flex items-center justify-between gap-2"
                >
                  <span className="truncate">{q}</span>
                  <ArrowRight size={13} className="text-indigo-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Custom Query Box */}
          <div className="flex gap-2">
            <input
              type="text"
              value={teachPrompt}
              onChange={(e) => setTeachPrompt(e.target.value)}
              placeholder="e.g. Explain page 5, or summarize the mathematical proofs..."
              className="flex-1 p-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => handleTeachAction(teachPrompt)}
              disabled={isTeaching || !teachPrompt.trim()}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors disabled:opacity-50"
            >
              {isTeaching ? 'Thinking...' : 'Teach Me'}
            </button>
          </div>

          {/* Rendered Teaching Card */}
          {teachResponse && (
            <TeachingCard
              response={teachResponse}
              onQuickControlClick={(action) => handleTeachAction(`Explain again focusing on: ${action}`)}
            />
          )}
        </div>
      )}
    </div>
  );
};
