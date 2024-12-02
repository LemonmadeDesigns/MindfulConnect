// frontend/src/Components/Dashboard/MoodTracker.jsx
// import { useState } from 'react';
// import { createMoodEntry } from '../../services/moodService';

// const MoodTracker = () => {
//   const [moodData, setMoodData] = useState({
//     moodLevel: 5,
//     emotion: '',
//     notes: ''
//   });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);

//   const emotions = [
//     'Happy', 'Excited', 'Peaceful',
//     'Sad', 'Anxious', 'Angry',
//     'Frustrated', 'Tired', 'Neutral'
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setMoodData(prev => ({
//       ...prev,
//       [name]: name === 'moodLevel' ? Number(value) : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     setLoading(true);

//     try {
//       if (!moodData.emotion) {
//         throw new Error('Please select an emotion');
//       }

//       await createMoodEntry(moodData);
//       setSuccess('Mood entry saved successfully!');
//       setMoodData({
//         moodLevel: 5,
//         emotion: '',
//         notes: ''
//       });
//     } catch (err) {
//       setError(err.message || 'Failed to save mood entry');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
//       <h2 className="text-2xl font-semibold mb-6">Track Your Mood</h2>

//       {error && (
//         <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
//           {error}
//         </div>
//       )}

//       {success && (
//         <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
//           {success}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Mood Level (1-10): {moodData.moodLevel}
//           </label>
//           <input
//             type="range"
//             name="moodLevel"
//             min="1"
//             max="10"
//             value={moodData.moodLevel}
//             onChange={handleChange}
//             className="w-full"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Emotion
//           </label>
//           <div className="grid grid-cols-3 gap-2">
//             {emotions.map(emotion => (
//               <button
//                 key={emotion}
//                 type="button"
//                 onClick={() => setMoodData(prev => ({ ...prev, emotion }))}
//                 className={`p-2 rounded-md text-sm ${
//                   moodData.emotion === emotion
//                     ? 'bg-purple-600 text-white'
//                     : 'bg-gray-100 hover:bg-gray-200'
//                 }`}
//               >
//                 {emotion}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Notes
//           </label>
//           <textarea
//             name="notes"
//             value={moodData.notes}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
//             rows="3"
//             placeholder="How are you feeling today?"
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
//         >
//           {loading ? 'Saving...' : 'Save Mood Entry'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default MoodTracker;
// export default MoodTracker;

// import { useState } from "react";
// import PropTypes from 'prop-types';
// import { Card, CardContent } from "../ui/Card";
// import { saveMoodEntry } from '../../services/moodService';

// const MoodTracker = ({ onSave }) => {
//   const [moodScore, setMoodScore] = useState(5);
//   const [notes, setNotes] = useState("");
//   const [selectedEmotions, setSelectedEmotions] = useState([]);
//   const [selectedActivities, setSelectedActivities] = useState([]);

//   const getMoodEmoji = (score) => {
//     const numericScore = Number(score);
//     switch (numericScore) {
//       case 1:
//         return "😭"; // Deep sadness or distress
//       case 2:
//         return "😢"; // Sad and troubled
//       case 3:
//         return "😞"; // Disappointed or down
//       case 4:
//         return "😕"; // Slightly troubled
//       case 5:
//         return "😐"; // Neutral
//       case 6:
//         return "🙂"; // Slightly positive
//       case 7:
//         return "😊"; // Content and happy
//       case 8:
//         return "😄"; // Very happy
//       case 9:
//         return "😃"; // Joyful and excited
//       case 10:
//         return "🤗"; // Ecstatic and fulfilled
//       default:
//         return "😐";
//     }
//   };

//   const getMoodDescription = (score) => {
//     const numericScore = Number(score);
//     switch (numericScore) {
//       case 1:
//         return "Very Distressed";
//       case 2:
//         return "Struggling";
//       case 3:
//         return "Down";
//       case 4:
//         return "Slightly Low";
//       case 5:
//         return "Neutral";
//       case 6:
//         return "Fairly Good";
//       case 7:
//         return "Good";
//       case 8:
//         return "Very Good";
//       case 9:
//         return "Great";
//       case 10:
//         return "Excellent";
//       default:
//         return "Neutral";
//     }
//   };

//   const emotions = {
//     positive: ["Happy", "Excited", "Peaceful", "Grateful", "Confident", "Energetic"],
//     challenging: ["Anxious", "Sad", "Stressed", "Angry", "Tired", "Overwhelmed"],
//   };

//   const activities = [
//     { icon: "🏃", label: "Exercise" },
//     { icon: "🧘", label: "Meditation" },
//     { icon: "📚", label: "Reading" },
//     { icon: "👥", label: "Social" },
//     { icon: "💼", label: "Work" },
//     { icon: "🎨", label: "Hobbies" },
//     { icon: "😴", label: "Rest" },
//     { icon: "🌳", label: "Nature" },
//     { icon: "👪", label: "Family" },
//   ];

//   const handleEmotionToggle = (emotion) => {
//     setSelectedEmotions((prev) =>
//       prev.includes(emotion)
//         ? prev.filter((e) => e !== emotion)
//         : [...prev, emotion]
//     );
//   };

//   const handleActivityToggle = (activity) => {
//     setSelectedActivities((prev) =>
//       prev.includes(activity)
//         ? prev.filter((a) => a !== activity)
//         : [...prev, activity]
//     );
//   };

//   const handleSaveEntry = async () => {
//     try {
//       const moodEntry = {
//         date: new Date().toISOString(),
//         moodScore: Number(moodScore),
//         notes,
//         emotions: selectedEmotions,
//         activities: selectedActivities,
//         dominantEmotion: selectedEmotions[0] || 'Neutral'
//       };

//       await saveMoodEntry(moodEntry);

//       // Reset form
//       setNotes('');
//       setSelectedEmotions([]);
//       setSelectedActivities([]);
//       setMoodScore(5);

//       // Notify parent component to refresh data
//       onSave();

//     } catch (error) {
//       console.error('Failed to save mood entry:', error);
//       // You might want to show an error message to the user here
//     }
//   };

//   return (
//     <Card>
//       <CardContent>
//         <div className="space-y-6">
//           <div>
//             <h3 className="text-lg font-medium mb-4">Track Your Mood</h3>
//             <div className="text-sm text-gray-600 mb-2">
//               Last entry: 11/21/2024, 6:59:09 PM
//             </div>

//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 How are you feeling? (1-10)
//               </label>
//               <input
//                 type="range"
//                 min="1"
//                 max="10"
//                 value={moodScore}
//                 onChange={(e) => setMoodScore(e.target.value)}
//                 className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//               />
//               <div className="flex justify-between items-center mt-2">
//                 <div className="flex flex-col items-center">
//                   <span className="text-gray-600">
//                     {getMoodDescription(moodScore)}
//                   </span>
//                   <span className="text-sm text-gray-500">
//                     Score: {moodScore}
//                   </span>
//                 </div>
//                 <span className="text-3xl transition-all duration-200">
//                   {getMoodEmoji(moodScore)}
//                 </span>
//               </div>
//             </div>

//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 <p>{"What's on your mind?"}</p>
//               </label>
//               <textarea
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//                 placeholder="Describe how you're feeling..."
//                 className="w-full p-2 border rounded-md"
//                 rows="4"
//               />
//             </div>

//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-4">
//                 Emotions
//               </label>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <div className="text-sm text-gray-600 mb-2">Positive</div>
//                   <div className="flex flex-wrap gap-2">
//                     {emotions.positive.map((emotion) => (
//                       <button
//                         key={emotion}
//                         onClick={() => handleEmotionToggle(emotion)}
//                         style={{ minWidth : '100%' }}
//                         className={`px-4 py-2 rounded-full text-center min-w-[100px] ${
//                           selectedEmotions.includes(emotion)
//                             ? "bg-green-100 text-green-800"
//                             : "bg-gray-100 text-gray-800"
//                         }`}
//                       >
//                         {emotion}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <div className="text-sm text-gray-600 mb-2">Challenging</div>
//                   <div className="flex flex-wrap gap-2">
//                     {emotions.challenging.map((emotion) => (
//                       <button
//                         key={emotion}
//                         onClick={() => handleEmotionToggle(emotion)}
//                         style={{ minWidth : '100%' }}
//                         className={`px-4 py-2 rounded-full text-center min-w-[100px] ${
//                           selectedEmotions.includes(emotion)
//                             ? "bg-red-100 text-red-800"
//                             : "bg-gray-100 text-gray-800"
//                         }`}
//                       >
//                         {emotion}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Activities
//               </label>
//               <div className="grid grid-cols-3 gap-2">
//                 {activities.map((activity) => (
//                   <button
//                     key={activity.label}
//                     onClick={() => handleActivityToggle(activity.label)}
//                     className={`p-3 rounded-lg text-center ${
//                       selectedActivities.includes(activity.label)
//                         ? "bg-indigo-100 text-indigo-800"
//                         : "bg-gray-100 text-gray-800"
//                     }`}
//                   >
//                     <div className="text-2xl mb-1">{activity.icon}</div>
//                     <div className="text-sm">{activity.label}</div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <button
//               onClick={handleSaveEntry}
//               className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
//             >
//               Save Entry
//             </button>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// MoodTracker.propTypes = {
//   onSave: PropTypes.func.isRequired
// };

// export default MoodTracker;

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
