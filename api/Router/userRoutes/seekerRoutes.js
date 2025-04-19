import express from 'express';
import JobSeekerController from '../../controller/JobSeekerController.js';
import { saveInteraction, getUserInteractions, getLikedJobs, getUserHistory, getUnswipedJobs } from '../../controller/InteractionController.js';

const router = express.Router();

// Profile routes
router.get('/profile/:id', JobSeekerController.getProfile);
router.put('/profile/:id', JobSeekerController.updateProfile);

// CV routes
router.post('/cv/:id', JobSeekerController.uploadCV);
router.delete('/cv/:id', JobSeekerController.removeCV);
router.get('/cv/:id', JobSeekerController.downloadCV);

// Job interaction routes
router.post('/interactions', saveInteraction);
router.get('/interactions/:userId', getUserInteractions);
router.get('/liked-jobs/:userId', getLikedJobs);
router.get('/history/:userId', getUserHistory);
router.get('/unswiped-jobs/:userId', getUnswipedJobs);

export default router;
