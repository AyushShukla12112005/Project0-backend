// Minimal test endpoint to verify Vercel deployment works
export default function handler(req, res) {
  res.status(200).json({
    success: true,
    message: 'Vercel deployment is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
}
