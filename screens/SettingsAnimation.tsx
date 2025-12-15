
import React, { useState } from 'react';
import { Screen } from '../types';

interface SettingsAnimationProps {
  onNavigate: (screen: Screen) => void;
}

const SettingsAnimation: React.FC<SettingsAnimationProps> = ({ onNavigate }) => {
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('high');

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
        <h2 className="text-lg font-black leading-tight text-light-text dark:text-white uppercase tracking-tight">Graphics</h2>
        <div className="size-12"></div>
      </div>

      <div className="flex-1 px-6 pt-4 flex flex-col gap-6">
          
          {/* Preview Area */}
          <div className="w-full aspect-square rounded-[2rem] bg-gray-900 overflow-hidden relative shadow-inner border-4 border-light-bg dark:border-dark-surface">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-20"></div>
              
              {/* Animated Particles based on Quality */}
              <div className="absolute inset-0 flex items-center justify-center">
                  {[...Array(quality === 'high' ? 12 : quality === 'medium' ? 5 : 1)].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute rounded-full bg-white blur-xl animate-float opacity-60 mix-blend-screen"
                        style={{
                            width: `${Math.random() * 50 + 20}px`,
                            height: `${Math.random() * 50 + 20}px`,
                            left: `${Math.random() * 80 + 10}%`,
                            top: `${Math.random() * 80 + 10}%`,
                            animationDuration: `${Math.random() * 5 + 3}s`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                      ></div>
                  ))}
                  <span className={`text-6xl animate-bounce transition-all duration-500 ${quality === 'low' ? 'grayscale opacity-50' : 'grayscale-0 opacity-100'}`}>🦊</span>
              </div>
              
              <div className="absolute bottom-4 left-4 right-4 text-center">
                  <span className="text-white/50 text-[10px] font-mono uppercase tracking-widest">Render Preview</span>
              </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
              {[
                  { id: 'low', label: 'Battery Saver', icon: 'battery_saver', desc: 'Minimal animations. Max battery life.' },
                  { id: 'medium', label: 'Balanced', icon: 'speed', desc: 'Smooth performance for most devices.' },
                  { id: 'high', label: 'High Quality', icon: 'motion_photos_on', desc: 'Full effects, blurs, and particles.' }
              ].map((opt) => (
                  <button 
                    key={opt.id}
                    onClick={() => setQuality(opt.id as any)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all active:scale-95 text-left ${quality === opt.id ? 'bg-light-primary/10 dark:bg-dark-primary/10 border-light-primary dark:border-dark-primary' : 'bg-light-surface dark:bg-dark-surface border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`}
                  >
                      <div className={`size-10 rounded-full flex items-center justify-center ${quality === opt.id ? 'bg-light-primary dark:bg-dark-primary text-white dark:text-dark-bg' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                          <span className="material-symbols-outlined">{opt.icon}</span>
                      </div>
                      <div className="flex-1">
                          <h3 className="text-sm font-bold text-light-text dark:text-white uppercase tracking-wide">{opt.label}</h3>
                          <p className="text-[10px] font-medium text-light-muted dark:text-dark-muted mt-0.5">{opt.desc}</p>
                      </div>
                      <div className={`size-5 rounded-full border-2 flex items-center justify-center ${quality === opt.id ? 'border-light-primary dark:border-dark-primary bg-light-primary dark:bg-dark-primary' : 'border-gray-300 dark:border-gray-600'}`}>
                          {quality === opt.id && <span className="size-2 bg-white dark:bg-dark-bg rounded-full"></span>}
                      </div>
                  </button>
              ))}
          </div>
      </div>
    </div>
  );
};

export default SettingsAnimation;
