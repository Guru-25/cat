# Vercel Deployment Guide

This guide will help you deploy your CAT Equipment Training application to Vercel.

## Prerequisites

Before deploying, make sure you have:

1. **Vercel CLI installed** (optional but recommended):
   ```bash
   npm install -g vercel
   ```

2. **API Keys** for the required services:
   - [Groq API Key](https://console.groq.com/keys) for transcription
   - [Google Gemini API Key](https://aistudio.google.com/app/apikey) for chat

## Deployment Steps

### 1. Prepare Your Environment

1. **Create a `.env` file** in your project root:
   ```bash
   cp env.example .env
   ```

2. **Add your API keys** to the `.env` file:
   ```
   GROQ_API_KEY=your_actual_groq_api_key_here
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   NODE_ENV=production
   ```

### 2. Deploy via Vercel CLI (Recommended)

1. **Login to Vercel**:
   ```bash
   vercel login
   ```

2. **Deploy the application**:
   ```bash
   vercel
   ```

3. **Follow the prompts**:
   - Set up and deploy? **Yes**
   - Which scope? Choose your account/team
   - Link to existing project? **No** (for first deployment)
   - What's your project's name? **cat-equipment-training** (or your preferred name)
   - In which directory is your code located? **./** (current directory)

4. **Set environment variables**:
   ```bash
   vercel env add GROQ_API_KEY
   vercel env add GEMINI_API_KEY
   ```
   Enter your API keys when prompted.

5. **Redeploy with environment variables**:
   ```bash
   vercel --prod
   ```

### 3. Deploy via Vercel Dashboard

1. **Connect your GitHub repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure build settings**:
   - Framework Preset: **Other**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Add environment variables**:
   - In the Vercel dashboard, go to your project settings
   - Navigate to "Environment Variables"
   - Add the following variables:
     ```
     GROQ_API_KEY=your_actual_groq_api_key_here
     GEMINI_API_KEY=your_actual_gemini_api_key_here
     NODE_ENV=production
     ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete

## Architecture

The application is deployed with the following structure:

```
vercel-deployment/
├── api/                      # Serverless functions
│   ├── health.js            # Health check endpoint
│   ├── transcribe-video.js  # Video transcription
│   ├── chat.js              # AI chat functionality
│   └── video-info/          # Video file information
│       └── [filename].js    # Dynamic route for video info
├── src/                     # Application source code
├── public/                  # Static assets (videos, audio)
├── dist/                    # Built React app (generated)
└── vercel.json              # Vercel configuration
```

## API Endpoints

After deployment, your API endpoints will be available at:

- **Health Check**: `https://your-app.vercel.app/api/health`
- **Transcribe Video**: `https://your-app.vercel.app/api/transcribe-video`
- **Chat**: `https://your-app.vercel.app/api/chat`
- **Video Info**: `https://your-app.vercel.app/api/video-info/[filename]`

## Important Notes

### FFmpeg Limitations
⚠️ **Important**: Vercel's serverless functions have limitations with FFmpeg:
- FFmpeg binaries may not be available in the serverless environment
- Video processing might fail due to missing system dependencies
- Consider using a dedicated media processing service for production

### Workarounds for Video Processing:
1. **Pre-process videos**: Convert videos to audio before uploading
2. **Use external services**: Consider services like Cloudinary or AWS Lambda for video processing
3. **Client-side processing**: Use WebAssembly FFmpeg in the browser

### File Storage
- Temporary files are stored in `/tmp` directory (limited to 512MB)
- Consider using cloud storage (AWS S3, Cloudinary) for persistent file storage
- Public assets are served from the `public/` directory

## Troubleshooting

### Common Issues:

1. **API Key Errors**:
   - Verify environment variables are set correctly
   - Check that API keys are valid and active

2. **Build Failures**:
   - Ensure all dependencies are listed in `package.json`
   - Check that the build command completes locally

3. **Function Timeouts**:
   - Vercel functions have a 60-second timeout (configured in vercel.json)
   - Large video files may timeout during processing

4. **FFmpeg Issues**:
   - If video processing fails, check Vercel function logs
   - Consider alternative video processing solutions

### Debugging:

1. **Check function logs**:
   ```bash
   vercel logs
   ```

2. **Test locally**:
   ```bash
   vercel dev
   ```

3. **Check deployment status**:
   ```bash
   vercel ls
   ```

## Alternative Deployment Options

If you encounter issues with video processing on Vercel, consider:

1. **Railway**: Better support for system dependencies
2. **AWS Lambda**: With custom layers for FFmpeg
3. **Google Cloud Run**: Docker-based deployment
4. **Traditional VPS**: Full control over system dependencies

## Support

For issues specific to this deployment:
1. Check the Vercel function logs
2. Verify API keys are correctly set
3. Test endpoints individually
4. Consider the limitations mentioned above

## Next Steps

After successful deployment:
1. Test all functionality
2. Monitor function performance
3. Set up proper error tracking
4. Consider implementing file upload to cloud storage
5. Add proper authentication for production use 