// backend/src/routes/mood.js
import express from 'express';
import auth from '../middleware/auth.js';
import { 
    getAnalytics,
    getMoodEntries,
    createMoodEntry
} from '../controllers/moodController.js';

const router = express.Router();

// Get mood analytics
router.get('/analytics', auth, getAnalytics);

// Get mood entries
router.get('/', auth, getMoodEntries);

// Create new mood entry
router.post('/', auth, createMoodEntry);

export default router;