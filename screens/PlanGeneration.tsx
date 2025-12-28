
import React, { useState, useEffect } from 'react';
import { Screen, Character, FastingPlanConfig, UserStats } from '../types';
import { generatePlanBriefing } from '../GeminiService';

interface PlanGenerationProps {
  onNavigate: (screen: Screen) => void;
  activeCharacter?: Character;
  fastingPlan: FastingPlanConfig;
  calories: number;
  setCalories: (val: number) => void;
  userStats: UserStats;
  userGoal: 'lose' | 'maintain' | 'gain';
}

const PlanGeneration: React.FC<PlanGenerationProps> = ({ 
  onNavigate, 
  activeCharacter, 
  fastingPlan, 
  calories, 
  setCalories, 
  userStats, 
  userGoal 
}) => {
  const [protein, setProtein] = useState<number>(140);
  const [fiber, setFiber] = useState<number>(27);
  const [water, setWater] = useState<number>(2.5);
  const [briefing, setBriefing] = useState<string>('Briefing in progress...');
  const [isLoadingBrief, setIsLoadingBrief] = useState(true);
  
  const [isProteinOverridden, setIsProteinOverridden] = useState(false);
  const [isFiberOverridden, setIsFiberOverridden] = useState(false);
  const [isWaterOverridden, setIsWaterOverridden] = useState(false);
  
  const [fastingEnabled, setFastingEnabled] = useState(true);

  useEffect(() => {
    let weightKg = parseFloat(userStats.weight) || 75;
    if (userStats.weight === '165') weightKg = weightKg * 0.453592;

    let heightCm = 175;
    if (userStats.height.includes("'")) {
        const parts = userStats.height.split("'");
        const feet = parseFloat(parts[0]) || 5;
        const inches = parseFloat(parts[1]) || 10;
        heightCm = (feet * 30.48) + (inches * 2.54);
    } else {
        heightCm = parseFloat(userStats.height) || 175;
    }

    const age = parseInt(userStats.age) || 24;
    let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
    if (userStats.gender === 'male') bmr += 5; else bmr -= 161;

    const activityMultiplier = 1.55; 
    let tdee = bmr * activityMultiplier;

    let target = Math.round(tdee);
    if (userGoal === 'lose') target = Math.round(tdee * 0.85); 
    else if (userGoal === 'gain') target = Math.round(tdee * 1.15);

    setCalories(target);

    // AI Briefing
    const fetchBrief = async () => {
      try {
        const text = await generatePlanBriefing(userStats, userGoal, activeCharacter?.name || 'Judy Hopps');
        setBriefing(text || activeCharacter?.onboardingMessages.plan || '');
      } catch (e) {
        console.error(e);
        setBriefing(activeCharacter?.onboardingMessages.plan || '');
      } finally {
        setIsLoadingBrief(false);
      }
    };
    fetchBrief();

  }, [userStats, userGoal, setCalories, activeCharacter]);

  useEffect(() => {
    if (!isProteinOverridden) {
      setProtein(Math.round((calories * 0.25) / 4));
    }
    if (!isFiberOverridden) {
      setFiber(Math.round((calories / 1000) * 12));
    }
    if (!isWaterOverridden) {
      setWater(parseFloat(((calories / 1000) * 1.1).toFixed(1)));
    }
  }, [calories, isProteinOverridden, isFiberOverridden, isWaterOverridden]);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-white dark:bg-dark-bg text-light-text dark:text-white font-sans animate-fade-in transition-colors duration-300">
      <div className="flex flex-col items-center w-full pt-8 px-6 relative z-20 bg-white dark:bg-dark-bg">
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

      <main className="flex-1 flex flex-col px-6 gap-4 w-full overflow-y-auto no-scrollbar pt-2 pb-40">
        <div className="text-center">
           <div className="bg-slate-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] px-5 py-1.5 rounded-full inline-block mb-4">
                {isLoadingBrief ? 'Calculating Intelligence...' : 'STRENGTH & POWER'}
           </div>
           <h2 className="text-[32px] font-black leading-[0.95] text-gray-800 dark:text-white tracking-tight mb-6">
             Coach {activeCharacter?.name.split(' ')[0]} has your<br/><span className="text-gray-400 dark:text-gray-500">plan ready!</span>
           </h2>
           <div className="bg-[#FFFBEB] dark:bg-white/5 p-5 rounded-2xl w-full flex gap-4 border-l-4 border-l-yellow-400 relative overflow-hidden text-left shadow-sm min-h-[80px]">
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase text-yellow-600 mb-1">AI Briefing Generated</span>
                <p className="text-xs font-bold italic text-gray-600 dark:text-gray-300 leading-relaxed">
                  "{briefing}"
                </p>
              </div>
              {isLoadingBrief && <div className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-[1px] animate-pulse"></div>}
           </div>
        </div>

        <div className="bg-[#FEF9C3] dark:bg-yellow-700/40 rounded-3xl p-6 shadow-lg relative overflow-hidden transition-all duration-500 border border-yellow-200/50 dark:border-yellow-600/20">
            <div className="flex justify-between items-center mb-1 relative z-10">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#854D0E] opacity-60">Suggested Daily Target</span>
                <span className="material-symbols-outlined text-[#854D0E] text-[18px] opacity-80">local_fire_department</span>
            </div>
            <div className="relative z-10 flex items-center justify-center sm:justify-start gap-2">
                <input 
                    type="number" 
                    value={calories}
                    onChange={(e) => setCalories(parseInt(e.target.value) || 0)}
                    className="w-32 bg-transparent text-4xl font-black leading-none tracking-tighter text-[#422006] dark:text-white outline-none appearance-none text-center sm:text-left"
                />
                <span className="text-lg font-black text-[#854D0E] dark:text-yellow-400/60 uppercase tracking-tight self-end mb-1">kcal</span>
            </div>
            <div className="flex justify-end mt-2 relative z-10">
                <span className="text-[8px] font-black text-[#854D0E] dark:text-yellow-100 opacity-60 uppercase tracking-widest px-2.5 py-0.5 rounded-lg bg-black/5 border border-black/5">Intelligence-Led {userGoal} Plan</span>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-3 flex flex-col items-center justify-center min-h-[115px] shadow-sm border border-slate-100 dark:border-white/5">
              <span className="text-3xl mb-2">🥩</span>
              <div className="flex flex-col items-center w-full">
                <div className="flex items-baseline justify-center gap-1 w-full">
                    <input 
                        type="number"
                        value={protein}
                        onChange={(e) => { setProtein(parseInt(e.target.value) || 0); setIsProteinOverridden(true); }}
                        className="w-full max-w-[45px] bg-transparent text-lg font-black text-gray-900 dark:text-white leading-none text-center outline-none"
                    />
                    <span className="text-[9px] font-black text-gray-400 uppercase">G</span>
                </div>
                <span className="text-[7px] font-black text-gray-400 mt-0.5 uppercase tracking-widest whitespace-nowrap">Protein</span>
              </div>
          </div>

          <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-3 flex flex-col items-center justify-center min-h-[115px] shadow-sm border border-slate-100 dark:border-white/5">
              <span className="text-3xl mb-2">🥕</span>
              <div className="flex flex-col items-center w-full">
                <div className="flex items-baseline justify-center gap-1 w-full">
                    <input 
                        type="number"
                        value={fiber}
                        onChange={(e) => { setFiber(parseInt(e.target.value) || 0); setIsFiberOverridden(true); }}
                        className="w-full max-w-[45px] bg-transparent text-lg font-black text-gray-900 dark:text-white leading-none text-center outline-none"
                    />
                    <span className="text-[9px] font-black text-gray-400 uppercase">G</span>
                </div>
                <span className="text-[7px] font-black text-gray-400 mt-0.5 uppercase tracking-widest whitespace-nowrap">Fiber</span>
              </div>
          </div>

          <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-3 flex flex-col items-center justify-center min-h-[115px] shadow-sm border border-slate-100 dark:border-white/5">
              <span className="text-3xl mb-2">💧</span>
              <div className="flex flex-col items-center w-full">
                <div className="flex items-baseline justify-center gap-1 w-full">
                    <input 
                        type="number"
                        step="0.1"
                        value={water}
                        onChange={(e) => { setWater(parseFloat(e.target.value) || 0); setIsWaterOverridden(true); }}
                        className="w-full max-w-[45px] bg-transparent text-lg font-black text-gray-900 dark:text-white leading-none text-center outline-none"
                    />
                    <span className="text-[9px] font-black text-gray-400 uppercase">L</span>
                </div>
                <span className="text-[7px] font-black text-gray-400 mt-0.5 uppercase tracking-widest whitespace-nowrap">Water</span>
              </div>
          </div>
        </div>

        <div className={`rounded-2xl p-6 shadow-sm relative overflow-hidden transition-all duration-300 bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-white/5`}>
          <div className="flex items-center justify-between mb-5 relative z-10">
            <div className="flex items-center gap-4">
              <div className={`size-12 rounded-xl flex items-center justify-center transition-colors bg-blue-600 text-white shadow-md`}>
                <span className="material-symbols-outlined text-xl filled">schedule</span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-black text-sm text-gray-900 dark:text-white leading-none">Fasting Window</h3>
                <p className="text-[9px] text-gray-500 font-bold mt-1.5 uppercase tracking-[0.15em]">{fastingPlan.protocol}</p>
              </div>
            </div>
            <button onClick={() => setFastingEnabled(!fastingEnabled)} className={`w-12 h-7 rounded-full relative transition-colors ${fastingEnabled ? 'bg-yellow-400' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <div className={`absolute top-1 size-5 bg-white rounded-full shadow-sm transition-all ${fastingEnabled ? 'left-[1.5rem]' : 'left-1'}`}></div>
            </button>
          </div>
          
          <div className={`w-full transition-all duration-500 ${fastingEnabled ? 'opacity-100' : 'opacity-30'}`}>
            <div className="h-2.5 w-full flex rounded-full overflow-hidden mb-2 bg-gray-200 dark:bg-gray-700 shadow-inner">
               <div className="flex-[1] bg-gray-300 dark:bg-gray-600"></div>
               <div className="flex-[2] bg-yellow-400"></div>
               <div className="flex-[1] bg-gray-300 dark:bg-gray-600"></div>
            </div>
          </div>
        </div>
      </main>

      <div className="absolute bottom-0 left-0 right-0 p-6 z-30 pt-20 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-dark-bg dark:via-dark-bg/80 pointer-events-none">
        <button onClick={() => onNavigate(Screen.HOME)} className="flex w-full items-center justify-center rounded-full h-14 bg-[#FACC15] hover:bg-yellow-300 text-black font-black text-sm uppercase tracking-widest shadow-xl shadow-yellow-400/20 active:scale-[0.98] gap-3 pointer-events-auto transition-all group">
          <span className="material-symbols-outlined text-xl filled">check_circle</span>
          Accept Assignment
          <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default PlanGeneration;
