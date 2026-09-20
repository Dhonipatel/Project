import React, { useState, useEffect, useRef } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  X,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Search,
  Sparkles,
  UserCheck,
  Award,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface ScannedRecord {
  timestamp: string;
  code: string;
  name: string;
  event: string;
  success: boolean;
  message: string;
  credits: number;
}

export const QrScannerModal: React.FC = () => {
  const { isScannerOpen, setIsScannerOpen, verifyAndCheckIn, registrations, events } = useCampus();
  const [manualCode, setManualCode] = useState('');
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    isDuplicate?: boolean;
    name?: string;
    rollNo?: string;
    event?: string;
    credits?: number;
  } | null>(null);

  const [recentScans, setRecentScans] = useState<ScannedRecord[]>([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Available test sample codes to make testing effortless
  const samplePasses = registrations.slice(0, 4);

  // Camera stream handler
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isScannerOpen && isCameraActive) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play().catch(() => {});
          }
        })
        .catch((err) => {
          console.warn('Camera access error:', err);
          setCameraError('Camera access not granted or unavailable. You can use manual code input below.');
          setIsCameraActive(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isScannerOpen, isCameraActive]);

  if (!isScannerOpen) return null;

  const handleProcessCode = (codeToVerify: string) => {
    if (!codeToVerify.trim()) return;

    // Check if code is a JSON string from the QR code canvas
    let cleanCode = codeToVerify.trim();
    try {
      if (cleanCode.startsWith('{') && cleanCode.endsWith('}')) {
        const parsed = JSON.parse(cleanCode);
        if (parsed.ticketCode) {
          cleanCode = parsed.ticketCode;
        }
      }
    } catch {
      // not JSON, use as-is
    }

    const result = verifyAndCheckIn(cleanCode);
    const event = events.find((e) => e.id === result.registration?.eventId);

    setScanResult({
      success: result.success,
      message: result.message,
      isDuplicate: result.isDuplicate,
      name: result.registration?.userName,
      rollNo: result.registration?.userRollNo,
      event: result.registration?.eventTitle,
      credits: event?.creditPoints || 15,
    });

    if (result.registration) {
      setRecentScans((prev) => [
        {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          code: cleanCode,
          name: result.registration!.userName,
          event: result.registration!.eventTitle,
          success: result.success,
          message: result.message,
          credits: event?.creditPoints || 15,
        },
        ...prev.slice(0, 9),
      ]);
    }

    setManualCode('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div
        id="qr-scanner-modal"
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-6 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">Event Gate Terminal</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live Scanner
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Instant QR ticket validation & automatic Campus Passport credit issuance
              </p>
            </div>
          </div>
          <button
            id="close-scanner-btn"
            onClick={() => setIsScannerOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Scanner Viewfinder / Camera area */}
          <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center min-h-[220px] text-white p-4">
            {isCameraActive ? (
              <div className="relative w-full h-48 flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover rounded-lg"
                />
                {/* Laser scan animation overlay */}
                <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-36 border-2 border-emerald-500/60 rounded-lg pointer-events-none flex flex-col items-center justify-center">
                  <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse" />
                  <span className="absolute bottom-2 text-[10px] text-emerald-300 bg-slate-900/80 px-2 py-0.5 rounded font-mono">
                    Align QR within frame
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 px-4">
                <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                  <Camera className="w-8 h-8 text-emerald-400" />
                </div>
                <h4 className="text-sm font-semibold text-slate-200">Camera Scanner or Manual Verification</h4>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Connect camera to scan printed or mobile QR passes, or test with quick pass codes below.
                </p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <button
                    id="toggle-camera-btn"
                    onClick={() => {
                      setCameraError(null);
                      setIsCameraActive(true);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Activate Camera</span>
                  </button>
                </div>
                {cameraError && (
                  <p className="text-[11px] text-amber-400 mt-2 bg-amber-950/40 p-2 rounded border border-amber-900/50">
                    {cameraError}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Manual Input Bar */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Verify Pass Code / QR Token
            </label>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleProcessCode(manualCode);
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="scanner-manual-code-input"
                  type="text"
                  placeholder="Enter Ticket Code (e.g. CAMPUS-PASS-HACK99)"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>
              <button
                id="scanner-verify-submit-btn"
                type="submit"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0"
              >
                <span>Verify</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Quick Demo Test Buttons */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Instant 1-Click Verification Test Cases
            </span>
            <div className="flex flex-wrap gap-2">
              {samplePasses.map((pass) => (
                <button
                  key={pass.id}
                  id={`quick-test-pass-${pass.id}`}
                  onClick={() => handleProcessCode(pass.ticketCode)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono border transition flex items-center gap-1.5 ${
                    pass.checkedIn
                      ? 'bg-slate-200/80 border-slate-300 text-slate-700 hover:bg-slate-300'
                      : 'bg-white border-emerald-300 text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  <span className="font-bold">{pass.ticketCode}</span>
                  <span className="text-[10px] opacity-75">
                    ({pass.userName.split(' ')[0]} • {pass.checkedIn ? 'Checked-In' : 'Ready'})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Verification Result Display */}
          {scanResult && (
            <div
              id="scan-result-card"
              className={`p-4 rounded-xl border transition-all animate-in fade-in zoom-in-95 ${
                scanResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : scanResult.isDuplicate
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex items-start gap-3">
                {scanResult.success ? (
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                ) : scanResult.isDuplicate ? (
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
                    <X className="w-6 h-6" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm">
                      {scanResult.success
                        ? 'PASS VERIFIED • ENTRY GRANTED'
                        : scanResult.isDuplicate
                        ? 'DUPLICATE TICKET WARNING'
                        : 'VERIFICATION REJECTED'}
                    </h4>
                  </div>
                  <p className="text-xs mt-0.5 font-medium">{scanResult.message}</p>

                  {scanResult.name && (
                    <div className="mt-2.5 pt-2.5 border-t border-black/5 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500">Student</span>
                        <p className="font-bold">{scanResult.name}</p>
                        <p className="text-[11px] font-mono text-slate-500">{scanResult.rollNo}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500">Event & Credit</span>
                        <p className="font-semibold truncate">{scanResult.event}</p>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                          <Award className="w-3 h-3" /> +{scanResult.credits} Passport Credits
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Session History Feed */}
          {recentScans.length > 0 && (
            <div>
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Active Gate Session Log</span>
                <span className="text-[10px] font-mono text-slate-400">{recentScans.length} scans</span>
              </h5>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {recentScans.map((scan, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs border border-slate-100"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {scan.success ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      )}
                      <div className="truncate">
                        <span className="font-bold text-slate-800">{scan.name}</span>
                        <span className="text-slate-400 mx-1">•</span>
                        <span className="text-slate-500 font-mono text-[11px]">{scan.code}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 text-slate-400 text-[10px]">
                      <span>{scan.timestamp}</span>
                      {scan.success && (
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          +{scan.credits} pts
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
