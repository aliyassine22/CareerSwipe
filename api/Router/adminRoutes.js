import express from 'express';
import { adminLogin, getAdminProfile, updateAdminProfile } from '../controller/AdminController.js';
import { adminAuth } from '../controller/AdminController.js';
import { initializeAdmin } from '../initializeAdmin.js';
const router = express.Router();

// Admin authentication routes
router.post('/login', adminLogin);

// Public route to initialize admin
router.post('/initialize', async (req, res) => {
  try {
    await initializeAdmin();
    res.json({ message: 'Admin initialization completed' });
  } catch (error) {
    console.error('Error initializing admin:', error);
    res.status(500).json({ message: 'Error initializing admin' });
  }
});

// Protected admin routes
router.use(adminAuth);

router.get('/profile', getAdminProfile);
router.put('/profile', updateAdminProfile);

export default router;
