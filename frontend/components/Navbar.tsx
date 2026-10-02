'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CommandPaletteModal } from '@/components/common/CommandPaletteModal';

interface NavbarProps {
  onToggleMobileSidebar?: () => void;
  isMobileSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileSidebar,
  isMobileSidebarOpen,
}) => {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { label: 'LEARNING', href: '/learn' },
    { label: 'TWIN', href: '/twin' },
    { label: 'PRACTICE', href: '/practice' },
    { label: 'PROJECTS', href: '/projects' },
    { label: 'EVIDENCE', href: '/evidence' },
  ];

  const displayName = user?.full_name?.split(' ')[0] || 'Srihari';

  return (
    <>
      <header className="sticky top-0 z-40 h-13 w-full bg-[#0a0c10] border-b border-stone-800 px-4 md:px-8 flex items-center justify-between text-xs select-none">
        {/* LEFT: AI-SENIOR-X [LEARNING OS] */}
        <div className="flex items-center gap-3">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="md:hidden p-1.5 text-stone-400 hover:text-white border border-stone-800"
              aria-label="Toggle navigation"
            >
              {isMobileSidebarOpen ? '✕' : '☰'}
            </button>
          )}

          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <span className="font-serif font-black text-sm tracking-tight text-stone-100 group-hover:text-white">
              AI-SENIOR-X
            </span>
            <span className="font-mono text-[10px] text-stone-400 bg-stone-900 border border-stone-800 px-1.5 py-0.5 tracking-wider uppercase">
              LEARNING OS
            </span>
          </Link>
        </div>

        {/* CENTER: Editorial Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 font-mono text-[11px] tracking-wider uppercase">
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`py-1 transition-colors ${
                  isActive
                    ? 'text-stone-100 border-b border-stone-100 font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: Learner State & Directive Search */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Quick Directive Command Launcher */}
          <button
            onClick={() => setIsCommandOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-[#12151e] border border-stone-800 px-2.5 py-1 text-stone-400 hover:text-stone-200 hover:border-stone-700 transition-colors font-mono text-[10px]"
            title="Open Directive Palette (Ctrl+K)"
          >
            <span>DIRECTIVES</span>
            <kbd className="bg-stone-900 px-1 py-0.2 border border-stone-800 text-[9px] text-stone-400">
              CTRL+K
            </kbd>
          </button>

          {/* Learner Profile State */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 py-1 px-2 border border-stone-800 bg-[#10131b] hover:border-stone-700 transition-colors font-mono text-[11px]"
            >
              <span className="font-bold text-stone-200">{displayName}</span>
              <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SYNCED
              </span>
              <span className="text-stone-400 text-[9px]">⌄</span>
            </button>

            {userDropdownOpen && (
              <div
                className="absolute right-0 mt-1 w-48 bg-[#0f1118] border border-stone-700 shadow-xl py-1 z-50 font-mono text-xs divide-y divide-stone-800"
                onClick={() => setUserDropdownOpen(false)}
              >
                <div className="px-3 py-2 text-[10px] text-stone-400 uppercase tracking-wider">
                  {user?.email || 'srihari@ai-senior-x.edu'}
                </div>
                <div className="py-1">
                  <Link
                    href="/settings"
                    className="block px-3 py-1.5 text-stone-300 hover:bg-[#181c26] hover:text-white"
                  >
                    SETTINGS
                  </Link>
                  <Link
                    href="/twin"
                    className="block px-3 py-1.5 text-stone-300 hover:bg-[#181c26] hover:text-white"
                  >
                    COGNITIVE TWIN
                  </Link>
                  <Link
                    href="/evidence"
                    className="block px-3 py-1.5 text-stone-300 hover:bg-[#181c26] hover:text-white"
                  >
                    EVIDENCE AUDIT
                  </Link>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => logout()}
                    className="w-full text-left px-3 py-1.5 text-rose-400 hover:bg-[#181c26]"
                  >
                    DISCONNECT
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Command Palette Modal */}
      <CommandPaletteModal isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </>
  );
};

export default Navbar;
