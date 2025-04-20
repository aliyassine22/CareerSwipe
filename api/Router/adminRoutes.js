import express from 'express';
import { adminLogin, getAdminProfile, updateAdminProfile } from '../controller/AdminController.js';
import { adminAuth } from '../controller/AdminController.js';

const router = express.Router();

// Admin authentication routes
router.post('/login', adminLogin);

// Protected admin routes
router.use(adminAuth);

router.get('/profile', getAdminProfile);
router.put('/profile', updateAdminProfile);

export default router;
