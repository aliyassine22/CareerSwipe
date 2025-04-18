import mongoose from 'mongoose';

const jobPostingSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requiredSkills: [{
    type: String,
    trim: true
  }],
  experienceLevel: {
    type: String,
    required: true,
    enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive']
  },
  educationRequired: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  salary: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  employmentType: {
    type: String,
    required: true,
    enum: ['Full Time', 'Part Time', 'Contract', 'Internship']
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
jobPostingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const JobPosting = mongoose.model('JobPosting', jobPostingSchema);

export default JobPosting;
