'use client';

import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/api';
import { Mission } from '@/types';

export function useMissions(topicId: string = 'ml_supervised') {
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: 'mission_ai_01',
      title: 'Capstone: Deploying a Multi-Class Neural Classifier',
      subject: 'AI/ML',
      topic_id: 'ml_supervised',
      description:
        'Construct a complete supervised classification pipeline with data preprocessing, loss monitoring, and validation metrics.',
      difficulty: 'Intermediate',
      xp_reward: 350,
      progress_percentage: 66,
      is_completed: false,
      created_at: new Date().toISOString(),
      tasks: [
        {
          id: 'task_1',
          title: 'Implement Train/Validation Split with stratification',
          description: 'Ensure class distributions are balanced across subsets.',
          is_completed: true,
          target_concept: 'data_splitting',
        },
        {
          id: 'task_2',
          title: 'Compute Cross-Entropy Loss & Backpropagation Gradients',
          description: 'Vectorize gradient calculations using NumPy.',
          is_completed: true,
          target_concept: 'loss_functions',
        },
        {
          id: 'task_3',
          title: 'Tune Learning Rate & Evaluate F1-Score',
          description: 'Achieve validation F1 score > 0.88 on test dataset.',
          is_completed: false,
          target_concept: 'evaluation_metrics',
        },
      ],
    },
    {
      id: 'mission_sql_02',
      title: 'Quest: High-Performance Multi-Table Analytics',
      subject: 'SQL',
      topic_id: 'sql_joins',
      description: 'Master complex outer joins, window partitions, and index optimization.',
      difficulty: 'Beginner',
      xp_reward: 200,
      progress_percentage: 100,
      is_completed: true,
      created_at: new Date().toISOString(),
      tasks: [
        {
          id: 'task_sql_1',
          title: 'Write 3-table INNER JOIN query',
          description: 'Connect users, orders, and products tables.',
          is_completed: true,
          target_concept: 'sql_inner_join',
        },
      ],
    },
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveMission = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getActiveMission(topicId);
      if (res.success && res.data) {
        const payload = res.data.payload || res.data;
        if (payload.title) {
          const generated: Mission = {
            id: payload.mission_id || `mission_${Date.now()}`,
            title: payload.title,
            subject: payload.subject || 'AI & Data Science',
            topic_id: topicId,
            description: payload.description || res.data.content || 'Complete the targeted objectives.',
            difficulty: payload.difficulty || 'Intermediate',
            xp_reward: payload.xp_reward || 250,
            progress_percentage: 0,
            is_completed: false,
            created_at: new Date().toISOString(),
            tasks: (payload.tasks || []).map((t: any, i: number) => ({
              id: `task_${i + 1}`,
              title: typeof t === 'string' ? t : t.title || `Objective ${i + 1}`,
              description: t.description || 'Target milestone completion',
              is_completed: false,
              target_concept: t.concept_id || topicId,
            })),
          };

          setMissions((prev) => [generated, ...prev.filter((m) => m.id !== generated.id)]);
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch active mission');
    } finally {
      setLoading(false);
    }
  }, [topicId]);

  useEffect(() => {
    fetchActiveMission();
  }, [fetchActiveMission]);

  const toggleTask = (missionId: string, taskId: string) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id !== missionId) return m;
        const updatedTasks = m.tasks.map((t) =>
          t.id === taskId ? { ...t, is_completed: !t.is_completed } : t
        );
        const completedCount = updatedTasks.filter((t) => t.is_completed).length;
        const progress = Math.round((completedCount / updatedTasks.length) * 100);
        return {
          ...m,
          tasks: updatedTasks,
          progress_percentage: progress,
          is_completed: progress === 100,
        };
      })
    );
  };

  return {
    missions,
    loading,
    error,
    toggleTask,
    refreshMissions: fetchActiveMission,
  };
}
