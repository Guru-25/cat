import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { transcribeVideo, checkDependencies } from '../services/transcriptionService.js';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const deps = checkDependencies();
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    dependencies: deps
  });
});

/**
 * POST /api/transcribe-video
 * Transcribe a video file to text
 */
app.post('/api/transcribe-video', async (req, res) => {
  try {
    const { videoFileName } = req.body;
    
    if (!videoFileName) {
      return res.status(400).json({
        error: 'Video file name is required',
        success: false
      });
    }

    console.log('📨 Received transcription request for:', videoFileName);

    // Check dependencies first
    const deps = checkDependencies();
    if (!deps.ready) {
      return res.status(500).json({
        error: 'Server dependencies not ready',
        issues: deps.issues,
        success: false
      });
    }

    // Construct path to video file in public directory
    const videoPath = path.join(process.cwd(), 'public', videoFileName);
    
    // Check if video file exists
    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({
        error: `Video file not found: ${videoFileName}`,
        success: false
      });
    }

    console.log('🎬 Video file found, starting transcription...');

    // Start transcription process
    const result = await transcribeVideo(videoPath);
    
    console.log('✅ Transcription completed successfully');
    
    // Return successful result
    res.json({
      success: true,
      transcription: result,
      message: 'Video transcribed successfully'
    });

  } catch (error) {
    console.error('❌ Transcription error:', error);
    
    // Send error response
    res.status(500).json({
      error: error.message,
      success: false,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * GET /api/video-info/:filename
 * Get information about a video file
 */
app.get('/api/video-info/:filename', (req, res) => {
  try {
    const { filename } = req.params;
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
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    success: false
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    success: false
  });
});

// Start server
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`🚀 Transcription server running on http://localhost:${PORT}`);
    console.log(`📁 Serving static files from: ${path.join(process.cwd(), 'public')}`);
    
    // Check dependencies on startup
    const deps = checkDependencies();
    if (deps.ready) {
      console.log('✅ All dependencies ready');
    } else {
      console.log('⚠️ Some dependencies missing:');
      deps.issues.forEach(issue => console.log(`  - ${issue}`));
    }
  });
};

// Handle server shutdown gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down transcription server...');
  process.exit(0);
});

export { app, startServer };

// Start the server immediately when this file is run
startServer(); 