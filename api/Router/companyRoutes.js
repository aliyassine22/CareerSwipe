import express from 'express';
import { getCompanyProfile, updateCompanyProfile, getJobDetails} from '../controller/CompanyController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get company profile - route for the logged-in company's own profile
router.get('/profile', auth, getCompanyProfile);

// Get specific company profile by ID
router.get('/profile/:id', getCompanyProfile);

// Update company profile
router.put('/profile', auth, updateCompanyProfile);

// Get job details by ID
router.get('/job/:id', getJobDetails)

export default router;
