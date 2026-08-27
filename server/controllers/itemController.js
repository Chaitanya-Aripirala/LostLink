import LostItem from '../models/LostItem.js';
import FoundItem from '../models/FoundItem.js';
import Match from '../models/Match.js';
import Notification from '../models/Notification.js';
import { uploadToCloudinary } from '../middleware/upload.js';
import { runMatchEngine } from '../services/matchEngine.js';

// Helper to escape regex special characters
const escapeRegex = (string) => {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

// Helper for filtering items
const getFilterQuery = (query) => {
  const { search, category, location, color, brand } = query;
  let filter = { status: 'active' };

  if (search) {
    const escaped = escapeRegex(search);
    filter.$or = [
      { title: { $regex: escaped, $options: 'i' } },
      { description: { $regex: escaped, $options: 'i' } }
    ];
  }

  if (category) {
    filter.category = category;
  }

  if (location) {
    filter.location = { $regex: escapeRegex(location), $options: 'i' };
  }

  if (color) {
    filter.color = { $regex: escapeRegex(color), $options: 'i' };
  }

  if (brand) {
    filter.brand = { $regex: escapeRegex(brand), $options: 'i' };
  }

  return filter;
};

// ==========================================
// LOST ITEMS CONTROLLERS
// ==========================================

export const createLostItem = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      color,
      brand,
      location,
      dateLost,
      timeLost,
      uniqueDetails,
      verificationQuestion,
      verificationAnswer
    } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'lostlink/lost');
    }

    const lostItem = await LostItem.create({
      userId: req.user._id,
      title,
      category,
      description,
      image: imageUrl,
      color,
      brand,
      location,
      dateLost: new Date(dateLost),
      timeLost,
      uniqueDetails,
      verificationQuestion,
      verificationAnswer,
      status: 'active'
    });

    // Run matching engine asynchronously
    setTimeout(async () => {
      await runMatchEngine(LostItem, FoundItem, Match, Notification);
    }, 1000);

    res.status(201).json(lostItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getLostItems = async (req, res) => {
  try {
    const filter = getFilterQuery(req.query);
    
    // Sort logic
    const sortField = req.query.sort === 'oldest' ? 'createdAt' : '-createdAt';

    const items = await LostItem.find(filter)
      .populate('userId', 'name email phone profileImage')
      .sort(sortField);

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLostItemById = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id)
      .populate('userId', 'name email phone profileImage college studentId');
    if (!item) {
      return res.status(404).json({ message: 'Lost item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLostItem = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check ownership
    if (item.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update fields
    const fieldsToUpdate = [
      'title', 'category', 'description', 'color', 'brand',
      'location', 'dateLost', 'timeLost', 'uniqueDetails',
      'verificationQuestion', 'verificationAnswer', 'status'
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'dateLost') {
          item[field] = new Date(req.body[field]);
        } else {
          item[field] = req.body[field];
        }
      }
    });

    if (req.file) {
      item.image = await uploadToCloudinary(req.file.buffer, 'lostlink/lost');
    }

    const updatedItem = await item.save();
    
    // Trigger Match Engine
    setTimeout(async () => {
      await runMatchEngine(LostItem, FoundItem, Match, Notification);
    }, 1000);

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteLostItem = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Instead of deleting from DB, we can delete or remove it. Let's delete it.
    await LostItem.deleteOne({ _id: req.params.id });
    // Also delete associated matches and claims
    await Match.deleteMany({ lostItemId: req.params.id });

    res.json({ message: 'Lost item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// FOUND ITEMS CONTROLLERS
// ==========================================

export const createFoundItem = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      color,
      brand,
      location,
      dateFound,
      timeFound,
      uniqueDetails,
      verificationQuestion,
      verificationAnswer
    } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'lostlink/found');
    }

    const foundItem = await FoundItem.create({
      userId: req.user._id,
      title,
      category,
      description,
      image: imageUrl,
      color,
      brand,
      location,
      dateFound: new Date(dateFound),
      timeFound,
      uniqueDetails,
      verificationQuestion,
      verificationAnswer,
      status: 'active'
    });

    // Run matching engine asynchronously
    setTimeout(async () => {
      await runMatchEngine(LostItem, FoundItem, Match, Notification);
    }, 1000);

    res.status(201).json(foundItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getFoundItems = async (req, res) => {
  try {
    const filter = getFilterQuery(req.query);
    const sortField = req.query.sort === 'oldest' ? 'createdAt' : '-createdAt';

    const items = await FoundItem.find(filter)
      .populate('userId', 'name email phone profileImage')
      .sort(sortField);

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFoundItemById = async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.id)
      .populate('userId', 'name email phone profileImage college studentId');
    if (!item) {
      return res.status(404).json({ message: 'Found item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFoundItem = async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const fieldsToUpdate = [
      'title', 'category', 'description', 'color', 'brand',
      'location', 'dateFound', 'timeFound', 'uniqueDetails',
      'verificationQuestion', 'verificationAnswer', 'status'
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'dateFound') {
          item[field] = new Date(req.body[field]);
        } else {
          item[field] = req.body[field];
        }
      }
    });

    if (req.file) {
      item.image = await uploadToCloudinary(req.file.buffer, 'lostlink/found');
    }

    const updatedItem = await item.save();

    setTimeout(async () => {
      await runMatchEngine(LostItem, FoundItem, Match, Notification);
    }, 1000);

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFoundItem = async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await FoundItem.deleteOne({ _id: req.params.id });
    await Match.deleteMany({ foundItemId: req.params.id });

    res.json({ message: 'Found item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
