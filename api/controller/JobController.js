import JobPosting from '../models/JobPosting.js';

export const createJobPosting = async (req, res) => {
  try {
    const companyId = req.user.userId;
    const {
      title,
      description,
      requiredSkills,
      experienceLevel,
      educationRequired,
      location,
      salary,
      employmentType
    } = req.body;

    const newJobPosting = new JobPosting({
      companyId,
      title,
      description,
      requiredSkills,
      experienceLevel,
      educationRequired,
      location,
      salary,
      employmentType,
      status: 'Active',
      createdAt: new Date()
    });

    await newJobPosting.save();

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully',
      jobPosting: newJobPosting
    });
  } catch (error) {
    console.error('Error creating job posting:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating job posting',
      error: error.message
    });
  }
};

export const getCompanyJobPostings = async (req, res) => {
  try {
    const companyId = req.user.userId;
    const jobPostings = await JobPosting.find({ companyId })
      .sort({ createdAt: -1 }); // Most recent first

    res.json({
      success: true,
      jobPostings
    });
  } catch (error) {
    console.error('Error fetching job postings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job postings',
      error: error.message
    });
  }
};

export const closeJobPosting = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const companyId = req.user.userId;

    const jobPosting = await JobPosting.findOne({ _id: jobId, companyId });

    if (!jobPosting) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found or you do not have permission to close it'
      });
    }

    if (jobPosting.status === 'Closed') {
      return res.status(400).json({
        success: false,
        message: 'Job posting is already closed'
      });
    }

    jobPosting.status = 'Closed';
    await jobPosting.save();

    res.json({
      success: true,
      message: 'Job posting closed successfully',
      jobPosting
    });
  } catch (error) {
    console.error('Error closing job posting:', error);
    res.status(500).json({
      success: false,
      message: 'Error closing job posting',
      error: error.message
    });
  }
};

export const getTotalJobs = async (req, res) => {
  try {
    // Get total number of jobs
    const totalJobs = await JobPosting.countDocuments();

    // Get job statistics
    const activeJobs = await JobPosting.countDocuments({ status: 'Active' });
    const closedJobs = await JobPosting.countDocuments({ status: 'Closed' });

    // Get job distribution by employment type
    const employmentTypeStats = await JobPosting.aggregate([
      { $group: { 
        _id: "$employmentType",
        count: { $sum: 1 }
      } }
    ]);

    // Get job distribution by experience level
    const experienceLevelStats = await JobPosting.aggregate([
      { $group: { 
        _id: "$experienceLevel",
        count: { $sum: 1 }
      } }
    ]);

    res.json({
      success: true,
      data: {
        totalJobs,
        activeJobs,
        closedJobs,
        employmentTypeStats,
        experienceLevelStats
      }
    });
  } catch (error) {
    console.error('Error getting total jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting job statistics',
      error: error.message
    });
  }
};

export const getAllJobPostings = async (req, res) => {
  try {
    const jobPostings = await JobPosting.find({ status: 'Active' })
      .sort({ createdAt: -1 }); // Most recent first

    res.json(jobPostings);
  } catch (error) {
    console.error('Error fetching job postings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job postings',
      error: error.message
    });
  }
};

export const getJobPostingById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const jobPosting = await JobPosting.findById(jobId).populate('companyId');

    if (!jobPosting) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found'
      });
    }

    res.json(jobPosting);
  } catch (error) {
    console.error('Error fetching job posting:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job posting',
      error: error.message
    });
  }
};


// Apply to a job posting
export const applyToJobPosting = async (req, res) => {
  try {
    const seekerId = req.user.userId;
    const jobId = req.params.jobId;

    // Atomically add application if not already applied (only for active jobs)
    const result = await JobPosting.updateOne(
      { _id: jobId, status: 'Active', 'applications.userId': { $ne: seekerId } },
      { $push: { applications: { userId: seekerId, applicationDate: new Date(), status: 'Pending' } } }
    );
    if (result.modifiedCount === 0) {
      const jobExists = await JobPosting.exists({ _id: jobId });
      if (!jobExists) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
      // Prevent applying to closed or filled jobs
      const isActive = await JobPosting.exists({ _id: jobId, status: 'Active' });
      if (!isActive) {
        return res.status(400).json({ success: false, message: 'Cannot apply to a closed job' });
      }
      return res.status(400).json({ success: false, message: 'Already applied to this job' });
    }
    return res.json({ success: true, message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error applying to job:', error);
    res.status(500).json({ success: false, message: 'Error applying to job', error: error.message });
  }
};

export const updateJobPosting = async (req, res) => {
  try {
    const jobId = req.params.id;
    const companyId = req.user.userId;

    // Find the job posting and verify ownership
    const jobPosting = await JobPosting.findOne({ _id: jobId, companyId });

    if (!jobPosting) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found or you do not have permission to update it'
      });
    }

    // Update fields if provided
    const updateFields = [
      'title', 'description', 'requiredSkills', 'experienceLevel',
      'educationRequired', 'location', 'salary', 'employmentType', 'status'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        jobPosting[field] = req.body[field];
      }
    });

    jobPosting.updatedAt = new Date();
    await jobPosting.save();

    res.json({
      success: true,
      message: 'Job posting updated successfully',
      jobPosting
    });
  } catch (error) {
    console.error('Error updating job posting:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating job posting',
      error: error.message
    });
  }
};

export const deleteJobPosting = async (req, res) => {
  try {
    const jobId = req.params.id;
    const companyId = req.user.userId;

    // Find the job posting and verify ownership
    const jobPosting = await JobPosting.findOne({ _id: jobId, companyId });

    if (!jobPosting) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found or you do not have permission to delete it'
      });
    }

    await JobPosting.deleteOne({ _id: jobId });

    res.json({
      success: true,
      message: 'Job posting deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job posting:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting job posting',
      error: error.message
    });
  }
};
