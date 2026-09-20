import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import { Certificate } from '../types';
import { CertificateModal } from './CertificateModal';
import {
  Award,
  Search,
  Printer,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const CertificatesView: React.FC = () => {
  const { currentUser, certificates, viewingCertificate, setViewingCertificate, setActiveTab } = useCampus();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter certificates for current student
  const studentCerts = certificates.filter(
    (c) =>
      c.studentId === currentUser.id ||
      currentUser.role === 'admin' ||
      currentUser.role === 'organizer'
  );

  const filteredCerts = studentCerts.filter(
    (c) =>
      c.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.certificateNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.organizingClub.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-400/30">
            <Award className="w-3.5 h-3.5" />
            <span>Official Credentials</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Verified Event Certificates
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
            Tamper-proof verifiable completion credentials issued automatically upon QR pass check-in at eligible campus workshops, hackathons, and symposiums.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Total Issued: <strong className="text-white">{studentCerts.length} Certificates</strong></span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Credit Value: <strong className="text-white">{studentCerts.reduce((acc, c) => acc + c.creditPoints, 0)} Points</strong></span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="cert-search-input"
            type="text"
            placeholder="Search certificates by title, club or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition shadow-sm"
          />
        </div>

        <button
          onClick={() => setActiveTab('explore')}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition"
        >
          Attend More Events
        </button>
      </div>

      {/* Certificates Grid */}
      {filteredCerts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert) => (
            <div
              key={cert.id}
              id={`certificate-card-${cert.id}`}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Corner Badge */}
              <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
                <div className="bg-amber-500 text-white text-[9px] font-bold py-1 px-8 transform rotate-45 translate-x-7 translate-y-3 text-center uppercase tracking-wider shadow-sm">
                  Verified
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-slate-500">
                    {cert.certificateNo}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition leading-snug">
                  {cert.eventTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{cert.organizingClub}</p>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Recipient</span>
                    <span className="font-semibold text-slate-800">{cert.studentName} ({cert.studentRollNo})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Awarded On</span>
                    <span className="font-medium">{cert.issueDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Passport Credits</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      +{cert.creditPoints} pts
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  id={`view-cert-btn-${cert.id}`}
                  onClick={() => setViewingCertificate(cert)}
                  className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View & Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Certificates Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Certificates are issued when you attend registered campus events and have your QR pass scanned at the entrance.
          </p>
          <button
            onClick={() => setActiveTab('explore')}
            className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
          >
            Explore Events with Certificates
          </button>
        </div>
      )}

      {/* Render active certificate modal if selected */}
      {viewingCertificate && (
        <CertificateModal
          certificate={viewingCertificate}
          onClose={() => setViewingCertificate(null)}
        />
      )}
    </div>
  );
};
