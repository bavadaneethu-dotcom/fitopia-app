
import React, { useState, useMemo } from 'react';
import { Screen } from '../types';

interface ManualWorkoutEntryProps {
  onNavigate: (screen: Screen) => void;
  onManualLog?: (data: { title: string; icon: string; duration: string; calories?: number }) => void;
}

const BOGO_QUOTES = [
    "I've seen sloths chase suspects faster than you're picking a drill!",
    "Training isn't a musical! No singing allowed until you finish the set!",
    "Life is about work, rookie. Now stop looking at your phone and MOVE!",
    "If you want to be a real officer, you need more than just fluffy ears. You need GRIT.",
    "DISMISSED! ...Wait, I haven't even assigned the drill yet. Sit down.",
    "The Tundratown precinct called. They said they're doing double your reps."
];

const ManualWorkoutEntry: React.FC<ManualWorkoutEntryProps> = ({ onNavigate, onManualLog }) => {
  const [activity, setActivity] = useState('RUNNING');
  const [duration, setDuration] = useState('30');
  const [intensity, setIntensity] = useState(2);
  const [customSport, setCustomSport] = useState('');
  const [savedSports, setSavedSports] = useState<{name: string, icon: string}[]>([]);
  
  const bogoQuote = useMemo(() => BOGO_QUOTES[Math.floor(Math.random() * BOGO_QUOTES.length)], []);

  const sportsPresets = [
    { name: 'RUNNING', icon: '🏃' },
    { name: 'GYM', icon: '🏋️' },
    { name: 'SWIMMING', icon: '🏊' },
    { name: 'BOXING', icon: '🥊' },
    ...savedSports
  ].slice(0, 6);

  const handleLogActivity = () => {
      const name = customSport.trim().toUpperCase() || activity;
      const dur = `${duration}:00`;
      const baseCalories = parseInt(duration) * (intensity === 1 ? 5 : intensity === 2 ? 8 : 12);
      
      if (onManualLog) {
          onManualLog({ title: name, icon: '🏃', duration: dur, calories: baseCalories });
      }
  };

  const selectPreset = (preset: {name: string, icon: string}) => {
      setActivity(preset.name);
      setCustomSport(preset.name);
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-[#F0F4FF] dark:bg-dark-bg font-sans animate-fade-in text-slate-900 dark:text-white transition-colors duration-300">
      {/* Academy Background Overlay */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] size-96 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-[100px]"></div>
          <span className="absolute top-40 left-10 text-xl opacity-10 dark:opacity-5">🚔</span>
      </div>

      {/* Header */}
      <div className="relative z-20 flex flex-col items-center pt-10 px-6 gap-6 bg-white/60 dark:bg-dark-surface/60 backdrop-blur-md pb-4 border-b border-blue-100/50 dark:border-white/5 shadow-sm">
        <div className="w-full flex items-center justify-center relative">
            <div className="flex items-center gap-1.5 bg-white/80 dark:bg-white/10 px-4 py-1.5 rounded-full border border-blue-100 dark:border-white/10 shadow-sm">
                <span className="size-2 bg-blue-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">Academy Dispatch</span>
            </div>
            <button 
              onClick={() => onNavigate(Screen.HOME)}
              className="absolute right-0 size-10 rounded-full bg-white/80 dark:bg-white/10 shadow-sm flex items-center justify-center text-slate-900 dark:text-white"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
        </div>

        {/* Chief Briefing Pill */}
        <div className="w-full bg-slate-900/10 dark:bg-white/5 backdrop-blur-xl rounded-[2rem] p-4 border border-white/60 dark:border-white/5 shadow-lg flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl shadow-inner shrink-0">🐃</div>
            <div className="flex flex-col min-w-0">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-800 dark:text-blue-300">Chief's Briefing</p>
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 italic leading-tight">"{bogoQuote}"</p>
            </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col pt-4 pb-32 gap-6 relative z-10 overflow-y-auto no-scrollbar w-full px-6">
        
        {/* Manual Input Area */}
        <div className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md p-5 rounded-[2.5rem] border border-blue-100 dark:border-white/5 shadow-sm space-y-4">
            <label className="text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest ml-2">Record Completed Drill</label>
            <div className="flex flex-col gap-3">
                <input 
                    type="text" 
                    placeholder="Enter Drill Name (e.g. Sprinting)"
                    value={customSport}
                    onChange={(e) => setCustomSport(e.target.value)}
                    className="w-full h-14 px-6 rounded-2xl bg-white dark:bg-white/5 border border-blue-100 dark:border-white/10 text-sm font-bold outline-none focus:border-blue-400 dark:focus:border-blue-500 shadow-sm dark:text-white dark:placeholder:text-slate-500"
                />
            </div>
        </div>

        {/* Drill Presets (Quick Select) */}
        <section className="space-y-3">
            <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Training Presets</label>
                <span className="text-[10px] font-black text-blue-500 dark:text-blue-400 tracking-wider">TAP TO FILL</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
                {sportsPresets.map((preset) => (
                    <button
                        key={preset.name}
                        onClick={() => selectPreset(preset)}
                        className={`flex flex-col items-center gap-1.5 p-4 rounded-[1.8rem] transition-all duration-300 ${
                            customSport.toUpperCase() === preset.name 
                            ? 'bg-[#2563EB] text-white shadow-xl shadow-blue-500/30' 
                            : 'bg-white dark:bg-dark-surface shadow-sm border border-blue-50 dark:border-white/5 text-slate-400 dark:text-slate-500 hover:border-blue-200 dark:hover:border-white/20'
                        }`}
                    >
                        <span className="text-2xl">{preset.icon}</span>
                        <span className="text-[9px] font-black uppercase tracking-tight truncate w-full text-center">{preset.name}</span>
                    </button>
                ))}
            </div>
        </section>

        {/* Parameters Section */}
        <section className="bg-white/40 dark:bg-dark-surface/40 p-6 rounded-[2.5rem] border border-blue-100 dark:border-white/5 shadow-sm space-y-8">
            <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Drill Duration</label>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">{duration}</span>
                        <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase">Min</span>
                    </div>
                </div>
                <input 
                    type="range" min="1" max="120" value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full h-1.5 bg-blue-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-600"
                />
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Drill Intensity</label>
                <div className="flex bg-slate-100/50 dark:bg-black/40 p-1.5 rounded-[1.8rem] gap-1.5">
                    {[1, 2, 3].map(lvl => (
                        <button 
                            key={lvl}
                            onClick={() => setIntensity(lvl)}
                            className={`flex-1 h-12 rounded-[1.5rem] transition-all flex items-center justify-center ${
                                intensity === lvl 
                                ? 'bg-[#2563EB] text-white shadow-md'
                                : 'bg-transparent text-slate-400 dark:text-slate-500'
                            }`}
                        >
                            <span className="material-symbols-outlined text-xl filled">bolt</span>
                        </button>
                    ))}
                </div>
                <div className="flex justify-between px-2">
                    <span className="text-[8px] font-black text-gray-400 dark:text-slate-600 uppercase">Rookie</span>
                    <span className="text-[8px] font-black text-gray-400 dark:text-slate-600 uppercase">Officer</span>
                    <span className="text-[8px] font-black text-gray-400 dark:text-slate-600 uppercase">Elite</span>
                </div>
            </div>
        </section>
      </div>

      {/* Primary Log Button */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-30 bg-gradient-to-t from-[#F0F4FF] via-[#F0F4FF] to-transparent dark:from-dark-bg dark:via-dark-bg pt-10">
        <button 
            onClick={handleLogActivity}
            disabled={!customSport && !activity}
            className="w-full h-20 rounded-[2.5rem] bg-[#2563EB] text-white shadow-2xl shadow-blue-500/30 active:scale-[0.98] transition-all flex flex-col items-center justify-center group disabled:opacity-50"
        >
            <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl filled">add_task</span>
                <span className="text-xl font-black uppercase tracking-[0.15em]">Log Drill Entry</span>
            </div>
            <span className="text-[8px] font-black opacity-60 uppercase tracking-[0.3em] mt-1">Authorized by ZPD Precinct 1</span>
        </button>
      </div>
    </div>
  );
};

export default ManualWorkoutEntry;
