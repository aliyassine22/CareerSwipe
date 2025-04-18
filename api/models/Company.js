import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    industry: { type: String },
    companyWebsite: { type: String },
    phone: { type: String },
    companySize: { type: String },
    headOfficeLocation: { type: String },
    rolesHiringFor: [{ type: String }], // Supports multiple roles
    employmentTypes: [{ type: String }],
    businessLicenseNumber: { type: String },
    linkedInProfile: { type: String },
});

// Create the Company discriminator. The base User model already contains name, email, password, and userType.
// For registration, the "fullName" from the form can be mapped to the base field "name" when creating a new company.
const Company = mongoose.model("Company", companySchema);

export default Company;