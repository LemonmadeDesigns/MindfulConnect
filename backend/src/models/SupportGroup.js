// backend/src/models/SupportGroup.js
import mongoose from 'mongoose';

const supportGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  id: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  indicators: [{
    type: String
  }],
  meetingTimes: [{
    type: String
  }],
  resources: [{
    type: String
  }],
  capacity: {
    type: Number,
    required: true,
    default: 30
  },
  currentMembers: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const SupportGroup = mongoose.model('SupportGroup', supportGroupSchema);

export default SupportGroup;