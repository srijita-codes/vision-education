
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppView } from '../types';
import { ArrowLeft, LogIn } from 'lucide-react';

export const Login: React.FC = () => {
  const { setView, setUser, speak } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser({ id: '1', name: 'Alex', email: 'alex@example.com' });
      setView(AppView.DASHBOARD);
      speak("Login successful. Welcome Alex.");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md glass p-10 rounded-[2.5rem] relative shadow-2xl">
        <button 
          onClick={() => setView(AppView.LANDING)}
          className="absolute -top-16 left-0 text-slate-400 hover:text-white flex items-center gap-2 focus-ring px-4 py-2"
          aria-label="Back to landing page"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <h2 className="text-4xl font-black mb-2">Welcome Back</h2>
        <p className="text-slate-400 mb-10">Sign in to access your library</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block font-medium text-slate-300">Email Address</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-6 py-4 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-600"
              placeholder="alex@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" title="Password" className="block font-medium text-slate-300">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-6 py-4 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-5 rounded-2xl text-xl transition-all shadow-lg neon-glow flex items-center justify-center gap-3 focus-ring"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <>Sign In <LogIn className="w-6 h-6" /></>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-slate-500">Don't have an account? <button className="text-blue-400 hover:underline font-medium">Create one</button></p>
        </div>
      </div>
    </div>
  );
};
