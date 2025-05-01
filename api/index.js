import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import session  from 'express-session';
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import AuthenticationRoutes from "./Router/userRoutes/AuthenticationRoutes.js";
import seekerRoutes from "./Router/userRoutes/seekerRoutes.js";
import CompanyRoutes from "./Router/companyRoutes.js";
import JobRoutes from "./Router/jobRoutes.js";
import adminRoutes from "./Router/adminRoutes.js"; // Import admin routes

import openaiRoutes from './Router/openaiRoutes.js';


// Ensure the file exists and exports a valid router object
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

const bcryptSalt = 10; // Define the salt rounds for bcrypt
// import CompanyRouter from "./Router/registerComapny.js";
// import SeekerRouter from "./Router/registerSeeker.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });
const app = express();

// For ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({
  path: path.join(__dirname, '.env')
});


// Middleware   --> to fix payloads limits
app.use(express.json({ limit: "100mb" })); // Increase the JSON payload limit
app.use(express.urlencoded({ limit: "100mb", extended: true })); // Increase URL-encoded payload limit
app.use(cookieParser()); // Use cookie-parser
app.use(bodyParser.json({ limit: "100mb" })); // Increase the JSON payload limit
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173", // Allow requests from your frontend
    
  })
);

// MongoDB connection string
const mongoUrl = "mongodb+srv://ali123:ali321987@ac-qhiyeui.2v6kk0m.mongodb.net/?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      autoIndex: true, // Enable automatic index creation
      retryWrites: true, // Enable retryable writes
      w: 'majority' // Write concern
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    setTimeout(connectDB, 5000); // Retry connection after 5 seconds
  }
};

// Initial connection
connectDB();

// Monitor connection events
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  // Attempt to reconnect
  setTimeout(connectDB, 5000);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  // Attempt to reconnect
  setTimeout(connectDB, 5000);
});

// Routes
app.use('/auth', AuthenticationRoutes);
app.use('/seeker', seekerRoutes);
app.use('/company', CompanyRoutes);
app.use('/company/jobs', JobRoutes);
app.use('/admin', adminRoutes);

app.use('/api/openai', openaiRoutes); // 


app.use(session({
  secret: 'AliYassine', // Use a secure secret in production
  resave: false,
  saveUninitialized: false,
  cookie: { secure:false,maxAge: 24 * 60 * 60 * 1000 }, // 1 day
}));


app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
  });
  