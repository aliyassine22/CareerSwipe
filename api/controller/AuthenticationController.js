import express from "express";
import Company from "../models/Company.js";
import JobSeeker from "../models/JobSeeker.js";
import bcrypt from "bcryptjs";
import multer from "multer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";



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
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Send success response
    res.json({
      success: true,
      user: {
        name: user.name || user.fullName,
        email: user.email,
        userType
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
};

export default { registerCompany, registerJobSeeker, registerJobSeekerMiddleware, login };
