'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTutor } from '@/hooks/useTutor';
import { useVoice } from '@/hooks/useVoice';
import { MultimodalComposer, MultimodalDoubtPayload } from '@/components/tutor/MultimodalComposer';
import { TeachingCard, MultimodalDoubtResult } from '@/components/tutor/TeachingCard';
import { DocumentTeacherPanel } from '@/components/tutor/DocumentTeacherPanel';
import { CodeMentorPanel } from '@/components/tutor/CodeMentorPanel';
import { ProjectMentorPanel } from '@/components/tutor/ProjectMentorPanel';
import { InterviewCoachPanel } from '@/components/tutor/InterviewCoachPanel';
import { InteractiveWhiteboard } from '@/components/tutor/InteractiveWhiteboard';
import { VoiceRecorder } from '@/components/voice/VoiceRecorder';
import { AIVideoTeachingStudio } from '@/components/tutor/AIVideoTeachingStudio';
import { Card, CardHeader, CardTitle } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { api } from '@/lib/api';
import {
  Brain,
  Sparkles,
  Mic,
  Activity,
  X,
  FileText,
  Code2,
  FolderGit2,
  Briefcase,
  Layers,
  MessageSquareText,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Video,
} from 'lucide-react';

type TutorTabMode = 'video_studio' | 'multimodal_doubt' | 'document_teacher' | 'code_mentor' | 'project_mentor' | 'interview_coach' | 'whiteboard';

export default function TutorPage() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get('topic') || 'Python Foundations';
  const initialMode = searchParams.get('mode') as TutorTabMode | null;

  const [activeTab, setActiveTab] = useState<TutorTabMode>(initialMode || 'video_studio');
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [multimodalSubmitting, setMultimodalSubmitting] = useState(false);
  const [multimodalResponses, setMultimodalResponses] = useState<MultimodalDoubtResult[]>([
    {
      doubt_id: 'sample-init-1',
      classification: 'conceptual',
      concept: 'Gradient Descent Optimization',
      why_it_matters: 'Enables machine learning algorithms to iteratively discover optimal parameter weights by descending down the loss gradient surface.',
      prerequisites_required: ['Basic derivatives', 'Loss functions (MSE / Log-loss)'],
      prerequisite_gap_detected: false,
      misconception_identified: null,
      teaching_strategy_used: 'analogy',
      explanation_level: 'intermediate',
      explanation: 'Think of gradient descent like being blindfolded on a foggy mountain and trying to reach the deepest valley. At every step, you feel the slope of the ground beneath your boots (the gradient) and take a step in the steepest downward direction. By repeating this step-by-step with a measured stride length (the learning rate), you gradually reach the bottom.',
      step_by_step_breakdown: [
        '1. Compute the loss function J(θ) for current parameter weights.',
        '2. Calculate the partial derivatives (gradient vector ∇J) indicating steepest ascent.',
        '3. Update weights in the opposite direction: θ = θ - α · ∇J.',
        '4. Repeat until parameter adjustments fall below convergence tolerance ε.',
      ],
      worked_example: 'Given f(x) = x², f\'(x) = 2x. Starting at x_0 = 4 with learning rate α = 0.1: Step 1 yields x_1 = 4 - 0.1(8) = 3.2. Step 2 yields x_2 = 3.2 - 0.1(6.4) = 2.56, stepping monotonically towards minimum x=0.',
      real_world_application: 'Autonomous driving perception models continuously use gradient descent variants (Adam, AdamW) to optimize billions of neural network weights across millions of highway camera frames.',
      visual_diagram: {
        diagram_type: 'flowchart',
        title: 'Gradient Descent Iterative Loop',
        description: 'Cyclic optimization process from parameter initialization to global convergence.',
        nodes: [
          { id: '1', label: 'Initialize Weights θ_0', shape: 'pill', category: 'input' },
          { id: '2', label: 'Forward Pass: Compute Loss J(θ)', shape: 'rectangle', category: 'process' },
          { id: '3', label: 'Backward Pass: Compute Gradient ∇J', shape: 'diamond', category: 'process' },
          { id: '4', label: 'Update: θ = θ - α · ∇J', shape: 'rectangle', category: 'formula' },
          { id: '5', label: 'Convergence Met (∇J ≈ 0)?', shape: 'diamond', category: 'decision' },
          { id: '6', label: 'Optimal Model Parameters θ*', shape: 'pill', category: 'output' },
        ],
        edges: [
          { from_node: '1', to_node: '2' },
          { from_node: '2', to_node: '3' },
          { from_node: '3', to_node: '4' },
          { from_node: '4', to_node: '5' },
          { from_node: '5', to_node: '6', label: 'Yes' },
          { from_node: '5', to_node: '2', label: 'No' },
        ],
      },
      understanding_check: {
        question_id: 'check-gd-1',
        question: 'What happens if your learning rate α is set excessively high (e.g., α = 2.5 on f(x) = x²)?',
        options: [
          'A) The model reaches the minimum in a single step.',
          'B) The updates will overshoot the valley and diverge into infinity.',
          'C) The weights will stay frozen at their initial values.',
          'D) The gradients become strictly zero immediately.',
        ],
        correct_option_index: 1,
        hint: 'Consider what happens when taking huge stride lengths across a narrow ravine.',
      },
      recommended_next_step: 'Explore Learning Rate Schedules and Adaptive Optimizers (Momentum & Adam).',
      why_chain_depth: 0,
      is_uncertain: false,
    },
  ]);

  const {
    session,
    pedagogyMode,
    setPedagogyMode,
    activeStrategy,
  } = useTutor('AI/ML', initialTopic);

  const {
    voiceState,
    transcript,
    responseSpokenText,
    audioLevel,
    startRecording,
    stopRecordingAndSend,
    interruptSpeech,
  } = useVoice(session?.id || 'voice_session_main');

  // Handle Multimodal Doubt Submission
  const handleResolveDoubt = async (payload: MultimodalDoubtPayload) => {
    setMultimodalSubmitting(true);
    try {
      const response = await api.resolveMultimodalDoubt({
        user_id: 'learner-curr-01',
        text_question: payload.text_question,
        image_data_base64: payload.image_data_base64,
        image_url: payload.image_url,
        code_snippet: payload.code_snippet,
        code_language: payload.code_language,
        voice_transcript: payload.voice_transcript,
        current_topic: initialTopic,
        explanation_level: payload.explanation_level,
        preferred_strategy: payload.preferred_strategy,
      });

      const result = (response?.data || response) as MultimodalDoubtResult;
      if (result && result.doubt_id) {
        setMultimodalResponses((prev) => [result, ...prev]);
      }
    } catch (err) {
      console.error('Failed to resolve multimodal doubt:', err);
    } finally {
      setMultimodalSubmitting(false);
    }
  };

  // Handle Quick Strategy Swapping on Existing Card
  const handleQuickStrategy = async (
    doubtId: string,
    action: 'simpler' | 'example' | 'visual' | 'deeper' | 'hint' | 'quiz' | 'explain_again' | 'why' | 'real_world'
  ) => {
    const parentResponse = multimodalResponses.find((r) => r.doubt_id === doubtId);
    if (!parentResponse) return;

    setMultimodalSubmitting(true);
    try {
      let preferredStrategy: string | undefined = undefined;
      let promptText = parentResponse.concept;
      let whyDepth = parentResponse.why_chain_depth || 0;

      switch (action) {
        case 'simpler':
          preferredStrategy = 'simpler';
          promptText = `Explain simpler: ${parentResponse.concept}`;
          break;
        case 'example':
          preferredStrategy = 'example';
          promptText = `Provide a concrete worked example for: ${parentResponse.concept}`;
          break;
        case 'visual':
          preferredStrategy = 'visual';
          promptText = `Show visual diagram and flow for: ${parentResponse.concept}`;
          break;
        case 'deeper':
          preferredStrategy = 'derivation';
          promptText = `Derive mathematically in depth: ${parentResponse.concept}`;
          break;
        case 'hint':
          preferredStrategy = 'socratic';
          promptText = `Give me a guiding hint about: ${parentResponse.concept}`;
          break;
        case 'quiz':
          preferredStrategy = 'socratic';
          promptText = `Quiz me to check my understanding on: ${parentResponse.concept}`;
          break;
        case 'explain_again':
          preferredStrategy = 'explain_again';
          promptText = `I am still confused. Explain again using a different perspective: ${parentResponse.concept}`;
          break;
        case 'why':
          whyDepth += 1;
          promptText = `Why does that happen under the hood for ${parentResponse.concept}? (Why-Chain depth: ${whyDepth})`;
          break;
        case 'real_world':
          preferredStrategy = 'real_world';
          promptText = `Show me how ${parentResponse.concept} is applied in production industry architectures.`;
          break;
      }

      const response = await api.resolveMultimodalDoubt({
        user_id: 'learner-curr-01',
        text_question: promptText,
        current_topic: parentResponse.concept,
        explanation_level: action === 'simpler' ? 'beginner' : action === 'deeper' ? 'advanced' : parentResponse.explanation_level,
        preferred_strategy: preferredStrategy,
      });

      const result = (response?.data || response) as MultimodalDoubtResult;
      if (result && result.doubt_id) {
        result.why_chain_depth = whyDepth;
        setMultimodalResponses((prev) => [result, ...prev]);
      }
    } catch (err) {
      console.error('Error handling quick strategy:', err);
    } finally {
      setMultimodalSubmitting(false);
    }
  };

  const tabs = [
    { id: 'video_studio', label: 'AI Video Lecture Studio', icon: <Video size={16} className="text-cyan-400" /> },
    { id: 'multimodal_doubt', label: 'Multimodal Tutor', icon: <Sparkles size={16} /> },
    { id: 'document_teacher', label: 'Document Teacher', icon: <FileText size={16} /> },
    { id: 'code_mentor', label: 'Code Mentor', icon: <Code2 size={16} /> },
    { id: 'project_mentor', label: 'Project Mentor', icon: <FolderGit2 size={16} /> },
    { id: 'interview_coach', label: 'Interview Coach', icon: <Briefcase size={16} /> },
    { id: 'whiteboard', label: 'Interactive Whiteboard', icon: <Layers size={16} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Main Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30">
              <Brain size={26} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
                AI-SENIOR-X Teaching Intelligence
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="indigo" size="sm">
                  Adaptive Cognitive Twin Live
                </Badge>
                <span className="text-xs text-slate-400">
                  Topic: <strong className="text-slate-200">{initialTopic}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={voiceModalOpen ? 'secondary' : 'glow'}
            size="sm"
            onClick={() => setVoiceModalOpen(!voiceModalOpen)}
            icon={<Mic size={15} />}
          >
            <span>{voiceModalOpen ? 'Hide Voice Orb' : 'Live Voice Tutor'}</span>
          </Button>
        </div>
      </div>

      {/* Voice Conversational Drawer when toggled */}
      {voiceModalOpen && (
        <div className="relative">
          <div className="absolute right-4 top-4 z-10">
            <button
              onClick={() => setVoiceModalOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            >
              <X size={16} />
            </button>
          </div>
          <VoiceRecorder
            state={voiceState}
            transcript={transcript}
            responseSpokenText={responseSpokenText}
            audioLevel={audioLevel}
            onStart={startRecording}
            onStop={async () => {
              await stopRecordingAndSend();
              if (transcript) {
                handleResolveDoubt({ text_question: transcript, voice_transcript: transcript });
              }
            }}
            onInterrupt={interruptSpeech}
          />
        </div>
      )}

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TutorTabMode)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 0: AI Video Teaching Studio */}
      {activeTab === 'video_studio' && (
        <AIVideoTeachingStudio initialTopic={initialTopic} />
      )}

      {/* Tab 1: Multimodal Socratic Tutor */}
      {activeTab === 'multimodal_doubt' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Teaching Feed (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Input Composer */}
            <MultimodalComposer
              onSubmitDoubt={handleResolveDoubt}
              isLoading={multimodalSubmitting}
            />

            {/* Teaching Response Cards Stream */}
            <div className="space-y-6">
              {multimodalResponses.map((res) => (
                <TeachingCard
                  key={res.doubt_id}
                  response={res}
                  onQuickStrategy={handleQuickStrategy}
                />
              ))}
            </div>
          </div>

          {/* Right 1 Col: Cognitive Learning Twin Sidebar */}
          <div className="space-y-5">
            <Card className="p-4 bg-slate-900 border border-slate-800 space-y-3">
              <CardHeader className="p-0 pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-white">
                  <Activity size={16} className="text-indigo-400" />
                  Cognitive Learning Twin
                </CardTitle>
              </CardHeader>
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 font-semibold block mb-0.5">Estimated Mastery</span>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">Proficient (78%)</span>
                    <TrendingUp size={14} className="text-emerald-400" />
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 font-semibold block mb-0.5">Top Explanation Preference</span>
                  <span className="text-indigo-300 font-semibold">Visual Flow & Worked Examples</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 font-semibold block mb-0.5">Active Teaching Stance</span>
                  <span className="text-amber-300 font-medium">Socratic Scaffolding & Checks</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 font-semibold block mb-0.5">Resolved Misconceptions</span>
                  <span className="text-emerald-400 font-bold">4 concepts remediated</span>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                <Lightbulb size={15} className="text-amber-400" />
                Teaching Intelligence Rule
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                AI-SENIOR-X does not merely dump answers. If you upload a handwritten question or code error, the teacher diagnoses missing prerequisites, generates visual flows, and verifies understanding with live checks.
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Document Teacher */}
      {activeTab === 'document_teacher' && (
        <DocumentTeacherPanel />
      )}

      {/* Tab 3: Code Mentor */}
      {activeTab === 'code_mentor' && (
        <CodeMentorPanel />
      )}

      {/* Tab 4: Project Mentor */}
      {activeTab === 'project_mentor' && (
        <ProjectMentorPanel />
      )}

      {/* Tab 5: Interview Coach */}
      {activeTab === 'interview_coach' && (
        <InterviewCoachPanel />
      )}

      {/* Tab 6: Interactive Whiteboard */}
      {activeTab === 'whiteboard' && (
        <InteractiveWhiteboard />
      )}
    </div>
  );
}
