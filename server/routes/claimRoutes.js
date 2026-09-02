import express from 'express';
import { createClaim, getUserClaims, getClaimById, verifyClaimAnswer, updateClaimStatus, getClaimMessages, sendClaimMessage } from '../controllers/claimController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createClaim);
router.get('/', protect, getUserClaims);
router.get('/:id', protect, getClaimById);
router.post('/:id/verify', protect, verifyClaimAnswer);
router.put('/:id/status', protect, updateClaimStatus);
router.get('/:id/messages', protect, getClaimMessages);
router.post('/:id/messages', protect, sendClaimMessage);

export default router;
