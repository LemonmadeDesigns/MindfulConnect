// src/Components/Dashboard/Dashboard.jsx
import { useState, useEffect } from 'react';

import { Card } from '../ui/Card';
import { getMoodEntries } from '../../services/moodService';
import { getAllGroups } from '../../services/supportGroupService';
import MoodTracker from './../Visuals/MoodTracker';
import MoodVisualizations from '../Visuals/MoodVisualizations';
import SupportGroupActivity from './../Visuals/SupportGroupActivity';
// import DataAnalysis from './DataAnalysis';

const Dashboard = () => {

  const [stats, setStats] = useState({
    activeSessions: 0,
    supportGroups: 0,
    averageMood: 0
  });

  const [refreshKey, setRefreshKey] = useState(0); // Add this
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      // Fetch mood entries for average calculation
      const [moodEntries, supportGroups] = await Promise.all([
        getMoodEntries(),
        getAllGroups()  // Changed to getAllGroups
      ]);
      
      // Calculate average mood
      const averageMood = moodEntries.length > 0
        ? (moodEntries.reduce((acc, entry) => acc + entry.moodLevel, 0) / moodEntries.length).toFixed(1)
        : 0;

      // Get active sessions count (entries in the last 24 hours)
      const lastDay = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const activeSessions = moodEntries.filter(entry => 
        new Date(entry.timestamp) > lastDay
      ).length;

      // Get support groups count
      // const supportGroups = await getUserGroups();

      setStats({
        activeSessions,
        supportGroups: supportGroups.length + 1,
        averageMood: Number(averageMood)
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleMoodSaved = async () => {
    // Refresh dashboard data when a new mood entry is saved
    await fetchDashboardData();
    setRefreshKey(prev => prev + 1); // Add this to trigger refresh
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-8 pt-16">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700">Active Sessions</h3>
            <p className="text-4xl font-bold text-blue-600 mt-2">
              {stats.activeSessions}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              In the last 24 hours
            </p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700">Support Groups</h3>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {stats.supportGroups}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Available groups
            </p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700">Average Mood</h3>
            <p className="text-4xl font-bold text-purple-600 mt-2">
              {stats.averageMood}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Overall average
            </p>
          </div>
        </Card>
      </div>

      {/* Main Content Area */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-1">
          <MoodTracker onSave={handleMoodSaved} />
        </div>
        
        <div className="lg:col-span-1">
          <Card className="p-6 h-full shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Weekly Mood Trends</h3>
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <MoodVisualizations />
            </div>
          </Card>
        </div>
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-1">
          <MoodTracker onSave={handleMoodSaved} />
        </div>
        
        <div className="lg:col-span-1">
          <Card className="p-6 h-full shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Weekly Mood Trends</h3>
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <MoodVisualizations refreshTrigger={refreshKey} />
            </div>
          </Card>
        </div>
      </div>

      {/* Support Group Activity */}
      <Card className="p-6 shadow-sm hover:shadow-md transition-shadow"> 
        <SupportGroupActivity />
      </Card>
    </div>
  );
};

export default Dashboard;