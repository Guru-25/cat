import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { getTasks, getMachines, getOperators, getSafetyIncidents } from '../data/mockData';

const speak = (text: string) => {
  if ('speechSynthesis' in window) {
    const utter = new window.SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utter);
  }
};

const VoiceAssistant: React.FC = () => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  // Get current user info from localStorage
  const userName = localStorage.getItem('userName') || 'John Smith'; // fallback for demo
  const userRole = localStorage.getItem('userRole') || 'operator';

  // Helper: get operator object
  const operator = getOperators().find(op => op.name === userName);

  // Helper: get user's machine
  const myMachine = getMachines().find(m => m.operator === userName);

  // Helper: get user's next task
  const myTasks = getTasks().filter(t => t.assignedOperator === userName && t.status !== 'done');
  const nextTask = myTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  // Listen for transcript changes and match commands
  useEffect(() => {
    if (!transcript) return;

    let handled = false;

    // 1. Next Task
    if (/next task/i.test(transcript)) {
      if (nextTask) {
        speak(`Your next task is: ${nextTask.title}. Status: ${nextTask.status}. Location: ${nextTask.location}.`);
      } else {
        speak('You have no upcoming tasks.');
      }
      handled = true;
    }

    // 2. Fuel Level
    if (/fuel level/i.test(transcript)) {
      if (myMachine) {
        speak(`The fuel level of your machine, ${myMachine.model}, is ${myMachine.fuelLevel} percent.`);
      } else {
        speak('No machine assigned to you.');
      }
      handled = true;
    }

    // 3. Report Incident
    if (/report (an )?incident/i.test(transcript)) {
      speak('Please describe the incident after the beep.');
      // You could add more logic here to record the next transcript as the incident description.
      handled = true;
    }

    // 4. My Location
    if (/location/i.test(transcript)) {
      if (operator) {
        speak(`Your current location is X: ${operator.currentLocation.x}, Y: ${operator.currentLocation.y}, Zone: ${operator.currentLocation.zone || 'unknown'}.`);
      } else {
        speak('Operator location not found.');
      }
      handled = true;
    }

    // 5. My Status
    if (/my status/i.test(transcript)) {
      if (operator) {
        speak(`Your status is ${operator.status}.`);
      } else {
        speak('Status not found.');
      }
      handled = true;
    }

    if (handled) resetTranscript();
  // eslint-disable-next-line
  }, [transcript]);


// ...existing code...
return (
  <div
    style={{
      position: 'fixed',
     bottom: 10,
      right: 45,
      transform: 'translateX(-50%)',
      background: 'linear-gradient(135deg, #ffe066 0%, #ffd700 100%)',
      borderRadius: 12,
      padding: 12,
      boxShadow: '0 2px 8px #0002',
      zIndex: 1000,
      minWidth: 180,
      maxWidth: 320,
      fontSize: 15,
      border: '1.5px solid #ffec99',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'right',
    }}
  >
    <div style={{ fontWeight: 700, fontSize: 18, color: '#b8860b', marginBottom: 10, letterSpacing: 0.5 }}>
       Voice Assistant
    </div>
    <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
      <button
        onClick={() => SpeechRecognition.startListening({ continuous: true })}
        disabled={listening}
        style={{
          background: listening ? '#ffe066' : '#ffd700',
          color: '#333',
          border: 'none',
          borderRadius: 6,
          padding: '6px 14px',
          fontSize: 15,
          fontWeight: 600,
          cursor: listening ? 'not-allowed' : 'pointer',
          boxShadow: listening ? '0 0 0 1.5px #ffe066' : '0 1px 4px #0002',
        }}
      >
        start
      </button>
      <button
        onClick={SpeechRecognition.stopListening}
        disabled={!listening}
        style={{
          background: !listening ? '#ffe066' : '#ffd700',
          color: '#333',
          border: 'none',
          borderRadius: 6,
          padding: '6px 14px',
          fontSize: 15,
          fontWeight: 600,
          cursor: !listening ? 'not-allowed' : 'pointer',
          boxShadow: !listening ? '0 0 0 1.5px #ffe066' : '0 1px 4px #0002',
        }}
      >
        stop
      </button>
    </div>
    <div style={{ fontSize: 13, color: '#7c5c00', marginBottom: 4 }}>
      {listening ? 'Listening...' : 'Click mic to start'}
    </div>
    <div
      style={{
        background: '#fffbe6',
        borderRadius: 6,
        padding: '5px 8px',
        fontSize: 13,
        color: '#7c5c00',
        minHeight: 20,
        width: '100%',
        boxSizing: 'border-box',
        boxShadow: '0 1px 4px #ffd70044',
        wordBreak: 'break-word',
      }}
    >
      <b>Transcript:</b> {transcript}
    </div>
  </div>
);
// ...existing code...
};

export default VoiceAssistant;