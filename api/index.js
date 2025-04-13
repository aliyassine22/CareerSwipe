import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import session  from 'express-session';
import mongoose from "mongoose";
import dotenv from "dotenv";
import CompanyRouter from "./Router/registerComapny.js";
import SeekerRouter from "./Router/registerSeeker.js";


const app = express();

// Load environment variables from .env file
dotenv.config();

// For ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Middleware   --> to fix payloads limits
app.use(express.json({ limit: "100mb" })); // Increase the JSON payload limit
app.use(express.urlencoded({ limit: "100mb", extended: true })); // Increase URL-encoded payload limit
app.use(cookieParser()); // Use cookie-parser
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173", // Allow requests from your frontend
    
  })
);

// MongoDB connection string
mongoose.connect(process.env.MongoUrl)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use('/RegisterCompany', CompanyRouter);
app.use('/RegisterJobSeeker', SeekerRouter);

app.use(session({
  secret: 'AliYassine', // Use a secure secret in production
  resave: false,
  saveUninitialized: false,
  cookie: { secure:false,maxAge: 24 * 60 * 60 * 1000 }, // 1 day
}));


app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
  });
  