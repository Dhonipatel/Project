import React from 'react';
import { CampusEvent, Registration } from '../types';
import { useCampus } from '../context/CampusContext';
import {
  Calendar,
  MapPin,
  Users,
  Award,
  Ticket,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Video,
} from 'lucide-react';

interface EventCardProps {
  event: CampusEvent;
  onSelect: (event: CampusEvent) => void;
  onRegisterClick: (event: CampusEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelect, onRegisterClick }) => {
  const { currentUser, registrations, setActivePassModalReg, aiRecommendations } = useCampus();

  const userReg: Registration | undefined = registrations.find(
    (r) => r.eventId === event.id && r.userId === currentUser.id
  );

  const recommendation = aiRecommendations.find((r) => r.eventId === event.id);

  const spotsLeft = Math.max(0, event.capacity - event.registeredCount);
  const percentFilled = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'hackathon':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'technical':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'workshop':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cultural':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'management':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'sports':
        return 'bg-emerald-950 text-emerald-200 border-emerald-700';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getSportBadge = (tags: string[], title: string) => {
    const combined = `${title} ${tags.join(' ')}`.toLowerCase();
    if (combined.includes('cricket') || combined.includes('ipl')) return { label: 'Cricket', emoji: '🏏', bg: 'bg-emerald-700 text-white border-emerald-500' };
    if (combined.includes('basketball') || combined.includes('hoop')) return { label: 'Basketball', emoji: '🏀', bg: 'bg-orange-600 text-white border-orange-400' };
    if (combined.includes('esports') || combined.includes('gaming') || combined.includes('valorant') || combined.includes('bgmi') || combined.includes('fifa') || combined.includes('video game')) return { label: 'Video Game / Esports', emoji: '🎮', bg: 'bg-purple-700 text-white border-purple-500' };
    if (combined.includes('badminton')) return { label: 'Badminton', emoji: '🏸', bg: 'bg-teal-700 text-white border-teal-500' };
    if (combined.includes('hockey')) return { label: 'Hockey', emoji: '🏑', bg: 'bg-sky-700 text-white border-sky-500' };
    if (combined.includes('swimming') || combined.includes('aquatic')) return { label: 'Swimming', emoji: '🏊', bg: 'bg-cyan-700 text-white border-cyan-500' };
    if (combined.includes('football') || combined.includes('soccer')) return { label: 'Football', emoji: '⚽', bg: 'bg-emerald-800 text-white border-emerald-600' };
    if (combined.includes('volleyball')) return { label: 'Volleyball', emoji: '🏐', bg: 'bg-amber-700 text-white border-amber-500' };
    if (combined.includes('table tennis') || combined.includes('ping pong')) return { label: 'Table Tennis', emoji: '🏓', bg: 'bg-rose-700 text-white border-rose-500' };
    if (combined.includes('chess')) return { label: 'Chess', emoji: '♟️', bg: 'bg-slate-900 text-white border-slate-700' };
    if (combined.includes('athletics') || combined.includes('track') || combined.includes('sprint') || combined.includes('relay')) return { label: 'Athletics', emoji: '🏃', bg: 'bg-red-700 text-white border-red-500' };
    if (combined.includes('kabaddi')) return { label: 'Kabaddi', emoji: '🤼', bg: 'bg-orange-800 text-white border-orange-600' };
    if (combined.includes('tennis')) return { label: 'Lawn Tennis', emoji: '🎾', bg: 'bg-lime-700 text-white border-lime-500' };
    if (combined.includes('carrom') || combined.includes('pool') || combined.includes('billiards')) return { label: 'Pool & Carrom', emoji: '🎱', bg: 'bg-indigo-700 text-white border-indigo-500' };
    if (combined.includes('powerlifting') || combined.includes('tug of war') || combined.includes('strength')) return { label: 'Strongman & Tug of War', emoji: '💪', bg: 'bg-amber-900 text-amber-200 border-amber-600' };
    return null;
  };

  const sportBadge = getSportBadge(event.tags, event.title);

  return (
    <div
      id={`event-card-${event.id}`}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group"
    >
      <div>
        {/* Banner with Badges */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-100">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Graceful fallback to category/sports stock image
              const target = e.target as HTMLImageElement;
              if (event.category === 'sports') {
                target.src = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=1200';
              } else {
                target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200';
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Top Category Badge & Credits */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {sportBadge ? (
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border shadow-md backdrop-blur-md ${sportBadge.bg}`}
                >
                  <span>{sportBadge.emoji}</span>
                  <span>{sportBadge.label}</span>
                </span>
              ) : (
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-sm ${getCategoryColor(
                    event.category
                  )}`}
                >
                  {event.category}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {recommendation && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-md">
                  <Sparkles className="w-3 h-3" />
                  <span>{recommendation.matchScore}% AI Match</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-bold border border-white/10">
                <Award className="w-3 h-3 text-amber-400" />
                <span>+{event.creditPoints} pts</span>
              </span>
            </div>
          </div>

          {/* Organizing Club Strip on Banner */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 text-white">
            <img
              src={event.clubLogo}
              alt={event.clubName}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-white/50"
            />
            <span className="text-xs font-semibold truncate drop-shadow">{event.clubName}</span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-5 space-y-3">
          <div>
            <h3
              onClick={() => onSelect(event)}
              className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-emerald-700 transition cursor-pointer line-clamp-1"
            >
              {event.title}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
              {event.tagline || event.description}
            </p>
          </div>

          {/* AI Recommendation Reason Pill if exists */}
          {recommendation && (
            <div className="bg-emerald-50/90 rounded-lg p-2 border border-emerald-200/80 text-[11px] text-emerald-900 flex items-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{recommendation.reason}</span>
            </div>
          )}

          {/* Date & Venue meta */}
          <div className="space-y-1.5 text-xs text-slate-600 pt-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-medium text-slate-800">
                {event.date} • {event.time}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {event.isVirtual ? (
                <>
                  <Video className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="text-indigo-600 font-medium">Virtual Campus Event</span>
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{event.venue}</span>
                </>
              )}
            </div>
          </div>

          {/* Capacity Progress Bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-500">Registration Status</span>
              <span className="font-semibold text-slate-700">
                {spotsLeft === 0 ? 'Full' : `${spotsLeft} seats left`} ({percentFilled}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  percentFilled > 90 ? 'bg-rose-500' : percentFilled > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${percentFilled}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Strip with Action Buttons */}
      <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
            Entry Fee
          </span>
          <span className="font-extrabold text-xs text-slate-900">
            {event.isFree ? (
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                FREE
              </span>
            ) : (
              `$${event.fee}`
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id={`view-details-btn-${event.id}`}
            onClick={() => onSelect(event)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition text-xs font-semibold"
            title="View Agenda & Info"
          >
            Details
          </button>

          {userReg ? (
            userReg.checkedIn ? (
              <button
                id={`attended-pass-btn-${event.id}`}
                onClick={() => setActivePassModalReg(userReg)}
                className="px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Attended</span>
              </button>
            ) : (
              <button
                id={`view-qr-pass-btn-${event.id}`}
                onClick={() => setActivePassModalReg(userReg)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-emerald-600/20"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>View QR Pass</span>
              </button>
            )
          ) : spotsLeft === 0 ? (
            <button
              disabled
              className="px-3.5 py-2 bg-slate-100 text-slate-400 rounded-xl text-xs font-bold cursor-not-allowed"
            >
              Sold Out
            </button>
          ) : (
            <button
              id={`register-btn-${event.id}`}
              onClick={() => onRegisterClick(event)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm"
            >
              <span>Register</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
