'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandAction {
  id: string;
  category: string;
  label: string;
  shortcut?: string;
  action: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const commands: CommandAction[] = [
    {
      id: 'resume-python',
      category: 'CONTINUE LEARNING',
      label: 'Continue Python: Advanced Functions (Lesson 07)',
      shortcut: '↵',
      action: () => {
        router.push('/learn/python');
        onClose();
      },
    },
    {
      id: 'rag-mission',
      category: 'ACTIVE MISSION',
      label: 'Start Next Best Action: Build RAG Evaluation Pipeline',
      shortcut: '↵',
      action: () => {
        router.push('/practice/rag-evaluation');
        onClose();
      },
    },
    {
      id: 'query-sql-weakness',
      category: 'AI DIAGNOSTIC',
      label: 'Why am I weak in SQL window functions?',
      shortcut: 'AI',
      action: () => {
        router.push('/tutor?q=Explain+my+SQL+window+functions+misconception');
        onClose();
      },
    },
    {
      id: 'explain-rag',
      category: 'AI TUTOR',
      label: 'Explain Dense vs Sparse retrieval tradeoffs',
      shortcut: 'AI',
      action: () => {
        router.push('/tutor?q=Explain+Dense+vs+Sparse+retrieval+tradeoffs');
        onClose();
      },
    },
    {
      id: 'view-twin',
      category: 'SYSTEM',
      label: 'Open Interactive Learning Twin & Constellation',
      shortcut: 'G T',
      action: () => {
        router.push('/twin');
        onClose();
      },
    },
    {
      id: 'view-evidence',
      category: 'EVIDENCE',
      label: 'Audit verified skill evidence & proof of work',
      shortcut: 'G E',
      action: () => {
        router.push('/evidence');
        onClose();
      },
    },
    {
      id: 'practice-ml',
      category: 'PRACTICE',
      label: 'Drill Machine Learning Model Evaluation Assessment',
      shortcut: '↵',
      action: () => {
        router.push('/practice/ml');
        onClose();
      },
    },
  ];

  const filtered = commands.filter(
    (c) =>
      c.label.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl border border-stone-700 bg-[#0e1017] shadow-2xl p-0 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center border-b border-stone-800 px-4 py-3.5 bg-[#12151e]">
          <span className="font-mono text-xs text-stone-500 mr-3">CMD &gt;</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="What do you want to learn? (e.g. 'Why am I weak in SQL', 'Continue Python')"
            autoFocus
            className="w-full bg-transparent text-sm text-stone-100 placeholder-stone-400 font-sans focus:outline-none"
          />
          <kbd className="font-mono text-[10px] bg-stone-900 border border-stone-700 px-1.5 py-0.5 text-stone-400">
            ESC
          </kbd>
        </div>

        {/* Command list */}
        <div className="max-h-96 overflow-y-auto divide-y divide-stone-800/60 p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-stone-500">
              No matching directives found. Try &ldquo;Python&rdquo;, &ldquo;RAG&rdquo;, or &ldquo;Tutor&rdquo;.
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full text-left p-3 hover:bg-[#181c26] flex items-center justify-between group transition-colors"
              >
                <div className="space-y-0.5">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400">
                    {item.category}
                  </span>
                  <div className="text-xs text-stone-200 group-hover:text-white font-medium">
                    {item.label}
                  </div>
                </div>
                {item.shortcut && (
                  <kbd className="font-mono text-[10px] text-stone-400 group-hover:text-stone-300 bg-stone-900/80 px-2 py-0.5 border border-stone-800">
                    {item.shortcut}
                  </kbd>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="border-t border-stone-800 bg-[#090b0f] px-4 py-2 flex items-center justify-between font-mono text-[10px] text-stone-400">
          <span>AI-SENIOR-X DIRECTIVE PALETTE</span>
          <span>PRESS ↵ TO EXECUTE</span>
        </div>
      </div>
    </div>
  );
};
