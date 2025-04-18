import express from 'express';
import JobSeekerController from '../../controller/JobSeekerController.js';

const router = express.Router();

// Profile routes
router.get('/profile/:id', JobSeekerController.getProfile);
router.put('/profile/:id', JobSeekerController.updateProfile);

// CV routes
router.post('/cv/:id', JobSeekerController.uploadCV);
router.delete('/cv/:id', JobSeekerController.removeCV);
router.get('/cv/:id', JobSeekerController.downloadCV);

export default router;
