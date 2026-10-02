'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/api';
import { LearnerProfile, User } from '@/types';

export interface AuthContextType {
  user: User | null;
  profile: LearnerProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (emailOrUsername: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  register: (payload: {
    email: string;
    password: string;
    full_name: string;
    username?: string;
    learning_goal?: string;
    grade_level?: string;
    preferred_language?: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/auth/login',
  '/auth/signup',
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = useCallback(async () => {
    const token = api.getToken();
    if (!token) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.getMe();
      if (res.success && res.data) {
        setUser(res.data);
        if (res.data.learner_profile) {
          setProfile(res.data.learner_profile);
        }
      } else {
        // Invalid or expired token
        api.setToken(null);
        setUser(null);
        setProfile(null);
      }
    } catch (err: unknown) {
      console.warn('Authentication verification check:', err);
      api.setToken(null);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (emailOrUsername: string, password: string, rememberMe = false): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.login({ email: emailOrUsername.trim(), password, remember_me: rememberMe });
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        if (res.data.user.learner_profile) {
          setProfile(res.data.user.learner_profile);
        }
        return true;
      } else {
        const errCode = res.error?.code || '';
        const errorMsg = res.error?.message || '';

        if (errCode === 'BACKEND_OFFLINE' || errorMsg.includes('Cannot connect to AI-SENIOR-X backend') || errorMsg.includes('Failed to fetch')) {
          setError('Cannot connect to AI-SENIOR-X backend. Start the FastAPI server on port 8000.');
        } else if (errCode === 'INVALID_CREDENTIALS' || errCode === 'HTTP_401' || errorMsg.toLowerCase().includes('invalid')) {
          setError('Email/username or password is incorrect.');
        } else if (errCode === 'SERVER_ERROR' || errCode.startsWith('HTTP_5')) {
          setError('AI-SENIOR-X encountered a server error. Please try again.');
        } else if (errCode === 'NETWORK_ERROR') {
          setError('Unable to reach the AI-SENIOR-X backend.');
        } else {
          setError(errorMsg || 'Email/username or password is incorrect.');
        }
        return false;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('fetch') || msg.includes('network') || msg.includes('offline')) {
        setError('Cannot connect to AI-SENIOR-X backend. Start the FastAPI server on port 8000.');
      } else {
        setError('Unable to reach the AI-SENIOR-X backend.');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: {
    email: string;
    password: string;
    full_name: string;
    username?: string;
    learning_goal?: string;
    grade_level?: string;
    preferred_language?: string;
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.register(payload);
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        if (res.data.user.learner_profile) {
          setProfile(res.data.user.learner_profile);
        }
        return true;
      } else {
        setError(res.error?.message || 'Registration failed. Please check details and try again.');
        return false;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error during registration.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      api.setToken(null);
    }
    setUser(null);
    setProfile(null);
    router.push('/login');
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.forgotPassword(email.trim());
      if (res.success && res.data) {
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.error?.message || 'Failed to dispatch reset link.' };
    } catch (err: unknown) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.resetPassword({ token: token.trim(), new_password: newPassword });
      if (res.success && res.data) {
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.error?.message || 'Failed to reset password.' };
    } catch (err: unknown) {
      return { success: false, message: 'Network error during password reset.' };
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser: fetchCurrentUser,
        forgotPassword,
        resetPassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
