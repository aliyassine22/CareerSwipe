import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import JobController from '../controller/JobController.js';

const router = express.Router();

// Protected routes (require authentication)
router.use(authenticateToken);

// Create a new job posting
router.post('/', JobController.createJobPosting);

// Get all job postings for a company
router.get('/company', JobController.getCompanyJobPostings);

// Close a job posting
router.put('/:jobId/close', JobController.closeJobPosting);

export default router;
