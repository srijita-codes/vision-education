
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppView } from '../types';
import { geminiService } from '../services/geminiService';
import { ArrowLeft, Image as ImageIcon, Camera, Loader2, PlayCircle } from 'lucide-react';

export const DiagramExplainer: React.FC = () => {
  const { setView, speak } = useApp();
  const [image, setImage] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setImage(reader.result as string);
        processDiagram(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const processDiagram = async (base64: string) => {
    setLoading(true);
    speak("Image received. Analysing the diagram layout and content.");
    try {
      const result = await geminiService.explainDiagram(base64);
      setExplanation(result || 'No description found.');
      speak("Diagram analysis complete. I can now narrate the contents for you.");
    } catch (e) {
      speak("I failed to analyze the diagram. Please try a clearer image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-5xl mx-auto">
      <header className="mb-12">
        <button 
          onClick={() => setView(AppView.DASHBOARD)}
          className="mb-8 text-slate-400 hover:text-white flex items-center gap-2 focus-ring px-4 py-2"
          aria-label="Return to dashboard"
        >
          <ArrowLeft className="w-5 h-5" /> Dashboard
        </button>
        <h1 className="text-5xl font-black mb-4">Diagram Explainer</h1>
        <p className="text-xl text-slate-400">Upload a picture of a scientific diagram, graph, or map to hear a detailed narration.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="glass p-10 rounded-[2.5rem] flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-white/10 hover:border-blue-500/30 transition-all group relative overflow-hidden">
            {image ? (
              <img src={image} alt="Uploaded diagram" className="w-full h-full object-contain rounded-xl" />
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform mx-auto">
                  <ImageIcon className="w-12 h-12 text-blue-400" />
                </div>
                <p className="text-xl font-bold mb-2">Drop your image here</p>
                <p className="text-slate-500">Supports PNG, JPG, and SVG</p>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              aria-label="Upload diagram image"
            />
          </div>

          <div className="flex gap-4">
             <button className="flex-1 py-5 glass border-slate-700 hover:border-slate-500 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all focus-ring">
                <Camera className="w-6 h-6" /> Take Photo
             </button>
          </div>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="glass p-10 rounded-[2.5rem] flex flex-col items-center justify-center h-full text-center space-y-4">
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
              <p className="text-2xl font-bold">Analysing Visuals...</p>
              <p className="text-slate-400">Lumina is identifying patterns and labels in the diagram.</p>
            </div>
          ) : explanation ? (
            <div className="glass p-10 rounded-[2.5rem] h-full flex flex-col border-emerald-500/20 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold">Narration Text</h3>
                <button 
                  onClick={() => speak(explanation)}
                  className="p-4 bg-emerald-500 hover:bg-emerald-400 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 focus-ring"
                  aria-label="Play narration"
                >
                  <PlayCircle className="w-8 h-8 text-white" />
                </button>
              </div>
              <div className="flex-1 bg-slate-900/40 rounded-3xl p-6 overflow-y-auto custom-scrollbar">
                <p className="text-lg leading-relaxed text-slate-300 whitespace-pre-line">
                  {explanation}
                </p>
              </div>
              <button className="mt-8 w-full py-4 text-blue-400 font-bold hover:underline">
                Copy detailed description
              </button>
            </div>
          ) : (
            <div className="glass p-10 rounded-[2.5rem] flex flex-col items-center justify-center h-full text-center opacity-40">
              <p className="text-xl">Upload an image to see the AI description here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
