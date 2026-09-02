import Claim from '../models/Claim.js';
import LostItem from '../models/LostItem.js';
import FoundItem from '../models/FoundItem.js';
import Match from '../models/Match.js';
import Notification from '../models/Notification.js';

// Normalize and compare answer strings
const verifyAnswer = (correct, submitted) => {
  const c = correct.toLowerCase().replace(/[^\w\s]/g, '').trim();
  const u = submitted.toLowerCase().replace(/[^\w\s]/g, '').trim();
  
  if (c === u) return true;

  const cWords = c.split(/\s+/).filter(w => w.length > 2);
  const uWords = u.split(/\s+/).filter(w => w.length > 2);

  if (cWords.length === 0) {
    return c === u;
  }

  let matches = 0;
  for (const word of cWords) {
    if (uWords.includes(word)) {
      matches++;
    }
  }

  // If at least 50% of the key words match, consider it verified
  return (matches / cWords.length) >= 0.5;
};

// @desc    Initiate a claim request
// @route   POST /api/claims
// @access  Private
export const createClaim = async (req, res) => {
  try {
    const { lostItemId, foundItemId } = req.body;
    const claimantId = req.user._id;

    // Check if claim already exists
    const existingClaim = await Claim.findOne({
      lostItemId,
      foundItemId,
      status: { $ne: 'Rejected' }
    });

    if (existingClaim) {
      return res.status(400).json({ message: 'A claim for this item is already in progress' });
    }

    const lostItem = await LostItem.findById(lostItemId);
    const foundItem = await FoundItem.findById(foundItemId);

    if (!lostItem || !foundItem) {
      return res.status(404).json({ message: 'Lost or Found item not found' });
    }

    // Determine owner and verification question
    let ownerId;
    let verificationQuestion = '';

    if (lostItem.userId.toString() === claimantId.toString()) {
      // Claimant lost the item, claiming it from the finder
      ownerId = foundItem.userId;
      verificationQuestion = foundItem.verificationQuestion;
    } else if (foundItem.userId.toString() === claimantId.toString()) {
      // Claimant found the item, claiming it is matched to the owner
      ownerId = lostItem.userId;
      verificationQuestion = lostItem.verificationQuestion;
    } else {
      // Someone else is initiating the claim
      ownerId = foundItem.userId;
      verificationQuestion = foundItem.verificationQuestion;
    }

    const claim = await Claim.create({
      lostItemId,
      foundItemId,
      claimantId,
      ownerId,
      verificationQuestion,
      status: 'Verification Required',
      attempts: 0
    });

    // Notify the owner of the claim request
    await Notification.create({
      userId: ownerId,
      title: 'New Claim Request 📁',
      message: `${req.user.name} has requested a claim for an item. Verification is required.`,
      type: 'claim',
      claimId: claim._id
    });

    res.status(201).json(claim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user claims (both claims made by user and claims received by user)
// @route   GET /api/claims
// @access  Private
export const getUserClaims = async (req, res) => {
  try {
    const userId = req.user._id;

    const claims = await Claim.find({
      $or: [
        { claimantId: userId },
        { ownerId: userId }
      ]
    })
    .populate('lostItemId')
    .populate('foundItemId')
    .populate('claimantId', 'name email phone profileImage college studentId')
    .populate('ownerId', 'name email phone profileImage college studentId')
    .sort('-createdAt');

    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get claim details
// @route   GET /api/claims/:id
// @access  Private
export const getClaimById = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate('lostItemId')
      .populate('foundItemId')
      .populate('claimantId', 'name email phone profileImage college studentId')
      .populate('ownerId', 'name email phone profileImage college studentId');

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    // Verify user participates in the claim
    if (
      claim.claimantId._id.toString() !== req.user._id.toString() &&
      claim.ownerId._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(claim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify answer for claim ownership
// @route   POST /api/claims/:id/verify
// @access  Private
export const verifyClaimAnswer = async (req, res) => {
  try {
    const { answer } = req.body;
    const claim = await Claim.findById(req.params.id)
      .populate('lostItemId')
      .populate('foundItemId');

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    if (claim.status !== 'Verification Required' && claim.status !== 'Pending') {
      return res.status(400).json({ message: 'Claim verification is not pending' });
    }

    if (claim.attempts >= 3) {
      claim.status = 'Rejected';
      await claim.save();
      return res.status(400).json({ message: 'Maximum attempts exceeded. Claim rejected.' });
    }

    // Find correct answer
    // Note: after populate, claimantId is a User object — use ._id
    let correctAnswer = '';
    const claimantIdStr = (claim.claimantId?._id || claim.claimantId).toString();
    const lostItemOwnerStr = claim.lostItemId.userId.toString();

    if (claimantIdStr === lostItemOwnerStr) {
      // The person who lost the item is the claimant. They answer the founder's question.
      correctAnswer = claim.foundItemId.verificationAnswer;
    } else {
      // The finder is the claimant. They answer the lost item owner's question.
      correctAnswer = claim.lostItemId.verificationAnswer;
    }

    const isMatch = verifyAnswer(correctAnswer, answer);

    if (isMatch) {
      claim.status = 'Verified';
      await claim.save();

      // Notify claimant
      await Notification.create({
        userId: claim.claimantId,
        title: 'Ownership Verified! 🎉',
        message: `Your answer to "${claim.verificationQuestion}" was verified successfully.`,
        type: 'verification',
        claimId: claim._id
      });

      // Notify owner
      await Notification.create({
        userId: claim.ownerId,
        title: 'Claim Verification Passed! 🔐',
        message: `The claim for "${claim.lostItemId.title}" passed verification. Handover is pending.`,
        type: 'claim',
        claimId: claim._id
      });

      res.json({ success: true, message: 'Ownership verified successfully!', claim });
    } else {
      claim.attempts += 1;
      if (claim.attempts >= 3) {
        claim.status = 'Rejected';
      }
      await claim.save();

      // Notify claimant of failure
      await Notification.create({
        userId: claim.claimantId,
        title: 'Verification Failed 🔐',
        message: `An incorrect answer was submitted for claim verification. Attempts: ${claim.attempts}/3`,
        type: 'verification',
        claimId: claim._id
      });

      res.status(400).json({
        success: false,
        message: `Incorrect answer. Attempts: ${claim.attempts}/3`,
        attempts: claim.attempts,
        claim
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update claim status (e.g., mark handover Completed)
// @route   PUT /api/claims/:id/status
// @access  Private
export const updateClaimStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    // Only owner of item or admin can approve/complete handover
    if (claim.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    claim.status = status;
    await claim.save();

    if (status === 'Completed') {
      // Mark items as claimed / inactive
      await LostItem.findByIdAndUpdate(claim.lostItemId, { status: 'claimed' });
      await FoundItem.findByIdAndUpdate(claim.foundItemId, { status: 'claimed' });

      // Dismiss related matches
      await Match.updateMany(
        {
          $or: [
            { lostItemId: claim.lostItemId },
            { foundItemId: claim.foundItemId }
          ]
        },
        { status: 'claimed' }
      );

      // Notify claimant
      await Notification.create({
        userId: claim.claimantId,
        title: 'Claim Completed! 📦',
        message: `The item handover has been completed. Thank you for using LostLink!`,
        type: 'system',
        claimId: claim._id
      });
    }

    res.json(claim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get messages for a verified claim
// @route   GET /api/claims/:id/messages
// @access  Private
export const getClaimMessages = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    const claimantStr = (claim.claimantId?._id || claim.claimantId).toString();
    const ownerStr = (claim.ownerId?._id || claim.ownerId).toString();
    if (
      claimantStr !== req.user._id.toString() &&
      ownerStr !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(claim.messages || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a chat message for a verified claim
// @route   POST /api/claims/:id/messages
// @access  Private
export const sendClaimMessage = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    const claimantStr2 = (claim.claimantId?._id || claim.claimantId).toString();
    const ownerStr2 = (claim.ownerId?._id || claim.ownerId).toString();
    if (
      claimantStr2 !== req.user._id.toString() &&
      ownerStr2 !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const newMessage = {
      senderId: req.user._id,
      senderName: req.user.name,
      text: text.trim(),
      createdAt: new Date()
    };

    claim.messages.push(newMessage);
    await claim.save();

    // Determine recipient
    const recipientId = (claim.claimantId?._id || claim.claimantId).toString() === req.user._id.toString()
      ? claim.ownerId
      : claim.claimantId;

    await Notification.create({
      userId: recipientId,
      title: `New Message from ${req.user.name} 💬`,
      message: text.length > 50 ? `${text.substring(0, 50)}...` : text,
      type: 'chat',
      claimId: claim._id
    });

    res.status(201).json(claim.messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
