import React, { useState } from 'react';
import { PlayIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import ChatInterface from '../components/ChatInterface';

// Available training videos
const availableVideos = [
  {
    id: 'training-video',
    filename: 'training-video.mp4',
    title: 'CAT Equipment Training - Basic Operations',
    description: 'This training video covers the basic operations of CAT excavators, including startup procedures, basic controls, safety protocols, and shutdown procedures. Perfect for new operators or as a refresher course.',
    duration: '5:00',
    level: 'Beginner'
  },
  {
    id: 'video2',
    filename: 'video2.mp4',
    title: 'How to Drive a Dump Truck (Cat 730)',
    description: 'Comprehensive guide on operating the Cat 730 dump truck, covering pre-operation inspection, driving techniques, loading procedures, and safety protocols specific to dump truck operations.',
    duration: '2:56',
    level: 'Intermediate'
  }
];

const ELearning = () => {
  const [selectedVideo, setSelectedVideo] = useState(availableVideos[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcriptionStep, setTranscriptionStep] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');

  const handleAskAI = async () => {
    console.log('Ask AI clicked - starting transcription process');
    setIsProcessing(true);
    setTranscriptionStep('Preparing...');

    try {
      // Step 1: Check if video exists
      setTranscriptionStep('Checking video file...');
      const videoResponse = await fetch(`http://localhost:5000/api/video-info/${selectedVideo.filename}`);
      const videoInfo = await videoResponse.json();
      
      if (!videoInfo.success) {
        throw new Error(`Video file not found. Please place ${selectedVideo.filename} in the public folder.`);
      }
      
      console.log('Video info:', videoInfo);

      // Step 2: Start transcription process
      setTranscriptionStep('Converting video to audio...');
      
      const transcriptionResponse = await fetch('http://localhost:5000/api/transcribe-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoFileName: selectedVideo.filename
        }),
      });

      if (!transcriptionResponse.ok) {
        const errorData = await transcriptionResponse.json();
        throw new Error(errorData.error || 'Transcription failed');
      }

      setTranscriptionStep('Transcribing audio to text...');
      const result = await transcriptionResponse.json();
      
      console.log('Transcription result:', result);
      
      setTranscriptionStep('Opening chat interface...');
      
      // Store transcribed text and open chat interface
      setTranscribedText(result.transcription.text);
      
      setTimeout(() => {
        setIsProcessing(false);
        setTranscriptionStep('');
        setShowChat(true);
      }, 1000);

    } catch (error) {
      console.error('Error during transcription:', error);
      alert(`Error: ${error.message}`);
      setIsProcessing(false);
      setTranscriptionStep('');
    }
  };

  const handleCloseChat = () => {
    setShowChat(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">E-Learning Center</h1>
        <p className="text-gray-600">Watch training videos and ask AI questions about the content</p>
      </div>

      {/* Video Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Training Video</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedVideo.id === video.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h3 className="font-medium text-gray-900 mb-2">{video.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{video.description}</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Duration: {video.duration}</span>
                <span>Level: {video.level}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {selectedVideo.title}
        </h2>
        
        {/* Video Container */}
        <div className="mb-6">
          <div className="relative bg-gray-900 rounded-lg overflow-hidden">
            <video 
              key={selectedVideo.id}
              className="w-full h-96 object-cover"
              controls
              poster="/api/placeholder/800/450"
            >
              {/* Video file should be placed in public folder */}
              <source src={`/${selectedVideo.filename}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Ask AI Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleAskAI}
              disabled={isProcessing}
              className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                isProcessing
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
              {isProcessing ? 'Processing...' : 'Ask AI about this Video'}
            </button>
            
            {isProcessing && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-600">{transcriptionStep}</span>
              </div>
            )}
          </div>
          
          <div className="text-sm text-gray-500">
            Duration: {selectedVideo.duration} • Training Level: {selectedVideo.level}
          </div>
        </div>

        {/* Video Description */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">About this video:</h3>
          <p className="text-gray-700 text-sm">
            {selectedVideo.description}
          </p>
        </div>
      </div>

      {/* Chat Interface Modal */}
      {showChat && (
        <ChatInterface
          transcribedText={transcribedText}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
};

export default ELearning;
 