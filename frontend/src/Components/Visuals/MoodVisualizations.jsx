import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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

  // Add this function to process data for distribution charts
  const getMoodDistribution = (data) => {
    const distribution = {
      'Very Happy (8-10)': 0,
      'Happy (6-7)': 0,
      'Neutral (5)': 0,
      'Sad (3-4)': 0,
      'Very Sad (1-2)': 0
    };

    data.forEach(entry => {
      const level = entry.moodLevel;
      if (level >= 8) distribution['Very Happy (8-10)']++;
      else if (level >= 6) distribution['Happy (6-7)']++;
      else if (level === 5) distribution['Neutral (5)']++;
      else if (level >= 3) distribution['Sad (3-4)']++;
      else distribution['Very Sad (1-2)']++;
    });

    return Object.entries(distribution).map(([name, value]) => ({
      name,
      value,
      color: name.includes('Very Happy') ? '#4CAF50' :
             name.includes('Happy') ? '#81C784' :
             name.includes('Neutral') ? '#FFC107' :
             name.includes('Sad') && !name.includes('Very') ? '#FF9800' :
             '#F44336'
    }));
  };

  const DistributionTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = processedData.length;
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="text-sm font-semibold">{payload[0].name}</p>
          <p className="text-sm">Count: {payload[0].value}</p>
          <p className="text-sm">Percentage: {percentage}%</p>
        </div>
      );
    }
    return null;
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

      {/* New Mood Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Mood Distribution (Pie)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={getMoodDistribution(processedData)}
                  nameKey="name"
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {getMoodDistribution(processedData).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<DistributionTooltip />} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Mood Distribution (Donut)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={getMoodDistribution(processedData)}
                  nameKey="name"
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {getMoodDistribution(processedData).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<DistributionTooltip />} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MoodVisualizations;