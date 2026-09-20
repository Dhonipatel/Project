import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import { CampusEvent, EventCategory } from '../types';
import {
  Plus,
  QrCode,
  Users,
  Megaphone,
  BarChart3,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  Check,
  AlertCircle,
  FileText,
  Sliders,
  ChevronRight,
  TrendingUp,
  Award,
} from 'lucide-react';

export const OrganizerHub: React.FC = () => {
  const {
    currentUser,
    events,
    registrations,
    createEvent,
    verifyAndCheckIn,
    setIsScannerOpen,
    postAnnouncement,
  } = useCampus();

  const [activeTab, setActiveTab] = useState<'events' | 'attendees' | 'create' | 'analytics'>('events');
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [attendeeSearch, setAttendeeSearch] = useState('');

  // AI draft state
  const [aiTopic, setAiTopic] = useState('');
  const [aiCategory, setAiCategory] = useState<EventCategory>('workshop');
  const [isDraftingAi, setIsDraftingAi] = useState(false);

  // New Event Form State
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    category: 'workshop' as EventCategory,
    date: '2025-05-20',
    time: '10:00 AM',
    venue: 'Campus Innovation Center, Room 101',
    capacity: 100,
    fee: 0,
    eligibility: 'Open to all enrolled students',
    creditPoints: 15,
    hasCertificate: true,
    tags: 'AI, Hands-on, Workshop',
    prerequisites: 'Laptop with charger, Student ID card',
  });

  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  // Selected event & attendees
  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];
  const eventRegistrations = registrations.filter((r) => r.eventId === selectedEvent?.id);
  const checkedInCount = eventRegistrations.filter((r) => r.checkedIn).length;
  const attendanceRate = eventRegistrations.length > 0
    ? Math.round((checkedInCount / eventRegistrations.length) * 100)
    : 0;

  // Filtered attendees
  const filteredAttendees = eventRegistrations.filter(
    (r) =>
      r.userName.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      r.userRollNo.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      r.ticketCode.toLowerCase().includes(attendeeSearch.toLowerCase())
  );

  // Auto draft with AI
  const handleAiDraft = async () => {
    if (!aiTopic.trim()) return;
    setIsDraftingAi(true);
    try {
      const res = await fetch('/api/ai/draft-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          category: aiCategory,
          targetAudience: 'College students & tech enthusiasts',
        }),
      });

      if (res.ok) {
        const draft = await res.json();
        setFormData((prev) => ({
          ...prev,
          title: draft.title || prev.title,
          tagline: draft.tagline || prev.tagline,
          description: draft.description || prev.description,
          category: aiCategory,
          creditPoints: draft.creditPoints || 15,
          tags: (draft.tags || []).join(', ') || prev.tags,
          prerequisites: (draft.prerequisites || []).join(', ') || prev.prerequisites,
        }));
      }
    } catch (err) {
      console.warn('AI draft failed:', err);
    } finally {
      setIsDraftingAi(false);
    }
  };

  const handleSubmitNewEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvt = createEvent({
      title: formData.title,
      tagline: formData.tagline,
      description: formData.description,
      category: formData.category,
      date: formData.date,
      time: formData.time,
      venue: formData.venue,
      capacity: Number(formData.capacity) || 100,
      fee: Number(formData.fee) || 0,
      isFree: Number(formData.fee) === 0,
      eligibility: formData.eligibility,
      creditPoints: Number(formData.creditPoints) || 15,
      hasCertificate: formData.hasCertificate,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      prerequisites: formData.prerequisites.split(',').map((t) => t.trim()).filter(Boolean),
      clubName: `${currentUser.name}'s Organization`,
    });

    setCreateSuccess(`Event "${newEvt.title}" created successfully! It is now pending Dean approval.`);
    setTimeout(() => {
      setCreateSuccess(null);
      setActiveTab('events');
      setSelectedEventId(newEvt.id);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Organizer Operations Center
            </span>
            <span className="text-xs text-slate-400">Logged in as {currentUser.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Event Management & Attendance Gate
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build hackathons, scan QR tickets in real-time, broadcast announcements, and monitor attendance metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="organizer-launch-scanner-btn"
            onClick={() => setIsScannerOpen(true)}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <QrCode className="w-4 h-4" />
            <span>Launch Gate Terminal</span>
          </button>
          <button
            id="organizer-create-event-tab-btn"
            onClick={() => setActiveTab('create')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-2 border border-slate-700"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Create New Event</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('events')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'events' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>My Events ({events.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('attendees')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'attendees' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Live Attendees & Check-ins</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'analytics' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Analytics & Turnout</span>
        </button>

        <button
          onClick={() => setActiveTab('create')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'create' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Event Builder</span>
        </button>
      </div>

      {/* TAB 1: EVENTS OVERVIEW */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-base text-slate-900">Campus Events Directory</h3>
            <div className="space-y-3">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEventId(evt.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    selectedEventId === evt.id
                      ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={evt.bannerUrl}
                      alt={evt.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {evt.category}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            evt.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : evt.status === 'pending_approval'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {evt.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 truncate">{evt.title}</h4>
                      <p className="text-xs text-slate-500">
                        {evt.date} • {evt.venue}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-800">
                        {evt.registeredCount} / {evt.capacity}
                      </span>
                      <span className="text-[10px] text-slate-500 block">Registered</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEventId(evt.id);
                        setActiveTab('attendees');
                      }}
                      className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200 transition"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Selected Event Sidebar Panel */}
          {selectedEvent && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 h-fit">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Active Focus Event
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-1">{selectedEvent.title}</h3>
                <p className="text-xs text-slate-500">{selectedEvent.clubName}</p>
              </div>

              {/* Attendance metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Registrations</span>
                  <span className="text-xl font-bold text-slate-900">
                    {selectedEvent.registeredCount}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Turnout</span>
                  <span className="text-xl font-bold text-emerald-700">
                    {selectedEvent.attendedCount} Checked In
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Scan QR Passes at Gate</span>
                </button>
                <button
                  onClick={() => setActiveTab('attendees')}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
                >
                  <Users className="w-4 h-4" />
                  <span>View Attendee List ({eventRegistrations.length})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LIVE ATTENDEES & VERIFICATION */}
      {activeTab === 'attendees' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-slate-900">
                  Attendee Roster for: {selectedEvent?.title}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {eventRegistrations.length} registered • {checkedInCount} verified check-ins ({attendanceRate}% Turnout)
              </p>
            </div>

            {/* Event selector dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setIsScannerOpen(true)}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
              >
                <QrCode className="w-4 h-4" />
                <span>Scan</span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, roll number, or ticket code..."
              value={attendeeSearch}
              onChange={(e) => setAttendeeSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Table */}
          {filteredAttendees.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    <th className="py-3 px-3">Student</th>
                    <th className="py-3 px-3">Roll No & Branch</th>
                    <th className="py-3 px-3">Ticket Code</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Gate Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAttendees.map((attendee) => (
                    <tr key={attendee.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {attendee.userName}
                        {attendee.teamName && (
                          <span className="block text-[10px] text-slate-400 font-normal">
                            Team: {attendee.teamName}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        <span className="font-mono">{attendee.userRollNo}</span>
                        <span className="block text-[10px] text-slate-400">{attendee.userBranch}</span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-700">
                        {attendee.ticketCode}
                      </td>
                      <td className="py-3 px-3">
                        {attendee.checkedIn ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            Checked In
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            Registered
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {attendee.checkedIn ? (
                          <span className="text-[11px] font-mono text-slate-400">
                            {new Date(attendee.checkedInAt || '').toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        ) : (
                          <button
                            onClick={() => verifyAndCheckIn(attendee.ticketCode)}
                            className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold transition inline-flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Check-In</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-xs">No attendees registered under this event yet.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CREATE EVENT (WITH GEMINI AI DRAFTER) */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h3 className="font-black text-xl text-slate-900">Create New Campus Event</h3>
            <p className="text-xs text-slate-500 mt-1">
              Events created by organizers are submitted to the Dean's office for verification and approval.
            </p>
          </div>

          {/* AI Assist Box */}
          <div className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white rounded-2xl p-5 border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <h4 className="font-bold text-xs uppercase tracking-wider">
                Draft with Gemini AI Assistant
              </h4>
            </div>
            <p className="text-xs text-slate-300">
              Enter a rough concept and let AI generate an enticing title, agenda, description, prerequisites, and suggested credits!
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="e.g. 2-day hands-on Flutter app development boot-camp"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <select
                value={aiCategory}
                onChange={(e) => setAiCategory(e.target.value as EventCategory)}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
              >
                <option value="workshop">Workshop</option>
                <option value="hackathon">Hackathon</option>
                <option value="technical">Technical</option>
                <option value="cultural">Cultural</option>
                <option value="management">Management</option>
                <option value="sports">Sports</option>
              </select>
              <button
                type="button"
                disabled={isDraftingAi}
                onClick={handleAiDraft}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 disabled:opacity-50 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isDraftingAi ? 'Drafting...' : 'Auto-Generate'}</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmitNewEvent} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Apex Rust Workshop 2025"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catchy Tagline</label>
                <input
                  type="text"
                  required
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Master memory-safe systems programming"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Event Overview & Description</label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Comprehensive details about mentors, schedule, learning objectives..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as EventCategory })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none"
                >
                  <option value="workshop">Workshop</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="technical">Technical</option>
                  <option value="cultural">Cultural</option>
                  <option value="management">Management</option>
                  <option value="sports">Sports</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Time</label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  placeholder="10:00 AM"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Venue</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Capacity</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Passport Credit Points</label>
                <input
                  type="number"
                  value={formData.creditPoints}
                  onChange={(e) => setFormData({ ...formData, creditPoints: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Prerequisites (Comma-separated)</label>
                <input
                  type="text"
                  value={formData.prerequisites}
                  onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="has-cert-checkbox"
                checked={formData.hasCertificate}
                onChange={(e) => setFormData({ ...formData, hasCertificate: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="has-cert-checkbox" className="text-xs text-slate-700 font-semibold cursor-pointer">
                Issue Verified Certificate of Completion upon Gate QR verification
              </label>
            </div>

            {createSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{createSuccess}</span>
              </div>
            )}

            <div className="pt-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('events')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-sm"
              >
                Submit Event for Approval
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Total Platform Registrations</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{registrations.length}</p>
              <span className="text-[11px] text-emerald-600 font-medium mt-1 inline-flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Across all campus clubs
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-bold">QR Check-in Verification Rate</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">
                {registrations.length > 0
                  ? Math.round((registrations.filter((r) => r.checkedIn).length / registrations.length) * 100)
                  : 0}%
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {registrations.filter((r) => r.checkedIn).length} students validated at gates
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Total Credits Awarded</span>
              <p className="text-2xl font-black text-amber-500 mt-1">
                {events.reduce((acc, e) => acc + e.attendedCount * e.creditPoints, 120)} pts
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Credited towards student Campus Passports
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900">Department Engagement Breakdown</h3>
            <div className="space-y-3">
              {[
                { dept: 'Computer Science & Engineering', percent: 68, color: 'bg-emerald-500' },
                { dept: 'Electronics & Communication', percent: 45, color: 'bg-indigo-500' },
                { dept: 'Mechanical & Robotics', percent: 38, color: 'bg-amber-500' },
                { dept: 'Business & Management', percent: 25, color: 'bg-purple-500' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{item.dept}</span>
                    <span>{item.percent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
