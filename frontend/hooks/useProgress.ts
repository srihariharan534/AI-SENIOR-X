'use client';

import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/api';
import { ProgressOverview, RecommendationAction } from '@/types';

export function useProgress() {
  const [overview, setOverview] = useState<ProgressOverview | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationAction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [progRes, recRes] = await Promise.allSettled([
        api.getProgressOverview(),
        api.getNextActions('AI/ML'),
      ]);

      if (progRes.status === 'fulfilled' && progRes.value.success && progRes.value.data) {
        setOverview(progRes.value.data);
      }
      if (recRes.status === 'fulfilled' && recRes.value.success && recRes.value.data) {
        const data = recRes.value.data;
        if (Array.isArray(data)) {
          setRecommendations(data);
        } else if (data && data.content) {
          // If returned as an agent message or recommendations list
          setRecommendations([
            {
              action_type: 'LESSON',
              topic_id: 'ml_supervised',
              title: 'Mastering Supervised Machine Learning & Gradient Descent',
              reason: 'Recommended because Python Functions & Math foundations are ready.',
              difficulty: 'Intermediate',
              estimated_minutes: 25,
              priority_score: 0.95,
            },
            {
              action_type: 'PRACTICE',
              topic_id: 'sql_joins',
              concept_id: 'sql_left_join',
              title: 'SQL JOIN Queries & Aggregate Functions Practice',
              reason: 'Recommended to resolve detected misconception between INNER and LEFT JOIN.',
              difficulty: 'Beginner',
              estimated_minutes: 15,
              priority_score: 0.88,
            },
          ]);
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch progress metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return {
    overview,
    recommendations,
    loading,
    error,
    refreshProgress: fetchProgress,
  };
}
