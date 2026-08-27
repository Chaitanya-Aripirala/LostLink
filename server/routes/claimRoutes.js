import express from 'express';
import { createClaim, getUserClaims, getClaimById, verifyClaimAnswer, updateClaimStatus } from '../controllers/claimController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createClaim);
router.get('/', protect, getUserClaims);
router.get('/:id', protect, getClaimById);
router.post('/:id/verify', protect, verifyClaimAnswer);
router.put('/:id/status', protect, updateClaimStatus);

export default router;
