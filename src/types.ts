export type UserRole = 'student' | 'organizer' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  avatar: string;
  role: UserRole;
  branch: string;
  year: string;
  college: string;
  interests: string[];
  totalCredits: number;
  passportId: string;
}

export type EventCategory = 
  | 'technical'
  | 'cultural'
  | 'workshop'
  | 'sports'
  | 'hackathon'
  | 'academic'
  | 'management'
  | 'social';

export type EventStatus = 'pending_approval' | 'published' | 'completed' | 'cancelled';

export interface EventAgendaItem {
  time: string;
  title: string;
  speaker?: string;
  description?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  authorName: string;
  isUrgent?: boolean;
}

export interface CampusEvent {
  id: string;
  title: string;
  tagline: string;
  description: string;
  clubName: string;
  clubLogo: string;
  organizerId: string;
  organizerName: string;
  category: EventCategory;
  tags: string[];
  bannerUrl: string;
  date: string;
  time: string;
  endDate?: string;
  endTime?: string;
  venue: string;
  isVirtual: boolean;
  virtualLink?: string;
  capacity: number;
  registeredCount: number;
  attendedCount: number;
  fee: number; // 0 for free
  isFree: boolean;
  eligibility: string;
  status: EventStatus;
  agenda: EventAgendaItem[];
  prerequisites?: string[];
  prizes?: string[];
  coordinatorContact: {
    name: string;
    phone: string;
    email: string;
  };
  creditPoints: number;
  hasCertificate: boolean;
  announcements: Announcement[];
  createdAt: string;
}

export interface Registration {
  id: string;
  eventId: string;
  eventTitle: string;
  eventCategory: EventCategory;
  eventDate: string;
  eventVenue: string;
  clubName: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRollNo: string;
  userBranch: string;
  teamName?: string;
  ticketCode: string;
  registeredAt: string;
  checkedIn: boolean;
  checkedInAt?: string;
  certificateIssued?: boolean;
  feedbackSubmitted?: boolean;
  rating?: number;
  feedbackComment?: string;
}

export interface Certificate {
  id: string;
  certificateNo: string;
  eventId: string;
  eventTitle: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  studentBranch: string;
  issueDate: string;
  organizingClub: string;
  creditPoints: number;
  verificationHash: string;
  signatory: {
    name: string;
    title: string;
  };
}

export interface PassportBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt: string;
  category: string;
}

export interface VerifiedActivity {
  id: string;
  eventId: string;
  eventTitle: string;
  clubName: string;
  date: string;
  category: EventCategory;
  creditPoints: number;
  verifiedBy: string;
  verificationCode: string;
}

export interface CampusPassport {
  studentId: string;
  studentName: string;
  rollNo: string;
  branch: string;
  year: string;
  college: string;
  passportNumber: string;
  totalCredits: number;
  eventsAttended: number;
  certificatesEarned: number;
  badges: PassportBadge[];
  activities: VerifiedActivity[];
}

export interface CheckInResult {
  success: boolean;
  message: string;
  registration?: Registration;
  event?: CampusEvent;
  isDuplicate?: boolean;
}
