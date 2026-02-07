import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Import routes
import authRoutes from '../routes/auth.js';
import projectRoutes from '../routes/projects.js';
import issueRoutes from '../routes/issues.js';
import commentRoutes from '../routes/comments.js';
import userRoutes from '../routes/users.js';
import adminRoutes from '../routes/admin.js';

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Database connection state
let isConnected = false;

// Connect to MongoDB
async function connectDB() {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    await mongoose.connect(MONGODB_URI, opts);
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    ok: true, 
    mongodb: mongoose.connection.readyState === 1,
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bug Tracker API',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      projects: '/api/projects',
      issues: '/api/issues'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
  });
});

// Vercel serverless function handler
export default async function handler(req, res) {
  try {
    // Check required environment variables
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ 
        error: 'Configuration Error',
        message: 'JWT_SECRET is not configured'
      });
    }

    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ 
        error: 'Configuration Error',
        message: 'MONGODB_URI is not configured'
      });
    }

    // Connect to database
    await connectDB();
    
    // Handle the request with Express
    return app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

