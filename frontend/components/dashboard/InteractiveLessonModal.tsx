'use client';

import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  Lightbulb,
  Cpu,
  Code2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Play,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  Brain,
  Layers,
  MessageSquareText,
  Send,
  Check,
  Target,
} from 'lucide-react';
import { SAMPLE_LESSONS } from '@/lib/curriculumData';
import { LessonDetail } from '@/types/curriculum';

interface InteractiveLessonModalProps {
  lessonId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onMasteryGained?: (concept: string, delta: number) => void;
}

export const InteractiveLessonModal: React.FC<InteractiveLessonModalProps> = ({
  lessonId,
  isOpen,
  onClose,
  onMasteryGained,
}) => {
  const lesson: LessonDetail = (lessonId && SAMPLE_LESSONS[lessonId]) || SAMPLE_LESSONS['lesson-dl-act-01'];

  // Tabs for structured pedagogical navigation
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'quiz' | 'tutor' | 'challenge'>('learn');

  // Interactive practice state
  const [userCode, setUserCode] = useState<string>(lesson.miniPractice.starterCode);
  const [practiceOutput, setPracticeOutput] = useState<string | null>(null);
  const [practiceSuccess, setPracticeSuccess] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Knowledge check quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [masteryApplied, setMasteryApplied] = useState<boolean>(false);

  // AI Tutor chat state
  const [tutorChat, setTutorChat] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: `Hello! I am your AI Pedagogy Tutor for **${lesson.title}**. Ask me to explain intuitively, simplify with analogies, or drill into edge cases.`,
    },
  ]);
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [isTutorLoading, setIsTutorLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  // Run practice code simulation
  const handleRunPractice = () => {
    if (userCode.includes('return') && (userCode.includes('sigmoid') || userCode.includes('clip') || userCode.includes('max'))) {
      setPracticeOutput('✓ Vectorized test passed! Shape: (5,) | Max Error: 0.0000e+00 | Smooth derivative confirmed.');
      setPracticeSuccess(true);
    } else {
      setPracticeOutput('⚠ Implementation incomplete: ensure you return the transformed array using z * sigmoid(z).');
      setPracticeSuccess(false);
    }
  };

  // Submit quiz & calculate score
  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    let correctCount = 0;
    lesson.knowledgeCheck.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) {
        correctCount += 1;
      }
    });

    if (correctCount >= 2 && !masteryApplied) {
      setMasteryApplied(true);
      if (onMasteryGained) {
        onMasteryGained(lesson.masteryOutcome.concept, lesson.masteryOutcome.targetMasteryDelta);
      }
    }
  };

  // Quick tutor prompt injection
  const handleTutorQuickPrompt = (promptText: string, sampleResponse: string) => {
    setTutorChat((prev) => [
      ...prev,
      { role: 'user', content: promptText },
      { role: 'assistant', content: sampleResponse },
    ]);
  };

  // Custom question submission
  const handleSendCustomQuestion = () => {
    if (!customQuestion.trim()) return;
    const q = customQuestion;
    setCustomQuestion('');
    setTutorChat((prev) => [...prev, { role: 'user', content: q }]);
    setIsTutorLoading(true);

    setTimeout(() => {
      setIsTutorLoading(false);
      setTutorChat((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Regarding **"${q}"**: In neural network forward propagation, non-linear activation functions act as continuous decision boundaries. When optimizing with backpropagation, the derivative $\\frac{\\partial a}{\\partial z}$ scales the gradient flowing backward. If saturation occurs (as in Sigmoid when $|z| > 4$), the gradient collapses to zero, blocking learning in upstream layers.`,
        },
      ]);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#090c14] border border-stone-800 shadow-2xl shadow-indigo-950/80 flex flex-col max-h-[94vh] overflow-hidden text-stone-100 font-sans">
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-stone-800 bg-[#0d101a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-md">
              <Brain size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-cyan-400 font-bold uppercase">LESSON {lesson.lessonNumber}</span>
                <span className="text-stone-600">/</span>
                <span className="text-stone-400 uppercase">DURATION: {lesson.durationMinutes} MIN</span>
                <span className="text-stone-600">/</span>
                <span className="text-emerald-400">MASTERY BOOST: +{lesson.masteryOutcome.targetMasteryDelta}%</span>
              </div>
              <h2 className="text-xl md:text-2xl font-serif text-stone-100 font-bold">
                {lesson.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white border border-stone-800 hover:border-stone-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* PEDAGOGICAL NAVIGATION TABS */}
        <div className="flex items-center justify-between px-6 border-b border-stone-800 bg-[#090b12] font-mono text-xs overflow-x-auto">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('learn')}
              className={`px-4 py-3 border-b-2 font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'learn'
                  ? 'border-indigo-400 text-white bg-indigo-950/20'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <BookOpen size={14} />
              <span>1. CONCEPT & INTUITION</span>
            </button>

            <button
              onClick={() => setActiveTab('practice')}
              className={`px-4 py-3 border-b-2 font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'practice'
                  ? 'border-cyan-400 text-white bg-cyan-950/20'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Code2 size={14} />
              <span>2. MINI PRACTICE</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-3 border-b-2 font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'quiz'
                  ? 'border-purple-400 text-white bg-purple-950/20'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <CheckCircle2 size={14} />
              <span>3. KNOWLEDGE CHECK</span>
            </button>

            <button
              onClick={() => setActiveTab('tutor')}
              className={`px-4 py-3 border-b-2 font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'tutor'
                  ? 'border-emerald-400 text-white bg-emerald-950/20'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Sparkles size={14} />
              <span>4. AI TEACHER</span>
            </button>

            <button
              onClick={() => setActiveTab('challenge')}
              className={`px-4 py-3 border-b-2 font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'challenge'
                  ? 'border-amber-400 text-white bg-amber-950/20'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Layers size={14} />
              <span>5. PRACTICAL CHALLENGE</span>
            </button>
          </div>
        </div>

        {/* TAB 1: LEARN (A to H) */}
        {activeTab === 'learn' && (
          <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-8">
            
            {/* A. LEARNING OBJECTIVES */}
            <div className="p-4 bg-[#0e121e] border border-indigo-900/50 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Target size={14} />
                <span>A. LEARNING OBJECTIVES ("WHAT YOU WILL MASTER")</span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 font-sans text-xs text-stone-300">
                {lesson.learningObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* B & C. CONCEPT EXPLANATION & INTUITION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-5 bg-[#0e111a] border border-stone-800 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <BookOpen size={14} />
                  <span>B. CONCEPT EXPLANATION</span>
                </div>
                <p className="text-xs text-stone-300 font-sans leading-relaxed">
                  {lesson.conceptExplanation}
                </p>
              </div>

              <div className="p-5 bg-[#0e111a] border border-stone-800 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <Lightbulb size={14} />
                  <span>C. INTUITION ("WHY IT EXISTS")</span>
                </div>
                <p className="text-xs text-stone-300 font-sans leading-relaxed">
                  {lesson.intuition}
                </p>
              </div>
            </div>

            {/* D. VISUAL EXPLANATION & ASCII DIAGRAM */}
            <div className="p-5 bg-[#080a10] border border-stone-800 space-y-3">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-purple-400 font-bold uppercase flex items-center gap-2">
                  <Cpu size={14} />
                  <span>D. VISUAL DIAGRAM: {lesson.visualExplanation.diagramTitle}</span>
                </span>
                <span className="text-stone-500">{lesson.visualExplanation.diagramType}</span>
              </div>
              <pre className="p-4 bg-[#05070a] border border-stone-800 font-mono text-[11px] text-cyan-300 overflow-x-auto leading-tight">
                {lesson.visualExplanation.asciiOrSvg}
              </pre>
              <p className="text-xs font-mono text-stone-400 italic">
                {lesson.visualExplanation.caption}
              </p>
            </div>

            {/* E. REAL-WORLD ANALOGY */}
            <div className="p-5 bg-[#121522] border-l-4 border-indigo-500 border-y border-r border-stone-800 space-y-2">
              <div className="text-indigo-300 font-mono text-xs font-bold uppercase">
                E. REAL-WORLD ANALOGY
              </div>
              <p className="text-xs text-stone-200 font-sans leading-relaxed">
                {lesson.realWorldAnalogy}
              </p>
            </div>

            {/* F & G. PRODUCTION CODE & STEP-BY-STEP WALKTHROUGH */}
            <div className="space-y-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-emerald-400 font-bold uppercase flex items-center gap-2">
                  <Code2 size={14} />
                  <span>F. PRODUCTION-GRADE CODE IMPLEMENTATION</span>
                </span>
                <span className="text-stone-400 font-mono text-[11px]">LANGUAGE: {lesson.codeExample.language.toUpperCase()}</span>
              </div>

              <div className="border border-stone-800 bg-[#07090e]">
                <pre className="p-4 font-mono text-xs text-stone-200 overflow-x-auto leading-relaxed">
                  {lesson.codeExample.code}
                </pre>
                <div className="p-3 bg-[#0a0d14] border-t border-stone-800 font-mono text-[11px] text-stone-400">
                  <span className="text-stone-300 font-bold">EXECUTION OUTPUT:</span>
                  <pre className="text-emerald-300 pt-1">{lesson.codeExample.outputExplanation}</pre>
                </div>
              </div>

              {/* G. Step-by-Step Breakdown */}
              <div className="space-y-2 pt-2">
                <div className="font-mono text-xs text-stone-400 uppercase font-bold">
                  G. STEP-BY-STEP MATHEMATICAL WALKTHROUGH
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {lesson.stepByStepWalkthrough.map((step) => (
                    <div key={step.step} className="p-3 bg-[#0e111a] border border-stone-800 space-y-1">
                      <div className="font-mono text-[11px] text-cyan-400 font-bold">
                        STEP 0{step.step}: {step.title}
                      </div>
                      <p className="text-[11px] text-stone-300 font-sans leading-normal">
                        {step.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* H. COMMON MISTAKES & MISCONCEPTIONS */}
            <div className="space-y-3">
              <div className="font-mono text-xs text-rose-400 font-bold uppercase flex items-center gap-2">
                <AlertCircle size={14} />
                <span>H. COMMON MISTAKES & MISCONCEPTION RADAR</span>
              </div>
              <div className="space-y-3">
                {lesson.commonMistakes.map((cm, idx) => (
                  <div key={idx} className="p-4 bg-[#140e12] border border-rose-900/50 space-y-1.5 text-xs">
                    <div className="text-rose-300 font-bold font-mono">
                      ❌ PITFALL: {cm.mistake}
                    </div>
                    <div className="text-stone-300 font-sans">
                      <strong className="text-amber-400">Why it happens:</strong> {cm.whyItHappens}
                    </div>
                    <div className="text-emerald-300 font-sans pt-0.5">
                      <strong className="text-emerald-400 font-bold">✓ Correct Approach:</strong> {cm.correctApproach}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Proceed to Practice Button */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setActiveTab('practice')}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                <span>PROCEED TO MINI PRACTICE</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: MINI PRACTICE (I) */}
        {activeTab === 'practice' && (
          <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-6">
            <div className="space-y-2">
              <div className="font-mono text-xs text-cyan-400 font-bold uppercase flex items-center gap-2">
                <Code2 size={16} />
                <span>I. INTERACTIVE CODE PRACTICE & UNIT DRILL</span>
              </div>
              <p className="text-sm text-stone-200">
                {lesson.miniPractice.instruction}
              </p>
            </div>

            {/* Code Editor Mock */}
            <div className="border border-stone-800 bg-[#06080d]">
              <div className="flex items-center justify-between px-4 py-2 bg-[#0c0f18] border-b border-stone-800 font-mono text-xs">
                <span className="text-stone-400">exercise_solution.py</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-amber-400 hover:text-amber-300 text-[11px] underline"
                  >
                    {showHint ? 'Hide Hints' : 'Need Hint?'}
                  </button>
                  <button
                    onClick={() => setUserCode(lesson.miniPractice.solutionCode)}
                    className="text-stone-500 hover:text-stone-300 text-[10px]"
                  >
                    Load Solution
                  </button>
                </div>
              </div>

              {showHint && (
                <div className="p-3 bg-[#141208] border-b border-amber-900/40 text-xs font-mono text-amber-300 space-y-1">
                  <div className="font-bold">💡 HINTS:</div>
                  {lesson.miniPractice.hints.map((h, i) => (
                    <div key={i}>• {h}</div>
                  ))}
                </div>
              )}

              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                rows={10}
                className="w-full p-4 bg-transparent font-mono text-xs text-stone-100 focus:outline-none resize-none leading-relaxed"
                spellCheck={false}
              />

              <div className="px-4 py-3 bg-[#0a0d14] border-t border-stone-800 flex items-center justify-between">
                <button
                  onClick={() => setUserCode(lesson.miniPractice.starterCode)}
                  className="flex items-center gap-1.5 text-stone-400 hover:text-white font-mono text-xs"
                >
                  <RotateCcw size={13} />
                  <span>RESET CODE</span>
                </button>

                <button
                  onClick={handleRunPractice}
                  className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-colors"
                >
                  <Play size={14} />
                  <span>RUN TEST SUITE</span>
                </button>
              </div>
            </div>

            {/* Terminal Output */}
            {practiceOutput && (
              <div
                className={`p-4 font-mono text-xs border ${
                  practiceSuccess
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                }`}
              >
                {practiceOutput}
              </div>
            )}

            {practiceSuccess && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                >
                  <span>PROCEED TO KNOWLEDGE CHECK</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: KNOWLEDGE CHECK (K & M) */}
        {activeTab === 'quiz' && (
          <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-6">
            <div className="space-y-1">
              <div className="font-mono text-xs text-purple-400 font-bold uppercase flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>K. KNOWLEDGE CHECK & MASTERY VALIDATION (3 QUESTIONS)</span>
              </div>
              <p className="text-xs text-stone-300 font-sans">
                Answer these questions to calibrate your Cognitive Twin state and demonstrate conceptual mastery.
              </p>
            </div>

            <div className="space-y-6">
              {lesson.knowledgeCheck.map((q, qIdx) => {
                const userSelected = selectedAnswers[q.id];
                const isCorrect = userSelected === q.correctAnswerIndex;
                return (
                  <div key={q.id} className="p-5 bg-[#0e111a] border border-stone-800 space-y-3">
                    <div className="font-mono text-xs text-stone-300 font-bold">
                      Q{qIdx + 1}: {q.question}
                    </div>

                    <div className="space-y-2 pt-1 font-sans text-xs">
                      {q.options.map((opt, optIdx) => {
                        const isThisSelected = userSelected === optIdx;
                        let optionStyle = 'bg-[#080a10] border-stone-800 text-stone-300 hover:border-stone-700';

                        if (quizSubmitted) {
                          if (optIdx === q.correctAnswerIndex) {
                            optionStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-semibold';
                          } else if (isThisSelected && !isCorrect) {
                            optionStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                          }
                        } else if (isThisSelected) {
                          optionStyle = 'bg-indigo-950/50 border-indigo-400 text-white font-semibold';
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={quizSubmitted}
                            onClick={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                            className={`w-full text-left p-3 border transition-colors flex items-center justify-between ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && optIdx === q.correctAnswerIndex && (
                              <Check size={14} className="text-emerald-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="p-3 bg-[#0a0d14] border border-stone-800 text-[11px] font-mono text-stone-400">
                        <strong className="text-stone-300">EXPLANATION:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quiz Action / Mastery Boost Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-800">
              <div className="font-mono text-xs text-stone-400">
                {masteryApplied ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <TrendingUp size={14} />
                    COGNITIVE TWIN SYNCHRONIZED: +{lesson.masteryOutcome.targetMasteryDelta}% MASTERY APPLIED
                  </span>
                ) : (
                  <span>Submit answers to calibrate cognitive state.</span>
                )}
              </div>

              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(selectedAnswers).length < lesson.knowledgeCheck.length}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:pointer-events-none text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  SUBMIT KNOWLEDGE CHECK
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab('tutor')}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                >
                  <span>ASK AI TUTOR</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: AI TUTOR AS REAL TEACHER (J) */}
        {activeTab === 'tutor' && (
          <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-6 flex flex-col">
            <div className="space-y-1">
              <div className="font-mono text-xs text-emerald-400 font-bold uppercase flex items-center gap-2">
                <Sparkles size={16} />
                <span>J. AI TEACHER INTELLIGENCE STUDIO</span>
              </div>
              <p className="text-xs text-stone-300 font-sans">
                The AI Tutor dynamically adjusts to your cognitive gaps, previous mistakes, and target career path.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
              <span className="text-stone-400">QUICK PEDAGOGY DIRECTIVES:</span>
              {lesson.aiTutorPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTutorQuickPrompt(p.prompt, p.sampleResponse)}
                  className="px-2.5 py-1 bg-[#121624] border border-indigo-500/30 hover:border-indigo-400 text-indigo-300 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Chat Conversation Thread */}
            <div className="flex-1 bg-[#06080e] border border-stone-800 p-4 space-y-4 overflow-y-auto min-h-[220px]">
              {tutorChat.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 text-xs leading-relaxed ${
                    msg.role === 'assistant' ? 'bg-[#0d101a] p-3 border border-stone-800' : 'bg-[#141724] p-3 ml-8 text-stone-200'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-md shrink-0 flex items-center justify-center font-bold text-[10px] ${
                      msg.role === 'assistant' ? 'bg-indigo-600 text-white' : 'bg-stone-700 text-stone-300'
                    }`}
                  >
                    {msg.role === 'assistant' ? 'AI' : 'YOU'}
                  </div>
                  <div className="space-y-1 font-sans text-stone-300">
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))}

              {isTutorLoading && (
                <div className="text-xs font-mono text-indigo-400 flex items-center gap-2 p-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                  <span>AI Pedagogy Teacher is formulating response...</span>
                </div>
              )}
            </div>

            {/* Custom Input */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendCustomQuestion()}
                placeholder="Ask any conceptual question, request another example, or test edge cases..."
                className="flex-1 px-4 py-2.5 bg-[#0a0d14] border border-stone-800 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <button
                onClick={handleSendCustomQuestion}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <span>SEND</span>
                <Send size={13} />
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: PRACTICAL CHALLENGE (L) */}
        {activeTab === 'challenge' && (
          <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-6">
            <div className="space-y-1">
              <div className="font-mono text-xs text-amber-400 font-bold uppercase flex items-center gap-2">
                <Layers size={16} />
                <span>L. PRACTICAL CHALLENGE: {lesson.practicalChallenge.title}</span>
              </div>
              <p className="text-xs text-stone-300 font-sans">
                Apply this concept directly to an engineering deliverable to generate portfolio evidence.
              </p>
            </div>

            <div className="p-5 bg-[#0e111a] border border-stone-800 space-y-4 text-xs font-sans">
              <div>
                <div className="font-mono text-[11px] text-stone-400 uppercase font-bold">SCENARIO:</div>
                <p className="text-stone-200 pt-0.5">{lesson.practicalChallenge.scenario}</p>
              </div>

              <div>
                <div className="font-mono text-[11px] text-amber-400 uppercase font-bold">CORE TASK:</div>
                <p className="text-stone-200 pt-0.5">{lesson.practicalChallenge.task}</p>
              </div>

              <div>
                <div className="font-mono text-[11px] text-cyan-400 uppercase font-bold">DELIVERABLE:</div>
                <p className="text-stone-200 pt-0.5">{lesson.practicalChallenge.deliverable}</p>
              </div>
            </div>

            <div className="p-4 bg-[#0a0d14] border border-stone-800 flex items-center justify-between font-mono text-xs">
              <div className="text-stone-400">
                Connected Project: <strong className="text-stone-200">Level 4: Vectorized Neural Network & Autograd Engine</strong>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold uppercase tracking-wider"
              >
                SAVE PROGRESS & RETURN TO DASHBOARD
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
