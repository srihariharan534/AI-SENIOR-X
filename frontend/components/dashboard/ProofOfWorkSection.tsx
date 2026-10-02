'use client';

import React from 'react';
import Link from 'next/link';

interface ProofRecord {
  id: string;
  title: string;
  category: string;
  hash: string;
  dateVerified: string;
  status: 'VERIFIED' | 'IN_AUDIT';
  evaluated: boolean;
  demonstrated: boolean;
  applied: boolean;
}

const DEFAULT_PROOFS: ProofRecord[] = [
  {
    id: 'POW-8821',
    title: 'Python High-Throughput Stream Pipeline',
    category: 'Advanced Engineering',
    hash: 'sha256:4f8a92b...e01c',
    dateVerified: 'Sep 29, 2026',
    status: 'VERIFIED',
    evaluated: true,
    demonstrated: true,
    applied: true,
  },
  {
    id: 'POW-8820',
    title: 'SQL Partitioning & Analytical Windowing',
    category: 'Data Architecture',
    hash: 'sha256:1a93b4c...f982',
    dateVerified: 'Sep 24, 2026',
    status: 'VERIFIED',
    evaluated: true,
    demonstrated: true,
    applied: true,
  },
];

export const ProofOfWorkSection: React.FC = () => {
  return (
    <section className="border border-stone-800 bg-[#0d0f15] p-6 md:p-8 space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-stone-400">
            <span className="text-emerald-400 font-bold">● CRYPTOGRAPHIC ATTESTATION</span>
            <span className="text-stone-600">/</span>
            <span>PROOF OF WORK</span>
          </div>
          <h2 className="mt-2 text-2xl md:text-3xl font-serif text-stone-100 tracking-tight">
            Verified Artifact Ledger
          </h2>
          <p className="mt-1 text-xs text-stone-400 font-mono">
            Every credential and milestone backed by inspected source code, deterministic tests, and twin validation.
          </p>
        </div>

        <Link
          href="/certificates"
          className="inline-flex items-center gap-2 self-start font-mono text-xs text-stone-300 hover:text-emerald-400 border border-stone-700 px-3 py-1.5 transition-colors uppercase tracking-wider"
        >
          <span>VIEW ALL CERTIFICATES</span>
          <span>→</span>
        </Link>
      </div>

      {/* Grid of Verified Records */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEFAULT_PROOFS.map((proof) => (
          <div
            key={proof.id}
            className="border border-stone-800/90 bg-[#12151e] p-5 flex flex-col justify-between hover:border-stone-700 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between font-mono text-[10px] text-stone-500 mb-2">
                <span className="text-emerald-400 font-bold">✓ {proof.status}</span>
                <span className="text-stone-400">{proof.dateVerified}</span>
              </div>

              <div className="font-mono text-[11px] text-stone-400 uppercase tracking-wider">
                {proof.category}
              </div>
              <h3 className="font-serif text-lg text-stone-100 mt-1">{proof.title}</h3>

              {/* Three Checkpoints */}
              <div className="mt-4 flex items-center gap-4 text-xs font-mono">
                <span className="text-emerald-400 flex items-center gap-1">
                  <span>✓</span> Evaluated
                </span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span>✓</span> Demonstrated
                </span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span>✓</span> Applied
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-800/80 flex items-center justify-between font-mono text-[10px]">
              <span className="text-stone-400 font-mono">{proof.hash}</span>
              <Link
                href="/evidence"
                className="text-stone-300 hover:text-emerald-400 uppercase tracking-wider transition-colors"
              >
                VIEW EVIDENCE →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Certification Milestone Note */}
      <div className="bg-[#11141b] border border-stone-800/70 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-stone-300">
            Senior AI & Data Engineer Certificate unlocks upon completion of Module 24 & Final Capstone.
          </span>
        </div>
        <span className="text-stone-400 font-bold">18 / 24 MODULES VERIFIED</span>
      </div>
    </section>
  );
};
