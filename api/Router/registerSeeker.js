// routes/register.js (or your corresponding route file)
import express from "express";
import JobSeeker from "../models/JobSeeker.js";
import multer from "multer";

const SeekerRouter = express.Router();

// Use the previously defined Multer configuration (or redefine it here)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/cvs/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDFs are allowed."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// Registration route for job seekers that handles file upload
SeekerRouter.post("/RegisterJobSeeker", upload.single("cvFile"), async (req, res) => {
  try {
    const {
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

    // Process skills from a comma-separated string if needed
    const skillsArray = skills ? skills.split(",").map(skill => skill.trim()) : [];

    // Multer attaches file information in req.file
    // Save the file path to resume or process it further as needed
    const cvFilePath = req.file ? req.file.path : "";

    // Create the new job seeker. The base user model handles name, email, password, and userType.
    // Since we are using a discriminator, ensure userType is set (though this is usually handled automatically by the discriminator)
    const jobSeeker = new JobSeeker({
      name,
      email,
      password, // Remember: You should hash passwords before storing them.
      userType: "seeker",
      phone_number,
      date_of_birth,
      desiredJobTitle,
      experienceLevel,
      education,
      skills: skillsArray,
      resume: cvFilePath
    });

    await jobSeeker.save();
    res.json({ success: true, message: "Job seeker registered successfully." });
    console.log("Job seeker registered successfully:", jobSeeker);
  } catch (error) {
    console.error("Error registering job seeker:", error);
    res.status(500).json({ success: false, message: "Registration failed." });
  }
});

export default SeekerRouter;
