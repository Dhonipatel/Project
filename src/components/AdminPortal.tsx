import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import { CampusEvent, UserProfile, UserRole } from '../types';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Users,
  Calendar,
  Award,
  Check,
  X,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const {
    currentUser,
    allUsers,
    events,
    updateEventStatus,
    registrations,
    certificates,
    setSelectedEventId,
  } = useCampus();

  const [activeSubTab, setActiveSubTab] = useState<'approvals' | 'users' | 'analytics'>('approvals');
  const [selectedEventForReview, setSelectedEventForReview] = useState<CampusEvent | null>(null);

  const pendingEvents = events.filter((e) => e.status === 'pending_approval');
  const publishedEvents = events.filter((e) => e.status === 'published');

  const handleApprove = (eventId: string) => {
    updateEventStatus(eventId, 'published');
    setSelectedEventForReview(null);
  };

  const handleReject = (eventId: string) => {
    updateEventStatus(eventId, 'cancelled');
    setSelectedEventForReview(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-purple-800/30">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Campus Governance & Dean Console
            </span>
            <span className="text-xs text-slate-400">Harshit kumar panday (Dean & Administrator of Student Affairs)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Administrative Control & Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review club event proposals, govern accreditation credits, and audit verified activities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-purple-900/40 border border-purple-500/30 px-4 py-2.5 rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
              {pendingEvents.length}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending Queue</span>
              <span className="text-xs font-semibold text-white">Requires Dean Sign-off</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('approvals')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
            activeSubTab === 'approvals' ? 'bg-purple-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Pending Approvals ({pendingEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('users')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
            activeSubTab === 'users' ? 'bg-purple-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User & Role Governance ({allUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
            activeSubTab === 'analytics' ? 'bg-purple-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>System Health & Audit Log</span>
        </button>
      </div>

      {/* SUB-TAB 1: APPROVALS QUEUE */}
      {activeSubTab === 'approvals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">
              Club Proposals Awaiting Official Sanction
            </h3>
            <span className="text-xs text-slate-500">
              Approved events immediately appear in the student discover catalog.
            </span>
          </div>

          {pendingEvents.length > 0 ? (
            <div className="space-y-4">
              {pendingEvents.map((evt) => (
                <div
                  key={evt.id}
                  id={`admin-pending-evt-${evt.id}`}
                  className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <img
                      src={evt.bannerUrl}
                      alt={evt.title}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200';
                      }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          {evt.category}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                          +{evt.creditPoints} Campus Credits
                        </span>
                        <span className="text-xs text-slate-400">
                          Requested by {evt.organizerName} ({evt.clubName})
                        </span>
                      </div>

                      <h4 className="font-bold text-base text-slate-900">{evt.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{evt.description}</p>

                      <div className="flex items-center gap-4 text-xs text-slate-600 mt-2 flex-wrap">
                        <span>Date: <strong>{evt.date}</strong> ({evt.time})</span>
                        <span>•</span>
                        <span>Venue: <strong>{evt.venue}</strong></span>
                        <span>•</span>
                        <span>Capacity: <strong>{evt.capacity} students</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                    <button
                      id={`approve-evt-btn-${evt.id}`}
                      onClick={() => handleApprove(evt.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Publish</span>
                    </button>
                    <button
                      id={`reject-evt-btn-${evt.id}`}
                      onClick={() => handleReject(evt.id)}
                      className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900">All Event Proposals Cleared!</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                There are no pending events waiting for dean approval at this moment.
              </p>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: USER DIRECTORY & ROLES */}
      {activeSubTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Registered Platform Users</h3>
              <p className="text-xs text-slate-500">
                Manage roles, view passport credit accumulation, and inspect campus student standings.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-3 px-3">User</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Department & Year</th>
                  <th className="py-3 px-3">Passport ID</th>
                  <th className="py-3 px-3 text-right">Earned Credits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{user.name}</span>
                          <span className="text-slate-400 text-[11px]">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : user.role === 'organizer'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <p className="font-medium">{user.branch}</p>
                      <p className="text-[10px] text-slate-400">{user.year}</p>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700 font-medium">
                      {user.passportId}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                        {user.totalCredits} pts
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SYSTEM AUDIT LOG */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Published Events</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{publishedEvents.length}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Total Registrations</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{registrations.length}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Verified QR Passes</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {registrations.filter((r) => r.checkedIn).length}
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Certificates Issued</span>
              <p className="text-2xl font-black text-amber-500 mt-1">{certificates.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
            <h3 className="font-bold text-base text-slate-900">Recent Institutional Audit Trail</h3>
            <div className="space-y-2 text-xs">
              {[
                { action: 'Attendance Check-in Verified', detail: 'Nalin kumar pandey checked into Cloud Architecture Bootcamp', time: 'Sep 22, 2026' },
                { action: 'Certificate Minted', detail: 'CERT-2026-KUBE-8801 cryptographically issued', time: 'Sep 24, 2026' },
                { action: 'Event Sanctioned', detail: "HackVanguard '26 approved by Dean Harshit kumar panday", time: 'Sep 01, 2026' },
                { action: 'Event Proposal Submitted', detail: 'Midnight Valorant & BGMI submitted by Devansh Roy', time: 'Dec 01, 2026' },
              ].map((log, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                  <div>
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="text-slate-400 mx-1.5">•</span>
                    <span className="text-slate-600">{log.detail}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
