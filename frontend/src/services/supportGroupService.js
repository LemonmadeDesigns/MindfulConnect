// src/services/supportGroupService.js
const API_URL = 'http://localhost:5001/api';

// Get all available support groups
export const getAllGroups = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return [];
  }

  try {
    const response = await fetch(`${API_URL}/support-groups`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch support groups');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching support groups:', error);
    return [];
  }
};

// Get all groups a user has joined
export const getUserGroups = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return []; // Return empty array if not logged in
  }

  try {
    const response = await fetch(`${API_URL}/support-groups/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user groups');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching user groups:', error);
    return []; // Return empty array on error
  }
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

// Join a specific group
export const joinSupportGroup = async (groupId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await fetch(`${API_URL}/support-groups/${groupId}/join`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to join group');
    }

    return response.json();
  } catch (error) {
    console.error('Error joining group:', error);
    throw error;
  }
};