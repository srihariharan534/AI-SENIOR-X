'use client';

import React, { useRef, useEffect, useState } from 'react';
import { TutorMessage as TutorMessageType, TutorPedagogyMode } from '@/types';
import { TutorMessage } from './TutorMessage';
import { TutorModeSelector } from './TutorModeSelector';
import { Button } from '@/components/common/Button';
import { Send, Mic, Sparkles, RefreshCw } from 'lucide-react';

interface TutorChatProps {
  messages: TutorMessageType[];
  sending: boolean;
  activeStrategy?: string;
  pedagogyMode: TutorPedagogyMode;
  onSelectMode: (mode: TutorPedagogyMode) => void;
  onSendMessage: (text: string) => void;
  onStartVoice?: () => void;
  onResetSession?: () => void;
}

export const TutorChat: React.FC<TutorChatProps> = ({
  messages,
  sending,
  activeStrategy,
  pedagogyMode,
  onSelectMode,
  onSendMessage,
  onStartVoice,
  onResetSession,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] rounded-2xl bg-slate-950/60 backdrop-blur-xl border border-slate-800/80 overflow-hidden shadow-2xl">
      {/* Chat Header */}
      <div className="px-5 py-3.5 bg-slate-900/80 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
            <Sparkles size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">AI-SENIOR-X Adaptive Tutor</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-400">
              Active Strategy: <span className="text-indigo-300 font-semibold">{activeStrategy || 'Socratic Guided Inquiry'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onResetSession && (
            <button
              onClick={onResetSession}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              title="Reset conversation"
            >
              <RefreshCw size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Pedagogy Mode Bar */}
      <div className="px-5 py-2.5 bg-slate-900/40 border-b border-slate-800/50">
        <TutorModeSelector currentMode={pedagogyMode} onSelectMode={onSelectMode} />
      </div>

      {/* Conversation Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <TutorMessage
            key={msg.id}
            message={msg}
            onSelectFollowUp={(q) => onSendMessage(q)}
          />
        ))}

        {sending && (
          <div className="flex gap-3 items-center my-4 animate-pulse">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
              <Sparkles size={16} />
            </div>
            <div className="p-3.5 rounded-2xl rounded-tl-none bg-slate-900 border border-slate-800 text-xs text-indigo-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span>Analyzing cognitive twin & formulating pedagogical response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <div className="p-4 bg-slate-900/80 border-t border-slate-800/80 shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          {onStartVoice && (
            <button
              type="button"
              onClick={onStartVoice}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-300 border border-slate-700/60 hover:border-indigo-500/40 transition-all"
              title="Voice conversational mode"
            >
              <Mic size={18} />
            </button>
          )}

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask anything or request clarification (e.g. 'Why does cross-entropy loss use logs?')..."
            className="flex-1 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
            disabled={sending}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!inputText.trim() || sending}
            icon={<Send size={15} />}
          >
            <span>Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
};
