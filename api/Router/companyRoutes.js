import express from 'express';
import { getCompanyProfile, updateCompanyProfile } from '../controller/CompanyController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get company profile
router.get('/profile/:id', getCompanyProfile);

// Update company profile
router.put('/profile/:id', auth, updateCompanyProfile);

export default router;
