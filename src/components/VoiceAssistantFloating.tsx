import React, { useState } from 'react';
import { MicrophoneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import VoiceAssistant from '../pages/VoiceAssistant';

const VoiceAssistantFloating: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Icon Button */}
      {!isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ffe066 0%, #ffd700 100%)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 1000,
            border: '2px solid #ffec99',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }}
        >
          <MicrophoneIcon className="h-7 w-7 text-yellow-800" />
        </div>
      )}

      {/* Expanded Voice Assistant Popup */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              zIndex: 999,
            }}
          />
          
          {/* Voice Assistant Popup */}
          <div
            style={{
              position: 'fixed',
              bottom: 90,
              right: 20,
              zIndex: 1001,
            }}
          >
            {/* Close Button */}
            <div
              style={{
                position: 'absolute',
                top: -10,
                right: -10,
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                zIndex: 1002,
              }}
              onClick={() => setIsOpen(false)}
            >
              <XMarkIcon className="h-4 w-4 text-white" />
            </div>
            
            <VoiceAssistant />
          </div>
        </>
      )}
    </>
  );
};

export default VoiceAssistantFloating; 