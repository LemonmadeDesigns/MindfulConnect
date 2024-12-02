// backend/src/models/UserGroup.js
import mongoose from 'mongoose';

const userGroupSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SupportGroup',
    required: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure a user can only join a group once
userGroupSchema.index({ user: 1, group: 1 }, { unique: true });

const UserGroup = mongoose.model('UserGroup', userGroupSchema);

export default UserGroup;