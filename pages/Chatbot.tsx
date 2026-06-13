
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AppView, Message } from '../types';
import { geminiService } from '../services/geminiService';
import { VoiceButton } from '../components/VoiceButton';
import { ArrowLeft, User, Bot, Send } from 'lucide-react';

export const Chatbot: React.FC = () => {
  const { setView, speak } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hello! I am Lumina. What would you like to learn about today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await geminiService.chatResponse([], text);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response || "I'm sorry, I couldn't process that." };
      setMessages(prev => [...prev, aiMsg]);
      speak(aiMsg.content);
    } catch (e) {
      speak("Connection error. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-screen flex flex-col p-4 md:p-12 max-w-4xl mx-auto">
      <header className="flex-none mb-8">
        <button 
          onClick={() => setView(AppView.DASHBOARD)}
          className="mb-6 text-slate-400 hover:text-white flex items-center gap-2 focus-ring px-4 py-2"
          aria-label="Return to dashboard"
        >
          <ArrowLeft className="w-5 h-5" /> Dashboard
        </button>
        <h1 className="text-4xl font-black">Voice Assistant</h1>
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 mb-8 pr-4 custom-scrollbar"
        aria-live="polite"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`p-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600' : 'bg-slate-800'} text-white shadow-lg`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`p-5 rounded-2xl text-lg leading-relaxed ${msg.role === 'user' ? 'bg-blue-600/10 border border-blue-500/20' : 'glass'}`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="glass p-5 rounded-2xl flex gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
             </div>
          </div>
        )}
      </div>

      <div className="flex-none glass p-6 rounded-3xl border-t-2 border-white/5 space-y-4">
        <div className="flex items-center gap-4">
          <input
            aria-label="Type your message"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all text-lg"
            placeholder="Type your question..."
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            className="p-4 bg-blue-600 hover:bg-blue-500 rounded-2xl transition-all focus-ring"
            aria-label="Send message"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex justify-center pt-2">
          <div className="flex flex-col items-center gap-2">
             <VoiceButton 
               label="Tap to speak" 
               onTranscript={(t) => handleSendMessage(t)} 
             />
             <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">Hold to speak</span>
          </div>
        </div>
      </div>
    </div>
  );
};
