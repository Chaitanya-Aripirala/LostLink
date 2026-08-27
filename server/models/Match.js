import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
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
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  breakdown: {
    category: { type: Number, default: 0 },
    title: { type: Number, default: 0 },
    description: { type: Number, default: 0 },
    brand: { type: Number, default: 0 },
    color: { type: Number, default: 0 },
    location: { type: Number, default: 0 },
    date: { type: Number, default: 0 },
    uniqueDetails: { type: Number, default: 0 }
  },
  reason: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['active', 'claimed', 'dismissed'],
    default: 'active'
  }
}, {
  timestamps: true
});

const Match = mongoose.model('Match', matchSchema);
export default Match;
