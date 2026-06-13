
import React from 'react';

export const Waveform: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <div className="flex items-center justify-center space-x-1 h-12" aria-hidden="true">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className={`w-1.5 bg-blue-400 rounded-full ${isActive ? 'animate-wave' : 'h-2 opacity-30'}`}
          style={{ 
            animationDelay: `${i * 0.1}s`,
            height: isActive ? '100%' : '10%'
          }}
        />
      ))}
    </div>
  );
};
