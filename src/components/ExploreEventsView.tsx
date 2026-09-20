import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import { CampusEvent, EventCategory } from '../types';
import { EventCard } from './EventCard';
import { EventDetailModal } from './EventDetailModal';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Calendar,
  Award,
  Filter,
  CheckCircle2,
  X,
  RefreshCw,
} from 'lucide-react';

export const ExploreEventsView: React.FC = () => {
  const {
    currentUser,
    events,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    aiRecommendations,
    isLoadingAiRecs,
    refreshAiRecommendations,
    registerForEvent,
  } = useCampus();

  const [selectedEventForModal, setSelectedEventForModal] = useState<CampusEvent | null>(null);
  const [filterFreeOnly, setFilterFreeOnly] = useState(false);
  const [filterCertOnly, setFilterCertOnly] = useState(false);

  const categories: { label: string; value: string }[] = [
    { label: 'All Events', value: 'all' },
    { label: 'Hackathons', value: 'hackathon' },
    { label: 'Workshops', value: 'workshop' },
    { label: 'Technical', value: 'technical' },
    { label: 'Cultural Fests', value: 'cultural' },
    { label: 'Startup & Pitch', value: 'management' },
    { label: 'Sports', value: 'sports' },
  ];

  // Only display published events to students
  const publishedEvents = events.filter((e) => e.status === 'published');

  const filteredEvents = publishedEvents.filter((evt) => {
    const matchesCat = selectedCategory === 'all' || evt.category === selectedCategory;
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.clubName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFree = !filterFreeOnly || evt.isFree;
    const matchesCert = !filterCertOnly || evt.hasCertificate;

    return matchesCat && matchesSearch && matchesFree && matchesCert;
  });

  // Top recommendation for banner
  const topRec = aiRecommendations.length > 0 ? aiRecommendations[0] : null;
  const topRecEvent = topRec ? events.find((e) => e.id === topRec.eventId) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner with AI Personalization for Students */}
      {currentUser.role === 'student' && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 border border-emerald-500/20 shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Event Radar for {currentUser.name}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Connect. Participate. Grow.
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore accredited campus fests, register in seconds, and scan your verified digital QR passes to collect credit points toward your official Campus Passport.
            </p>

            {topRecEvent && (
              <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center shrink-0">
                    {topRec?.matchScore}%
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      #1 Top Match for your {currentUser.branch.split(' ')[0]} track
                    </span>
                    <h4 className="font-bold text-sm text-white">{topRecEvent.title}</h4>
                    <p className="text-[11px] text-slate-300">{topRec?.reason}</p>
                  </div>
                </div>

                <button
                  id="view-top-rec-btn"
                  onClick={() => setSelectedEventForModal(topRecEvent)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition shrink-0"
                >
                  Inspect & Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="event-search-input"
              type="text"
              placeholder="Search by event title, hackathon track, club, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterFreeOnly(!filterFreeOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition border ${
                filterFreeOnly
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Free Entry Only
            </button>

            <button
              onClick={() => setFilterCertOnly(!filterCertOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition border ${
                filterCertOnly
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Has Certificate
            </button>

            <button
              id="refresh-ai-recs-btn"
              onClick={refreshAiRecommendations}
              disabled={isLoadingAiRecs}
              className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 rounded-xl transition"
              title="Refresh AI Matchmaker Recommendations"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingAiRecs ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Category Pill Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.value}
              id={`cat-filter-${cat.value}`}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition shrink-0 ${
                selectedCategory === cat.value
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onSelect={(evt) => setSelectedEventForModal(evt)}
              onRegisterClick={(evt) => setSelectedEventForModal(evt)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Events Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            No events match your current filter criteria. Try clearing search keywords or category filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setFilterFreeOnly(false);
              setFilterCertOnly(false);
            }}
            className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedEventForModal && (
        <EventDetailModal
          event={selectedEventForModal}
          onClose={() => setSelectedEventForModal(null)}
        />
      )}
    </div>
  );
};
