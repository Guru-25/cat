import { chatWithVideo } from '../src/services/chatService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { transcribedText, userMessage, chatHistory } = req.body;
    
    if (!transcribedText || !userMessage) {
      return res.status(400).json({
        error: 'Transcribed text and user message are required',
        success: false
      });
    }

    console.log('💬 Received chat request:', userMessage.substring(0, 100));

    // Send message to Gemini AI
    const result = await chatWithVideo(transcribedText, userMessage, chatHistory || []);
    
    console.log('✅ Chat response generated successfully');
    
    // Return successful result
    res.json({
      success: true,
      message: result.message,
      timestamp: result.timestamp
    });

  } catch (error) {
    console.error('❌ Chat error:', error);
    
    // Send error response
    res.status(500).json({
      error: error.message,
      success: false,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 