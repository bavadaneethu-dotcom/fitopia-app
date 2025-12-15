
import React, { useState } from 'react';
import { Screen } from '../types';

interface SettingsAppsProps {
  onNavigate: (screen: Screen) => void;
}

const SettingsApps: React.FC<SettingsAppsProps> = ({ onNavigate }) => {
  const [connected, setConnected] = useState({ google: true, apple: false, strava: false });

  const toggleApp = (key: keyof typeof connected) => {
      setConnected(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-light-bg dark:bg-dark-bg animate-fade-in font-sans">
      {/* Header */}
      <div className="flex items-center px-6 pt-6 pb-2 justify-between z-20 sticky top-0 bg-light-bg/90 dark:bg-dark-bg/90 backdrop-blur-sm">
        <button 
          onClick={() => onNavigate(Screen.SETTINGS)}
          className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors active:scale-90"
        >
          <span className="material-symbols-outlined text-light-text dark:text-white text-2xl">arrow_back</span>
        </button>
        <h2 className="text-lg font-black leading-tight text-light-text dark:text-white uppercase tracking-tight">Integrations</h2>
        <div className="size-12"></div>
      </div>

      {/* Connection Graph Visualization */}
      <div className="relative h-64 w-full bg-light-surface dark:bg-dark-surface overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
          
          {/* Central Hub */}
          <div className="relative z-10 size-20 rounded-full bg-light-primary dark:bg-dark-primary flex items-center justify-center shadow-xl border-4 border-light-bg dark:border-dark-bg animate-pulse-slow">
              <span className="material-symbols-outlined text-4xl text-light-text dark:text-dark-bg filled" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
          </div>

          {/* Orbiting Nodes */}
          {Object.entries(connected).map(([key, isActive], idx) => (
              isActive && (
                  <div key={key} className={`absolute size-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-md border-2 border-gray-100 dark:border-gray-700 animate-float`} 
                       style={{ 
                           animationDelay: `${idx * 0.5}s`,
                           transform: `rotate(${idx * 120}deg) translate(100px) rotate(-${idx * 120}deg)`
                       }}>
                      <span className="material-symbols-outlined text-xl text-gray-600 dark:text-gray-300">
                          {key === 'google' ? 'fitness_center' : key === 'apple' ? 'health_and_safety' : 'directions_bike'}
                      </span>
                      {/* Connection Line */}
                      <div className="absolute top-1/2 left-1/2 w-[100px] h-[2px] bg-light-primary/30 dark:bg-dark-primary/30 -z-10 origin-left" 
                           style={{ transform: `rotate(${idx * 120 + 180}deg)` }}></div>
                  </div>
              )
          ))}
      </div>

      <div className="flex-1 px-6 pt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-4">
              <AppToggle 
                label="Google Fit" 
                icon="fitness_center" 
                isConnected={connected.google} 
                onToggle={() => toggleApp('google')} 
              />
              <AppToggle 
                label="Apple Health" 
                icon="health_and_safety" 
                isConnected={connected.apple} 
                onToggle={() => toggleApp('apple')} 
              />
              <AppToggle 
                label="Strava" 
                icon="directions_bike" 
                isConnected={connected.strava} 
                onToggle={() => toggleApp('strava')} 
              />
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex gap-3 items-start mt-4">
              <span className="material-symbols-outlined text-blue-500">info</span>
              <p className="text-xs text-blue-800 dark:text-blue-200 font-medium leading-relaxed">
                  Connecting apps allows Fitopia to sync your steps, heart rate, and workouts automatically.
              </p>
          </div>
      </div>
    </div>
  );
};

const AppToggle: React.FC<{ label: string; icon: string; isConnected: boolean; onToggle: () => void }> = ({ label, icon, isConnected, onToggle }) => (
    <div className="flex items-center justify-between p-4 bg-light-surface dark:bg-dark-surface rounded-2xl border border-light-primary/10 dark:border-dark-primary/10 shadow-sm">
        <div className="flex items-center gap-3">
            <div className={`size-10 rounded-full flex items-center justify-center ${isConnected ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'}`}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <div>
                <h3 className="text-sm font-bold text-light-text dark:text-white">{label}</h3>
                <p className="text-[10px] font-medium text-light-muted dark:text-dark-muted">{isConnected ? 'Syncing Data' : 'Not Connected'}</p>
            </div>
        </div>
        <button 
            onClick={onToggle}
            className={`w-12 h-7 rounded-full relative transition-colors duration-300 ${isConnected ? 'bg-light-primary dark:bg-dark-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
        >
            <div className={`absolute top-1 size-5 bg-white rounded-full transition-transform duration-300 shadow-sm ${isConnected ? 'left-6' : 'left-1'}`}></div>
        </button>
    </div>
);

export default SettingsApps;
