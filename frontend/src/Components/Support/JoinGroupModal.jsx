// src/Components/Support/JoinGroupModal.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

const JoinGroupModal = ({ group, onClose, onJoin }) => {
  const [agreement, setAgreement] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    if (!agreement) {
      setError('Please agree to the group guidelines to continue');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onJoin(group.id);
      // Success will be handled by parent component
    } catch (err) {
      setError(err.message || 'Failed to join group');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold flex items-center">
              <span className="text-2xl mr-2">{group.icon}</span>
              Join {group.name}
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Group Info */}
          <div className="mb-6">
            <div className={`${group.lightColor} ${group.textColor} p-4 rounded-lg mb-4`}>
              <div className="font-medium mb-2">Next Session</div>
              <div className="text-sm">
                {new Date(group.nextSession).toLocaleString()}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Group Guidelines:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                <li>Maintain confidentiality of all group discussions</li>
                <li>Respect all group members and their experiences</li>
                <li>Attend sessions regularly and arrive on time</li>
                <li>Participate actively but allow others to share</li>
                <li>Follow the guidance of group facilitators</li>
              </ul>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="mb-6">
            <label className="flex items-start space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
                className="mt-1"
              />
              <span className="text-sm text-gray-600">
                I understand and agree to follow the group guidelines, maintaining 
                confidentiality and showing respect to all members.
              </span>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
              <AlertCircle size={18} className="mr-2" />
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleJoin}
              disabled={!agreement || loading}
              className={`flex-1 px-4 py-2 rounded-lg text-white
                ${group.color} hover:opacity-90 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center`}
            >
              {loading ? (
                <span className="loader">Loading...</span>
              ) : (
                <>
                  <CheckCircle size={18} className="mr-2" />
                  Join Group
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

JoinGroupModal.propTypes = {
  group: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    nextSession: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    lightColor: PropTypes.string.isRequired,
    textColor: PropTypes.string.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onJoin: PropTypes.func.isRequired
};

export default JoinGroupModal;