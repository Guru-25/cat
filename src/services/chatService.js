import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini client with hardcoded API key
// Replace with your actual Gemini API key from Google AI Studio
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Chat with Gemini using transcribed video context
 * @param {string} transcribedText - The text from video transcription
 * @param {string} userMessage - User's question/message
 * @param {Array} chatHistory - Previous chat messages for context
 * @returns {Promise<Object>} - Chat response
 */
export const chatWithVideo = async (transcribedText, userMessage, chatHistory = []) => {
  try {
    console.log('🤖 Starting chat with Gemini...');
    
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    // Build context prompt with transcribed video content - ENHANCED for multilingual support
    const systemPrompt = `You are an AI assistant helping heavy equipment operators understand CAT equipment training and safety procedures.

Video Transcription Context:
"${transcribedText}"

INSTRUCTIONS:
1. **Language Support**: Respond in the SAME language the user asks their question in (English, Tamil, Hindi, Spanish, Arabic, etc.)
2. **Primary Source**: Use the video transcription as your main reference when answering questions
3. **General Knowledge**: If the user asks about CAT equipment, safety procedures, or heavy machinery that's not specifically in the video, you can provide general helpful information based on your knowledge
4. **Safety Priority**: Always prioritize safety information and best practices
5. **Be Helpful**: Don't restrict yourself only to the video content - be a helpful assistant for equipment operators
6. **Cultural Context**: Be respectful of different cultural backgrounds and working environments

EXAMPLES:
- If user asks in Tamil: Respond in Tamil
- If user asks in Hindi: Respond in Hindi  
- If user asks in English: Respond in English
- If user asks about general CAT equipment safety: Provide helpful safety guidance
- If user asks about specific video content: Reference the transcription

Be friendly, helpful, and focused on operator safety and equipment knowledge.`;

    // Build conversation history
    let conversationContext = systemPrompt + '\n\n';
    
    // Add previous chat history
    chatHistory.forEach(msg => {
      conversationContext += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
    });
    
    // Add current user message
    conversationContext += `User: ${userMessage}\nAssistant:`;
    
    console.log('📝 Sending message to Gemini...');
    
    // Generate response
    const result = await model.generateContent(conversationContext);
    const response = await result.response;
    const text = response.text();
    
    console.log(' Gemini response received');
    
    return {
      success: true,
      message: text,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ Error chatting with Gemini:', error);
    throw error;
  }
};

/**
 * Initialize a chat session with video context
 * @param {string} transcribedText - The text from video transcription
 * @returns {Object} - Chat session object
 */
export const initializeChatSession = (transcribedText) => {
  return {
    id: Date.now().toString(),
    transcribedText,
    messages: [],
    createdAt: new Date().toISOString()
  };
};

/**
 * Add message to chat session
 * @param {Object} session - Chat session object
 * @param {string} role - 'user' or 'assistant'
 * @param {string} content - Message content
 * @returns {Object} - Updated session
 */
export const addMessageToSession = (session, role, content) => {
  const message = {
    id: Date.now().toString(),
    role,
    content,
    timestamp: new Date().toISOString()
  };
  
  return {
    ...session,
    messages: [...session.messages, message]
  };
}; 