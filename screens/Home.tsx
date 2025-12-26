
import React, { useState, useEffect } from 'react';
import { Character, Screen, ActivityLog, FoodLogItem, WaterLogItem } from '../types';

interface HomeProps {
  character: Character;
  onNavigate: (screen: Screen) => void;
  onStartSession: (screen: Screen, data: { title: string; icon: string; duration?: string; color?: string }) => void;
  workoutLogs: ActivityLog[];
  meditationLogs: ActivityLog[];
  foodLogs: FoodLogItem[];
  waterLogs: WaterLogItem[];
  isFasting: boolean;
  fastStartTime: Date | null;
  unitSystem: 'metric' | 'imperial';
  dailyCalorieLimit: number;
}

const themeStyles: Record<string, { bgGradient: string; textAccent: string; border: string; borderDark: string; subText: string; subTextDark: string; progress: string; iconBg: string; iconText: string; }> = {
    blue: { bgGradient: 'from-blue-600 to-blue-800', textAccent: 'text-blue-200', border: 'border-blue-100', borderDark: 'dark:border-blue-900/30', subText: 'text-blue-400', subTextDark: 'dark:text-blue-300', progress: 'bg-blue-500', iconBg: 'bg-blue-500/10', iconText: 'text-blue-500' },
    green: { bgGradient: 'from-emerald-500 to-emerald-800', textAccent: 'text-emerald-100', border: 'border-emerald-100', borderDark: 'dark:border-emerald-900/30', subText: 'text-emerald-500', subTextDark: 'dark:text-emerald-300', progress: 'bg-emerald-500', iconBg: 'bg-emerald-500/10', iconText: 'text-emerald-600' },
    orange: { bgGradient: 'from-orange-500 to-red-600', textAccent: 'text-orange-100', border: 'border-orange-100', borderDark: 'dark:border-orange-900/30', subText: 'text-orange-500', subTextDark: 'dark:text-orange-300', progress: 'bg-orange-500', iconBg: 'bg-orange-500/10', iconText: 'text-orange-600' },
    gray: { bgGradient: 'from-slate-600 to-slate-800', textAccent: 'text-slate-300', border: 'border-slate-200', borderDark: 'dark:border-slate-800/30', subText: 'text-slate-500', subTextDark: 'dark:text-slate-400', progress: 'bg-slate-500', iconBg: 'bg-slate-500/10', iconText: 'text-slate-700' },
    brown: { bgGradient: 'from-amber-700 to-yellow-900', textAccent: 'text-amber-200', border: 'border-amber-100', borderDark: 'dark:border-amber-900/30', subText: 'text-amber-600', subTextDark: 'dark:text-amber-400', progress: 'bg-amber-600', iconBg: 'bg-amber-600/10', iconText: 'text-amber-700' }
};

const Home: React.FC<HomeProps> = ({ character, onNavigate, onStartSession, workoutLogs, meditationLogs, foodLogs, waterLogs, isFasting, fastStartTime, unitSystem, dailyCalorieLimit }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalCalories = foodLogs.reduce((acc, item) => acc + item.calories, 0);
  const totalWaterMl = waterLogs.reduce((acc, item) => acc + item.amount, 0);
  const displayWater = unitSystem === 'metric' ? (totalWaterMl / 1000).toFixed(1) : Math.round(totalWaterMl * 0.033814).toString();
  const waterUnit = unitSystem === 'metric' ? 'L' : 'oz';
  const waterTargetMl = 2500;
  const waterProgress = Math.min((totalWaterMl / waterTargetMl) * 100, 100);

  const getFastDuration = () => {
    if (!fastStartTime || !isFasting) return null;
    const diff = Math.max(0, currentTime.getTime() - fastStartTime.getTime());
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const fastDuration = getFastDuration();
  const caloriePercent = Math.min((totalCalories / dailyCalorieLimit) * 100, 100);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-dark-bg font-sans relative overflow-hidden transition-colors duration-300">
       <div className="flex-1 overflow-y-auto pb-28 px-6 no-scrollbar pt-6">
          
          {/* Main Character Hero Card */}
          <div onClick={() => onNavigate(Screen.COMPANIONS)} className={`w-full aspect-[16/11] rounded-[2.5rem] bg-[#E5E5E5] dark:bg-[#2C2C2E] relative overflow-hidden shadow-xl mb-6 group cursor-pointer transition-transform active:scale-[0.99]`}>
              <div className="absolute top-5 left-5 z-20">
                  <div className="bg-black/20 dark:bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/20">
                      <span className="size-2 bg-yellow-400 rounded-full animate-pulse"></span>
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">Live Feed</span>
                  </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:scale-105 transition-transform duration-500">
                   <img src={character.image} className="h-full w-full object-cover object-top" alt={character.name} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 z-20 text-left">
                  <h1 className="text-4xl font-black text-white uppercase leading-none tracking-tighter mb-1">{character.name}</h1>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none">{character.role}</p>
              </div>
          </div>

          {/* Patrol Status Card */}
          <div onClick={() => onNavigate(Screen.FASTING_TIMER)} className={`mb-6 p-6 rounded-[2.5rem] bg-[#F9F9F9] dark:bg-[#1C1C1E] shadow-sm border border-gray-100 dark:border-white/5 transition-all cursor-pointer active:scale-[0.98] relative overflow-hidden`}>
              <div className="flex items-center gap-5 relative z-10 text-left">
                  <div className={`size-14 rounded-2xl flex items-center justify-center text-2xl bg-[#FEF3C7] dark:bg-[#2C2C2E] text-orange-600 dark:text-orange-400 shadow-sm`}>
                      <span className="material-symbols-outlined filled">{isFasting ? 'local_police' : 'home'}</span>
                  </div>
                  <div className="flex flex-col">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Patrol Status</p>
                      <h3 className={`text-2xl font-black uppercase tracking-tight ${isFasting ? 'text-blue-500' : 'text-[#F97316]'}`}>
                          {isFasting ? 'ON DUTY' : 'OFF DUTY'}
                      </h3>
                  </div>
                  {isFasting && (
                    <div className="ml-auto text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active</p>
                        <p className="text-sm font-black text-gray-800 dark:text-white font-mono">{fastDuration}</p>
                    </div>
                  )}
              </div>
          </div>

          {/* Vitals Section */}
          <div className="border border-blue-500/10 dark:border-blue-500/20 rounded-[2.5rem] p-1.5 mb-6 bg-[#F8FAFC] dark:bg-[#0A0A0A]">
              <div className="px-6 py-2.5 flex items-center gap-2 text-left">
                   <h3 className="text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-[0.2em]">Daily Vitals</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                  {/* Fuel Card */}
                  <div onClick={() => onNavigate(Screen.FOOD_LOG)} className="bg-white dark:bg-[#1C1C1E] rounded-[2rem] p-6 flex flex-col gap-6 shadow-sm active:scale-95 transition-all cursor-pointer h-40 text-left">
                      <div className="relative size-12">
                          <svg className="size-full transform -rotate-90" viewBox="0 0 40 40">
                              <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="4" className="text-gray-100 dark:text-gray-800" />
                              <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="113" strokeDashoffset={113 - (113 * caloriePercent / 100)} className="text-yellow-400 transition-all duration-1000" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                              <span className="material-symbols-outlined text-yellow-400 text-lg filled">donut_large</span>
                          </div>
                      </div>
                      <div className="flex flex-col">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Fuel</p>
                          <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">{totalCalories}</span>
                              <span className="text-[10px] font-bold text-gray-400">/ {dailyCalorieLimit}</span>
                          </div>
                      </div>
                  </div>

                  {/* Hydration Card */}
                  <div onClick={() => onNavigate(Screen.WATER_LOG)} className="bg-white dark:bg-[#1C1C1E] rounded-[2rem] p-6 flex flex-col gap-6 shadow-sm active:scale-95 transition-all cursor-pointer h-40 border border-gray-50 dark:border-white/5 text-left">
                      <div className="size-12 rounded-full flex items-center justify-center bg-blue-50 dark:bg-blue-600/10 text-blue-500">
                          <span className="material-symbols-outlined text-3xl">water_drop</span>
                      </div>
                      <div className="flex flex-col">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Hydration</p>
                          <div className="flex items-baseline gap-0.5">
                              <span className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">{displayWater}</span>
                              <span className="text-sm font-black text-blue-500 ml-0.5">{waterUnit}</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-white/5 h-1 mt-2 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${waterProgress}%` }}></div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Control Deck */}
          <div className="mb-10 text-left">
              <div className="flex items-center gap-2 mb-4 px-2">
                   <span className="size-2 rounded-full bg-yellow-400 animate-pulse"></span>
                   <h3 className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">Control Deck</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                  <DeckButton icon="monitor_weight" label="Bio" onClick={() => onNavigate(Screen.BIOMETRICS)} />
                  <DeckButton icon="self_improvement" label="Mental" onClick={() => onNavigate(Screen.MANUAL_MEDITATION)} />
                  <DeckButton icon="fitness_center" label="Active" onClick={() => onNavigate(Screen.MANUAL_WORKOUT)} />
              </div>
          </div>
       </div>
    </div>
  );
};

const DeckButton: React.FC<{ icon: string; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="bg-[#F8F9FA] dark:bg-[#1C1C1E] rounded-[2rem] h-28 flex flex-col items-center justify-center gap-2 shadow-sm border border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-[#2C2C2E] active:scale-95 transition-all group">
        <span className="material-symbols-outlined text-2xl text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors">{icon}</span>
        <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{label}</span>
    </button>
);

export default Home;
