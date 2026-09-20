import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificateDocument extends Document {
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

const CertificateSchema = new Schema<ICertificateDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    certificateNo: { type: String, required: true, unique: true, index: true },
    eventId: { type: String, required: true },
    eventTitle: { type: String, required: true },
    studentId: { type: String, required: true, index: true },
    studentName: { type: String, required: true },
    studentRollNo: { type: String, required: true },
    studentBranch: { type: String, required: true },
    issueDate: { type: String, required: true },
    organizingClub: { type: String, required: true },
    creditPoints: { type: Number, default: 10 },
    verificationHash: { type: String, required: true, unique: true, index: true },
    signatory: {
      name: { type: String, default: 'Harshit kumar panday' },
      title: { type: String, default: 'Dean of Student Affairs & Chief Administrator' },
    },
  },
  { timestamps: true }
);

export const CertificateModel =
  mongoose.models.Certificate ||
  mongoose.model<ICertificateDocument>('Certificate', CertificateSchema);
