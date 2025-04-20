import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Admin authentication middleware
export const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.adminId);

    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid authentication token' });
  }
};

// Admin login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (admin.status === 'inactive') {
      return res.status(403).json({ message: 'Account is inactive' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
        status: admin.status
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get admin profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = req.admin;
    res.json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
        status: admin.status,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    console.error('Error getting admin profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update admin profile
export const updateAdminProfile = async (req, res) => {
  try {
    const admin = req.admin;
    const updates = req.body;

    const allowedUpdates = ['firstName', 'lastName', 'email', 'password'];
    const updatesObject = {};

    allowedUpdates.forEach(update => {
      if (updates[update] !== undefined) {
        updatesObject[update] = updates[update];
      }
    });

    if (updatesObject.password) {
      updatesObject.password = await bcrypt.hash(updatesObject.password, 10);
    }

    Object.assign(admin, updatesObject);
    await admin.save();

    res.json({
      success: true,
      message: 'Admin profile updated successfully',
      admin: {
        id: admin._id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
        status: admin.status
      }
    });
  } catch (error) {
    console.error('Error updating admin profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default {
  adminAuth,
  adminLogin,
  getAdminProfile,
  updateAdminProfile
};
