// backend/src/scripts/setupSupportGroups.js
import '../models/SupportGroup.js';
import { groups } from '../data/supportGroups.js';

const setupGroups = async () => {
  try {
    await SupportGroup.deleteMany({});
    await SupportGroup.insertMany(groups);
    console.log('Support groups created successfully');
  } catch (error) {
    console.error('Error setting up support groups:', error);
  }
};

setupGroups();