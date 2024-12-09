// src/Components/Dashboard/MoodTracker.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import { Card, CardContent } from "../ui/Card";
import { createMoodEntry } from "../../services/moodService";

const MoodTracker = ({ onSave }) => {
  const [moodData, setMoodData] = useState({
    moodScore: 5,
    notes: "",
    emotions: [],
    activities: [],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const getMoodEmoji = (score) => {
    const numericScore = Number(score);
    switch (numericScore) {
      case 1:
        return "😭";
      case 2:
        return "😢";
      case 3:
        return "😞";
      case 4:
        return "😕";
      case 5:
        return "😐";
      case 6:
        return "🙂";
      case 7:
        return "😊";
      case 8:
        return "😄";
      case 9:
        return "😃";
      case 10:
        return "🤗";
      default:
        return "😐";
    }
  };

  const getMoodDescription = (score) => {
    const numericScore = Number(score);
    switch (numericScore) {
      case 1:
        return "Very Distressed";
      case 2:
        return "Struggling";
      case 3:
        return "Down";
      case 4:
        return "Slightly Low";
      case 5:
        return "Neutral";
      case 6:
        return "Fairly Good";
      case 7:
        return "Good";
      case 8:
        return "Very Good";
      case 9:
        return "Great";
      case 10:
        return "Excellent";
      default:
        return "Neutral";
    }
  };

  const emotions = {
    positive: [
      "Happy",
      "Excited",
      "Peaceful",
      "Grateful",
      "Confident",
      "Energetic",
    ],
    challenging: [
      "Anxious",
      "Sad",
      "Stressed",
      "Angry",
      "Tired",
      "Overwhelmed",
    ],
  };

  const activities = [
    { icon: "🏃", label: "Exercise" },
    { icon: "🧘", label: "Meditation" },
    { icon: "📚", label: "Reading" },
    { icon: "👥", label: "Social" },
    { icon: "💼", label: "Work" },
    { icon: "🎨", label: "Hobbies" },
    { icon: "😴", label: "Rest" },
    { icon: "🌳", label: "Nature" },
    { icon: "👪", label: "Family" },
  ];

  const handleEmotionToggle = (emotion) => {
    setMoodData((prev) => ({
      ...prev,
      emotions: prev.emotions.includes(emotion)
        ? prev.emotions.filter((e) => e !== emotion)
        : [...prev.emotions, emotion],
    }));
  };

  const handleActivityToggle = (activity) => {
    setMoodData((prev) => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter((a) => a !== activity)
        : [...prev.activities, activity],
    }));
  };

  // Part of MoodTracker.jsx - handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (moodData.emotions.length === 0) {
        throw new Error("Please select at least one emotion");
      }

      const moodEntry = {
        moodScore: Number(moodData.moodScore),
        notes: moodData.notes || "",
        emotions: moodData.emotions,
        activities: moodData.activities || [],
      };

      console.log("Submitting mood entry:", moodEntry); // Debug log
      await createMoodEntry(moodEntry);

      setSuccess("Mood entry saved successfully!");

      // Reset form
      setMoodData({
        moodScore: 5,
        notes: "",
        emotions: [],
        activities: [],
      });

      // Notify parent component
      if (onSave) onSave();
    } catch (err) {
      console.error("Error saving mood entry:", err);
      setError(err.message || "Failed to save mood entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Track Your Mood</h3>
            <div className="text-sm text-gray-600 mb-2">
              Last entry: {new Date().toLocaleString()}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How are you feeling? (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={moodData.moodScore}
                  onChange={(e) =>
                    setMoodData((prev) => ({
                      ...prev,
                      moodScore: Number(e.target.value),
                    }))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="flex flex-col">
                    <span className="text-gray-600">
                      {getMoodDescription(moodData.moodScore)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Score: {moodData.moodScore}
                    </span>
                  </div>
                  <span className="text-3xl transition-all duration-200">
                    {getMoodEmoji(moodData.moodScore)}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's on your mind?
                </label>
                <textarea
                  value={moodData.notes}
                  onChange={(e) =>
                    setMoodData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Describe how you're feeling..."
                  className="w-full p-2 border rounded-md"
                  rows="4"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Emotions
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Positive</div>
                    <div className="flex flex-wrap gap-2">
                      {emotions.positive.map((emotion) => (
                        <button
                          key={emotion}
                          type="button"
                          onClick={() => handleEmotionToggle(emotion)}
                          style={{ minWidth: "100%" }}
                          className={`px-4 py-2 rounded-full text-center min-w-[100px] ${
                            moodData.emotions.includes(emotion)
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {emotion}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 mb-2">
                      Challenging
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {emotions.challenging.map((emotion) => (
                        <button
                          key={emotion}
                          type="button"
                          onClick={() => handleEmotionToggle(emotion)}
                          style={{ minWidth: "100%" }}
                          className={`px-4 py-2 rounded-full text-center min-w-[100px] ${
                            moodData.emotions.includes(emotion)
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {emotion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activities
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {activities.map((activity) => (
                    <button
                      key={activity.label}
                      type="button"
                      onClick={() => handleActivityToggle(activity.label)}
                      className={`p-3 rounded-lg text-center ${
                        moodData.activities.includes(activity.label)
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <div className="text-2xl mb-1">{activity.icon}</div>
                      <div className="text-sm">{activity.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Entry"}
              </button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

MoodTracker.propTypes = {
  onSave: PropTypes.func,
};

export default MoodTracker;
