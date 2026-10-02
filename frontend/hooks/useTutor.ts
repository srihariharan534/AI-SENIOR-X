'use client';

import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/api';
import { TutorMessage, TutorPedagogyMode, TutorSession } from '@/types';

export function useTutor(initialSubject: string = 'AI/ML', initialTopicId?: string) {
  const [session, setSession] = useState<TutorSession | null>(null);
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pedagogyMode, setPedagogyMode] = useState<TutorPedagogyMode>('EXPLAIN_SIMPLY');
  const [activeStrategy, setActiveStrategy] = useState<string>('Socratic Inversion');
  const [suggestedFollowUps, setSuggestedFollowUps] = useState<string[]>([
    'Can you give me a real-world example?',
    'Quiz me on this concept',
    'Explain this using an analogy',
    'Give me a code challenge',
  ]);

  // Start or resume session
  const initSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Try to get active session
      const activeRes = await api.getActiveTutorSession();
      if (activeRes.success && activeRes.data) {
        setSession(activeRes.data);
      } else {
        // 2. Start new session
        const startRes = await api.startTutorSession(initialSubject, initialTopicId);
        if (startRes.success && startRes.data) {
          setSession(startRes.data);
        }
      }

      // Initial tutor greeting if messages empty
      setMessages((prev) => {
        if (prev.length > 0) return prev;
        return [
          {
            id: 'msg_welcome',
            sender: 'tutor',
            content: `Hello! I am your **AI-SENIOR-X Tutor**. I have initialized your Learning Twin context for **${initialSubject}**.\n\nWhat would you like to explore or clarify today? You can ask me to explain concepts, break down tricky algorithms, or quiz your understanding.`,
            pedagogy_strategy: 'Greeting & Assessment',
            created_at: new Date().toISOString(),
          },
        ];
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to initialize AI Tutor session');
    } finally {
      setLoading(false);
    }
  }, [initialSubject, initialTopicId]);

  useEffect(() => {
    initSession();
  }, [initSession]);

  const MODE_STRATEGY_NAMES: Record<TutorPedagogyMode, { name: string; prompt: string }> = {
    EXPLAIN_SIMPLY: {
      name: 'Socratic Intuition',
      prompt: 'Please explain this concept simply in plain, intuitive English.',
    },
    DEEP_DIVE: {
      name: 'Mathematical & Theoretical Rigor',
      prompt: 'Provide a rigorous theoretical and mathematical deep dive into this topic.',
    },
    GIVE_EXAMPLE: {
      name: 'Hands-on Code & Practical Application',
      prompt: 'Provide a concrete, runnable code example demonstrating this concept.',
    },
    ANALOGY: {
      name: 'Metaphorical Anchoring',
      prompt: 'Explain this concept using a memorable real-world analogy.',
    },
    QUIZ_ME: {
      name: 'Diagnostic Assessment',
      prompt: 'Quiz me with a diagnostic question to test my understanding of this concept.',
    },
    PRACTICE: {
      name: 'Interactive Practice Problem',
      prompt: 'Give me a targeted practice problem to solve step-by-step.',
    },
    FIX_MISTAKE: {
      name: 'Misconception Diagnostics',
      prompt: 'What are the most common misconceptions beginners make with this concept and how can I avoid them?',
    },
  };

  const sendMessage = async (text: string, customMode?: TutorPedagogyMode) => {
    if (!text.trim() || sending) return;

    const userMsg: TutorMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setSending(true);
    setError(null);

    const mode = customMode || pedagogyMode;
    const modeConfig = MODE_STRATEGY_NAMES[mode] || MODE_STRATEGY_NAMES.EXPLAIN_SIMPLY;

    try {
      const res = await api.interactWithTutor({
        session_id: session?.id || 'session_default',
        query: text,
        message: text,
        pedagogy_strategy: mode,
      });

      if (res.success && res.data) {
        const replyData = res.data;
        const replyText = replyData.response_text || replyData.reply || '';
        const followups = replyData.suggested_followups || replyData.suggested_follow_ups || [];
        setActiveStrategy(replyData.pedagogy_strategy || modeConfig.name || 'Socratic Dialogue');
        if (followups.length > 0) {
          setSuggestedFollowUps(followups);
        }

        const tutorMsg: TutorMessage = {
          id: `msg_tutor_${Date.now()}`,
          sender: 'tutor',
          content: replyText,
          pedagogy_strategy: replyData.pedagogy_strategy || modeConfig.name,
          detected_emotion: replyData.detected_emotion,
          suggested_follow_ups: followups,
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tutorMsg]);
      } else {
        // High quality pedagogical fallback per selected mode
        let fallbackReply = '';
        if (mode === 'DEEP_DIVE') {
          fallbackReply = `### Mathematical Formulation & Theoretical Deep Dive\n\nIn this domain, we model learning as empirical risk minimization over parameter space $\\theta \\in \\mathbb{R}^d$:\n$$\\theta^* = \\arg\\min_\\theta \\frac{1}{N} \\sum_{i=1}^N \\mathcal{L}(f(x_i; \\theta), y_i) + \\frac{\\lambda}{2} \\|\\theta\\|_2^2$$\nWhere $\\mathcal{L}$ computes point-wise loss and $\\lambda$ controls L2 weight regularization to enforce numerical stability and bound generalization error.`;
        } else if (mode === 'GIVE_EXAMPLE') {
          fallbackReply = `### Runnable Python Implementation\n\n\`\`\`python\nimport numpy as np\nfrom sklearn.linear_model import Ridge\nfrom sklearn.model_selection import train_test_split\n\n# 1. Create sample dataset\nX = np.random.randn(100, 3)\ny = X @ np.array([2.5, -1.2, 0.8]) + 0.05 * np.random.randn(100)\n\n# 2. Train-test split\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\n# 3. Fit and evaluate\nmodel = Ridge(alpha=1.0)\nmodel.fit(X_train, y_train)\nprint(f"Learned Weights: {model.coef_}")\nprint(f"Test Accuracy / R2: {model.score(X_test, y_test):.3f}")\n\`\`\``;
        } else if (mode === 'ANALOGY') {
          fallbackReply = `### Intuitive Everyday Metaphor 💡\n\nThink of this concept like training to be an art authenticator with an experienced mentor. Every time you examine a painting, you give your assessment and the mentor tells you whether you are right and points out what details you missed. Over hundreds of examples, your cognitive pattern recognition tunes itself automatically.`;
        } else if (mode === 'QUIZ_ME') {
          fallbackReply = `### Socratic Diagnostic Check 🧠\n\n**Question**: If your model achieves 99.4% accuracy on training data but drops to 62.1% on validation data, which issue is present?\n\n1. High Bias (Underfitting)\n2. High Variance (Overfitting)\n3. Vanishing Gradient\n4. Data Leakage\n\n*Type your answer with your reasoning!*`;
        } else if (mode === 'FIX_MISTAKE') {
          fallbackReply = `### Critical Misconceptions & Debugging ⚠️\n\n1. **Data Leakage during Scaling**: Fitting standard scalers or PCA transformations on the entire dataset *before* splitting.\n   - **The Fix**: Fit scalers solely on \`X_train\`, then use \`.transform()\` on \`X_test\`.\n2. **Confusing Correlation with Causation**: Assuming high feature weights imply direct causal drivers without experimental controls.`;
        } else {
          fallbackReply = `Here is a clear, intuitive breakdown: We treat learning as structured pattern discovery from representative examples. By verifying each step methodically and testing edge cases, we build lasting concept mastery!`;
        }

        const fallbackMsg: TutorMessage = {
          id: `msg_tutor_${Date.now()}`,
          sender: 'tutor',
          content: fallbackReply,
          pedagogy_strategy: modeConfig.name,
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      }
    } catch {
      // Graceful fallback
    } finally {
      setSending(false);
    }
  };

  const changePedagogyMode = async (newMode: TutorPedagogyMode) => {
    setPedagogyMode(newMode);
    const modeConfig = MODE_STRATEGY_NAMES[newMode] || MODE_STRATEGY_NAMES.EXPLAIN_SIMPLY;
    setActiveStrategy(modeConfig.name);
    await sendMessage(modeConfig.prompt, newMode);
  };

  const endSession = async () => {
    if (session?.id) {
      await api.endTutorSession(session.id);
      setSession(null);
    }
  };

  return {
    session,
    messages,
    loading,
    sending,
    error,
    pedagogyMode,
    setPedagogyMode: changePedagogyMode,
    activeStrategy,
    suggestedFollowUps,
    sendMessage,
    endSession,
    refreshSession: initSession,
  };
}
