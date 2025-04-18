import express from 'express';
import { 
  createJobPosting, 
  getAllJobPostings, 
  getJobPostingById, 
  updateJobPosting, 
  deleteJobPosting 
} from '../controller/JobController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all job postings
router.get('/', getAllJobPostings);

// Get job posting by ID
router.get('/:id', getJobPostingById);

// Create new job posting (requires authentication)
router.post('/', auth, createJobPosting);

// Update job posting (requires authentication)
router.put('/:id', auth, updateJobPosting);

// Delete job posting (requires authentication)
router.delete('/:id', auth, deleteJobPosting);

export default router;
