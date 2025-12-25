
import React, { useState } from 'react';
import { Screen } from '../types';

interface SettingsUnitsProps {
  onNavigate: (screen: Screen) => void;
  currentSystem: 'metric' | 'imperial';
  onApply: (system: 'metric' | 'imperial') => void;
}

const SettingsUnits: React.FC<SettingsUnitsProps> = ({ onNavigate, currentSystem, onApply }) => {
  const [selectedSystem, setSelectedSystem] = useState<'metric' | 'imperial'>(currentSystem);

  const handleApply = () => {
      onApply(selectedSystem);
      onNavigate(Screen.SETTINGS);
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-light-bg dark:bg-dark-bg animate-fade-in font-sans">
      {/* Header */}
      <div className="flex items-center px-6 pt-6 pb-2 justify-between z-20 sticky top-0 bg-light-bg/90 dark:bg-dark-bg/90 backdrop-blur-sm">
        <div className="size-12"></div>
        <h2 className="text-lg font-black leading-tight text-light-text dark:text-white uppercase tracking-tight">Units</h2>
        <button 
          onClick={() => onNavigate(Screen.SETTINGS)}
          className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors active:scale-90"
        >
          <span className="material-symbols-outlined text-light-text dark:text-white text-2xl">close</span>
        </button>
      </div>

      <div className="flex-1 px-6 pt-4 flex flex-col gap-6">
          <p className="text-light-muted dark:text-dark-muted text-sm font-medium text-center">
              Choose your preferred system of measurement for weight, height, and distance.
          </p>

          <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => setSelectedSystem('metric')}
                className={`relative overflow-hidden p-6 rounded-[2rem] border-2 transition-all duration-300 group ${selectedSystem === 'metric' ? 'bg-light-primary/10 dark:bg-dark-primary/10 border-light-primary dark:border-dark-primary' : 'bg-light-surface dark:bg-dark-surface border-transparent hover:border-gray-200 dark:hover:border-white/10'}`}
              >
                  <div className="flex justify-between items-center mb-4 relative z-10">
                      <div className="flex items-center gap-3">
                          <div className={`size-12 rounded-full flex items-center justify-center text-2xl shadow-sm ${selectedSystem === 'metric' ? 'bg-light-primary dark:bg-dark-primary text-white dark:text-dark-bg' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                              <span className="material-symbols-outlined">straighten</span>
                          </div>
                          <div className="text-left">
                              <h3 className="text-lg font-black text-light-text dark:text-white uppercase">Metric</h3>
                              <p className="text-xs font-bold text-light-muted dark:text-dark-muted">kg, cm, km, ml</p>
                          </div>
                      </div>
                      <div className={`size-6 rounded-full border-2 flex items-center justify-center ${selectedSystem === 'metric' ? 'border-light-primary dark:border-dark-primary bg-light-primary dark:bg-dark-primary' : 'border-gray-300 dark:border-gray-600'}`}>
                          {selectedSystem === 'metric' && <span className="material-symbols-outlined text-white dark:text-dark-bg text-sm font-bold">check</span>}
                      </div>
                  </div>
                  
                  {/* Animation Visualization */}
                  <div className={`h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${selectedSystem === 'metric' ? 'opacity-100' : 'opacity-30'}`}>
                      <div className="h-full w-full bg-gradient-to-r from-transparent via-light-primary dark:via-dark-primary to-transparent animate-shimmer" style={{ backgroundSize: '50% 100%' }}></div>
                  </div>
                  <div className="flex justify-between mt-1 text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                      <span>0</span>
                      <span>50</span>
                      <span>100</span>
                  </div>
              </button>

              <button 
                onClick={() => setSelectedSystem('imperial')}
                className={`relative overflow-hidden p-6 rounded-[2rem] border-2 transition-all duration-300 group ${selectedSystem === 'imperial' ? 'bg-light-primary/10 dark:bg-dark-primary/10 border-light-primary dark:border-dark-primary' : 'bg-light-surface dark:bg-dark-surface border-transparent hover:border-gray-200 dark:hover:border-white/10'}`}
              >
                  <div className="flex justify-between items-center mb-4 relative z-10">
                      <div className="flex items-center gap-3">
                          <div className={`size-12 rounded-full flex items-center justify-center text-2xl shadow-sm ${selectedSystem === 'imperial' ? 'bg-light-primary dark:bg-dark-primary text-white dark:text-dark-bg' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                              <span className="material-symbols-outlined">scale</span>
                          </div>
                          <div className="text-left">
                              <h3 className="text-lg font-black text-light-text dark:text-white uppercase">Imperial</h3>
                              <p className="text-xs font-bold text-light-muted dark:text-dark-muted">lbs, ft, mi, oz</p>
                          </div>
                      </div>
                      <div className={`size-6 rounded-full border-2 flex items-center justify-center ${selectedSystem === 'imperial' ? 'border-light-primary dark:border-dark-primary bg-light-primary dark:bg-dark-primary' : 'border-gray-300 dark:border-gray-600'}`}>
                          {selectedSystem === 'imperial' && <span className="material-symbols-outlined text-white dark:text-dark-bg text-sm font-bold">check</span>}
                      </div>
                  </div>

                   {/* Animation Visualization */}
                   <div className={`h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${selectedSystem === 'imperial' ? 'opacity-100' : 'opacity-30'}`}>
                      <div className="h-full w-full bg-gradient-to-r from-transparent via-light-primary dark:via-dark-primary to-transparent animate-shimmer" style={{ backgroundSize: '20% 100%', animationDuration: '3s' }}></div>
                  </div>
                  <div className="flex justify-between mt-1 text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                      <span>0</span>
                      <span>12</span>
                      <span>24</span>
                  </div>
              </button>
          </div>

          <div className="mt-auto pb-10">
              <button 
                onClick={handleApply}
                className="w-full bg-light-primary dark:bg-dark-primary text-white dark:text-dark-bg font-black uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-light-primary/30 dark:shadow-dark-primary/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                  Apply Changes
              </button>
          </div>
      </div>
      <style>{`
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
        }
        .animate-shimmer {
            animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default SettingsUnits;
