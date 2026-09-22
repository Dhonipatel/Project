import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Registration, CampusEvent } from '../types';
import { useCampus } from '../context/CampusContext';
import {
  X,
  Download,
  Printer,
  Copy,
  Check,
  Calendar,
  MapPin,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface TicketPassModalProps {
  registration: Registration;
  onClose: () => void;
}

export const TicketPassModal: React.FC<TicketPassModalProps> = ({ registration, onClose }) => {
  const { events, verifyAndCheckIn } = useCampus();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<{ message: string; success?: boolean } | null>(null);

  const event: CampusEvent | undefined = events.find((e) => e.id === registration.eventId);

  useEffect(() => {
    if (canvasRef.current) {
      // Generate QR Code with standard JSON payload containing ticketCode and verification metadata
      const payload = JSON.stringify({
        ticketCode: registration.ticketCode,
        eventId: registration.eventId,
        rollNo: registration.userRollNo,
        name: registration.userName,
        app: 'College Event',
      });

      QRCode.toCanvas(canvasRef.current, payload, {
        width: 200,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      }).catch((err) => console.error('QR generation error:', err));
    }
  }, [registration.ticketCode]);

  const copyTicketCode = () => {
    navigator.clipboard.writeText(registration.ticketCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleTestGateScan = () => {
    const result = verifyAndCheckIn(registration.ticketCode);
    setCheckInStatus({
      message: result.message,
      success: result.success,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div
        id="ticket-pass-container"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-8 transition-all"
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                Official Digital Entry Pass
              </span>
              <h3 className="text-base font-bold leading-tight">College Event Entry Pass</h3>
            </div>
          </div>
          <button
            id="close-ticket-modal-button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ticket Body: Boarding Pass Style */}
        <div className="p-6 space-y-5">
          {/* Event info */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {registration.eventCategory.toUpperCase()}
              </span>
              {registration.checkedIn ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Attended / Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  Active • Ready to Scan
                </span>
              )}
            </div>
            <h4 className="text-lg font-extrabold text-slate-900 leading-snug">
              {registration.eventTitle}
            </h4>
            <p className="text-xs font-medium text-slate-500 mt-0.5">{registration.clubName}</p>
          </div>

          {/* Date & Venue Box */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <div>
              <div className="flex items-center gap-1 text-slate-400 text-[11px] mb-0.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Date & Time</span>
              </div>
              <p className="font-semibold text-slate-800">{registration.eventDate}</p>
            </div>
            <div>
              <div className="flex items-center gap-1 text-slate-400 text-[11px] mb-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Venue</span>
              </div>
              <p className="font-semibold text-slate-800 line-clamp-2">{registration.eventVenue}</p>
            </div>
          </div>

          {/* Attendee Details */}
          <div className="grid grid-cols-2 gap-3 text-xs border-t border-b border-slate-100 py-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                Attendee
              </span>
              <p className="font-bold text-slate-900 truncate">{registration.userName}</p>
              <p className="text-slate-500 text-[11px]">{registration.userRollNo}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                Pass ID & Credit
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <code className="text-[11px] font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">
                  {registration.ticketCode.slice(-6)}
                </code>
                {event && (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    +{event.creditPoints} pts
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Perforated Divider */}
          <div className="relative flex items-center justify-between -mx-6 my-2">
            <div className="w-4 h-8 bg-slate-950/75 rounded-r-full -ml-1"></div>
            <div className="flex-1 border-t-2 border-dashed border-slate-200 mx-2"></div>
            <div className="w-4 h-8 bg-slate-950/75 rounded-l-full -mr-1"></div>
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 shadow-inner">
            <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
              <canvas ref={canvasRef} className="w-44 h-44" />
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-700">
                {registration.ticketCode}
              </span>
              <button
                id="copy-ticket-code-btn"
                onClick={copyTicketCode}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition"
                title="Copy Pass Code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <p className="text-[11px] text-slate-500 mt-1 text-center">
              Present this QR code at the event gate terminal for attendance check-in.
            </p>
          </div>

          {/* Status Message if tested */}
          {checkInStatus && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                checkInStatus.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {checkInStatus.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">{checkInStatus.message}</div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              id="test-scan-ticket-btn"
              onClick={handleTestGateScan}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm ${
                registration.checkedIn
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {registration.checkedIn ? 'Simulate Re-Scan' : 'Simulate Gate Check-in'}
            </button>

            <button
              id="print-ticket-pass-btn"
              onClick={handlePrint}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
              title="Print / Save PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
