'use client';

import React from 'react';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';
import { ProofOfSkillRecord } from '@/types';

interface ProofOfSkillProps {
  proofRecords: ProofOfSkillRecord[];
}

export const ProofOfSkill: React.FC<ProofOfSkillProps> = ({ proofRecords }) => {
  const [copiedHash, setCopiedHash] = React.useState<string | null>(null);

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Award size={18} className="text-purple-400" />
          <h4 className="text-sm font-bold text-white">Verifiable Proof-of-Skill Records</h4>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Cryptographically Signed Evidence
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {proofRecords.map((rec) => (
          <div
            key={rec.proof_id}
            className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-purple-950/20 border border-purple-500/30 shadow-xl space-y-4 relative overflow-hidden"
          >
            {/* Top Verified Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider block">
                    {rec.verified_status}
                  </span>
                  <h4 className="text-sm font-bold text-white">{rec.skill_name}</h4>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-500">{rec.verified_date}</span>
            </div>

            {/* Demonstrated Capabilities List */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Demonstrated Capabilities:
              </span>
              <ul className="space-y-1">
                {rec.capabilities_demonstrated.map((cap, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Verification Hash & Citations Footer */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-900 flex items-center justify-between gap-3 text-xs font-mono">
              <div className="truncate">
                <span className="text-[9px] text-slate-500 block">Verification Hash</span>
                <span className="text-[11px] text-purple-300 truncate block max-w-xs">{rec.verifiable_hash}</span>
              </div>
              <button
                onClick={() => handleCopy(rec.verifiable_hash)}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                title="Copy verification hash"
              >
                {copiedHash === rec.verifiable_hash ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
