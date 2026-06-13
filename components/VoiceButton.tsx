
import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  label: string;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({ onTranscript, label }) => {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognition.start();
  };

  return (
    <button
      onClick={startListening}
      aria-label={isListening ? "Stop listening" : label}
      className={`p-6 rounded-full glass border-2 transition-all duration-300 group ${
        isListening ? 'border-red-500 scale-110 neon-glow bg-red-500/10' : 'border-blue-500 hover:border-blue-400'
      }`}
    >
      {isListening ? (
        <MicOff className="w-8 h-8 text-red-500 animate-pulse" />
      ) : (
        <Mic className="w-8 h-8 text-blue-400 group-hover:text-blue-300" />
      )}
    </button>
  );
};
