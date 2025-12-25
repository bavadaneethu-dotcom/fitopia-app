
import React, { useState } from 'react';
import { Screen, UserStats } from '../types';

interface Dimensions {
  waist: string;
  chest: string;
  arms: string;
  thighs: string;
  unit: 'cm' | 'in';
}

interface WeightLog {
  id: string;
  date: string;
  value: string;
  unit: 'kg' | 'lbs';
  dimensions: Dimensions;
}

interface BiometricsProps {
  onNavigate: (screen: Screen) => void;
  unitSystem: 'metric' | 'imperial';
  // Fix: Added missing props to match App.tsx requirements
  userStats: UserStats;
  setUserStats: (stats: UserStats) => void;
}

const Biometrics: React.FC<BiometricsProps> = ({ onNavigate, unitSystem, userStats, setUserStats }) => {
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(unitSystem === 'metric' ? 'kg' : 'lbs');
  const [lengthUnit, setLengthUnit] = useState<'cm' | 'in'>(unitSystem === 'metric' ? 'cm' : 'in');
  const [weight, setWeight] = useState('75');
  const [measurements, setMeasurements] = useState({
    waist: unitSystem === 'metric' ? '81' : '32',
    chest: unitSystem === 'metric' ? '101' : '40',
    arms: unitSystem === 'metric' ? '35' : '14',
    thighs: unitSystem === 'metric' ? '56' : '22',
  });
  
  const [weightHistory, setWeightHistory] = useState<WeightLog[]>([]);
  const [isEditingMeasures, setIsEditingMeasures] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');
  const [editingLog, setEditingLog] = useState<WeightLog | null>(null);

  const handleSync = () => {
      setSaveStatus('saving');
      const today = new Date().toISOString().split('T')[0];
      
      const newLog: WeightLog = { 
          id: Date.now().toString(), 
          date: today, 
          value: weight, 
          unit: weightUnit,
          dimensions: {
              ...measurements,
              unit: lengthUnit
          }
      };
      
      setTimeout(() => { 
        setWeightHistory(prev => [newLog, ...prev]);
        setSaveStatus('success'); 
        setIsEditingMeasures(false); 
        setTimeout(() => setSaveStatus('idle'), 2000); 
      }, 1200);
  };

  const handleUpdateLog = (updatedLog: WeightLog) => {
      setWeightHistory(prev => prev.map(log => log.id === updatedLog.id ? updatedLog : log));
      setEditingLog(null);
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-gray-50 dark:bg-dark-bg font-sans transition-colors duration-300">
      
      {/* Uniform Header */}
      <div className="flex items-center px-8 pt-10 pb-4 justify-between z-20 sticky top-0 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
        <div className="flex flex-col">
            <h2 className="text-2xl font-black leading-none text-gray-800 dark:text-white uppercase tracking-tighter italic transform -skew-x-6">BIOMETRICS</h2>
            <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mt-1">Medical Bay Uplink</span>
        </div>
        <button 
          onClick={() => onNavigate(Screen.HOME)}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-all active:scale-90 shadow-sm border border-white dark:border-white/5"
        >
          <span className="material-symbols-outlined text-gray-600 dark:text-white text-2xl font-bold">close</span>
        </button>
      </div>

      <div className="flex-1 px-6 pt-6 pb-40 flex flex-col gap-8 overflow-y-auto no-scrollbar">
          
          <div className="bg-white/60 dark:bg-dark-surface/60 backdrop-blur-md rounded-[2.5rem] p-1 shadow-lg border border-white/60 dark:border-white/5">
              <div className="flex justify-between items-center px-6 py-4 bg-gray-100/50 dark:bg-white/5 rounded-t-[2.2rem]">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Body Mass Indexing</h3>
                  <div className="flex bg-white dark:bg-black/40 rounded-xl p-1 shadow-inner border border-gray-200/50 dark:border-white/5">
                      {['kg','lbs'].map(u => (
                        <button 
                            key={u} 
                            onClick={() => setWeightUnit(u as any)} 
                            className={`px-4 py-1.5 rounded-lg text-[9px] font-black transition-all ${weightUnit === u ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white shadow-sm' : 'text-gray-400'}`}
                        >
                            {u.toUpperCase()}
                        </button>
                      ))}
                  </div>
              </div>
              <div className="p-8 flex items-center justify-center">
                  <div className="flex items-baseline gap-2">
                    <input 
                        type="number"
                        value={weight} 
                        onChange={e => setWeight(e.target.value)} 
                        className="text-6xl font-black bg-transparent border-b-2 border-transparent focus:border-blue-500 w-40 outline-none text-gray-800 dark:text-white text-center" 
                    />
                    <span className="text-xl font-black text-gray-300 uppercase tracking-widest">{weightUnit}</span>
                  </div>
              </div>
          </div>

          <div className="bg-white/60 dark:bg-dark-surface/60 backdrop-blur-md rounded-[2.5rem] p-1 shadow-lg border border-white/60 dark:border-white/5">
              <div className="flex justify-between items-center px-6 py-4 bg-gray-100/50 dark:bg-white/5 rounded-t-[2.2rem]">
                  <div className="flex items-center gap-2">
                      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Physical Dimensions</h3>
                  </div>
                  <div className="flex bg-white dark:bg-black/40 rounded-xl p-1 shadow-inner border border-gray-200/50 dark:border-white/5">
                      {['cm','in'].map(u => (
                        <button 
                            key={u} 
                            onClick={() => setLengthUnit(u as any)} 
                            className={`px-4 py-1.5 rounded-lg text-[9px] font-black transition-all ${lengthUnit === u ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white shadow-sm' : 'text-gray-400'}`}
                        >
                            {u.toUpperCase()}
                        </button>
                      ))}
                  </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                    {Object.entries(measurements).map(([key, value]) => (
                        <div key={key} className="bg-white dark:bg-black/20 p-5 rounded-[1.8rem] border border-gray-100 dark:border-white/5 relative group shadow-sm">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">{key}</span>
                            <div className="flex items-baseline gap-1">
                                <input 
                                    value={value} 
                                    onChange={e => setMeasurements({...measurements, [key]: e.target.value})} 
                                    className="w-full text-2xl font-black bg-transparent outline-none p-0 border-b-2 border-transparent focus:border-blue-400 text-gray-800 dark:text-white" 
                                />
                                <span className="text-[10px] font-bold text-gray-400 uppercase">{lengthUnit}</span>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
          </div>

          <div className="flex flex-col gap-4 mb-10">
              <div className="flex items-center gap-3 px-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Patrol History</span>
                  <div className="h-px bg-gray-200 dark:bg-white/5 flex-1"></div>
              </div>
              <div className="flex flex-col gap-3">
                  {weightHistory.map((log) => (
                      <div key={log.id} className="bg-white/60 dark:bg-dark-surface/60 backdrop-blur-md p-4 rounded-2xl border border-white/60 dark:border-white/5 shadow-sm flex items-center justify-between animate-fade-in-up">
                          <div className="flex items-center gap-4">
                              <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                                  <span className="material-symbols-outlined text-xl">history</span>
                              </div>
                              <div>
                                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">{new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                  <div className="flex items-baseline gap-1">
                                      <span className="text-xl font-black text-gray-800 dark:text-white">{log.value}</span>
                                      <span className="text-[10px] font-bold text-gray-400 uppercase">{log.unit}</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* Uniform Rectangular Sync Button anchored near content scroll end */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-30 bg-gradient-to-t from-gray-50 dark:from-dark-bg to-transparent">
          <div className="max-w-md mx-auto w-full">
              <button 
                onClick={handleSync} 
                disabled={saveStatus === 'saving'}
                className={`w-full h-16 rounded-[1.8rem] font-black uppercase tracking-[0.15em] shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] group relative overflow-hidden ${
                    saveStatus === 'success' ? 'bg-green-500 text-white' : 
                    saveStatus === 'saving' ? 'bg-blue-400 text-white' :
                    'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
                }`}
              >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine"></div>
                  <span className={`material-symbols-outlined filled ${saveStatus === 'saving' ? 'animate-spin' : ''}`}>
                      {saveStatus === 'success' ? 'verified' : 'sync'}
                  </span>
                  {saveStatus === 'saving' ? 'UPLOADING...' : saveStatus === 'success' ? 'SYNC COMPLETE' : 'SYNC WITH DATABASE'}
              </button>
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

export default Biometrics;
