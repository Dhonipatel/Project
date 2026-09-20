import React from 'react';
import { CampusProvider, useCampus } from './context/CampusContext';
import { Navbar } from './components/Navbar';
import { ExploreEventsView } from './components/ExploreEventsView';
import { MyPassesView } from './components/MyPassesView';
import { CampusPassportView } from './components/CampusPassportView';
import { CertificatesView } from './components/CertificatesView';
import { OrganizerHub } from './components/OrganizerHub';
import { AdminPortal } from './components/AdminPortal';
import { TicketPassModal } from './components/TicketPassModal';
import { CertificateModal } from './components/CertificateModal';
import { QrScannerModal } from './components/QrScannerModal';
import { AiConciergeModal } from './components/AiConciergeModal';
import { MernStackInspectorModal } from './components/MernStackInspectorModal';
import { Sparkles, CalendarDays, Award, ShieldCheck, Heart } from 'lucide-react';

const MainApp: React.FC = () => {
  const {
    activeTab,
    activePassModalReg,
    setActivePassModalReg,
    viewingCertificate,
    setViewingCertificate,
    currentUser,
    setActiveTab,
    setIsMernModalOpen,
  } = useCampus();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {activeTab === 'explore' && <ExploreEventsView />}
        {activeTab === 'my_passes' && <MyPassesView />}
        {activeTab === 'passport' && <CampusPassportView />}
        {activeTab === 'certificates' && <CertificatesView />}
        {activeTab === 'organizer' && <OrganizerHub />}
        {activeTab === 'admin' && <AdminPortal />}
      </main>

      {/* Global Modals */}
      {activePassModalReg && (
        <TicketPassModal
          registration={activePassModalReg}
          onClose={() => setActivePassModalReg(null)}
        />
      )}

      {viewingCertificate && (
        <CertificateModal
          certificate={viewingCertificate}
          onClose={() => setViewingCertificate(null)}
        />
      )}

      <QrScannerModal />
      <AiConciergeModal />
      <MernStackInspectorModal />

      {/* Collegiate Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
              IES
            </div>
            <span className="font-bold text-slate-800">IES College Event</span>
            <span>— Connect. Participate. Grow.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsMernModalOpen(true)}
              className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 transition"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>MERN Stack Console</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('passport')}
              className="text-emerald-700 hover:underline font-semibold"
            >
              Campus Passport Standard
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('organizer')}
              className="text-slate-700 hover:underline font-semibold"
            >
              Organizer Gate Scanner
            </button>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>Production MERN Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <CampusProvider>
      <MainApp />
    </CampusProvider>
  );
}
