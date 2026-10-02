'use client';

import React from 'react';
import { Mic, MicOff, Volume2, Square, Sparkles } from 'lucide-react';
import { VoiceState } from '@/hooks/useVoice';

interface VoiceButtonProps {
  state: VoiceState;
  onClick: () => void;
  onInterrupt?: () => void;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  state,
  onClick,
  onInterrupt,
}) => {
  const isRecording = state === 'recording';
  const isSpeaking = state === 'speaking';
  const isThinking = state === 'thinking' || state === 'processing';

  if (isSpeaking && onInterrupt) {
    return (
      <button
        onClick={onInterrupt}
        className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/40 animate-pulse transition-all"
      >
        <Square size={13} fill="currentColor" />
        <span>Interrupt Tutor</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={isThinking}
      className={`relative p-3.5 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
        isRecording
          ? 'bg-rose-600 text-white shadow-rose-600/50 scale-110 animate-pulse'
          : isThinking
          ? 'bg-indigo-700 text-indigo-200 cursor-wait'
          : isSpeaking
          ? 'bg-cyan-600 text-white shadow-cyan-600/50 animate-bounce'
          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/40 hover:scale-105'
      }`}
      title={isRecording ? 'Click to stop recording' : 'Click to speak to AI Tutor'}
    >
      {isRecording ? (
        <MicOff size={20} />
      ) : isSpeaking ? (
        <Volume2 size={20} />
      ) : isThinking ? (
        <Sparkles size={20} className="animate-spin" />
      ) : (
        <Mic size={20} />
      )}

      {/* Outer ripple ring when recording */}
      {isRecording && (
        <span className="absolute -inset-1.5 rounded-full border-2 border-rose-500/60 animate-ping" />
      )}
    </button>
  );
};
