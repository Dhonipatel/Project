import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { connectToDatabase, isDbConnected } from './server/db.ts';
import apiRouter, { seedMongoIfEmpty } from './server/routes/api.ts';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Mount MERN REST API routes
app.use('/api', apiRouter);

// Lazy-initialized Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'IES College Event',
    stack: 'MERN (MongoDB + Express + React + Node.js)',
    mongoConnected: isDbConnected(),
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    timestamp: new Date().toISOString(),
  });
});

// AI generation runner with model fallback for high-demand or transient outages
async function generateWithFallback(
  ai: GoogleGenAI,
  generateFn: (model: string) => Promise<any>
): Promise<any> {
  const models = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastErr: any = null;
  for (let i = 0; i < models.length; i++) {
    try {
      return await generateFn(models[i]);
    } catch (err: any) {
      lastErr = err;
      // If 503 (high demand) or 429/404, smoothly try next model
      if (i < models.length - 1) {
        continue;
      }
    }
  }
  throw lastErr;
}

// Helper: Deterministic high-quality recommendation engine
function calculateRuleRecommendations(studentProfile: any, availableEvents: any[]) {
  const interests = (studentProfile?.interests || []).map((i: string) => String(i).toLowerCase());
  const branch = String(studentProfile?.branch || '').toLowerCase();

  return (availableEvents || []).map((evt: any) => {
    let score = 55;
    const reasons: string[] = [];

    const titleAndDesc = `${evt.title || ''} ${evt.description || ''} ${(evt.tags || []).join(' ')}`.toLowerCase();

    interests.forEach((interest: string) => {
      if (titleAndDesc.includes(interest)) {
        score += 20;
        reasons.push(`Matches your interest in ${interest}`);
      }
    });

    if (branch.includes('computer') && (evt.category === 'hackathon' || evt.category === 'technical')) {
      score += 15;
      reasons.push(`Directly complements your ${studentProfile?.branch || 'engineering'} curriculum`);
    }

    if (evt.hasCertificate) {
      score += 10;
      reasons.push(`Awards +${evt.creditPoints || 15} verified Campus Passport credits`);
    }

    if (reasons.length === 0) {
      reasons.push(`High campus engagement event with certified credit points`);
    }

    return {
      eventId: evt.id,
      matchScore: Math.min(score, 98),
      reason: reasons.slice(0, 2).join(' • '),
    };
  }).sort((a: any, b: any) => b.matchScore - a.matchScore);
}

// Helper: Smart event draft template generator
function createFallbackDraft(topic?: string, category?: string, targetAudience?: string) {
  return {
    title: `${topic || 'Tech & Innovation'} Summit 2025`,
    tagline: `Ignite your potential with hands-on labs, peer collaboration, and verified credentials.`,
    description: `Join us for an electrifying ${category || 'workshop'} exploring ${topic || 'cutting-edge campus technologies'}. Designed especially for ${targetAudience || 'passionate college students'}, this session bridges theoretical concepts with real-world industry tools, mentorship, and high-impact collaborative challenges. Attendees receive verified Campus Passport credit points and recognized certificates.`,
    agenda: [
      { time: '10:00 AM', title: 'Welcome & Interactive Keynote', speaker: 'Distinguished Industry Guest' },
      { time: '11:15 AM', title: 'Hands-on Technical Lab & Deep-Dive', speaker: 'Club Leads & Student Mentors' },
      { time: '02:00 PM', title: 'Project Showcase, Peer Review & Awards', speaker: 'Faculty Coordinator' },
    ],
    tags: [category || 'Workshop', 'HandsOn', 'Innovation', 'CampusCredits', 'Networking'],
    creditPoints: 20,
    prerequisites: ['Laptop with charger', 'Curiosity and enthusiasm to build'],
    source: 'smart-template',
  };
}

// Helper: Smart campus concierge assistant reply
function createFallbackChatReply(message?: string) {
  const lower = String(message || '').toLowerCase();
  if (lower.includes('hackathon') || lower.includes('hackvanguard')) {
    return 'HackVanguard 2025 is scheduled for April 12-13 at the Campus Innovation Center! It offers 350 seats, $5,000+ in prizes, and awards 25 verified Campus Passport credits upon QR check-in.';
  }
  if (lower.includes('credit') || lower.includes('passport')) {
    return 'The Campus Passport is your official transcript of co-curricular engagement. Attending events and getting your QR pass scanned unlocks badges, cryptographic hashes, and graduation honors!';
  }
  if (lower.includes('certificate') || lower.includes('cert')) {
    return 'Certificates are automatically generated and cryptographically issued once an organizer scans your QR pass at an eligible event. View and verify them in the Certificates tab!';
  }
  if (lower.includes('workshop') || lower.includes('ai')) {
    return "Check out the 'Generative AI & Agentic Workflows Masterclass' on April 18 at Turing Computer Lab 304, or the 'UI/UX Design Sprint' on May 2!";
  }
  if (lower.includes('free') || lower.includes('fee')) {
    return 'Most campus events at IES College are 100% free! For paid events like Aura Gala ($5), registration and digital ticket generation are handled seamlessly right inside the portal.';
  }
  return "I'm your IES College Event AI Concierge! I can guide you through upcoming hackathons, passport credits, certificate verification, and QR ticket passes.";
}

// AI: Personalized Event Recommendations
app.post('/api/ai/recommend', async (req, res) => {
  const { studentProfile, availableEvents } = req.body || {};
  try {
    const ai = getGenAI();

    if (!ai) {
      const recommendations = calculateRuleRecommendations(studentProfile, availableEvents);
      return res.json({ recommendations, source: 'curated-rules' });
    }

    const prompt = `You are the IES College Event AI Event Matchmaker for college students.
Evaluate these campus events against the student's profile and provide personalized match scores (0-100) and concise 1-sentence personalized reasons explaining why each event will benefit their career, passport credits, or campus life.

Student:
- Name: ${studentProfile?.name}
- Branch: ${studentProfile?.branch}, Year: ${studentProfile?.year}
- Interests: ${(studentProfile?.interests || []).join(', ')}

Events Catalog:
${JSON.stringify(
  (availableEvents || []).slice(0, 8).map((e: any) => ({
    id: e.id,
    title: e.title,
    category: e.category,
    tags: e.tags,
    creditPoints: e.creditPoints,
    description: (e.description || '').slice(0, 140),
  })),
  null,
  2
)}

Return ONLY valid JSON with no markdown wrapping in this format:
{
  "recommendations": [
    {
      "eventId": "string",
      "matchScore": number,
      "reason": "string"
    }
  ]
}`;

    const response = await generateWithFallback(ai, (model) =>
      ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      })
    );

    const responseText = response.text || '{}';
    const parsed = JSON.parse(responseText);
    const recommendations =
      parsed.recommendations && parsed.recommendations.length > 0
        ? parsed.recommendations
        : calculateRuleRecommendations(studentProfile, availableEvents);
    return res.json({ recommendations, source: 'gemini' });
  } catch {
    // Seamless fallback to deterministic recommendation matching
    const recommendations = calculateRuleRecommendations(studentProfile, availableEvents);
    return res.json({
      recommendations,
      source: 'smart-matcher',
    });
  }
});

// AI: Event Organizer Description & Announcement Assistant
app.post('/api/ai/draft-event', async (req, res) => {
  const { topic, category, targetAudience, duration } = req.body || {};
  try {
    const ai = getGenAI();

    if (!ai) {
      return res.json(createFallbackDraft(topic, category, targetAudience));
    }

    const prompt = `You are the IES College Event AI Event Assistant for student clubs and event organizers.
Generate a high-converting, professional college event blueprint for:
Topic: "${topic}"
Category: "${category}"
Audience: "${targetAudience || 'Undergraduate and graduate students'}"
Duration: "${duration || '1 Day'}"

Return ONLY valid JSON in this structure:
{
  "title": "string",
  "tagline": "string (catchy, max 12 words)",
  "description": "string (engaging 2-3 paragraphs)",
  "agenda": [
    { "time": "string", "title": "string", "speaker": "string" }
  ],
  "tags": ["string", "string", "string", "string"],
  "creditPoints": 15,
  "prerequisites": ["string", "string"]
}`;

    const response = await generateWithFallback(ai, (model) =>
      ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      })
    );

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ ...parsed, source: 'gemini' });
  } catch {
    return res.json(createFallbackDraft(topic, category, targetAudience));
  }
});

// AI: Campus Concierge Chatbot
app.post('/api/ai/chat', async (req, res) => {
  const { message } = req.body || {};
  try {
    const ai = getGenAI();

    if (!ai) {
      return res.json({ reply: createFallbackChatReply(message), source: 'assistant-rules' });
    }

    const systemInstruction = `You are "IES CampusBot", the AI Concierge for the IES College Event platform.
Tagline: "Connect. Participate. Grow."
Help students discover events, explain the Campus Passport credit system, guide them on QR ticket check-ins, certificate downloads, and event registration.
Keep your answers enthusiastic, concise (2-4 sentences max), helpful, and direct.
Events currently available on campus:
- HackVanguard 2025 (36-hr Hackathon, Apr 12, 25 Credits)
- Generative AI Masterclass (Workshop, Apr 18, 15 Credits)
- Aura 2025 Cultural Fest (Gala, Apr 25-27, 10 Credits)
- RoboWars & Drone Derby (Robotics, Apr 20, 20 Credits)
- IES Venture Summit (Startup Pitch, Apr 29, 20 Credits)
- UI/UX Design Sprint (Workshop, May 2, 15 Credits)
- Campus Smash Badminton Derby (Sports, May 5-6, 15 Credits)`;

    const response = await generateWithFallback(ai, (model) =>
      ai.models.generateContent({
        model,
        contents: `${systemInstruction}\n\nStudent asks: "${message}"`,
      })
    );

    return res.json({
      reply: response.text || "I'm here to help you connect, participate, and grow across IES College!",
      source: 'gemini',
    });
  } catch {
    return res.json({
      reply: createFallbackChatReply(message),
      source: 'campus-concierge',
    });
  }
});

// Vite Middleware for development vs Static serving for production
async function setupViteOrStatic() {
  // Connect to MongoDB if MONGODB_URI is provided
  try {
    const connected = await connectToDatabase();
    if (connected) {
      await seedMongoIfEmpty();
    }
  } catch (err) {
    console.warn('[MERN MongoDB] Initial connection check skipped:', err);
  }

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[IES College Event] MERN Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

setupViteOrStatic().catch((err) => {
  console.error('Failed to boot IES College Event server:', err);
  process.exit(1);
});
