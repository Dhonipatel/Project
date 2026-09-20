import mongoose, { Schema, Document } from 'mongoose';

export interface IRegistrationDocument extends Document {
  id: string;
  eventId: string;
  eventTitle: string;
  eventCategory: string;
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

const RegistrationSchema = new Schema<IRegistrationDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    eventId: { type: String, required: true, index: true },
    eventTitle: { type: String, required: true },
    eventCategory: { type: String, required: true },
    eventDate: { type: String, required: true },
    eventVenue: { type: String, required: true },
    clubName: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userRollNo: { type: String, required: true },
    userBranch: { type: String, required: true },
    teamName: { type: String },
    ticketCode: { type: String, required: true, unique: true, index: true },
    registeredAt: { type: String, default: () => new Date().toISOString() },
    checkedIn: { type: Boolean, default: false, index: true },
    checkedInAt: { type: String },
    certificateIssued: { type: Boolean, default: false },
    feedbackSubmitted: { type: Boolean, default: false },
    rating: { type: Number },
    feedbackComment: { type: String },
  },
  { timestamps: true }
);

export const RegistrationModel =
  mongoose.models.Registration ||
  mongoose.model<IRegistrationDocument>('Registration', RegistrationSchema);
