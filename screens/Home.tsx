
import React, { useState, useEffect } from 'react';
import { Character, Screen, ActivityLog, FoodLogItem, WaterLogItem } from '../types';

interface HomeProps {
  character: Character;
  onNavigate: (screen: Screen) => void;
  onStartSession: (screen: Screen, data: any) => void;
  workoutLogs: ActivityLog[];
  meditationLogs: ActivityLog[];
  foodLogs: FoodLogItem[];
  waterLogs: WaterLogItem[];
  isFasting: boolean;
  fastStartTime: Date | null;
  unitSystem: 'metric' | 'imperial';
  dailyCalorieLimit: number;
}

const Home: React.FC<HomeProps> = ({ character, onNavigate, foodLogs, waterLogs, isFasting, fastStartTime, dailyCalorieLimit, unitSystem }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalCalories = foodLogs.reduce((acc, item) => acc + item.calories, 0);
  const totalWaterMl = waterLogs.reduce((acc, item) => acc + item.amount, 0);
  const displayWater = unitSystem === 'metric' ? (totalWaterMl / 1000).toFixed(1) : Math.round(totalWaterMl * 0.033814).toString();
  const waterProgress = Math.min((totalWaterMl / 2500) * 100, 100);

  const getFastDuration = () => {
    if (!fastStartTime || !isFasting) return "00:00:00";
    const diff = Math.max(0, currentTime.getTime() - fastStartTime.getTime());
    const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
    const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="flex flex-col h-full bg-[#F1F5F9] dark:bg-dark-bg font-sans p-6 no-scrollbar transition-colors">
       <header className="flex justify-between items-center mb-8 pt-4">
          <div>
            <p className="text-[10px] font-black text-zpd-muted uppercase tracking-[0.3em]">Sector 4-Dist</p>
            <h1 className="text-3xl font-black text-zpd-navy dark:text-white tracking-tighter italic uppercase transform -skew-x-12">Fitopia Terminal</h1>
          </div>
          <button onClick={() => onNavigate(Screen.PROFILE)} className="relative group active:scale-95 transition-transform">
             <div className="size-14 rounded-full border-4 border-white dark:border-dark-surface shadow-xl overflow-hidden bg-white">
                <img src={character.image} className="w-full h-full object-cover object-top" alt="Officer" />
             </div>
             <div className="absolute -bottom-1 -right-1 size-6 bg-zpd-gold rounded-full flex items-center justify-center border-2 border-white text-[10px] font-black text-zpd-navy shadow-lg">5</div>
          </button>
       </header>

       {/* Live Duty Card - Restored to high-fidelity blue flash style */}
       <div onClick={() => onNavigate(Screen.FASTING_TIMER)} className={`relative overflow-hidden p-6 rounded-[2.5rem] shadow-2xl transition-all active:scale-[0.98] cursor-pointer mb-6 ${isFasting ? 'bg-zpd-blue text-white' : 'bg-white dark:bg-dark-surface border-2 border-white dark:border-white/5'}`}>
          <div className="relative z-10 flex justify-between items-center">
             <div className="flex items-center gap-4">
                <div className={`size-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${isFasting ? 'bg-white/20' : 'bg-zpd-blue/10 text-zpd-blue'}`}>
                   <span className="material-symbols-outlined filled">{isFasting ? 'local_police' : 'home'}</span>
                </div>
                <div>
                   <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isFasting ? 'text-white/70' : 'text-zpd-muted'}`}>Patrol Status</p>
                   <h3 className="text-2xl font-black uppercase tracking-tight">{isFasting ? 'On Duty' : 'Off Duty'}</h3>
                </div>
             </div>
             {isFasting && (
                <div className="text-right">
                   <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Active Shift</p>
                   <p className="text-xl font-black font-mono tracking-tighter">{getFastDuration()}</p>
                </div>
             )}
          </div>
          {isFasting && <div className="absolute bottom-0 left-0 h-1.5 bg-white/30 w-full overflow-hidden"><div className="h-full bg-white animate-shine w-1/3"></div></div>}
       </div>

       {/* Vitals Grid - Restored to vibrant flash-card style icons */}
       <div className="grid grid-cols-2 gap-4 mb-6">
          <VitalCard icon="donut_large" label="Fuel" val={totalCalories} target={dailyCalorieLimit} unit="Kcal" color="text-orange-500" bg="bg-white dark:bg-dark-surface" onClick={() => onNavigate(Screen.FOOD_LOG)} />
          <VitalCard icon="water_drop" label="Water" val={displayWater} progress={waterProgress} unit={unitSystem === 'metric' ? 'L' : 'oz'} color="text-zpd-blue" bg="bg-white dark:bg-dark-surface" onClick={() => onNavigate(Screen.WATER_LOG)} />
       </div>

       {/* Duty Roster - Quick Actions */}
       <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] p-6 shadow-sm border border-white dark:border-white/5 mb-8">
          <h3 className="text-[10px] font-black text-zpd-muted uppercase tracking-[0.2em] mb-6 pl-2">Duty Roster</h3>
          <div className="grid grid-cols-3 gap-4 h-28">
             <DeckButton icon="fitness_center" label="Training" color="text-red-500" onClick={() => onNavigate(Screen.MANUAL_WORKOUT)} />
             <DeckButton icon="self_improvement" label="Oasis" color="text-teal-500" onClick={() => onNavigate(Screen.MANUAL_MEDITATION)} />
             <DeckButton icon="monitor_weight" label="Bio-Scan" color="text-indigo-500" onClick={() => onNavigate(Screen.BIOMETRICS)} />
          </div>
       </div>

       {/* Character Quote */}
       <div className="bg-zpd-gold/10 dark:bg-zpd-gold/5 p-5 rounded-3xl border-2 border-dashed border-zpd-gold/30 relative">
          <p className="text-sm font-bold italic text-zpd-navy/70 dark:text-zpd-gold/70 leading-relaxed">
             "{character.quotes[0]}"
          </p>
          <span className="absolute -top-3 -right-2 text-4xl opacity-20">👮</span>
       </div>
    </div>
  );
};

const VitalCard: React.FC<{ icon: string, label: string, val: any, target?: number, progress?: number, unit: string, color: string, bg: string, onClick: () => void }> = ({ icon, label, val, target, progress, unit, color, bg, onClick }) => (
   <button onClick={onClick} className={`${bg} p-5 rounded-[2.5rem] flex flex-col justify-between h-44 shadow-lg border border-white dark:border-white/5 transition-transform active:scale-95 text-left group overflow-hidden relative`}>
      <div className={`size-12 rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-black/20 ${color} shadow-inner transition-transform group-hover:scale-110`}>
         <span className="material-symbols-outlined filled text-2xl">{icon}</span>
      </div>
      <div className="mt-4">
         <p className="text-[10px] font-black text-zpd-muted uppercase tracking-widest mb-1">{label}</p>
         <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-black text-zpd-navy dark:text-white tracking-tight`}>{val}</span>
            <span className="text-[9px] font-bold opacity-40 uppercase">{unit} {target ? `/ ${target}` : ''}</span>
         </div>
         {progress !== undefined && (
            <div className="w-full h-2 bg-gray-100 dark:bg-white/10 rounded-full mt-3 overflow-hidden shadow-inner">
               <div className={`h-full ${color.replace('text', 'bg')} rounded-full transition-all duration-1000`} style={{ width: `${progress}%` }}></div>
            </div>
         )}
      </div>
   </button>
);

const DeckButton: React.FC<{ icon: string, label: string, color: string, onClick: () => void }> = ({ icon, label, color, onClick }) => (
   <button onClick={onClick} className="flex flex-col items-center justify-center gap-2 group">
      <div className="size-16 rounded-[1.5rem] bg-[#F8FAFC] dark:bg-black/20 flex items-center justify-center border-2 border-transparent group-hover:border-zpd-gold transition-all shadow-inner">
         <span className={`material-symbols-outlined text-3xl ${color} group-hover:scale-110 transition-transform`}>{icon}</span>
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest text-zpd-muted">{label}</span>
   </button>
);

export default Home;
