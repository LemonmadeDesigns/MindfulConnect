import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create a centralized configuration object
export const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 5001,
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  },

  // Database configuration
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mindfulconnect',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },

  // Authentication configuration
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpirationHours: 24,
    saltRounds: 10
  },

  // CORS configuration
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
};

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
}