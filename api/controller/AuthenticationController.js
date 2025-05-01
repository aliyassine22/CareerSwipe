import express from "express";
import Company from "../models/Company.js";
import JobSeeker from "../models/JobSeeker.js";
import bcrypt from "bcryptjs";
import multer from "multer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Global session store to track active user sessions
const activeSessions = new Map();

// Function to cleanup expired sessions
const cleanupSessions = () => {
  const now = Date.now();
  for (const [userId, session] of activeSessions.entries()) {
    if (session.expiresAt < now) {
      activeSessions.delete(userId);
    }
  }
};



const storage = multer.memoryStorage();
const upload = multer({ storage });
const bcryptSalt = 10; // Define the salt rounds for bcrypt




const registerCompany=async (req, res) => {
  const {
    fullName, // representative's name – not used in this snippet unless you add a field
    email,
    password,
    industry,
    companyWebsite,
    phone,
    companySize,
    headOfficeLocation,
    rolesHiringFor,
    employmentTypes,
    businessLicenseNumber,
    linkedInProfile
  } = req.body;
  
  try {
    const userDoc = await Company.create({
      // Map the form data to your Company schema fields.
      fullName, // From the form (ensuring this key exists in the formData)
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
      industry,
      companyWebsite,
      phone,
      companySize,
      headOfficeLocation,
      // If rolesHiringFor and employmentTypes come as comma-separated strings, split them into arrays.
      rolesHiringFor: typeof rolesHiringFor === 'string'
        ? rolesHiringFor.split(',').map(item => item.trim())
        : rolesHiringFor,
      employmentTypes: typeof employmentTypes === 'string'
        ? employmentTypes.split(',').map(item => item.trim())
        : employmentTypes,
      businessLicenseNumber,
      linkedInProfile
      // The userType defaults to "company" per your schema.
    });
    return res.status(200).json({
      success: true,
      message: 'Registration successful',
      user: userDoc
    });
  } catch (e) {
    console.error("Error in registering user:", e);
  }
};


const registerJobSeekerMiddleware = upload.single('cvFile');
const registerJobSeeker = async (req, res) => {
  // Get the fields from the request body
  const  {
    name,
    email,
    password,
    phone_number,
    date_of_birth,
    desiredJobTitle,
    experienceLevel,
    education,
    skills
  } = req.body;

  // Log endpoint hit for debugging
  console.log("test endpoint");

  try {
    // Create a new JobSeeker document. Use req.file to access the uploaded file.
    const userDoc = await JobSeeker.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
      phone_number,
      date_of_birth,
      desiredJobTitle,
      experienceLevel,
      education,
      skills: typeof skills === 'string'
        ? skills.split(',').map(item => item.trim())
        : skills,
      // Save CV file as a buffer and include metadata
      cvFile: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        originalName: req.file.originalname
      }
    });

    res.json(userDoc);
  } catch (e) {
    console.error(e.message);
    res.status(422).json(e);
  }
};

const login = async (req, res) => {
  // Ensure session object exists
  req.session = req.session || {};
  const { email, password } = req.body;

  try {
    // Try to find the user in both JobSeeker and Company collections
    let user = await JobSeeker.findOne({ email });
    let userType = 'seeker';

    if (!user) {
      user = await Company.findOne({ email });
      userType = 'company';
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Prevent login if another user type is already logged in in session
    if (req.session.userType && req.session.userType !== userType) {
      return res.status(403).json({
        success: false,
        message: 'Please logout first before logging in as another user'
      });
    }

    // Check if user is already logged in elsewhere
    const userId = user._id.toString();
    if (activeSessions.has(userId)) {
      return res.status(403).json({
        success: false,
        message: 'User is already logged in from another device. Please log out from other sessions first.'
      });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, userType },
      process.env.JWT_SECRET || 'AliYassine',
      { expiresIn: '24h' }
    );

    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Save login session
    if (req.session) {
      req.session.userId = userId;
      req.session.userType = userType;
      req.session.sessionId = req.sessionID; // Store the session ID
      
      // Track this session in our global store
      activeSessions.set(userId, {
        sessionId: req.sessionID,
        userType,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours expiry
        loginTime: new Date().toISOString()
      });
    }

    // Determine user type and send appropriate response
    if (user.constructor.modelName === 'JobSeeker') {
      res.json({
        message: "Login successful",
        userType: 'seeker',
        userId: userId
      });
    } else {
      res.json({
        message: "Login successful",
        userType: 'company',
        userId: userId
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
};

const logout = (req, res) => {
  // Clear the token cookie
  res.clearCookie('token');
  
  // Remove user from active sessions
  if (req.session && req.session.userId) {
    activeSessions.delete(req.session.userId);
  }
  
  // Clear any session data if you're using sessions
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
      }
    });
  }
  
  res.json({
    success: true,
    message: 'Successfully logged out'
  });
};

// Create a function to check the authentication status
const checkAuthStatus = (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      authenticated: false,
      message: 'Not authenticated'
    });
  }
  
  const userId = req.session.userId;
  const userSession = activeSessions.get(userId);
  
  if (!userSession) {
    return res.status(401).json({
      authenticated: false,
      message: 'Session expired or not found'
    });
  }
  
  // Session exists and is valid
  return res.json({
    authenticated: true,
    userType: req.session.userType,
    userId: userId
  });
};

// Force logout a specific user (admin function)
const forceLogout = (req, res) => {
  const { userId } = req.params;
  
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required'
    });
  }
  
  if (activeSessions.has(userId)) {
    activeSessions.delete(userId);
    return res.json({
      success: true,
      message: 'User has been forcefully logged out'
    });
  } else {
    return res.status(404).json({
      success: false,
      message: 'User is not currently logged in'
    });
  }
};

// Get all active sessions (admin function)
const getActiveSessions = (req, res) => {
  const sessions = [];
  for (const [userId, session] of activeSessions.entries()) {
    sessions.push({
      userId,
      ...session
    });
  }
  
  return res.json({
    success: true,
    sessions
  });
};

// Set up periodic cleanup every hour
setInterval(cleanupSessions, 3600000);

export default { 
  registerCompany, 
  registerJobSeeker, 
  registerJobSeekerMiddleware, 
  login, 
  logout,
  checkAuthStatus,
  forceLogout,
  getActiveSessions
};
