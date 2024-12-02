// backend/src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// IMPORTED ROUTES
import authRouter from './routes/auth.js';
import moodRouter from './routes/mood.js';
import supportGroupRouter from './routes/supportGroups.js';

const app = express();
dotenv.config();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ 
//         message: 'Something went wrong!',
//         error: err.message
//     });
// });

// Routes
app.use('/api/auth', authRouter);
app.use('/api/mood', moodRouter);
app.use('/api/support-groups', supportGroupRouter); 


// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Test route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});