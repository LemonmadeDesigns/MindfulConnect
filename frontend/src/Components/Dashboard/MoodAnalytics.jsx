// import { useState, useEffect } from 'react';
// import { 
//   LineChart, Line, PieChart, Pie, Cell,
//   XAxis, YAxis, CartesianGrid, Tooltip, 
//   Legend, ResponsiveContainer 
// } from 'recharts';

// import DataAnalysis from './DataAnalysis';

// const MoodAnalytics = () => {
//   const [moodData, setMoodData] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [emotionStats, setEmotionStats] = useState([]);

//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

//   useEffect(() => {
//     const fetchMoodData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           throw new Error('No authentication token found');
//         }

//         const response = await fetch('http://localhost:5001/api/mood/analytics', {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });

//         if (!response.ok) {
//           if (response.status === 401) {
//             throw new Error('Please log in to view your mood analytics');
//           }
//           throw new Error('Failed to fetch mood data');
//         }

//         const data = await response.json();
        
//         // Process data for line chart
//         const processedData = data.entries.map(entry => ({
//           date: new Date(entry.timestamp).toLocaleDateString(),
//           moodLevel: entry.moodLevel,
//           emotion: entry.emotion
//         }));
        
//         // Process data for pie chart
//         const emotionCounts = data.entries.reduce((acc, entry) => {
//           acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
//           return acc;
//         }, {});
        
//         const pieData = Object.entries(emotionCounts).map(([name, value]) => ({
//           name,
//           value
//         }));

//         setMoodData(processedData);
//         setEmotionStats(pieData);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchMoodData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center p-8">
//         <div className="text-lg">Loading your mood data...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8" style={{ padding: '5em 1em'}}>
//       <div className="rounded-lg border p-6 bg-white">
//         <h2 className="text-xl font-semibold mb-4">Mood Timeline</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={moodData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Line 
//               type="monotone" 
//               dataKey="moodLevel" 
//               stroke="#8884d8" 
//               activeDot={{ r: 8 }}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>

//       <div className="rounded-lg border p-6 bg-white">
//         <h2 className="text-xl font-semibold mb-4">Emotion Distribution</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <PieChart>
//             <Pie
//               data={emotionStats}
//               cx="50%"
//               cy="50%"
//               labelLine={false}
//               label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//               outerRadius={80}
//               fill="#8884d8"
//               dataKey="value"
//             >
//               {emotionStats.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//             <Legend />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Add the biological analysis */}
//       <div className="mt-8">
//         <h2 className="text-2xl font-semibold mb-6">Biological Indicators</h2>
//         <DataAnalysis />
//       </div>
//     </div>
//   );
// };

// export default MoodAnalytics;


// src/Components/Dashboard/MoodAnalytics.jsx
import { useState, useEffect } from 'react';
import { 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, ComposedChart 
} from 'recharts';

import { Clock, Activity } from 'lucide-react';
import { Card } from '../ui/Card';

import "./../App/App.css"

const MoodAnalytics = () => {
  const [moodData, setMoodData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emotionStats, setEmotionStats] = useState([]);
  const [timeRange, setTimeRange] = useState('week');
  const [chartType, setChartType] = useState('line');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const timeRanges = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'Past Week' },
    { value: 'month', label: 'Past Month' }
  ];

  const chartTypes = [
    { value: 'line', label: 'Line' },
    { value: 'area', label: 'Area' },
    { value: 'composed', label: 'Combined' }
  ];

  useEffect(() => {
    fetchMoodData();
  }, [timeRange]); // Refetch when timeRange changes

  const fetchMoodData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Add timeRange parameter to the API call
      const response = await fetch(`http://localhost:5001/api/mood/analytics?timeRange=${timeRange}`, {
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

  const renderChart = () => {
    switch (chartType) {
      case 'area':
        return (
          <AreaChart data={moodData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="moodLevel" 
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.3}
              activeDot={{ r: 8 }}
            />
          </AreaChart>
        );
      case 'composed':
        return (
          <ComposedChart data={moodData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="moodLevel" 
              fill="#8884d8"
              fillOpacity={0.3}
            />
            <Line 
              type="monotone" 
              dataKey="moodLevel" 
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </ComposedChart>
        );
      default:
        return (
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
        );
    }
  };

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
      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <Clock className="text-gray-400" />
          <div className="flex gap-2">
            {timeRanges.map(range => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-3 py-1 rounded-full text-sm ${
                  timeRange === range.value
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Activity className="text-gray-400" />
          <div className="flex gap-2">
            {chartTypes.map(type => (
              <button
                key={type.value}
                onClick={() => setChartType(type.value)}
                className={`px-3 py-1 rounded-full text-sm ${
                  chartType === type.value
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mood Timeline */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Mood Timeline</h2>
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>
      </Card>

      {/* Emotion Distribution */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Emotion Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart className="focus-none">
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
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="outline-none" />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default MoodAnalytics;