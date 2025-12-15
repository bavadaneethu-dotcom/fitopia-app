
import React, { useState } from 'react';
import { Screen, Character } from '../types';

interface PlanGenerationProps {
  onNavigate: (screen: Screen) => void;
  activeCharacter?: Character;
}

const PlanGeneration: React.FC<PlanGenerationProps> = ({ onNavigate, activeCharacter }) => {
  const [calories, setCalories] = useState<number | string>(2150);
  const [protein, setProtein] = useState<number | string>(140);
  const [fiber, setFiber] = useState<number | string>(30);
  const [water, setWater] = useState<number | string>(2.5);
  const [fastingEnabled, setFastingEnabled] = useState(true);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number | string>>, val: string) => {
    if (val === '') {
        setter('');
    } else {
        // Allow decimals for water, integers for others usually, but generic float parsing works for all
        setter(val);
    }
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden pb-24 bg-white dark:bg-dark-bg animate-fade-in text-light-text dark:text-white font-sans">
      {/* Top App Bar */}
      <div className="flex items-center px-6 pt-6 pb-2 justify-between z-20 sticky top-0 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-sm transition-all duration-300">
        <button 
          onClick={() => onNavigate(Screen.FASTING_SETUP)}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F5F2EA] dark:bg-white/10 hover:bg-gray-200 transition-colors active:scale-90 duration-200"
        >
          <span className="material-symbols-outlined text-xl text-gray-800 dark:text-white">arrow_back</span>
        </button>
        <h2 className="text-base font-bold leading-tight tracking-tight flex-1 text-center text-[#4A4A4A] dark:text-white">Your Personal Plan</h2>
        <div className="size-10 flex items-center justify-center shrink-0">
          <div className="size-10 rounded-full bg-[#F5F2EA] dark:bg-gray-800 flex items-center justify-center">
             <span className="material-symbols-outlined text-gray-400">more_horiz</span>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-5 gap-6 w-full max-w-md mx-auto overflow-y-auto no-scrollbar pt-4">
        
        {/* Character Intro */}
        <div className="flex flex-col items-center animate-fade-in-up">
           {/* Tag */}
           <div className="bg-[#F9F9F9] dark:bg-white/5 text-[#E6C288] dark:text-yellow-200 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4">
             {activeCharacter?.role.toUpperCase() || "AGILITY & CARDIO"}
           </div>

           <h2 className="text-[28px] font-black leading-[1.1] text-center px-4 mb-6 text-[#D9D9D9] dark:text-gray-400 tracking-tight">
             Coach {activeCharacter?.name.split(' ')[0] || "Judy"} has your<br/>
             <span className="text-[#E8E8E8] dark:text-white">plan ready!</span>
           </h2>
          
           {/* Quote Card */}
           <div className="bg-[#FCFCFC] dark:bg-dark-surface p-5 rounded-2xl w-full flex gap-4 border border-gray-100 dark:border-white/5 relative overflow-hidden shadow-sm">
              <div className="text-[#FCE8B3] dark:text-yellow-600">
                <span className="material-symbols-outlined text-4xl filled" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
              </div>
              <p className="text-sm font-bold italic text-[#4A4A4A] dark:text-white leading-relaxed mt-1">
                "{activeCharacter?.onboardingMessages.plan || "Here is your training assignment. Let's hustle, sweetheart!"}"
              </p>
           </div>
        </div>

        {/* Daily Target Card */}
        <div 
          className="relative overflow-hidden bg-[#FACC15] dark:bg-yellow-600 text-black dark:text-white rounded-[2.5rem] p-7 shadow-lg shadow-yellow-400/20 transition-all duration-300 group"
        >
          {/* Decorative Circles */}
          <div className="absolute right-0 top-0 size-32 bg-yellow-300/30 dark:bg-white/10 rounded-full translate-x-10 -translate-y-10"></div>
          
          <div className="relative z-10 flex flex-col h-full">
             <div className="flex justify-between items-start mb-2">
               <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Daily Target</span>
               <div className="size-8 rounded-full bg-black/10 dark:bg-black/20 flex items-center justify-center">
                 <span className="material-symbols-outlined text-sm">local_fire_department</span>
               </div>
             </div>
             
             <div className="relative mt-2 mb-8">
               <input 
                 type="number"
                 value={calories}
                 onChange={(e) => handleInputChange(setCalories, e.target.value)}
                 className="w-full bg-transparent text-[64px] font-black leading-none tracking-tighter border-none outline-none p-0 m-0 placeholder-black/30 focus:ring-0 appearance-none [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none z-10 relative"
                 placeholder="0"
               />
               {/* Optional 'kcal' label near number if desired, but screenshot shows just number. */}
             </div>
             
             <div className="absolute bottom-5 right-6 flex items-center gap-1.5 text-[10px] font-bold opacity-60 bg-black/5 dark:bg-white/20 px-3 py-1.5 rounded-full pointer-events-none">
                <span className="material-symbols-outlined text-[12px]">edit</span>
                <span>Type to Edit</span>
             </div>
          </div>
        </div>

        {/* Nutrition Grid - Manual Inputs */}
        <div className="grid grid-cols-3 gap-3">
          {/* Protein */}
          <div className="bg-[#F5F2EA] dark:bg-dark-surface rounded-2xl p-3 pt-5 flex flex-col items-center gap-2 border border-[#EBEBEB] dark:border-white/5 relative group focus-within:ring-2 ring-light-primary/50 transition-all">
             <div className="text-3xl mb-1 filter drop-shadow-sm transform group-hover:scale-110 transition-transform">🍖</div>
             <div className="flex items-baseline justify-center w-full">
                <input 
                  type="number"
                  value={protein}
                  onChange={(e) => handleInputChange(setProtein, e.target.value)}
                  className="w-14 bg-transparent text-center text-xl font-black text-gray-800 dark:text-white outline-none border-b border-transparent focus:border-gray-300 p-0"
                />
                <span className="text-sm font-bold text-gray-800 dark:text-white">g</span>
             </div>
             <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide pb-2">Predator Prep</span>
          </div>

          {/* Fiber */}
          <div className="bg-[#F5F2EA] dark:bg-dark-surface rounded-2xl p-3 pt-5 flex flex-col items-center gap-2 border border-[#EBEBEB] dark:border-white/5 relative group focus-within:ring-2 ring-light-primary/50 transition-all">
             <div className="text-3xl mb-1 filter drop-shadow-sm transform group-hover:scale-110 transition-transform">🥕</div>
             <div className="flex items-baseline justify-center w-full">
                <input 
                  type="number"
                  value={fiber}
                  onChange={(e) => handleInputChange(setFiber, e.target.value)}
                  className="w-12 bg-transparent text-center text-xl font-black text-gray-800 dark:text-white outline-none border-b border-transparent focus:border-gray-300 p-0"
                />
                <span className="text-sm font-bold text-gray-800 dark:text-white">g</span>
             </div>
             <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide pb-2">Bunny Fuel</span>
          </div>

          {/* Water */}
          <div className="bg-[#F5F2EA] dark:bg-dark-surface rounded-2xl p-3 pt-5 flex flex-col items-center gap-2 border border-[#EBEBEB] dark:border-white/5 relative group focus-within:ring-2 ring-light-primary/50 transition-all">
             <div className="text-3xl mb-1 filter drop-shadow-sm transform group-hover:scale-110 transition-transform">💧</div>
             <div className="flex items-baseline justify-center w-full">
                <input 
                  type="number"
                  value={water}
                  onChange={(e) => handleInputChange(setWater, e.target.value)}
                  className="w-14 bg-transparent text-center text-xl font-black text-gray-800 dark:text-white outline-none border-b border-transparent focus:border-gray-300 p-0"
                />
                <span className="text-sm font-bold text-gray-800 dark:text-white">L</span>
             </div>
             <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide pb-2">Rainforest Mist</span>
          </div>
        </div>

        {/* Fasting Window Card */}
        <div className={`rounded-[2rem] p-5 border shadow-sm transition-all duration-300 ${fastingEnabled ? 'bg-[#FFFBEB] dark:bg-dark-surface border-[#FDE68A] dark:border-yellow-900/30' : 'bg-gray-50 dark:bg-gray-800 border-gray-100 opacity-90'}`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`size-10 rounded-full flex items-center justify-center ${fastingEnabled ? 'bg-[#A855F7] text-white' : 'bg-gray-200 text-gray-400'}`}>
                <span className="material-symbols-outlined text-[20px]">timelapse</span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-base text-gray-900 dark:text-white leading-none">Fasting Window</h3>
                <p className="text-[11px] text-gray-500 font-bold mt-1">16:8 Protocol</p>
              </div>
            </div>
            
            {/* Toggle Switch */}
            <button
              onClick={() => setFastingEnabled(!fastingEnabled)}
              className={`w-12 h-7 rounded-full relative transition-colors duration-300 focus:outline-none ${fastingEnabled ? 'bg-yellow-400' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
              <div className={`absolute top-1 size-5 bg-white rounded-full shadow-sm transition-all duration-300 ${fastingEnabled ? 'left-6' : 'left-1'}`}></div>
            </button>
          </div>
          
          {/* Timeline Bar */}
          <div className={`w-full transition-opacity duration-300 ${fastingEnabled ? 'opacity-100' : 'opacity-50 grayscale'}`}>
            {/* Labels */}
            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest mb-2 px-2">
              <span className="text-gray-400">Fasting</span>
              <span className="text-yellow-500 w-[50%] text-center">Eating Window</span>
              <span className="text-gray-400">Fasting</span>
            </div>
            
            {/* Bar Visual */}
            <div className="h-12 w-full flex rounded-xl overflow-hidden shadow-inner bg-gray-100 dark:bg-gray-700">
              {/* Left Fasting Block */}
              <div className="flex-[1] flex items-center justify-center">
                <span className="material-symbols-outlined text-gray-300 text-[16px]">bedtime</span>
              </div>
              
              {/* Eating Window Block */}
              <div className="flex-[2] bg-[#FDE68A] dark:bg-yellow-600 flex items-center justify-center relative">
                <span className="text-[10px] font-black text-gray-800 dark:text-white z-10 whitespace-nowrap">12 PM - 8 PM</span>
              </div>
              
              {/* Right Fasting Block */}
              <div className="flex-[1] flex items-center justify-center">
                <span className="material-symbols-outlined text-gray-300 text-[16px]">bedtime</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky CTA Button */}
      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-white via-white to-transparent dark:from-dark-bg dark:via-dark-bg z-30 pt-10">
        <button 
          onClick={() => onNavigate(Screen.HOME)}
          className="w-full h-14 bg-[#FACC15] hover:bg-yellow-300 text-black rounded-full font-black text-sm uppercase tracking-widest shadow-xl shadow-yellow-400/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
        >
          Lock in this Plan
          <span className="material-symbols-outlined text-xl font-bold">check</span>
        </button>
      </div>
    </div>
  );
};

export default PlanGeneration;
