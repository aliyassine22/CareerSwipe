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

    if (jobPosting.status === 'closed') {
      return res.status(400).json({
        success: false,
        message: 'Job posting is already closed'
      });
    }

    jobPosting.status = 'closed';
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

export const getAllJobPostings = async (req, res) => {
  try {
    const jobPostings = await JobPosting.find({ status: 'active' })
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
    const jobPosting = await JobPosting.findById(jobId);

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
