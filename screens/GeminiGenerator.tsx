
import React from 'react';
import { Screen, Character } from '../types';

interface GeminiGeneratorProps {
  onNavigate: (screen: Screen) => void;
  activeCharacter: Character;
}

const GeminiGenerator: React.FC<GeminiGeneratorProps> = ({ onNavigate }) => {

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-dark-bg font-sans animate-fade-in">
      <header className="flex items-center justify-between px-6 pt-12 pb-4 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-xl border-b dark:border-white/10 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
            <span className="material-symbols-outlined">auto_awesome</span>
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-800 dark:text-white uppercase leading-none tracking-tighter italic">Avatar Lab</h1>
            <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Coming Soon</p>
          </div>
        </div>
        <button onClick={() => onNavigate(Screen.HOME)} className="size-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-gray-500">close</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 flex items-center justify-center">
        <div className="text-center max-w-md space-y-6">
          <div className="w-full aspect-square rounded-[3rem] bg-white dark:bg-white/5 border-4 border-white dark:border-white/10 shadow-2xl overflow-hidden relative flex items-center justify-center">
            <div className="text-center p-10 opacity-30 flex flex-col items-center gap-4">
              <span className="material-symbols-outlined text-6xl">person_search</span>
              <p className="text-xs font-black uppercase tracking-widest">Character Image Generation</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-white/5 rounded-3xl p-6 space-y-4">
            <h2 className="text-lg font-black text-gray-800 dark:text-white uppercase tracking-tight">
              Feature Disabled
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Character image generation is currently disabled. This feature will be available after integrating with ChatGPT API.
            </p>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              To enable: Integrate ChatGPT API for image generation
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GeminiGenerator;
