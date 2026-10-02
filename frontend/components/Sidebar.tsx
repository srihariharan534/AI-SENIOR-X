'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavRailItem {
  num: string;
  label: string;
  href: string;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const pathname = usePathname();

  const mainRailItems: NavRailItem[] = [
    { num: '01', label: 'DASHBOARD', href: '/dashboard' },
    { num: '02', label: 'COURSES', href: '/courses' },
    { num: '03', label: 'SUBJECTS', href: '/subjects' },
    { num: '04', label: 'CURRICULUM', href: '/learn' },
    { num: '05', label: 'AI TUTOR', href: '/tutor', badge: 'LIVE' },
    { num: '06', label: 'PRACTICE', href: '/practice' },
    { num: '07', label: 'ASSESSMENTS', href: '/assessments' },
    { num: '08', label: 'PROJECTS', href: '/projects' },
    { num: '09', label: 'SIMULATIONS', href: '/scenarios' },
    { num: '10', label: 'COGNITIVE TWIN', href: '/twin' },
    { num: '11', label: 'JOB READINESS', href: '/evidence' },
    { num: '12', label: 'CERTIFICATES', href: '/certificates' },
  ];

  const bottomItems: NavRailItem[] = [
    { num: '•', label: 'SETTINGS', href: '/settings' },
  ];

  const sidebarContent = (
    <aside className="w-60 bg-[#080a0e] border-r border-stone-800/80 flex flex-col justify-between py-5 px-3 h-[calc(100vh-3.25rem)] sticky top-13 select-none font-mono text-xs overflow-y-auto">
      <div className="space-y-4">
        {/* Rail Heading */}
        <div className="px-3 text-[10px] uppercase tracking-widest text-stone-400 font-semibold border-b border-stone-800/60 pb-2 flex items-center justify-between">
          <span>OPERATING RAIL</span>
          <span className="text-emerald-400 text-[9px] font-bold">12 TRACKS</span>
        </div>

        {/* Numbered Navigation Items */}
        <nav className="space-y-0.5">
          {mainRailItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && item.href !== '/dashboard' && pathname?.startsWith(`${item.href}`));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2 transition-colors group ${
                  isActive
                    ? 'bg-[#141722] text-stone-100 border-l-2 border-indigo-400 font-bold'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-[#10131b]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`text-[10px] ${isActive ? 'text-cyan-400 font-bold' : 'text-stone-500 group-hover:text-stone-400'}`}>
                    {item.num}
                  </span>
                  <span className="tracking-wider text-[11px] truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[8px] font-bold px-1.5 py-0.2 bg-stone-900 border border-stone-700 text-amber-300">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Rail items: SETTINGS / VERSION */}
      <div className="space-y-3 pt-3 border-t border-stone-800/60">
        <div className="space-y-0.5">
          {bottomItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-1.5 text-xs transition-colors ${
                  isActive
                    ? 'text-stone-100 font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <span className="text-stone-500">{item.num}</span>
                <span className="tracking-wider text-[11px]">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="px-3 pt-2 text-[10px] text-stone-500 flex items-center justify-between border-t border-stone-800/40">
          <span>AI-SENIOR-X</span>
          <span className="text-cyan-400 font-bold">UNIVERSITY OS</span>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Navigation Rail */}
      <div className="hidden md:block">{sidebarContent}</div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
          <div className="relative z-10 w-64 h-full bg-[#080a0e] border-r border-stone-800">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
