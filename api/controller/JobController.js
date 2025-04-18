import JobPosting from '../models/JobPosting.js';

const createJobPosting = async (req, res) => {
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
      status: 'active',
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

const getCompanyJobPostings = async (req, res) => {
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

const closeJobPosting = async (req, res) => {
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

export default {
  createJobPosting,
  getCompanyJobPostings,
  closeJobPosting
};
