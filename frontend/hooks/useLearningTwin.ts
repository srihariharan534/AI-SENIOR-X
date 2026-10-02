'use client';

import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/api';
import {
  KnowledgeState,
  LearningHistoryEvent,
  LearningTwinSummary,
  Misconception,
  SkillCompetency,
} from '@/types';

export function useLearningTwin() {
  const [summary, setSummary] = useState<LearningTwinSummary | null>(null);
  const [knowledgeState, setKnowledgeState] = useState<KnowledgeState | null>(null);
  const [skills, setSkills] = useState<SkillCompetency[]>([]);
  const [misconceptions, setMisconceptions] = useState<{ active: Misconception[]; resolved: Misconception[] }>({
    active: [],
    resolved: [],
  });
  const [history, setHistory] = useState<LearningHistoryEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTwinData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, knowRes, skillRes, miscRes, histRes] = await Promise.allSettled([
        api.getTwinSummary(),
        api.getKnowledgeState(),
        api.getSkillCompetencies(),
        api.getMisconceptionState(),
        api.getLearningHistory(20),
      ]);

      if (sumRes.status === 'fulfilled' && sumRes.value.success && sumRes.value.data) {
        setSummary(sumRes.value.data);
      }
      if (knowRes.status === 'fulfilled' && knowRes.value.success && knowRes.value.data) {
        setKnowledgeState(knowRes.value.data);
      }
      if (skillRes.status === 'fulfilled' && skillRes.value.success && skillRes.value.data) {
        setSkills(skillRes.value.data);
      }
      if (miscRes.status === 'fulfilled' && miscRes.value.success && miscRes.value.data) {
        setMisconceptions(miscRes.value.data);
      }
      if (histRes.status === 'fulfilled' && histRes.value.success && histRes.value.data) {
        setHistory(histRes.value.data);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load Learning Twin profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTwinData();
  }, [fetchTwinData]);

  const submitEvidence = async (payload: Record<string, unknown>) => {
    try {
      const res = await api.submitEvidence(payload);
      if (res.success && res.data?.updated_summary) {
        setSummary(res.data.updated_summary);
        await fetchTwinData();
      }
      return res;
    } catch (err: unknown) {
      return {
        success: false,
        error: {
          code: 'EVIDENCE_SUBMISSION_ERROR',
          message: err instanceof Error ? err.message : 'Evidence submission failed',
        },
      };
    }
  };

  return {
    summary,
    knowledgeState,
    skills,
    misconceptions,
    history,
    loading,
    error,
    refreshTwin: fetchTwinData,
    submitEvidence,
  };
}
