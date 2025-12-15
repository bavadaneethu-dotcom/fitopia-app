
import React from 'react';
import { FoodLogItem, ActivityLog, Screen } from '../types';

interface AnalyticsProps {
  foodLogs: FoodLogItem[];
  workoutLogs: ActivityLog[];
  meditationLogs: ActivityLog[];
  onNavigate: (screen: Screen) => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ foodLogs, workoutLogs, meditationLogs, onNavigate }) => {
  const dailyCalorieLimit = 2200;
  const currentCalories = foodLogs.reduce((acc, item) => acc + item.calories, 0);
  const remainingCalories = Math.max(0, dailyCalorieLimit - currentCalories);
  const progressPercent = Math.min((currentCalories / dailyCalorieLimit) * 100, 100);

  // Calculate Macros
  const totalProtein = foodLogs.reduce((acc, item) => acc + (item.macros?.protein || 0), 0);
  const totalCarbs = foodLogs.reduce((acc, item) => acc + (item.macros?.carbs || 0), 0);
  const totalFat = foodLogs.reduce((acc, item) => acc + (item.macros?.fat || 0), 0);

  // Targets (Mock targets)
  const targetProtein = 150;
  const targetCarbs = 250;
  const targetFat = 70;

  return (
    <div className="flex flex-col gap-6 px-6 pt-2 animate-fade-in pb-10">
      
      {/* Top Banner - Character Feedback */}
      <div className="relative overflow-hidden rounded-[1.5rem] bg-light-surface dark:bg-dark-surface border border-light-primary/20 dark:border-dark-primary/20 p-5 shadow-sm group">
        <div className="absolute top-0 right-0 bg-light-primary/10 dark:bg-dark-primary/10 px-3 py-1 rounded-bl-xl">
             <span className="text-[9px] font-bold uppercase tracking-widest text-light-primary dark:text-dark-primary">Case Update</span>
        </div>
        <div className="flex gap-4 items-start relative z-10 pt-2">
          <div className="relative shrink-0">
            <div className="size-14 rounded-xl bg-cover bg-center border-2 border-white dark:border-gray-600 shadow-md transform -rotate-3 group-hover:rotate-0 transition-transform duration-300" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD_hKVdvi_hN5TeA1YCgL3QHscmGS2anT0qakyn4nbToja03M9nTthocwJk1wTZzBlGeQcmLMVhCUiYGKPD7sCJcH_wg4hKQrzn5Yp3qwFyjHgh5oN_Cp6HQbUWmzjMFoZPEvbc5C6kAp6tIuB586d3wHnVeIGkcrekZiIA6E2ZTcJAlaAoKGzh2TOGEMzsT0Z6dJa1Kza4zOcvDvMbg5B8_8CLNtLtMgEDOSinFexwCtMVyorX-wdgCfz-VkrAPP0tmLlkaHxlIb-V")' }}></div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm leading-relaxed text-light-text dark:text-dark-text font-medium italic">
              "Great hustle! You're <span className="font-bold text-light-primary dark:text-dark-primary bg-light-primary/10 dark:bg-dark-primary/10 px-1 rounded">{Math.max(0, targetProtein - Math.round(totalProtein))}g</span> of protein away from closing this case. Let's grab a snack! 🥕"
            </p>
            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wide">— Officer Hopps</p>
          </div>
        </div>
      </div>

      {/* Calories Card - Case File Style */}
      <div className="bg-[#fdfbf7] dark:bg-[#1a202c] rounded-[2rem] p-6 shadow-sm border-2 border-dashed border-gray-300 dark:border-gray-600 font-mono relative overflow-hidden transition-all duration-500">
        <div className="absolute top-6 right-6 opacity-10 pointer-events-none">
             <span className="material-symbols-outlined text-8xl text-black dark:text-white">folder</span>
        </div>

        <div className="flex items-center justify-between mb-6 relative z-10">
             <div>
                 <h3 className="text-lg font-black text-gray-800 dark:text-white uppercase tracking-tight">Fuel Intake</h3>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Daily Limit: {dailyCalorieLimit}</p>
             </div>
             <div className="bg-gray-800 dark:bg-white text-white dark:text-gray-900 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">
                 In Progress
             </div>
        </div>

        <div className="flex items-end gap-2 mb-4 relative z-10">
            <span className="text-6xl font-black text-light-text dark:text-white tracking-tighter leading-none transition-all duration-700">{currentCalories}</span>
            <span className="text-sm font-bold text-gray-400 mb-1.5 uppercase">kcal</span>
        </div>

        <div className="relative h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-6 border border-black/5 dark:border-white/5 z-10">
             {/* Striped progress bar pattern */}
            <div className="absolute top-0 left-0 h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-20"></div>
            <div 
                className="absolute top-0 left-0 h-full bg-yellow-400 dark:bg-yellow-500 transition-all duration-1000 ease-out flex items-center justify-end pr-2" 
                style={{ width: `${progressPercent}%` }}
            >
                <div className="h-full w-2 bg-white/30"></div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="bg-white dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/10">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Consumed</span>
                <span className="text-xl font-black text-gray-800 dark:text-white">{currentCalories}</span>
            </div>
            <div className="bg-white dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/10">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Remaining</span>
                <span className="text-xl font-black text-gray-800 dark:text-white">{remainingCalories}</span>
            </div>
        </div>
      </div>

      {/* Macros Grid */}
      <div>
        <div className="flex items-center gap-2 mb-3 px-2">
            <span className="size-2 bg-yellow-400 dark:bg-yellow-500 rounded-full"></span>
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Chemical Analysis</h2>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <MacroCard label="Protein" current={Math.round(totalProtein)} total={targetProtein} color="text-yellow-400" />
          <MacroCard label="Carbs" current={Math.round(totalCarbs)} total={targetCarbs} color="text-blue-400" />
          <MacroCard label="Fat" current={Math.round(totalFat)} total={targetFat} color="text-orange-400" />
        </div>
      </div>

      {/* Recent Evidence (Meals) */}
      <div>
        <div className="flex justify-between items-center mb-3 px-2">
           <div className="flex items-center gap-2">
                <span className="size-2 bg-yellow-400 dark:bg-yellow-500 rounded-full"></span>
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Evidence Log (Food)</h2>
            </div>
        </div>
        
        {foodLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl opacity-60">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">No evidence collected</p>
            </div>
        ) : (
            <div className="flex flex-col gap-3">
                {foodLogs.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start p-3 bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                        <div className="size-16 rounded-xl bg-gray-100 dark:bg-white/10 shrink-0 overflow-hidden shadow-inner flex items-center justify-center text-3xl">
                            {item.icon}
                        </div>
                        <div className="flex-1 min-w-0 py-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-light-text dark:text-dark-text truncate pr-2 text-sm">{item.name}</h4>
                                <span className="text-xs font-black text-yellow-500 dark:text-yellow-400 whitespace-nowrap">{item.calories} kcal</span>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 uppercase tracking-wide border border-gray-200 dark:border-white/5">{item.timestamp}</span>
                                {item.displayAmount && <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 uppercase tracking-wide border border-gray-200 dark:border-white/5">{item.displayAmount}</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Workout Logs */}
      <div>
        <div className="flex justify-between items-center mb-3 px-2 pt-2">
           <div className="flex items-center gap-2">
                <span className="size-2 bg-orange-500 rounded-full"></span>
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Training Log</h2>
            </div>
            <button 
                onClick={() => onNavigate(Screen.WORKOUT_HISTORY)}
                className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded uppercase tracking-wide hover:bg-orange-500/20 transition-colors"
            >
                View All
            </button>
        </div>
        {workoutLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl opacity-60">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">No training missions</p>
            </div>
        ) : (
            <div className="flex flex-col gap-3">
                {workoutLogs.slice(0, 3).map((log, idx) => (
                    <div key={log.id} className="flex items-center gap-3 p-3 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                        <div className={`size-10 rounded-xl flex items-center justify-center text-xl shadow-inner ${log.color ? `bg-${log.color}-100 text-${log.color}-600 dark:bg-${log.color}-900/20 dark:text-${log.color}-300` : 'bg-orange-100 text-orange-600'}`}>
                            {log.icon}
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-800 dark:text-white leading-tight">{log.title}</h4>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{log.timestamp}</span>
                                <span className="size-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{log.duration}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="font-black text-gray-800 dark:text-white">{log.calories || '-'}</span>
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">kcal</span>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Mindfulness Logs */}
      <div>
        <div className="flex justify-between items-center mb-3 px-2 pt-2">
           <div className="flex items-center gap-2">
                <span className="size-2 bg-teal-500 rounded-full"></span>
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Mindfulness Log</h2>
            </div>
            <button 
                onClick={() => onNavigate(Screen.MINDFULNESS_HISTORY)}
                className="text-[10px] font-bold text-teal-500 bg-teal-500/10 px-2 py-1 rounded uppercase tracking-wide hover:bg-teal-500/20 transition-colors"
            >
                View All
            </button>
        </div>
        {meditationLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl opacity-60">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">No sessions recorded</p>
            </div>
        ) : (
            <div className="flex flex-col gap-3">
                {meditationLogs.slice(0, 3).map((log, idx) => (
                    <div key={log.id} className="flex items-center gap-3 p-3 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                        <div className="size-10 rounded-xl bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xl shadow-inner">
                            {log.icon}
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-800 dark:text-white leading-tight">{log.title}</h4>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{log.timestamp}</span>
                        </div>
                        <div className="bg-teal-50 dark:bg-teal-900/20 px-2.5 py-1 rounded-lg text-teal-700 dark:text-teal-300 text-xs font-black">
                            {log.duration}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

    </div>
  );
};

const MacroCard: React.FC<{ label: string; current: number; total: number; color: string }> = ({ label, current, total, color }) => {
  const percent = Math.min((current / total) * 100, 100);
  
  return (
    <div className="bg-light-surface dark:bg-dark-surface rounded-2xl p-4 flex flex-col items-center gap-3 border border-light-primary/10 dark:border-dark-primary/10 shadow-sm relative overflow-hidden transition-all duration-500 hover:scale-105">
      <div className="relative size-16">
        <svg className="size-full transform -rotate-90" viewBox="0 0 36 36">
          <path className="text-gray-200 dark:text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
          <path 
            className={`${color} transition-all duration-1000 ease-out`} 
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
            fill="none" 
            stroke="currentColor" 
            strokeDasharray={`${percent}, 100`} 
            strokeLinecap="round" 
            strokeWidth="3"
          ></path>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-[10px] font-black text-light-text dark:text-dark-text">{Math.round(percent)}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-light-text dark:text-dark-text text-xs font-black uppercase tracking-wide">{label}</p>
        <p className="text-[10px] text-light-muted dark:text-dark-muted mt-0.5 font-mono">{current}/{total}g</p>
      </div>
    </div>
  );
};

export default Analytics;
