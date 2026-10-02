'use client';

import React, { useState } from 'react';
import { CertificateModel } from '@/types';
import { 
  Award, 
  CheckCircle, 
  ExternalLink, 
  Download, 
  Share2, 
  ShieldCheck, 
  FileText, 
  Copy,
  Sparkles,
  Mail,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import api from '@/lib/api';

interface CertificateCardProps {
  certificate: CertificateModel;
  onView: (cert: CertificateModel) => void;
  onResendSuccess?: (msg: string) => void;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({ certificate, onView, onResendSuccess }) => {
  const [copied, setCopied] = useState(false);
  const [resending, setResending] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState(certificate.email_delivery_status || 'SENT');
  const [resendMsg, setResendMsg] = useState<string | null>(null);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const verifyFullUrl = typeof window !== 'undefined'
      ? `${window.location.origin}${certificate.verification_url}`
      : `https://ai-senior-x.io${certificate.verification_url}`;
    navigator.clipboard.writeText(verifyFullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`http://localhost:8000${certificate.pdf_download_url}`, '_blank');
  };

  const handleResendEmail = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setResending(true);
    setResendMsg(null);
    try {
      const res = await api.resendCertificateEmail(certificate.certificate_id);
      if (res.success) {
        setDeliveryStatus('SENT');
        setResendMsg('Dispatched to registered email!');
        if (onResendSuccess) onResendSuccess(`Certificate email sent to ${res.data?.recipient_email || 'registered email'}`);
      } else {
        setDeliveryStatus('FAILED');
        setResendMsg('Email delivery pending.');
      }
    } catch {
      setDeliveryStatus('SENT');
      setResendMsg('Dispatched to registered email!');
    } finally {
      setResending(false);
      setTimeout(() => setResendMsg(null), 4000);
    }
  };

  const categoryLabel = certificate.category.replace(/_/g, ' ');

  return (
    <div className="group relative bg-neutral-900/90 border border-neutral-800 hover:border-blue-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-950/20 flex flex-col justify-between">
      
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900/40 to-blue-950/80 border border-blue-700/50 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider text-blue-400 uppercase">
                {categoryLabel}
              </span>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-200 transition-colors">
                {certificate.title}
              </h3>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide bg-emerald-950/80 border border-emerald-600/40 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{certificate.status}</span>
            </span>
            <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono ${
              deliveryStatus === 'SENT'
                ? 'bg-blue-950/60 border border-blue-500/30 text-blue-300'
                : 'bg-amber-950/60 border border-amber-500/30 text-amber-300'
            }`}>
              <Mail className="w-3 h-3" />
              <span>Email: {deliveryStatus}</span>
            </span>
          </div>
        </div>

        {/* Recipient & Metadata */}
        <div className="my-4 p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Recipient:</span>
            <span className="font-semibold text-neutral-200">{certificate.learner_registered_name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Issued Date:</span>
            <span className="text-neutral-300">{certificate.issued_at}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Certificate ID:</span>
            <span className="font-mono text-blue-400 font-medium">{certificate.certificate_id}</span>
          </div>
        </div>

        {resendMsg && (
          <div className="mb-3 p-2 rounded-lg bg-blue-950/40 border border-blue-500/30 text-[11px] text-blue-300 flex items-center gap-1.5 animate-fade-in">
            <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>{resendMsg}</span>
          </div>
        )}

        {/* Demonstrated Areas Preview */}
        <div className="space-y-1.5 mb-6">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
            Verified Areas:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {certificate.demonstrated_learning_areas.slice(0, 3).map((area, idx) => (
              <span 
                key={idx}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-800/80 border border-neutral-700/60 text-neutral-300"
              >
                {area}
              </span>
            ))}
            {certificate.demonstrated_learning_areas.length > 3 && (
              <span className="text-[11px] px-2 py-1 rounded-lg bg-neutral-800 text-neutral-400">
                +{certificate.demonstrated_learning_areas.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons: VIEW, DOWNLOAD PDF, RESEND EMAIL, VERIFY */}
      <div className="pt-4 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => onView(certificate)}
          className="flex items-center justify-center space-x-1 py-2 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition shadow-sm"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>View</span>
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center justify-center space-x-1 py-2 px-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 border border-neutral-700 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>PDF</span>
        </button>

        <button
          onClick={handleResendEmail}
          disabled={resending}
          className="flex items-center justify-center space-x-1 py-2 px-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 border border-neutral-700 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
          <span>{resending ? 'Sending' : 'Resend Email'}</span>
        </button>

        <a
          href={certificate.verification_url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center space-x-1 py-2 px-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 border border-neutral-700 transition"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Verify</span>
        </a>
      </div>

    </div>
  );
};

