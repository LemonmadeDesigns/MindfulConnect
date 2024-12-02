import { useState, useEffect } from 'react';
import { 
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';

import DataAnalysis from './DataAnalysis';

const MoodAnalytics = () => {
  const [moodData, setMoodData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emotionStats, setEmotionStats] = useState([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://localhost:5001/api/mood/analytics', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Please log in to view your mood analytics');
          }
          throw new Error('Failed to fetch mood data');
        }

        const data = await response.json();
        
        // Process data for line chart
        const processedData = data.entries.map(entry => ({
          date: new Date(entry.timestamp).toLocaleDateString(),
          moodLevel: entry.moodLevel,
          emotion: entry.emotion
        }));
        
        // Process data for pie chart
        const emotionCounts = data.entries.reduce((acc, entry) => {
          acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
          return acc;
        }, {});
        
        const pieData = Object.entries(emotionCounts).map(([name, value]) => ({
          name,
          value
        }));

        setMoodData(processedData);
        setEmotionStats(pieData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMoodData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading your mood data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8" style={{ padding: '5em 1em'}}>
      <div className="rounded-lg border p-6 bg-white">
        <h2 className="text-xl font-semibold mb-4">Mood Timeline</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={moodData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="moodLevel" 
              stroke="#8884d8" 
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border p-6 bg-white">
        <h2 className="text-xl font-semibold mb-4">Emotion Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={emotionStats}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {emotionStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Add the biological analysis */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">Biological Indicators</h2>
        <DataAnalysis />
      </div>
    </div>
  );
};

export default MoodAnalytics;