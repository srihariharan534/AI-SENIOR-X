'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import api from '@/lib/api';

export type VoiceState =
  | 'idle'
  | 'recording'
  | 'processing'
  | 'thinking'
  | 'speaking'
  | 'interrupted'
  | 'error';

export function useVoice(sessionId: string = 'voice_session_default') {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [responseSpokenText, setResponseSpokenText] = useState<string>('');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const activeAudioElementRef = useRef<HTMLAudioElement | null>(null);

  // Clean up audio references on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      if (activeAudioElementRef.current) {
        activeAudioElementRef.current.pause();
      }
    };
  }, []);

  const updateVisualizer = useCallback(() => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const average = sum / dataArray.length;
    setAudioLevel(Math.min(100, Math.round((average / 128) * 100)));

    animationFrameRef.current = requestAnimationFrame(updateVisualizer);
  }, []);

  const startRecording = async () => {
    setError(null);
    try {
      if (activeAudioElementRef.current) {
        activeAudioElementRef.current.pause();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      setVoiceState('recording');
      updateVisualizer();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Microphone access was denied.');
      setVoiceState('error');
    }
  };

  const stopRecordingAndSend = async (fallbackPrompt?: string) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setAudioLevel(0);

    const promptText = fallbackPrompt || transcript || 'Can you explain the key concepts in supervised learning?';
    setTranscript(promptText);
    setVoiceState('processing');

    try {
      setVoiceState('thinking');
      const res = await api.processVoiceTurn({
        session_id: sessionId,
        text_prompt: promptText,
      });

      if (res.success && res.data) {
        setResponseSpokenText(res.data.spoken_text || res.data.response_text);
        setVoiceState('speaking');

        // Play synthetic tone/speech simulation
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(res.data.spoken_text || res.data.response_text);
          utterance.rate = 1.0;
          utterance.onend = () => {
            setVoiceState('idle');
          };
          utterance.onerror = () => {
            setVoiceState('idle');
          };
          window.speechSynthesis.speak(utterance);
        } else {
          setTimeout(() => {
            setVoiceState('idle');
          }, (res.data.duration_seconds || 3) * 1000);
        }
      } else {
        setVoiceState('error');
        setError(res.error?.message || 'Voice turn processing failed');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Voice request failed');
      setVoiceState('error');
    }
  };

  const interruptSpeech = async () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (activeAudioElementRef.current) {
      activeAudioElementRef.current.pause();
    }
    setVoiceState('interrupted');
    try {
      await api.interruptVoice(sessionId, 1.0);
    } catch {
      // Ignored
    }
    setTimeout(() => {
      setVoiceState('idle');
    }, 500);
  };

  return {
    voiceState,
    transcript,
    setTranscript,
    responseSpokenText,
    audioLevel,
    error,
    startRecording,
    stopRecordingAndSend,
    interruptSpeech,
  };
}
