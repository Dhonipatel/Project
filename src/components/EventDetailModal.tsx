import React, { useState } from 'react';
import { CampusEvent, Registration } from '../types';
import { useCampus } from '../context/CampusContext';
import {
  X,
  Calendar,
  MapPin,
  Users,
  Award,
  ShieldCheck,
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  Sparkles,
  Share2,
  ExternalLink,
  Phone,
  Mail,
  User,
  ArrowRight,
} from 'lucide-react';

interface EventDetailModalProps {
  event: CampusEvent;
  onClose: () => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose }) => {
  const {
    currentUser,
    registrations,
    registerForEvent,
    setActivePassModalReg,
    postAnnouncement,
  } = useCampus();

  const [teamName, setTeamName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  // Organizer announcement form
  const [showAnnounceInput, setShowAnnounceInput] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annUrgent, setAnnUrgent] = useState(false);

  const userReg: Registration | undefined = registrations.find(
    (r) => r.eventId === event.id && r.userId === currentUser.id
  );

  const spotsLeft = Math.max(0, event.capacity - event.registeredCount);

  const handleRegister = async () => {
    setIsRegistering(true);
    setRegError(null);

    const result = await registerForEvent(event.id, teamName);
    setIsRegistering(false);

    if (!result.success) {
      setRegError(result.message);
    } else {
      // Pass modal is automatically opened by context!
      onClose();
    }
  };

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    postAnnouncement(event.id, annTitle.trim(), annContent.trim(), annUrgent);
    setAnnTitle('');
    setAnnContent('');
    setShowAnnounceInput(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div
        id="event-detail-modal-container"
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-6 flex flex-col max-h-[92vh]"
      >
        {/* Banner Header */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900 shrink-0">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Close button */}
          <button
            id="close-event-detail-btn"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm flex items-center justify-center transition border border-white/20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Banner Meta Overlay */}
          <div className="absolute bottom-5 left-6 right-6 text-white space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500 text-white shadow-sm">
                {event.category}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-slate-200 border border-white/20">
                {event.eligibility}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                <Award className="w-3 h-3 text-slate-900" />
                <span>+{event.creditPoints} Passport Credits</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              {event.title}
            </h1>

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <img
                src={event.clubLogo}
                alt={event.clubName}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-white/50"
              />
              <span className="font-semibold">{event.clubName}</span>
              <span>•</span>
              <span>Lead: {event.organizerName}</span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
          {/* Quick Date, Venue & Registration Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Schedule</span>
                <p className="font-bold text-slate-900">{event.date}</p>
                <p className="text-slate-600 font-medium">{event.time} {event.endDate ? `to ${event.endDate}` : ''}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Location</span>
                <p className="font-bold text-slate-900">{event.isVirtual ? 'Virtual Event' : event.venue}</p>
                {event.virtualLink && (
                  <a
                    href={event.virtualLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 underline font-semibold flex items-center gap-1"
                  >
                    <span>Meeting Room</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Capacity</span>
                <p className="font-bold text-slate-900">
                  {event.registeredCount} / {event.capacity} Registered
                </p>
                <p className="text-emerald-700 font-semibold">{spotsLeft} seats available</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">About the Event</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Agenda Timeline */}
          {event.agenda && event.agenda.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Event Agenda & Schedule</h3>
              </div>

              <div className="border-l-2 border-slate-200 pl-4 space-y-4 ml-2">
                {event.agenda.map((item, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white" />
                    <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {item.time}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">{item.title}</h4>
                    {item.speaker && (
                      <p className="text-xs text-slate-500 mt-0.5">Speaker / Host: {item.speaker}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prerequisites & Prizes Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {event.prerequisites && event.prerequisites.length > 0 && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600 mb-2">
                  Prerequisites & Things to Bring
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {event.prerequisites.map((req, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {event.prizes && event.prizes.length > 0 && (
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
                <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Prizes & Grants Pool</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-amber-950 font-medium">
                  {event.prizes.map((prz, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{prz}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Live Announcements Feed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Announcements</h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {event.announcements.length}
                </span>
              </div>

              {(currentUser.role === 'organizer' || currentUser.role === 'admin') && (
                <button
                  onClick={() => setShowAnnounceInput(!showAnnounceInput)}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline decoration-dotted"
                >
                  {showAnnounceInput ? 'Cancel' : '+ Post Update'}
                </button>
              )}
            </div>

            {/* Organizer Announcement Post Box */}
            {showAnnounceInput && (
              <form
                onSubmit={handlePostAnnouncement}
                className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 space-y-3"
              >
                <h5 className="font-bold text-xs text-emerald-950">Broadcast Announcement to Attendees</h5>
                <input
                  type="text"
                  placeholder="Subject (e.g. WiFi password / Gate check-in timing)"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-emerald-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <textarea
                  rows={2}
                  placeholder="Details for registered attendees..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-emerald-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-emerald-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={annUrgent}
                      onChange={(e) => setAnnUrgent(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Mark as Urgent Alert</span>
                  </label>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition"
                  >
                    Broadcast
                  </button>
                </div>
              </form>
            )}

            {event.announcements.length > 0 ? (
              <div className="space-y-2">
                {event.announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className={`p-3.5 rounded-xl text-xs border ${
                      ann.isUrgent
                        ? 'bg-rose-50 border-rose-200 text-rose-950'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <div className="flex items-center gap-1.5">
                        {ann.isUrgent && (
                          <span className="bg-rose-600 text-white text-[9px] px-1.5 py-0.2 rounded font-mono">
                            URGENT
                          </span>
                        )}
                        <span>{ann.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal">{ann.timestamp}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{ann.content}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block font-medium">
                      Posted by {ann.authorName}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No announcements posted yet.</p>
            )}
          </div>

          {/* Coordinator Contact */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between flex-wrap gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase">
                Student Coordinator
              </span>
              <p className="font-bold text-slate-900">{event.coordinatorContact.name}</p>
              <p className="text-slate-500">{event.clubName}</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`mailto:${event.coordinatorContact.email}`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 transition font-medium"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email</span>
              </a>
              <a
                href={`tel:${event.coordinatorContact.phone}`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 transition font-medium"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>
            </div>
          </div>
        </div>

        {/* Modal Bottom Registration CTA */}
        <div className="bg-slate-900 text-white p-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">
                {event.isFree ? 'Free Event' : `Admission Fee: $${event.fee}`}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-emerald-400 font-semibold">
                +{event.creditPoints} Campus Passport Credits
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {spotsLeft} seats left • Includes official digital QR pass & certificate eligibility
            </p>
          </div>

          {userReg ? (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                id="view-active-reg-pass-btn"
                onClick={() => {
                  setActivePassModalReg(userReg);
                  onClose();
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
              >
                <Ticket className="w-4 h-4" />
                <span>Open Digital Pass ({userReg.ticketCode.slice(-6)})</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              {event.category === 'hackathon' && (
                <input
                  type="text"
                  placeholder="Team Name (optional)"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full sm:w-44 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              )}

              <button
                id="confirm-register-btn"
                disabled={isRegistering || spotsLeft === 0}
                onClick={handleRegister}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                <span>{isRegistering ? 'Generating Pass...' : 'Confirm & Claim QR Pass'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {regError && (
          <div className="bg-rose-600 text-white text-xs px-4 py-2 flex items-center justify-between">
            <span>{regError}</span>
            <button onClick={() => setRegError(null)}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
