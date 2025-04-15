import mongoose from "mongoose";

const jobSeekerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone_number: { type: String },
  date_of_birth: { type: Date },
  desiredJobTitle: { type: String },
  experienceLevel: { type: String },
  education: { type: String },
  skills: [{ type: String }],
  cvFile: { data: Buffer, contentType: String, originalName: String }, // Ensures the CV file is a PDF
});

const JobSeeker = mongoose.model("JobSeeker", jobSeekerSchema);

export default JobSeeker;
