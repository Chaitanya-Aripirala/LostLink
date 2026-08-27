import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
  lostItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LostItem',
    required: true
  },
  foundItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoundItem',
    required: true
  },
  claimantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  verificationQuestion: {
    type: String,
    required: true
  },
  verificationAnswerHash: {
    type: String // We will store the answer submitted by claimant, or standard string compare
  },
  status: {
    type: String,
    enum: ['Pending', 'Verification Required', 'Verified', 'Rejected', 'Completed'],
    default: 'Pending'
  },
  attempts: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Claim = mongoose.model('Claim', claimSchema);
export default Claim;
