'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  ShieldCheck, 
  XCircle, 
  CheckCircle2, 
  Award, 
  Download, 
  ExternalLink, 
  FileText, 
  Lock, 
  RefreshCw,
  QrCode
} from 'lucide-react';
import api from '@/lib/api';
import { CertificateVerificationResponse } from '@/types';

export default function CertificateVerificationPage() {
  const params = useParams();
  const certificateId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  
  const [verification, setVerification] = useState<CertificateVerificationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!certificateId) return;

    const verify = async () => {
      setLoading(true);
      try {
        const res = await api.verifyCertificate(certificateId);
        if (res.success && res.data) {
          setVerification(res.data);
        } else {
          setError(res.error?.message || 'Certificate verification failed.');
        }
      } catch (err: any) {
        setError(err.message || 'Unable to connect to verification authority.');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [certificateId]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between p-6 md:p-12">
      
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-neutral-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-600/40 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-widest text-blue-400 uppercase">
              AI-SENIOR-X Registry
            </span>
            <h1 className="text-lg font-bold text-white">
              Official Credential Verification Service
            </h1>
          </div>
        </div>

        <a
          href="/certificates"
          className="text-xs font-semibold text-neutral-400 hover:text-white transition"
        >
          Learner Dashboard →
        </a>
      </div>

      {/* Main Verification Card */}
      <div className="max-w-3xl mx-auto w-full my-8">
        {loading ? (
          <div className="p-16 text-center rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-2xl">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
            <p className="text-sm font-medium text-neutral-300">
              Querying cryptographic evidence database for <span className="font-mono text-blue-400">{certificateId}</span>...
            </p>
          </div>
        ) : error || !verification || !verification.is_valid ? (
          <div className="p-10 rounded-3xl bg-neutral-900 border border-rose-900/60 space-y-6 shadow-2xl">
            <div className="flex items-center space-x-3 text-rose-400">
              <XCircle className="w-8 h-8" />
              <div>
                <h2 className="text-xl font-bold">Unverified or Revoked Credential</h2>
                <p className="text-xs text-rose-300/80">Certificate ID: {certificateId}</p>
              </div>
            </div>

            <p className="text-sm text-neutral-300 leading-relaxed">
              {verification?.revocation_reason || 'This certificate identifier could not be validated against the official AI-SENIOR-X Cryptographic Evidence Engine. The credential may have been revoked or never issued.'}
            </p>

            <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs text-neutral-400 space-y-1">
              <div><strong>Status:</strong> {verification?.status || 'NOT_FOUND'}</div>
              <div><strong>Authority:</strong> AI-SENIOR-X Cryptographic Evidence Engine</div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden">
            
            {/* Status Header */}
            <div className="p-6 bg-gradient-to-r from-emerald-950/80 to-neutral-900 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Certificate Status:
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {verification.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Verified by AI-SENIOR-X Cryptographic Evidence Registry
                  </p>
                </div>
              </div>

              <a
                href={`http://localhost:8000/api/v1/certificates/${certificateId}/pdf`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download SVG Document</span>
              </a>
            </div>

            {/* Credential Data Grid */}
            <div className="p-8 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Recipient */}
                <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Verified Recipient
                  </span>
                  <span className="text-xl font-serif font-bold text-white tracking-wide">
                    {verification.recipient_name}
                  </span>
                  <p className="text-[11px] text-neutral-500">
                    Identity verified via AI-SENIOR-X learner profile.
                  </p>
                </div>

                {/* Achievement */}
                <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Verified Achievement
                  </span>
                  <span className="text-xl font-serif font-bold text-blue-400">
                    {verification.achievement_title}
                  </span>
                  <p className="text-[11px] text-neutral-500">
                    Category: {verification.category.replace(/_/g, ' ')}
                  </p>
                </div>

              </div>

              {/* Demonstrated Areas */}
              <div className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 block flex items-center space-x-1.5">
                  <Award className="w-3.5 h-3.5 text-blue-400" />
                  <span>Demonstrated Learning Areas</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {verification.demonstrated_learning_areas.map((area, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-neutral-300">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cryptographic Proof Details */}
              <div className="pt-4 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Certificate ID</span>
                  <span className="font-mono text-neutral-200 font-medium">{verification.certificate_id}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Issuance Date</span>
                  <span className="text-neutral-200 font-medium">{verification.issued_at}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Issuing Organization</span>
                  <span className="text-neutral-200">{verification.issuing_organization}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-semibold">SHA-256 Signature Hash</span>
                  <span className="font-mono text-[11px] text-blue-400 truncate block">
                    {verification.signature_hash}
                  </span>
                </div>
              </div>

            </div>

            {/* Privacy Protection Notice */}
            <div className="p-4 bg-neutral-950 border-t border-neutral-800 text-center text-xs text-neutral-500">
              <span className="inline-flex items-center space-x-1">
                <Lock className="w-3 h-3 text-neutral-400" />
                <span>Privacy Notice: AI-SENIOR-X does not disclose private study sessions, chat logs, or quiz attempts to public viewers.</span>
              </span>
            </div>

          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto w-full text-center text-xs text-neutral-500 pt-6 border-t border-neutral-900">
        AI-SENIOR-X Intelligence Platform &copy; 2026. All rights reserved.
      </div>

    </div>
  );
}
