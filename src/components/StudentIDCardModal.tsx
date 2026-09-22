import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useCampus } from '../context/CampusContext';
import {
  X,
  Printer,
  Download,
  GraduationCap,
  ShieldCheck,
  Award,
  Calendar,
  CheckCircle2,
  Sparkles,
  Share2,
  Phone,
  Mail,
  Droplet,
  Compass,
} from 'lucide-react';

export const StudentIDCardModal: React.FC = () => {
  const {
    isIdCardModalOpen,
    setIsIdCardModalOpen,
    idCardUser,
    currentUser,
    setActiveTab,
  } = useCampus();

  const printRef = useRef<HTMLDivElement>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  const student = idCardUser || currentUser;

  const cardIdNumber = student?.studentIdCardNo || `CE-2026-CS-8412`;
  const qrVerificationPayload = JSON.stringify({
    institution: 'College Event Portal, Bhopal',
    studentId: cardIdNumber,
    name: student?.name,
    rollNo: student?.rollNo,
    branch: student?.branch,
    verified: true,
    issuedBy: 'Office of the Dean, College Event',
  });

  useEffect(() => {
    if (isIdCardModalOpen && qrCanvasRef.current && student) {
      QRCode.toCanvas(
        qrCanvasRef.current,
        qrVerificationPayload,
        {
          width: 72,
          margin: 1,
          color: {
            dark: '#064e3b',
            light: '#ffffff',
          },
        },
        (error) => {
          if (error) console.error('Error rendering ID card QR code:', error);
        }
      );
    }
  }, [isIdCardModalOpen, qrVerificationPayload, student]);

  if (!isIdCardModalOpen || !student) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:border-none print:m-0">
        {/* Top Modal Controls (Hidden in print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold">Official College Event Student ID Card</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow transition"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save ID</span>
            </button>
            <button
              onClick={() => setIsIdCardModalOpen(false)}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ==================== THE ID CARD CONTAINER ==================== */}
        <div className="p-6 print:p-2" ref={printRef}>
          <div className="relative w-full rounded-2xl border-2 border-emerald-700 bg-gradient-to-b from-slate-50 via-white to-emerald-50/30 shadow-lg overflow-hidden font-sans">
            {/* Holographic / Metallic Top Header */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white px-5 py-4 relative border-b-2 border-amber-400">
              {/* Gold decorative accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500" />

              <div className="flex items-center justify-between gap-3">
                {/* College Emblem */}
                <div className="w-12 h-12 rounded-full bg-white p-1 flex items-center justify-center shadow-md ring-2 ring-amber-400 shrink-0">
                  <div className="w-full h-full rounded-full bg-emerald-900 flex items-center justify-center text-amber-300">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                </div>

                {/* College Names & Affiliation */}
                <div className="flex-1 text-center">
                  <h3 className="text-base sm:text-lg font-black tracking-wide text-white uppercase leading-tight font-serif">
                    COLLEGE EVENT
                  </h3>
                  <p className="text-[10px] sm:text-[11px] font-semibold text-amber-300 tracking-wider uppercase">
                    CAMPUS STUDENT IDENTITY CARD
                  </p>
                  <p className="text-[9px] text-slate-300 leading-none mt-0.5">
                    Official College Event Verification & Entry Credential
                  </p>
                </div>

                {/* Verification badge */}
                <div className="hidden sm:flex flex-col items-center justify-center text-[9px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 rounded-lg px-2 py-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>VERIFIED</span>
                </div>
              </div>

              {/* Banner Ribbon */}
              <div className="mt-2.5 py-1 bg-emerald-800/90 text-center rounded text-[11px] font-bold tracking-widest uppercase text-emerald-100 border border-emerald-600/50">
                STUDENT IDENTITY CARD
              </div>
            </div>

            {/* Middle Section: Photo + Vital Student Details */}
            <div className="p-5">
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                {/* Student Photo with Holographic Border */}
                <div className="flex flex-col items-center mx-auto sm:mx-0 shrink-0">
                  <div className="relative w-28 h-36 rounded-xl border-2 border-emerald-600 shadow-md overflow-hidden bg-slate-100 p-0.5">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {/* Hologram badge on corner */}
                    <div className="absolute bottom-1 right-1 bg-emerald-700/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow">
                      CE
                    </div>
                  </div>
                  {/* Blood Group Tag */}
                  <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                    <Droplet className="w-3 h-3 text-rose-600 fill-rose-600" />
                    <span>Blood: {student.bloodGroup || 'B+'}</span>
                  </div>
                </div>

                {/* Details Table */}
                <div className="flex-1 w-full space-y-1.5 text-xs">
                  {/* Generated Student ID Pill */}
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Student ID No:
                    </span>
                    <span className="font-mono font-black text-sm text-emerald-900 bg-emerald-100/90 px-2 py-0.5 rounded border border-emerald-300">
                      {cardIdNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 py-0.5">
                    <span className="font-semibold text-slate-500">Name:</span>
                    <span className="col-span-2 font-bold text-slate-900 text-sm">{student.name}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 py-0.5">
                    <span className="font-semibold text-slate-500">Roll / Enr No:</span>
                    <span className="col-span-2 font-mono font-bold text-slate-800">
                      {student.rollNo}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 py-0.5">
                    <span className="font-semibold text-slate-500">Department:</span>
                    <span className="col-span-2 font-semibold text-slate-800">{student.branch}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 py-0.5">
                    <span className="font-semibold text-slate-500">Academic Year:</span>
                    <span className="col-span-2 text-slate-800 font-medium">{student.year}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 py-0.5">
                    <span className="font-semibold text-slate-500">Mobile Phone:</span>
                    <span className="col-span-2 text-slate-800 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      <span className="font-medium">{student.phone || '+91 98260 12345'}</span>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 py-0.5">
                    <span className="font-semibold text-slate-500">Verified Email:</span>
                    <span className="col-span-2 text-slate-800 flex items-center gap-1 truncate">
                      <Mail className="w-3 h-3 text-emerald-600" />
                      <span className="font-medium truncate">{student.email}</span>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 py-0.5">
                    <span className="font-semibold text-slate-500">Valid Upto:</span>
                    <span className="col-span-2 font-bold text-emerald-800">
                      {student.validUpto || 'June 2029'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Card Footer: QR Code + Authorized Dean Signature */}
            <div className="px-5 py-3 bg-slate-100/80 border-t border-emerald-200 flex items-center justify-between gap-4">
              {/* QR Code for scanning at campus gates & events */}
              <div className="flex items-center gap-2.5">
                <div className="bg-white p-1 rounded-lg border border-slate-300 shadow-sm flex items-center justify-center">
                  <canvas ref={qrCanvasRef} className="w-[64px] h-[64px] rounded" />
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  <p className="font-bold text-emerald-950">Campus Gate & Event QR</p>
                  <p>Scan for instant verification</p>
                  <p className="text-[9px] text-emerald-700 font-mono">Status: ACTIVE</p>
                </div>
              </div>

              {/* Authorized Signatures */}
              <div className="flex flex-col items-end text-right">
                <div className="font-serif italic font-bold text-slate-700 text-xs tracking-wider border-b border-slate-400 pb-0.5">
                  Dr. S. K. Sharma
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600 mt-0.5">
                  Dean / Authorized Signatory
                </span>
                <span className="text-[8px] text-slate-500">College Event, Bhopal</span>
              </div>
            </div>

            {/* Card reverse terms bar */}
            <div className="px-4 py-1.5 bg-emerald-900 text-white text-[9px] text-center font-medium">
              This card is the property of College Event Portal • If found, please return to Admin Office.
            </div>
          </div>
        </div>

        {/* Action Buttons Below Card (Hidden in print) */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            onClick={() => {
              setIsIdCardModalOpen(false);
              setActiveTab('passport');
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-2 rounded-xl transition"
          >
            <Award className="w-4 h-4 text-amber-600" />
            <span>View Campus Passport</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsIdCardModalOpen(false);
                setActiveTab('explore');
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition"
            >
              <Compass className="w-4 h-4" />
              <span>Explore College Events</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
