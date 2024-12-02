import { useState } from 'react';
import PropTypes from 'prop-types';
import { Card } from '../ui/Card';

const supportGroups = [
  {
    id: 'cga',
    name: 'Criminal & Gang Anonymous (CGA)',
    description: 'Support for individuals seeking to leave criminal lifestyles and gang affiliations.',
    indicators: ['Angry', 'Stressed', 'Anxious'],
    meetingTimes: ['Monday 7PM', 'Thursday 7PM'],
    resources: ['Counseling', 'Job Training', 'Legal Aid'],
    capacity: 20,
    currentMembers: 12
  },
  {
    id: 'aa',
    name: 'Alcoholics Anonymous (AA)',
    description: 'Support for individuals recovering from alcohol addiction.',
    indicators: ['Stressed', 'Overwhelmed', 'Tired'],
    meetingTimes: ['Daily 6PM', 'Saturday 10AM'],
    resources: ['12-Step Program', 'Sponsor System', 'Recovery Literature'],
    capacity: 30,
    currentMembers: 25
  },
  {
    id: 'na',
    name: 'Narcotics Anonymous (NA)',
    description: 'Support for individuals recovering from drug addiction.',
    indicators: ['Anxious', 'Overwhelmed', 'Tired'],
    meetingTimes: ['Daily 8PM', 'Sunday 11AM'],
    resources: ['Recovery Program', 'Peer Support', 'Crisis Hotline'],
    capacity: 30,
    currentMembers: 18
  },
  {
    id: 'eid',
    name: 'Emotional Intelligence Development',
    description: 'Learn to understand and manage emotions effectively.',
    indicators: ['Stressed', 'Overwhelmed', 'Sad'],
    meetingTimes: ['Tuesday 6PM', 'Saturday 2PM'],
    resources: ['Workshops', 'Personal Development', 'Mindfulness Training'],
    capacity: 25,
    currentMembers: 15
  },
  {
    id: 'anger',
    name: 'Anger Management',
    description: 'Develop skills to manage anger and aggressive responses.',
    indicators: ['Angry', 'Stressed', 'Overwhelmed'],
    meetingTimes: ['Wednesday 7PM', 'Saturday 3PM'],
    resources: ['Coping Strategies', 'Stress Management', 'Communication Skills'],
    capacity: 20,
    currentMembers: 16
  }
];

const calculateGroupMatch = (userEmotions, groupIndicators) => {
  if (!userEmotions.length) return 0;
  const matchCount = userEmotions.filter(emotion => 
    groupIndicators.includes(emotion)
  ).length;
  return (matchCount / groupIndicators.length) * 100;
};

const SupportGroups = ({ moodData = [] }) => {
  const [joinedGroups, setJoinedGroups] = useState(new Set());
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Get user's recent emotions (last 7 entries)
  const recentEmotions = Array.from(new Set(
    moodData.slice(0, 7).flatMap(entry => entry.emotions)
  ));

  // Calculate matches for each group
  const groupMatches = supportGroups.map(group => ({
    ...group,
    matchPercentage: calculateGroupMatch(recentEmotions, group.indicators),
    spotsAvailable: group.capacity - group.currentMembers
  })).sort((a, b) => b.matchPercentage - a.matchPercentage);

  const handleJoinGroup = (group) => {
    if (joinedGroups.has(group.id)) {
      alert('You are already a member of this group.');
      return;
    }

    if (group.currentMembers >= group.capacity) {
      alert('This group is currently at capacity. Please try again later.');
      return;
    }

    setSelectedGroup(group);
    setShowConfirmation(true);
  };

  const confirmJoinGroup = () => {
    if (selectedGroup) {
      setJoinedGroups(new Set([...joinedGroups, selectedGroup.id]));
      // Here you would typically make an API call to join the group
      setShowConfirmation(false);
      setSelectedGroup(null);
    }
  };

  if (!moodData || moodData.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-medium">Support Groups</h2>
        <p className="text-gray-600 mt-4">
          Start tracking your moods to receive personalized group recommendations.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Recommended Support Groups</h2>
      
      {groupMatches.map(group => (
        <Card key={group.id} className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{group.name}</h3>
                <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                  {group.matchPercentage.toFixed(0)}% Match
                </div>
              </div>
              
              <p className="text-gray-600 mt-1">{group.description}</p>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Meeting Times:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {group.meetingTimes.map(time => (
                      <li key={time}>{time}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Resources:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {group.resources.map(resource => (
                      <li key={resource}>{resource}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {group.spotsAvailable} spots available
                </div>
                <button
                  onClick={() => handleJoinGroup(group)}
                  disabled={joinedGroups.has(group.id)}
                  className={`px-4 py-2 rounded-md ${
                    joinedGroups.has(group.id)
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {joinedGroups.has(group.id) ? 'Joined' : 'Join Group'}
                </button>
              </div>
            </div>
          </div>
        </Card>
      ))}

      {/* Confirmation Modal */}
      {showConfirmation && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Join Group</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to join {selectedGroup.name}?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmJoinGroup}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

SupportGroups.propTypes = {
  moodData: PropTypes.arrayOf(
    PropTypes.shape({
      emotions: PropTypes.arrayOf(PropTypes.string).isRequired,
      date: PropTypes.string.isRequired
    })
  )
};

export default SupportGroups;