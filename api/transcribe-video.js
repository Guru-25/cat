import path from 'path';
import fs from 'fs';
import { transcribeVideo, checkDependencies } from '../src/services/transcriptionService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
} 