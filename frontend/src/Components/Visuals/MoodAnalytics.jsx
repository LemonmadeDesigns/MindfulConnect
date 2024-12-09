import React, { useState, useEffect } from "react";
import { Card } from "../ui/Card";
import MoodVisualizations from "./MoodVisualizations";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { getMoodEntries } from "../../services/moodService";

import "./Visuals.css";

const COLORS = {
  "Very Happy (8-10)": "#4CAF50",
  "Happy (6-7)": "#81C784",
  "Neutral (5)": "#FFC107",
  "Sad (3-4)": "#FF9800",
  "Very Sad (1-2)": "#F44336",
};

const MoodAnalytics = () => {
  const [moodDistribution, setMoodDistribution] = useState([]);
  const [moodStats, setMoodStats] = useState({
    averageMood: 0,
    commonEmotion: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMoodData();
  }, []);

  const fetchMoodData = async () => {
    try {
      const entries = await getMoodEntries();
      if (entries && entries.length > 0) {
        // Calculate average mood
        const avgMood = (
          entries.reduce((acc, entry) => acc + entry.moodLevel, 0) /
          entries.length
        ).toFixed(1);

        // Find most common emotion
        const emotionCounts = {};
        entries.forEach((entry) => {
          entry.emotions.forEach((emotion) => {
            emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
          });
        });
        const commonEmotion = Object.entries(emotionCounts).sort(
          (a, b) => b[1] - a[1]
        )[0][0];

        // Process mood distribution
        const distribution = {
          "Very Happy (8-10)": 0,
          "Happy (6-7)": 0,
          "Neutral (5)": 0,
          "Sad (3-4)": 0,
          "Very Sad (1-2)": 0,
        };

        entries.forEach((entry) => {
          const level = entry.moodLevel;
          if (level >= 8) distribution["Very Happy (8-10)"]++;
          else if (level >= 6) distribution["Happy (6-7)"]++;
          else if (level === 5) distribution["Neutral (5)"]++;
          else if (level >= 3) distribution["Sad (3-4)"]++;
          else distribution["Very Sad (1-2)"]++;
        });

        const pieData = Object.entries(distribution)
          .map(([name, value]) => ({
            name,
            value,
            color: COLORS[name],
          }))
          .filter((item) => item.value > 0);

        setMoodDistribution(pieData);
        setMoodStats({
          averageMood: avgMood,
          commonEmotion: commonEmotion,
        });
      }
    } catch (err) {
      console.error("Error fetching mood data:", err);
      setError("Failed to load mood distribution");
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="text-sm font-semibold">{data.name}</p>
          <p className="text-sm">Count: {data.value}</p>
          <p className="text-sm">
            {(
              (data.value /
                moodDistribution.reduce((acc, curr) => acc + curr.value, 0)) *
              100
            ).toFixed(1)}
            %
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mood Analytics</h1>
        <p className="text-gray-600 mt-2">
          Track and analyze your mood patterns over time
        </p>
      </div>

      {/* Main Content Area */}
      <Card className="p-6">
        <MoodVisualizations />
      </Card>

      {/* Additional Analytics Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mood Distribution Pie Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Mood Distribution</h2>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p>Loading mood data...</p>
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : moodDistribution.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-gray-500">No mood data available yet</p>
              <p className="text-sm text-gray-400">
                Start tracking your moods to see the distribution
              </p>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="50%" height="100%">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Mood Summary</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Average Mood</p>
                      <p className="text-2xl font-bold text-indigo-600">
                        {moodStats.averageMood}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Most Common Emotion
                      </p>
                      <p className="text-2xl font-bold text-indigo-600">
                        {moodStats.commonEmotion}
                      </p>
                    </div>
                  </div>
                </Card>
                <PieChart>
                  <Pie
                    data={moodDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {moodDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        className="hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Tips & Insights Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Tips & Insights</h2>
          <ul className="space-y-3 text-gray-600">
            <li>• Your mood tends to be higher in the morning</li>
            <li>• Consider tracking what activities boost your mood</li>
            <li>• Regular exercise seems to correlate with better moods</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default MoodAnalytics;
