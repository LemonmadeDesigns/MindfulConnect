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
router.post('/:groupId/join', auth, async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const group = await SupportGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Support group not found' });
    }

    if (group.members.includes(userId)) {
      return res.status(400).json({ message: 'Already a member of this group' });
    }

    group.members.push(userId);
    await group.save();

    res.json({ message: 'Successfully joined group', group });
  } catch (error) {
    console.error('Error joining group:', error);
    res.status(500).json({ message: 'Failed to join group' });
  }
});

// Create a new support group
router.post('/', auth, createGroup);

export default router;