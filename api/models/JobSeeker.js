import mongoose from "mongoose";

const jobSeekerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  userType: { type: String, value: "seeker"},
  phone_number: { type: String },
  date_of_birth: { type: Date },
  desiredJobTitle: { type: String },
  experienceLevel: { type: String },
  education: { type: String },
  skills: [{ type: String }],
  resume: { type: String }, // We'll use this for storing the CV file path or URL
});

const JobSeeker = mongoose.model("JobSeeker", jobSeekerSchema);

export default JobSeeker;
