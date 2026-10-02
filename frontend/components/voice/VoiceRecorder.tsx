'use client';

import React from 'react';
import { AudioVisualizer } from './AudioVisualizer';
import { VoiceButton } from './VoiceButton';
import { VoiceState } from '@/hooks/useVoice';
import { Card } from '@/components/common/Card';
import { Sparkles, AlertCircle } from 'lucide-react';

interface VoiceRecorderProps {
  state: VoiceState;
  transcript: string;
  responseSpokenText?: string;
  audioLevel: number;
  error?: string | null;
  onStart: () => void;
  onStop: () => void;
  onInterrupt: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  state,
  transcript,
  responseSpokenText,
  audioLevel,
  error,
  onStart,
  onStop,
  onInterrupt,
}) => {
  const getStatusText = () => {
    switch (state) {
      case 'recording':
        return 'Listening... Speak your question now';
      case 'processing':
      case 'thinking':
        return 'Analyzing speech with Learning Twin & formulating response...';
      case 'speaking':
        return 'AI Tutor speaking (Interruption ready)...';
      case 'interrupted':
        return 'Turn interrupted. Ready for next query.';
      case 'error':
        return error || 'Voice processing issue. Please try again.';
      default:
        return 'Tap microphone to speak with your AI Tutor';
    }
  };

  return (
    <Card className="bg-slate-950/90 border-indigo-500/30 p-6 flex flex-col items-center justify-center text-center space-y-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
        <Sparkles size={14} />
        <span>Live Conversational Audio</span>
      </div>

      {/* Frequency Visualizer */}
      <AudioVisualizer
        level={audioLevel}
        isActive={state === 'recording' || state === 'speaking'}
        state={state}
      />

      {/* Main Microphone Action */}
      <div className="my-2">
        <VoiceButton
          state={state}
          onClick={state === 'recording' ? onStop : onStart}
          onInterrupt={onInterrupt}
        />
      </div>

      {/* Status Label */}
      <div className="text-xs text-slate-300 font-medium max-w-sm">
        {getStatusText()}
      </div>

      {/* Real-time transcript preview */}
      {transcript && state !== 'idle' && (
        <div className="w-full max-w-md p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-left">
          <span className="text-slate-500 font-semibold block mb-1">Your query:</span>
          <p className="text-slate-200">{transcript}</p>
        </div>
      )}

      {/* Spoken response preview */}
      {responseSpokenText && state === 'speaking' && (
        <div className="w-full max-w-md p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-left">
          <span className="text-indigo-400 font-semibold block mb-1">Tutor reply:</span>
          <p className="text-indigo-100">{responseSpokenText}</p>
        </div>
      )}
    </Card>
  );
};
