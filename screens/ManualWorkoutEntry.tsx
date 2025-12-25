
import React, { useState } from 'react';
import { Screen } from '../types';

interface ManualWorkoutEntryProps {
  onNavigate: (screen: Screen) => void;
  onStartSession: (screen: Screen, data: { title: string; icon: string; duration?: string; color?: string }) => void;
}

const ManualWorkoutEntry: React.FC<ManualWorkoutEntryProps> = ({ onNavigate, onStartSession }) => {
  const [activity, setActivity] = useState('');
  const [duration, setDuration] = useState('30');

  // Updated presets
  const sportsPresets = [
    { name: 'Football', icon: '⚽', color: 'green' },
    { name: 'Cricket', icon: '🏏', color: 'blue' },
    { name: 'Basketball', icon: '🏀', color: 'orange' },
    { name: 'Tennis', icon: '🎾', color: 'yellow' },
    { name: 'Running', icon: '🏃', color: 'red' },
    { name: 'Swimming', icon: '🏊', color: 'blue' },
    { name: 'Cycling', icon: '🚴', color: 'yellow' },
    { name: 'Boxing', icon: '🥊', color: 'red' },
    { name: 'Badminton', icon: '🏸', color: 'green' },
    { name: 'Gym', icon: '🏋️', color: 'gray' },
  ];

  const handleStart = () => {
    const selectedPreset = sportsPresets.find(p => p.name === activity);
    onStartSession(Screen.WORKOUT_TIMER, {
      title: activity || 'Workout',
      icon: selectedPreset?.icon || '💪',
      color: selectedPreset?.color || 'blue' 
    });
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-light-bg dark:bg-dark-bg font-sans animate-fade-in transition-colors duration-300">
       {/* Background Ambience */}
       <div className="absolute inset-0 bg-gradient-to-b from-light-surface to-light-bg dark:from-dark-surface dark:to-dark-bg pointer-events-none"></div>
       <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6 pt-10">
        <div className="size-12"></div>
        <div className="flex items-center gap-2 px-3 py-1 bg-light-surface dark:bg-dark-surface border border-light-primary/20 dark:border-dark-primary/20 rounded-full shadow-sm">
             <span className="size-2 bg-light-primary dark:bg-dark-primary rounded-full animate-pulse"></span>
             <span className="text-[10px] font-black uppercase tracking-widest text-light-text dark:text-white">Academy Uplink</span>
        </div>
        <button 
          onClick={() => onNavigate(Screen.HOME)}
          className="size-12 rounded-full bg-white/40 dark:bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/60 dark:hover:bg-white/20 transition-colors border border-white/20 dark:border-white/5 shadow-sm"
        >
          <span className="material-symbols-outlined text-light-text dark:text-white">close</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col pt-4 gap-8 relative z-10 overflow-y-auto no-scrollbar pb-20 w-full">
        <div className="text-center space-y-2 flex-shrink-0 px-6">
            <h2 className="text-3xl font-black text-light-text dark:text-white tracking-tight uppercase italic transform -skew-x-3">Mission Briefing</h2>
            <p className="text-light-muted dark:text-dark-muted text-sm font-bold uppercase tracking-wide">Configure training parameters.</p>
        </div>

        {/* Input Card */}
        <div className="mx-6 bg-light-surface dark:bg-dark-surface backdrop-blur-sm rounded-[2rem] p-6 shadow-xl border border-light-primary/10 dark:border-dark-primary/10 space-y-8 relative overflow-hidden flex-shrink-0">
            {/* Decoration Bar */}
            <div className="absolute top-0 left-0 w-1.5 h-full bg-light-primary dark:bg-dark-primary"></div>

            <div className="space-y-3">
                <label className="text-xs font-black text-light-muted dark:text-dark-muted uppercase tracking-widest ml-1">Operation Name</label>
                <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-light-primary dark:group-focus-within:text-dark-primary transition-colors">edit</span>
                    <input 
                        type="text" 
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                        placeholder="e.g. Traffic Chase"
                        className="w-full h-16 pl-12 pr-4 rounded-xl bg-white dark:bg-black/20 border-2 border-transparent focus:border-light-primary dark:focus:border-dark-primary text-lg font-bold text-light-text dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 outline-none transition-all uppercase tracking-wide shadow-inner"
                    />
                </div>

                {/* Sports Presets */}
                <div className="pt-2">
                    <p className="text-[10px] font-black text-light-muted/70 dark:text-dark-muted/70 uppercase tracking-widest mb-2 ml-1">Standard Ops</p>
                    <div className="flex flex-wrap gap-2">
                        {sportsPresets.map((sport) => (
                            <button
                                key={sport.name}
                                onClick={() => setActivity(sport.name)}
                                className={`px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wide border-2 transition-all flex items-center gap-1.5 ${
                                    activity === sport.name 
                                    ? 'bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-bg border-light-primary dark:border-dark-primary shadow-md transform -skew-x-3' 
                                    : 'bg-white dark:bg-white/5 border-transparent hover:border-gray-200 dark:hover:border-white/10 text-gray-500 dark:text-gray-400'
                                }`}
                            >
                                <span className="text-sm">{sport.icon}</span>
                                {sport.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-xs font-black text-light-muted dark:text-dark-muted uppercase tracking-widest ml-1">Time Limit (Min)</label>
                <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-light-primary dark:group-focus-within:text-dark-primary transition-colors">timer</span>
                    <input 
                        type="number" 
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="30"
                        className="w-full h-16 pl-12 pr-4 rounded-xl bg-white dark:bg-black/20 border-2 border-transparent focus:border-light-primary dark:focus:border-dark-primary text-lg font-bold text-light-text dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 outline-none transition-all shadow-inner"
                    />
                </div>
                
                {/* Preset Chips */}
                 <div className="flex gap-2 justify-start overflow-x-auto no-scrollbar pt-2">
                    {[10, 20, 30, 45, 60].map(min => (
                        <button 
                            key={min}
                            onClick={() => setDuration(min.toString())}
                            className={`px-4 py-2 rounded-lg text-xs font-black border-2 transition-all ${duration === min.toString() ? 'bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-bg border-light-primary dark:border-dark-primary' : 'bg-transparent border-gray-200 dark:border-white/10 text-gray-400 hover:border-gray-300 dark:hover:border-white/20'}`}
                        >
                            {min}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Start Button */}
        <div className="mt-auto px-6">
            <button 
                onClick={handleStart}
                className="w-full h-20 rounded-[2rem] bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-bg shadow-xl shadow-light-primary/30 dark:shadow-dark-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group relative overflow-hidden"
            >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine"></div>
                
                <span className="material-symbols-outlined text-4xl filled relative z-10 group-hover:scale-110 transition-transform">play_arrow</span>
                <div className="flex flex-col items-start relative z-10">
                    <span className="text-xl font-black uppercase tracking-widest italic leading-none">Start Mission</span>
                    <span className="text-[10px] font-bold opacity-70 uppercase tracking-[0.2em]">Initiate Sequence</span>
                </div>
            </button>
        </div>
      </div>
    </div>
  );
};

export default ManualWorkoutEntry;
