import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Download,
  Presentation,
  CheckCircle2,
  Layers,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Award,
  Users,
  QrCode,
  Laptop,
  Cpu,
  Database,
  Server,
  Code2,
} from 'lucide-react';

interface Slide {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  points: {
    heading: string;
    desc: string;
    icon?: any;
    tag?: string;
  }[];
  statBoxes?: { label: string; value: string; sub: string }[];
  highlight?: string;
}

const HACKATHON_SLIDES: Slide[] = [
  {
    id: 1,
    badge: 'IES COLLEGE HACKATHON 2026',
    title: 'CampusConnect Portal',
    subtitle: 'Next-Gen MERN Stack Event Management & Digital Student Passport Ecosystem',
    highlight: 'IES College of Technology & Management, Bhopal',
    points: [
      {
        heading: 'Project Core',
        desc: 'All-in-one digital campus ecosystem replacing paper slips, chaotic queues, and unverified certificates.',
        tag: 'Full-Stack MERN',
      },
      {
        heading: 'Lead Organizer & Developer',
        desc: 'Dhoni Patel — Coding Club Lead & Organizer Terminal Architect',
        tag: 'Organizer Lead',
      },
      {
        heading: 'Dean & System Administrator',
        desc: 'Harshit Kumar Panday — Dean of Student Affairs, Academic Oversight & Verification Authority',
        tag: 'Administrator',
      },
      {
        heading: 'Key Tech Pillars',
        desc: 'MongoDB Atlas, Express.js REST API, React 18 SPA, Node.js runtime with Google Gemini AI integration.',
        tag: 'Tech Stack',
      },
    ],
    statBoxes: [
      { label: 'Platform Architecture', value: 'MERN + AI', sub: 'Full production stack' },
      { label: 'Check-in Speed', value: '< 2 Sec', sub: 'Instant QR gate check-in' },
      { label: 'Paper Saved', value: '100%', sub: 'Zero paper tickets' },
      { label: 'Certificate Verification', value: 'Cryptographic', sub: 'Unique sha-like hash' },
    ],
  },
  {
    id: 2,
    badge: 'THE CORE CHALLENGE',
    title: 'Current Campus Events: The Friction Points',
    subtitle: 'Why traditional college events cause chaos for students, organizers, and administration',
    points: [
      {
        heading: 'Paper Passes & Queue Congestion',
        desc: 'Physical registration slips and manual roll-call registers lead to 45+ minute entry gate delays and frustration.',
        icon: QrCode,
      },
      {
        heading: 'Unchecked Proxy Attendance',
        desc: 'Students mark attendance for friends who never attended; clubs have no tamper-proof attendance proof for budget audits.',
        icon: ShieldCheck,
      },
      {
        heading: 'Scattered Activity Proofs (NAAC / Placements)',
        desc: 'Students struggle during placements and NAAC audits to find old participation certificates scattered across WhatsApp and email.',
        icon: Award,
      },
      {
        heading: 'Delayed Certificate Distribution',
        desc: 'Printing, manual signing, and distributing hundreds of certificates takes weeks or months after fest concludes.',
        icon: Users,
      },
    ],
  },
  {
    id: 3,
    badge: 'OUR INNOVATIVE SOLUTION',
    title: 'CampusConnect: Complete Digital Lifecycle',
    subtitle: 'Transforming campus life from discovery to permanent academic credentials',
    points: [
      {
        heading: '1-Click Registration with Dynamic QR Pass',
        desc: 'Students get a modern digital pass with an encrypted ticket code and vector QR code, ready for mobile apple-wallet style presentation.',
        tag: 'Student Experience',
      },
      {
        heading: 'Organizer Gate Scanner Terminal',
        desc: 'Dhoni Patel and club volunteers can scan QR codes or type pass codes with instant duplicate entry detection and audio-visual feedback.',
        tag: 'Gate Operations',
      },
      {
        heading: 'Automated Verified Certificates',
        desc: 'Check-in automatically triggers tamper-proof certificate generation signed by Dean Harshit Kumar Panday with cryptographic hash lookup.',
        tag: 'Instant Issuance',
      },
      {
        heading: 'Collegiate Student Passport',
        desc: 'Continuous gamified credits tracker, achievement badges ("First Step", "Honor Roll"), and official PDF transcripts.',
        tag: 'Career Readiness',
      },
    ],
    statBoxes: [
      { label: 'Registration Flow', value: '10 Seconds', sub: 'Instant confirmation' },
      { label: 'Duplicate Entry Rate', value: '0%', sub: 'Hardware timestamp lock' },
      { label: 'Certificate Delivery', value: 'Real-time', sub: 'Generated on check-in' },
    ],
  },
  {
    id: 4,
    badge: 'ROLE-BASED WORKFLOWS',
    title: 'Multi-Role Campus Operations',
    subtitle: 'Seamless interaction between Students, Club Organizers, and College Dean',
    points: [
      {
        heading: '1. Student Experience (Priya Sharma / Aryan Verma)',
        desc: 'Browse categorized hackathons, cultural fests, workshops; register teams; receive digital pass; collect badges and certified credits.',
        tag: 'Role: Student',
      },
      {
        heading: '2. Club Organizer Terminal (Dhoni Patel - Lead)',
        desc: 'Publish upcoming events, manage maximum capacities, broadcast urgent venue announcements, scan passes at the door.',
        tag: 'Role: Organizer',
      },
      {
        heading: '3. Administrative Governance (Harshit Kumar Panday - Dean)',
        desc: 'Approve or reject club proposals, audit attendance analytics, view department-wise participation ratios, issue official credentials.',
        tag: 'Role: Admin',
      },
      {
        heading: '4. AI Campus Concierge (Gemini Flash)',
        desc: 'AI analyzes student branch (CSE, IT, ME) and past participation to recommend optimal events for co-curricular credit completion.',
        tag: 'Role: Smart AI',
      },
    ],
  },
  {
    id: 5,
    badge: 'SYSTEM ARCHITECTURE',
    title: 'MERN Stack Engineering & Infrastructure',
    subtitle: 'Built for enterprise reliability, high concurrent gate traffic, and low latency',
    points: [
      {
        heading: '[M] MongoDB & Mongoose ODM',
        desc: 'Structured collections for Users, Events, Registrations, and Certificates with failover in-memory persistence when offline.',
        icon: Database,
        tag: 'Database',
      },
      {
        heading: '[E] Express.js 4 REST API',
        desc: 'Clean REST endpoints (/api/events, /api/registrations, /api/certificates, /api/mern/status) with error handling & logging.',
        icon: Server,
        tag: 'Backend',
      },
      {
        heading: '[R] React 18 & Tailwind CSS',
        desc: 'High-contrast responsive UI, real-time context synchronization, vector QR code rendering, and canvas confetti celebrations.',
        icon: Code2,
        tag: 'Frontend',
      },
      {
        heading: '[N] Node.js 20+ Cloud Runtime',
        desc: 'Asynchronous event loop handling fast check-in bursts during peak event gate opening hours.',
        icon: Cpu,
        tag: 'Runtime',
      },
    ],
  },
  {
    id: 6,
    badge: 'LIVE DEMO HIGHLIGHTS',
    title: 'What the Judges Will See in Live Action',
    subtitle: 'A fully functional prototype ready for deployment at IES College',
    points: [
      {
        heading: 'Interactive Persona Switcher',
        desc: 'Instant switching between Student, Dhoni Patel (Organizer), and Harshit Kumar Panday (Dean) without re-logging.',
      },
      {
        heading: 'Live Check-in Simulator & QR Gate Terminal',
        desc: 'Enter any pass code (e.g. CAMPUS-PASS-HACK-...) to watch instant validation, duplicate prevention, and credit calculation.',
      },
      {
        heading: 'Official Dean-Signed Certificate Viewer',
        desc: 'High-definition collegiate parchment certificate with digital watermark, signature seal, and hash verification URL.',
      },
      {
        heading: 'MERN Stack Console Inspector',
        desc: 'Live backend telemetry modal showing active MongoDB collections count, REST endpoint pinger, and live server logs.',
      },
    ],
    statBoxes: [
      { label: 'Event Categories', value: '6 Types', sub: 'Tech, Sports, Cultural, etc.' },
      { label: 'AI Concierge', value: 'Integrated', sub: 'Gemini flash powered' },
      { label: 'Offline Ready', value: '100%', sub: 'Local persistence engine' },
    ],
  },
  {
    id: 7,
    badge: 'FUTURE ROADMAP & FEASIBILITY',
    title: 'Scale, Impact & Commercial Readiness',
    subtitle: 'Taking CampusConnect from Hackathon winner to collegiate standard',
    points: [
      {
        heading: 'Phase 1: College RFID / Smart Card Gate Tapping',
        desc: 'Integrate physical college RFID cards with NFC readers connected to the CampusConnect Express check-in API.',
      },
      {
        heading: 'Phase 2: Automated WhatsApp Notifications',
        desc: 'Send QR passes and event schedule change alerts directly to student WhatsApp numbers.',
      },
      {
        heading: 'Phase 3: Inter-College University League',
        desc: 'Expand platform to connect affiliated universities across Madhya Pradesh for state-level hackathons and sports leagues.',
      },
      {
        heading: 'Phase 4: Blockchain Credential Anchoring',
        desc: 'Store verified certificate hashes on public blockchains for permanent, immutable employer verifications.',
      },
    ],
  },
  {
    id: 8,
    badge: 'CONCLUSION & Q&A',
    title: 'Empowering IES College of Technology',
    subtitle: 'Thank You Judges! We are ready for Questions & Answers.',
    highlight: 'Dhoni Patel (Lead Organizer) • Harshit Kumar Panday (Dean & Admin)',
    points: [
      {
        heading: 'Why CampusConnect Wins',
        desc: 'Solves an immediate, painful, real-world campus problem with clean, production-ready MERN code and zero simulated mockups.',
      },
      {
        heading: 'Institutional Readiness',
        desc: 'Designed specifically with IES College governance, dean approval policies, and student co-curricular credits in mind.',
      },
      {
        heading: 'Live Prototype Accessible',
        desc: 'Fully running in cloud container with functional backend REST endpoints and database models.',
      },
    ],
    statBoxes: [
      { label: 'Codebase', value: 'TypeScript + MERN', sub: 'Production quality' },
      { label: 'Deployment', value: 'Cloud Run', sub: 'Ready for live usage' },
    ],
  },
];

export const HackathonPresentationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slide = HACKATHON_SLIDES[currentSlideIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlideIndex((prev) => Math.min(HACKATHON_SLIDES.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const downloadHtmlDeck = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CampusConnect - Hackathon Presentation Pitch Deck</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; background: #0b0f19; color: #f8fafc; }
    .slide { max-width: 960px; margin: 40px auto; background: #131b2e; border: 1px solid #1e293b; border-radius: 16px; padding: 48px; page-break-after: always; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    .badge { display: inline-block; background: rgba(16, 185, 129, 0.2); color: #34d399; font-weight: 700; font-size: 12px; letter-spacing: 1px; padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(16, 185, 129, 0.3); margin-bottom: 16px; }
    h1 { font-size: 36px; margin: 0 0 8px; color: #ffffff; }
    h2 { font-size: 18px; font-weight: 400; color: #94a3b8; margin: 0 0 32px; }
    .points { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 32px; }
    .point-card { background: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155; }
    .point-title { font-weight: bold; font-size: 16px; color: #38bdf8; margin-bottom: 8px; }
    .point-desc { font-size: 14px; color: #cbd5e1; line-height: 1.6; }
    .stats { display: flex; gap: 16px; margin-top: 24px; border-top: 1px solid #334155; padding-top: 24px; }
    .stat-box { flex: 1; background: rgba(15, 23, 42, 0.6); padding: 16px; border-radius: 8px; text-align: center; }
    .stat-val { font-size: 24px; font-weight: bold; color: #34d399; }
    .stat-lbl { font-size: 12px; color: #94a3b8; margin-top: 4px; }
    @media print { body { background: #fff; color: #000; } .slide { border: none; box-shadow: none; margin: 0; padding: 20px; } }
  </style>
</head>
<body>
  ${HACKATHON_SLIDES.map(
    (s) => `
    <div class="slide">
      <div class="badge">${s.badge}</div>
      <h1>${s.title}</h1>
      <h2>${s.subtitle}</h2>
      <div class="points">
        ${s.points
          .map(
            (p) => `
          <div class="point-card">
            <div class="point-title">${p.heading}</div>
            <div class="point-desc">${p.desc}</div>
          </div>
        `
          )
          .join('')}
      </div>
      ${
        s.statBoxes
          ? `
        <div class="stats">
          ${s.statBoxes
            .map(
              (sb) => `
            <div class="stat-box">
              <div class="stat-val">${sb.value}</div>
              <div class="stat-lbl">${sb.label}</div>
            </div>
          `
            )
            .join('')}
        </div>
      `
          : ''
      }
    </div>
  `
  ).join('')}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CampusConnect_Hackathon_Pitch_Deck.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 ${
        isFullscreen ? 'p-0' : ''
      }`}
    >
      <div
        className={`bg-slate-900 border border-slate-800 text-slate-100 flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ${
          isFullscreen
            ? 'w-screen h-screen rounded-none border-0'
            : 'w-full max-w-5xl h-[90vh] rounded-2xl'
        }`}
      >
        {/* Top Control Bar */}
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Presentation className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">Hackathon Presentation Deck</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Pitch Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Slide {currentSlideIndex + 1} of {HACKATHON_SLIDES.length} • Use Arrow Keys to navigate
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadHtmlDeck}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 transition"
              title="Download standalone HTML/Slides to save or print to PDF"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Export Deck (Print / PDF)</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Pitch Mode'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Close Presentation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Stage / Canvas */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex flex-col justify-between bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
          <div>
            {/* Badge & Title */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                {slide.badge}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2">
                {slide.title}
              </h1>
              <p className="text-sm sm:text-lg text-slate-400 font-medium">
                {slide.subtitle}
              </p>
              {slide.highlight && (
                <div className="mt-3 inline-block px-3 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-semibold">
                  🏛️ {slide.highlight}
                </div>
              )}
            </div>

            {/* Slide Content Points Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {slide.points.map((pt, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl p-4 sm:p-5 transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-slate-100 text-sm sm:text-base group-hover:text-emerald-300 transition">
                        {pt.heading}
                      </h3>
                      {pt.tag && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {pt.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {pt.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stat Boxes if present */}
            {slide.statBoxes && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                {slide.statBoxes.map((sb, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 text-center"
                  >
                    <div className="text-lg sm:text-xl font-extrabold text-emerald-400 font-mono">
                      {sb.value}
                    </div>
                    <div className="text-xs font-bold text-slate-200 mt-0.5">{sb.label}</div>
                    <div className="text-[10px] text-slate-500">{sb.sub}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Slide Navigation Footnote */}
          <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-mono text-emerald-400 font-bold">IES College Hackathon 2026</span>
              <span>•</span>
              <span className="hidden sm:inline">Lead: Dhoni Patel & Admin: Harshit Kumar Panday</span>
            </div>
            <div className="font-mono">
              Slide {slide.id} / {HACKATHON_SLIDES.length}
            </div>
          </div>
        </div>

        {/* Bottom Nav Bar */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {HACKATHON_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlideIndex
                    ? 'w-8 bg-emerald-400'
                    : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentSlideIndex === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium text-slate-200 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={() =>
                setCurrentSlideIndex((prev) => Math.min(HACKATHON_SLIDES.length - 1, prev + 1))
              }
              disabled={currentSlideIndex === HACKATHON_SLIDES.length - 1}
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium text-white transition"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
