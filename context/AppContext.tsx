
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppState, AppView, User } from '../types';
import { geminiService } from '../services/geminiService';

interface AppContextType extends AppState {
  setView: (view: AppView) => void;
  setUser: (user: User | null) => void;
  toggleAccessibility: () => void;
  speak: (text: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [user, setUser] = useState<User | null>(null);
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [voiceVolume, setVoiceVolume] = useState(1);

  const speak = useCallback(async (text: string) => {
    const audio = await geminiService.textToSpeech(text);
    if (audio) {
      await geminiService.playAudio(audio);
    } else {
      // Fallback to browser TTS if Gemini TTS fails
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const toggleAccessibility = () => {
    setAccessibilityMode(prev => !prev);
    speak(accessibilityMode ? "Screen reader mode deactivated" : "Screen reader mode activated");
  };

  // Announce view changes
  useEffect(() => {
    const announcements: Record<AppView, string> = {
      [AppView.LANDING]: "Lumina Landing Page. Welcome.",
      [AppView.LOGIN]: "Login page. Sign in to your account.",
      [AppView.DASHBOARD]: "Dashboard. Here are your features.",
      [AppView.SUMMARY]: "Textbook Summary Page. Upload your content here.",
      [AppView.CHAT]: "Voice Chatbot. Ask Lumina anything.",
      [AppView.DIAGRAM]: "Diagram Explainer. Upload a picture for description."
    };
    if (view !== AppView.LANDING || user) {
        speak(announcements[view]);
    }
  }, [view, speak, user]);

  return (
    <AppContext.Provider value={{ 
      view, setView, 
      user, setUser, 
      accessibilityMode, toggleAccessibility,
      voiceVolume,
      speak
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
