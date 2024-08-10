import React, { useState, useRef } from 'react';

const VoiceApp = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordings(prev => [...prev, { url: audioUrl, blob: audioBlob }]);
        audioChunks.current = [];
      };
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Erreur lors de l\'accès au microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const playRecording = (url) => {
    new Audio(url).play();
  };

  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Arrêter l\'enregistrement' : 'Commencer l\'enregistrement'}
      </button>
      <ul>
        {recordings.map((recording, index) => (
          <li key={index}>
            <button onClick={() => playRecording(recording.url)}>
              Jouer l'enregistrement {index + 1}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VoiceApp;