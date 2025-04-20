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
    console.log(userId,jobId,action)
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
      console.log('ahhhhhhhhhhhhhhhhhhh')
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
    return res.status(500).json({ message: 'Server error', error: error.message });  }
};

export const getTotalUsers = async (req, res) => {
  try {
    // Get total number of users
    const totalUsers = await mongoose.connection.db.collection('jobseekers').countDocuments();

    // Get users by education level
    const educationStats = await mongoose.connection.db.collection('jobseekers').aggregate([
      { $group: { 
        _id: "$educationLevel",
        count: { $sum: 1 }
      } }
    ]).toArray();

    // Get users by experience level
    const experienceStats = await mongoose.connection.db.collection('jobseekers').aggregate([
      { $group: { 
        _id: "$experienceLevel",
        count: { $sum: 1 }
      } }
    ]).toArray();

    // Get users by preferred location
    const locationStats = await mongoose.connection.db.collection('jobseekers').aggregate([
      { $group: { 
        _id: "$preferredLocation",
        count: { $sum: 1 }
      } }
    ]).toArray();

    // Get users by job preferences
    const jobPreferenceStats = await mongoose.connection.db.collection('jobseekers').aggregate([
      { $group: { 
        _id: "$jobPreferences",
        count: { $sum: 1 }
      } }
    ]).toArray();

    // Get average number of interactions per user
    const avgInteractionsPerUser = await Interaction.aggregate([
      {
        $group: {
          _id: "$userId",
          interactionCount: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          avgInteractions: { $avg: "$interactionCount" }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        educationStats,
        experienceStats,
        locationStats,
        jobPreferenceStats,
        avgInteractionsPerUser: avgInteractionsPerUser[0]?.avgInteractions || 0
      }
    });
  } catch (error) {
    console.error('Error getting total users:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user statistics',
      error: error.message
    });
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

export const getUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get all interactions for this user
    const interactions = await Interaction.find({ userId })
      .populate('jobId', 'title company description salary')
      .sort({ createdAt: -1 });

    // Organize interactions by action
    const history = {
      likes: interactions.filter(interaction => interaction.action === 'like'),
      passes: interactions.filter(interaction => interaction.action === 'pass')
    };

    res.json(history);
  } catch (err) {
    console.error('Error getting user history:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUnswipedJobs = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get all job IDs that the user has already interacted with
    const interactedJobs = await Interaction.find({ userId })
      .distinct('jobId');

    // Get all active jobs that the user hasn't interacted with
    const jobs = await JobPosting.find({
      _id: { $nin: interactedJobs },
      status: 'Active'
    })
    .sort({ createdAt: -1 })
    .limit(10); // Limit to 10 jobs at a time

    res.json(jobs);
  } catch (err) {
    console.error('Error getting unswiped jobs:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export default { saveInteraction, getUserInteractions, getLikedJobs, getUserHistory, getUnswipedJobs };
