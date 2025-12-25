
import React, { useState, useEffect } from 'react';
import { Screen, WaterLogItem } from '../types';

interface WaterLogProps {
  onNavigate: (screen: Screen) => void;
  waterLogs: WaterLogItem[];
  onAddWater: (amount: number) => void;
  onDeleteWater: (id: string) => void;
  onUpdateWater: (item: WaterLogItem) => void;
  unitSystem?: 'metric' | 'imperial';
}

const WaterLog: React.FC<WaterLogProps> = ({ onNavigate, waterLogs, onAddWater, unitSystem = 'metric' }) => {
  const currentWater = waterLogs.reduce((acc, curr) => acc + curr.amount, 0);
  const targetWater = 2500;
  const percentage = Math.min((currentWater / targetWater) * 100, 100);
  const [isPouring, setIsPouring] = useState(false);

  const handleAdd = (amountInUnit: number) => {
    setIsPouring(true);
    const amountMl = unitSystem === 'metric' ? amountInUnit : Math.round(amountInUnit / 0.033814);
    onAddWater(amountMl);
    setTimeout(() => setIsPouring(false), 800);
  };

  const displayVal = unitSystem === 'metric' ? (currentWater/1000).toFixed(1) : Math.round(currentWater * 0.033814);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-teal-50 dark:bg-[#022c22] font-sans">
       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leaves.png')] opacity-10 pointer-events-none"></div>
       
       <header className="flex items-center px-6 pt-12 pb-4 justify-between relative z-20">
          <button onClick={() => onNavigate(Screen.HOME)} className="size-11 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center shadow-sm active:scale-90 transition-transform">
             <span className="material-symbols-outlined text-teal-900">arrow_back</span>
          </button>
          <div className="text-center">
             <p className="text-[10px] font-black text-teal-600 uppercase tracking-[0.3em]">Environment: RainForest</p>
             <h2 className="text-2xl font-black text-teal-900 dark:text-white uppercase tracking-tighter italic transform -skew-x-12">Hydration Unit</h2>
          </div>
          <div className="size-11"></div>
       </header>

       <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8 relative z-10">
          
          {/* THE TANK */}
          <div className={`relative w-64 h-[420px] transition-transform duration-500 ${isPouring ? 'scale-[1.03]' : ''}`}>
             <div className="absolute inset-0 bg-white/20 dark:bg-white/5 rounded-[4rem] border-4 border-white/60 dark:border-white/10 shadow-2xl backdrop-blur-md overflow-hidden ring-4 ring-teal-500/10 z-20">
                 {/* Gauge Ticks */}
                 <div className="absolute right-6 top-12 bottom-12 flex flex-col justify-between items-end opacity-40">
                    {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="w-4 h-0.5 bg-white rounded-full"></div>)}
                 </div>
                 <div className="absolute top-10 left-0 right-0 flex justify-center opacity-30 pointer-events-none">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white">ZPD-H2O-772</span>
                 </div>
             </div>

             {/* LIQUID */}
             <div className="absolute inset-2.5 rounded-[3.8rem] overflow-hidden bg-teal-900/10 dark:bg-black/40 z-10 shadow-inner">
                 <div 
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-teal-500 to-cyan-400 transition-all duration-1000 ease-out"
                    style={{ height: `${percentage}%` }}
                 >
                    {/* Waves & Bubbles */}
                    <div className="absolute top-0 left-0 w-full h-8 bg-white/20 rounded-full blur-md -mt-4"></div>
                    <div className="absolute inset-0 overflow-hidden opacity-50">
                       <div className="bubble absolute bottom-0 left-[20%] size-3 bg-white rounded-full animate-bubble"></div>
                       <div className="bubble absolute bottom-0 left-[60%] size-5 bg-white rounded-full animate-bubble delay-700"></div>
                       <div className="bubble absolute bottom-0 left-[80%] size-2 bg-white rounded-full animate-bubble delay-300"></div>
                    </div>
                 </div>
             </div>

             {/* DISPLAY */}
             <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
                 <div className="flex items-baseline">
                    <span className="text-8xl font-black text-white drop-shadow-lg tracking-tighter">{displayVal}</span>
                    <span className="text-3xl font-bold text-white/80 ml-1">{unitSystem === 'metric' ? 'L' : 'oz'}</span>
                 </div>
                 <div className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 shadow-sm mt-6">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{Math.round(percentage)}% FILED</span>
                 </div>
             </div>
          </div>

          <div className="w-full grid grid-cols-3 gap-4">
             <QuickAdd btn="Cup" icon="local_cafe" amount={250} unit="ml" onClick={() => handleAdd(250)} />
             <QuickAdd btn="Bottle" icon="water_bottle" amount={500} unit="ml" onClick={() => handleAdd(500)} />
             <QuickAdd btn="Flask" icon="water_drop" amount={1000} unit="ml" onClick={() => handleAdd(1000)} />
          </div>
       </div>

       <div className="px-10 pb-16 pt-8 z-20">
          <div className="bg-white/40 dark:bg-white/5 p-5 rounded-[2.5rem] border border-teal-200 dark:border-white/10 flex items-center gap-4 shadow-sm backdrop-blur-sm">
             <div className="size-12 rounded-2xl bg-teal-100 flex items-center justify-center text-2xl">🌴</div>
             <p className="text-xs font-bold text-teal-800 dark:text-teal-200 leading-relaxed italic">
                "In the Rainforest District, rookie, a dry nose means a failed mission. Drink up!"
             </p>
          </div>
       </div>
    </div>
  );
};

const QuickAdd: React.FC<{ btn: string, icon: string, amount: number, unit: string, onClick: () => void }> = ({ icon, amount, unit, onClick }) => (
   <button onClick={onClick} className="flex flex-col items-center gap-3 group">
      <div className="size-20 rounded-[2rem] bg-white dark:bg-dark-surface shadow-xl flex items-center justify-center border-2 border-transparent hover:border-teal-400 transition-all active:scale-90">
         <span className="material-symbols-outlined text-4xl text-teal-600 group-hover:scale-110 transition-transform">{icon}</span>
      </div>
      <span className="text-[10px] font-black text-teal-800 dark:text-teal-400 uppercase tracking-widest">{amount}{unit}</span>
   </button>
);

export default WaterLog;
