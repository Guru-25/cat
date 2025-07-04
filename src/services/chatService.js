import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client with hardcoded API key
// Replace with your actual Gemini API key from Google AI Studio
const genAI = new GoogleGenerativeAI('AIzaSyDrDYIc3FNa0p0oNoTR7h_Ls_UIFWoqA3U');

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
    
    // Build context prompt with transcribed video content
    const systemPrompt = `You are an AI assistant helping users understand a CAT equipment training video. 

Video Transcription Context:
"${transcribedText}"

Please answer user questions based on this video content. If the user asks about something not covered in the video, politely let them know that the information isn't available in this particular training video.

Be helpful, accurate, and focus on safety and proper equipment operation procedures mentioned in the video.`;

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