// backend/src/scripts/seedSupportGroups.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SupportGroup from '../models/SupportGroup.js';

dotenv.config();

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

const seedGroups = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing groups
    await SupportGroup.deleteMany({});
    console.log('Cleared existing support groups');

    // Insert new groups
    await SupportGroup.insertMany(supportGroups);
    console.log('Support groups seeded successfully');

    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding support groups:', error);
    mongoose.disconnect();
  }
};

// Run the seed function
seedGroups();