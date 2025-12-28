
import React, { useState } from 'react';
import { Screen, Character, FastingPlanConfig } from '../types';

interface FastingSetupProps {
  onNavigate: (screen: Screen) => void;
  activeCharacter?: Character;
  setFastingPlan: (plan: FastingPlanConfig) => void;
}

const FastingSetup: React.FC<FastingSetupProps> = ({ onNavigate, activeCharacter, setFastingPlan }) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets'); 
  const [selectedPlanId, setSelectedPlanId] = useState<string>('16:8');
  const [customFastHours, setCustomFastHours] = useState<number>(14);

  const presets = [
    { id: '13:11', title: '13:11 Circadian', tag: 'Beginner', tagColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', desc: "Aligns with your body's natural clock.", hours: 13 },
    { id: '16:8', title: '16:8 Method', tag: 'Intermediate', tagColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300', desc: "Lean gains & fat loss. The gold standard.", hours: 16, isPopular: true },
    { id: '18:6', title: '18:6 Window', tag: 'Advanced', tagColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300', desc: "Deeper ketosis and autophagy boost.", hours: 18 },
    { id: '20:4', title: '20:4 Warrior', tag: 'Expert', tagColor: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300', desc: "Maximum detox. Not for everyday.", hours: 20 },
  ];

  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (customFastHours / 24) * circumference;

  const handleNext = () => {
    let plan: FastingPlanConfig;
    if (activeTab === 'presets') {
        const p = presets.find(x => x.id === selectedPlanId);
        plan = p ? { protocol: p.title, fastingHours: p.hours, eatingHours: 24 - p.hours } : { protocol: '16:8 Method', fastingHours: 16, eatingHours: 8 };
    } else {
        plan = { protocol: `Custom ${customFastHours}:${24-customFastHours}`, fastingHours: customFastHours, eatingHours: 24 - customFastHours };
    }
    setFastingPlan(plan);
    onNavigate(Screen.PLAN_GENERATION);
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-white dark:bg-[#1a1a1a] text-light-text dark:text-white font-sans transition-colors duration-300">
      
      {/* Header Section */}
      <div className="flex flex-col items-center w-full pt-8 px-6 relative z-20 bg-white dark:bg-[#1a1a1a]">
        <div className="w-full flex items-center justify-between mb-4">
            <button onClick={() => onNavigate(Screen.GOAL_SELECTION)} className="size-12 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
              <span className="material-symbols-outlined text-gray-800 dark:text-white text-xl">arrow_back</span>
            </button>
            <div className="px-4 py-1.5"><span className="text-[10px] font-black text-indigo-400 dark:text-indigo-300 uppercase tracking-[0.2em]">Step 4 of 5</span></div>
            <div className="size-12"></div> 
        </div>
        <div className="flex gap-2 mb-2">
            {[1,2,3].map(i => <div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700"></div>)}
            <div className="h-1.5 w-8 rounded-full bg-yellow-400 shadow-sm"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar w-full pb-44 px-6 pt-4">
        <h1 className="text-[34px] font-black text-center text-[#4A4A4A] dark:text-white leading-[0.95] tracking-tight mb-6">Set your <br/> <span className="text-[#6D5D4B] dark:text-gray-400">schedule</span></h1>
        <div className="flex gap-4 bg-[#F9F9F9] dark:bg-white/5 p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm mb-6">
             <div className="size-10 rounded-full bg-cover bg-top border-2 border-yellow-400 shrink-0" style={{ backgroundImage: `url("${activeCharacter?.image}")` }}></div>
             <p className="text-sm font-bold leading-relaxed text-gray-600 dark:text-gray-300 italic">"{activeCharacter?.onboardingMessages.fasting || "Discipline! That is what this is about. Set your timer."}"</p>
        </div>

        <div className="mb-6">
          <div className="relative flex h-12 w-full items-center rounded-xl bg-gray-100 dark:bg-white/10 p-1">
            <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-white dark:bg-black/40 shadow-sm transition-all duration-300 ease-in-out ${activeTab === 'presets' ? 'left-1' : 'left-[calc(50%+4px)]'}`}></div>
            <button onClick={() => setActiveTab('presets')} className={`flex-1 relative z-10 text-xs font-black uppercase tracking-wider transition-colors duration-300 ${activeTab === 'presets' ? 'text-black dark:text-white' : 'text-gray-400'}`}>Presets</button>
            <button onClick={() => setActiveTab('custom')} className={`flex-1 relative z-10 text-xs font-black uppercase tracking-wider transition-colors duration-300 ${activeTab === 'custom' ? 'text-black dark:text-white' : 'text-gray-400'}`}>Custom</button>
          </div>
        </div>

        <div className="flex flex-col gap-3 min-h-[300px]">
          {activeTab === 'presets' ? presets.map((plan) => (
            <div key={plan.id} onClick={() => setSelectedPlanId(plan.id)} className={`relative cursor-pointer rounded-2xl p-4 transition-all duration-200 border-2 ${selectedPlanId === plan.id ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 shadow-md scale-[1.02]' : 'bg-white dark:bg-white/5 border-transparent hover:bg-gray-50 dark:hover:bg-white/10'}`}>
              {plan.isPopular && <div className="absolute -top-3 left-4 bg-yellow-400 text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm z-20">Most Popular</div>}
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1 flex-[2] mt-1">
                  <div className="flex items-center gap-2"><span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${plan.tagColor}`}>{plan.tag}</span></div>
                  <p className={`text-base font-black leading-tight mt-1 ${selectedPlanId === plan.id ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{plan.title}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-medium leading-normal">{plan.desc}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fast</span>
                    <span className={`block text-xl font-black ${selectedPlanId === plan.id ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-800 dark:text-white'}`}>{plan.hours}h</span>
                  </div>
                  <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedPlanId === plan.id ? 'border-yellow-400 bg-yellow-400' : 'border-gray-300 dark:border-gray-600'}`}>{selectedPlanId === plan.id && <span className="material-symbols-outlined text-black text-[16px] font-bold">check</span>}</div>
                </div>
              </div>
            </div>
          )) : (
            <div className="bg-white dark:bg-white/5 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-white/5">
              <div className="flex flex-col items-center justify-center py-6">
                <div className="relative size-64 flex items-center justify-center mb-8">
                  <svg className="size-full transform -rotate-90 overflow-visible" viewBox="0 0 200 200">
                    <circle className="text-gray-100 dark:text-gray-800 stroke-current" cx="100" cy="100" fill="transparent" r={radius} strokeWidth="20" strokeLinecap="round" />
                    <circle className="text-yellow-400 stroke-current transition-all duration-700 ease-out" cx="100" cy="100" fill="transparent" r={radius} strokeWidth="20" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter">{customFastHours}</span>
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Hours</span>
                  </div>
                </div>
                <div className="w-full px-2 mb-8">
                  <input type="range" min="12" max="24" step="1" value={customFastHours} onChange={(e) => setCustomFastHours(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-yellow-400" />
                  <div className="flex justify-between mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest"><span>12h</span><span>18h</span><span>24h</span></div>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full">
                  <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-2xl border border-gray-100 dark:border-white/5 flex flex-col items-center"><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Fasting</p><p className="text-gray-900 dark:text-white font-black text-lg">{customFastHours}h</p></div>
                  <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-2xl border border-gray-100 dark:border-white/5 flex flex-col items-center"><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Eating</p><p className="text-gray-900 dark:text-white font-black text-lg">{24 - customFastHours}h</p></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent dark:from-[#1a1a1a] dark:via-[#1a1a1a] z-30 pt-16 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
        <button onClick={handleNext} className="flex w-full items-center justify-center rounded-full h-16 bg-[#FACC15] hover:bg-yellow-300 text-black font-black text-sm uppercase tracking-widest shadow-xl shadow-yellow-400/20 active:scale-[0.98] transition-all gap-3">
          <span className="material-symbols-outlined text-xl filled">timelapse</span>
          Set Schedule
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default FastingSetup;
