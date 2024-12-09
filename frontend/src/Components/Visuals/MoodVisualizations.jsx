import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Line,
  BarChart,
  Bar,
} from "recharts";

import { getMoodEntries } from "../../services/moodService.js";

function MoodVisualizations({ refreshTrigger }) {
  // Prepare data for charts
  const [processedData, setProcessedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMoodData();
  },  [refreshTrigger]); // Add refreshTrigger to dependency array

  const fetchMoodData = async () => {
    try {
      console.log("Fetching fresh mood data..."); // Debug log
      const entries = await getMoodEntries();
      console.log("Received entries:", entries); // Debug log
      
      if (!entries || entries.length === 0) {
        setError('No mood data available');
        setProcessedData([]);
        return;
      }

      const sortedEntries = entries
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .map(entry => ({
          date: new Date(entry.timestamp).toLocaleDateString(),
          moodLevel: entry.moodLevel,
          emotions: entry.emotions || [],
          primaryEmotion: entry.emotions?.[0] || 'None'
        }));

      console.log("Processed entries:", sortedEntries); // Debug log
      setProcessedData(sortedEntries);
      setError(null);
    } catch (err) {
      console.error('Error fetching mood data:', err);
      setError('Failed to load mood data');
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-sm">Mood Level: {payload[0].value}</p>
          {payload[0].payload.emotions && (
            <p className="text-sm">
              Emotions: {payload[0].payload.emotions.join(', ')}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Mood Trends Chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Mood Level Trends</h3>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 10]} 
                tick={{ fontSize: 12 }}
                label={{ 
                  value: 'Mood Level', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontSize: 12 }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="moodLevel" 
                fill="#8884d8" 
                stroke="#8884d8"
                fillOpacity={0.3}
              />
              <Line 
                type="monotone" 
                dataKey="moodLevel" 
                stroke="#6366f1" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Mood Distribution */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Daily Mood Levels</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 10]}
                tick={{ fontSize: 12 }}
                label={{ 
                  value: 'Mood Level', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontSize: 12 }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="moodLevel" 
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default MoodVisualizations;