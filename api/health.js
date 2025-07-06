import { checkDependencies } from '../src/services/transcriptionService.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const deps = checkDependencies();
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      dependencies: deps
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      error: 'Health check failed',
      success: false
    });
  }
} 