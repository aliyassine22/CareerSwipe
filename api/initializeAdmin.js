import mongoose from 'mongoose';
import Admin from './models/Admin.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const adminData = {
  email: "admin@careerSwipe.com",
  password: "123",
  firstName: "System",
  lastName: "Administrator",
  role: "superadmin"
};

export const initializeAdmin = async () => {
  try {
    // Connect to MongoDB
    // await mongoose.connect('mongodb+srv://ali123:ali321987@ac-qhiyeui.2v6kk0m.mongodb.net/?retryWrites=true&w=majority');
    // console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('Admin already exists');
      return;
    }

    // Create new admin with hashed password
    const admin = new Admin(adminData);
    admin.password = await bcrypt.hash(adminData.password, 10);
    await admin.save();

    console.log('Admin created successfully');
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);
    console.log('Please save these credentials for future use');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    // Close MongoDB connection
    mongoose.connection.close();
  }
};

// Run the initialization
initializeAdmin();
