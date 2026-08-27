import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { uploadToCloudinary } from '../middleware/upload.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, studentId, college, phone } = req.body;

  try {
    if (!name || !email || !password || !studentId || !college || !phone) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Upload profile image if provided
    let profileImageUrl = '';
    if (req.file) {
      profileImageUrl = await uploadToCloudinary(req.file.buffer, 'lostlink/profiles');
    }

    const user = await User.create({
      name,
      email,
      password,
      studentId,
      college,
      phone,
      profileImage: profileImageUrl
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        college: user.college,
        phone: user.phone,
        profileImage: user.profileImage,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        college: user.college,
        phone: user.phone,
        profileImage: user.profileImage,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      studentId: user.studentId,
      college: user.college,
      phone: user.phone,
      profileImage: user.profileImage,
      role: user.role
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
