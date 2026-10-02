'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export interface MaterialItemData {
  id: string;
  title: string;
  material_type: 'NOTES' | 'AI_VIDEO' | 'SLIDES' | 'CODE' | 'EXERCISES' | 'QUIZZES' | 'PROJECTS' | 'REAL_WORLD_CHALLENGES' | 'REFERENCES';
  subject_id: string;
  subject_name: string;
  course_name: string;
  module_id: string;
  module_title: string;
  chapter_id?: string;
  lesson_id?: string;
  description: string;
  difficulty: string;
  estimated_time: string;
  status: 'NOT STARTED' | 'IN PROGRESS' | 'COMPLETED' | 'RECOMMENDED' | 'NEEDS REVIEW';
  content: string;
  code_language?: string;
  video_timestamp_seconds?: number;
  download_filename?: string;
  learning_objectives: string[];
  tags: string[];
}

export interface SubjectMaterialsSummaryData {
  subject_id: string;
  subject_name: string;
  total_materials_count: number;
  notes_count: number;
  videos_count: number;
  code_count: number;
  exercises_count: number;
  quizzes_count: number;
  projects_count: number;
  challenges_count: number;
  references_count: number;
  materials: MaterialItemData[];
}

export function useSubjectMaterials(subjectId: string = 'python') {
  const [data, setData] = useState<SubjectMaterialsSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterials = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.request<SubjectMaterialsSummaryData>(`/api/v1/materials/subjects/${subjectId}`);
      if (res.data) {
        setData(res.data);
      }
    } catch (err: any) {
      console.warn('Materials fetch fallback:', err);
    } finally {
      setIsLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const askAiAboutMaterial = async (materialId: string, userQuery: string) => {
    return api.request<{
      material_id: string;
      material_title: string;
      answer: string;
      grounded_quotes: string[];
      suggested_followups: string[];
    }>(`/api/v1/materials/${materialId}/ask-ai`, {
      method: 'POST',
      body: JSON.stringify({ material_id: materialId, user_query: userQuery }),
    });
  };

  return {
    materialsSummary: data,
    isLoading,
    error,
    refresh: fetchMaterials,
    askAiAboutMaterial,
  };
}
