import express from "express";
import AuthenticationController from "../../controller/AuthenticationController.js";

const { 
  registerJobSeeker, 
  registerCompany, 
  registerJobSeekerMiddleware, 
  login, 
  logout, 
  checkAuthStatus, 
  forceLogout, 
  getActiveSessions 
} = AuthenticationController;

const router = express.Router();

// Registration and authentication routes
router.post("/register/seeker", registerJobSeekerMiddleware, registerJobSeeker);
router.post("/register/company", registerCompany);
router.post("/login", login);
router.post("/logout", logout);

// Session management routes
router.get("/status", checkAuthStatus);

// Admin routes (these should be protected with an admin middleware in production)
router.delete("/sessions/:userId", forceLogout);
router.get("/sessions", getActiveSessions);

export default router;