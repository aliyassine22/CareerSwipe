import express from 'express';
import CompanyController from '../controller/CompanyController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Company profile routes
router.get('/profile', authenticateToken, CompanyController.getCompanyProfile);
router.put('/profile', authenticateToken, CompanyController.updateCompanyProfile);

export default router;

/* DELETE THISSSS */