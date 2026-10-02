'use client';

import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      className="glass-card"
      style={{
        maxWidth: '550px',
        margin: '3rem auto',
        padding: '2.5rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'rgba(244, 63, 94, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto',
        }}
      >
        <AlertCircle size={22} color="#f43f5e" />
      </div>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Failed to Load Resource</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        {error.message || 'An error occurred during application data retrieval.'}
      </p>
      <button className="btn-primary" onClick={() => reset()}>
        <RotateCcw size={16} />
        <span>Retry</span>
      </button>
    </div>
  );
}
