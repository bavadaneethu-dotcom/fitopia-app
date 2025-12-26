
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

interface HydrationQuote {
    text: string;
    author: string;
    avatar: string;
    role: string;
}

const RAINFOREST_QUOTES: HydrationQuote[] = [
  { text: "I... just... finished... my... first... sip... from... yesterday...", author: "Flash", avatar: "🦥", role: "Endurance Coach" },
  { text: "It's 100% water, sweetheart. Or as I call it: 'Innocent Pawpsicle Base'.", author: "Nick", avatar: "🦊", role: "Strategy Lead" },
  { text: "Hydration is not a suggestion, cadet. It's the law! Now drink!", author: "Chief Bogo", avatar: "🐃", role: "ZPD Chief" },
  { text: "Wow! You're drinking water faster than a meter maid on a sugar rush!", author: "Judy", avatar: "🐰", role: "Agility Officer" },
  { text: "Water is like liquid peace, man. Let it flow through your fur...", author: "Yax", avatar: "🐂", role: "Zen Consultant" },
  { text: "You look like a raisin. My grandmother was a raisin once. Don't be like her.", author: "Finnick", avatar: "🐕", role: "Grit Coach" },
  { text: "Is that a donut? No? Just water? Fine, I guess that's healthy too.", author: "Clawhauser", avatar: "🐆", role: "Desk Sergeant" },
  { text: "Make it rain! The Rainforest District needs people like you!", author: "Mayor Lionheart", avatar: "🦁", role: "ZPD Oversight" },
  { text: "Drink. Or you'll be sleeping with the fishes. And they're very well hydrated.", author: "Mr. Big", avatar: "🐭", role: "The Don" },
  { text: "CODE BLUE! DRY NOSE DETECTED! INITIATE EMERGENCY SIPPING!", author: "Dispatch", avatar: "📞", role: "ZPD Comms" }
];

const WaterLog: React.FC<WaterLogProps> = ({ onNavigate, waterLogs, onAddWater, onDeleteWater, onUpdateWater, unitSystem = 'metric' }) => {
  const currentWater = waterLogs.reduce((acc, curr) => acc + curr.amount, 0);
  const targetWater = 2500;
  const [isSurging, setIsSurging] = useState(false);
  const [lastAdded, setLastAdded] = useState<number | null>(null);
  const [activeQuote, setActiveQuote] = useState<HydrationQuote>(RAINFOREST_QUOTES[3]);
  
  // Manual Input State
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const percentage = Math.min((currentWater / targetWater) * 100, 100);
  const remaining = Math.max(0, targetWater - currentWater);

  const unitLabel = unitSystem === 'metric' ? 'ml' : 'oz';
  const displayValue = (val: number) => unitSystem === 'metric' ? val : Math.round(val * 0.033814);
  const toMl = (val: number) => unitSystem === 'metric' ? val : Math.round(val / 0.033814);

  const addWater = (amountInUnit: number) => {
    // New funny quote logic
    const randomIndex = Math.floor(Math.random() * RAINFOREST_QUOTES.length);
    setActiveQuote(RAINFOREST_QUOTES[randomIndex]);

    const amountMl = toMl(amountInUnit);
    setIsSurging(true);
    setLastAdded(amountInUnit);
    onAddWater(amountMl);

    setTimeout(() => setIsSurging(false), 800);
    setTimeout(() => setLastAdded(null), 1500);
    setIsCustomMode(false);
    setCustomAmount('');
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const amount = parseInt(customAmount);
      if (amount > 0) {
          const amountMl = toMl(amount);
          if (editingId) {
              const existingItem = waterLogs.find(item => item.id === editingId);
              if (existingItem) {
                  onUpdateWater({ ...existingItem, amount: amountMl });
              }
              setEditingId(null);
              setIsCustomMode(false);
              setCustomAmount('');
          } else {
              addWater(amount);
          }
      }
  };

  const handleEdit = (entry: WaterLogItem) => {
      setCustomAmount(displayValue(entry.amount).toString());
      setEditingId(entry.id);
      setIsCustomMode(true);
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-[#E0F7FA] dark:bg-[#064e3b] animate-fade-in transition-colors duration-300 font-sans">
       <div className="absolute inset-0 bg-gradient-to-b from-[#E0F7FA] to-[#B2EBF2] dark:from-[#064e3b] dark:to-[#022c22] pointer-events-none"></div>
       <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/leaves.png")', backgroundSize: '300px' }}></div>
       
       <div className="absolute -top-20 -right-20 w-80 h-80 bg-green-400/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-overlay animate-pulse-slow"></div>
       <div className="absolute top-1/3 -left-20 w-60 h-60 bg-teal-400/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-overlay"></div>

      <div className="flex items-center px-6 pt-8 pb-4 justify-between relative z-20">
        <div className="size-10"></div>
        <h2 className="text-sm font-black tracking-widest text-teal-800 dark:text-teal-100 uppercase flex items-center gap-2">
           <span className="material-symbols-outlined filled text-teal-600 dark:text-teal-400 drop-shadow-sm">forest</span>
           Rainforest District
        </h2>
        <button 
          onClick={() => onNavigate(Screen.HOME)}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/40 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-white/10 transition-colors shadow-sm backdrop-blur-md"
        >
          <span className="material-symbols-outlined text-gray-800 dark:text-white text-xl">close</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 gap-2 overflow-y-auto no-scrollbar z-10 w-full max-w-md mx-auto">
        
        {/* CHARACTER BULLETIN - Funny & Interactive */}
        <div className="w-full bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-[2rem] p-4 border border-white/60 dark:border-white/10 shadow-lg animate-fade-in mb-2 flex items-center gap-4 group">
            <div className="size-14 rounded-2xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-3xl border border-teal-100 group-hover:scale-110 transition-transform">
                {activeQuote.avatar}
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[9px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-widest">{activeQuote.author}</span>
                    <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">• {activeQuote.role}</span>
                </div>
                <p className="text-[12px] font-bold text-teal-900 dark:text-teal-50 italic leading-tight">
                    "{activeQuote.text}"
                </p>
            </div>
            <div className="animate-pulse">
                <span className="material-symbols-outlined text-teal-400 text-xs">water_drop</span>
            </div>
        </div>

        <div className={`relative w-64 h-72 transition-transform duration-500 my-2 flex-shrink-0 ${isSurging ? 'scale-[1.02]' : ''}`}>
            <div className="absolute inset-0 bg-white/20 dark:bg-white/5 rounded-[2.5rem] border-[4px] border-white/70 dark:border-white/20 shadow-2xl backdrop-blur-sm z-20 overflow-hidden ring-1 ring-teal-500/20">
                 <div className="absolute top-8 left-0 right-0 flex justify-center opacity-40 pointer-events-none">
                     <div className="border border-white/60 px-2 py-0.5 rounded text-[8px] font-black text-white uppercase tracking-[0.2em] mix-blend-overlay">ZPD Hydration Unit</div>
                 </div>
                 <div className="absolute top-4 left-4 right-4 h-1/3 bg-gradient-to-b from-white/20 to-transparent rounded-[2rem] pointer-events-none"></div>
                 <div className="absolute bottom-6 left-0 right-0 flex justify-center opacity-10 pointer-events-none">
                    <span className="material-symbols-outlined text-8xl text-white">local_police</span>
                 </div>
            </div>
            
            <div className="absolute inset-[6px] rounded-[2.2rem] overflow-hidden bg-teal-900/10 dark:bg-black/40 z-10 shadow-inner">
                <div 
                    className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-teal-500 to-cyan-400 dark:from-teal-600 dark:to-cyan-500 transition-all ease-out flex items-start justify-center ${isSurging ? 'duration-500' : 'duration-1000'}`}
                    style={{ height: `${percentage}%`, boxShadow: '0 -4px 20px rgba(45, 212, 191, 0.5)' }}
                >
                    <div className="absolute w-full h-full overflow-hidden opacity-60">
                        <div className="bubble absolute bottom-0 left-[20%] w-2 h-2 bg-white/60 rounded-full animate-bubble delay-100"></div>
                        <div className="bubble absolute bottom-0 left-[50%] w-3 h-3 bg-white/40 rounded-full animate-bubble delay-300"></div>
                        <div className="bubble absolute bottom-0 left-[70%] w-1.5 h-1.5 bg-white/60 rounded-full animate-bubble delay-700"></div>
                        <div className="bubble absolute bottom-0 left-[30%] w-2.5 h-2.5 bg-white/50 rounded-full animate-bubble delay-500"></div>
                    </div>
                    <div className="absolute -top-3 w-full h-6 bg-cyan-300 dark:bg-cyan-400 rounded-[100%] opacity-40 animate-pulse blur-sm"></div>
                </div>
            </div>

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
                             <span className="text-7xl font-black text-white drop-shadow-md tracking-tighter">
                                 {unitSystem === 'metric' ? (currentWater / 1000).toFixed(1) : Math.round(currentWater * 0.033814)}
                             </span>
                             <span className="text-3xl font-bold text-white/90 ml-1">{unitSystem === 'metric' ? 'L' : 'oz'}</span>
                         </div>
                         <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-sm">
                             <span className="text-[10px] font-bold text-white uppercase tracking-widest">{Math.round(percentage)}% Full</span>
                         </div>
                     </div>
                 )}
            </div>
        </div>

        <div className="flex w-full justify-between px-4 mb-2 mt-4">
             <div className="text-left">
                 <p className="text-[10px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-widest mb-0.5">Target</p>
                 <p className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">
                     {unitSystem === 'metric' ? `${(targetWater/1000).toFixed(1)}L` : `${Math.round(targetWater * 0.033814)}oz`}
                 </p>
             </div>
             <div className="text-right">
                 <p className="text-[10px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-widest mb-0.5">Remaining</p>
                 <p className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">
                     {displayValue(remaining)}{unitLabel}
                 </p>
             </div>
        </div>

        <div className="w-full flex-col justify-end pb-12">
            {isCustomMode ? (
                <form onSubmit={handleCustomSubmit} className="flex flex-col gap-4 w-full px-2 animate-fade-in-up mb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-20 flex items-center bg-white dark:bg-black/20 rounded-2xl border-2 border-teal-400 shadow-sm overflow-hidden">
                            <input 
                                type="number" 
                                min="0"
                                autoFocus
                                placeholder="0"
                                className="flex-1 h-full bg-transparent pl-6 pr-2 font-bold text-3xl text-gray-800 dark:text-white focus:outline-none text-center appearance-none m-0"
                                value={customAmount}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === '' || parseFloat(val) >= 0) {
                                        setCustomAmount(val);
                                    }
                                }}
                            />
                            <div className="h-full border-l border-teal-100 dark:border-teal-800/30 flex flex-col justify-center items-center px-5 bg-teal-50 dark:bg-teal-900/10 min-w-[70px]">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wide">Unit</span>
                                <span className="text-lg font-bold text-teal-600 dark:text-teal-400">{unitLabel}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 h-14">
                        <button 
                            type="button" 
                            onClick={() => { setIsCustomMode(false); setEditingId(null); setCustomAmount(''); }}
                            className="w-24 rounded-xl bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300 font-bold uppercase tracking-wider text-xs hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={!customAmount}
                            className="flex-1 rounded-xl bg-teal-500 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-teal-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 border-2 border-transparent hover:border-teal-300"
                        >
                            <span className="material-symbols-outlined filled">{editingId ? 'update' : 'add_circle'}</span>
                            {editingId ? 'Update Log' : 'Add Water'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="flex justify-between gap-3 px-1 mb-6">
                    <WaterButton 
                        amount={displayValue(250)} 
                        icon="local_cafe" 
                        label="Dew Cup" 
                        subLabel={`${displayValue(250)}${unitLabel}`}
                        onClick={() => addWater(displayValue(250))} 
                    />
                    
                    <WaterButton 
                        amount={displayValue(500)} 
                        icon="water_bottle" 
                        label="ZPD Flask" 
                        subLabel={`${displayValue(500)}${unitLabel}`}
                        isActive={true}
                        onClick={() => addWater(displayValue(500))} 
                    />

                    <WaterButton 
                        amount={displayValue(150)} 
                        icon="water_drop" 
                        label="Quick Sip" 
                        subLabel={`${displayValue(150)}${unitLabel}`}
                        onClick={() => addWater(displayValue(150))} 
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
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">? {unitLabel}</span>
                        </div>
                    </button>
                </div>
            )}
            
            {waterLogs.length > 0 ? (
                <div className="animate-fade-in mb-6">
                    <div className="flex items-center gap-2 mb-3 px-2">
                        <span className="h-px bg-teal-200 dark:bg-teal-800 flex-1"></span>
                        <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">History</span>
                        <span className="h-px bg-teal-200 dark:bg-teal-800 flex-1"></span>
                    </div>
                    <div className="flex flex-col gap-2">
                        {waterLogs.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-white/60 dark:bg-white/5 rounded-xl border border-teal-100 dark:border-teal-800/30">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                        <span className="material-symbols-outlined text-sm">water_drop</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800 dark:text-white">{displayValue(item.amount)}{unitLabel}</p>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400">{item.timestamp}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button 
                                        onClick={() => handleEdit(item)}
                                        className="size-8 rounded-full hover:bg-white/50 dark:hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                    </button>
                                    <button 
                                        onClick={() => onDeleteWater(item.id)}
                                        className="size-8 rounded-full hover:bg-white/50 dark:hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 opacity-60">
                    <p className="text-xs font-bold text-teal-800 dark:text-teal-200 uppercase tracking-wide">No hydration data for today</p>
                </div>
            )}
        </div>

      </div>
      <style>{`
        .bubble {
            animation: rise 4s infinite ease-in;
            opacity: 0;
        }
        @keyframes rise {
            0% { transform: translateY(100%) scale(0.5); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(-200%) scale(1.2); opacity: 0; }
        }
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
}> = ({ amount, icon, label, subLabel, isActive, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className="flex flex-col items-center gap-2 group flex-1"
        >
            <div className={`w-full aspect-square rounded-[1.2rem] shadow-sm flex items-center justify-center text-2xl group-hover:scale-[1.02] transition-all group-active:scale-95 border-2 ${
                isActive 
                ? 'bg-teal-500 border-teal-600 text-white shadow-teal-500/30' 
                : 'bg-white dark:bg-gray-800 border-teal-100 dark:border-teal-800/30 text-teal-500 dark:text-teal-400 hover:border-teal-300'
            }`}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{label}</span>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">{subLabel}</span>
            </div>
        </button>
    );
};

export default WaterLog;
