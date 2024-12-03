// backend/src/controllers/moodController.js
import MoodEntry from "../models/MoodEntry.js";

export const createMoodEntry = async (req, res) => {
  try {
    console.log("Creating mood entry. User ID:", req.user.id);
    console.log("Received mood entry data:", req.body); // Debug log

    const { moodLevel, emotion, notes, emotions, activities } = req.body;

    // Validate input
    if (!moodLevel || !emotion || !notes) {
      return res.status(400).json({
        message: "Mood Level, Notes, and Emotions are required",
      });
    }

    // Create new entry
    const newEntry = new MoodEntry({
      user: req.user.id,
      moodLevel,
      emotion,
      notes,
      emotions,
      activities,
      timestamp: new Date(),
    });

    // Save to database
    const savedEntry = await newEntry.save();
    console.log("Saved mood entry: ", savedEntry);

    res.status(201).json(savedEntry);
  } catch (error) {
    console.error("Error in createMoodEntry: ", error);
    res.status(500).json({
      message: "Error creating mood entry",
      error: error.message,
    });
  }
};

export const getMoodEntries = async (req, res) => {
  try {
    console.log("Getting mood entries for user: ", req.user.id);

    const entries = await MoodEntry.find({ user: req.user.id }).sort({
      timestamp: -1,
    });

    res.json(entries);
  } catch (error) {
    console.error("Error in getMoodEntries:", error);
    res.status(500).json({
      message: "Error fetching mood entries",
      error: error.message,
    });
  }
};

// export const getAnalytics = async (req, res) => {
//   try {
//     console.log("Getting analytics for user:", req.user.id);

//     const entries = await MoodEntry.find({ user: req.user.id })
//       .sort({ timestamp: -1 })
//       .select("moodLevel emotion timestamp");

//     if (!entries) {
//       return res.status(404).json({ message: "No mood entries found" });
//     }

//     // Process analytics data
//     const analyticData = {
//       entries,
//       summary: {
//         totalEntries: entries.length,
//         averageMood:
//           entries.reduce((acc, entry) => acc + entry.moodLevel, 0) /
//             entries.length || 0,
//         recentMood: entries[0]?.moodLevel || 0,
//         recentEmotion: entries[0]?.emotion || "No entries",
//       },
//     };

//     res.json(analyticData);
//   } catch (error) {
//     console.error("Error in getAnalytics:", error);
//     res.status(500).json({
//       message: "Error fetching mood analytics",
//       error: error.message,
//     });
//   }
// };

// backend/src/controllers/moodController.js
export const getAnalytics = async (req, res) => {
  try {
    const { timeRange = 'week' } = req.query;
    let dateFilter = {};

    // Calculate date range
    const now = new Date();
    switch (timeRange) {
      case 'day':
        dateFilter = {
          timestamp: {
            $gte: new Date(now.setHours(0, 0, 0, 0)),
            $lte: new Date(now.setHours(23, 59, 59, 999))
          }
        };
        break;
      case 'week':
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        dateFilter = {
          timestamp: { $gte: weekAgo }
        };
        break;
      case 'month':
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        dateFilter = {
          timestamp: { $gte: monthAgo }
        };
        break;
    }

    const entries = await MoodEntry.find({
      user: req.user.id,
      ...dateFilter
    })
    .sort({ timestamp: -1 })
    .select('moodLevel emotion timestamp');

    if (!entries) {
      return res.status(404).json({ message: 'No mood entries found' });
    }

    res.json({ entries });
  } catch (error) {
    console.error('Error in getAnalytics:', error);
    res.status(500).json({ message: 'Error fetching mood analytics' });
  }
};
