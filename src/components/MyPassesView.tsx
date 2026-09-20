import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  Ticket,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  Sparkles,
  QrCode,
  Trash2,
  ExternalLink,
  Award,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const MyPassesView: React.FC = () => {
  const {
    currentUser,
    registrations,
    events,
    setActivePassModalReg,
    cancelRegistration,
    setActiveTab,
    setViewingCertificate,
    certificates,
  } = useCampus();

  const [activeFilter, setActiveFilter] = useState<'active' | 'attended' | 'all'>('active');

  const myRegistrations = registrations.filter((r) => r.userId === currentUser.id);

  const filteredRegistrations = myRegistrations.filter((r) => {
    if (activeFilter === 'active') return !r.checkedIn;
    if (activeFilter === 'attended') return r.checkedIn;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-emerald-700/30">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
              Personal Event Passes
            </span>
            <span className="text-xs text-slate-300">{currentUser.name} ({currentUser.rollNo})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            My Digital Passes & QR Tickets
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Tap any pass to view your full-screen high-resolution QR code for quick gate entry and instant passport credit validation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('explore')}
            className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold rounded-xl text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <span>Browse More Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveFilter('active')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeFilter === 'active'
              ? 'bg-emerald-600 text-white font-bold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Active Upcoming ({myRegistrations.filter((r) => !r.checkedIn).length})</span>
        </button>

        <button
          onClick={() => setActiveFilter('attended')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeFilter === 'attended'
              ? 'bg-emerald-600 text-white font-bold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Verified & Attended ({myRegistrations.filter((r) => r.checkedIn).length})</span>
        </button>

        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeFilter === 'all'
              ? 'bg-slate-900 text-white font-bold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>All Records ({myRegistrations.length})</span>
        </button>
      </div>

      {/* Passes Grid */}
      {filteredRegistrations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRegistrations.map((reg) => {
            const event = events.find((e) => e.id === reg.eventId);
            const cert = certificates.find((c) => c.eventId === reg.eventId && c.studentId === currentUser.id);

            return (
              <div
                key={reg.id}
                id={`pass-card-${reg.id}`}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative"
              >
                {/* Top Colored Bar */}
                <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono text-xs font-bold tracking-wider text-slate-200">
                      {reg.ticketCode}
                    </span>
                  </div>
                  {reg.checkedIn ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> Attended
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/30">
                      Ready to Scan
                    </span>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {reg.eventCategory}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-1.5 leading-snug group-hover:text-emerald-700 transition">
                      {reg.eventTitle}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{reg.clubName}</p>
                    {reg.teamName && (
                      <p className="text-xs font-semibold text-indigo-700 mt-1 bg-indigo-50 px-2 py-0.5 rounded w-fit">
                        Team: {reg.teamName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{reg.eventDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{reg.eventVenue}</span>
                    </div>
                  </div>

                  {event && (
                    <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                      <span className="text-slate-500">Co-Curricular Credit</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        +{event.creditPoints} Passport Points
                      </span>
                    </div>
                  )}
                </div>

                {/* Perforated Divider */}
                <div className="relative flex items-center justify-between -mx-2">
                  <div className="w-3 h-6 bg-slate-100 rounded-r-full -ml-1"></div>
                  <div className="flex-1 border-t border-dashed border-slate-200 mx-2"></div>
                  <div className="w-3 h-6 bg-slate-100 rounded-l-full -mr-1"></div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 bg-slate-50/50 flex items-center justify-between gap-2">
                  <button
                    id={`open-qr-btn-${reg.id}`}
                    onClick={() => setActivePassModalReg(reg)}
                    className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>View QR Pass</span>
                  </button>

                  {reg.checkedIn && cert ? (
                    <button
                      onClick={() => setViewingCertificate(cert)}
                      className="py-2.5 px-3 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold transition flex items-center gap-1"
                      title="View Official Certificate"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-700" />
                      <span>Certificate</span>
                    </button>
                  ) : (
                    !reg.checkedIn && (
                      <button
                        id={`cancel-reg-btn-${reg.id}`}
                        onClick={() => cancelRegistration(reg.id)}
                        className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                        title="Cancel Registration"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Passes in this View</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Browse campus hackathons, workshops, and fests to register and receive instant verified QR passes.
          </p>
          <button
            onClick={() => setActiveTab('explore')}
            className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
          >
            Discover Events
          </button>
        </div>
      )}
    </div>
  );
};
