'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export const AskFloatingControl: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/tutor?q=${encodeURIComponent(query)}`);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen ? (
        <div className="w-80 md:w-96 border border-stone-700 bg-[#0e1017] shadow-2xl p-4 space-y-3 animate-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-stone-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>AI-SENIOR-X TUTOR</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-stone-200 font-mono text-xs px-1"
            >
              ✕
            </button>
          </div>

          <div className="text-xs text-stone-300 font-serif">
            What concept or error are you stuck on right now?
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Why does my vector index return low recall on short queries?"
              rows={3}
              autoFocus
              className="w-full bg-[#141722] border border-stone-800 p-2 text-xs text-stone-100 placeholder-stone-500 font-sans focus:outline-none focus:border-stone-600 resize-none"
            />
            <button
              type="submit"
              className="w-full font-mono text-xs font-semibold px-3 py-2 bg-stone-100 hover:bg-white text-stone-950 uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <span>CONSULT TUTOR</span>
              <span>→</span>
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 bg-[#11141c] hover:bg-[#161a24] border border-stone-700 text-stone-200 px-4 py-2.5 shadow-xl transition-all hover:border-stone-500 font-mono text-xs"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="tracking-wider uppercase font-semibold">ASK AI-SENIOR-X</span>
          <span className="text-stone-400 text-[10px] bg-stone-800 px-1.5 py-0.5 border border-stone-700">
            CTRL+K
          </span>
        </button>
      )}
    </div>
  );
};
