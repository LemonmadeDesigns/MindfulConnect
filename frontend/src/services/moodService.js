// src/services/moodService.js
const API_URL = "http://localhost:5001/api";

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

export const createMoodEntry = async (moodData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  console.log('Sending mood data:', moodData); // Debug log

  const response = await fetch(`${API_URL}/mood`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },

    // body: JSON.stringify(moodData)
    body: JSON.stringify({
      moodLevel: moodData.moodScore,
      emotion: moodData.emotions[0] || '', // Take first emotion as primary
      notes: moodData.notes,
      emotions: moodData.emotions,
      activities: moodData.activities
    })
  });

  return handleResponse(response);
};

export const getMoodEntries = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    console.log("Fetching mood entries..."); // Debug log

    const response = await fetch(`${API_URL}/mood`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Mood entries received:", data); // Debug log
    return data;
  } catch (error) {
    console.error("Error fetching mood entries:", error);
    return []; // Return empty array instead of throwing
  }
};

// Added getMoodHistory as an alias for getMoodEntries
export const getMoodHistory = getMoodEntries;

export const getMoodAnalytics = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_URL}/mood/analytics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};
