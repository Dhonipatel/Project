import { Router, Request, Response } from 'express';
import { connectToDatabase, isDbConnected } from '../db';
import { UserModel } from '../models/User';
import { EventModel } from '../models/Event';
import { RegistrationModel } from '../models/Registration';
import { CertificateModel } from '../models/Certificate';
import {
  INITIAL_USERS,
  INITIAL_EVENTS,
  INITIAL_REGISTRATIONS,
  INITIAL_CERTIFICATES,
  INITIAL_PASSPORTS,
} from '../../src/data/initialData';

const router = Router();

// In-memory synced stores (acts as cache or active database when MONGODB_URI is connecting or local)
let memoryUsers = JSON.parse(JSON.stringify(INITIAL_USERS));
let memoryEvents = JSON.parse(JSON.stringify(INITIAL_EVENTS));
let memoryRegistrations = JSON.parse(JSON.stringify(INITIAL_REGISTRATIONS));
let memoryCertificates = JSON.parse(JSON.stringify(INITIAL_CERTIFICATES));
let memoryPassports = JSON.parse(JSON.stringify(INITIAL_PASSPORTS));

// Transaction logs for MERN inspection
interface ApiLog {
  id: string;
  method: string;
  endpoint: string;
  status: number;
  time: string;
  details: string;
}
const recentApiLogs: ApiLog[] = [];

function recordLog(method: string, endpoint: string, status: number, details: string) {
  recentApiLogs.unshift({
    id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    method,
    endpoint,
    status,
    time: new Date().toLocaleTimeString(),
    details,
  });
  if (recentApiLogs.length > 25) recentApiLogs.pop();
}

// Auto-seed MongoDB when connected if collections are empty
export async function seedMongoIfEmpty() {
  if (!isDbConnected()) return;
  try {
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      console.log('[MERN Seeder] Seeding initial users into MongoDB...');
      await UserModel.insertMany(INITIAL_USERS);
    }

    const eventCount = await EventModel.countDocuments();
    if (eventCount === 0) {
      console.log('[MERN Seeder] Seeding initial events into MongoDB...');
      await EventModel.insertMany(INITIAL_EVENTS);
    }

    const regCount = await RegistrationModel.countDocuments();
    if (regCount === 0) {
      console.log('[MERN Seeder] Seeding initial registrations into MongoDB...');
      await RegistrationModel.insertMany(INITIAL_REGISTRATIONS);
    }

    const certCount = await CertificateModel.countDocuments();
    if (certCount === 0) {
      console.log('[MERN Seeder] Seeding initial certificates into MongoDB...');
      await CertificateModel.insertMany(INITIAL_CERTIFICATES);
    }
  } catch (err) {
    console.error('[MERN Seeder] Error checking or seeding MongoDB:', err);
  }
}

// ---------------- MERN HEALTH & DIAGNOSTICS ---------------- //
router.get('/mern/status', async (_req: Request, res: Response) => {
  const mongoLive = isDbConnected();
  let userCount = memoryUsers.length;
  let eventCount = memoryEvents.length;
  let regCount = memoryRegistrations.length;
  let certCount = memoryCertificates.length;

  if (mongoLive) {
    try {
      userCount = await UserModel.countDocuments();
      eventCount = await EventModel.countDocuments();
      regCount = await RegistrationModel.countDocuments();
      certCount = await CertificateModel.countDocuments();
    } catch {
      // fallback to memory count
    }
  }

  recordLog('GET', '/api/mern/status', 200, 'Health check verified');

  return res.json({
    status: 'online',
    stack: {
      mongodb: {
        connected: mongoLive,
        mode: mongoLive ? 'MongoDB Atlas / Local DB' : 'In-Memory State Engine (Mongo-Ready)',
        uriConfigured: Boolean(process.env.MONGODB_URI),
        collections: {
          users: userCount,
          events: eventCount,
          registrations: regCount,
          certificates: certCount,
        },
      },
      express: {
        status: 'active',
        port: 3000,
        routesMounted: [
          '/api/users',
          '/api/events',
          '/api/registrations',
          '/api/certificates',
          '/api/passports',
          '/api/admin/metrics',
        ],
      },
      react: {
        version: '18.3.1',
        architecture: 'Client-Server REST Synchronized',
      },
      node: {
        version: process.version,
        uptimeSeconds: Math.floor(process.uptime()),
        memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      },
    },
    recentLogs: recentApiLogs.slice(0, 10),
  });
});

// ---------------- USER ROUTES ---------------- //
router.get('/users', async (_req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const users = await UserModel.find().lean();
      if (users && users.length > 0) {
        recordLog('GET', '/api/users', 200, `Fetched ${users.length} users from MongoDB`);
        return res.json(users);
      }
    }
    recordLog('GET', '/api/users', 200, `Fetched ${memoryUsers.length} users from memory`);
    return res.json(memoryUsers);
  } catch (error) {
    return res.json(memoryUsers);
  }
});

router.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      const user = await UserModel.findOne({ id }).lean();
      if (user) return res.json(user);
    }
    const memUser = memoryUsers.find((u: any) => u.id === id);
    if (!memUser) return res.status(404).json({ error: 'User not found' });
    return res.json(memUser);
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// ---------------- EVENT ROUTES (Dhoni Patel Organizer & Harshit Admin) ---------------- //
router.get('/events', async (req: Request, res: Response) => {
  try {
    const { category, status } = req.query;
    if (isDbConnected()) {
      const query: any = {};
      if (category && category !== 'all') query.category = category;
      if (status) query.status = status;
      const events = await EventModel.find(query).sort({ date: 1 }).lean();
      if (events && events.length > 0) {
        recordLog('GET', '/api/events', 200, `Found ${events.length} events from MongoDB`);
        return res.json(events);
      }
    }

    let filtered = [...memoryEvents];
    if (category && category !== 'all') {
      filtered = filtered.filter((e) => e.category === category);
    }
    if (status) {
      filtered = filtered.filter((e) => e.status === status);
    }
    recordLog('GET', '/api/events', 200, `Found ${filtered.length} events`);
    return res.json(filtered);
  } catch (error) {
    return res.json(memoryEvents);
  }
});

router.get('/events/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      const event = await EventModel.findOne({ id }).lean();
      if (event) return res.json(event);
    }
    const memEvent = memoryEvents.find((e: any) => e.id === id);
    if (!memEvent) return res.status(404).json({ error: 'Event not found' });
    return res.json(memEvent);
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Create Event (Dhoni Patel - Organizer)
router.post('/events', async (req: Request, res: Response) => {
  try {
    const newEventData = {
      ...req.body,
      id: req.body.id || `evt_${Date.now()}`,
      createdAt: new Date().toISOString(),
      registeredCount: 0,
      attendedCount: 0,
      status: req.body.status || 'published',
      announcements: req.body.announcements || [],
    };

    if (isDbConnected()) {
      await EventModel.create(newEventData);
    }
    memoryEvents.unshift(newEventData);

    recordLog('POST', '/api/events', 201, `Event created: "${newEventData.title}"`);
    return res.status(201).json(newEventData);
  } catch (error: any) {
    recordLog('POST', '/api/events', 400, error.message);
    return res.status(400).json({ error: error.message || 'Failed to create event' });
  }
});

// Update Event Status (Harshit kumar panday - Admin Approval)
router.patch('/events/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending_approval', 'published', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    if (isDbConnected()) {
      await EventModel.findOneAndUpdate({ id }, { status });
    }

    const idx = memoryEvents.findIndex((e: any) => e.id === id);
    if (idx !== -1) {
      memoryEvents[idx].status = status;
    }

    recordLog('PATCH', `/api/events/${id}/status`, 200, `Updated status to ${status}`);
    return res.json({ id, status, success: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to update event status' });
  }
});

// Post Announcement to Event
router.post('/events/:id/announcements', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, isUrgent, authorName } = req.body;

    const newAnnouncement = {
      id: `ann_${Date.now()}`,
      title,
      content,
      timestamp: 'Just now',
      authorName: authorName || 'Dhoni Patel (Lead)',
      isUrgent: Boolean(isUrgent),
    };

    if (isDbConnected()) {
      await EventModel.findOneAndUpdate({ id }, { $push: { announcements: newAnnouncement } });
    }

    const event = memoryEvents.find((e: any) => e.id === id);
    if (event) {
      event.announcements = [newAnnouncement, ...(event.announcements || [])];
    }

    recordLog('POST', `/api/events/${id}/announcements`, 201, `Announcement posted`);
    return res.status(201).json(newAnnouncement);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to post announcement' });
  }
});

// ---------------- REGISTRATIONS & TICKETS ---------------- //
router.get('/registrations', async (req: Request, res: Response) => {
  try {
    const { userId, eventId } = req.query;
    if (isDbConnected()) {
      const q: any = {};
      if (userId) q.userId = userId;
      if (eventId) q.eventId = eventId;
      const regs = await RegistrationModel.find(q).sort({ createdAt: -1 }).lean();
      if (regs.length > 0) return res.json(regs);
    }

    let filtered = [...memoryRegistrations];
    if (userId) filtered = filtered.filter((r: any) => r.userId === userId);
    if (eventId) filtered = filtered.filter((r: any) => r.eventId === eventId);
    return res.json(filtered);
  } catch (error) {
    return res.json(memoryRegistrations);
  }
});

router.post('/registrations', async (req: Request, res: Response) => {
  try {
    const { eventId, userId, userName, userEmail, userRollNo, userBranch, teamName } = req.body;

    let event = memoryEvents.find((e: any) => e.id === eventId);
    if (isDbConnected()) {
      const dbEvent = await EventModel.findOne({ id: eventId }).lean();
      if (dbEvent) event = dbEvent;
    }

    if (!event) return res.status(404).json({ error: 'Event not found' });

    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const cleanTitle = (event.title || 'PASS').substring(0, 4).toUpperCase().replace(/[^A-Z]/g, 'X');
    const ticketCode = `CAMPUS-PASS-${cleanTitle}-${randomSuffix}`;

    const newReg = {
      id: `reg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      eventId: event.id,
      eventTitle: event.title,
      eventCategory: event.category,
      eventDate: `${event.date} (${event.time})`,
      eventVenue: event.venue,
      clubName: event.clubName,
      userId,
      userName,
      userEmail,
      userRollNo,
      userBranch: userBranch || 'Computer Science & Engineering',
      teamName: teamName || undefined,
      ticketCode,
      registeredAt: new Date().toISOString(),
      checkedIn: false,
      certificateIssued: false,
    };

    if (isDbConnected()) {
      await RegistrationModel.create(newReg);
      await EventModel.updateOne({ id: eventId }, { $inc: { registeredCount: 1 } });
    }

    memoryRegistrations.unshift(newReg as any);
    const evIdx = memoryEvents.findIndex((e: any) => e.id === eventId);
    if (evIdx !== -1) memoryEvents[evIdx].registeredCount += 1;

    recordLog('POST', '/api/registrations', 201, `Issued ${ticketCode} to ${userName}`);
    return res.status(201).json(newReg);
  } catch (error: any) {
    recordLog('POST', '/api/registrations', 500, error.message);
    return res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

router.delete('/registrations/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reg = memoryRegistrations.find((r: any) => r.id === id);

    if (isDbConnected()) {
      const dbReg = await RegistrationModel.findOne({ id });
      if (dbReg) {
        await RegistrationModel.deleteOne({ id });
        await EventModel.updateOne({ id: dbReg.eventId }, { $inc: { registeredCount: -1 } });
      }
    }

    if (reg) {
      const evIdx = memoryEvents.findIndex((e: any) => e.id === reg.eventId);
      if (evIdx !== -1) {
        memoryEvents[evIdx].registeredCount = Math.max(0, memoryEvents[evIdx].registeredCount - 1);
      }
      memoryRegistrations = memoryRegistrations.filter((r: any) => r.id !== id);
    }

    recordLog('DELETE', `/api/registrations/${id}`, 200, 'Registration canceled');
    return res.json({ success: true, message: 'Registration canceled' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to cancel registration' });
  }
});

// Feedback submission
router.post('/registrations/:id/feedback', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (isDbConnected()) {
      await RegistrationModel.updateOne(
        { id },
        { feedbackSubmitted: true, rating, feedbackComment: comment }
      );
    }

    const reg = memoryRegistrations.find((r: any) => r.id === id);
    if (reg) {
      reg.feedbackSubmitted = true;
      reg.rating = rating;
      reg.feedbackComment = comment;
    }

    return res.json({ success: true, message: 'Feedback submitted' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ---------------- QR SCAN & CHECK-IN (Organizer Gate Terminal - Dhoni Patel) ---------------- //
router.post('/registrations/checkin', async (req: Request, res: Response) => {
  try {
    const { ticketCode, verifierName = 'Dhoni Patel' } = req.body;
    if (!ticketCode) return res.status(400).json({ success: false, message: 'Pass code is required' });

    const cleanCode = ticketCode.trim().toUpperCase();

    let reg: any = null;
    if (isDbConnected()) {
      reg = await RegistrationModel.findOne({
        $or: [{ ticketCode: cleanCode }, { id: cleanCode }],
      });
    }

    if (!reg) {
      reg = memoryRegistrations.find(
        (r: any) => r.ticketCode.toUpperCase() === cleanCode || r.id.toUpperCase() === cleanCode
      );
    }

    if (!reg) {
      recordLog('POST', '/api/registrations/checkin', 404, `Invalid code: ${cleanCode}`);
      return res.status(404).json({
        success: false,
        message: `Invalid pass code: "${ticketCode}". No matching registration record exists in the system.`,
      });
    }

    const event = memoryEvents.find((e: any) => e.id === reg.eventId);

    if (reg.checkedIn) {
      recordLog('POST', '/api/registrations/checkin', 200, `Duplicate check-in: ${reg.userName}`);
      return res.json({
        success: false,
        isDuplicate: true,
        message: `Already Checked In! ${reg.userName} (${reg.userRollNo}) was checked in at ${reg.checkedInAt || 'earlier'}.`,
        registration: reg,
        event,
      });
    }

    const checkInTimestamp = new Date().toISOString();
    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const earnedCredits = event?.creditPoints || 15;

    reg.checkedIn = true;
    reg.checkedInAt = formattedTime;
    reg.certificateIssued = event?.hasCertificate || false;

    if (isDbConnected()) {
      await RegistrationModel.updateOne(
        { id: reg.id },
        { checkedIn: true, checkedInAt: formattedTime, certificateIssued: reg.certificateIssued }
      );
      await EventModel.updateOne({ id: reg.eventId }, { $inc: { attendedCount: 1 } });
    }

    const evIdx = memoryEvents.findIndex((e: any) => e.id === reg.eventId);
    if (evIdx !== -1) {
      memoryEvents[evIdx].attendedCount = (memoryEvents[evIdx].attendedCount || 0) + 1;
    }

    // Auto issue verified institutional certificate
    let newCert: any = null;
    if (event?.hasCertificate) {
      newCert = {
        id: `cert_${Date.now()}`,
        certificateNo: `CERT-${new Date().getFullYear()}-${reg.ticketCode.slice(-6)}`,
        eventId: event.id,
        eventTitle: event.title,
        studentId: reg.userId,
        studentName: reg.userName,
        studentRollNo: reg.userRollNo,
        studentBranch: reg.userBranch,
        issueDate: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        organizingClub: `${event.clubName} in association with IES College`,
        creditPoints: earnedCredits,
        verificationHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
        signatory: {
          name: 'Harshit kumar panday',
          title: 'Dean of Student Affairs & Chief Administrator',
        },
      };

      if (isDbConnected()) {
        await CertificateModel.create(newCert);
      }
      memoryCertificates.unshift(newCert);
    }

    // Update student passport
    const studentPassport = memoryPassports[reg.userId] || {
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
      verifiedBy: verifierName,
      verificationCode: `VRF-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    };

    studentPassport.activities.unshift(newActivity);
    studentPassport.totalCredits += earnedCredits;
    studentPassport.eventsAttended += 1;
    if (event?.hasCertificate) {
      studentPassport.certificatesEarned += 1;
    }
    memoryPassports[reg.userId] = studentPassport;

    recordLog('POST', '/api/registrations/checkin', 200, `Verified entry for ${reg.userName}`);

    return res.json({
      success: true,
      message: `Verified! Welcome ${reg.userName} (${reg.userRollNo}). Entry pass validated and +${earnedCredits} Passport credits credited.`,
      registration: reg,
      event,
      certificate: newCert,
      passport: studentPassport,
      verifiedBy: verifierName,
    });
  } catch (error: any) {
    recordLog('POST', '/api/registrations/checkin', 500, error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ---------------- CERTIFICATES ---------------- //
router.get('/certificates', async (req: Request, res: Response) => {
  try {
    const { studentId } = req.query;
    if (isDbConnected()) {
      const q: any = {};
      if (studentId) q.studentId = studentId;
      const certs = await CertificateModel.find(q).sort({ createdAt: -1 }).lean();
      if (certs.length > 0) return res.json(certs);
    }

    let filtered = [...memoryCertificates];
    if (studentId) filtered = filtered.filter((c: any) => c.studentId === studentId);
    return res.json(filtered);
  } catch (error) {
    return res.json(memoryCertificates);
  }
});

router.get('/certificates/verify/:hash', async (req: Request, res: Response) => {
  try {
    const { hash } = req.params;
    let cert: any = null;
    if (isDbConnected()) {
      cert = await CertificateModel.findOne({ verificationHash: hash }).lean();
    }
    if (!cert) {
      cert = memoryCertificates.find((c: any) => c.verificationHash === hash);
    }

    if (!cert) {
      recordLog('GET', `/api/certificates/verify/${hash}`, 404, 'Hash not found');
      return res.status(404).json({ valid: false, message: 'Certificate verification failed: Hash not found.' });
    }

    recordLog('GET', `/api/certificates/verify/${hash}`, 200, `Verified ${cert.certificateNo}`);
    return res.json({
      valid: true,
      certificate: cert,
      institution: 'IES College of Technology & Management',
      signatory: cert.signatory || {
        name: 'Harshit kumar panday',
        title: 'Dean of Student Affairs & Chief Administrator',
      },
    });
  } catch (error) {
    return res.status(500).json({ valid: false, message: 'Verification lookup error' });
  }
});

// ---------------- PASSPORTS ---------------- //
router.get('/passports', (_req: Request, res: Response) => {
  return res.json(memoryPassports);
});

router.get('/passports/:studentId', (req: Request, res: Response) => {
  const { studentId } = req.params;
  const p = memoryPassports[studentId];
  if (!p) return res.status(404).json({ error: 'Passport not found' });
  return res.json(p);
});

// ---------------- RESET TO FACTORY DEMO DATA ---------------- //
router.post('/reset', async (_req: Request, res: Response) => {
  memoryUsers = JSON.parse(JSON.stringify(INITIAL_USERS));
  memoryEvents = JSON.parse(JSON.stringify(INITIAL_EVENTS));
  memoryRegistrations = JSON.parse(JSON.stringify(INITIAL_REGISTRATIONS));
  memoryCertificates = JSON.parse(JSON.stringify(INITIAL_CERTIFICATES));
  memoryPassports = JSON.parse(JSON.stringify(INITIAL_PASSPORTS));

  if (isDbConnected()) {
    try {
      await UserModel.deleteMany({});
      await EventModel.deleteMany({});
      await RegistrationModel.deleteMany({});
      await CertificateModel.deleteMany({});
      await seedMongoIfEmpty();
    } catch (e) {
      // ignore
    }
  }

  recordLog('POST', '/api/reset', 200, 'Reset all data to defaults');
  return res.json({ success: true, message: 'Reset to initial campus data' });
});

export default router;
