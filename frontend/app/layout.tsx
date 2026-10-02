'use client';

import React, { useState } from 'react';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AuthProvider } from '@/context/AuthContext';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Landing page and auth pages have minimal layouts without fixed application sidebar
  const isMinimalLayout =
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password' ||
    pathname?.startsWith('/auth/') ||
    pathname?.startsWith('/verify/') ||
    pathname?.startsWith('/onboarding');

  return (
    <html lang="en" className="dark">
      <head>
        <title>AI-SENIOR-X | The Adaptive AI Learning Twin & Intelligence Platform</title>
        <meta
          name="description"
          content="AI-SENIOR-X: Autonomous AI Learning Twin that understands what you know, diagnoses cognitive misconceptions, and adaptively coaches you to mastery."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="min-h-screen bg-[#07090d] text-stone-100 flex flex-col antialiased selection:bg-emerald-500/20 selection:text-emerald-200">
        <ErrorBoundary>
          <AuthProvider>
            <AuthGuard>
              {!isMinimalLayout ? (
                <div className="flex flex-col min-h-screen bg-[#07090d]">
                  <Navbar
                    onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                    isMobileSidebarOpen={mobileSidebarOpen}
                  />
                  <div className="flex flex-1 w-full">
                    <Sidebar
                      isOpen={mobileSidebarOpen}
                      onClose={() => setMobileSidebarOpen(false)}
                    />
                    <main className="flex-1 p-3 sm:p-5 lg:p-6 max-w-full overflow-x-hidden">
                      {children}
                    </main>
                  </div>
                </div>
              ) : (
                <main className="min-h-screen w-full bg-[#07090d]">{children}</main>
              )}
            </AuthGuard>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
