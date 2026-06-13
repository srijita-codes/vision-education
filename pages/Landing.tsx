
import React from 'react';
import { useApp } from '../context/AppContext';
import { AppView } from '../types';
import { Waveform } from '../components/Waveform';
import { Headphones, Volume2, ShieldCheck, ChevronRight } from 'lucide-react';

export const Landing: React.FC = () => {
  const { setView, toggleAccessibility, accessibilityMode } = useApp();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <header className="z-10 text-center space-y-8 max-w-4xl">
        <div className="flex justify-center">
            <div className="p-4 rounded-3xl glass neon-glow animate-bounce">
                <Volume2 className="w-16 h-16 text-blue-400" />
            </div>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white leading-tight">
          Education Without <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Barriers</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The world's first AI-powered companion designed specifically for visually impaired learners. 
          Listen, interact, and master any subject through voice.
        </p>

        <div className="py-8">
            <Waveform isActive={true} />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-12">
          <button
            onClick={() => setView(AppView.LOGIN)}
            aria-label="Start Listening. Enter Dashboard."
            className="w-full md:w-auto px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xl shadow-xl transition-all hover:scale-105 active:scale-95 focus-ring flex items-center justify-center gap-2"
          >
            Start Listening <ChevronRight className="w-6 h-6" />
          </button>
          
          <button
            onClick={toggleAccessibility}
            aria-label={accessibilityMode ? "Disable Screen Reader Mode" : "Enable Screen Reader Mode"}
            className="w-full md:w-auto px-12 py-5 glass border-slate-700 hover:border-slate-500 text-white rounded-2xl font-bold text-xl transition-all focus-ring flex items-center justify-center gap-2"
          >
            {accessibilityMode ? "High Contrast Mode: On" : "Try Voice Demo"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 z-10 w-full max-w-6xl pb-20">
        <FeatureCard 
            icon={<Headphones className="w-8 h-8" />} 
            title="Audio Summaries" 
            desc="Instantly convert complex textbooks into engaging audio chapters." 
        />
        <FeatureCard 
            icon={<Volume2 className="w-8 h-8" />} 
            title="Voice Interactivity" 
            desc="Chat with your textbooks. Ask questions, get explanations." 
        />
        <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8" />} 
            title="Accessibility First" 
            desc="WCAG 2.1 AAA standards built into the core foundation." 
        />
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div className="glass p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all group">
    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </div>
);
