import User from '../models/User.js';
import LostItem from '../models/LostItem.js';
import FoundItem from '../models/FoundItem.js';
import Match from '../models/Match.js';
import Claim from '../models/Claim.js';
import Notification from '../models/Notification.js';
import { uploadToCloudinary } from '../middleware/upload.js';

// @desc    Get user profile with detailed stats
// @route   GET /api/users/profile
// @access  Private
export const getUserProfileStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Profile details
    const user = await User.findById(userId).select('-password');

    // Stats calculations
    const itemsLost = await LostItem.countDocuments({ userId });
    const itemsFound = await FoundItem.countDocuments({ userId });

    // Items successfully returned
    const lostReturned = await LostItem.countDocuments({ userId, status: 'claimed' });
    const foundReturned = await FoundItem.countDocuments({ userId, status: 'claimed' });
    const itemsReturned = lostReturned + foundReturned;

    // Successful matches (Completed claims where user is claimant or owner)
    const successfulClaims = await Claim.countDocuments({
      $or: [{ claimantId: userId }, { ownerId: userId }],
      status: 'Completed'
    });

    res.json({
      user,
      stats: {
        itemsLost,
        itemsFound,
        itemsReturned,
        successfulMatches: successfulClaims
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile details
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, phone, studentId, college } = req.body;

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (studentId) user.studentId = studentId;
    if (college) user.college = college;

    if (req.file) {
      user.profileImage = await uploadToCloudinary(req.file.buffer, 'lostlink/profiles');
    }

    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      studentId: updatedUser.studentId,
      college: updatedUser.college,
      phone: updatedUser.phone,
      profileImage: updatedUser.profileImage,
      role: updatedUser.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard statistics and summaries
// @route   GET /api/users/dashboard
// @access  Private
export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Core counters
    const lostReports = await LostItem.countDocuments({ userId });
    const foundReports = await FoundItem.countDocuments({ userId });

    // Potential matches count
    const lostItemIds = await LostItem.find({ userId }).select('_id');
    const foundItemIds = await FoundItem.find({ userId }).select('_id');
    
    const potentialMatches = await Match.countDocuments({
      $or: [
        { lostItemId: { $in: lostItemIds } },
        { foundItemId: { $in: foundItemIds } }
      ],
      status: 'active'
    });

    const lostReturned = await LostItem.countDocuments({ userId, status: 'claimed' });
    const foundReturned = await FoundItem.countDocuments({ userId, status: 'claimed' });
    const recovered = lostReturned + foundReturned;

    // 2. My Active Reports
    const activeLost = await LostItem.find({ userId, status: 'active' }).sort('-createdAt').limit(5);
    const activeFound = await FoundItem.find({ userId, status: 'active' }).sort('-createdAt').limit(5);

    // 3. Recent Notifications
    const recentNotifications = await Notification.find({ userId })
      .sort('-createdAt')
      .limit(5);

    // 4. Claims requiring action (where user is owner and status is Verification Required or Pending)
    const pendingClaims = await Claim.find({
      ownerId: userId,
      status: { $in: ['Verification Required', 'Pending'] }
    })
    .populate('lostItemId')
    .populate('foundItemId')
    .populate('claimantId', 'name email phone profileImage');

    // 5. Recent matches list
    const matchesList = await Match.find({
      $or: [
        { lostItemId: { $in: lostItemIds } },
        { foundItemId: { $in: foundItemIds } }
      ],
      status: 'active'
    })
    .populate('lostItemId')
    .populate('foundItemId')
    .sort('-score')
    .limit(3);

    res.json({
      stats: {
        lostReports,
        foundReports,
        potentialMatches,
        recovered
      },
      activeReports: {
        lost: activeLost,
        found: activeFound
      },
      recentNotifications,
      pendingClaims,
      matchesList
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get complete administrative statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getAdminDashboardData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalLost = await LostItem.countDocuments();
    const totalFound = await FoundItem.countDocuments();
    const totalClaims = await Claim.countDocuments();
    const completedClaims = await Claim.countDocuments({ status: 'Completed' });

    // Recent items reported
    const recentLost = await LostItem.find().populate('userId', 'name email').sort('-createdAt').limit(5);
    const recentFound = await FoundItem.find().populate('userId', 'name email').sort('-createdAt').limit(5);
    const recentClaims = await Claim.find()
      .populate('lostItemId')
      .populate('foundItemId')
      .populate('claimantId', 'name email')
      .populate('ownerId', 'name email')
      .sort('-createdAt')
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalLost,
        totalFound,
        totalClaims,
        completedClaims
      },
      recentLost,
      recentFound,
      recentClaims
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
