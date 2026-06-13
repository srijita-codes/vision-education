
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppView } from './types';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { AudioSummary } from './pages/AudioSummary';
import { Chatbot } from './pages/Chatbot';
import { DiagramExplainer } from './pages/DiagramExplainer';

const AppContent: React.FC = () => {
  const { view, accessibilityMode } = useApp();

  return (
    <div className={`min-h-screen transition-all duration-500 ${accessibilityMode ? 'grayscale-0' : 'grayscale-0'}`}>
      <main>
        {view === AppView.LANDING && <Landing />}
        {view === AppView.LOGIN && <Login />}
        {view === AppView.DASHBOARD && <Dashboard />}
        {view === AppView.SUMMARY && <AudioSummary />}
        {view === AppView.CHAT && <Chatbot />}
        {view === AppView.DIAGRAM && <DiagramExplainer />}
      </main>
      
      {/* Persistent Accessibility Toggle for Judges (Sticky Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50">
        <AccessibilityButton />
      </div>
    </div>
  );
};

const AccessibilityButton: React.FC = () => {
  const { toggleAccessibility, accessibilityMode } = useApp();
  return (
    <button
      onClick={toggleAccessibility}
      className={`p-4 rounded-full shadow-2xl border-2 transition-all hover:scale-110 active:scale-90 flex items-center gap-3 px-6 font-bold ${
        accessibilityMode ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
      }`}
      aria-label={accessibilityMode ? "Accessibility mode is on. Click to toggle." : "Click to enable high accessibility mode."}
    >
      <div className={`w-3 h-3 rounded-full ${accessibilityMode ? 'bg-white animate-pulse' : 'bg-slate-500'}`} />
      {accessibilityMode ? 'Screen Reader Mode Active' : 'Accessibility Mode'}
    </button>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
