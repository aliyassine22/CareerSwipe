import express from 'express';
import JobSeekerController from '../../controller/JobSeekerController.js';
import { 
  saveInteraction, 
  getUserInteractions, 
  getLikedJobs, 
  getUserHistory, 
  getUnswipedJobs,
  getTotalUsers
} from '../../controller/InteractionController.js';
import { auth } from '../../middleware/auth.js';
import { applyToJobPosting } from '../../controller/JobController.js';
import { getConversationSeeker, sendMessageSeeker, getThreadsForSeeker } from '../../controller/MessageController.js';

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

router.get('/total-users', getTotalUsers);
router.post('/apply/:jobId', auth, applyToJobPosting);

// Seeker chat endpoints
router.get('/messages', auth, getThreadsForSeeker);
router.get('/messages/:companyId', auth, getConversationSeeker);
router.post('/messages/:companyId', auth, sendMessageSeeker);

export default router;
