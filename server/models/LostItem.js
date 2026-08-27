import mongoose from 'mongoose';

const lostItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Documents', 'Wallet', 'Keys', 'Bags', 'Clothing', 'Books', 'Accessories', 'Other']
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    trim: true,
    default: 'Generic'
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  dateLost: {
    type: Date,
    required: true
  },
  timeLost: {
    type: String,
    trim: true
  },
  uniqueDetails: {
    type: String,
    trim: true
  },
  verificationQuestion: {
    type: String,
    required: true,
    trim: true
  },
  verificationAnswer: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'claimed', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

const LostItem = mongoose.model('LostItem', lostItemSchema);
export default LostItem;
