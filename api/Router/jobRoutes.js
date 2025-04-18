import express from 'express';
import { 
  createJobPosting, 
  getAllJobPostings, 
  getJobPostingById, 
  updateJobPosting, 
  deleteJobPosting,
  getCompanyJobPostings,
  closeJobPosting
} from '../controller/JobController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all job postings for the logged-in company - SPECIFIC ROUTE FIRST
router.get('/company', auth, getCompanyJobPostings);

// Get all job postings
router.get('/', getAllJobPostings);

// Create new job posting (requires authentication)
router.post('/', auth, createJobPosting);

// Close a job posting - SPECIFIC ROUTE BEFORE GENERIC ONES
router.put('/:jobId/close', auth, closeJobPosting);

// Update job posting (requires authentication)
router.put('/:id', auth, updateJobPosting);

// Get job posting by ID - GENERIC PARAMETER ROUTES LAST
router.get('/:id', getJobPostingById);

// Delete job posting (requires authentication)
router.delete('/:id', auth, deleteJobPosting);

export default router;
