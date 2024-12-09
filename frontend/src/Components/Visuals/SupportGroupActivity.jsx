// // src/Components/Dashboard/SupportGroupActivity.jsx
// import React from 'react';
// import { Card } from '../ui/Card';
// import { Users } from 'lucide-react';

// const SupportGroupActivity = () => {
//   const recentActivity = [
//     {
//       id: 1,
//       type: 'session',
//       group: 'Emotional Intelligence Development',
//       message: 'Next session tomorrow at 6 PM',
//       time: '2 hours ago',
//       icon: '🧠'
//     },
//     {
//       id: 2,
//       type: 'milestone',
//       group: 'Anger Management',
//       message: 'Completed 5 sessions',
//       time: '1 day ago',
//       icon: '🎯'
//     },
//     {
//       id: 3,
//       type: 'announcement',
//       group: 'Criminal & Gang Anonymous',
//       message: 'New resources available',
//       time: '2 days ago',
//       icon: '👥'
//     },
//     {
//       id: 4,
//       type: 'feedback',
//       group: 'Emotional Intelligence Development',
//       message: 'Session feedback requested',
//       time: '3 days ago',
//       icon: '🧠'
//     }
//   ];

//   return (
//     <Card className="p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h3 className="text-lg font-medium">Support Group Activity</h3>
//         <Users className="text-gray-400" size={20} />
//       </div>

//       <div className="space-y-4">
//         {recentActivity.map((activity) => (
//           <div
//             key={activity.id}
//             className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
//           >
//             <span className="text-2xl">{activity.icon}</span>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-medium text-gray-900">
//                 {activity.group}
//               </p>
//               <p className="text-sm text-gray-500">
//                 {activity.message}
//               </p>
//               <p className="text-xs text-gray-400 mt-1">
//                 {activity.time}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//       <button className="w-full mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
//         View All Activity
//       </button>
//     </Card>
//   );
// };

// export default SupportGroupActivity;

import React, { useState } from 'react';
import { 
  Brain, 
  Target, 
  Users, 
  HeartPulse, // Using HeartPulse instead of Pills for NA
  Coffee, // Using Coffee instead of Wine for AA
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

const ActivityItem = ({ icon: Icon, title, subtitle, time }) => (
  <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-all duration-200">
    <div className="flex-shrink-0">
      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
        <Icon className="w-6 h-6 text-blue-500" />
      </div>
    </div>
    <div className="flex-grow text-left">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{subtitle}</p>
      <p className="text-xs text-gray-500 mt-1">{time}</p>
    </div>
  </div>
);

const SupportGroupActivity = () => {
  const [showAllActivity, setShowAllActivity] = useState(false);

  const initialActivities = [
    {
      icon: Brain,
      title: "Emotional Intelligence Development",
      subtitle: "Next session tomorrow at 6 PM",
      time: "2 hours ago"
    },
    {
      icon: Target,
      title: "Anger Management",
      subtitle: "Completed 5 sessions",
      time: "1 day ago"
    },
    {
      icon: Users,
      title: "Criminal & Gang Anonymous",
      subtitle: "New resources available",
      time: "2 days ago"
    },
    {
      icon: Brain,
      title: "Emotional Intelligence Development",
      subtitle: "Session feedback requested",
      time: "3 days ago"
    }
  ];

  const additionalActivities = [
    {
      icon: Coffee,
      title: "Alcoholics Anonymous",
      subtitle: "Weekly meeting - Room 204",
      time: "4 days ago"
    },
    {
      icon: HeartPulse,
      title: "Narcotics Anonymous",
      subtitle: "Support session available",
      time: "5 days ago"
    },
    {
      icon: Coffee,
      title: "Alcoholics Anonymous",
      subtitle: "New member orientation",
      time: "1 week ago"
    },
    {
      icon: HeartPulse,
      title: "Narcotics Anonymous",
      subtitle: "Group sharing session",
      time: "1 week ago"
    }
  ];

  const displayedActivities = showAllActivity
    ? [...initialActivities, ...additionalActivities]
    : initialActivities;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="border-b border-gray-100 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Support Group Activity
          </h2>
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {displayedActivities.map((activity, index) => (
          <ActivityItem key={index} {...activity} />
        ))}
        <div className="p-4">
          <button 
            onClick={() => setShowAllActivity(!showAllActivity)}
            className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <span className="mr-1">
              {showAllActivity ? 'Show Less' : 'View All Activity'}
            </span>
            {showAllActivity ? (
              <ChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
            ) : (
              <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportGroupActivity;