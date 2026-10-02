'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  MessageSquareText,
  Sparkles,
  HelpCircle,
  Code2,
  Lightbulb,
  CheckCircle2,
  Globe,
  Send,
  Clock,
  BookOpen,
  ArrowRight,
  Layers,
  ChevronRight,
  RefreshCw,
  Zap,
  Terminal,
  Activity,
  Award,
  Radio,
  Sliders,
  Film,
  FileCode2,
} from 'lucide-react';
import { VideoLesson, Chapter } from '@/lib/universityData';

interface AIVideoTeachingStudioProps {
  courseName: string;
  moduleTitle: string;
  chapterTitle?: string;
  lessons: VideoLesson[];
  onOpenTeachBack?: () => void;
  onOpenPractice?: () => void;
  onOpenQuiz?: () => void;
}

export const AIVideoTeachingStudio: React.FC<AIVideoTeachingStudioProps> = ({
  courseName = 'Python',
  moduleTitle = 'Module 01: Python Foundations & CPython Memory Architecture',
  chapterTitle = 'Chapter 01: CPython Memory Architecture & Dynamic Typing',
  lessons,
  onOpenTeachBack,
  onOpenPractice,
  onOpenQuiz,
}) => {
  const [currentLessonIdx, setCurrentLessonIdx] = useState<number>(0);
  const currentLesson = lessons[currentLessonIdx] || lessons[0];

  // Video playback & Speech state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'tamil' | 'hindi'>('english');
  const [activeTab, setActiveTab] = useState<'studio' | 'transcript' | 'diagram' | 'code'>('studio');
  const [isSpeakingAloud, setIsSpeakingAloud] = useState<boolean>(false);
  const [speechStatusText, setSpeechStatusText] = useState<string>('Ready to play');

  // AI Doubt & Contextual Interruption state
  const [doubtInput, setDoubtInput] = useState<string>('');
  const [explainAgainStage, setExplainAgainStage] = useState<number>(0);
  const [aiChatHistory, setAiChatHistory] = useState<
    { sender: 'learner' | 'ai'; text: string; timestamp?: string; strategy?: string }[]
  >([
    {
      sender: 'ai',
      text: `Welcome to **${currentLesson.title}**. I am your AI Professor (Dr. Ada Vance). When you click Play, I will teach this lesson aloud with voice narration and synchronized visuals. You can interrupt with doubts or ask for alternative explanations anytime!`,
    },
  ]);
  const [isAiResponding, setIsAiResponding] = useState<boolean>(false);

  // Interactive Video Checkpoint pause state
  const [activeCheckpoint, setActiveCheckpoint] = useState<any | null>(null);
  const [checkpointAnswer, setCheckpointAnswer] = useState<number | null>(null);
  const [checkpointSubmitted, setCheckpointSubmitted] = useState<boolean>(false);

  // Background Compilation Pipeline Job Modal
  const [isCompilingLesson, setIsCompilingLesson] = useState<boolean>(false);
  const [compilationProgress, setCompilationProgress] = useState<number>(0);
  const [compilationStage, setCompilationStage] = useState<string>('QUEUED');

  const totalDurationSec = currentLesson.durationSeconds || 1080;
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Voice synthesis helper
  const speakText = (text: string, lang: 'english' | 'tamil' | 'hindi' = selectedLanguage) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    // Cancel any existing speech
    window.speechSynthesis.cancel();

    if (isMuted) return;

    // Clean markdown formatting for clean spoken output
    const cleanSpoken = text
      .replace(/```[\s\S]*?```/g, 'Here is the code displayed on your screen.')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[\*_#]/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpoken);
    utterance.rate = Math.max(0.8, Math.min(1.8, playbackSpeed * 0.95));
    utterance.pitch = 1.0;
    utterance.volume = isMuted ? 0 : volume;

    // Set locale based on language
    if (lang === 'tamil') {
      utterance.lang = 'ta-IN';
    } else if (lang === 'hindi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-US';
    }

    // Attempt to find a suitable voice
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find((v) => {
      if (lang === 'tamil') return v.lang.includes('ta');
      if (lang === 'hindi') return v.lang.includes('hi');
      return v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Google') || v.name.includes('Microsoft'));
    }) || voices.find((v) => v.lang.startsWith(utterance.lang.slice(0, 2)));

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      setIsSpeakingAloud(true);
      setSpeechStatusText(`Speaking: ${lang.toUpperCase()}`);
    };

    utterance.onend = () => {
      setIsSpeakingAloud(false);
      setSpeechStatusText('Finished speaking section');
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis notification:', e);
      setIsSpeakingAloud(false);
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Stop speech
  const stopSpeech = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeakingAloud(false);
      setSpeechStatusText('Paused');
    }
  };

  // Get current voice script for active section
  const getCurrentSectionScript = () => {
    if (selectedLanguage === 'tamil' && currentLesson.multilingual?.tamil) {
      return currentLesson.multilingual.tamil;
    }
    if (selectedLanguage === 'hindi' && currentLesson.multilingual?.hindi) {
      return currentLesson.multilingual.hindi;
    }
    return (
      currentLesson.voiceScript ||
      `${currentLesson.introduction} ${currentLesson.conceptExplanation} ${currentLesson.realWorldAnalogy}`
    );
  };

  // Handle Play/Pause
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopSpeech();
    } else {
      setIsPlaying(true);
      const script = getCurrentSectionScript();
      speakText(script, selectedLanguage);
    }
  };

  // Video timer simulation synchronized with voice
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && !activeCheckpoint) {
      interval = setInterval(() => {
        setCurrentTimeSec((prev) => {
          const next = prev + 1 * playbackSpeed;
          // Check if checkpoint triggered
          if (currentLesson.pauseCheckpoints && currentLesson.pauseCheckpoints.length > 0) {
            const cp = currentLesson.pauseCheckpoints.find(
              (c) => Math.floor(next) === c.timestampSeconds && !checkpointSubmitted
            );
            if (cp) {
              setIsPlaying(false);
              stopSpeech();
              setActiveCheckpoint(cp);
              speakText(`Quick Checkpoint question: ${cp.question}`);
            }
          }
          if (next >= totalDurationSec) {
            setIsPlaying(false);
            stopSpeech();
            return totalDurationSec;
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed, totalDurationSec, currentLesson, activeCheckpoint, checkpointSubmitted]);

  // Handle lesson change
  useEffect(() => {
    stopSpeech();
    setIsPlaying(false);
    setCurrentTimeSec(0);
    setActiveCheckpoint(null);
    setCheckpointSubmitted(false);
    setAiChatHistory([
      {
        sender: 'ai',
        text: `Welcome to **${currentLesson.title}**. I am your AI Professor. When you click Play, I will teach this lesson aloud with voice narration and synchronized visuals. You can interrupt with doubts or ask for alternative explanations anytime!`,
      },
    ]);
  }, [currentLessonIdx, currentLesson]);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 9 Pedagogy Directives Implementation
  const handleExplainAgain = () => {
    const strategies = [
      {
        name: 'Simple Intuition',
        text: `**Simplified Explanation**: Think of CPython like an office manager. When you write \`x = 10\`, the manager creates a sticky note named "x" and sticks it onto a box labeled "10". If you write \`y = x\`, the manager doesn't make a new box; they just put a second sticky note named "y" onto the same box.`,
        spoken: 'Think of CPython like an office manager. When you assign variables, Python does not duplicate memory; it creates reference pointers to the exact same heap object.',
      },
      {
        name: 'Real-World Analogy',
        text: `**Analogy Strategy**: ${currentLesson.realWorldAnalogy}`,
        spoken: currentLesson.realWorldAnalogy,
      },
      {
        name: 'Visual Diagram',
        text: `**Visual Architecture**:\n\`\`\`\n${currentLesson.diagramAscii}\n\`\`\`\nNotice how both names point to the same PyObject memory address on the heap.`,
        spoken: 'Looking at the memory diagram on your screen, notice how both variable names point to the exact same PyObject memory address on the heap.',
      },
      {
        name: 'Technical Deep-Dive',
        text: `**Technical Deep-Dive**: In CPython's C source code (Include/object.h), every integer is a \`PyLongObject\` containing \`PyObject_HEAD\` (consisting of \`atomic_ssize_t ob_refcnt\` and \`struct _typeobject *ob_type\`). Variable reassignment increments \`ob_refcnt\` via \`Py_INCREF()\`.`,
        spoken: 'At the C level, every integer in Python is a PyLongObject structure containing reference counters and type pointers.',
      },
      {
        name: 'Worked Code Walkthrough',
        text: `**Step-by-Step Code Execution**:\n\`\`\`python\n${currentLesson.codeSnippet}\n\`\`\`\nTerminal output verifies:\n\`${currentLesson.terminalOutput}\``,
        spoken: 'Here is the step-by-step code demonstration. Notice that the memory address id is identical for both variables.',
      },
    ];

    const nextStage = (explainAgainStage + 1) % strategies.length;
    setExplainAgainStage(nextStage);
    const strategy = strategies[nextStage];

    setAiChatHistory((prev) => [
      ...prev,
      { sender: 'learner', text: 'Can you explain this again using a different strategy?' },
      { sender: 'ai', text: strategy.text, strategy: strategy.name },
    ]);

    speakText(strategy.spoken, selectedLanguage);
  };

  const handleSimplify = () => {
    const text = `**Simplified Concept**: In Python, everything is an object stored in RAM. Variables are just name tags pointing to those objects. When you assign one variable to another, you are sharing the object, not cloning it.`;
    setAiChatHistory((prev) => [
      ...prev,
      { sender: 'learner', text: 'Simplify this concept for me.' },
      { sender: 'ai', text: text, strategy: 'Simplification' },
    ]);
    speakText('In simple terms, variables in Python are just name tags pointing to objects in memory. Assigning one variable to another shares the object without cloning it.');
  };

  const handleGoDeeper = () => {
    const text = `**CPython Internal Architecture**: When you execute this code, CPython's peephole optimizer analyzes the bytecode stream (\`LOAD_CONST\`, \`STORE_FAST\`). The evaluation loop in \`ceval.c\` executes opcodes against the frame's value stack with zero pointer dereference penalty.`;
    setAiChatHistory((prev) => [
      ...prev,
      { sender: 'learner', text: 'Go deeper into the underlying architecture.' },
      { sender: 'ai', text: text, strategy: 'Deep Architecture' },
    ]);
    speakText('Going deeper into CPython internals: The bytecode compiler generates LOAD_CONST and STORE_FAST opcodes evaluated inside ceval.c against the frame value stack.');
  };

  const handleGiveExample = () => {
    const text = `**Live Worked Example**:\n\`\`\`python\nimport sys\n\nx = [10, 20, 30]\ny = x\nprint("Reference count of x:", sys.getrefcount(x)) # Outputs 3 (x, y, sys.getrefcount arg)\n\`\`\``;
    setAiChatHistory((prev) => [
      ...prev,
      { sender: 'learner', text: 'Give me another worked example.' },
      { sender: 'ai', text: text, strategy: 'Code Example' },
    ]);
    setActiveTab('code');
    speakText('Here is a worked example using the sys.getrefcount function to directly inspect reference counts in Python.');
  };

  const handleShowCode = () => {
    setActiveTab('code');
    speakText('Switching visual display to the live syntax-highlighted code editor and terminal output.');
  };

  const handleWhy = () => {
    const text = `**Architectural Motivation (Why?)**: Python uses dynamic pointer referencing because it allows unified object polymorphism and rapid memory allocation without requiring developers to manage manual malloc/free calls.`;
    setAiChatHistory((prev) => [
      ...prev,
      { sender: 'learner', text: 'Why is Python designed this way?' },
      { sender: 'ai', text: text, strategy: 'Architectural Motivation' },
    ]);
    speakText('Python was designed with dynamic pointer referencing to enable universal polymorphism and automatic memory management without manual malloc and free calls.');
  };

  const handleQuizMe = () => {
    if (currentLesson.pauseCheckpoints && currentLesson.pauseCheckpoints.length > 0) {
      setIsPlaying(false);
      stopSpeech();
      setActiveCheckpoint(currentLesson.pauseCheckpoints[0]);
      speakText(`Here is a knowledge check: ${currentLesson.pauseCheckpoints[0].question}`);
    }
  };

  // Ask AI custom contextual doubt
  const handleSendDoubt = (customText?: string) => {
    const q = customText || doubtInput;
    if (!q.trim()) return;

    setDoubtInput('');
    setAiChatHistory((prev) => [
      ...prev,
      { sender: 'learner', text: q, timestamp: formatTime(currentTimeSec) },
    ]);
    setIsAiResponding(true);

    setTimeout(() => {
      setIsAiResponding(false);
      let answer = '';
      let spoken = '';
      if (selectedLanguage === 'tamil') {
        answer = `**AI தமிழ் விளக்கம் (${formatTime(currentTimeSec)} நேரக் கருத்து)**: இந்த நேரத்தில் கற்பிக்கப்படும் கருத்து "${currentLesson.title}". பைதான் சிபியூ-வில் இயங்கும் போது, பைட்கோட் ஆக மாற்றப்பட்டு சிபைதான் விர்ச்சுவல் மெஷினில் வரிசையாக இயக்கப்படுகிறது.`;
        spoken = 'பைதான் மெமரியில் ஆப்ஜெக்ட் பாயிண்டர்களைப் பயன்படுத்தி இயங்குகிறது.';
      } else if (selectedLanguage === 'hindi') {
        answer = `**AI हिंदी व्याख्या (${formatTime(currentTimeSec)} समय बिंदु)**: "${currentLesson.title}" के तहत, जब आप कोड निष्पादित करते हैं, तो CPython इसे बाइटकोड में बदलता है और वर्चुअल मशीन स्टैक लूप में चलाता है।`;
        spoken = 'पायथन में वेरिएबल्स केवल मेमोरी में रखे गए ऑब्जेक्ट्स को पॉइंट करते हैं।';
      } else {
        answer = `**AI Contextual Response (At ${formatTime(currentTimeSec)} in ${currentLesson.title})**:\n\nRegarding your question "${q}": At this exact timestamp, we are discussing the CPython evaluation stack. Variables never hold raw data directly; they hold pointers to the heap-allocated PyObject. When reference counts reach zero, memory is reclaimed immediately.`;
        spoken = `Regarding your question: In Python, variables hold pointers to heap-allocated objects rather than storing raw bits directly.`;
      }

      setAiChatHistory((prev) => [
        ...prev,
        { sender: 'ai', text: answer, timestamp: formatTime(currentTimeSec) },
      ]);
      speakText(spoken, selectedLanguage);
    }, 600);
  };

  // Submit interactive video checkpoint answer
  const handleCheckpointSubmit = () => {
    if (checkpointAnswer === null) return;
    setCheckpointSubmitted(true);
    const isCorrect = checkpointAnswer === (activeCheckpoint?.correctIndex ?? 1);
    const feedback = isCorrect
      ? 'Correct! Assignment binds a new reference pointer to the existing PyObject and increments reference count.'
      : 'Incorrect. Remember that Python does not clone lists on simple variable assignment; it shares the reference.';
    speakText(feedback, selectedLanguage);
  };

  const handleContinueAfterCheckpoint = () => {
    setActiveCheckpoint(null);
    setCheckpointAnswer(null);
    setCheckpointSubmitted(false);
    setIsPlaying(true);
    speakText('Continuing lesson lecture.');
  };

  // Trigger Lesson Recompilation Simulation
  const handleTriggerCompilation = () => {
    setIsCompilingLesson(true);
    setCompilationProgress(10);
    setCompilationStage('ANALYZING_LEARNING_GOALS');

    const stages = [
      { prog: 25, stage: 'WRITING_LLM_TEACHING_SCRIPT' },
      { prog: 50, stage: 'SYNTHESIZING_TTS_AUDIO_WAVEFORMS' },
      { prog: 75, stage: 'GENERATING_VISUAL_CODE_FRAMES' },
      { prog: 90, stage: 'RENDERING_H264_STREAM_AND_CAPTIONS' },
      { prog: 100, stage: 'READY' },
    ];

    stages.forEach((st, idx) => {
      setTimeout(() => {
        setCompilationProgress(st.prog);
        setCompilationStage(st.stage);
        if (st.prog === 100) {
          setTimeout(() => setIsCompilingLesson(false), 800);
        }
      }, (idx + 1) * 700);
    });
  };

  // Determine active visual stage based on timestamp
  const getVisualStage = () => {
    const t = currentTimeSec;
    if (t < 180) return 'intro';
    if (t < 420) return 'diagram';
    if (t < 720) return 'code';
    if (t < 960) return 'terminal';
    return 'summary';
  };

  const visualStage = getVisualStage();

  return (
    <div className="bg-[#0b0e17] border-2 border-stone-800 text-stone-100 font-sans shadow-2xl overflow-hidden">
      {/* 1. TOP TEACHING STUDIO HEADER */}
      <div className="p-4 sm:p-5 bg-[#07090f] border-b border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-blue-400 font-bold uppercase tracking-widest">
              AI TEACHING SESSION
            </span>
            <span className="text-stone-600">/</span>
            <span className="text-stone-400 uppercase">{courseName}</span>
            <span className="text-stone-600">/</span>
            <span className="text-emerald-400 font-bold">2h 35m SESSION</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-white font-bold tracking-tight">
            {currentLesson.title}
          </h3>
          <p className="text-xs text-stone-400 font-mono">{moduleTitle}</p>
        </div>

        {/* Multilingual Selector, Recompile & Lesson Stepper */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-xs">
          {/* Audio Status Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-950/60 border border-blue-800 text-blue-300">
            {isSpeakingAloud ? (
              <span className="flex items-center gap-1.5">
                <Radio size={12} className="text-emerald-400 animate-pulse" />
                <span className="text-[11px] font-bold text-emerald-400">AUDIO ACTIVE (SPEAKING)</span>
              </span>
            ) : (
              <span className="text-[11px] text-stone-400">🔊 Voice: {selectedLanguage.toUpperCase()}</span>
            )}
          </div>

          <div className="flex items-center gap-1 bg-[#141824] border border-stone-800 p-1">
            <Globe size={13} className="text-blue-400 ml-1" />
            <select
              value={selectedLanguage}
              onChange={(e) => {
                const newLang = e.target.value as any;
                setSelectedLanguage(newLang);
                if (isPlaying) {
                  speakText(getCurrentSectionScript(), newLang);
                }
              }}
              className="bg-transparent text-xs text-stone-200 focus:outline-none cursor-pointer pr-2 font-mono"
            >
              <option value="english" className="bg-stone-900">English (Dr. Ada Vance)</option>
              <option value="tamil" className="bg-stone-900">தமிழ் (Tamil AI Voice)</option>
              <option value="hindi" className="bg-stone-900">हिन्दी (Hindi AI Voice)</option>
            </select>
          </div>

          <button
            onClick={handleTriggerCompilation}
            title="Recompile AI Lesson using LLM + TTS Pipeline"
            className="px-2.5 py-1.5 bg-[#141824] hover:bg-stone-800 border border-stone-700 text-stone-300 flex items-center gap-1.5 text-xs transition-colors"
          >
            <RefreshCw size={12} className={isCompilingLesson ? 'animate-spin text-blue-400' : ''} />
            <span>Recompile</span>
          </button>

          <div className="px-3 py-1.5 bg-[#141824] border border-stone-800 text-stone-300">
            Lesson {currentLessonIdx + 1} of {lessons.length}
          </div>
        </div>
      </div>

      {/* 2. MAIN TEACHING STUDIO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-stone-800">
        
        {/* LEFT COLUMN: INTERACTIVE VIDEO & SYNCHRONIZED VISUAL SCREEN (7 cols) */}
        <div className="lg:col-span-7 bg-[#05070c] border-r border-stone-800 flex flex-col justify-between">
          
          {/* VIDEO CANVAS / VISUAL TEACHING SCREEN */}
          <div className="relative aspect-video w-full bg-gradient-to-br from-[#060810] via-[#090d1a] to-[#04060a] p-5 sm:p-6 flex flex-col justify-between overflow-hidden border-b border-stone-800">
            
            {/* Top Video Overlay Bar */}
            <div className="flex items-center justify-between z-10 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isSpeakingAloud ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-stone-300 font-bold uppercase tracking-wider">
                  {isSpeakingAloud ? 'AI PROFESSOR SPEAKING' : 'AI PROFESSOR PAUSED'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-900/60 text-blue-300 border border-blue-700/50 text-[10px] font-bold uppercase">
                  {currentLesson.difficultyLevel}
                </span>
                <span className="text-stone-400 text-[11px]">
                  {formatTime(currentTimeSec)} / {formatTime(totalDurationSec)}
                </span>
              </div>
            </div>

            {/* CENTRAL DYNAMIC VISUAL CONTENT (Changes with timestamp) */}
            <div className="my-auto py-2 z-10">
              {visualStage === 'intro' && (
                <div className="space-y-3 text-center max-w-xl mx-auto animate-fadeIn">
                  <div className="font-mono text-[11px] text-blue-400 font-bold uppercase tracking-widest">
                    CURRENT CONCEPT (00:00 - 03:00)
                  </div>
                  <h4 className="font-serif text-2xl sm:text-3xl font-black text-white leading-tight">
                    {currentLesson.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-300 italic font-serif leading-relaxed px-4">
                    &ldquo;{currentLesson.introduction}&rdquo;
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    {currentLesson.learningObjectives.map((obj, i) => (
                      <span key={i} className="px-2.5 py-1 bg-stone-900/80 border border-stone-700 text-stone-300 text-[10px] font-mono">
                        ✓ {obj}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {visualStage === 'diagram' && (
                <div className="space-y-2 max-w-xl mx-auto animate-fadeIn">
                  <div className="flex items-center justify-between font-mono text-[10px] text-blue-400 font-bold uppercase">
                    <span>MEMORY ARCHITECTURE DIAGRAM (03:00 - 07:00)</span>
                    <span className="text-stone-400">HEAP vs STACK POINTERS</span>
                  </div>
                  <pre className="p-3.5 bg-black/90 border border-blue-900/60 rounded font-mono text-[11px] sm:text-xs text-cyan-300 overflow-x-auto leading-relaxed shadow-inner">
                    {currentLesson.diagramAscii || `Variable 'a' ---> [ PyObject: List | RefCnt=2 | Addr=0x7ff ] <--- Variable 'b'`}
                  </pre>
                  <p className="text-[11px] text-stone-400 italic text-center font-sans">
                    {currentLesson.visualDiagramDescription}
                  </p>
                </div>
              )}

              {visualStage === 'code' && (
                <div className="space-y-2 max-w-xl mx-auto animate-fadeIn">
                  <div className="flex items-center justify-between font-mono text-[10px] text-amber-400 font-bold uppercase">
                    <span>LIVE EXECUTING SCRIPT (07:00 - 12:00)</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Activity size={11} className="animate-pulse" />
                      <span>AST RUNTIME</span>
                    </span>
                  </div>
                  <pre className="p-3.5 bg-black/95 border border-amber-900/50 rounded font-mono text-[11px] sm:text-xs text-amber-200 overflow-x-auto leading-relaxed">
                    {currentLesson.codeSnippet}
                  </pre>
                </div>
              )}

              {visualStage === 'terminal' && (
                <div className="space-y-2 max-w-xl mx-auto animate-fadeIn">
                  <div className="flex items-center justify-between font-mono text-[10px] text-emerald-400 font-bold uppercase">
                    <span>RUNTIME TERMINAL STDOUT (12:00 - 15:00)</span>
                    <span className="text-stone-400">Python 3.11 CPython</span>
                  </div>
                  <pre className="p-3.5 bg-black border border-emerald-900/50 rounded font-mono text-[11px] sm:text-xs text-emerald-300 overflow-x-auto">
                    {currentLesson.terminalOutput || `$ python3 -m dis script.py\n  1           0 LOAD_CONST               0 (10)\n              2 STORE_FAST               0 (x)`}
                  </pre>
                </div>
              )}

              {visualStage === 'summary' && (
                <div className="space-y-3 text-center max-w-xl mx-auto animate-fadeIn">
                  <div className="font-mono text-[11px] text-purple-400 font-bold uppercase tracking-widest">
                    LESSON SUMMARY & COGNITIVE SYNCHRONIZATION
                  </div>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-white">
                    Mastery Milestone Achieved
                  </h4>
                  <p className="text-xs text-stone-300 leading-relaxed px-4">
                    {currentLesson.summary}
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={onOpenTeachBack}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-2"
                    >
                      <Sparkles size={13} />
                      <span>Feynman Teach-Back Verification</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Floating Live Waveform & Teacher Indicator */}
            <div className="z-10 flex items-center justify-between pt-2 border-t border-stone-800/80 font-mono text-[11px] text-stone-400">
              <div className="flex items-center gap-2">
                <span className="text-stone-300">Dr. Ada Vance (Socratic AI)</span>
                {isSpeakingAloud && (
                  <span className="flex items-center gap-0.5 text-blue-400">
                    <span className="w-1 h-3 bg-blue-400 animate-pulse" />
                    <span className="w-1 h-4 bg-blue-400 animate-pulse delay-75" />
                    <span className="w-1 h-2 bg-blue-400 animate-pulse delay-150" />
                    <span className="w-1 h-4 bg-blue-400 animate-pulse delay-100" />
                  </span>
                )}
              </div>
              <div className="text-stone-500 text-[10px]">
                Speed: {playbackSpeed}x • Volume: {isMuted ? 'Muted' : `${Math.round(volume * 100)}%`}
              </div>
            </div>
          </div>

          {/* PLAYBACK SCRUBBER & AUDIO CONTROLS */}
          <div className="p-4 bg-[#07090f] space-y-3">
            {/* Progress Bar (Clickable Seek) */}
            <div
              className="relative w-full h-2.5 bg-stone-800 hover:h-3.5 transition-all cursor-pointer rounded-full overflow-hidden"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const pct = clickX / rect.width;
                const newTime = pct * totalDurationSec;
                setCurrentTimeSec(newTime);
                if (isPlaying) {
                  speakText(getCurrentSectionScript(), selectedLanguage);
                }
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-150"
                style={{ width: `${(currentTimeSec / totalDurationSec) * 100}%` }}
              />
            </div>

            {/* Transport Control Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center transition-all shadow-md active:scale-95"
                  title={isPlaying ? 'Pause Video & Audio' : 'Play Video & Audible AI Voice'}
                >
                  {isPlaying ? <Pause size={18} className="fill-white" /> : <Play size={18} className="fill-white ml-0.5" />}
                </button>

                <button
                  onClick={() => {
                    setCurrentTimeSec(0);
                    if (isPlaying) speakText(getCurrentSectionScript(), selectedLanguage);
                  }}
                  className="p-2 text-stone-400 hover:text-white transition-colors"
                  title="Restart Lesson"
                >
                  <RotateCcw size={16} />
                </button>

                {/* Volume Toggle */}
                <button
                  onClick={() => {
                    const next = !isMuted;
                    setIsMuted(next);
                    if (next) stopSpeech();
                    else if (isPlaying) speakText(getCurrentSectionScript(), selectedLanguage);
                  }}
                  className="p-2 text-stone-400 hover:text-white transition-colors"
                  title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isMuted ? <VolumeX size={16} className="text-red-400" /> : <Volume2 size={16} />}
                </button>

                {/* Timestamp */}
                <span className="text-stone-300 font-bold ml-1">
                  {formatTime(currentTimeSec)} <span className="text-stone-500">/</span> {formatTime(totalDurationSec)}
                </span>
              </div>

              {/* Speed Buttons */}
              <div className="flex items-center gap-1 bg-[#141824] border border-stone-800 p-0.5">
                {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => {
                      setPlaybackSpeed(spd);
                      if (isPlaying) speakText(getCurrentSectionScript(), selectedLanguage);
                    }}
                    className={`px-2 py-1 text-[10px] font-bold uppercase transition-colors ${
                      playbackSpeed === spd
                        ? 'bg-blue-700 text-white'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 9 PEDAGOGY DIRECTIVES TOOLBAR */}
          <div className="p-4 bg-[#090b12] border-t border-stone-800 space-y-2">
            <div className="font-mono text-[10px] text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Zap size={11} />
              <span>AI PEDAGOGY DIRECTIVES (INTERRUPT & DRILL IN REAL-TIME):</span>
            </div>

            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              <button
                onClick={() => handleSendDoubt("Can you break down the core intuition of this concept?")}
                className="px-2.5 py-1.5 bg-[#141824] hover:bg-blue-900/60 border border-blue-800/60 text-blue-300 font-bold transition-all"
              >
                [ ASK AI ]
              </button>

              <button
                onClick={handleExplainAgain}
                className="px-2.5 py-1.5 bg-[#141824] hover:bg-purple-900/60 border border-purple-800/60 text-purple-300 font-bold transition-all"
              >
                [ EXPLAIN AGAIN ]
              </button>

              <button
                onClick={handleSimplify}
                className="px-2.5 py-1.5 bg-[#141824] hover:bg-emerald-900/60 border border-emerald-800/60 text-emerald-300 font-bold transition-all"
              >
                [ SIMPLIFY ]
              </button>

              <button
                onClick={handleGoDeeper}
                className="px-2.5 py-1.5 bg-[#141824] hover:bg-indigo-900/60 border border-indigo-800/60 text-indigo-300 font-bold transition-all"
              >
                [ GO DEEPER ]
              </button>

              <button
                onClick={handleGiveExample}
                className="px-2.5 py-1.5 bg-[#141824] hover:bg-amber-900/60 border border-amber-800/60 text-amber-300 font-bold transition-all"
              >
                [ GIVE EXAMPLE ]
              </button>

              <button
                onClick={handleShowCode}
                className="px-2.5 py-1.5 bg-[#141824] hover:bg-cyan-900/60 border border-cyan-800/60 text-cyan-300 font-bold transition-all"
              >
                [ SHOW CODE ]
              </button>

              <button
                onClick={handleWhy}
                className="px-2.5 py-1.5 bg-[#141824] hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 font-bold transition-all"
              >
                [ WHY? ]
              </button>

              <button
                onClick={handleQuizMe}
                className="px-2.5 py-1.5 bg-[#141824] hover:bg-emerald-900/60 border border-emerald-800/60 text-emerald-300 font-bold transition-all"
              >
                [ QUIZ ME ]
              </button>

              <button
                onClick={onOpenTeachBack}
                className="px-2.5 py-1.5 bg-blue-700 hover:bg-blue-600 text-white font-bold transition-all"
              >
                [ TEACH IT BACK ]
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE TABS & AI PROFESSOR CHAT (5 cols) */}
        <div className="lg:col-span-5 bg-[#0a0d15] flex flex-col justify-between h-full">
          
          {/* Top Tabs */}
          <div className="flex border-b border-stone-800 font-mono text-xs font-bold uppercase">
            <button
              onClick={() => setActiveTab('studio')}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                activeTab === 'studio'
                  ? 'border-blue-500 text-white bg-[#0e121e]'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              AI Professor Chat
            </button>
            <button
              onClick={() => setActiveTab('transcript')}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                activeTab === 'transcript'
                  ? 'border-blue-500 text-white bg-[#0e121e]'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              Transcript
            </button>
            <button
              onClick={() => setActiveTab('diagram')}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                activeTab === 'diagram'
                  ? 'border-blue-500 text-white bg-[#0e121e]'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              Diagram
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                activeTab === 'code'
                  ? 'border-blue-500 text-white bg-[#0e121e]'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              Code
            </button>
          </div>

          {/* TAB CONTENT AREA */}
          <div className="p-4 overflow-y-auto max-h-[460px] space-y-4 flex-1">
            {/* Tab 1: AI Chat & Doubt Resolution */}
            {activeTab === 'studio' && (
              <div className="space-y-3">
                {aiChatHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 space-y-1.5 text-xs ${
                      item.sender === 'ai'
                        ? 'bg-[#121624] border border-blue-900/50 text-stone-200'
                        : 'bg-[#181a24] border border-stone-700 text-white ml-6'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="font-bold text-blue-400">
                        {item.sender === 'ai' ? '🤖 AI PROFESSOR (DR. ADA)' : '👤 YOU (LEARNER)'}
                      </span>
                      {item.timestamp && <span className="text-stone-500">{item.timestamp}</span>}
                      {item.strategy && (
                        <span className="text-purple-400 font-bold">[{item.strategy}]</span>
                      )}
                    </div>
                    <div className="leading-relaxed whitespace-pre-line">{item.text}</div>
                  </div>
                ))}
                {isAiResponding && (
                  <div className="p-3 bg-[#121624] border border-blue-900/50 text-xs text-blue-300 font-mono animate-pulse">
                    AI Professor analyzing timestamp and synthesizing response...
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Synchronized Transcript */}
            {activeTab === 'transcript' && (
              <div className="space-y-3 text-xs font-sans">
                <div
                  onClick={() => {
                    setCurrentTimeSec(0);
                    if (isPlaying) speakText(getCurrentSectionScript(), selectedLanguage);
                  }}
                  className="p-3 bg-[#121624] border border-stone-800 hover:border-blue-600 cursor-pointer transition-colors space-y-1"
                >
                  <div className="font-mono text-[10px] text-blue-400 font-bold">00:00 • Introduction</div>
                  <p className="text-stone-300 leading-relaxed">{currentLesson.introduction}</p>
                </div>

                <div
                  onClick={() => {
                    setCurrentTimeSec(180);
                    if (isPlaying) speakText(currentLesson.conceptExplanation, selectedLanguage);
                  }}
                  className="p-3 bg-[#121624] border border-stone-800 hover:border-blue-600 cursor-pointer transition-colors space-y-1"
                >
                  <div className="font-mono text-[10px] text-blue-400 font-bold">03:00 • Architecture & Concepts</div>
                  <p className="text-stone-300 leading-relaxed">{currentLesson.conceptExplanation}</p>
                </div>

                <div
                  onClick={() => {
                    setCurrentTimeSec(420);
                    if (isPlaying) speakText(currentLesson.realWorldAnalogy, selectedLanguage);
                  }}
                  className="p-3 bg-[#121624] border border-stone-800 hover:border-blue-600 cursor-pointer transition-colors space-y-1"
                >
                  <div className="font-mono text-[10px] text-blue-400 font-bold">07:00 • Intuitive Analogy</div>
                  <p className="text-stone-300 leading-relaxed">{currentLesson.realWorldAnalogy}</p>
                </div>
              </div>
            )}

            {/* Tab 3: Diagram */}
            {activeTab === 'diagram' && (
              <div className="space-y-3">
                <div className="font-mono text-[11px] text-blue-400 font-bold uppercase">
                  ASCII Architecture Memory Layout
                </div>
                <pre className="p-3 bg-black border border-stone-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
                  {currentLesson.diagramAscii}
                </pre>
                <p className="text-xs text-stone-400 leading-relaxed font-sans">
                  {currentLesson.visualDiagramDescription}
                </p>
              </div>
            )}

            {/* Tab 4: Code & Terminal */}
            {activeTab === 'code' && (
              <div className="space-y-3">
                <div className="font-mono text-[11px] text-amber-400 font-bold uppercase">
                  Python Code Demonstration
                </div>
                <pre className="p-3 bg-black border border-stone-800 font-mono text-xs text-amber-200 overflow-x-auto leading-relaxed">
                  {currentLesson.codeSnippet}
                </pre>
                <div className="font-mono text-[11px] text-emerald-400 font-bold uppercase">
                  Terminal Execution Output
                </div>
                <pre className="p-3 bg-black border border-stone-800 font-mono text-xs text-emerald-300 overflow-x-auto">
                  {currentLesson.terminalOutput}
                </pre>
              </div>
            )}
          </div>

          {/* Contextual Doubt Input Box */}
          <div className="p-3 bg-[#07090f] border-t border-stone-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendDoubt();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={doubtInput}
                onChange={(e) => setDoubtInput(e.target.value)}
                placeholder="Ask doubt about this concept/timestamp..."
                className="flex-1 bg-[#141824] border border-stone-700 px-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-blue-500 font-sans"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase flex items-center gap-1.5 transition-colors"
              >
                <span>ASK</span>
                <Send size={12} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 3. CHAPTER NAVIGATION BAR */}
      <div className="p-4 bg-[#090b12] flex flex-wrap items-center justify-between gap-4 font-mono text-xs border-t border-stone-800">
        <div className="flex items-center gap-2 text-stone-400">
          <BookOpen size={14} className="text-blue-400" />
          <span>LESSON CHAPTERS:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {lessons.map((lsn, idx) => (
            <button
              key={lsn.id}
              onClick={() => setCurrentLessonIdx(idx)}
              className={`px-3 py-1.5 border transition-all text-[11px] ${
                currentLessonIdx === idx
                  ? 'bg-blue-700 text-white border-blue-500 font-bold shadow-sm'
                  : 'bg-[#141824] text-stone-400 border-stone-800 hover:text-stone-200'
              }`}
            >
              0{idx + 1} • {lsn.title.length > 22 ? lsn.title.slice(0, 22) + '...' : lsn.title}
            </button>
          ))}
        </div>
      </div>

      {/* 4. INTERACTIVE CHECKPOINT MODAL OVERLAY (Pauses video at critical concept) */}
      {activeCheckpoint && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e111a] border-2 border-amber-500 text-stone-100 max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fadeIn font-sans">
            <div className="flex items-center gap-2 font-mono text-xs text-amber-400 font-bold uppercase tracking-wider">
              <Zap size={14} />
              <span>INTERACTIVE CHECKPOINT PAUSE ({formatTime(currentTimeSec)})</span>
            </div>

            <h3 className="font-serif text-xl font-bold text-white leading-snug">
              {activeCheckpoint.question}
            </h3>

            <div className="space-y-2 font-mono text-xs">
              {activeCheckpoint.options.map((opt: string, idx: number) => (
                <button
                  key={idx}
                  disabled={checkpointSubmitted}
                  onClick={() => setCheckpointAnswer(idx)}
                  className={`w-full p-3 text-left border transition-all ${
                    checkpointAnswer === idx
                      ? 'bg-blue-900/60 border-blue-400 text-white font-bold'
                      : 'bg-[#141824] border-stone-800 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <span className="text-blue-400 font-bold mr-2">[{String.fromCharCode(65 + idx)}]</span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>

            {checkpointSubmitted && (
              <div
                className={`p-3 text-xs border font-mono ${
                  checkpointAnswer === activeCheckpoint.correctIndex
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-500 text-rose-300'
                }`}
              >
                <div className="font-bold uppercase">
                  {checkpointAnswer === activeCheckpoint.correctIndex ? '✓ Correct Answer!' : '✗ Concept Misconception Detected'}
                </div>
                <p className="mt-1 font-sans text-stone-200">{activeCheckpoint.explanation}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              {!checkpointSubmitted ? (
                <button
                  disabled={checkpointAnswer === null}
                  onClick={handleCheckpointSubmit}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-mono text-xs font-bold uppercase tracking-wider"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleContinueAfterCheckpoint}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <span>Continue Video</span>
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. MULTI-STAGE RECOMPILATION MODAL */}
      {isCompilingLesson && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
          <div className="bg-[#090b12] border-2 border-blue-500 p-6 max-w-md w-full space-y-5 shadow-2xl text-stone-100">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
              <RefreshCw size={14} className="animate-spin text-blue-400" />
              <span>AI TEACHER COMPILING LESSON</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-stone-300">{compilationStage}</span>
                <span className="font-bold text-blue-400">{compilationProgress}%</span>
              </div>
              <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${compilationProgress}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] text-stone-400">
              <div className={compilationProgress >= 25 ? 'text-emerald-400' : ''}>✓ Understanding curriculum goals</div>
              <div className={compilationProgress >= 50 ? 'text-emerald-400' : ''}>✓ Generating natural voice waveforms (TTS)</div>
              <div className={compilationProgress >= 75 ? 'text-emerald-400' : ''}>✓ Rendering syntax-highlighted code frames</div>
              <div className={compilationProgress >= 90 ? 'text-emerald-400' : ''}>✓ Packaging interactive checkpoints</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
