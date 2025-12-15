import React, { useState } from 'react';
import { Screen } from '../types';

interface WaterLogProps {
  onNavigate: (screen: Screen) => void;
}

const QUOTES = [
  "In the Rainforest District, staying hydrated is survival!",
  "Flash says... drink... wa... ter... slowly...",
  "Don't let the humidity fool you, drink up!",
  "Hydration: It's called a hustle, sweetheart.",
  "Clear mind, clear water. Ready for duty!",
  "Keep your cool like Mr. Big. Drink water.",
  "A dry nose is a bad sign. Drink up!",
  "Officer Hopps reports: Hydration levels rising!",
  "Don't go savage from thirst. Stay watered!",
  "Sly fox tip: Water is free, unlike pawpsicles."
];

const WaterLog: React.FC<WaterLogProps> = ({ onNavigate }) => {
  const [currentWater, setCurrentWater] = useState(1250); // in ml
  const targetWater = 2500;
  const [isSurging, setIsSurging] = useState(false);
  const [lastAdded, setLastAdded] = useState<number | null>(null);
  const [quote, setQuote] = useState(QUOTES[9]);
  
  // Manual Input State
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customAmount, setCustomAmount] = useState('');

  const percentage = Math.min((currentWater / targetWater) * 100, 100);
  const remaining = Math.max(0, targetWater - currentWater);

  const addWater = (amount: number) => {
    setCurrentWater(prev => Math.min(prev + amount, targetWater + 2000)); // Allow overfill visual
    
    // Random Quote
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

    // Trigger animations
    setIsSurging(true);
    setLastAdded(amount);
    setTimeout(() => setIsSurging(false), 800);
    setTimeout(() => setLastAdded(null), 1500);
    setIsCustomMode(false);
    setCustomAmount('');
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const amount = parseInt(customAmount);
      if (amount > 0) {
          addWater(amount);
      }
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-[#E0F7FA] dark:bg-[#064e3b] animate-fade-in transition-colors duration-300 font-sans">
       {/* Background Decor - Rainforest District Vibe */}
       <div className="absolute inset-0 bg-gradient-to-b from-[#E0F7FA] to-[#B2EBF2] dark:from-[#064e3b] dark:to-[#022c22] pointer-events-none"></div>
       <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/leaves.png")', backgroundSize: '300px' }}></div>
       
       {/* Big translucent leaf shapes for atmosphere */}
       <div className="absolute -top-20 -right-20 w-80 h-80 bg-green-400/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-overlay animate-pulse-slow"></div>
       <div className="absolute top-1/3 -left-20 w-60 h-60 bg-teal-400/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-overlay"></div>

       {/* Header */}
      <div className="flex items-center px-6 pt-8 pb-4 justify-between relative z-20">
        <button 
          onClick={() => onNavigate(Screen.HOME)}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/40 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-white/10 transition-colors shadow-sm backdrop-blur-md"
        >
          <span className="material-symbols-outlined text-gray-800 dark:text-white text-xl">arrow_back</span>
        </button>
        <h2 className="text-sm font-black tracking-widest text-teal-800 dark:text-teal-100 uppercase flex items-center gap-2">
           <span className="material-symbols-outlined filled text-teal-600 dark:text-teal-400 drop-shadow-sm">forest</span>
           Rainforest District
        </h2>
        <div className="size-10"></div>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 gap-2 overflow-y-auto no-scrollbar z-10 w-full max-w-md mx-auto">
        
        {/* Main Water Container - ZPD Hydration Tank */}
        <div className={`relative w-64 h-80 transition-transform duration-500 my-4 ${isSurging ? 'scale-[1.02]' : ''}`}>
             {/* Container Border/Glass */}
            <div className="absolute inset-0 bg-white/20 dark:bg-white/5 rounded-[2.5rem] border-[4px] border-white/70 dark:border-white/20 shadow-2xl backdrop-blur-sm z-20 overflow-hidden ring-1 ring-teal-500/20">
                 {/* ZPD Decal Watermark */}
                 <div className="absolute top-8 left-0 right-0 flex justify-center opacity-40 pointer-events-none">
                     <div className="border border-white/60 px-2 py-0.5 rounded text-[8px] font-black text-white uppercase tracking-[0.2em] mix-blend-overlay">ZPD Hydration Unit</div>
                 </div>
                 
                 {/* Reflection */}
                 <div className="absolute top-4 left-4 right-4 h-1/3 bg-gradient-to-b from-white/20 to-transparent rounded-[2rem] pointer-events-none"></div>
                 
                 {/* ZPD Logo BG */}
                 <div className="absolute bottom-6 left-0 right-0 flex justify-center opacity-10 pointer-events-none">
                    <span className="material-symbols-outlined text-8xl text-white">local_police</span>
                 </div>
            </div>
            
            {/* Liquid */}
            <div className="absolute inset-[6px] rounded-[2.2rem] overflow-hidden bg-teal-900/10 dark:bg-black/40 z-10 shadow-inner">
                <div 
                    className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-teal-500 to-cyan-400 dark:from-teal-600 dark:to-cyan-500 transition-all ease-out flex items-start justify-center ${isSurging ? 'duration-500' : 'duration-1000'}`}
                    style={{ height: `${percentage}%`, boxShadow: '0 -4px 20px rgba(45, 212, 191, 0.5)' }}
                >
                    {/* Bubbles */}
                    <div className="absolute w-full h-full overflow-hidden opacity-60">
                        <div className="bubble absolute bottom-0 left-[20%] w-2 h-2 bg-white/60 rounded-full animate-bubble delay-100"></div>
                        <div className="bubble absolute bottom-0 left-[50%] w-3 h-3 bg-white/40 rounded-full animate-bubble delay-300"></div>
                        <div className="bubble absolute bottom-0 left-[70%] w-1.5 h-1.5 bg-white/60 rounded-full animate-bubble delay-700"></div>
                        <div className="bubble absolute bottom-0 left-[30%] w-2.5 h-2.5 bg-white/50 rounded-full animate-bubble delay-500"></div>
                    </div>
                    {/* Wave Top */}
                    <div className="absolute -top-3 w-full h-6 bg-cyan-300 dark:bg-cyan-400 rounded-[100%] opacity-40 animate-pulse blur-sm"></div>
                </div>
            </div>

            {/* Info Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none text-center">
                 {lastAdded ? (
                     <div className="animate-bounce-in">
                         <span className="text-6xl font-black text-white drop-shadow-md tracking-tighter">+{lastAdded}</span>
                         <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full mt-2">
                             <span className="text-[10px] font-bold text-white uppercase tracking-widest">Added</span>
                         </div>
                     </div>
                 ) : (
                     <div className="flex flex-col items-center animate-fade-in gap-1">
                         <div className="flex items-baseline">
                             <span className="text-7xl font-black text-white drop-shadow-md tracking-tighter">{(currentWater / 1000).toFixed(1)}</span>
                             <span className="text-3xl font-bold text-white/90 ml-1">L</span>
                         </div>
                         <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-sm">
                             <span className="text-[10px] font-bold text-white uppercase tracking-widest">{Math.round(percentage)}% Full</span>
                         </div>
                     </div>
                 )}
            </div>
            
            {/* Measurement Ticks */}
            <div className="absolute right-4 top-8 bottom-8 w-4 z-20 flex flex-col justify-between py-4 items-end opacity-60">
                <div className="w-3 h-[2px] bg-white shadow-sm rounded-full"></div>
                <div className="w-1.5 h-[1.5px] bg-white/70 rounded-full"></div>
                <div className="w-1.5 h-[1.5px] bg-white/70 rounded-full"></div>
                <div className="w-3 h-[2px] bg-white shadow-sm rounded-full"></div>
                <div className="w-1.5 h-[1.5px] bg-white/70 rounded-full"></div>
                <div className="w-1.5 h-[1.5px] bg-white/70 rounded-full"></div>
                <div className="w-3 h-[2px] bg-white shadow-sm rounded-full"></div>
            </div>
        </div>

        {/* Stats Row */}
        <div className="flex w-full justify-between px-4 mb-4">
             <div className="text-left">
                 <p className="text-[10px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-widest mb-0.5">Target</p>
                 <p className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">{(targetWater/1000).toFixed(1)}L</p>
             </div>
             <div className="text-right">
                 <p className="text-[10px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-widest mb-0.5">Remaining</p>
                 <p className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">{remaining}ml</p>
             </div>
        </div>

        {/* Add Water Controls */}
        <div className="w-full flex-1 flex flex-col justify-end pb-6">
            <h3 className="text-center text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-4">Log Intake</h3>
            
            {isCustomMode ? (
                <form onSubmit={handleCustomSubmit} className="flex items-center gap-3 w-full px-2 animate-fade-in-up">
                    <button 
                        type="button" 
                        onClick={() => setIsCustomMode(false)}
                        className="size-14 rounded-2xl bg-teal-100 dark:bg-white/10 flex items-center justify-center hover:bg-teal-200 transition-colors shadow-sm"
                    >
                        <span className="material-symbols-outlined text-teal-600 dark:text-gray-400">close</span>
                    </button>
                    <div className="flex-1 relative h-14">
                        <input 
                            type="number" 
                            autoFocus
                            placeholder="Amount"
                            className="w-full h-full rounded-2xl border-2 border-teal-400 bg-white dark:bg-black/20 px-4 font-bold text-xl text-gray-800 dark:text-white focus:outline-none shadow-sm text-center"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 uppercase">ml</span>
                    </div>
                    <button 
                        type="submit" 
                        disabled={!customAmount}
                        className="size-14 rounded-2xl bg-teal-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none border-2 border-white/20"
                    >
                        <span className="material-symbols-outlined">check</span>
                    </button>
                </form>
            ) : (
                <div className="flex justify-between gap-3 px-1">
                    <WaterButton 
                        amount={250} 
                        icon="local_cafe" 
                        label="Dew Cup" 
                        subLabel="250ml"
                        onClick={() => addWater(250)} 
                    />
                    
                    <WaterButton 
                        amount={500} 
                        icon="water_bottle" 
                        label="ZPD Flask" 
                        subLabel="500ml"
                        isActive={true}
                        onClick={() => addWater(500)} 
                    />

                    <WaterButton 
                        amount={150} 
                        icon="water_drop" 
                        label="Quick Sip" 
                        subLabel="150ml"
                        onClick={() => addWater(150)} 
                    />

                     <button 
                        onClick={() => setIsCustomMode(true)}
                        className="flex flex-col items-center gap-2 group flex-1"
                    >
                        <div className="w-full aspect-square rounded-[1.2rem] bg-white dark:bg-gray-800 border-2 border-dashed border-teal-200 dark:border-teal-800/50 shadow-sm flex items-center justify-center text-2xl group-hover:scale-[1.02] transition-transform group-active:scale-95 text-teal-300">
                            <span className="material-symbols-outlined">add_circle</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Custom</span>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">? ml</span>
                        </div>
                    </button>
                </div>
            )}
            
            {/* ZPD Tip Banner */}
            <div className="mt-8 relative overflow-hidden rounded-2xl bg-teal-100/80 dark:bg-teal-900/40 p-4 border border-teal-200 dark:border-teal-800/50 shadow-sm group">
                 {/* Tip Background Icon */}
                 <div className="absolute -right-2 -bottom-2 text-teal-500/10 dark:text-white/5 transform rotate-12">
                     <span className="material-symbols-outlined text-[80px]">umbrella</span>
                 </div>
                 
                 <div className="flex gap-4 items-center relative z-10">
                    <div className="size-10 rounded-full bg-teal-200 dark:bg-teal-800 flex items-center justify-center shrink-0 border-2 border-white/30 text-teal-800 dark:text-white">
                         <span className="material-symbols-outlined text-xl">cloud</span>
                    </div>
                    <div>
                         <p className="text-[10px] font-black text-teal-600 dark:text-teal-300 uppercase tracking-widest mb-1">ZPD Tip</p>
                         <p className="text-xs font-bold text-teal-900 dark:text-teal-100 italic leading-relaxed">
                            "{quote}"
                        </p>
                    </div>
                 </div>
            </div>
        </div>

      </div>
      
      {/* Styles for Animations */}
      <style>{`
        @keyframes bubble {
          0% { bottom: 0; opacity: 0; transform: scale(0.5); }
          50% { opacity: 0.5; transform: scale(1.1); }
          100% { bottom: 100%; opacity: 0; transform: scale(0.8); }
        }
        @keyframes bounce-in {
           0% { transform: scale(0.5); opacity: 0; }
           60% { transform: scale(1.1); opacity: 1; }
           100% { transform: scale(1); opacity: 1; }
        }
        .animate-bubble { animation: bubble 3s ease-in infinite; }
        .animate-bounce-in { animation: bounce-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>
    </div>
  );
};

const WaterButton: React.FC<{ 
    amount: number; 
    icon: string; 
    label: string; 
    subLabel: string;
    isActive?: boolean;
    onClick: () => void;
}> = ({ amount, icon, label, subLabel, isActive, onClick }) => (
    <button 
        onClick={onClick}
        className="flex flex-col items-center gap-2 group flex-1"
    >
        <div className={`w-full aspect-square rounded-[1.2rem] shadow-sm flex items-center justify-center text-3xl transition-all duration-200 group-active:scale-95 border-2 ${isActive ? 'bg-teal-100/80 dark:bg-teal-900/40 border-teal-500/50 relative overflow-hidden text-teal-700 dark:text-teal-300' : 'bg-white dark:bg-gray-800 border-white/50 dark:border-white/5 hover:border-teal-200 text-gray-600 dark:text-gray-400'}`}>
            {isActive && <div className="absolute inset-0 bg-teal-500/10 animate-pulse"></div>}
            <span className="material-symbols-outlined transform group-hover:scale-110 transition-transform relative z-10">{icon}</span>
        </div>
        <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{label}</span>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">{subLabel}</span>
        </div>
    </button>
);

export default WaterLog;