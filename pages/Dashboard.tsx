
import React from 'react';
import { useApp } from '../context/AppContext';
import { AppView } from '../types';
import { BookOpen, MessageCircle, Image as ImageIcon, Headphones, Settings, LogOut } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, setView, setUser, speak } = useApp();

  const handleLogout = () => {
    setUser(null);
    setView(AppView.LANDING);
    speak("Logged out successfully.");
  };

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-2">Hello, {user?.name || 'Scholar'}</h1>
          <p className="text-xl text-slate-400">Ready to master your studies today?</p>
        </div>
        
        <div className="flex gap-4">
          <button 
            aria-label="Account Settings" 
            className="p-4 glass rounded-2xl hover:bg-white/10 transition-colors focus-ring"
          >
            <Settings className="w-6 h-6" />
          </button>
          <button 
            onClick={handleLogout}
            aria-label="Logout" 
            className="p-4 glass rounded-2xl hover:bg-red-500/10 text-red-400 border-red-500/20 transition-colors focus-ring"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        <NavCard 
          title="Audio Summaries" 
          desc="Upload your textbooks and listen to concise, clear AI-generated summaries." 
          icon={<Headphones className="w-10 h-10" />}
          color="bg-blue-500"
          onClick={() => setView(AppView.SUMMARY)}
        />
        <NavCard 
          title="Voice Assistant" 
          desc="Have a conversation with Lumina. Ask complex questions and get voice feedback." 
          icon={<MessageCircle className="w-10 h-10" />}
          color="bg-purple-500"
          onClick={() => setView(AppView.CHAT)}
        />
        <NavCard 
          title="Diagram Explainer" 
          desc="Understand visuals. Upload a diagram and Lumina will narrate it for you." 
          icon={<ImageIcon className="w-10 h-10" />}
          color="bg-emerald-500"
          onClick={() => setView(AppView.DIAGRAM)}
        />
        <NavCard 
          title="My Library" 
          desc="Access your saved summaries, conversation history, and bookmarked diagrams." 
          icon={<BookOpen className="w-10 h-10" />}
          color="bg-orange-500"
          onClick={() => {}} // Placeholder
        />
      </div>
    </div>
  );
};

interface NavCardProps {
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

const NavCard: React.FC<NavCardProps> = ({ title, desc, icon, color, onClick }) => (
  <button
    onClick={onClick}
    className="group relative flex flex-col items-start text-left p-10 glass rounded-[2.5rem] border-white/5 hover:border-white/20 transition-all hover:scale-[1.02] focus-ring"
  >
    <div className={`p-5 rounded-3xl ${color} text-white mb-8 group-hover:scale-110 transition-transform shadow-lg`}>
      {icon}
    </div>
    <h3 className="text-3xl font-bold mb-4">{title}</h3>
    <p className="text-slate-400 text-lg leading-relaxed">{desc}</p>
    <div className="mt-8 flex items-center gap-2 text-blue-400 font-bold text-lg group-hover:translate-x-2 transition-transform">
      Explore now <span>→</span>
    </div>
  </button>
);
