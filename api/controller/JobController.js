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

export default {
  createJobPosting,
  getCompanyJobPostings
};
