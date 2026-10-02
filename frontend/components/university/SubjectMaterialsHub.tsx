'use client';

import React, { useState, useMemo } from 'react';
import {
  useSubjectMaterials,
  MaterialItemData,
} from '@/hooks/useSubjectMaterials';
import { MaterialViewerModal } from './MaterialViewerModal';
import {
  Search,
  Filter,
  FileText,
  Video,
  Code2,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Layers,
  ArrowUpRight,
  Download,
  Bot,
  HelpCircle,
} from 'lucide-react';

interface SubjectMaterialsHubProps {
  subjectId: string;
  subjectName: string;
}

export const SubjectMaterialsHub: React.FC<SubjectMaterialsHubProps> = ({
  subjectId,
  subjectName,
}) => {
  const { materialsSummary, isLoading, askAiAboutMaterial } =
    useSubjectMaterials(subjectId);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedSort, setSelectedSort] = useState<string>('RECOMMENDED');
  const [activeMaterial, setActiveMaterial] = useState<MaterialItemData | null>(null);

  const filterOptions = [
    { id: 'ALL', label: `ALL (${materialsSummary?.total_materials_count || 0})` },
    { id: 'NOTES', label: `NOTES (${materialsSummary?.notes_count || 0})` },
    { id: 'AI_VIDEO', label: `VIDEOS (${materialsSummary?.videos_count || 0})` },
    { id: 'CODE', label: `CODE (${materialsSummary?.code_count || 0})` },
    { id: 'EXERCISES', label: `EXERCISES (${materialsSummary?.exercises_count || 0})` },
    { id: 'QUIZZES', label: `QUIZZES (${materialsSummary?.quizzes_count || 0})` },
    { id: 'REAL_WORLD_CHALLENGES', label: `PROJECTS & CAPSTONES (${(materialsSummary?.projects_count || 0) + (materialsSummary?.challenges_count || 0)})` },
    { id: 'REFERENCES', label: `REFERENCES (${materialsSummary?.references_count || 0})` },
  ];

  const filteredMaterials = useMemo(() => {
    if (!materialsSummary?.materials) return [];

    let list = materialsSummary.materials.filter((m) => {
      // Type filter
      if (selectedType !== 'ALL') {
        if (selectedType === 'REAL_WORLD_CHALLENGES') {
          if (m.material_type !== 'REAL_WORLD_CHALLENGES' && m.material_type !== 'PROJECTS') return false;
        } else if (m.material_type !== selectedType) {
          return false;
        }
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = m.title.toLowerCase().includes(q);
        const matchesDesc = m.description.toLowerCase().includes(q);
        const matchesModule = m.module_title.toLowerCase().includes(q);
        const matchesTags = m.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesModule && !matchesTags) {
          return false;
        }
      }

      return true;
    });

    // Sort
    if (selectedSort === 'DIFFICULTY') {
      const diffOrder: Record<string, number> = {
        Foundation: 1,
        Beginner: 2,
        Intermediate: 3,
        Advanced: 4,
        Expert: 5,
      };
      list.sort((a, b) => (diffOrder[a.difficulty] || 3) - (diffOrder[b.difficulty] || 3));
    } else if (selectedSort === 'MODULE') {
      list.sort((a, b) => a.module_id.localeCompare(b.module_id));
    }

    return list;
  }, [materialsSummary, selectedType, searchQuery, selectedSort]);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'NOTES':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 font-mono text-[10px] font-bold border border-blue-200 dark:border-blue-800">NOTES</span>;
      case 'AI_VIDEO':
        return <span className="px-2 py-0.5 bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 font-mono text-[10px] font-bold border border-purple-200 dark:border-purple-800">AI VIDEO</span>;
      case 'CODE':
        return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 font-mono text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">CODE</span>;
      case 'EXERCISES':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-mono text-[10px] font-bold border border-amber-200 dark:border-amber-800">EXERCISE</span>;
      case 'QUIZZES':
        return <span className="px-2 py-0.5 bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300 font-mono text-[10px] font-bold border border-rose-200 dark:border-rose-800">QUIZ</span>;
      case 'REAL_WORLD_CHALLENGES':
      case 'PROJECTS':
        return <span className="px-2 py-0.5 bg-stone-900 text-white dark:bg-white dark:text-stone-950 font-mono text-[10px] font-bold border border-stone-800">CAPSTONE</span>;
      default:
        return <span className="px-2 py-0.5 bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 font-mono text-[10px] font-bold">DOC</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="text-emerald-700 dark:text-emerald-400 font-mono text-[10px] font-bold flex items-center gap-1">
            <CheckCircle2 size={12} />
            <span>COMPLETED</span>
          </span>
        );
      case 'IN PROGRESS':
        return (
          <span className="text-blue-700 dark:text-blue-400 font-mono text-[10px] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span>IN PROGRESS</span>
          </span>
        );
      default:
        return (
          <span className="text-stone-400 font-mono text-[10px] font-medium">
            NOT STARTED
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Search & Material Filter Control Hub */}
      <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-blue-900 dark:text-blue-400 font-bold">
              <BookOpen size={15} />
              <span>{subjectName} // SUBJECT MATERIALS LIBRARY</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-white mt-1">
              Course Notes, Video Lectures, Code, Quizzes & References
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-stone-500">SORT:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="px-3 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs font-mono text-stone-800 dark:text-stone-200 focus:outline-none"
            >
              <option value="RECOMMENDED">Recommended</option>
              <option value="MODULE">By Module</option>
              <option value="DIFFICULTY">By Difficulty</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${subjectName} materials, notes, code snippets, quizzes, or topics...`}
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 text-xs sm:text-sm font-sans text-stone-900 dark:text-white focus:outline-none focus:border-blue-600 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-stone-100 dark:border-stone-800">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedType(opt.id)}
              className={`px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider transition-colors border ${
                selectedType === opt.id
                  ? 'bg-stone-900 text-white border-stone-900 dark:bg-white dark:text-stone-950 dark:border-white'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:border-stone-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Materials Grid */}
      {isLoading ? (
        <div className="p-12 text-center font-mono text-sm text-stone-500 animate-pulse bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800">
          Indexing and loading {subjectName} learning materials...
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 space-y-3">
          <div className="text-base font-serif font-bold text-stone-900 dark:text-white">
            No materials found matching your search.
          </div>
          <p className="text-xs text-stone-500 font-sans">
            Try adjusting your search query or selecting a different material type filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedType('ALL');
            }}
            className="px-4 py-2 bg-stone-900 text-white font-mono text-xs font-bold uppercase"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((mat) => (
            <div
              key={mat.id}
              className="p-5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 flex flex-col justify-between space-y-4 hover:border-stone-900 dark:hover:border-stone-400 transition-all hover:shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  {getTypeBadge(mat.material_type)}
                  {getStatusBadge(mat.status)}
                </div>

                <div>
                  <div className="text-[10px] font-mono text-stone-400 uppercase truncate">
                    {mat.module_title}
                  </div>
                  <h4 className="text-base font-serif font-bold text-stone-900 dark:text-white mt-1 leading-snug">
                    {mat.title}
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-sans line-clamp-2 mt-2 leading-relaxed">
                    {mat.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-stone-100 dark:border-stone-800">
                <div className="flex items-center justify-between text-[11px] font-mono text-stone-500">
                  <span>{mat.estimated_time}</span>
                  <span className="uppercase">{mat.difficulty}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setActiveMaterial(mat)}
                    className="w-full py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-950 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>{mat.material_type === 'AI_VIDEO' ? 'WATCH' : mat.material_type === 'CODE' ? 'OPEN CODE' : 'STUDY'}</span>
                    <ArrowUpRight size={12} />
                  </button>

                  <button
                    onClick={() => setActiveMaterial(mat)}
                    className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-blue-900 dark:text-blue-300 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-blue-200 dark:border-stone-700 transition-colors"
                  >
                    <Bot size={12} className="text-blue-700" />
                    <span>ASK AI</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dedicated Learning Material Viewer Modal */}
      {activeMaterial && (
        <MaterialViewerModal
          material={activeMaterial}
          onClose={() => setActiveMaterial(null)}
          onAskAi={askAiAboutMaterial}
        />
      )}
    </div>
  );
};
