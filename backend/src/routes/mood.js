// backend/src/routes/mood.js
import express from "express";

import auth from "../middleware/auth.js";
import MoodEntry from "../models/MoodEntry.js";

import {
  getAnalytics,
  getMoodEntries,
  createMoodEntry,
} from "../controllers/moodController.js";

const router = express.Router();

// Get mood analytics
router.get("/analytics", auth, getAnalytics);

// Get mood entries
// router.get('/', auth, getMoodEntries);

router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const moodEntries = await MoodEntry.find({ userId })
      .sort('-timestamp')
      .limit(30); // Get last 30 days of entries

    res.json(moodEntries);
  } catch (error) {
    console.error("Error fetching mood entries:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new mood entry
router.post("/", auth, async (req, res) => {
  try {
    const { moodLevel, emotions, activities, notes } = req.body;
    const userId = req.user.id;

    const moodEntry = new MoodEntry({
      userId,
      moodLevel,
      emotions,
      activities,
      notes,
      timestamp: new Date()
    });

    await moodEntry.save();
    res.status(201).json(moodEntry);
  } catch (error) {
    console.error("Error creating mood entry:", error);
    res.status(500).json({ message: "Failed to create mood entry" });
  }
});

// Get mood analytics
router.get("/analytics", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const entries = await MoodEntry.find({ userId })
      .sort('-timestamp')
      .limit(30);

    res.json(entries);
  } catch (error) {
    console.error("Error fetching mood analytics:", error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
});


// Setup test mood data for the authenticated user
router.post("/setup-test-data", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const testMoodEntries = [
      {
        userId,
        moodLevel: 7,
        emotions: ['Happy', 'Energetic'],
        timestamp: new Date()
      },
      {
        userId,
        moodLevel: 6,
        emotions: ['Peaceful'],
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        userId,
        moodLevel: 8,
        emotions: ['Excited'],
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000)
      }
    ];

    await MoodEntry.insertMany(testMoodEntries);

    res.json({ message: "Test mood data created successfully" });
  } catch (error) {
    console.error("Setup test mood data error:", error);
    res.status(500).json({ message: "Error creating test mood data" });
  }
});

export default router;
