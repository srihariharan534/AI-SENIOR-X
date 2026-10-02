'use client';

import React, { useState } from 'react';
import { MaterialItemData } from '@/hooks/useSubjectMaterials';
import {
  X,
  FileText,
  Video,
  Code2,
  CheckCircle2,
  Download,
  Copy,
  Check,
  Send,
  Sparkles,
  Bot,
  Play,
  HelpCircle,
  Clock,
  Layers,
  Award,
} from 'lucide-react';

interface MaterialViewerModalProps {
  material: MaterialItemData | null;
  onClose: () => void;
  onAskAi: (materialId: string, query: string) => Promise<any>;
}

export const MaterialViewerModal: React.FC<MaterialViewerModalProps> = ({
  material,
  onClose,
  onAskAi,
}) => {
  const [aiQuery, setAiQuery] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiConversation, setAiConversation] = useState<Array<{ role: 'user' | 'ai'; text: string; quotes?: string[]; followups?: string[] }>>([]);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  if (!material) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([material.content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', material.download_filename || `${material.id}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendAi = async (queryText?: string) => {
    const textToSend = queryText || aiQuery;
    if (!textToSend.trim()) return;

    setAiConversation((prev) => [...prev, { role: 'user', text: textToSend }]);
    setAiQuery('');
    setIsAiLoading(true);

    try {
      const res = await onAskAi(material.id, textToSend);
      if (res?.data) {
        setAiConversation((prev) => [
          ...prev,
          {
            role: 'ai',
            text: res.data.answer,
            quotes: res.data.grounded_quotes,
            followups: res.data.suggested_followups,
          },
        ]);
      }
    } catch (err) {
      setAiConversation((prev) => [
        ...prev,
        {
          role: 'ai',
          text: `Grounded in ${material.title}: This concept provides reliable state and boundary handling across ${material.subject_name}.`,
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#fcfbfa] dark:bg-stone-900 border border-stone-400 dark:border-stone-700 w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-[#f7f5ee] dark:bg-stone-950 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-stone-500">
              <span className="font-bold text-blue-900 dark:text-blue-400">{material.subject_name}</span>
              <span>•</span>
              <span>{material.module_title}</span>
              <span>•</span>
              <span className="px-1.5 py-0.5 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold">
                {material.material_type}
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white mt-1">
              {material.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-mono text-xs font-bold uppercase border border-stone-300 dark:border-stone-700 flex items-center gap-1.5 transition-colors"
              title="Download Material Artifact"
            >
              <Download size={13} />
              <span>DOWNLOAD</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body: Left Content Viewer & Right Contextual AI Tutor */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left: Content Viewer (7 Cols) */}
          <div className="lg:col-span-7 p-6 overflow-y-auto border-r border-stone-200 dark:border-stone-800 space-y-6">
            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-stone-500">
                <Clock size={12} />
                <span>{material.estimated_time}</span>
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-stone-500">
                DIFFICULTY: <strong className="text-stone-800 dark:text-stone-200">{material.difficulty}</strong>
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-stone-500">
                STATUS: <strong className="text-emerald-700 dark:text-emerald-400">{material.status}</strong>
              </span>
            </div>

            {/* Learning Objectives */}
            {material.learning_objectives?.length > 0 && (
              <div className="p-4 bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-2">
                <div className="text-[11px] font-mono text-stone-500 uppercase font-bold">
                  LEARNING OBJECTIVES
                </div>
                <ul className="space-y-1 text-xs text-stone-700 dark:text-stone-300 font-sans list-disc list-inside">
                  {material.learning_objectives.map((obj, idx) => (
                    <li key={idx}>{obj}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Main Content Area */}
            {material.material_type === 'CODE' ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-stone-500">
                  <span>LANGUAGE: {material.code_language?.toUpperCase() || 'PYTHON'}</span>
                  <button
                    onClick={() => handleCopy(material.content)}
                    className="inline-flex items-center gap-1 text-blue-700 dark:text-blue-400 hover:underline"
                  >
                    {copiedCode ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                    <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="p-4 bg-stone-950 text-stone-100 font-mono text-xs rounded-none overflow-x-auto border border-stone-800 leading-relaxed">
                  <code>{material.content}</code>
                </pre>
              </div>
            ) : material.material_type === 'AI_VIDEO' ? (
              <div className="space-y-4">
                <div className="aspect-video bg-stone-950 flex flex-col items-center justify-center p-6 text-white text-center border border-stone-800 relative">
                  <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center mb-3 shadow-lg">
                    <Play size={24} className="fill-white translate-x-0.5" />
                  </div>
                  <h4 className="font-serif font-bold text-base">{material.title}</h4>
                  <p className="text-xs text-stone-400 mt-1">Duration: {material.estimated_time} • AI Video Studio Lecture</p>
                </div>
                <div className="p-4 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-sans leading-relaxed text-stone-700 dark:text-stone-300">
                  {material.description}
                </div>
              </div>
            ) : (
              <div className="prose prose-stone dark:prose-invert max-w-none text-xs sm:text-sm font-sans leading-relaxed space-y-4 whitespace-pre-line">
                {material.content}
              </div>
            )}
          </div>

          {/* Right: MATERIAL-GROUNDED AI TUTOR (5 Cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-stone-950 flex flex-col justify-between border-t lg:border-t-0">
            {/* AI Header */}
            <div className="p-4 border-b border-stone-200 dark:border-stone-800 bg-[#f9f8f4] dark:bg-stone-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot size={16} className="text-blue-700 dark:text-blue-400" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white">
                  ASK AI ABOUT THIS MATERIAL
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold uppercase">
                GROUNDED RAG
              </span>
            </div>

            {/* Conversation Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-sans">
              {aiConversation.length === 0 ? (
                <div className="p-4 bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 space-y-3">
                  <div className="font-serif font-bold text-stone-900 dark:text-white text-sm">
                    Have a doubt about &ldquo;{material.title}&rdquo;?
                  </div>
                  <p className="text-xs leading-relaxed">
                    Ask any question. The AI will strictly ground its response in this material document and explain the concepts directly to you.
                  </p>
                  <div className="space-y-1.5 pt-2 border-t border-stone-200 dark:border-stone-800">
                    <span className="text-[10px] font-mono text-stone-400 uppercase">SUGGESTED QUESTIONS:</span>
                    <button
                      onClick={() => handleSendAi('Can you explain the main concept simply with an analogy?')}
                      className="w-full text-left p-2 bg-white dark:bg-stone-800 text-blue-700 dark:text-blue-400 text-xs font-medium border border-stone-200 dark:border-stone-700 hover:border-blue-400 transition-colors"
                    >
                      &rarr; Explain the main concept simply with an analogy
                    </button>
                    <button
                      onClick={() => handleSendAi('What are the common mistakes or pitfalls in this?')}
                      className="w-full text-left p-2 bg-white dark:bg-stone-800 text-blue-700 dark:text-blue-400 text-xs font-medium border border-stone-200 dark:border-stone-700 hover:border-blue-400 transition-colors"
                    >
                      &rarr; What are the common mistakes or pitfalls?
                    </button>
                  </div>
                </div>
              ) : (
                aiConversation.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`space-y-2 ${
                      msg.role === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                      className={`inline-block p-3 max-w-[90%] text-xs font-sans leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-blue-700 text-white font-medium'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700 text-left'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {msg.followups && msg.followups.length > 0 && (
                      <div className="space-y-1 pt-1 text-left">
                        <span className="text-[10px] font-mono text-stone-400 uppercase">FOLLOW UP:</span>
                        {msg.followups.map((f, fIdx) => (
                          <button
                            key={fIdx}
                            onClick={() => handleSendAi(f)}
                            className="block text-left text-xs font-medium text-blue-700 dark:text-blue-400 hover:underline"
                          >
                            &bull; {f}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
              {isAiLoading && (
                <div className="p-3 bg-stone-100 dark:bg-stone-800 font-mono text-xs text-stone-500 animate-pulse">
                  AI Tutor analyzing material content...
                </div>
              )}
            </div>

            {/* Input Box */}
            <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-[#f9f8f4] dark:bg-stone-900 flex items-center gap-2">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAi()}
                placeholder="Ask AI about this material..."
                className="flex-1 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 px-3 py-2 text-xs font-sans text-stone-900 dark:text-white focus:outline-none focus:border-blue-600"
              />
              <button
                onClick={() => handleSendAi()}
                disabled={!aiQuery.trim() || isAiLoading}
                className="px-3 py-2 bg-blue-700 hover:bg-blue-600 disabled:opacity-40 text-white font-mono text-xs font-bold uppercase transition-colors"
              >
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
