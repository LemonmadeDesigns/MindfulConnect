// backend/src/models/MoodEntry.js
import mongoose from 'mongoose';

const moodEntrySchema = new mongoose.Schema({
    user: {
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
    emotion: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        default: '',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const MoodEntry = mongoose.model('MoodEntry', moodEntrySchema);

export default MoodEntry;