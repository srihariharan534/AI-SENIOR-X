'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ message = 'Synchronizing learning state...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        gap: '1rem',
      }}
    >
      <Loader2
        size={36}
        color="var(--accent-indigo)"
        style={{
          animation: 'spin 1s linear infinite',
        }}
      />
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{message}</p>
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
