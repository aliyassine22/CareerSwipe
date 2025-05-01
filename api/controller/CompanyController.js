import mongoose from 'mongoose';
import Company from '../models/Company.js';
import JobPosting from '../models/JobPosting.js';
import bcrypt from 'bcryptjs';
import JobSeeker from '../models/JobSeeker.js';

export const updateCompanyProfile = async (req, res) => {
  try {
    const companyId = req.user.userId; // From auth middleware
    const {
      fullName,
      email,
      password,
      industry,
      companyWebsite,
      phone,
      companySize,
      headOfficeLocation,
      rolesHiringFor,
      employmentTypes,
      businessLicenseNumber,
      linkedInProfile
    } = req.body;

    // Find the company
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    // Update fields if provided
    if (fullName) company.fullName = fullName;
    if (email) company.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      company.password = hashedPassword;
    }
    if (industry) company.industry = industry;
    if (companyWebsite) company.companyWebsite = companyWebsite;
    if (phone) company.phone = phone;
    if (companySize) company.companySize = companySize;
    if (headOfficeLocation) company.headOfficeLocation = headOfficeLocation;
    if (rolesHiringFor) company.rolesHiringFor = rolesHiringFor;
    if (employmentTypes) company.employmentTypes = employmentTypes;
    if (businessLicenseNumber) company.businessLicenseNumber = businessLicenseNumber;
    if (linkedInProfile) company.linkedInProfile = linkedInProfile;

    await company.save();

    // Return updated company data (excluding password)
    const companyData = company.toObject();
    delete companyData.password;

    res.json({
      success: true,
      message: 'Company profile updated successfully',
      company: companyData
    });
  } catch (error) {
    console.error('Error updating company profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating company profile',
      error: error.message
    });
  }
};

export const getCompanyStatistics = async (req, res) => {
  try {
    // Get total number of companies
    const totalCompanies = await Company.countDocuments();

    // Get companies by industry
    const industryStats = await Company.aggregate([
      { $group: { 
        _id: "$industry",
        count: { $sum: 1 }
      } }
    ]);

    // Get companies by company size
    const sizeStats = await Company.aggregate([
      { $group: { 
        _id: "$companySize",
        count: { $sum: 1 }
      } }
    ]);

    // Get companies by employment types
    const employmentTypeStats = await Company.aggregate([
      {
        $group: {
          _id: "$employmentTypes",
          count: { $sum: 1 }
        }
      }
    ]);

    // Get companies by location
    const locationStats = await Company.aggregate([
      { $group: { 
        _id: "$headOfficeLocation",
        count: { $sum: 1 }
      } }
    ]);

    // Get average number of jobs per company
    const avgJobsPerCompany = await JobPosting.aggregate([
      {
        $group: {
          _id: "$companyId",
          jobCount: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          avgJobs: { $avg: "$jobCount" }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalCompanies,
        industryStats,
        sizeStats,
        employmentTypeStats,
        locationStats,
        avgJobsPerCompany: avgJobsPerCompany[0]?.avgJobs || 0
      }
    });
  } catch (error) {
    console.error('Error getting company statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting company statistics',
      error: error.message
    });
  }
};

export const getCompanyProfile = async (req, res) => {
  try {
    const companyId = req.user.userId;
    const company = await Company.findById(companyId).select('-password');
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      company
    });
  } catch (error) {
    console.error('Error fetching company profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching company profile',
      error: error.message
    });
  }
};

// Get all applicants for a company's posted jobs
export const getCompanyApplicants = async (req, res) => {
  try {
    const companyId = req.user.userId;
    // Fetch job postings for this company
    const jobs = await JobPosting.find({ companyId }).select('title applications').lean();
    console.log('getCompanyApplicants - jobs:', JSON.stringify(jobs, null, 2));
    // Collect unique applicant IDs
    const applicantIds = jobs.flatMap(job => job.applications.map(app => app.userId.toString()));
    const uniqueIds = [...new Set(applicantIds)];

    // Fetch seekers from JobSeeker collection
    const seekers = await JobSeeker.find({ _id: { $in: uniqueIds } })
      .select('name email phone_number desiredJobTitle education experienceLevel skills cvFile');
    const seekerMap = seekers.reduce((map, seeker) => { map[seeker._id.toString()] = seeker; return map; }, {});

    // Assemble applicants array
    const finalApplicants = jobs.flatMap(job =>
      job.applications.map(app => {
        const seeker = seekerMap[app.userId.toString()];
        if (!seeker) return null;
        const parts = seeker.name.trim().split(/\s+/);
        const firstName = parts.shift() || '';
        const lastName = parts.join(' ') || '';
        return {
          _id: app._id,
          userId: {
            _id: seeker._id,
            firstName,
            lastName,
            email: seeker.email,
            phone_number: seeker.phone_number,
            desiredJobTitle: seeker.desiredJobTitle,
            education: seeker.education,
            experienceLevel: seeker.experienceLevel,
            skills: seeker.skills,
            cvFile: seeker.cvFile
          },
          jobTitle: job.title,
          applicationDate: app.applicationDate,
          status: app.status
        };
      })
    ).filter(item => item !== null);

    return res.json({ success: true, applicants: finalApplicants });
  } catch (error) {
    console.error('Error fetching company applicants:', error);
    return res.status(500).json({ success: false, message: 'Error fetching applicants', error: error.message });
  }
};

// Export functions directly using named exports above
export const getJobDetails = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const job = await JobPosting.findById(req.params.id)
  .populate('companyId', 'name logo')
  .populate({ path: 'applications.userId', select: 'firstName lastName email' });

if (!job) {
  return res.status(404).json({ success: false, message: 'Job not found' });
}

// Add default if companyId is null
if (!job.companyId) {
  job.companyId = { name: '', logo: null };
}

    let hasApplied = false;
    if (userId) {
      hasApplied = job.applications.some(app => app.userId._id.toString() === userId);
    }
    return res.json({ success: true, job, hasApplied });
  } catch (err) {
    console.error('Error getting job:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};