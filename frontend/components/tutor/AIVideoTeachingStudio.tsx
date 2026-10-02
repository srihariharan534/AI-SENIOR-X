'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  FastForward,
  Subtitles,
  Maximize2,
  Sparkles,
  Brain,
  GraduationCap,
  Code2,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  BookOpen,
  Zap,
  ArrowRight,
  Layers,
  Terminal,
  Cpu,
  RefreshCw,
  Send,
  User,
  Radio,
  ChevronRight,
  Settings2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import api from '@/lib/api';

export interface VideoChapter {
  id: string;
  title: string;
  durationSec: number;
  type: 'concept' | 'code' | 'architecture' | 'quiz' | 'real_world';
  voiceScript: string;
  slideHeading: string;
  slideSubheading: string;
  bulletPoints?: string[];
  codeSnippet?: string;
  codeLanguage?: string;
  terminalOutput?: string;
  diagramElements?: { label: string; sub: string; color: string }[];
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface VideoCourseLecture {
  id: string;
  title: string;
  track: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  teacherName: string;
  teacherTitle: string;
  teacherAvatarBg: string;
  description: string;
  chapters: VideoChapter[];
}

const DEFAULT_LECTURES: VideoCourseLecture[] = [
  {
    id: 'python-foundations-video',
    title: 'Python Memory Model & Execution Engine',
    track: 'Python Foundations',
    level: 'Beginner',
    teacherName: 'Dr. Ada Vance',
    teacherTitle: 'Lead AI Systems Architect',
    teacherAvatarBg: 'from-blue-600 to-indigo-600',
    description: 'Master how Python objects, pointers, references, and memory allocation work under the hood in CPython.',
    chapters: [
      {
        id: 'ch-1',
        title: '1. Mental Model: Variables are Pointers',
        durationSec: 16,
        type: 'concept',
        slideHeading: 'Variables Do Not Store Values — They Point to Objects',
        slideSubheading: 'In Python, everything is an object living on the private heap. Variables are just labeled name references.',
        voiceScript: 'Welcome to this AI-SENIOR-X video masterclass. In Python, variables are not boxes that hold values. Rather, variables are lightweight names that point to objects allocated on the heap. When you assign x equals [1, 2, 3], you are binding the name x to a list object in memory.',
        bulletPoints: [
          'All values (integers, strings, functions, classes) are distinct heap-allocated objects.',
          'Variables are pointer tags binding a human symbol to a memory address.',
          'Multiple variables can point to the exact same mutable object simultaneously.',
        ],
        diagramElements: [
          { label: 'Variable: x', sub: 'Namespace Pointer', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' },
          { label: 'Heap Address: 0x7FFF9', sub: 'PyObject (type: list, refcount: 2)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
          { label: 'Variable: y', sub: 'Aliased Reference', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
        ],
      },
      {
        id: 'ch-2',
        title: '2. Live Code: Object Mutation vs Rebinding',
        durationSec: 20,
        type: 'code',
        slideHeading: 'Step-by-Step Code Execution & Aliasing',
        slideSubheading: 'Watch how mutating list a through pointer b modifies the shared memory block.',
        voiceScript: 'Let us observe live execution. When we assign b equals a, we copy the memory reference, not the underlying array. Mutating b directly affects a. But when we reassign b to a new list, b points to a brand new object address.',
        codeLanguage: 'python',
        codeSnippet: `# 1. Create list and alias reference
a = [10, 20, 30]
b = a

# 2. In-place mutation modifies shared heap object
b.append(99)
print(f"a after b.append: {a}")  # Output: [10, 20, 30, 99]

# 3. Rebinding creates new object pointer
b = [1, 2]
print(f"a after rebinding b: {a}")  # a remains [10, 20, 30, 99]
print(f"b is a: {b is a}")          # False`,
        terminalOutput: `>>> a = [10, 20, 30]
>>> b = a
>>> b.append(99)
>>> a
[10, 20, 30, 99]
>>> b is a
True
>>> b = [1, 2]
>>> b is a
False`,
      },
      {
        id: 'ch-3',
        title: '3. Architecture: Reference Counting & Garbage Collection',
        durationSec: 18,
        type: 'architecture',
        slideHeading: 'CPython Garbage Collection & PyObject Header',
        slideSubheading: 'How Python automatically frees memory when reference counters drop to zero.',
        voiceScript: 'Every Python object has a standard header containing its type descriptor and an ob_refcnt integer. When a variable goes out of scope or is reassigned, its refcount decrements. The moment it hits zero, CPython immediately deallocates the memory via free(). Cyclic garbage collection handles isolated reference loops.',
        bulletPoints: [
          'ob_refcnt tracks active references across all local and global frames.',
          'Immediate deterministic deallocation when ob_refcnt == 0.',
          'Generational GC (Gen 0, 1, 2) breaks cyclical references (e.g. self-referencing nodes).',
        ],
        diagramElements: [
          { label: '1. Allocation', sub: 'PyObject_New() on Heap', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
          { label: '2. ob_refcnt = 1', sub: 'x = MyClass()', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' },
          { label: '3. ob_refcnt = 0', sub: 'del x or scope exit', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
          { label: '4. PyObject_Free()', sub: 'Immediate Memory Return', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
        ],
      },
      {
        id: 'ch-4',
        title: '4. Interactive Checkpoint: Test Your Mental Model',
        durationSec: 25,
        type: 'quiz',
        slideHeading: 'Checkpoint: What is the Output?',
        slideSubheading: 'Evaluate the code snippet carefully. The video pauses until you verify your reasoning.',
        voiceScript: 'Pause and test your mental model. If x is [1, 2], and y equals x, followed by x plus equals [3], what is the value of y?',
        quiz: {
          question: 'Given:\nx = [1, 2]\ny = x\nx += [3]\nWhat is the value of y?',
          options: [
            'A) [1, 2]',
            'B) [1, 2, 3] (because += invokes list.extend in-place on the same object)',
            'C) [3]',
            'D) TypeError: cannot mutate list',
          ],
          correctIndex: 1,
          explanation: 'In Python, the += operator on lists translates to __iadd__, which calls extend() in-place without changing the memory reference. Therefore, both x and y reflect the appended item [1, 2, 3]!',
        },
      },
      {
        id: 'ch-5',
        title: '5. Production Rule: Mutable Default Arguments Gotcha',
        durationSec: 18,
        type: 'real_world',
        slideHeading: 'Production Gotcha: Never Use def func(items=[])',
        slideSubheading: 'Function default arguments are evaluated only once at definition time, not at invocation.',
        voiceScript: 'Here is a classic production bug that causes data leaks across user requests. In Python, default parameter objects are evaluated when the function is defined. If you use a mutable list as a default argument, every call shares the identical list object across requests. Always use None as the sentinel default value.',
        bulletPoints: [
          'Anti-Pattern: def add_item(item, bucket=[]): bucket.append(item) -> SHARED STATE LEAK!',
          'Best Practice: def add_item(item, bucket=None): if bucket is None: bucket = []',
          'Enforced in production CI/CD linters via Flake8 rule B006 / Ruff.',
        ],
        diagramElements: [
          { label: 'Function Object', sub: '__defaults__ = ([],)', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
          { label: 'Request 1 (User A)', sub: 'bucket.append("A")', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
          { label: 'Request 2 (User B)', sub: 'Receives User A data!', color: 'bg-red-500/20 text-red-300 border-red-500/40' },
        ],
      },
    ],
  },
  {
    id: 'ml-gradient-descent-video',
    title: 'Gradient Descent & Optimization Dynamics',
    track: 'Machine Learning',
    level: 'Intermediate',
    teacherName: 'Prof. Alex Chen',
    teacherTitle: 'Senior Deep Learning Research Fellow',
    teacherAvatarBg: 'from-purple-600 to-pink-600',
    description: 'Visual intuition of loss surfaces, gradient vectors, learning rates, momentum, and Adam optimization.',
    chapters: [
      {
        id: 'ml-ch-1',
        title: '1. Intuition: Mountain in the Fog',
        durationSec: 16,
        type: 'concept',
        slideHeading: 'The Foggy Mountain Analogy',
        slideSubheading: 'How neural networks find the lowest point of error across millions of dimensional surfaces.',
        voiceScript: 'Imagine standing blindfolded on a foggy mountain peak trying to find the valley below. You cannot see the landscape, but with each step, your feet feel the slope under you. Moving in the steepest downward direction takes you closer to the optimal model weights.',
        bulletPoints: [
          'Loss Function J(W) represents your elevation on the error landscape.',
          'Gradient ∇J is the direction of steepest upward climb.',
          'Negative Gradient -∇J is the fastest route down to minimal error.',
        ],
        diagramElements: [
          { label: 'High Loss Elevation', sub: 'Untrained Weights W_0', color: 'bg-red-500/20 text-red-300 border-red-500/40' },
          { label: 'Descent Vector -α∇J', sub: 'Learning Rate Step', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
          { label: 'Optimal Valley', sub: 'Converged Weights W*', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
        ],
      },
      {
        id: 'ml-ch-2',
        title: '2. Live Code: Vectorized Gradient Update Loop',
        durationSec: 20,
        type: 'code',
        slideHeading: 'NumPy Vectorized Implementation',
        slideSubheading: 'Real-time computation of gradients and parameter updates on synthetic batches.',
        voiceScript: 'Here is the vectorized mathematical loop in pure NumPy. Notice how we compute predictions, calculate residuals, and update weight matrices in a single tensor operation without slow Python loops.',
        codeLanguage: 'python',
        codeSnippet: `import numpy as np

def gradient_descent(X, y, lr=0.01, epochs=1000):
    n_samples, n_features = X.shape
    weights = np.zeros(n_features)
    bias = 0.0

    for epoch in range(epochs):
        # 1. Forward Pass
        y_pred = np.dot(X, weights) + bias
        
        # 2. Compute Gradients
        dw = (1 / n_samples) * np.dot(X.T, (y_pred - y))
        db = (1 / n_samples) * np.sum(y_pred - y)
        
        # 3. Update Parameters
        weights -= lr * dw
        bias -= lr * db

    return weights, bias`,
        terminalOutput: `Epoch 100: Loss = 0.8412
Epoch 300: Loss = 0.3129
Epoch 600: Loss = 0.0841
Epoch 1000: Loss = 0.0012 -> Converged!`,
      },
      {
        id: 'ml-ch-3',
        title: '3. Interactive Checkpoint: Learning Rate Divergence',
        durationSec: 22,
        type: 'quiz',
        slideHeading: 'Comprehension Test: Learning Rate Tuning',
        slideSubheading: 'Predict what happens when the learning rate step is set too large.',
        voiceScript: 'Let us test your optimization intuition. If your learning rate alpha is set to 10.0 instead of 0.01 on a convex quadratic bowl, what behavior will you observe?',
        quiz: {
          question: 'What happens when learning rate α is set excessively high?',
          options: [
            'A) The model converges 100x faster to global minimum',
            'B) The weights oscillate wildly and explode to infinity (divergence)',
            'C) The weights remain completely stationary at 0',
            'D) The gradients automatically rescale themselves',
          ],
          correctIndex: 1,
          explanation: 'An overly large learning rate causes the updates to overshoot the valley entirely, landing on even steeper walls of the loss bowl and catapulting parameter weights into numerical overflow (NaN / Inf).',
        },
      },
    ],
  },
];

export const AIVideoTeachingStudio: React.FC<{ initialTopic?: string }> = ({
  initialTopic = 'Python Foundations',
}) => {
  const [selectedLecture, setSelectedLecture] = useState<VideoCourseLecture>(DEFAULT_LECTURES[0]);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [speakingActive, setSpeakingActive] = useState<boolean>(false);
  const [progressSec, setProgressSec] = useState<number>(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [interruptedDoubt, setInterruptedDoubt] = useState<string | null>(null);
  const [aiInterruptionAnswer, setAiInterruptionAnswer] = useState<string | null>(null);
  const [teachingMode, setTeachingMode] = useState<string>('standard');
  const [explanationDepth, setExplanationDepth] = useState<number>(2);
  const [teachingLanguage, setTeachingLanguage] = useState<string>('en');
  const [showTeachBackModal, setShowTeachBackModal] = useState<boolean>(false);
  const [teachBackText, setTeachBackText] = useState<string>('');
  const [teachBackResult, setTeachBackResult] = useState<any>(null);
  const [evaluatingTeachBack, setEvaluatingTeachBack] = useState<boolean>(false);
  const [isGeneratingLesson, setIsGeneratingLesson] = useState<boolean>(false);
  const [customTopicInput, setCustomTopicInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'lecture' | 'custom_generator' | 'catalog'>('lecture');

  const currentChapter = selectedLecture.chapters[activeChapterIndex] || selectedLecture.chapters[0];
  const totalChapters = selectedLecture.chapters.length;

  // Web Speech API Voice Synthesis Ref
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Load University Course dynamically if topic provided
  useEffect(() => {
    const loadCourseLecture = async () => {
      if (!initialTopic) return;
      try {
        const res = await api.getUniversityCourse(initialTopic.toLowerCase());
        if (res && res.data && res.data.modules && res.data.modules.length > 0) {
          const c = res.data;
          const chaptersList: VideoChapter[] = [];

          c.modules.forEach((mod: any) => {
            mod.chapters?.forEach((ch: any) => {
              ch.lessons?.forEach((les: any) => {
                chaptersList.push({
                  id: les.id,
                  title: les.title,
                  durationSec: les.video_duration_seconds || 18,
                  type: les.code_snippet ? 'code' : 'concept',
                  voiceScript: les.voice_script || les.concept_explanation,
                  slideHeading: les.title,
                  slideSubheading: les.introduction,
                  bulletPoints: les.learning_objectives,
                  codeSnippet: les.code_snippet,
                  codeLanguage: les.code_language || 'python',
                  terminalOutput: les.terminal_output,
                  diagramElements: les.diagram_elements,
                  quiz: les.knowledge_check
                    ? {
                        question: les.knowledge_check.question,
                        options: les.knowledge_check.options,
                        correctIndex: les.knowledge_check.correct_index,
                        explanation: les.knowledge_check.explanation,
                      }
                    : undefined,
                });
              });
            });
          });

          if (chaptersList.length > 0) {
            const courseLecture: VideoCourseLecture = {
              id: c.id,
              title: c.course_title,
              track: c.subject_name,
              level: 'Beginner',
              teacherName: 'Dr. Ada Vance',
              teacherTitle: 'Lead AI Systems Architect',
              teacherAvatarBg: 'from-blue-600 to-indigo-600',
              description: c.overview,
              chapters: chaptersList,
            };
            setSelectedLecture(courseLecture);
            setActiveChapterIndex(0);
            setProgressSec(0);
          }
        }
      } catch (e) {
        console.warn('Using default video lecture catalog:', e);
      }
    };

    loadCourseLecture();
  }, [initialTopic]);

  // Voice playback management
  const speakCurrentScript = (text: string) => {
    if (!synthRef.current || isMuted) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = playbackSpeed;
    utterance.pitch = 1.0;

    // Pick best available English voice
    const voices = synthRef.current.getVoices();
    const naturalVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural') || v.name.includes('Samantha') || v.name.includes('David'))
    );
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onstart = () => setSpeakingActive(true);
    utterance.onend = () => {
      setSpeakingActive(false);
      // If reached end of chapter script and playing, handle transition
    };
    utterance.onerror = () => setSpeakingActive(false);

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setSpeakingActive(false);
  };

  // Timer loop for video progression
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isPlaying) {
      if (!speakingActive && !isMuted) {
        speakCurrentScript(currentChapter.voiceScript);
      }

      timer = setInterval(() => {
        setProgressSec((prev) => {
          const next = prev + 1;
          if (next >= currentChapter.durationSec) {
            // Check if this chapter is a quiz: pause for learner
            if (currentChapter.type === 'quiz' && !quizSubmitted) {
              setIsPlaying(false);
              stopSpeaking();
              return currentChapter.durationSec;
            }

            // Move to next chapter if available
            if (activeChapterIndex < totalChapters - 1) {
              setActiveChapterIndex((idx) => idx + 1);
              return 0;
            } else {
              setIsPlaying(false);
              stopSpeaking();
              return currentChapter.durationSec;
            }
          }
          return next;
        });
      }, 1000 / playbackSpeed);
    } else {
      stopSpeaking();
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, activeChapterIndex, playbackSpeed, isMuted, quizSubmitted]);

  // Handle Chapter Switch
  const handleSelectChapter = (idx: number) => {
    stopSpeaking();
    setActiveChapterIndex(idx);
    setProgressSec(0);
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
    setInterruptedDoubt(null);
    setAiInterruptionAnswer(null);
    if (isPlaying) {
      setTimeout(() => {
        speakCurrentScript(selectedLecture.chapters[idx].voiceScript);
      }, 200);
    }
  };

  // Play / Pause Toggle
  const togglePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      speakCurrentScript(currentChapter.voiceScript);
    } else {
      setIsPlaying(false);
      stopSpeaking();
    }
  };

  // Speed change
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (isPlaying) {
      stopSpeaking();
      setTimeout(() => speakCurrentScript(currentChapter.voiceScript), 150);
    }
  };

  // Learner Interruption Question
  const handleAskDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;

    setIsPlaying(false);
    stopSpeaking();
    setInterruptedDoubt(userQuestion);

    // AI Teacher synthesizes real-time response
    const aiAnswer = `Regarding "${userQuestion}": In ${selectedLecture.track}, this relates directly to how state is maintained during ${currentChapter.title}. The compiler/runtime prioritizes memory safety and reference integrity. Let's resume the lecture to see this in the next demonstration.`;
    setAiInterruptionAnswer(aiAnswer);
    setUserQuestion('');

    speakCurrentScript(aiAnswer);
  };

  // Generate Custom Topic AI Video Lecture
  const handleGenerateCustomLecture = () => {
    if (!customTopicInput.trim()) return;
    setIsGeneratingLesson(true);

    setTimeout(() => {
      const newLecture: VideoCourseLecture = {
        id: `custom-${Date.now()}`,
        title: customTopicInput,
        track: 'Custom Synthesis',
        level: 'Intermediate',
        teacherName: 'Dr. Ada Vance',
        teacherTitle: 'AI-SENIOR-X Adaptive Neural Teacher',
        teacherAvatarBg: 'from-cyan-600 to-blue-600',
        description: `Custom synthesized AI interactive video lecture covering ${customTopicInput}.`,
        chapters: [
          {
            id: 'c-ch-1',
            title: `1. Core Foundations of ${customTopicInput}`,
            durationSec: 16,
            type: 'concept',
            slideHeading: `First Principles: ${customTopicInput}`,
            slideSubheading: 'Understanding the underlying mental model and systemic necessity.',
            voiceScript: `Welcome to your custom video lecture on ${customTopicInput}. We will break down this complex concept into concrete intuitive building blocks starting from first principles.`,
            bulletPoints: [
              `Fundamental architecture and execution lifecycle of ${customTopicInput}.`,
              'Key invariants and trade-offs compared to alternative design patterns.',
              'Critical failure modes and cognitive pitfalls in enterprise codebases.',
            ],
            diagramElements: [
              { label: 'Input State', sub: 'Initial Context', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' },
              { label: customTopicInput, sub: 'Core Engine Processing', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
              { label: 'Verified Output', sub: 'Deterministic State', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
            ],
          },
          {
            id: 'c-ch-2',
            title: '2. Live Code & Practical Demonstration',
            durationSec: 18,
            type: 'code',
            slideHeading: 'Production Implementation Pattern',
            slideSubheading: 'Clean, idiomatic code implementing the core mechanics.',
            voiceScript: `Let us examine how ${customTopicInput} is structured in clean Python code. Notice the clean separation of concerns and robust error handling.`,
            codeLanguage: 'python',
            codeSnippet: `# Implementation pattern for: ${customTopicInput}
class ${customTopicInput.replace(/[^a-zA-Z0-9]/g, '')}Engine:
    def __init__(self, config: dict = None):
        self.config = config or {}
        self._is_active = True

    def execute_pipeline(self, payload: dict) -> dict:
        """Processes payload through adaptive execution pipeline."""
        if not self._is_active:
            raise RuntimeError("Engine is halted")
        return {"status": "SUCCESS", "result": payload}`,
            terminalOutput: `>>> engine = Engine()
>>> engine.execute_pipeline({"metric": 98.4})
{'status': 'SUCCESS', 'result': {'metric': 98.4}}`,
          },
          {
            id: 'c-ch-3',
            title: '3. Comprehension Mastery Checkpoint',
            durationSec: 20,
            type: 'quiz',
            slideHeading: 'Comprehension Checkpoint',
            slideSubheading: 'Verify your understanding before continuing.',
            voiceScript: `Let us verify your understanding of ${customTopicInput} with this quick active recall question.`,
            quiz: {
              question: `Which of the following is the primary advantage of ${customTopicInput}?`,
              options: [
                'A) Eliminates runtime execution memory to exactly zero bytes',
                'B) Provides structured, predictable state management with low latency',
                'C) Completely replaces all algorithms with a single static variable',
                'D) Bypasses operating system memory constraints entirely',
              ],
              correctIndex: 1,
              explanation: `Correct! ${customTopicInput} ensures reliable, deterministic state and scalable architecture in production environments.`,
            },
          },
        ],
      };

      setSelectedLecture(newLecture);
      setActiveChapterIndex(0);
      setProgressSec(0);
      setIsGeneratingLesson(false);
      setActiveTab('lecture');
      setIsPlaying(true);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Mode Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-600/30">
            <Radio size={22} className={isPlaying ? 'animate-pulse text-cyan-200' : ''} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-tight">
                AI Video Teaching Studio
              </h2>
              <Badge variant="cyan" size="sm">
                Interactive Voice &amp; Avatar
              </Badge>
              {speakingActive && (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  AI Speaking Live
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-sensory video instruction with step-by-step code animation, spoken narration, and live Socratic checkpoints.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('lecture')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'lecture'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Video Lecture
          </button>
          <button
            onClick={() => setActiveTab('custom_generator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'custom_generator'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles size={13} />
            Synthesize Any Topic
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'catalog'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Courses Catalog
          </button>
        </div>
      </div>

      {/* CUSTOM LECTURE GENERATOR MODAL/PANEL */}
      {activeTab === 'custom_generator' && (
        <Card className="border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-300">
              <Sparkles size={20} />
              Instant AI Video Lecture Synthesizer
            </CardTitle>
          </CardHeader>
          <div className="p-5 space-y-4">
            <p className="text-xs text-slate-300">
              Type any concept, algorithm, or architecture pattern. The AI will immediately construct an interactive 5-chapter video lecture with spoken narration, code demonstrations, diagrams, and comprehension checks.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={customTopicInput}
                onChange={(e) => setCustomTopicInput(e.target.value)}
                placeholder="e.g. Python GIL & Concurrency, Transformers Attention Mechanism, Dynamic Programming Knapsack..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
              <Button
                variant="primary"
                onClick={handleGenerateCustomLecture}
                disabled={isGeneratingLesson || !customTopicInput.trim()}
                className="bg-cyan-600 hover:bg-cyan-500 text-white shrink-0"
              >
                {isGeneratingLesson ? (
                  <>
                    <RefreshCw size={15} className="animate-spin mr-1.5" />
                    Synthesizing Video Lecture...
                  </>
                ) : (
                  <>
                    <Zap size={15} className="mr-1.5" />
                    Generate &amp; Teach Video
                  </>
                )}
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs text-slate-400">Popular topics:</span>
              {[
                'Python Decorators & Closures',
                'SQL B-Tree Indexing',
                'Transformer Self-Attention',
                'Asyncio Event Loop',
                'Dijkstra Shortest Path',
              ].map((sugg) => (
                <button
                  key={sugg}
                  onClick={() => setCustomTopicInput(sugg)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                >
                  {sugg}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* COURSE CATALOG SELECTION */}
      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEFAULT_LECTURES.map((lec) => (
            <div
              key={lec.id}
              onClick={() => {
                setSelectedLecture(lec);
                setActiveChapterIndex(0);
                setProgressSec(0);
                setActiveTab('lecture');
              }}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                selectedLecture.id === lec.id
                  ? 'bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <Badge variant="indigo" size="sm">{lec.track}</Badge>
                <span className="text-[11px] text-slate-400 font-mono">{lec.chapters.length} Chapters</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">{lec.title}</h3>
              <p className="text-xs text-slate-300 line-clamp-2 mb-3">{lec.description}</p>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                <div className={`w-5 h-5 rounded-full bg-gradient-to-tr ${lec.teacherAvatarBg} flex items-center justify-center text-[10px] text-white font-bold`}>
                  {lec.teacherName[0]}
                </div>
                <span>{lec.teacherName} • {lec.teacherTitle}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MAIN VIDEO STUDIO PLAYER CANVAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center: Interactive Video Stage (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
            {/* Top Bar inside Video Player */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-semibold text-slate-300 ml-2 truncate max-w-[280px] sm:max-w-md">
                  {selectedLecture.title} • {currentChapter.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="slate" size="sm" className="font-mono text-[10px]">
                  {progressSec}s / {currentChapter.durationSec}s
                </Badge>
              </div>
            </div>

            {/* Video Presentation Canvas */}
            <div className="min-h-[400px] p-6 flex flex-col justify-between relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
              {/* Background ambient lighting */}
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

              {/* Slide Content Header */}
              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                    Chapter {activeChapterIndex + 1}: {currentChapter.type.toUpperCase()}
                  </span>
                  {speakingActive && (
                    <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1 rounded-full border border-indigo-500/30">
                      <span className="text-[10px] text-indigo-300 font-mono">Audio Sync</span>
                      <div className="flex items-center gap-0.5">
                        <span className="w-1 h-3 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1 h-4 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1 h-2 bg-indigo-400 rounded-full animate-bounce" />
                      </div>
                    </div>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                  {currentChapter.slideHeading}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  {currentChapter.slideSubheading}
                </p>
              </div>

              {/* Dynamic Body based on Chapter Type */}
              <div className="relative z-10 my-5">
                {/* 1. Bullet Points / Concept */}
                {currentChapter.bulletPoints && (
                  <div className="space-y-2.5 bg-slate-900/60 p-4 rounded-xl border border-slate-800 backdrop-blur">
                    {currentChapter.bulletPoints.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. Diagram Elements Flow */}
                {currentChapter.diagramElements && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
                    {currentChapter.diagramElements.map((diag, dIdx) => (
                      <div
                        key={dIdx}
                        className={`p-3.5 rounded-xl border flex flex-col justify-center text-center transition-all ${diag.color}`}
                      >
                        <span className="text-xs font-bold leading-snug">{diag.label}</span>
                        <span className="text-[10px] opacity-80 mt-1">{diag.sub}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. Live Code Runner & Terminal */}
                {currentChapter.codeSnippet && (
                  <div className="space-y-2">
                    <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Code2 size={13} className="text-indigo-400" />
                          <span>{currentChapter.codeLanguage || 'python'} • live editor</span>
                        </div>
                        <span className="text-[10px] text-emerald-400">● Synced Execution</span>
                      </div>
                      <pre className="p-3.5 text-xs font-mono text-indigo-200 leading-relaxed overflow-x-auto">
                        {currentChapter.codeSnippet}
                      </pre>
                    </div>

                    {currentChapter.terminalOutput && (
                      <div className="rounded-xl overflow-hidden border border-slate-800/80 bg-black/80">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 text-[10px] text-slate-400 font-mono">
                          <Terminal size={12} className="text-emerald-400" />
                          <span>interactive output</span>
                        </div>
                        <pre className="p-3 text-[11px] font-mono text-emerald-400 leading-normal overflow-x-auto">
                          {currentChapter.terminalOutput}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. Interactive Comprehension Quiz */}
                {currentChapter.quiz && (
                  <div className="bg-slate-900/90 p-5 rounded-2xl border border-indigo-500/40 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                      <HelpCircle size={16} />
                      <span>Comprehension Checkpoint (Video Paused)</span>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {currentChapter.quiz.question}
                    </p>
                    <div className="space-y-2">
                      {currentChapter.quiz.options.map((opt, oIdx) => {
                        const isSelected = selectedQuizOption === oIdx;
                        const isCorrect = oIdx === currentChapter.quiz?.correctIndex;
                        let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-indigo-500';

                        if (quizSubmitted) {
                          if (isCorrect) {
                            btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300';
                          } else if (isSelected && !isCorrect) {
                            btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300';
                          }
                        } else if (isSelected) {
                          btnStyle = 'bg-indigo-950 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500';
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => {
                              if (!quizSubmitted) setSelectedQuizOption(oIdx);
                            }}
                            className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {!quizSubmitted ? (
                      <Button
                        variant="primary"
                        onClick={() => setQuizSubmitted(true)}
                        disabled={selectedQuizOption === null}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
                      >
                        Submit Answer &amp; Verify Understanding
                      </Button>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          {selectedQuizOption === currentChapter.quiz.correctIndex ? (
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 size={15} /> Correct reasoning!
                            </span>
                          ) : (
                            <span className="text-amber-400 font-bold">
                              Cognitive Calibration Note:
                            </span>
                          )}
                        </div>
                        <p className="text-slate-300 leading-relaxed">
                          {currentChapter.quiz.explanation}
                        </p>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            if (activeChapterIndex < totalChapters - 1) {
                              handleSelectChapter(activeChapterIndex + 1);
                              setIsPlaying(true);
                            }
                          }}
                          className="mt-2"
                        >
                          Continue Next Chapter <ArrowRight size={13} className="ml-1" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Subtitles / Closed Captions */}
              {showCaptions && (
                <div className="relative z-10 bg-black/80 border border-slate-800/80 p-3 rounded-xl backdrop-blur text-center">
                  <span className="text-xs text-amber-200/90 font-medium leading-relaxed tracking-wide">
                    &ldquo;{currentChapter.voiceScript}&rdquo;
                  </span>
                </div>
              )}
            </div>

            {/* Video Player Bottom Controls & Scrubber */}
            <div className="px-4 py-3 bg-slate-900 border-t border-slate-800 space-y-2.5">
              {/* Progress Bar / Scrubber */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden relative cursor-pointer">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      ((activeChapterIndex * 100 +
                        (progressSec / currentChapter.durationSec) * 100) /
                        totalChapters)
                    )}%`,
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-colors"
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5" />}
                  </button>

                  <button
                    onClick={() => {
                      setProgressSec(0);
                      speakCurrentScript(currentChapter.voiceScript);
                    }}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Replay Chapter"
                  >
                    <RotateCcw size={16} />
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-2 rounded-lg transition-colors ${
                      isMuted
                        ? 'text-rose-400 bg-rose-950/40'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title={isMuted ? 'Unmute AI Voice' : 'Mute Voice'}
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>

                  {/* Speed Selector */}
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-[11px] font-mono">
                    {[1, 1.25, 1.5].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        className={`px-2 py-0.5 rounded ${
                          playbackSpeed === speed
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCaptions(!showCaptions)}
                    className={`p-2 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                      showCaptions
                        ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Subtitles size={15} />
                    <span className="hidden sm:inline">CC</span>
                  </button>

                  {activeChapterIndex < totalChapters - 1 && (
                    <button
                      onClick={() => handleSelectChapter(activeChapterIndex + 1)}
                      className="flex items-center gap-1 text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-950/60 border border-indigo-800/60 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Next Chapter <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Teacher Interruption / Q&A Bar */}
          <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <MessageSquare size={15} className="text-cyan-400" />
                <span>Interrupt &amp; Ask Teacher (Instant Voice &amp; Text Response)</span>
              </div>
              <span className="text-[10px] text-slate-400">
                Pauses video lecture to clear your exact doubt
              </span>
            </div>

            <form onSubmit={handleAskDoubt} className="flex gap-2">
              <input
                type="text"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder="Ask Dr. Ada a question about this slide..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <Button type="submit" variant="primary" size="sm" className="bg-cyan-600 hover:bg-cyan-500 text-white shrink-0">
                <Send size={13} className="mr-1" /> Ask AI
              </Button>
            </form>

            {interruptedDoubt && aiInterruptionAnswer && (
              <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 space-y-1.5 text-xs animate-fadeIn">
                <div className="flex items-center gap-2 font-bold text-cyan-300">
                  <Sparkles size={14} />
                  <span>Teacher Response: &ldquo;{interruptedDoubt}&rdquo;</span>
                </div>
                <p className="text-slate-200 leading-relaxed">
                  {aiInterruptionAnswer}
                </p>
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => {
                      setInterruptedDoubt(null);
                      setAiInterruptionAnswer(null);
                      setIsPlaying(true);
                    }}
                    className="text-[11px] font-semibold text-cyan-300 hover:text-cyan-100 flex items-center gap-1"
                  >
                    Resume Video Lecture <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Teacher Avatar & Chapter Navigator (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* AI Teacher Avatar Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 border border-indigo-500/20 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${selectedLecture.teacherAvatarBg} flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-600/30 ring-2 ${
                    speakingActive ? 'ring-emerald-400 animate-pulse' : 'ring-indigo-400/40'
                  }`}
                >
                  {selectedLecture.teacherName[0]}
                </div>
                {speakingActive && (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  </span>
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{selectedLecture.teacherName}</h4>
                <p className="text-[11px] text-indigo-300">{selectedLecture.teacherTitle}</p>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <GraduationCap size={12} /> Adaptive Socratic Mode
                </span>
              </div>
            </div>

            {/* Neural Voice Spectrum Visualizer */}
            <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Teacher Voice Synthesizer</span>
                <span className={speakingActive ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {speakingActive ? 'STREAMING AUDIO' : 'READY'}
                </span>
              </div>
              <div className="h-6 flex items-center justify-between gap-1 px-1">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      speakingActive
                        ? 'bg-gradient-to-t from-indigo-500 to-cyan-400'
                        : 'bg-slate-800'
                    }`}
                    style={{
                      height: speakingActive
                        ? `${Math.max(15, ((Math.sin(i * 0.6 + progressSec) + 1) / 2) * 100)}%`
                        : '20%',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Chapter Timeline Navigator */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <BookOpen size={14} className="text-indigo-400" />
                Lesson Chapters
              </h4>
              <span className="text-[11px] font-mono text-indigo-400">
                {activeChapterIndex + 1} / {totalChapters}
              </span>
            </div>

            <div className="space-y-2">
              {selectedLecture.chapters.map((ch, idx) => {
                const isActive = idx === activeChapterIndex;
                const isPassed = idx < activeChapterIndex;

                return (
                  <button
                    key={ch.id}
                    onClick={() => handleSelectChapter(idx)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      isActive
                        ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-md ring-1 ring-indigo-500/40'
                        : isPassed
                        ? 'bg-slate-950/60 border-emerald-500/30 text-slate-300 hover:bg-slate-900'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : isPassed
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isPassed ? '✓' : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold truncate">{ch.title}</span>
                        <span className="text-[10px] font-mono opacity-70 shrink-0">
                          {ch.durationSec}s
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                        {ch.type}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
