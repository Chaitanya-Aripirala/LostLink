import express from 'express';
import { getUserProfileStats, updateUserProfile, getDashboardData, getAdminDashboardData } from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/profile', protect, getUserProfileStats);
router.put('/profile', protect, upload.single('profileImage'), updateUserProfile);
router.get('/dashboard', protect, getDashboardData);
router.get('/admin/dashboard', protect, admin, getAdminDashboardData);

export default router;
