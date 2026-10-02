'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Brain } from 'lucide-react';

const PUBLIC_PREFIXES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify',
  '/auth/',
];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublicRoute =
    pathname === '/' ||
    PUBLIC_PREFIXES.some((prefix) => pathname?.startsWith(prefix));

  useEffect(() => {
    if (loading) return;

    // 1. Unauthenticated users trying to access protected routes -> redirect to /login
    if (!isAuthenticated && !isPublicRoute) {
      const redirectUrl = pathname ? `/login?redirect=${encodeURIComponent(pathname)}` : '/login';
      router.replace(redirectUrl);
      return;
    }

    // 2. Authenticated users opening login/register pages -> redirect to /dashboard
    if (
      isAuthenticated &&
      (pathname === '/login' ||
        pathname === '/register' ||
        pathname === '/auth/login' ||
        pathname === '/auth/signup' ||
        pathname === '/forgot-password' ||
        pathname === '/reset-password')
    ) {
      router.replace('/dashboard');
      return;
    }
  }, [isAuthenticated, loading, isPublicRoute, pathname, router]);

  // Loading state for protected routes
  if (loading && !isPublicRoute) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex flex-col items-center justify-center p-6 text-stone-900">
        <div className="flex flex-col items-center gap-4 max-w-sm text-center animate-fade-in">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 animate-pulse">
            <Brain size={26} className="text-white" />
          </div>
          <div className="space-y-1">
            <h2 className="font-serif text-lg font-bold text-stone-900">AI-SENIOR-X</h2>
            <p className="text-xs font-mono text-stone-500 uppercase tracking-widest">
              Verifying Learning Identity...
            </p>
          </div>
          <div className="w-48 h-1 bg-stone-200 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-blue-600 rounded-full animate-indeterminate" />
          </div>
        </div>
      </div>
    );
  }

  // Block protected content if not authenticated
  if (!isAuthenticated && !isPublicRoute) {
    return null;
  }

  return <>{children}</>;
}
