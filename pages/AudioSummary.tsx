
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppView } from '../types';
import { geminiService } from '../services/geminiService';
import { Waveform } from '../components/Waveform';
import { ArrowLeft, Upload, Play, Pause, RotateCcw, Volume2 } from 'lucide-react';

export const AudioSummary: React.FC = () => {
  const { setView, speak } = useApp();
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGenerate = async () => {
    if (!inputText) return;
    setLoading(true);
    speak("Processing textbook content. Please wait.");
    try {
      const result = await geminiService.generateSummary(inputText);
      setSummary(result || '');
      speak("Summary generated. Ready for playback.");
    } catch (e) {
      speak("I encountered an error generating the summary.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaySummary = async () => {
    if (!summary) return;
    setIsPlaying(true);
    await speak(summary);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-5xl mx-auto pb-32">
      <header className="mb-12">
        <button 
          onClick={() => setView(AppView.DASHBOARD)}
          className="mb-8 text-slate-400 hover:text-white flex items-center gap-2 focus-ring px-4 py-2"
          aria-label="Return to dashboard"
        >
          <ArrowLeft className="w-5 h-5" /> Dashboard
        </button>
        <h1 className="text-5xl font-black mb-4">Audio Summaries</h1>
        <p className="text-xl text-slate-400">Paste your textbook content below or upload a file.</p>
      </header>

      <div className="space-y-8">
        <div className="glass p-8 rounded-[2rem]">
          <textarea
            aria-label="Textbook content input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-64 bg-transparent border-2 border-white/5 rounded-2xl p-6 text-xl outline-none focus:border-blue-500/50 transition-all resize-none placeholder:text-slate-600"
            placeholder="Paste your chapter text here..."
          />
          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <button
              onClick={handleGenerate}
              disabled={loading || !inputText}
              className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-5 rounded-2xl font-bold text-xl transition-all shadow-lg neon-glow flex items-center justify-center gap-3 focus-ring"
            >
              {loading ? "Thinking..." : "Generate Summary"}
            </button>
            <button
              aria-label="Upload File"
              className="px-8 py-5 glass border-slate-700 hover:border-slate-500 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all focus-ring"
            >
              <Upload className="w-6 h-6" /> Upload PDF
            </button>
          </div>
        </div>

        {summary && (
          <div className="glass p-10 rounded-[2rem] border-blue-500/20 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-bold">Summary Preview</h2>
              <Waveform isActive={isPlaying} />
            </div>
            
            <p className="text-lg text-slate-300 leading-relaxed mb-10 italic">
              "{summary.slice(0, 300)}..."
            </p>

            <div className="flex items-center gap-6">
              <button
                onClick={handlePlaySummary}
                className="w-20 h-20 bg-emerald-500 hover:bg-emerald-400 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 focus-ring"
                aria-label={isPlaying ? "Pause summary playback" : "Play full summary"}
              >
                {isPlaying ? <Pause className="w-10 h-10 fill-white" /> : <Play className="w-10 h-10 fill-white" />}
              </button>
              
              <div className="flex-1 space-y-2">
                 <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full bg-emerald-500 transition-all duration-300 ${isPlaying ? 'w-1/2' : 'w-0'}`} />
                 </div>
                 <div className="flex justify-between text-sm font-medium text-slate-500">
                    <span>{isPlaying ? "2:45" : "0:00"}</span>
                    <span>5:30</span>
                 </div>
              </div>

              <button aria-label="Restart playback" className="p-4 glass rounded-full hover:bg-white/10 focus-ring">
                <RotateCcw className="w-6 h-6" />
              </button>
              <button aria-label="Audio settings" className="p-4 glass rounded-full hover:bg-white/10 focus-ring">
                <Volume2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
