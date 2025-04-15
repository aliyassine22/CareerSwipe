import express from "express";
import AuthenticationController from "../../controller/AuthenticationController.js";

const { registerJobSeeker, registerCompany,registerJobSeekerMiddleware } = AuthenticationController;
const router = express.Router();
router.post("/register/seeker", registerJobSeekerMiddleware,registerJobSeeker);
router.post("/register/company", registerCompany);

export default router;