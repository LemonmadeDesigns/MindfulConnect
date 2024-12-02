// backend/src/routes/supportGroups.js
import express from 'express';
import auth from '../middleware/auth.js';
import { 
  createGroup,
  getAllGroups,
  getUserGroups,
  joinGroup 
} from '../controllers/supportGroupControllers.js';

const router = express.Router();

// Get all support groups
router.get('/', auth, getAllGroups);

// Get all groups a user has joined
router.get('/user', auth, getUserGroups);

// Join a support group
router.post('/:groupId/join', auth, joinGroup);

// Create a new support group
router.post('/', auth, createGroup);

export default router;