import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import Groq from 'groq-sdk';

// Initialize Groq client with hardcoded API key
// Replace 'your_groq_api_key_here' with your actual Groq API key
const groq = new Groq({ apiKey: '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' });

/**
 * Step 1: Convert video to audio using FFmpeg
 * @param {string} videoPath - Path to the video file
 * @param {string} outputPath - Path where audio file will be saved
 * @returns {Promise<string>} - Path to the generated audio file
 */
export const convertVideoToAudio = (videoPath, outputPath) => {
  return new Promise((resolve, reject) => {
    console.log('🎬 Starting video to audio conversion...');
    console.log('Input video:', videoPath);
    console.log('Output audio:', outputPath);

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    ffmpeg(videoPath)
      .audioCodec('libmp3lame') // Use MP3 codec
      .audioChannels(1) // Mono audio for better transcription
      .audioFrequency(16000) // 16kHz sample rate (optimal for Whisper)
      .format('mp3')
      .on('start', (commandLine) => {
        console.log('🔧 FFmpeg command:', commandLine);
      })
      .on('progress', (progress) => {
        console.log(`⏳ Processing: ${Math.round(progress.percent || 0)}% done`);
      })
      .on('end', () => {
        console.log(' Video to audio conversion completed');
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('❌ Error converting video to audio:', err);
        reject(err);
      })
      .save(outputPath);
  });
};

/**
 * Step 2: Transcribe audio to text using Groq Whisper
 * @param {string} audioPath - Path to the audio file
 * @returns {Promise<Object>} - Transcription result with text and metadata
 */
export const transcribeAudioToText = async (audioPath) => {
  try {
    console.log('🎤 Starting audio transcription with Groq Whisper...');
    console.log('Audio file:', audioPath);

    // Check if file exists
    if (!fs.existsSync(audioPath)) {
      throw new Error(`Audio file not found: ${audioPath}`);
    }

    // Get file stats
    const stats = fs.statSync(audioPath);
    console.log(`📁 File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

    // Create transcription using Groq Whisper
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-large-v3",
      response_format: "verbose_json",
      language: "en", // Specify English for better accuracy
      temperature: 0.0, // Lower temperature for more consistent results
    });

    console.log(' Transcription completed');
    console.log(`📝 Text length: ${transcription.text.length} characters`);

    return {
      text: transcription.text,
      language: transcription.language,
      duration: transcription.duration,
      segments: transcription.segments || [],
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Error transcribing audio:', error);
    throw error;
  }
};

/**
 * Main function: Complete video transcription pipeline
 * @param {string} videoPath - Path to the video file
 * @returns {Promise<Object>} - Complete transcription result
 */
export const transcribeVideo = async (videoPath) => {
  try {
    console.log('🚀 Starting complete video transcription pipeline...');
    
    // Generate unique filename for audio
    const timestamp = Date.now();
    const audioPath = path.join(process.cwd(), 'temp', `audio_${timestamp}.mp3`);
    
    // Step 1: Convert video to audio
    console.log('\n📹 Step 1: Converting video to audio...');
    await convertVideoToAudio(videoPath, audioPath);
    
    // Step 2: Transcribe audio to text
    console.log('\n🎙️ Step 2: Transcribing audio to text...');
    const transcriptionResult = await transcribeAudioToText(audioPath);
    
    // Clean up temporary audio file
    console.log('\n🧹 Cleaning up temporary files...');
    if (fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
      console.log('🗑️ Temporary audio file deleted');
    }
    
    console.log('\n Video transcription pipeline completed successfully!');
    return {
      ...transcriptionResult,
      videoPath,
      audioPath: audioPath, // For reference, even though cleaned up
      success: true
    };
    
  } catch (error) {
    console.error('❌ Video transcription pipeline failed:', error);
    throw error;
  }
};

/**
 * Utility function to check if required dependencies are available
 */
export const checkDependencies = () => {
  const issues = [];
  
  // Check if temp directory exists, create if not
  const tempDir = path.join(process.cwd(), 'temp');
  if (!fs.existsSync(tempDir)) {
    try {
      fs.mkdirSync(tempDir, { recursive: true });
      console.log('📁 Created temp directory:', tempDir);
    } catch (error) {
      issues.push(`Could not create temp directory: ${error.message}`);
    }
  }
  
  return {
    ready: issues.length === 0,
    issues
  };
}; 