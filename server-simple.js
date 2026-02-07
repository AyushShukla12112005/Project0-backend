// Simplified server for testing without MongoDB
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Simple routes for testing
app.get('/api/health', (req, res) => {
  res.json({ 
    ok: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Bug Tracker API - Simple Mode',
    status: 'running',
    note: 'MongoDB not connected - for testing only'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Simple server running on http://localhost:${PORT}`);
  console.log(`Test: http://localhost:${PORT}/api/health`);
});

export default app;
