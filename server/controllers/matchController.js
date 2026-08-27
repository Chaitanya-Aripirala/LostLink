import Match from '../models/Match.js';
import LostItem from '../models/LostItem.js';
import FoundItem from '../models/FoundItem.js';
import Notification from '../models/Notification.js';
import { runMatchEngine } from '../services/matchEngine.js';

// @desc    Get user matches (both for lost items they posted and found items they posted)
// @route   GET /api/matches
// @access  Private
export const getUserMatches = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all lost items owned by this user
    const lostItemIds = await LostItem.find({ userId }).select('_id');
    // Find all found items owned by this user
    const foundItemIds = await FoundItem.find({ userId }).select('_id');

    // Query matches that link to either of these items
    const matches = await Match.find({
      $or: [
        { lostItemId: { $in: lostItemIds } },
        { foundItemId: { $in: foundItemIds } }
      ],
      status: 'active'
    })
    .populate({
      path: 'lostItemId',
      populate: { path: 'userId', select: 'name email phone profileImage' }
    })
    .populate({
      path: 'foundItemId',
      populate: { path: 'userId', select: 'name email phone profileImage' }
    })
    .sort('-score');

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get match details
// @route   GET /api/matches/:id
// @access  Private
export const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate({
        path: 'lostItemId',
        populate: { path: 'userId', select: 'name email phone profileImage college studentId' }
      })
      .populate({
        path: 'foundItemId',
        populate: { path: 'userId', select: 'name email phone profileImage college studentId' }
      });

    if (!match) {
      return res.status(404).json({ message: 'Match details not found' });
    }

    // Verify req.user is part of this match
    const lostOwnerId = match.lostItemId.userId._id.toString();
    const foundOwnerId = match.foundItemId.userId._id.toString();

    if (req.user._id.toString() !== lostOwnerId && req.user._id.toString() !== foundOwnerId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this match' });
    }

    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Trigger manual matching engine run
// @route   POST /api/matches/run
// @access  Private
export const triggerMatchEngine = async (req, res) => {
  try {
    const matchCount = await runMatchEngine(LostItem, FoundItem, Match, Notification);
    res.json({ message: `Match Engine completed successfully. Found/Updated ${matchCount} matches.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
