'use client';

import React, { useState, useRef } from 'react';
import {
  Send,
  Image as ImageIcon,
  FileText,
  Code2,
  Mic,
  MicOff,
  Paperclip,
  X,
  Sparkles,
  Layers,
  HelpCircle,
  Square,
  AlertCircle,
} from 'lucide-react';

export interface MultimodalDoubtPayload {
  text_question?: string;
  image_data_base64?: string;
  image_url?: string;
  code_snippet?: string;
  code_language?: string;
  voice_transcript?: string;
  current_topic?: string;
  explanation_level?: string;
  preferred_strategy?: string;
}

export interface MultimodalComposerProps {
  onSubmitDoubt?: (payload: MultimodalDoubtPayload) => void;
  onSendDoubt?: (payload: {
    text: string;
    modality: string;
    imageBase64?: string;
    imageFilename?: string;
    codeSnippet?: string;
    codeLanguage?: string;
    explanationLevel?: string;
  }) => void;
  onVoiceInterruption?: () => void;
  isLoading?: boolean;
}

export const MultimodalComposer: React.FC<MultimodalComposerProps> = ({
  onSubmitDoubt,
  onSendDoubt,
  onVoiceInterruption,
  isLoading = false,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<{ base64: string; name: string } | null>(null);
  const [codeMode, setCodeMode] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('python');
  const [explanationLevel, setExplanationLevel] = useState('intermediate');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setSelectedImage({
        base64,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const toggleVoiceRecording = () => {
    if (isRecordingVoice) {
      // Stop recording
      setIsRecordingVoice(false);
      if (timerRef.current) clearInterval(timerRef.current);
      const voiceText = inputText || 'Can you explain this concept in detail and highlight where people usually make mistakes?';
      if (onSubmitDoubt) {
        onSubmitDoubt({
          text_question: voiceText,
          voice_transcript: voiceText,
          explanation_level: explanationLevel,
        });
      }
      if (onSendDoubt) {
        onSendDoubt({
          text: voiceText,
          modality: 'voice',
          explanationLevel,
        });
      }
      setInputText('');
    } else {
      // Start recording
      setIsRecordingVoice(true);
      setVoiceSeconds(0);
      timerRef.current = setInterval(() => {
        setVoiceSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const handleSend = () => {
    if ((!inputText.trim() && !selectedImage && !codeSnippet.trim()) || isLoading) return;

    let modality = 'text';
    if (selectedImage) {
      modality = 'image';
    } else if (codeSnippet.trim()) {
      modality = 'code_snippet';
    }

    if (onSubmitDoubt) {
      onSubmitDoubt({
        text_question: inputText.trim() || undefined,
        image_data_base64: selectedImage?.base64,
        code_snippet: codeSnippet.trim() || undefined,
        code_language: codeLanguage,
        explanation_level: explanationLevel,
      });
    }

    if (onSendDoubt) {
      onSendDoubt({
        text: inputText,
        modality,
        imageBase64: selectedImage?.base64,
        imageFilename: selectedImage?.name,
        codeSnippet: codeSnippet.trim() || undefined,
        codeLanguage,
        explanationLevel,
      });
    }

    setInputText('');
    setSelectedImage(null);
    setCodeSnippet('');
    setCodeMode(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl space-y-3 relative">
      {/* Attached Image / File Preview */}
      {selectedImage && (
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950 border border-indigo-500/40 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <ImageIcon size={18} />
            </div>
            <div>
              <span className="text-xs font-bold text-white block truncate max-w-xs">
                {selectedImage.name}
              </span>
              <span className="text-[10px] text-indigo-300 font-mono">
                Multimodal Image Attached (Textbook/Math/Screenshot)
              </span>
            </div>
          </div>
          <button
            onClick={() => setSelectedImage(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Code Editor Modal inside Composer */}
      {codeMode && (
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 size={14} className="text-indigo-400" />
              <span className="text-xs font-bold text-white">Attach Code / Error Log</span>
            </div>
            <select
              value={codeLanguage}
              onChange={(e) => setCodeLanguage(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-300 font-mono focus:outline-none"
            >
              <option value="python">Python</option>
              <option value="sql">SQL</option>
              <option value="javascript">JavaScript / TypeScript</option>
              <option value="java">Java</option>
              <option value="cpp">C / C++</option>
            </select>
          </div>
          <textarea
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            rows={5}
            className="w-full p-2.5 font-mono text-xs bg-slate-900 border border-slate-800 rounded-xl text-indigo-100 focus:outline-none focus:border-indigo-500 resize-none"
            placeholder="Paste code or traceback exception here..."
          />
        </div>
      )}

      {/* Voice Recording Waveform Visualizer */}
      {isRecordingVoice && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 animate-pulse">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span>Live Voice Tutor Listening... ({voiceSeconds}s)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onVoiceInterruption) onVoiceInterruption();
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900 text-rose-300 text-[11px] font-bold border border-rose-500/40 hover:bg-slate-800"
            >
              Wait / Stop
            </button>
            <button
              onClick={toggleVoiceRecording}
              className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-500"
            >
              Finish Turn
            </button>
          </div>
        </div>
      )}

      {/* Main Textarea Input */}
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={2}
        className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none font-sans leading-relaxed"
        placeholder="Type a doubt, paste code, or ask 'Why does gradient descent work?'..."
      />

      {/* Composer Bottom Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5">
          {/* Image / Screenshot Upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*,.pdf,.txt"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-indigo-300 hover:border-indigo-500/40 text-xs transition-colors"
            title="Upload photo of textbook, handwriting, or screenshot"
          >
            <ImageIcon size={14} />
            <span>Image / Screenshot</span>
          </button>

          {/* Code Mode Toggle */}
          <button
            onClick={() => setCodeMode(!codeMode)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs transition-colors ${
              codeMode
                ? 'bg-indigo-950 border-indigo-500 text-indigo-200'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-indigo-300'
            }`}
          >
            <Code2 size={14} />
            <span>Code</span>
          </button>

          {/* Explanation Level Selector */}
          <select
            value={explanationLevel}
            onChange={(e) => setExplanationLevel(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="beginner">Explain: Beginner</option>
            <option value="intermediate">Explain: Standard</option>
            <option value="advanced">Explain: Advanced</option>
            <option value="simpler">Explain: Simpler (No Jargon)</option>
            <option value="analogy">Explain: Analogy First</option>
            <option value="visual">Explain: Visually</option>
            <option value="mathematical">Explain: Mathematically</option>
          </select>
        </div>

        {/* Right side: Voice Recorder & Send Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleVoiceRecording}
            className={`p-2.5 rounded-xl border transition-all ${
              isRecordingVoice
                ? 'bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-600/30 ring-2 ring-rose-400/50'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-indigo-500/40'
            }`}
            title="Live Voice Tutor"
          >
            <Mic size={16} />
          </button>

          <button
            onClick={handleSend}
            disabled={(!inputText.trim() && !selectedImage && !codeSnippet.trim()) || isLoading}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            <span>Ask Tutor</span>
            <Send size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
