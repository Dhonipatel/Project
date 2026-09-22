import React, { useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { Certificate } from '../types';
import { X, Printer, Award, ShieldCheck, Share2, Download } from 'lucide-react';

interface CertificateModalProps {
  certificate: Certificate;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  const qrRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (qrRef.current) {
      QRCode.toCanvas(
        qrRef.current,
        `https://collegeevent.edu/verify/cert/${certificate.certificateNo}?hash=${certificate.verificationHash}`,
        {
          width: 90,
          margin: 1,
          color: {
            dark: '#1e293b',
            light: '#ffffff',
          },
        }
      ).catch(() => {});
    }
  }, [certificate]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-6 flex flex-col">
        {/* Modal Topbar */}
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm">Verified Credential Document</span>
            <span className="font-mono text-xs text-slate-400">({certificate.certificateNo})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="print-cert-top-btn"
              onClick={handlePrint}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg font-medium transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              id="close-cert-btn"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Parchment Body */}
        <div className="p-8 bg-[#fdfbf7] relative border-8 border-double border-amber-900/20 m-4 rounded-xl shadow-inner text-slate-800 print:m-0 print:border-4">
          {/* Subtle Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none">
            <Award className="w-96 h-96 text-amber-900" />
          </div>

          <div className="relative z-10 text-center space-y-4">
            {/* College Crest & Header */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-emerald-900 text-amber-300 flex items-center justify-center shadow-md border-2 border-amber-400/40 mb-2">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <span className="font-serif uppercase tracking-[0.25em] text-xs text-amber-800 font-bold">
                College Event • Student Council
              </span>
              <span className="text-[10px] tracking-widest text-slate-500 uppercase">
                Office of Student Affairs & Academic Engagement
              </span>
              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent my-2" />
            </div>

            {/* Certificate Title */}
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Certificate of Completion
              </h2>
              <p className="text-xs text-slate-600 italic mt-0.5">
                This is officially certified to acknowledge that
              </p>
            </div>

            {/* Recipient Name */}
            <div className="py-2">
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-emerald-950 underline decoration-amber-500/60 decoration-2 underline-offset-8">
                {certificate.studentName}
              </h3>
              <p className="font-mono text-xs text-slate-600 mt-2">
                Roll No: <span className="font-bold">{certificate.studentRollNo}</span> • {certificate.studentBranch}
              </p>
            </div>

            {/* Event Description */}
            <p className="text-xs sm:text-sm text-slate-700 max-w-lg mx-auto leading-relaxed">
              has actively participated in, completed all milestone requirements, and fulfilled attendance verification for the campus event:
            </p>

            <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200/80 max-w-lg mx-auto">
              <h4 className="font-bold text-sm sm:text-base text-slate-900">{certificate.eventTitle}</h4>
              <p className="text-xs text-amber-900 mt-0.5 font-medium">{certificate.organizingClub}</p>
            </div>

            {/* Credit Points Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100/80 rounded-full border border-emerald-300 text-emerald-900 text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-emerald-700" />
              <span>+{certificate.creditPoints} Campus Passport Credits Awarded</span>
            </div>

            {/* Footer Signatures & QR Seal */}
            <div className="pt-6 mt-4 border-t border-amber-900/15 grid grid-cols-3 items-end text-left gap-4">
              <div>
                <span className="font-mono text-[10px] text-slate-500 uppercase block">Issue Date</span>
                <p className="text-xs font-semibold text-slate-800">{certificate.issueDate}</p>
                <span className="font-mono text-[10px] text-slate-400 mt-1 block">
                  ID: {certificate.certificateNo}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center">
                <canvas ref={qrRef} className="rounded border border-slate-200 shadow-sm" />
                <span className="text-[9px] font-mono text-slate-400 mt-1 text-center">Scan to verify</span>
              </div>

              <div className="text-right">
                <div className="inline-block border-b border-slate-600 pb-1 px-4 mb-1">
                  <span className="font-serif italic font-bold text-slate-800 text-sm">
                    {certificate.signatory.name}
                  </span>
                </div>
                <p className="text-[10px] font-semibold text-slate-600 leading-tight">
                  {certificate.signatory.title}
                </p>
                <p className="text-[9px] text-slate-400">Authorized Campus Signatory</p>
              </div>
            </div>

            {/* Verification Hash */}
            <div className="pt-2 text-center">
              <p className="font-mono text-[9px] text-slate-400 break-all">
                Hash: {certificate.verificationHash}
              </p>
            </div>
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Cryptographically signed & verifiable via Campus Passport</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
