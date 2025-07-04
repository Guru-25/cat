# Video Transcription Setup Guide

## Overview
This system allows you to transcribe videos using Groq's Whisper API and chat about the content. It's implemented step by step as requested:

1. **Video to Audio** - FFmpeg converts video to optimized audio
2. **Audio to Text** - Groq Whisper transcribes the audio
3. **Text to Chat** - Will integrate with Gemini API for chatting

## Prerequisites

### 1. FFmpeg Installation
You need FFmpeg installed on your system:

**Windows:**
```bash
# Using chocolatey
choco install ffmpeg

# Or download from https://ffmpeg.org/download.html
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt update
sudo apt install ffmpeg
```

### 2. API Keys
Get your API keys and add them to the `.env` file:

```env
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

- **Groq API Key**: Get from https://console.groq.com/
- **Gemini API Key**: Get from https://aistudio.google.com/app/apikey

## Setup Steps

### 1. Install Dependencies (Already Done)
```bash
npm install groq-sdk ffmpeg fluent-ffmpeg multer express cors dotenv
npm install -D @types/fluent-ffmpeg @types/multer @types/express @types/cors
```

### 2. Add Your Video File
Place your training video in the `public` folder:
```
public/
  - training-video.mp4  <- Your video goes here
  - vite.svg
```

### 3. Update Environment Variables
Edit the `.env` file with your actual API keys:
```env
GROQ_API_KEY=gsk_your_actual_groq_key_here
GEMINI_API_KEY=your_actual_gemini_key_here
PORT=5000
```

## Testing the System

### 1. Start the Backend Server
```bash
npm run server
```

You should see:
```
🚀 Transcription server running on http://localhost:5000
📁 Serving static files from: /path/to/your/project/public
 All dependencies ready
```

### 2. Start the Frontend
In a new terminal:
```bash
npm run dev
```

### 3. Test the Transcription
1. Open http://localhost:5173
2. Navigate to "E-Learning" tab
3. Click "Ask AI about this Video"
4. Watch the console logs for the transcription process

## Current Implementation Status

 **Completed:**
- Video to Audio conversion (FFmpeg)
- Audio to Text transcription (Groq Whisper)
- Basic Express server
- Frontend integration
- Error handling

🚧 **Next Steps:**
- Chat interface with transcribed text
- Gemini API integration for conversations
- Better UI for chat

## File Structure
```
src/
├── services/
│   └── transcriptionService.js  # Video->Audio->Text pipeline
├── server/
│   └── transcriptionServer.js   # Express API server
└── pages/
    └── ELearning.tsx            # Frontend interface
```

## API Endpoints

### Health Check
```
GET /api/health
```

### Video Info
```
GET /api/video-info/:filename
```

### Transcribe Video
```
POST /api/transcribe-video
Body: { "videoFileName": "training-video.mp4" }
```

## Debugging

### Check FFmpeg Installation
```bash
ffmpeg -version
```

### Check if Video File Exists
Visit: http://localhost:5000/api/video-info/training-video.mp4

### View Server Logs
The server provides detailed console logs with emojis for easy debugging:
- 🎬 Video processing
- 🎤 Audio transcription
-  Success messages
- ❌ Error messages

## Common Issues

1. **"FFmpeg not found"** - Install FFmpeg using the instructions above
2. **"Video file not found"** - Make sure `training-video.mp4` is in the `public` folder
3. **"GROQ_API_KEY not set"** - Add your API key to the `.env` file
4. **CORS errors** - Make sure both servers are running (frontend on 5173, backend on 5000)

## Next Phase: Chat Integration
Once transcription is working, we'll add:
1. Chat interface component
2. Gemini API integration for conversations
3. Context-aware responses based on video content 