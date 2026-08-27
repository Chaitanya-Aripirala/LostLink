import express from 'express';
import {
  createLostItem, getLostItems, getLostItemById, updateLostItem, deleteLostItem,
  createFoundItem, getFoundItems, getFoundItemById, updateFoundItem, deleteFoundItem
} from '../controllers/itemController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Lost Items routes
router.post('/lost', protect, upload.single('image'), createLostItem);
router.get('/lost', getLostItems);
router.get('/lost/:id', getLostItemById);
router.put('/lost/:id', protect, upload.single('image'), updateLostItem);
router.delete('/lost/:id', protect, deleteLostItem);

// Found Items routes
router.post('/found', protect, upload.single('image'), createFoundItem);
router.get('/found', getFoundItems);
router.get('/found/:id', getFoundItemById);
router.put('/found/:id', protect, upload.single('image'), updateFoundItem);
router.delete('/found/:id', protect, deleteFoundItem);

export default router;
