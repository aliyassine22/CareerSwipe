// routes/registerCompany.js
import express from "express";
import Company from "../models/Company.js"; // This is your discriminator model for companies
import multer from "multer";

const CompanyRouter = express.Router();

// Use the Multer configuration defined previously
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/logos/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } 
  else {
    cb(new Error("Invalid file type. Only image files are allowed."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// Registration route for companies with logo upload middleware
CompanyRouter.post("/RegisterCompany", upload.single("companyLogo"), async (req, res) => {
  try {
    // Extract form fields from req.body
    const {
      fullName,          // This should be stored as the base 'name'
      email,
      phone,
      password,
      companyName,
      industry,
      companyWebsite,
      companySize,
      headOfficeLocation,
      rolesHiringFor,
      employmentTypes,   // Assuming this may arrive as a comma-separated string
      businessLicenseNumber,
      linkedInProfile,
      agreeToTerms
    } = req.body;

    // Convert employmentTypes to an array if needed
    const employmentTypesArray = employmentTypes ? employmentTypes.split(",").map(x => x.trim()) : [];

    // Multer places file info in req.file
    const companyLogoPath = req.file ? req.file.path : "";

    // Create a new Company document. Note:
    // - fullName is mapped to the base field 'name'
    // - userType is set to "company" (the discriminator should assign this automatically)
    const company = new Company({
      name: fullName,        // Base field from the User model
      email,
      password,              // Make sure to hash passwords in a real app!
      userType: "company",   // Explicitly setting the userType if needed
      phone,
      companyName,
      industry,
      companyWebsite,
      companySize,
      headOfficeLocation,
      companyLogo: companyLogoPath,
      rolesHiringFor,
      employmentTypes: employmentTypesArray,
      businessLicenseNumber,
      linkedInProfile,
      agreeToTerms: agreeToTerms === "true" || agreeToTerms === true // Coerce checkbox value to Boolean
    });

    await company.save();
    res.json({ success: true, message: "Company registered successfully." });
  } catch (error) {
    console.error("Error registering company:", error);
    res.status(500).json({ success: false, message: "Registration failed.", error: error.message });
  }
});

export default CompanyRouter;
