
import React, { useState, useEffect } from 'react';
import { Screen, WeightLog, Dimensions } from '../types';

interface BiometricsProps {
  onNavigate: (screen: Screen) => void;
  unitSystem: 'metric' | 'imperial';
  weightLogs: WeightLog[];
  setWeightLogs: React.Dispatch<React.SetStateAction<WeightLog[]>>;
}

const Biometrics: React.FC<BiometricsProps> = ({ onNavigate, unitSystem, weightLogs, setWeightLogs }) => {
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(unitSystem === 'metric' ? 'kg' : 'lbs');
  const [lengthUnit, setLengthUnit] = useState<'cm' | 'in'>(unitSystem === 'metric' ? 'cm' : 'in');
  const [weight, setWeight] = useState('75');
  const [measurements, setMeasurements] = useState({
    waist: unitSystem === 'metric' ? '81' : '32',
    chest: unitSystem === 'metric' ? '101' : '40',
    arms: unitSystem === 'metric' ? '35' : '14',
    thighs: unitSystem === 'metric' ? '56' : '22',
  });
  
  const [isEditingMeasures, setIsEditingMeasures] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');
  const [editingLog, setEditingLog] = useState<WeightLog | null>(null);

  // Conversion logic for Weight
  const handleWeightUnitChange = (newUnit: 'kg' | 'lbs') => {
      if (newUnit === weightUnit) return;
      
      const currentVal = parseFloat(weight);
      if (isNaN(currentVal)) {
          setWeightUnit(newUnit);
          return;
      }

      let converted;
      if (newUnit === 'lbs') {
          converted = currentVal * 2.20462;
      } else {
          converted = currentVal / 2.20462;
      }
      
      setWeight(converted.toFixed(1));
      setWeightUnit(newUnit);
  };

  // Conversion logic for Measurements
  const handleLengthUnitChange = (newUnit: 'cm' | 'in') => {
      if (newUnit === lengthUnit) return;

      const newMeasures = { ...measurements };
      const ratio = newUnit === 'in' ? 0.393701 : 2.54;

      Object.keys(newMeasures).forEach((key) => {
          const k = key as keyof typeof measurements;
          const val = parseFloat(newMeasures[k]);
          if (!isNaN(val)) {
              newMeasures[k] = (val * ratio).toFixed(1);
          }
      });

      setMeasurements(newMeasures);
      setLengthUnit(newUnit);
  };

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
        setWeightLogs(prev => [newLog, ...prev]);
        setSaveStatus('success'); 
        setIsEditingMeasures(false); 
        setTimeout(() => setSaveStatus('idle'), 2000); 
      }, 1200);
  };

  const handleUpdateLog = (updatedLog: WeightLog) => {
      setWeightLogs(prev => prev.map(log => log.id === updatedLog.id ? updatedLog : log));
      setEditingLog(null);
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-gray-50 dark:bg-dark-bg font-sans">
      <div className="flex flex-col items-center px-6 pt-10 pb-6 relative z-20 bg-white dark:bg-dark-surface border-b border-gray-100 dark:border-white/5">
        <button 
          onClick={() => onNavigate(Screen.HOME)} 
          className="absolute top-10 right-6 size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center justify-center text-gray-800 dark:text-white"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
        
        <div className="flex flex-col items-center gap-1">
            <div className="size-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-1">
                <span className="material-symbols-outlined text-red-500 filled text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
            </div>
            <h2 className="text-lg font-black uppercase text-gray-800 dark:text-white tracking-tight">Medical Bay</h2>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">ZPD Health Record</span>
        </div>
      </div>

      <div className="flex-1 px-6 pt-8 pb-32 flex flex-col gap-8 overflow-y-auto no-scrollbar">
          
          <div className="bg-white/60 dark:bg-dark-surface/60 backdrop-blur-md rounded-[2.5rem] p-1 shadow-lg border border-white/60 dark:border-white/5">
              <div className="flex justify-between items-center px-6 py-4 bg-gray-100/50 dark:bg-white/5 rounded-t-[2.2rem]">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Body Mass Indexing</h3>
                  <div className="flex bg-white dark:bg-black/40 rounded-xl p-1 shadow-inner border border-gray-200/50 dark:border-white/5">
                      {(['kg','lbs'] as const).map(u => (
                        <button 
                            key={u} 
                            onClick={() => handleWeightUnitChange(u)} 
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
                        className="text-6xl font-black bg-transparent border-b-2 border-transparent focus:border-blue-500 w-48 outline-none text-gray-800 dark:text-white text-center" 
                    />
                    <span className="text-xl font-black text-gray-300 uppercase tracking-widest">{weightUnit}</span>
                  </div>
              </div>
          </div>

          <div className="bg-white/60 dark:bg-dark-surface/60 backdrop-blur-md rounded-[2.5rem] p-1 shadow-lg border border-white/60 dark:border-white/5">
              <div className="flex justify-between items-center px-6 py-4 bg-gray-100/50 dark:bg-white/5 rounded-t-[2.2rem]">
                  <div className="flex items-center gap-2">
                      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Physical Dimensions</h3>
                      <button onClick={() => setIsEditingMeasures(!isEditingMeasures)} className="text-gray-300 hover:text-blue-500 transition-colors">
                          <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                  </div>
                  <div className="flex bg-white dark:bg-black/40 rounded-xl p-1 shadow-inner border border-gray-200/50 dark:border-white/5">
                      {(['cm','in'] as const).map(u => (
                        <button 
                            key={u} 
                            onClick={() => handleLengthUnitChange(u)} 
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
                                {isEditingMeasures ? (
                                    <input 
                                        value={value} 
                                        onChange={e => setMeasurements({...measurements, [key]: e.target.value})} 
                                        className="w-full text-2xl font-black bg-transparent outline-none p-0 border-b-2 border-blue-400 text-gray-800 dark:text-white" 
                                    />
                                ) : (
                                    <span className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">{value}</span>
                                )}
                                <span className="text-[10px] font-bold text-gray-400 uppercase">{lengthUnit}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={() => setIsEditingMeasures(!isEditingMeasures)} 
                    className="w-full mt-6 py-4 rounded-2xl bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest text-[10px] shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-white/10 active:scale-[0.98]"
                >
                    {isEditingMeasures ? 'Verify Measurements' : 'Update Measurement Record'}
                </button>
              </div>
          </div>

          <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 px-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Patrol Weight Logs</span>
                  <div className="h-px bg-gray-200 dark:bg-white/5 flex-1"></div>
              </div>
              
              <div className="flex flex-col gap-3">
                  {weightLogs.length === 0 ? (
                      <div className="py-12 flex flex-col items-center justify-center gap-2 opacity-30">
                          <span className="material-symbols-outlined text-4xl">history</span>
                          <p className="text-[10px] font-bold uppercase tracking-widest">No patrol logs found</p>
                      </div>
                  ) : (
                      weightLogs.map((log) => (
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
                              <button 
                                onClick={() => setEditingLog(log)}
                                className="size-8 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors"
                              >
                                  <span className="material-symbols-outlined text-sm">edit</span>
                              </button>
                          </div>
                      ))
                  )}
              </div>
          </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 z-30 bg-gradient-to-t from-gray-50 dark:from-dark-bg to-transparent">
          <div className="max-w-md mx-auto w-full">
              <button 
                onClick={handleSync} 
                disabled={saveStatus === 'saving'}
                className={`w-full py-5 rounded-[1.8rem] font-black uppercase tracking-[0.15em] shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
                    saveStatus === 'success' ? 'bg-green-500 text-white' : 
                    saveStatus === 'saving' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-[#FACC15] hover:bg-yellow-300 text-black shadow-yellow-400/20'
                }`}
              >
                  <span className={`material-symbols-outlined filled ${saveStatus === 'saving' ? 'animate-spin' : ''}`}>
                      {saveStatus === 'success' ? 'verified' : 'sync_saved_locally'}
                  </span>
                  {saveStatus === 'saving' ? 'UPLOADING...' : saveStatus === 'success' ? 'SYNC COMPLETE' : 'Sync with Database'}
              </button>
          </div>
      </div>

      {editingLog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-fade-in" onClick={() => setEditingLog(null)}>
            <div className="bg-white dark:bg-dark-surface w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative border-2 border-blue-400 animate-pop-in" onClick={e => e.stopPropagation()}>
                <button onClick={() => setEditingLog(null)} className="absolute top-6 right-6 size-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                    <span className="material-symbols-outlined">close</span>
                </button>
                
                <div className="text-center mb-8">
                    <h3 className="text-xl font-black uppercase text-gray-800 dark:text-white tracking-tight">Edit Patrol Log</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                        {new Date(editingLog.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mass Record ({editingLog.unit})</label>
                        <input 
                            type="number" 
                            value={editingLog.value} 
                            onChange={e => setEditingLog({...editingLog, value: e.target.value})}
                            className="w-full h-14 px-6 bg-gray-50 dark:bg-black/20 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none font-bold text-xl text-gray-800 dark:text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Physical Dimensions ({editingLog.dimensions.unit})</label>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.entries(editingLog.dimensions).map(([key, val]) => {
                                if (key === 'unit') return null;
                                return (
                                    <div key={key} className="space-y-1">
                                        <span className="text-[8px] font-bold text-gray-400 uppercase ml-1">{key}</span>
                                        <input 
                                            type="number"
                                            value={val as string}
                                            onChange={e => setEditingLog({
                                                ...editingLog, 
                                                dimensions: { ...editingLog.dimensions, [key]: e.target.value }
                                            })}
                                            className="w-full h-10 px-3 bg-gray-50 dark:bg-black/20 rounded-xl border border-transparent focus:border-blue-400 outline-none font-bold text-sm text-gray-800 dark:text-white"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex gap-3">
                    <button 
                        onClick={() => setEditingLog(null)}
                        className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600"
                    >
                        Discard
                    </button>
                    <button 
                        onClick={() => handleUpdateLog(editingLog)}
                        className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg active:scale-95 transition-all"
                    >
                        Save Entry
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Biometrics;
