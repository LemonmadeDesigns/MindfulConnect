// backend/src/routes/auth.js
import express from 'express';
import auth from '../middleware/auth.js';
import { 
    login,
    register,
    getUserProfile,
    logout,
    verifyToken
} from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', register);
router.get('/verify', verifyToken);

// Protected routes
router.get('/profile', auth, getUserProfile);
router.post('/logout', auth, logout);

export default router;