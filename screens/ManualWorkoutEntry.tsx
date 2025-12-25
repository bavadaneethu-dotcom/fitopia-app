
import React, { useState } from 'react';
import { Screen } from '../types';

interface ManualWorkoutEntryProps {
  onNavigate: (screen: Screen) => void;
  onStartSession: (screen: Screen, data: { title: string; icon: string; duration?: string; color?: string }) => void;
}

const ManualWorkoutEntry: React.FC<ManualWorkoutEntryProps> = ({ onNavigate, onStartSession }) => {
  const [activity, setActivity] = useState('');
  const [duration, setDuration] = useState('30');

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
      
      {/* Uniform Header */}
      <div className="flex items-center px-8 pt-10 pb-4 justify-between z-20 sticky top-0 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-md">
        <div className="flex flex-col">
            <h2 className="text-2xl font-black leading-none text-gray-800 dark:text-white uppercase tracking-tighter italic transform -skew-x-6">TRAINING</h2>
            <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mt-1">Academy Briefing</span>
        </div>
        <button 
          onClick={() => onNavigate(Screen.HOME)}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-all active:scale-90 shadow-sm border border-white dark:border-white/5"
        >
          <span className="material-symbols-outlined text-gray-600 dark:text-white text-2xl font-bold">close</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col pt-4 gap-6 relative z-10 overflow-y-auto no-scrollbar pb-20 w-full px-6">
        <div className="bg-light-surface dark:bg-dark-surface backdrop-blur-sm rounded-[2.5rem] p-6 shadow-xl border border-light-primary/10 dark:border-dark-primary/10 space-y-8 relative overflow-hidden">
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

        {/* Uniform Rectangular Start Button */}
        <div className="mt-auto pb-10">
            <button 
                onClick={handleStart}
                className="w-full h-16 rounded-[1.8rem] bg-[#FACC15] dark:bg-yellow-500 text-black font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-yellow-400/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shine"></div>
                <span className="material-symbols-outlined text-2xl filled">play_arrow</span>
                START MISSION
            </button>
        </div>
      </div>
      <style>{`
        @keyframes shine {
            0% { transform: translateX(-200%) skewX(-12deg); }
            20%, 100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shine {
            animation: shine 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ManualWorkoutEntry;
