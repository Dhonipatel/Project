import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  Compass,
  Ticket,
  Award,
  Sparkles,
  QrCode,
  LayoutDashboard,
  ShieldCheck,
  RotateCcw,
  ChevronDown,
  UserCheck,
  CalendarDays,
  BotMessageSquare,
  Presentation,
  IdCard,
  UserPlus,
  LogIn,
  LogOut,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    allUsers,
    switchUser,
    activeTab,
    setActiveTab,
    registrations,
    certificates,
    events,
    setIsScannerOpen,
    setIsAiChatOpen,
    resetToDemoData,
    setIsMernModalOpen,
    mernStatus,
    setIsPptModalOpen,
    setIsAuthModalOpen,
    setAuthModalMode,
    setIsIdCardModalOpen,
    setIdCardUser,
  } = useCampus();

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const myPassesCount = registrations.filter((r) => r.userId === currentUser.id && !r.checkedIn).length;
  const myCertsCount = certificates.filter((c) => c.studentId === currentUser.id).length;
  const pendingApprovalsCount = events.filter((e) => e.status === 'pending_approval').length;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner with Persona Switcher & Quick Tools */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            id="mern-status-button"
            onClick={() => setIsMernModalOpen(true)}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono transition"
            title="Open MERN Stack Inspector (MongoDB, Express, React, Node.js)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">MERN STACK</span>
            <span className="text-emerald-400/80 hidden md:inline">
              • {mernStatus?.stack?.mongodb?.connected ? 'MongoDB Live' : 'Mongoose Ready'}
            </span>
          </button>
          <span className="hidden sm:inline text-slate-400">
            Switch test personas to preview real-time roles:
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* My College ID Card Button */}
          <button
            id="view-my-id-card-banner"
            onClick={() => {
              setIdCardUser(currentUser);
              setIsIdCardModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-md text-[11px] font-bold transition"
            title="View Official College Event Student ID Card"
          >
            <IdCard className="w-3.5 h-3.5 text-emerald-400" />
            <span>My College ID Card</span>
          </button>

          {/* Register / Sign Up Button */}
          <button
            id="register-signup-banner"
            onClick={() => {
              setAuthModalMode('signup');
              setIsAuthModalOpen(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-md text-[11px] font-bold transition shadow-sm"
            title="Register new student with Mobile & Gmail OTP"
          >
            <UserPlus className="w-3 h-3" />
            <span>Register (OTP)</span>
          </button>

          {/* Sign In Button */}
          <button
            id="signin-banner"
            onClick={() => {
              setAuthModalMode('signin');
              setIsAuthModalOpen(true);
            }}
            className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 text-[11px] font-semibold transition"
          >
            <LogIn className="w-3 h-3" />
            <span className="hidden sm:inline">Sign In</span>
          </button>

          {/* Persona selector */}
          <div className="relative">
            <button
              id="persona-dropdown-toggle"
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-md border border-slate-700 transition"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-4 h-4 rounded-full object-cover ring-1 ring-emerald-400"
              />
              <span className="font-medium text-[11px] truncate max-w-[100px] sm:max-w-[150px]">
                {currentUser.name}
              </span>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">
                {currentUser.role}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isUserDropdownOpen && (
              <div
                id="persona-dropdown-menu"
                className="absolute right-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-1 text-slate-800 z-50 text-xs"
              >
                {/* ID Card Quick Action */}
                <div className="p-2 border-b border-slate-100 bg-slate-50">
                  <button
                    onClick={() => {
                      setIdCardUser(currentUser);
                      setIsIdCardModalOpen(true);
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs shadow-sm transition"
                  >
                    <IdCard className="w-3.5 h-3.5" />
                    <span>View My College ID Card</span>
                  </button>
                </div>

                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase text-slate-400 border-b border-slate-100">
                  Switch Persona (Interactive Demo)
                </div>
                {allUsers.map((user) => (
                  <button
                    key={user.id}
                    id={`persona-select-${user.id}`}
                    onClick={() => {
                      switchUser(user.id);
                      setIsUserDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-slate-50 transition ${
                      currentUser.id === user.id ? 'bg-emerald-50/80 text-emerald-900 font-semibold' : ''
                    }`}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="truncate">{user.name}</span>
                        <span
                          className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : user.role === 'organizer'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{user.studentIdCardNo || user.branch}</p>
                    </div>
                  </button>
                ))}

                <div className="p-2 border-t border-slate-100 flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setAuthModalMode('signup');
                      setIsAuthModalOpen(true);
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-100 text-xs text-slate-700 flex items-center gap-2 font-medium"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-teal-600" />
                    <span>New Student Registration (OTP)</span>
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalMode('signin');
                      setIsAuthModalOpen(true);
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-100 text-xs text-slate-700 flex items-center gap-2 font-medium"
                  >
                    <LogIn className="w-3.5 h-3.5 text-slate-600" />
                    <span>Sign In to Account</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pitch Deck PPT Button in top banner */}
          <button
            id="open-ppt-banner-button"
            onClick={() => setIsPptModalOpen(true)}
            title="Open Hackathon Pitch Deck (PPT Slides & PDF export)"
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full transition text-[10px] font-bold"
          >
            <Presentation className="w-3 h-3 text-amber-400" />
            <span>HACKATHON PPT</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            id="reset-demo-button"
            onClick={resetToDemoData}
            title="Reset to fresh demo dataset"
            className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1 rounded transition text-[11px]"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div
            id="brand-logo-button"
            onClick={() => setActiveTab('explore')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-slate-900">College Event</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  Official
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                College Event Portal • Connect. Participate. Grow.
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              id="nav-explore-tab"
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'explore'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore Events</span>
            </button>

            <button
              id="nav-passes-tab"
              onClick={() => setActiveTab('my_passes')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'my_passes'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>My QR Passes</span>
              {myPassesCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                  {myPassesCount}
                </span>
              )}
            </button>

            <button
              id="nav-passport-tab"
              onClick={() => setActiveTab('passport')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'passport'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Campus Passport</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                {currentUser.totalCredits} pts
              </span>
            </button>

            <button
              id="nav-certificates-tab"
              onClick={() => setActiveTab('certificates')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'certificates'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Certificates</span>
              {myCertsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                  {myCertsCount}
                </span>
              )}
            </button>

            <div className="h-5 w-px bg-slate-200 mx-1" />

            <button
              id="nav-organizer-tab"
              onClick={() => setActiveTab('organizer')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'organizer'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Organizer Hub</span>
            </button>

            <button
              id="nav-admin-tab"
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'admin'
                  ? 'bg-purple-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Admin</span>
              {pendingApprovalsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Action CTAs: QR Scanner & AI Assistant & PPT */}
          <div className="flex items-center gap-2">
            <button
              id="open-id-card-nav-button"
              onClick={() => {
                setIdCardUser(currentUser);
                setIsIdCardModalOpen(true);
              }}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-bold transition shadow-sm"
              title="View Official College Event Student ID Card"
            >
              <IdCard className="w-4 h-4 text-emerald-600" />
              <span>College ID Card</span>
            </button>

            <button
              id="open-ppt-nav-button"
              onClick={() => setIsPptModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 rounded-lg text-xs font-bold transition shadow-sm"
              title="Open Hackathon Pitch Presentation Deck (PPT Slides)"
            >
              <Presentation className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Pitch Deck</span>
            </button>

            <button
              id="open-scanner-button"
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition border border-slate-200"
              title="Quick QR Pass Verification Terminal"
            >
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Scan QR</span>
            </button>

            <button
              id="open-ai-chat-button"
              onClick={() => setIsAiChatOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm shadow-emerald-600/30 transition"
            >
              <BotMessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Ask CampusBot</span>
              <Sparkles className="w-3 h-3 text-emerald-200 animate-spin" style={{ animationDuration: '4s' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="lg:hidden border-t border-slate-200 bg-white px-2 py-1.5 flex items-center justify-around text-xs">
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center py-1 px-2 rounded ${
            activeTab === 'explore' ? 'text-emerald-600 font-bold' : 'text-slate-600'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span className="text-[10px]">Events</span>
        </button>
        <button
          onClick={() => setActiveTab('my_passes')}
          className={`flex flex-col items-center py-1 px-2 rounded relative ${
            activeTab === 'my_passes' ? 'text-emerald-600 font-bold' : 'text-slate-600'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span className="text-[10px]">Passes</span>
          {myPassesCount > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-emerald-600" />
          )}
        </button>
        <button
          onClick={() => {
            setIdCardUser(currentUser);
            setIsIdCardModalOpen(true);
          }}
          className="flex flex-col items-center py-1 px-2 rounded text-emerald-700 font-semibold"
        >
          <IdCard className="w-4 h-4" />
          <span className="text-[10px]">ID Card</span>
        </button>
        <button
          onClick={() => {
            setAuthModalMode('signup');
            setIsAuthModalOpen(true);
          }}
          className="flex flex-col items-center py-1 px-2 rounded text-teal-700 font-semibold"
        >
          <UserPlus className="w-4 h-4" />
          <span className="text-[10px]">Register</span>
        </button>
        <button
          onClick={() => setActiveTab('passport')}
          className={`flex flex-col items-center py-1 px-2 rounded ${
            activeTab === 'passport' ? 'text-amber-600 font-bold' : 'text-slate-600'
          }`}
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span className="text-[10px]">Passport</span>
        </button>
        <button
          onClick={() => setActiveTab('certificates')}
          className={`flex flex-col items-center py-1 px-2 rounded ${
            activeTab === 'certificates' ? 'text-emerald-600 font-bold' : 'text-slate-600'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span className="text-[10px]">Certs</span>
        </button>
        <button
          onClick={() => setActiveTab('organizer')}
          className={`flex flex-col items-center py-1 px-2 rounded ${
            activeTab === 'organizer' ? 'text-slate-900 font-bold' : 'text-slate-600'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px]">Organizer</span>
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`flex flex-col items-center py-1 px-2 rounded ${
            activeTab === 'admin' ? 'text-purple-700 font-bold' : 'text-slate-600'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px]">Admin</span>
        </button>
      </div>
    </header>
  );
};
