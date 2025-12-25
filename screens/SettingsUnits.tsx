
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
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-white dark:bg-dark-bg animate-fade-in font-sans transition-colors duration-300">
      
      {/* Header with Title and Close Button in Top Right */}
      <div className="flex items-center px-8 pt-10 pb-4 justify-between z-20 sticky top-0 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-md">
        <div className="flex flex-col">
            <h2 className="text-2xl font-black leading-none text-gray-800 dark:text-white uppercase tracking-tighter italic transform -skew-x-6">UNITS</h2>
            <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mt-1">Calibration</span>
        </div>
        <button 
          onClick={() => onNavigate(Screen.SETTINGS)}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-all active:scale-90 shadow-sm border border-white dark:border-white/5"
        >
          <span className="material-symbols-outlined text-gray-600 dark:text-white text-2xl font-bold">close</span>
        </button>
      </div>

      <div className="flex-1 px-6 pt-6 flex flex-col gap-6 overflow-y-auto no-scrollbar">
          {/* Background Decoration */}
          <div className="absolute top-1/4 right-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none scale-150">
              <span className="material-symbols-outlined text-[300px]">straighten</span>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-[2rem] border-2 border-dashed border-blue-200 dark:border-blue-800/40 relative overflow-hidden mb-2">
              <p className="text-xs font-bold text-blue-700 dark:text-blue-300 leading-relaxed italic text-center relative z-10">
                  "Precision is the difference between a clean chase and a pile-up in Sahara Square. Choose your system, Cadet."
              </p>
          </div>

          {/* Unit Selection Grid */}
          <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => setSelectedSystem('metric')}
                className={`relative overflow-hidden p-6 rounded-[2rem] border-2 transition-all duration-300 group ${
                    selectedSystem === 'metric' 
                    ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-400 shadow-xl' 
                    : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/5 hover:border-gray-300'
                }`}
              >
                  <div className="flex justify-between items-center mb-6 relative z-10">
                      <div className="flex items-center gap-4">
                          <div className={`size-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner transition-colors ${selectedSystem === 'metric' ? 'bg-yellow-400 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                              <span className="material-symbols-outlined filled">straighten</span>
                          </div>
                          <div className="text-left">
                              <h3 className={`text-xl font-black uppercase tracking-tight ${selectedSystem === 'metric' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>METRIC SYSTEM</h3>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Standard ZPD Protocol</p>
                          </div>
                      </div>
                      <div className={`size-8 rounded-full border-2 flex items-center justify-center transition-all ${selectedSystem === 'metric' ? 'border-yellow-500 bg-yellow-400' : 'border-gray-200 dark:border-gray-700'}`}>
                          {selectedSystem === 'metric' && <span className="material-symbols-outlined text-black text-lg font-black">check</span>}
                      </div>
                  </div>
                  
                  <div className="flex gap-2 relative z-10">
                      {['KG', 'CM', 'KM', 'ML'].map(u => (
                          <span key={u} className={`px-3 py-1 rounded-lg text-[9px] font-black border transition-colors ${selectedSystem === 'metric' ? 'bg-white dark:bg-black/20 border-yellow-200 text-yellow-700 dark:text-yellow-400' : 'bg-gray-50 dark:bg-white/5 border-gray-100 text-gray-400'}`}>
                              {u}
                          </span>
                      ))}
                  </div>
              </button>

              <button 
                onClick={() => setSelectedSystem('imperial')}
                className={`relative overflow-hidden p-6 rounded-[2rem] border-2 transition-all duration-300 group ${
                    selectedSystem === 'imperial' 
                    ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-400 shadow-xl' 
                    : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/5 hover:border-gray-300'
                }`}
              >
                  <div className="flex justify-between items-center mb-6 relative z-10">
                      <div className="flex items-center gap-4">
                          <div className={`size-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner transition-colors ${selectedSystem === 'imperial' ? 'bg-yellow-400 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                              <span className="material-symbols-outlined filled">straighten</span>
                          </div>
                          <div className="text-left">
                              <h3 className={`text-xl font-black uppercase tracking-tight ${selectedSystem === 'imperial' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>IMPERIAL SYSTEM</h3>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Regional Sahara Protocol</p>
                          </div>
                      </div>
                      <div className={`size-8 rounded-full border-2 flex items-center justify-center transition-all ${selectedSystem === 'imperial' ? 'border-yellow-500 bg-yellow-400' : 'border-gray-200 dark:border-gray-700'}`}>
                          {selectedSystem === 'imperial' && <span className="material-symbols-outlined text-black text-lg font-black">check</span>}
                      </div>
                  </div>
                  
                  <div className="flex gap-2 relative z-10">
                      {['LBS', 'IN', 'MI', 'OZ'].map(u => (
                          <span key={u} className={`px-3 py-1 rounded-lg text-[9px] font-black border transition-colors ${selectedSystem === 'imperial' ? 'bg-white dark:bg-black/20 border-yellow-200 text-yellow-700 dark:text-yellow-400' : 'bg-gray-50 dark:bg-white/5 border-gray-100 text-gray-400'}`}>
                              {u}
                          </span>
                      ))}
                  </div>
              </button>
          </div>

          {/* Apply Button placed NEAR units instead of bottom of page */}
          <div className="flex flex-col gap-4 mt-2 mb-12">
              <button 
                onClick={handleApply}
                className="w-full py-5 rounded-[1.8rem] bg-blue-600 text-white font-black uppercase tracking-[0.15em] shadow-xl hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group relative overflow-hidden"
              >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shine"></div>
                  <span className="material-symbols-outlined filled text-xl">verified</span>
                  Apply System Change
              </button>
              <p className="text-center text-[8px] font-black text-gray-400 uppercase tracking-widest">Calibration required for field readiness</p>
          </div>
      </div>
      <style>{`
        @keyframes shine {
            0% { transform: translateX(-200%) skewX(-12deg); }
            20%, 100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shine {
            animation: shine 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default SettingsUnits;
