import path from 'path';
import fs from 'fs';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filename } = req.query;
    
    if (!filename) {
      return res.status(400).json({
        error: 'Filename is required',
        success: false
      });
    }

    const videoPath = path.join(process.cwd(), 'public', filename);
    
    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({
        error: 'Video file not found',
        success: false
      });
    }
    
    const stats = fs.statSync(videoPath);
    
    res.json({
      success: true,
      filename,
      size: stats.size,
      sizeFormatted: `${(stats.size / 1024 / 1024).toFixed(2)} MB`,
      modified: stats.mtime,
      exists: true
    });
    
  } catch (error) {
    console.error('Error getting video info:', error);
    res.status(500).json({
      error: error.message,
      success: false
    });
  }
} 