import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobSeeker', required: true },
  sender: { type: String, enum: ['Company', 'JobSeeker'], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Message', MessageSchema);
