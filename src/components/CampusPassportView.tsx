import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Share2,
  Printer,
  Copy,
  Check,
  Compass,
  Code2,
  Palette,
  Flame,
  Star,
  ExternalLink,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';

export const CampusPassportView: React.FC = () => {
  const { currentUser, passports, setActiveTab, setViewingCertificate, certificates } = useCampus();
  const [copiedLink, setCopiedLink] = useState(false);

  // Retrieve passport for active student
  const passport = passports[currentUser.id] || {
    studentId: currentUser.id,
    studentName: currentUser.name,
    rollNo: currentUser.rollNo,
    branch: currentUser.branch,
    year: currentUser.year,
    college: currentUser.college,
    passportNumber: currentUser.passportId,
    totalCredits: currentUser.totalCredits,
    eventsAttended: 0,
    certificatesEarned: 0,
    badges: [],
    activities: [],
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      case 'Code2':
        return <Code2 className="w-5 h-5" />;
      case 'Palette':
        return <Palette className="w-5 h-5" />;
      case 'Flame':
        return <Flame className="w-5 h-5" />;
      default:
        return <Award className="w-5 h-5" />;
    }
  };

  const copyPassportLink = () => {
    navigator.clipboard.writeText(`https://collegeevent.edu/passport/${passport.passportNumber}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const graduationHonorProgress = Math.min(100, Math.round((passport.totalCredits / 80) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Passport Identity Card (Premium Collegiate Style) */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/20 relative overflow-hidden">
        {/* Ornate Background Pattern */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={passport.studentName}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-emerald-500/30 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {passport.passportNumber}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                  <ShieldCheck className="w-3 h-3" /> Accredited Transcript
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                {passport.studentName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Roll No: <span className="font-semibold text-white">{passport.rollNo}</span> • {passport.branch}
              </p>
              <p className="text-[11px] text-slate-400">{passport.college}</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 self-stretch md:self-auto">
            <button
              id="copy-passport-link-btn"
              onClick={copyPassportLink}
              className="flex-1 md:flex-initial px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-sm transition flex items-center justify-center gap-1.5 border border-white/10"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied' : 'Share Public Link'}</span>
            </button>
            <button
              id="print-passport-btn"
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Transcript</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Co-Curricular Credits
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-3xl font-black text-amber-400">{passport.totalCredits}</span>
              <span className="text-xs text-slate-400">/ 80 Goal</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-amber-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${graduationHonorProgress}%` }}
              />
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Verified Events
            </span>
            <span className="text-3xl font-black text-white mt-1 block">
              {passport.eventsAttended}
            </span>
            <span className="text-[11px] text-emerald-400 mt-1 inline-flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Gate Validated
            </span>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Certificates Earned
            </span>
            <span className="text-3xl font-black text-white mt-1 block">
              {passport.certificatesEarned}
            </span>
            <button
              onClick={() => setActiveTab('certificates')}
              className="text-[11px] text-slate-300 hover:text-white mt-1 underline decoration-dotted inline-flex items-center gap-0.5"
            >
              <span>View Gallery</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Skill Badges
            </span>
            <span className="text-3xl font-black text-white mt-1 block">
              {passport.badges.length}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Tier II Campus Achiever
            </span>
          </div>
        </div>
      </div>

      {/* Badges & Accomplishments Showcase */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Unlocked Campus Badges</h3>
            <p className="text-xs text-slate-500">
              Badges are automatically unlocked when you reach attendance milestones and participate in diverse domains.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
            {passport.badges.length} Earned
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {passport.badges.map((badge) => (
            <div
              key={badge.id}
              className="bg-slate-50 hover:bg-slate-100/80 rounded-xl p-4 border border-slate-200/80 transition flex items-start gap-3.5 group"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-amber-950 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
                {getBadgeIcon(badge.icon)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900 truncate">{badge.name}</h4>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                  {badge.description}
                </p>
                <span className="text-[10px] font-mono text-emerald-700 font-semibold mt-1 inline-block">
                  Unlocked {badge.unlockedAt}
                </span>
              </div>
            </div>
          ))}

          {/* Next Target Badge Placeholder */}
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex items-center gap-3.5 opacity-60">
            <div className="w-11 h-11 rounded-xl bg-slate-200 text-slate-400 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-600">Centurion (100 Credits)</h4>
              <p className="text-[11px] text-slate-400">Attend 2 more workshops</p>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Activities Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Verified Activity Log</h3>
            <p className="text-xs text-slate-500">
              Cryptographically stamped record of events verified at campus gate scanners.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('explore')}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition flex items-center gap-1"
          >
            <span>Explore Upcoming Events</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {passport.activities.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {passport.activities.map((act) => (
              <div
                key={act.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] uppercase font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {act.category}
                      </span>
                      <span className="text-xs text-slate-400">{act.date}</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 mt-0.5 group-hover:text-emerald-700 transition">
                      {act.eventTitle}
                    </h4>
                    <p className="text-xs text-slate-500">{act.clubName}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-1">
                      <span>Gate: {act.verifiedBy}</span>
                      <span>•</span>
                      <span>Code: {act.verificationCode}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-1.5 shrink-0 pl-12 sm:pl-0">
                  <span className="font-bold text-sm text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    +{act.creditPoints} Credits
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Stamped & Verified</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <p className="text-xs">No verified event attendances recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
