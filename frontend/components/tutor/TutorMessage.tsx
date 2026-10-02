'use client';

import React from 'react';
import { TutorMessage as TutorMessageType } from '@/types';
import { Brain, User, Sparkles, Copy, Check } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { FollowUpQuestion } from './FollowUpQuestion';

interface TutorMessageProps {
  message: TutorMessageType;
  onSelectFollowUp?: (question: string) => void;
}

export const TutorMessage: React.FC<TutorMessageProps> = ({
  message,
  onSelectFollowUp,
}) => {
  const isUser = message.sender === 'user';
  const [copied, setCopied] = React.useState(false);

  const copyContent = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to render markdown-like formatting (bolding, code blocks, bullet points)
  const formatContent = (content: string) => {
    // Split by code blocks
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const firstLine = lines[0];
        const hasLang = !firstLine.includes(' ') && firstLine.length < 15;
        const lang = hasLang ? firstLine : 'code';
        const codeContent = hasLang ? lines.slice(1).join('\n') : lines.join('\n');

        return (
          <div key={index} className="my-3 rounded-xl bg-slate-950/90 border border-slate-800/90 overflow-hidden text-xs">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
              <span>{lang}</span>
              <button
                onClick={() => navigator.clipboard.writeText(codeContent)}
                className="hover:text-white transition-colors"
                title="Copy code"
              >
                <Copy size={12} />
              </button>
            </div>
            <pre className="p-3 font-mono text-cyan-300 overflow-x-auto leading-relaxed">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      }

      // Format bold, lists, and line breaks
      const paragraphs = part.split('\n\n');
      return (
        <div key={index} className="space-y-2">
          {paragraphs.map((para, pIdx) => {
            if (!para.trim()) return null;

            // List item detection
            if (para.startsWith('* ') || para.startsWith('- ')) {
              const items = para.split(/\n(?=[*-] )/);
              return (
                <ul key={pIdx} className="list-disc list-inside space-y-1 my-1 pl-1">
                  {items.map((item, iIdx) => (
                    <li key={iIdx} className="text-slate-200 leading-relaxed">
                      {item.replace(/^[*-] /, '')}
                    </li>
                  ))}
                </ul>
              );
            }

            return (
              <p key={pIdx} className="text-slate-200 leading-relaxed whitespace-pre-line">
                {para}
              </p>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className={`flex gap-3.5 my-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
          isUser
            ? 'bg-indigo-600 text-white shadow-indigo-600/30'
            : 'bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-indigo-500/30'
        }`}
      >
        {isUser ? <User size={18} /> : <Brain size={18} />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[82%] sm:max-w-[75%] space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`p-4 rounded-2xl text-sm ${
            isUser
              ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/20'
              : 'bg-slate-900/90 border border-slate-800 text-slate-100 rounded-tl-none shadow-md backdrop-blur-md'
          }`}
        >
          {/* Header metadata for AI Tutor replies */}
          {!isUser && (
            <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-indigo-300">
                <Sparkles size={14} className="text-indigo-400" />
                <span>AI Tutor</span>
              </div>
              {message.pedagogy_strategy && (
                <Badge variant="indigo" size="sm">
                  {message.pedagogy_strategy}
                </Badge>
              )}
            </div>
          )}

          {/* Content Body */}
          <div className="text-sm">{formatContent(message.content)}</div>

          {/* Copy Action */}
          {!isUser && (
            <div className="flex justify-end pt-2 mt-2 border-t border-slate-800/60">
              <button
                onClick={copyContent}
                className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Suggested Follow-Ups */}
        {!isUser && message.suggested_follow_ups && onSelectFollowUp && (
          <FollowUpQuestion
            questions={message.suggested_follow_ups}
            onSelect={onSelectFollowUp}
          />
        )}
      </div>
    </div>
  );
};
