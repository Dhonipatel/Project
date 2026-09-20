import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  CampusEvent,
  UserProfile,
  Registration,
  Certificate,
  CampusPassport,
  CheckInResult,
  EventCategory,
  EventStatus,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_EVENTS,
  INITIAL_REGISTRATIONS,
  INITIAL_CERTIFICATES,
  INITIAL_PASSPORTS,
} from '../data/initialData';
import confetti from 'canvas-confetti';

export interface AiRecommendation {
  eventId: string;
  matchScore: number;
  reason: string;
}

export interface MernDiagnostic {
  status: string;
  stack: {
    mongodb: {
      connected: boolean;
      mode: string;
      uriConfigured: boolean;
      collections: {
        users: number;
        events: number;
        registrations: number;
        certificates: number;
      };
    };
    express: {
      status: string;
      port: number;
      routesMounted: string[];
    };
    react: {
      version: string;
      architecture: string;
    };
    node: {
      version: string;
      uptimeSeconds: number;
      memoryUsageMB: number;
    };
  };
  recentLogs: Array<{
    id: string;
    method: string;
    endpoint: string;
    status: number;
    time: string;
    details: string;
  }>;
}

interface CampusContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  switchUser: (userId: string) => void;
  events: CampusEvent[];
  registrations: Registration[];
  certificates: Certificate[];
  passports: Record<string, CampusPassport>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedEventId: string | null;
  setSelectedEventId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  aiRecommendations: AiRecommendation[];
  isLoadingAiRecs: boolean;
  refreshAiRecommendations: () => Promise<void>;
  registerForEvent: (eventId: string, teamName?: string) => Promise<{ success: boolean; message: string; ticketCode?: string }>;
  cancelRegistration: (registrationId: string) => void;
  verifyAndCheckIn: (ticketCode: string) => CheckInResult;
  createEvent: (eventData: Partial<CampusEvent>) => CampusEvent;
  updateEventStatus: (eventId: string, status: EventStatus) => void;
  postAnnouncement: (eventId: string, title: string, content: string, isUrgent?: boolean) => void;
  submitFeedback: (registrationId: string, rating: number, comment: string) => void;
  activePassModalReg: Registration | null;
  setActivePassModalReg: (reg: Registration | null) => void;
  viewingCertificate: Certificate | null;
  setViewingCertificate: (cert: Certificate | null) => void;
  isScannerOpen: boolean;
  setIsScannerOpen: (open: boolean) => void;
  isAiChatOpen: boolean;
  setIsAiChatOpen: (open: boolean) => void;
  resetToDemoData: () => void;
  // MERN diagnostics
  mernStatus: MernDiagnostic | null;
  isMernSyncing: boolean;
  isMernModalOpen: boolean;
  setIsMernModalOpen: (open: boolean) => void;
  fetchMernStatus: () => Promise<void>;
}

const CampusContext = createContext<CampusContextType | undefined>(undefined);

const STORAGE_KEYS = {
  EVENTS: 'ies_college_events_v3',
  REGISTRATIONS: 'ies_college_registrations_v3',
  CERTIFICATES: 'ies_college_certificates_v3',
  PASSPORTS: 'ies_college_passports_v3',
  CURRENT_USER_ID: 'ies_college_current_user_id_v3',
};

export const CampusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'usr_student_1';
  });

  const [events, setEvents] = useState<CampusEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      return saved ? JSON.parse(saved) : INITIAL_REGISTRATIONS;
    } catch {
      return INITIAL_REGISTRATIONS;
    }
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CERTIFICATES);
      return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
    } catch {
      return INITIAL_CERTIFICATES;
    }
  });

  const [passports, setPassports] = useState<Record<string, CampusPassport>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PASSPORTS);
      return saved ? JSON.parse(saved) : INITIAL_PASSPORTS;
    } catch {
      return INITIAL_PASSPORTS;
    }
  });

  // UI state
  const [activeTab, setActiveTab] = useState<string>('explore');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [aiRecommendations, setAiRecommendations] = useState<AiRecommendation[]>([]);
  const [isLoadingAiRecs, setIsLoadingAiRecs] = useState<boolean>(false);

  // Modals
  const [activePassModalReg, setActivePassModalReg] = useState<Registration | null>(null);
  const [viewingCertificate, setViewingCertificate] = useState<Certificate | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);

  // MERN diagnostics state
  const [mernStatus, setMernStatus] = useState<MernDiagnostic | null>(null);
  const [isMernSyncing, setIsMernSyncing] = useState<boolean>(false);
  const [isMernModalOpen, setIsMernModalOpen] = useState<boolean>(false);

  // Fetch MERN status and sync backend data on mount
  const fetchMernStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/mern/status');
      if (res.ok) {
        const data = await res.json();
        setMernStatus(data);
      }
    } catch {
      // server starting up
    }
  }, []);

  // Fetch initial full data from Express + MongoDB backend
  useEffect(() => {
    let isMounted = true;

    async function syncWithMernBackend() {
      setIsMernSyncing(true);
      try {
        const [eventsRes, regsRes, certsRes, usersRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/registrations'),
          fetch('/api/certificates'),
          fetch('/api/users'),
        ]);

        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          if (Array.isArray(eventsData) && eventsData.length > 0 && isMounted) {
            setEvents(eventsData);
          }
        }

        if (regsRes.ok) {
          const regsData = await regsRes.json();
          if (Array.isArray(regsData) && regsData.length > 0 && isMounted) {
            setRegistrations(regsData);
          }
        }

        if (certsRes.ok) {
          const certsData = await certsRes.json();
          if (Array.isArray(certsData) && certsData.length > 0 && isMounted) {
            setCertificates(certsData);
          }
        }

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          if (Array.isArray(usersData) && usersData.length > 0 && isMounted) {
            setUsers(usersData);
          }
        }

        await fetchMernStatus();
      } catch (err) {
        console.warn('[MERN Client] Local cache used while connecting to server:', err);
      } finally {
        if (isMounted) setIsMernSyncing(false);
      }
    }

    syncWithMernBackend();

    const interval = setInterval(() => {
      fetchMernStatus();
    }, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [fetchMernStatus]);

  // Persist local cache backups
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PASSPORTS, JSON.stringify(passports));
  }, [passports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
    const target = users.find((u) => u.id === userId);
    if (target?.role === 'organizer') {
      setActiveTab('organizer');
    } else if (target?.role === 'admin') {
      setActiveTab('admin');
    } else {
      if (activeTab === 'organizer' || activeTab === 'admin') {
        setActiveTab('explore');
      }
    }
  };

  // Fetch AI recommendations
  const refreshAiRecommendations = async () => {
    setIsLoadingAiRecs(true);
    try {
      const publishedEvents = events.filter((e) => e.status === 'published');
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentProfile: currentUser,
          availableEvents: publishedEvents,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.recommendations) && data.recommendations.length > 0) {
          setAiRecommendations(data.recommendations);
          return;
        }
      }
    } catch {
      // handled
    } finally {
      setIsLoadingAiRecs(false);
    }
  };

  useEffect(() => {
    if (currentUser.role === 'student') {
      refreshAiRecommendations();
    }
  }, [currentUser.id, events.length]);

  // Register for Event (Full-Stack MERN API Call)
  const registerForEvent = async (eventId: string, teamName?: string) => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return { success: false, message: 'Event not found' };

    const alreadyRegistered = registrations.find(
      (r) => r.eventId === eventId && r.userId === currentUser.id
    );
    if (alreadyRegistered) {
      return { success: false, message: 'You have already registered for this event!' };
    }

    if (event.registeredCount >= event.capacity) {
      return { success: false, message: 'Sorry, this event has reached full capacity.' };
    }

    // Call MERN backend
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          userId: currentUser.id,
          userName: currentUser.name,
          userEmail: currentUser.email,
          userRollNo: currentUser.rollNo,
          userBranch: currentUser.branch,
          teamName,
        }),
      });

      if (res.ok) {
        const newReg: Registration = await res.json();
        setRegistrations((prev) => [newReg, ...prev]);
        setEvents((prev) =>
          prev.map((e) => (e.id === eventId ? { ...e, registeredCount: e.registeredCount + 1 } : e))
        );
        setActivePassModalReg(newReg);

        try {
          confetti({
            particleCount: 75,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
        fetchMernStatus();
        return { success: true, message: 'Registration confirmed via MERN backend!', ticketCode: newReg.ticketCode };
      }
    } catch (err) {
      console.warn('[MERN Error] Falling back to optimistic registration:', err);
    }

    // Fallback optimistic creation
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const ticketCode = `CAMPUS-PASS-${event.title.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, 'X')}-${randomSuffix}`;
    const fallbackReg: Registration = {
      id: `reg_${Date.now()}`,
      eventId: event.id,
      eventTitle: event.title,
      eventCategory: event.category,
      eventDate: `${event.date} (${event.time})`,
      eventVenue: event.venue,
      clubName: event.clubName,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userRollNo: currentUser.rollNo,
      userBranch: currentUser.branch,
      teamName: teamName || undefined,
      ticketCode,
      registeredAt: new Date().toISOString(),
      checkedIn: false,
    };

    setRegistrations((prev) => [fallbackReg, ...prev]);
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, registeredCount: e.registeredCount + 1 } : e))
    );
    setActivePassModalReg(fallbackReg);
    return { success: true, message: 'Registration successful! Here is your digital QR Pass.', ticketCode };
  };

  // Cancel Registration (Full-Stack MERN API Call)
  const cancelRegistration = async (registrationId: string) => {
    const reg = registrations.find((r) => r.id === registrationId);
    if (!reg) return;

    setRegistrations((prev) => prev.filter((r) => r.id !== registrationId));
    setEvents((prev) =>
      prev.map((e) =>
        e.id === reg.eventId ? { ...e, registeredCount: Math.max(0, e.registeredCount - 1) } : e
      )
    );

    try {
      await fetch(`/api/registrations/${registrationId}`, { method: 'DELETE' });
      fetchMernStatus();
    } catch {
      // ignore
    }
  };

  // QR Check-in & Verification (Full-Stack MERN API Call)
  const verifyAndCheckIn = (inputCode: string): CheckInResult => {
    const cleanedCode = inputCode.trim().toUpperCase();

    // Look for registration by ticketCode or ID
    const reg = registrations.find(
      (r) => r.ticketCode.toUpperCase() === cleanedCode || r.id.toUpperCase() === cleanedCode
    );

    if (!reg) {
      return {
        success: false,
        message: `Invalid pass code: "${inputCode}". No matching registration record exists in the system.`,
      };
    }

    const event = events.find((e) => e.id === reg.eventId);

    if (reg.checkedIn) {
      return {
        success: false,
        isDuplicate: true,
        message: `Already Checked In! ${reg.userName} (${reg.userRollNo}) was checked in at ${reg.checkedInAt || 'earlier session'}.`,
        registration: reg,
        event,
      };
    }

    const checkInTimestamp = new Date().toISOString();
    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Update Registration
    const updatedReg: Registration = {
      ...reg,
      checkedIn: true,
      checkedInAt: formattedTime,
      certificateIssued: event?.hasCertificate || false,
    };

    setRegistrations((prev) => prev.map((r) => (r.id === reg.id ? updatedReg : r)));

    // Update Event attendance count
    if (event) {
      setEvents((prev) =>
        prev.map((e) => (e.id === event.id ? { ...e, attendedCount: e.attendedCount + 1 } : e))
      );
    }

    // Call MERN backend to record gate check-in
    fetch('/api/registrations/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticketCode: cleanedCode,
        verifierName: `${currentUser.name} (${currentUser.role})`,
      }),
    })
      .then(() => fetchMernStatus())
      .catch((e) => console.warn('[MERN Error]', e));

    // Update Student Campus Passport
    const earnedCredits = event?.creditPoints || 15;
    setPassports((prev) => {
      const studentPassport = prev[reg.userId] || {
        studentId: reg.userId,
        studentName: reg.userName,
        rollNo: reg.userRollNo,
        branch: reg.userBranch,
        year: 'Class of 2026',
        college: 'IES College',
        passportNumber: `CP-2024-${Math.floor(1000 + Math.random() * 9000)}`,
        totalCredits: 0,
        eventsAttended: 0,
        certificatesEarned: 0,
        badges: [],
        activities: [],
      };

      const newActivity = {
        id: `act_${Date.now()}`,
        eventId: reg.eventId,
        eventTitle: reg.eventTitle,
        clubName: reg.clubName,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        category: reg.eventCategory,
        creditPoints: earnedCredits,
        verifiedBy: `${currentUser.name} (${currentUser.role})`,
        verificationCode: `VRF-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      };

      const updatedActivities = [newActivity, ...studentPassport.activities];
      const newTotalCredits = studentPassport.totalCredits + earnedCredits;
      const newEventsAttended = studentPassport.eventsAttended + 1;
      let updatedBadges = [...studentPassport.badges];

      if (newEventsAttended >= 1 && !updatedBadges.some((b) => b.id === 'bdg_first')) {
        updatedBadges.push({
          id: 'bdg_first',
          name: 'First Step',
          icon: 'Compass',
          description: 'Successfully checked into your first campus event',
          unlockedAt: 'Just Now',
          category: 'milestone',
        });
      }

      if (newTotalCredits >= 50 && !updatedBadges.some((b) => b.id === 'bdg_credits')) {
        updatedBadges.push({
          id: 'bdg_credits',
          name: 'Honor Roll (50+ Credits)',
          icon: 'Award',
          description: 'Accumulated over 50 verified co-curricular credit points',
          unlockedAt: 'Just Now',
          category: 'academic',
        });
      }

      return {
        ...prev,
        [reg.userId]: {
          ...studentPassport,
          totalCredits: newTotalCredits,
          eventsAttended: newEventsAttended,
          certificatesEarned: event?.hasCertificate
            ? studentPassport.certificatesEarned + 1
            : studentPassport.certificatesEarned,
          badges: updatedBadges,
          activities: updatedActivities,
        },
      };
    });

    // Auto-Issue Certificate if eligible
    if (event?.hasCertificate) {
      const newCert: Certificate = {
        id: `cert_${Date.now()}`,
        certificateNo: `CERT-${new Date().getFullYear()}-${reg.ticketCode.slice(-6)}`,
        eventId: event.id,
        eventTitle: event.title,
        studentId: reg.userId,
        studentName: reg.userName,
        studentRollNo: reg.userRollNo,
        studentBranch: reg.userBranch,
        issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        organizingClub: `${event.clubName} in association with IES College`,
        creditPoints: earnedCredits,
        verificationHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
        signatory: {
          name: 'Harshit kumar panday',
          title: 'Dean of Student Affairs & Chief Administrator',
        },
      };

      setCertificates((prev) => [newCert, ...prev]);
    }

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 },
      });
    } catch {
      // ignore
    }

    return {
      success: true,
      message: `Verified! Welcome ${reg.userName} (${reg.userRollNo}). Entry pass validated and +${earnedCredits} Passport credits credited.`,
      registration: updatedReg,
      event,
    };
  };

  // Create Event (Full-Stack MERN API Call)
  const createEvent = (data: Partial<CampusEvent>): CampusEvent => {
    const newEvent: CampusEvent = {
      id: `evt_${Date.now()}`,
      title: data.title || 'Untitled Campus Event',
      tagline: data.tagline || 'Connect, participate, and learn.',
      description: data.description || 'An exciting event organized on campus.',
      clubName: data.clubName || 'Student Club Alliance',
      clubLogo:
        data.clubLogo ||
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=150',
      organizerId: currentUser.id,
      organizerName: currentUser.name,
      category: (data.category as EventCategory) || 'workshop',
      tags: data.tags || ['Campus', 'Community'],
      bannerUrl:
        data.bannerUrl ||
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
      date: data.date || '2025-05-20',
      time: data.time || '10:00 AM',
      endDate: data.endDate,
      endTime: data.endTime,
      venue: data.venue || 'Student Activity Center',
      isVirtual: Boolean(data.isVirtual),
      virtualLink: data.virtualLink,
      capacity: data.capacity || 100,
      registeredCount: 0,
      attendedCount: 0,
      fee: data.fee || 0,
      isFree: data.fee === 0,
      eligibility: data.eligibility || 'Open to all students',
      status: currentUser.role === 'admin' ? 'published' : 'pending_approval',
      creditPoints: data.creditPoints || 15,
      hasCertificate: data.hasCertificate ?? true,
      agenda: data.agenda || [
        { time: '10:00 AM', title: 'Welcome & Introduction' },
        { time: '11:00 AM', title: 'Main Session & Hands-on' },
        { time: '01:00 PM', title: 'Wrap-up & Q&A' },
      ],
      prerequisites: data.prerequisites || ['College ID Card'],
      prizes: data.prizes,
      coordinatorContact: data.coordinatorContact || {
        name: currentUser.name,
        phone: '+91 98765 43210',
        email: currentUser.email,
      },
      announcements: [],
      createdAt: new Date().toISOString(),
    };

    setEvents((prev) => [newEvent, ...prev]);

    // Send to MERN backend
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent),
    })
      .then(() => fetchMernStatus())
      .catch((e) => console.warn('[MERN Error]', e));

    return newEvent;
  };

  // Update Event status (Harshit Admin Approval / Rejection via MERN)
  const updateEventStatus = (eventId: string, status: EventStatus) => {
    setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, status } : e)));

    fetch(`/api/events/${eventId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
      .then(() => fetchMernStatus())
      .catch((e) => console.warn('[MERN Error]', e));
  };

  // Post announcement (via MERN)
  const postAnnouncement = (eventId: string, title: string, content: string, isUrgent?: boolean) => {
    const newAnnouncement = {
      id: `ann_${Date.now()}`,
      title,
      content,
      timestamp: 'Just now',
      authorName: `${currentUser.name} (${currentUser.role})`,
      isUrgent: Boolean(isUrgent),
    };

    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? { ...e, announcements: [newAnnouncement, ...e.announcements] }
          : e
      )
    );

    fetch(`/api/events/${eventId}/announcements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAnnouncement),
    })
      .then(() => fetchMernStatus())
      .catch((e) => console.warn('[MERN Error]', e));
  };

  // Submit event feedback
  const submitFeedback = (registrationId: string, rating: number, comment: string) => {
    setRegistrations((prev) =>
      prev.map((r) =>
        r.id === registrationId
          ? { ...r, feedbackSubmitted: true, rating, feedbackComment: comment }
          : r
      )
    );

    fetch(`/api/registrations/${registrationId}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, comment }),
    }).catch((e) => console.warn('[MERN Error]', e));
  };

  // Reset to default data
  const resetToDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.REGISTRATIONS);
    localStorage.removeItem(STORAGE_KEYS.CERTIFICATES);
    localStorage.removeItem(STORAGE_KEYS.PASSPORTS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);

    setEvents(INITIAL_EVENTS);
    setRegistrations(INITIAL_REGISTRATIONS);
    setCertificates(INITIAL_CERTIFICATES);
    setPassports(INITIAL_PASSPORTS);
    setCurrentUserId('usr_student_1');
    setActiveTab('explore');

    fetch('/api/reset', { method: 'POST' })
      .then(() => fetchMernStatus())
      .catch(() => {});
  };

  return (
    <CampusContext.Provider
      value={{
        currentUser,
        allUsers: users,
        switchUser,
        events,
        registrations,
        certificates,
        passports,
        activeTab,
        setActiveTab,
        selectedEventId,
        setSelectedEventId,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        aiRecommendations,
        isLoadingAiRecs,
        refreshAiRecommendations,
        registerForEvent,
        cancelRegistration,
        verifyAndCheckIn,
        createEvent,
        updateEventStatus,
        postAnnouncement,
        submitFeedback,
        activePassModalReg,
        setActivePassModalReg,
        viewingCertificate,
        setViewingCertificate,
        isScannerOpen,
        setIsScannerOpen,
        isAiChatOpen,
        setIsAiChatOpen,
        resetToDemoData,
        mernStatus,
        isMernSyncing,
        isMernModalOpen,
        setIsMernModalOpen,
        fetchMernStatus,
      }}
    >
      {children}
    </CampusContext.Provider>
  );
};

export const useCampus = () => {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error('useCampus must be used within a CampusProvider');
  }
  return context;
};
