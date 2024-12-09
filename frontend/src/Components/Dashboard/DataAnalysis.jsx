// src/Components/Dashboard/DataAnalysis.jsx
import React, { useState } from 'react';

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart, ComposedChart, Bar, BarChart
} from 'recharts';

import { 
  Heart,
  Moon,
  Activity,
  Clock,
  Zap
} from 'lucide-react';

import { Card } from '../ui/Card';

const DataAnalysis = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [chartType, setChartType] = useState('line');

  // Sample data - in real app, this would come from your backend
  const sleepMoodData = [
    { date: '2024-01-01', sleepHours: 8, moodLevel: 8, stress: 3 },
    { date: '2024-01-02', sleepHours: 7, moodLevel: 7, stress: 4 },
    { date: '2024-01-03', sleepHours: 6, moodLevel: 5, stress: 6 },
    { date: '2024-01-04', sleepHours: 8, moodLevel: 7, stress: 4 },
    { date: '2024-01-05', sleepHours: 7.5, moodLevel: 8, stress: 3 },
    { date: '2024-01-06', sleepHours: 6.5, moodLevel: 6, stress: 5 },
    { date: '2024-01-07', sleepHours: 8, moodLevel: 9, stress: 2 }
  ];

  const activityData = [
    { date: '2024-01-01', activityMinutes: 45, energyLevel: 8, mood: 8 },
    { date: '2024-01-02', activityMinutes: 30, energyLevel: 6, mood: 7 },
    { date: '2024-01-03', activityMinutes: 60, energyLevel: 9, mood: 9 },
    { date: '2024-01-04', activityMinutes: 20, energyLevel: 5, mood: 6 },
    { date: '2024-01-05', activityMinutes: 40, energyLevel: 7, mood: 8 },
    { date: '2024-01-06', activityMinutes: 50, energyLevel: 8, mood: 8 },
    { date: '2024-01-07', activityMinutes: 35, energyLevel: 6, mood: 7 }
  ];

  const biometricsData = [
    { time: '9:00', heartRate: 72, stressLevel: 3 },
    { time: '10:00', heartRate: 75, stressLevel: 4 },
    { time: '11:00', heartRate: 80, stressLevel: 6 },
    { time: '12:00', heartRate: 85, stressLevel: 7 },
    { time: '13:00', heartRate: 78, stressLevel: 5 },
    { time: '14:00', heartRate: 73, stressLevel: 4 },
    { time: '15:00', heartRate: 70, stressLevel: 3 }
  ];

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

  return (
    <div className="space-y-8">
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

      {/* Sleep and Mood Correlation */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Moon className="text-indigo-500" />
          <div>
            <h2 className="text-xl font-bold">Sleep and Mood Correlation</h2>
            <p className="text-sm text-gray-600">Analyzing how sleep patterns affect your mood</p>
          </div>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer>
            <ComposedChart data={sleepMoodData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar dataKey="sleepHours" fill="#8884d8" name="Sleep Hours" yAxisId="left" />
              <Line type="monotone" dataKey="moodLevel" stroke="#82ca9d" name="Mood Level" yAxisId="right" />
              <Line type="monotone" dataKey="stress" stroke="#ff7300" name="Stress Level" yAxisId="right" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Physical Activity Impact */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="text-yellow-500" />
          <div>
            <h2 className="text-xl font-bold">Physical Activity Impact</h2>
            <p className="text-sm text-gray-600">Relationship between exercise and energy levels</p>
          </div>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer>
            <AreaChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="activityMinutes" 
                stackId="1"
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.3}
                name="Activity (minutes)"
              />
              <Area 
                type="monotone" 
                dataKey="energyLevel" 
                stackId="2"
                stroke="#82ca9d" 
                fill="#82ca9d" 
                fillOpacity={0.3}
                name="Energy Level"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Heart Rate & Stress */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="text-red-500" />
          <div>
            <h2 className="text-xl font-bold">Heart Rate & Stress Levels</h2>
            <p className="text-sm text-gray-600">Monitoring physiological stress indicators</p>
          </div>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer>
            <LineChart data={biometricsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="heartRate" 
                stroke="#ff4d4d" 
                name="Heart Rate (BPM)"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="stressLevel" 
                stroke="#ffa726" 
                name="Stress Level"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default DataAnalysis;