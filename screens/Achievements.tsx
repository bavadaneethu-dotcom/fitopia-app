
import React, { useState } from 'react';
import { Screen, Character } from '../types';

interface AchievementsProps {
  onNavigate?: (screen: Screen) => void;
  inventory?: string[];
  activeCharacter: Character;
}

const themeStyles: Record<string, { 
    bgGradient: string; 
    textAccent: string;
    textPrimary: string;
    border: string; 
    iconBg: string;
    iconText: string;
}> = {
    blue: { bgGradient: 'from-blue-600 to-blue-800', textAccent: 'text-blue-100', textPrimary: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', iconBg: 'bg-blue-100 dark:bg-blue-900/30', iconText: 'text-blue-600 dark:text-blue-400' },
    green: { bgGradient: 'from-emerald-500 to-emerald-800', textAccent: 'text-emerald-100', textPrimary: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', iconBg: 'bg-emerald-100 dark:bg-emerald-900/30', iconText: 'text-emerald-600 dark:text-emerald-400' },
    orange: { bgGradient: 'from-orange-500 to-red-600', textAccent: 'text-orange-100', textPrimary: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800', iconBg: 'bg-orange-100 dark:bg-orange-900/30', iconText: 'text-orange-600 dark:text-orange-400' },
    gray: { bgGradient: 'from-slate-600 to-slate-800', textAccent: 'text-slate-300', textPrimary: 'text-slate-600 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-800', iconBg: 'bg-slate-100 dark:bg-slate-800/50', iconText: 'text-slate-600 dark:text-slate-400' },
    brown: { bgGradient: 'from-amber-700 to-yellow-900', textAccent: 'text-amber-200', textPrimary: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', iconBg: 'bg-amber-100 dark:bg-amber-900/30', iconText: 'text-amber-700 dark:text-amber-400' }
};

const Achievements: React.FC<AchievementsProps> = ({ onNavigate, inventory = [], activeCharacter }) => {
  const theme = themeStyles[activeCharacter.themeColor] || themeStyles.blue;
  
  const rewards = [
      { id: 'shades', icon: 'eyeglasses', title: 'Aviator Shades', subtitle: 'Accessory', unlocked: inventory.includes('shades') },
      { id: 'cap', icon: 'checkroom', title: 'ZPD Academy Cap', subtitle: 'Headgear', unlocked: inventory.includes('cap') },
      { id: 'watch', icon: 'watch', title: 'Smart Watch', subtitle: 'Gadget', unlocked: inventory.includes('watch') },
      { id: 'headband', icon: 'sports', title: 'Running Band', subtitle: 'Gear', unlocked: inventory.includes('headband') },
  ];

  return (
    <div className="flex flex-col gap-6 px-6 pt-6 pb-10 animate-fade-in relative">
      
      {/* Rewards Page Header - Close button removed as this is a main tab */}
      <div className="flex items-center justify-between px-2 mb-2">
          <div className="flex flex-col">
              <h2 className="text-2xl font-black text-gray-800 dark:text-white uppercase tracking-tighter italic">Rewards</h2>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Cadet Inventory</span>
          </div>
      </div>

      {/* Streak Header */}
      <div className="relative flex flex-col items-center justify-center py-8">
        <div className={`absolute inset-0 ${theme.iconBg} blur-3xl rounded-full scale-75 animate-pulse-slow opacity-50`}></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className={`size-20 bg-gradient-to-br ${theme.bgGradient} rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-dark-bg mb-3 animate-bounce`}>
              <span className="material-symbols-outlined text-white text-4xl filled" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
          </div>
          <h1 className="text-4xl font-black text-light-text dark:text-dark-text tracking-tight">7-Day Streak</h1>
          <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${theme.textPrimary}`}>Commendation Medal</p>
        </div>
      </div>

      {/* Hero Achievement Card */}
      <div className={`w-full relative overflow-hidden rounded-[2rem] bg-light-surface dark:bg-dark-surface shadow-lg border ${theme.border} group`}>
        <div className={`h-48 w-full bg-cover bg-top relative transition-transform duration-700 group-hover:scale-105`} style={{ backgroundImage: `url("${activeCharacter.image}")` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-light-surface dark:from-dark-surface via-transparent to-transparent"></div>
          <div className={`absolute inset-0 bg-gradient-to-b ${theme.bgGradient} opacity-30 mix-blend-overlay`}></div>
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20 shadow-sm flex items-center gap-2">
            <span className={`material-symbols-outlined text-sm filled ${theme.iconText}`} style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
            <span className="text-[10px] font-bold uppercase tracking-wide text-light-text dark:text-white">Lvl {activeCharacter.level} Unlocked</span>
          </div>
        </div>
        
        <div className="p-6 -mt-12 relative z-10">
          <div className="flex items-center gap-2 mb-2">
               <span className={`size-2 rounded-full animate-pulse ${theme.iconBg.replace('bg-', 'bg-').replace('/30', '')}`}></span>
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">New Milestone</h3>
          </div>
          <h3 className="text-2xl font-black text-light-text dark:text-dark-text leading-none mb-2">Hustle Award!</h3>
          <p className="text-sm text-light-muted dark:text-dark-muted font-medium italic leading-relaxed opacity-80">
            "{activeCharacter.quotes[0] || "Don't skip a single shift, rookie!"}"
          </p>
          <button 
            onClick={() => onNavigate?.(Screen.CLAIM_REWARD)}
            className={`w-full mt-6 bg-gradient-to-r ${theme.bgGradient} hover:brightness-110 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 uppercase text-xs tracking-wider`}
          >
            <span className="material-symbols-outlined text-lg">redeem</span>
            Collect New Gear
          </button>
        </div>
      </div>

      {/* Roadmap */}
      <div className="bg-[#fdfbf7] dark:bg-dark-surface p-6 rounded-[2rem] border-2 border-dashed border-gray-300 dark:border-gray-600 font-sans relative overflow-hidden">
        <h3 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-widest mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Reward Protocol</h3>
        <div className="space-y-4">
            {rewards.map((reward) => (
                <div key={reward.id} className={`flex items-center gap-4 ${reward.unlocked ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                    <div className="relative">
                        <div className={`size-12 rounded-xl flex items-center justify-center text-2xl border-2 ${reward.unlocked ? `${theme.iconBg} ${theme.border} ${theme.iconText}` : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-gray-700 text-gray-400'}`}>
                            <span className="material-symbols-outlined">{reward.icon}</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-black text-sm text-gray-800 dark:text-white uppercase">{reward.title}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{reward.subtitle}</p>
                    </div>
                    {!reward.unlocked && <span className="material-symbols-outlined text-gray-300">lock</span>}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
