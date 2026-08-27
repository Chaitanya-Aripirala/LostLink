import express from 'express';
import { getUserMatches, getMatchById, triggerMatchEngine } from '../controllers/matchController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getUserMatches);
router.get('/:id', protect, getMatchById);
router.post('/run', protect, triggerMatchEngine);

export default router;
