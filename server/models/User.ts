import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDocument extends Document {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  avatar: string;
  role: 'student' | 'organizer' | 'admin';
  branch: string;
  year: string;
  college: string;
  interests: string[];
  totalCredits: number;
  passportId: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    rollNo: { type: String, required: true },
    avatar: { type: String, default: '' },
    role: { type: String, enum: ['student', 'organizer', 'admin'], default: 'student' },
    branch: { type: String, required: true },
    year: { type: String, required: true },
    college: { type: String, default: 'IES College' },
    interests: [{ type: String }],
    totalCredits: { type: Number, default: 0 },
    passportId: { type: String, required: true },
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
