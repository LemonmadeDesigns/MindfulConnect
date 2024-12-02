// src/Components/Dashboard/SupportGroupActivity.jsx
import React from 'react';
import { Card } from '../ui/Card';
import { Users } from 'lucide-react';

const SupportGroupActivity = () => {
  const recentActivity = [
    {
      id: 1,
      type: 'session',
      group: 'Emotional Intelligence Development',
      message: 'Next session tomorrow at 6 PM',
      time: '2 hours ago',
      icon: '🧠'
    },
    {
      id: 2,
      type: 'milestone',
      group: 'Anger Management',
      message: 'Completed 5 sessions',
      time: '1 day ago',
      icon: '🎯'
    },
    {
      id: 3,
      type: 'announcement',
      group: 'Criminal & Gang Anonymous',
      message: 'New resources available',
      time: '2 days ago',
      icon: '👥'
    },
    {
      id: 4,
      type: 'feedback',
      group: 'Emotional Intelligence Development',
      message: 'Session feedback requested',
      time: '3 days ago',
      icon: '🧠'
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Support Group Activity</h3>
        <Users className="text-gray-400" size={20} />
      </div>

      <div className="space-y-4">
        {recentActivity.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl">{activity.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {activity.group}
              </p>
              <p className="text-sm text-gray-500">
                {activity.message}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
        View All Activity
      </button>
    </Card>
  );
};

export default SupportGroupActivity;