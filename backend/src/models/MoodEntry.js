import mongoose from "mongoose";

const moodEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  moodLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  emotions: [{
    type: String
  }],
  activities: [{
    type: String
  }],
  notes: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const MoodEntry = mongoose.model('MoodEntry', moodEntrySchema);
export default MoodEntry;