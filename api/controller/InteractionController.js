import mongoose from 'mongoose';
import JobPosting from '../models/JobPosting.js';

// Create a schema for job interactions
const interactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobSeeker',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPosting',
    required: true
  },
  action: {
    type: String,
    enum: ['like', 'pass'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the model
const Interaction = mongoose.model('Interaction', interactionSchema);

// Save a new interaction (like or pass)
export const saveInteraction = async (req, res) => {
  try {
    const { userId, jobId, action } = req.body;
    
    // Validate inputs
    if (!userId || !jobId || !action) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Check if job exists
    const job = await JobPosting.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }
    
    // Check if interaction already exists
    const existingInteraction = await Interaction.findOne({ userId, jobId });
    
    if (existingInteraction) {
      // Update existing interaction
      existingInteraction.action = action;
      await existingInteraction.save();
      return res.status(200).json({ message: 'Interaction updated', interaction: existingInteraction });
    } else {
      // Create new interaction
      const newInteraction = new Interaction({
        userId,
        jobId,
        action
      });
      
      await newInteraction.save();
      return res.status(201).json({ message: 'Interaction saved', interaction: newInteraction });
    }
  } catch (error) {
    console.error('Error saving interaction:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all interactions for a user
export const getUserInteractions = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const interactions = await Interaction.find({ userId })
      .populate('jobId')
      .sort({ createdAt: -1 });
    
    return res.status(200).json(interactions);
  } catch (error) {
    console.error('Error getting user interactions:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all liked jobs for a user
export const getLikedJobs = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const likedInteractions = await Interaction.find({ 
      userId, 
      action: 'like' 
    }).populate('jobId');
    
    const likedJobs = likedInteractions.map(interaction => interaction.jobId);
    
    return res.status(200).json(likedJobs);
  } catch (error) {
    console.error('Error getting liked jobs:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export default { saveInteraction, getUserInteractions, getLikedJobs };
