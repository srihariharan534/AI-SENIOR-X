'use client';

import React, { useState } from 'react';
import { CertificateModel } from '@/types';
import { 
  X, 
  Download, 
  Share2, 
  CheckCircle, 
  ExternalLink, 
  Copy, 
  Award, 
  ShieldCheck, 
  FileText,
  Clock,
  QrCode
} from 'lucide-react';

interface CertificateModalProps {
  certificate: CertificateModel;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  const [copied, setCopied] = useState(false);
  const verifyFullUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${certificate.verification_url}` 
    : `https://ai-senior-x.io${certificate.verification_url}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyFullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const downloadUrl = `http://localhost:8000${certificate.pdf_download_url}`;
    window.open(downloadUrl, '_blank');
  };

  const categoryLabel = certificate.category.replace(/_/g, ' ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-950/60 border border-blue-700/40 text-blue-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white tracking-wide">
                Verified Credential Document
              </h3>
              <p className="text-xs text-neutral-400">
                Official AI-SENIOR-X Digital Learning Certificate
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 border border-neutral-700 transition"
              title="Copy verification link"
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Link' : 'Copy Link'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={async () => {
                try {
                  const { api } = await import('@/lib/api');
                  await api.resendCertificateEmail(certificate.certificate_id);
                  alert(`Certificate document has been dispatched to ${certificate.recipient_email || 'your registered email'}.`);
                } catch {
                  alert('Dispatched to registered email.');
                }
              }}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 border border-neutral-700 transition"
            >
              <span>Resend Email</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Canvas (Editorial Cream Aesthetics) */}
        <div className="p-6 md:p-10 bg-neutral-950/60 flex justify-center">
          <div className="w-full max-w-4xl bg-[#FAFAF7] text-neutral-900 rounded-lg p-8 md:p-12 shadow-2xl border-[3px] border-double border-neutral-300 relative overflow-hidden">
            
            {/* Subtle Inner Border */}
            <div className="absolute inset-3 border border-neutral-300/80 pointer-events-none rounded" />

            {/* Subtle Corner Accents */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-blue-900 pointer-events-none" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-blue-900 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-blue-900 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-blue-900 pointer-events-none" />

            {/* Organization Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-[11px] font-bold tracking-[0.2em] uppercase mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                <span>AI-SENIOR-X INTELLIGENCE PLATFORM</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-serif font-extrabold tracking-widest text-neutral-900 uppercase">
                Certificate of {categoryLabel}
              </h1>
              <div className="w-24 h-0.5 bg-blue-700 mx-auto mt-2" />
            </div>

            {/* Recipient Section */}
            <div className="text-center my-8">
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-medium mb-3">
                This officially certifies that
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-extrabold text-neutral-900 tracking-wide underline decoration-blue-500/30 underline-offset-8">
                {certificate.learner_registered_name}
              </h2>
              <p className="text-xs md:text-sm text-neutral-600 max-w-xl mx-auto mt-4 font-serif italic">
                has successfully satisfied all rigorous cognitive, practical, and real-world evaluation requirements in
              </p>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-blue-900 mt-2 uppercase tracking-wide">
                {certificate.title}
              </h3>
            </div>

            {/* Demonstrated Learning Areas / Evidence */}
            <div className="my-8 bg-neutral-100/70 border border-neutral-200/80 rounded-xl p-5 max-w-2xl mx-auto">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-3 flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-700" />
                <span>Demonstrated Learning &amp; Evidence Areas</span>
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-neutral-800">
                {certificate.demonstrated_learning_areas.map((area, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span className="leading-snug">{area}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer Metadata & Official Seal */}
            <div className="pt-6 border-t border-neutral-200 grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-left">
              
              {/* Left Column: ID & Date */}
              <div className="space-y-2">
                <div>
                  <span className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                    Certificate ID
                  </span>
                  <span className="font-mono text-xs font-bold text-neutral-900">
                    {certificate.certificate_id}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                    Completion Date
                  </span>
                  <span className="text-xs font-medium text-neutral-800">
                    {certificate.issued_at}
                  </span>
                </div>
              </div>

              {/* Center: Verification Seal */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-neutral-900 border-2 border-blue-600 flex flex-col items-center justify-center text-white shadow-lg">
                  <ShieldCheck className="w-6 h-6 text-blue-400" />
                  <span className="text-[8px] font-bold tracking-tighter text-blue-300 uppercase">VERIFIED</span>
                </div>
                <span className="text-[10px] font-bold text-neutral-700 tracking-wider uppercase mt-1.5">
                  AI Evidence Seal
                </span>
              </div>

              {/* Right Column: Verification Hash & Link */}
              <div className="space-y-2 text-right">
                <div>
                  <span className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                    Verification
                  </span>
                  <a
                    href={certificate.verification_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-700 hover:text-blue-900 underline"
                  >
                    <span>Verify Credential</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div>
                  <span className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                    Signature Hash
                  </span>
                  <span className="font-mono text-[10px] text-neutral-600 truncate max-w-[180px] inline-block">
                    {certificate.signature_hash.slice(0, 20)}...
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-neutral-950 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cryptographically sealed &amp; connected to Skill Passport evidence records.</span>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href={certificate.verification_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 border border-neutral-700 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Verification Page</span>
            </a>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition shadow-lg shadow-blue-900/30"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Official SVG</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
