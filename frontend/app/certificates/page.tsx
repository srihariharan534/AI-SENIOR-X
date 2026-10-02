'use client';

import React, { useEffect, useState } from 'react';
import { 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  FileText, 
  BookOpen, 
  Layers, 
  RefreshCw,
  Search,
  Lock
} from 'lucide-react';
import api from '@/lib/api';
import { CertificateModel, CertificateEligibilityCriteria } from '@/types';
import { CertificateCard } from '@/components/certificates/CertificateCard';
import { CertificateModal } from '@/components/certificates/CertificateModal';
import { EligibilityCheckCard } from '@/components/certificates/EligibilityCheckCard';

const COURSES_TO_CHECK = [
  'python-foundations',
  'sql-analytics',
  'machine-learning-foundations',
  'ai-project-portfolio',
];

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateModel[]>([]);
  const [eligibilities, setEligibilities] = useState<CertificateEligibilityCriteria[]>([]);
  const [selectedCert, setSelectedCert] = useState<CertificateModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'earned' | 'tracks' | 'proof'>('earned');
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch earned certificates
      const certRes = await api.listCertificates();
      if (certRes.success && certRes.data) {
        setCertificates(certRes.data);
      }

      // 2. Fetch eligibility for all registered courses
      const eligList: CertificateEligibilityCriteria[] = [];
      for (const courseId of COURSES_TO_CHECK) {
        const eligRes = await api.checkCertificateEligibility(courseId);
        if (eligRes.success && eligRes.data) {
          eligList.push(eligRes.data);
        }
      }
      setEligibilities(eligList);
    } catch (err) {
      console.error('Failed to load certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerateCertificate = async (courseId: string, customName?: string) => {
    setGeneratingId(courseId);
    try {
      const res = await api.generateCertificate({
        course_id: courseId,
        custom_registered_name: customName,
      });

      if (res.success && res.data) {
        setNotification({
          type: 'success',
          message: `Certificate for '${res.data.title}' issued successfully!`,
        });
        await fetchData();
        setSelectedCert(res.data);
      } else {
        setNotification({
          type: 'error',
          message: res.error?.message || 'Certificate generation failed eligibility criteria.',
        });
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: 'An unexpected error occurred during certificate generation.',
      });
    } finally {
      setGeneratingId(null);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-blue-950/60 border border-neutral-800 p-8 md:p-10 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-600/40 text-blue-400 text-xs font-bold tracking-wider uppercase">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Verified Proof-of-Competency</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Verified Learning Certificates
            </h1>
            <p className="text-sm md:text-base text-neutral-300 leading-relaxed font-normal">
              AI-SENIOR-X certificates are strictly earned through verified lesson mastery, rigorous test-case assessments, and real-world mission evaluations. Bound cryptographically to your registered profile.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-center min-w-[110px]">
              <span className="block text-2xl font-black text-blue-400 font-mono">
                {certificates.length}
              </span>
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Earned
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-center min-w-[110px]">
              <span className="block text-2xl font-black text-emerald-400 font-mono">
                100%
              </span>
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Integrity
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between animate-in fade-in slide-in-from-top-2 ${
          notification.type === 'success' 
            ? 'bg-emerald-950/60 border-emerald-600/50 text-emerald-200' 
            : 'bg-rose-950/60 border-rose-600/50 text-rose-200'
        }`}>
          <div className="flex items-center space-x-3">
            {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <ShieldCheck className="w-5 h-5 text-rose-400" />}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="text-xs font-semibold underline hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-neutral-800 pb-2">
        <button
          onClick={() => setActiveTab('earned')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
            activeTab === 'earned'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Earned Certificates ({certificates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tracks')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
            activeTab === 'tracks'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Track Eligibility &amp; Gating</span>
        </button>

        <button
          onClick={() => setActiveTab('proof')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
            activeTab === 'proof'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Certificate vs. Proof of Skill</span>
        </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-sm text-neutral-400 font-medium">Verifying credential registry and eligibility states...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: EARNED CERTIFICATES */}
          {activeTab === 'earned' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-wide">
                    My Verified Credentials
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Click any certificate to view high-resolution editorial rendering or download official vector/PDF.
                  </p>
                </div>
                <button
                  onClick={fetchData}
                  className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {certificates.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-3">
                  <Award className="w-12 h-12 text-neutral-600 mx-auto" />
                  <h3 className="text-base font-bold text-neutral-300">No Certificates Earned Yet</h3>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto">
                    Complete all lessons, pass assessments, and submit real-world challenges in the Track Eligibility tab to earn your first verified credential.
                  </p>
                  <button
                    onClick={() => setActiveTab('tracks')}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition"
                  >
                    View Available Tracks
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {certificates.map((cert) => (
                    <CertificateCard
                      key={cert.certificate_id}
                      certificate={cert}
                      onView={(c) => setSelectedCert(c)}
                      onResendSuccess={(msg) => setNotification({ type: 'success', message: msg })}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TRACK ELIGIBILITY GATING */}
          {activeTab === 'tracks' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white tracking-wide">
                  Real-World Completion &amp; Eligibility Gating
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  AI-SENIOR-X does not grant certificates for passive viewing or clicking complete. Review your exact criteria breakdown below.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {eligibilities.map((elig) => (
                  <EligibilityCheckCard
                    key={elig.course_id}
                    eligibility={elig}
                    onGenerate={handleGenerateCertificate}
                    isGenerating={generatingId === elig.course_id}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CERTIFICATE + PROOF OF SKILL */}
          {activeTab === 'proof' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              <div className="p-8 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-950/60 border border-blue-700/50 flex items-center justify-center text-blue-400">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Certificate of Achievement</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Confirms that a defined achievement requirement or milestone (e.g. <em>Python Foundations</em> or <em>SQL Analytics</em>) was completed and satisfied according to rigorous standards.
                </p>
                <ul className="text-xs text-neutral-400 space-y-2 pt-2 border-t border-neutral-800">
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>High-level summary of verified milestone</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>Contains unique verifiable Certificate ID and digital seal</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>Suitable for resumes, LinkedIn, and employer verification</span>
                  </li>
                </ul>
              </div>

              <div className="p-8 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-700/50 flex items-center justify-center text-emerald-400">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Proof of Skill (Evidence Engine)</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Shows the granular evidence, code submissions, test benchmarks, independence levels, and cognitive retention graphs behind every demonstrated skill.
                </p>
                <ul className="text-xs text-neutral-400 space-y-2 pt-2 border-t border-neutral-800">
                  <li className="flex items-center space-x-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Granular code diffs, query plans, and unit test results</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Delayed retention and transfer test ratings</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Role-gap analysis against target careers</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <a
                    href="/projects"
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition shadow-sm"
                  >
                    <span>View Real-World Projects</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>
          )}
        </>
      )}

      {/* Full Resolution Editorial Certificate Modal */}
      {selectedCert && (
        <CertificateModal
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}

    </div>
  );
}
