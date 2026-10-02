'use client';

import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  Send,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Award,
  TrendingUp,
  Brain,
  Layers,
} from 'lucide-react';

interface TeachBackStudioProps {
  conceptName: string;
  teachBackPrompt?: string;
  onMasteryUpdated?: (score: number) => void;
}

export const TeachBackStudio: React.FC<TeachBackStudioProps> = ({
  conceptName = 'CPython Memory Reference Model & Reference Counting',
  teachBackPrompt = 'Explain how CPython manages memory when you assign `b = a` for a list object, and how reference counting triggers garbage collection.',
  onMasteryUpdated,
}) => {
  const [explanationText, setExplanationText] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    overallScore: number;
    accuracy: { score: number; feedback: string };
    missingConcepts: string[];
    misconceptions: string[];
    reasoningQuality: string;
    clarity: string;
    learningTwinUpdated: boolean;
  } | null>(null);

  const handleEvaluate = () => {
    if (!explanationText.trim()) return;
    setIsEvaluating(true);
    setEvaluationResult(null);

    setTimeout(() => {
      setIsEvaluating(false);
      setEvaluationResult({
        overallScore: 94,
        accuracy: {
          score: 95,
          feedback:
            'Excellent explanation of PyObject pointers on the heap and why reference assignment does not deep-copy the underlying array bytes.',
        },
        missingConcepts: [],
        misconceptions: [],
        reasoningQuality: 'High — correct distinction between pointer aliasing and memory allocation.',
        clarity: 'Clear, concise, and technically precise.',
        learningTwinUpdated: true,
      });
      if (onMasteryUpdated) onMasteryUpdated(94);
    }, 1200);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate voice speech-to-text transcript
      setTimeout(() => {
        setExplanationText(
          'In Python, when we assign b = a, CPython does not copy the list. Instead, it increments the reference count in the PyObject header by one. Both variables point to the same hexadecimal address in heap memory. When all references go out of scope and the count hits zero, CPython immediately reclaims the memory.'
        );
        setIsRecording(false);
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="bg-[#fcfbfa] border border-stone-300 p-6 md:p-8 space-y-6 text-stone-900 font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs text-amber-700 uppercase font-bold tracking-widest">
            <Brain size={14} />
            <span>ACTIVE RECALL • TEACH IT BACK STUDIO</span>
          </div>
          <h3 className="font-serif text-2xl text-stone-900 font-bold tracking-tight">
            Explain &ldquo;{conceptName}&rdquo;
          </h3>
        </div>

        <div className="px-3 py-1 bg-amber-50 border border-amber-300 text-amber-800 font-mono text-xs font-bold uppercase">
          FEYNMAN TECHNIQUE VALIDATION
        </div>
      </div>

      {/* PROMPT BOX */}
      <div className="p-4 bg-stone-100 border-l-4 border-amber-600 space-y-1">
        <div className="font-mono text-[10px] text-stone-500 uppercase font-bold">
          TEACH-BACK DIRECTIVE:
        </div>
        <p className="text-sm text-stone-800 font-serif leading-relaxed">
          &ldquo;{teachBackPrompt}&rdquo;
        </p>
      </div>

      {/* TEXT & VOICE INPUT */}
      <div className="space-y-3">
        <div className="flex items-center justify-between font-mono text-xs text-stone-500">
          <span>YOUR EXPLANATION (TEXT OR VOICE):</span>
          <button
            onClick={toggleRecording}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold border transition-colors ${
              isRecording
                ? 'bg-red-600 text-white border-red-700 animate-pulse'
                : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
            }`}
          >
            {isRecording ? <MicOff size={13} /> : <Mic size={13} />}
            <span>{isRecording ? 'LISTENING (SPEAK NOW)...' : 'DICTATE BY VOICE'}</span>
          </button>
        </div>

        <textarea
          value={explanationText}
          onChange={(e) => setExplanationText(e.target.value)}
          rows={5}
          placeholder="Explain the concept in your own words. Use analogies, walk through memory steps, or describe edge cases..."
          className="w-full p-4 bg-white border border-stone-300 focus:outline-none focus:border-blue-700 text-xs sm:text-sm font-sans leading-relaxed text-stone-900"
        />

        <div className="flex justify-end">
          <button
            onClick={handleEvaluate}
            disabled={isEvaluating || !explanationText.trim()}
            className="px-6 py-3 bg-stone-900 hover:bg-blue-700 disabled:opacity-40 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            {isEvaluating ? (
              <>
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>AI PROFESSOR IS EVALUATING REASONING...</span>
              </>
            ) : (
              <>
                <Sparkles size={14} />
                <span>SUBMIT TEACH-BACK EVALUATION</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* EVALUATION RESULTS */}
      {evaluationResult && (
        <div className="p-6 bg-stone-50 border border-emerald-400 space-y-4 font-mono text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-stone-300 pb-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 size={18} />
              <span>TEACH-BACK DEMONSTRATED (SCORE: {evaluationResult.overallScore}/100)</span>
            </div>
            <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
              <TrendingUp size={14} />
              <span>LEARNING TWIN SYNCHRONIZED</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
            <div className="p-3 bg-white border border-stone-200 space-y-1">
              <span className="text-stone-500 uppercase font-bold">Conceptual Accuracy:</span>
              <p className="text-stone-800 font-sans">{evaluationResult.accuracy.feedback}</p>
            </div>

            <div className="p-3 bg-white border border-stone-200 space-y-1">
              <span className="text-stone-500 uppercase font-bold">Reasoning & Clarity:</span>
              <p className="text-stone-800 font-sans">{evaluationResult.reasoningQuality}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
