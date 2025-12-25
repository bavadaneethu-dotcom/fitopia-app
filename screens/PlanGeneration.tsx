
import React, { useState, useEffect, useCallback } from 'react';
import { Screen, Character, FastingPlanConfig } from '../types';

interface PlanGenerationProps {
  onNavigate: (screen: Screen) => void;
  activeCharacter?: Character;
  fastingPlan: FastingPlanConfig;
  calories: number;
  setCalories: (val: number) => void;
}

const PlanGeneration: React.FC<PlanGenerationProps> = ({ onNavigate, activeCharacter, fastingPlan, calories, setCalories }) => {
  // States for nutrients
  const [protein, setProtein] = useState<number>(140);
  const [fiber, setFiber] = useState<number>(50);
  const [water, setWater] = useState<number>(2.5);
  
  // Track if user has manually overridden a value to stop auto-updates for that specific field
  const [isProteinOverridden, setIsProteinOverridden] = useState(false);
  const [isFiberOverridden, setIsFiberOverridden] = useState(false);
  const [isWaterOverridden, setIsWaterOverridden] = useState(false);
  
  const [fastingEnabled, setFastingEnabled] = useState(true);

  // Auto-calculate nutrients based on calories unless overridden
  useEffect(() => {
    if (!isProteinOverridden) {
      // ~25% of calories from protein (4 kcal/g)
      setProtein(Math.round((calories * 0.25) / 4));
    }
    if (!isFiberOverridden) {
      // ~14g fiber per 1000 kcal
      setFiber(Math.round((calories / 1000) * 14));
    }
    if (!isWaterOverridden) {
      // ~1L per 1000 kcal
      setWater(parseFloat(((calories / 1000)).toFixed(1)));
    }
  }, [calories, isProteinOverridden, isFiberOverridden, isWaterOverridden]);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-white dark:bg-dark-bg text-light-text dark:text-white font-sans animate-fade-in transition-colors duration-300">
      
      {/* Header */}
      <div className="flex flex-col items-center w-full pt-8 px-6 relative z-20">
        <div className="w-full flex items-center justify-between mb-4">
            <button onClick={() => onNavigate(Screen.FASTING_SETUP)} className="size-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
              <span className="material-symbols-outlined text-gray-800 dark:text-white text-xl">arrow_back</span>
            </button>
            <div className="px-4 py-1.5"><span className="text-[10px] font-black text-indigo-400 dark:text-indigo-300 uppercase tracking-[0.2em]">Step 5 of 5</span></div>
            <div className="size-10"></div> 
        </div>
        <div className="flex gap-2 mb-2">
            {[1,2,3,4].map(i => <div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700"></div>)}
            <div className="h-1.5 w-8 rounded-full bg-yellow-400 shadow-sm"></div>
        </div>
      </div>

      <main className="flex-1 flex flex-col px-6 gap-6 w-full overflow-y-auto no-scrollbar pt-2 pb-40">
        <div className="text-center">
           <div className="bg-gray-100 dark:bg-white/5 text-[#D97706] dark:text-yellow-200 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-sm inline-block mb-4">
                {activeCharacter?.role.toUpperCase() || "STRATEGY & HIIT"}
           </div>
           <h2 className="text-[32px] font-black leading-tight text-gray-800 dark:text-white tracking-tight mb-6">
             Coach {activeCharacter?.name.split(' ')[0]} has your<br/><span className="text-gray-400 dark:text-gray-500">plan ready!</span>
           </h2>
           <div className="bg-[#FFFBEB] dark:bg-white/5 p-5 rounded-2xl w-full flex gap-4 border-l-4 border-l-yellow-400 relative overflow-hidden text-left shadow-sm">
              <p className="text-sm font-bold italic text-gray-600 dark:text-gray-300 leading-relaxed">
                "{activeCharacter?.onboardingMessages.plan || "I pulled some strings. Here's a plan that barely feels like work."}"
              </p>
           </div>
        </div>

        {/* Daily Target Card - Softened Yellow & Reduced Text Size */}
        <div className="bg-[#FCD34D] dark:bg-yellow-600 rounded-[2rem] px-8 py-8 shadow-lg relative overflow-hidden group">
            <div className="flex justify-between items-center mb-1 relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/60">Daily Target</span>
                <span className="material-symbols-outlined text-black/80 text-[22px] filled">local_fire_department</span>
            </div>
            <div className="relative z-10 flex items-baseline gap-1">
                <input 
                    type="number" 
                    value={calories}
                    onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setCalories(val);
                    }}
                    className="w-full bg-transparent text-6xl font-black leading-none tracking-tighter text-black outline-none appearance-none"
                />
            </div>
            <span className="text-xs font-black text-black/40 uppercase tracking-widest relative z-10 block mt-1">KCAL</span>
            
            {/* Subtle background texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.4),transparent)]"></div>
        </div>

        {/* Nutrition Grid - Interactive */}
        <div className="grid grid-cols-3 gap-3">
          {/* Protein */}
          <div className="bg-gray-100 dark:bg-white/5 rounded-[1.5rem] p-4 flex flex-col items-center shadow-sm relative group">
              <span className="text-3xl mb-2">🥩</span>
              <div className="flex flex-col items-center">
                <input 
                  type="number"
                  value={protein}
                  onChange={(e) => {
                    setProtein(parseInt(e.target.value) || 0);
                    setIsProteinOverridden(true);
                  }}
                  className="w-full bg-transparent text-2xl font-black text-gray-800 dark:text-white leading-none text-center outline-none border-b-2 border-transparent focus:border-yellow-400"
                />
                <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase">g Protein</span>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-40 transition-opacity">
                <span className="material-symbols-outlined text-[12px]">edit</span>
              </div>
          </div>

          {/* Fiber */}
          <div className="bg-gray-100 dark:bg-white/5 rounded-[1.5rem] p-4 flex flex-col items-center shadow-sm relative group">
              <span className="text-3xl mb-2">🥕</span>
              <div className="flex flex-col items-center">
                <input 
                  type="number"
                  value={fiber}
                  onChange={(e) => {
                    setFiber(parseInt(e.target.value) || 0);
                    setIsFiberOverridden(true);
                  }}
                  className="w-full bg-transparent text-2xl font-black text-gray-800 dark:text-white leading-none text-center outline-none border-b-2 border-transparent focus:border-yellow-400"
                />
                <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase">g Fiber</span>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-40 transition-opacity">
                <span className="material-symbols-outlined text-[12px]">edit</span>
              </div>
          </div>

          {/* Water */}
          <div className="bg-gray-100 dark:bg-white/5 rounded-[1.5rem] p-4 flex flex-col items-center shadow-sm relative group">
              <span className="text-3xl mb-2">💧</span>
              <div className="flex flex-col items-center">
                <input 
                  type="number"
                  step="0.1"
                  value={water}
                  onChange={(e) => {
                    setWater(parseFloat(e.target.value) || 0);
                    setIsWaterOverridden(true);
                  }}
                  className="w-full bg-transparent text-2xl font-black text-gray-800 dark:text-white leading-none text-center outline-none border-b-2 border-transparent focus:border-yellow-400"
                />
                <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase">L Water</span>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-40 transition-opacity">
                <span className="material-symbols-outlined text-[12px]">edit</span>
              </div>
          </div>
        </div>

        {/* Fasting Window */}
        <div className={`rounded-[2rem] p-6 shadow-sm relative overflow-hidden transition-all duration-300 border ${fastingEnabled ? 'bg-[#EBE9D8] dark:bg-gray-800 border-yellow-200/50' : 'bg-gray-100 dark:bg-white/5 border-transparent'}`}>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className={`size-12 rounded-full flex items-center justify-center transition-colors ${fastingEnabled ? 'bg-indigo-500 text-white shadow-lg' : 'bg-gray-300 text-gray-500'}`}>
                <span className="material-symbols-outlined text-[24px]">schedule</span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-black text-base text-gray-900 dark:text-white leading-none">Fasting Window</h3>
                <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase tracking-wider">{fastingPlan.fastingHours}:{fastingPlan.eatingHours} Protocol</p>
              </div>
            </div>
            <button onClick={() => setFastingEnabled(!fastingEnabled)} className={`w-12 h-7 rounded-full relative transition-colors ${fastingEnabled ? 'bg-yellow-400 shadow-inner' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <div className={`absolute top-1 size-5 bg-white rounded-full shadow-md transition-all ${fastingEnabled ? 'left-6' : 'left-1'}`}></div>
            </button>
          </div>
          
          <div className={`w-full transition-all duration-500 ${fastingEnabled ? 'opacity-100 translate-y-0' : 'opacity-30 -translate-y-1'}`}>
            <div className="h-3 w-full flex rounded-full overflow-hidden mb-2 bg-gray-200 dark:bg-gray-700 shadow-inner">
               <div className="flex-[1] bg-gray-300 dark:bg-gray-600 border-r border-white/10"></div>
               <div className="flex-[2] bg-yellow-400 dark:bg-yellow-500"></div>
               <div className="flex-[1] bg-gray-300 dark:bg-gray-600 border-l border-white/10"></div>
            </div>
            <div className="flex justify-between px-1">
                <span className="text-[9px] font-black text-gray-400 uppercase">Sleep</span>
                <span className="text-[9px] font-black text-yellow-600 dark:text-yellow-400 uppercase">Fueling</span>
                <span className="text-[9px] font-black text-gray-400 uppercase">Sleep</span>
            </div>
          </div>
        </div>
      </main>

      <div className="absolute bottom-0 left-0 right-0 p-6 z-30 pt-20 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-dark-bg dark:via-dark-bg/90 pointer-events-none">
        <button onClick={() => onNavigate(Screen.HOME)} className="flex w-full items-center justify-center rounded-full h-16 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm uppercase tracking-widest shadow-xl shadow-yellow-400/20 active:scale-[0.98] gap-2 pointer-events-auto transition-all group">
          <span className="material-symbols-outlined text-xl filled group-hover:scale-110 transition-transform">check_circle</span>
          Accept Assignment
          <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default PlanGeneration;
