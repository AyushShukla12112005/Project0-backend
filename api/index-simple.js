// Simplified version for testing
export default function handler(req, res) {
  // Simple response without database
  if (req.url === '/api/health' || req.url === '/health') {
    return res.status(200).json({
      ok: true,
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  }

  if (req.url === '/' || req.url === '') {
    return res.status(200).json({
      message: 'Bug Tracker API',
      status: 'running',
      version: '1.0.0',
      endpoints: {
        health: '/api/health',
        test: '/api/test'
      }
    });
  }

  return res.status(404).json({
    error: 'Not Found',
    path: req.url
  });
}
