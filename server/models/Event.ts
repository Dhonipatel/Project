import mongoose, { Schema, Document } from 'mongoose';

export interface IEventDocument extends Document {
  id: string;
  title: string;
  tagline: string;
  description: string;
  clubName: string;
  clubLogo: string;
  organizerId: string;
  organizerName: string;
  category: string;
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
  fee: number;
  isFree: boolean;
  eligibility: string;
  status: 'pending_approval' | 'published' | 'completed' | 'cancelled';
  agenda: {
    time: string;
    title: string;
    speaker?: string;
    description?: string;
  }[];
  prerequisites?: string[];
  prizes?: string[];
  coordinatorContact: {
    name: string;
    phone: string;
    email: string;
  };
  creditPoints: number;
  hasCertificate: boolean;
  announcements: {
    id: string;
    title: string;
    content: string;
    timestamp: string;
    authorName: string;
    isUrgent?: boolean;
  }[];
  createdAt: string;
}

const EventSchema = new Schema<IEventDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    tagline: { type: String, default: '' },
    description: { type: String, required: true },
    clubName: { type: String, required: true },
    clubLogo: { type: String, default: '' },
    organizerId: { type: String, required: true },
    organizerName: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    bannerUrl: { type: String, default: '' },
    date: { type: String, required: true },
    time: { type: String, required: true },
    endDate: { type: String },
    endTime: { type: String },
    venue: { type: String, required: true },
    isVirtual: { type: Boolean, default: false },
    virtualLink: { type: String },
    capacity: { type: Number, default: 100 },
    registeredCount: { type: Number, default: 0 },
    attendedCount: { type: Number, default: 0 },
    fee: { type: Number, default: 0 },
    isFree: { type: Boolean, default: true },
    eligibility: { type: String, default: 'All College Students' },
    status: {
      type: String,
      enum: ['pending_approval', 'published', 'completed', 'cancelled'],
      default: 'published',
      index: true,
    },
    agenda: [
      {
        time: { type: String },
        title: { type: String },
        speaker: { type: String },
        description: { type: String },
      },
    ],
    prerequisites: [{ type: String }],
    prizes: [{ type: String }],
    coordinatorContact: {
      name: { type: String, default: 'Dhoni Patel' },
      phone: { type: String, default: '+91 98765 43210' },
      email: { type: String, default: 'events@iescollege.edu' },
    },
    creditPoints: { type: Number, default: 10 },
    hasCertificate: { type: Boolean, default: true },
    announcements: [
      {
        id: { type: String },
        title: { type: String },
        content: { type: String },
        timestamp: { type: String },
        authorName: { type: String },
        isUrgent: { type: Boolean, default: false },
      },
    ],
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export const EventModel = mongoose.models.Event || mongoose.model<IEventDocument>('Event', EventSchema);
