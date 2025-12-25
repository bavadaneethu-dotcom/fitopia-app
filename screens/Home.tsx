
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
  const theme = themeStyles[character.themeColor] || themeStyles.blue;

  const getFastDuration = () => {
    if (!fastStartTime || !isFasting) return null;
    const diff = Math.max(0, currentTime.getTime() - fastStartTime.getTime());
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const fastDuration = getFastDuration();

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] dark:bg-dark-bg font-sans relative overflow-hidden transition-colors duration-300">
       <div className="flex-1 overflow-y-auto pb-28 px-6 no-scrollbar pt-6">
          
          {/* Main Character Hero Card */}
          <div onClick={() => onNavigate(Screen.COMPANIONS)} className={`w-full aspect-[16/10] rounded-[2.5rem] bg-gradient-to-br ${theme.bgGradient} relative overflow-hidden shadow-xl mb-6 group cursor-pointer transition-transform active:scale-[0.99]`}>
              
              {/* Badges Overlay */}
              <div className="absolute top-5 left-5 right-5 flex justify-between items-center z-20">
                  <div className="flex gap-2">
                      <div className="bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
                          <span className="size-2 bg-yellow-400 rounded-full animate-pulse"></span>
                          <span className="text-[9px] font-black text-white uppercase tracking-widest">Live Feed</span>
                      </div>
                  </div>
              </div>

              <div className="absolute inset-0 bg-cover bg-top transition-transform duration-700 group-hover:scale-[1.05]" style={{ backgroundImage: `url(${character.image})` }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 z-20">
                  <h1 className="text-4xl font-black text-white uppercase leading-none tracking-tighter mb-1 drop-shadow-md">{character.name}</h1>
                  <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold ${theme.textAccent} uppercase tracking-widest`}>{character.role}</span>
                  </div>
              </div>
          </div>

          {/* New Duty Status Card Section */}
          <div onClick={() => onNavigate(Screen.FASTING_TIMER)} className={`mb-6 p-6 rounded-[2.5rem] bg-white dark:bg-dark-surface shadow-md border-2 transition-all cursor-pointer active:scale-[0.98] relative overflow-hidden ${isFasting ? 'border-blue-400/30' : 'border-orange-100 dark:border-white/5'}`}>
              <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                      <div className={`size-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${isFasting ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-500'}`}>
                          <span className="material-symbols-outlined filled">{isFasting ? 'local_police' : 'home'}</span>
                      </div>
                      <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Patrol Status</p>
                          <h3 className={`text-xl font-black uppercase tracking-tight ${isFasting ? 'text-blue-600 dark:text-blue-400' : 'text-orange-500'}`}>
                              {isFasting ? 'ON DUTY' : 'OFF DUTY'}
                          </h3>
                      </div>
                  </div>
                  {isFasting && (
                      <div className="text-right">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Time</p>
                          <p className="text-lg font-black text-gray-800 dark:text-white font-mono">{fastDuration}</p>
                      </div>
                  )}
              </div>
              {/* Background Glow */}
              <div className={`absolute top-0 right-0 size-32 rounded-full blur-3xl opacity-10 pointer-events-none -mr-16 -mt-16 ${isFasting ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
          </div>

          <div className={`border-[3px] ${theme.border} ${theme.borderDark} rounded-[2.5rem] p-3 mb-6 relative`}>
              <div className={`absolute -top-3 left-6 bg-[#f8f9fa] dark:bg-dark-bg px-2 text-[10px] font-black uppercase tracking-widest ${theme.subText} ${theme.subTextDark}`}>Daily Vitals</div>
              <div className="grid grid-cols-2 gap-3">
                  <div onClick={() => onNavigate(Screen.FOOD_LOG)} className="bg-[#FDFBF7] dark:bg-dark-surface rounded-[2rem] p-5 relative overflow-hidden flex flex-col justify-between h-36 shadow-sm group active:scale-95 transition-all cursor-pointer">
                      <div className="size-10 rounded-full bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center mb-2 z-10">
                          <span className="material-symbols-outlined filled">donut_large</span>
                      </div>
                      <div className="relative z-10">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Fuel</p>
                          <div className="flex items-baseline gap-1">
                              <p className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">{totalCalories}</p>
                              <span className="text-[9px] font-bold text-gray-400">/ {dailyCalorieLimit}</span>
                          </div>
                      </div>
                  </div>
                  <div onClick={() => onNavigate(Screen.WATER_LOG)} className="bg-[#E0F2FE] dark:bg-blue-900/10 rounded-[2rem] p-5 relative overflow-hidden flex flex-col justify-between h-36 shadow-sm group active:scale-95 transition-all cursor-pointer">
                      <div className={`size-10 rounded-full flex items-center justify-center mb-2 z-10 backdrop-blur-sm bg-white/60 dark:bg-white/10 ${theme.iconText} dark:text-white`}>
                          <span className="material-symbols-outlined">water_drop</span>
                      </div>
                      <div className="relative z-10">
                          <p className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${theme.subText} ${theme.subTextDark}`}>Hydration</p>
                          <div className="flex items-baseline gap-1">
                              <p className={`text-3xl font-black tracking-tight ${theme.iconText} dark:text-white`}>{displayWater}</p>
                              <span className={`text-[10px] font-bold ${theme.subText} ${theme.subTextDark}`}>{waterUnit}</span>
                          </div>
                          <div className="w-full bg-white/50 dark:bg-white/10 h-1.5 mt-2 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all duration-1000 ${theme.progress}`} style={{ width: `${waterProgress}%` }}></div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div className="mb-8">
              <div className="flex items-center gap-2 mb-4 px-2"><span className="size-2 rounded-full bg-yellow-400 animate-pulse"></span><span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Control Deck</span></div>
              <div className="grid grid-cols-3 gap-3 h-28">
                  <DeckButton icon="monitor_weight" label="Bio" onClick={() => onNavigate(Screen.BIOMETRICS)} bg="bg-white dark:bg-dark-surface" />
                  <DeckButton icon="self_improvement" label="Mental" onClick={() => onNavigate(Screen.MANUAL_MEDITATION)} bg="bg-white dark:bg-dark-surface" />
                  <DeckButton icon="fitness_center" label="Active" onClick={() => onNavigate(Screen.MANUAL_WORKOUT)} bg="bg-white dark:bg-dark-surface" />
              </div>
          </div>
       </div>
    </div>
  );
};
const DeckButton: React.FC<{ icon: string; label: string; onClick: () => void; bg: string }> = ({ icon, label, onClick, bg }) => (
    <button onClick={onClick} className={`${bg} rounded-[2rem] flex flex-col items-center justify-center gap-1 shadow-sm border border-gray-100 dark:border-white/5 hover:border-gray-300 active:scale-95 transition-all group`}>
        <span className="material-symbols-outlined text-2xl text-gray-600 dark:text-gray-300 group-hover:scale-110 transition-transform">{icon}</span>
        <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</span>
    </button>
);
export default Home;
