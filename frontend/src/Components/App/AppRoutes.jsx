import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Dashboard from '../Dashboard/Dashboard';
import { getMoodHistory } from '../../services/moodService';
import Resources from './../Support/Resources';
import SupportGroups from './../Support/SupportGroups';
import SupportGroupsOverview from './../Support/SupportGroupsOverview';

const AppRoutes = () => {
  const [moodData, setMoodData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const data = await getMoodHistory();
        setMoodData(data);
      } catch (error) {
        console.error('Error fetching mood data:', error);
        setMoodData([]); // Set empty array as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route 
        path="/support-groups" 
        element={<SupportGroups moodData={moodData} />} 
      />
      <Route path="/support-groups" element={<SupportGroupsOverview />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;