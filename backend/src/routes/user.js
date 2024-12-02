// backend/src/routes/user.js
import express from 'express';
import auth from '../middleware/auth.js';
import { 
    getUserProfile,
    updateUserProfile,
    deleteUser,
    getAllUsers,
    getUserById
} from '../controllers/userController.js';

const router = express.Router();

// Get current user's profile
router.get('/profile', auth, getUserProfile);

// Update current user's profile
router.put('/profile', auth, updateUserProfile);

// Delete current user
router.delete('/', auth, deleteUser);

// Admin routes (you might want to add admin middleware)
router.get('/', auth, getAllUsers);
router.get('/:id', auth, getUserById);

export default router;