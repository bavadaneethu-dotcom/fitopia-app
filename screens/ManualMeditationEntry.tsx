
import React, { useState } from 'react';
import { Screen } from '../types';

interface ManualMeditationEntryProps {
  onNavigate: (screen: Screen) => void;
  onStartSession: (screen: Screen, data: { title: string; icon: string; duration?: string; color?: string }) => void;
}

const ManualMeditationEntry: React.FC<ManualMeditationEntryProps> = ({ onNavigate, onStartSession }) => {
  const [activity, setActivity] = useState('');
  const [duration, setDuration] = useState('15');

  const presets = [
    { name: 'Mindfulness', icon: '🧘' },
    { name: 'Yoga', icon: '🤸' },
    { name: 'Deep Breath', icon: '🌬️' },
    { name: 'Nature Walk', icon: '🍃' },
    { name: 'Body Scan', icon: '💆' },
    { name: 'Sleep Prep', icon: '🌙' },
    { name: 'Chanting', icon: '📿' },
    { name: 'Gratitude', icon: '🙏' }
  ];

  const handleStart = () => {
    onStartSession(Screen.MEDITATION_TIMER, {
      title: activity || 'Mindfulness',
      icon: presets.find(p => p.name === activity)?.icon || '🧘',
      duration: `${duration}:00`
    });
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-teal-50 dark:bg-gray-900 font-sans animate-fade-in">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-teal-100/50 to-blue-50/50 dark:from-gray-900 dark:to-teal-900/20"></div>
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <button 
          onClick={() => onNavigate(Screen.HOME)}
          className="size-12 rounded-full bg-white/40 dark:bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/60 dark:hover:bg-white/20 transition-colors"
        >
          <span className="material-symbols-outlined text-teal-800 dark:text-teal-200">arrow_back</span>
        </button>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400">Mystic Springs Oasis</span>
        <div className="size-12"></div>
      </div>

      <div className="flex-1 flex flex-col px-6 pt-4 gap-8 relative z-10 overflow-y-auto no-scrollbar pb-20">
        <div className="text-center space-y-2 flex-shrink-0">
            <h2 className="text-3xl font-black text-teal-900 dark:text-white tracking-tight">Design Your Peace</h2>
            <p className="text-teal-600 dark:text-teal-400 text-sm font-medium">Customize your mindfulness session.</p>
        </div>

        {/* Input Card */}
        <div className="bg-white/60 dark:bg-black/20 backdrop-blur-md rounded-[2rem] p-8 shadow-sm border border-white/40 dark:border-white/5 space-y-6 flex-shrink-0">
            <div className="space-y-2">
                <label className="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase tracking-widest ml-1">Focus Area</label>
                <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-teal-400">psychology</span>
                    <input 
                        type="text" 
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                        placeholder="e.g. Deep Breathing"
                        className="w-full h-16 pl-12 pr-4 rounded-2xl bg-white dark:bg-white/5 border-2 border-transparent focus:border-teal-400 focus:ring-0 text-lg font-bold text-teal-900 dark:text-white placeholder:text-teal-900/30 dark:placeholder:text-white/30 outline-none transition-all"
                    />
                </div>
                
                {/* Preset Chips */}
                <div className="pt-2">
                    <p className="text-[10px] font-bold text-teal-600/60 dark:text-teal-400/60 uppercase tracking-wider mb-2 ml-1">Quick Focus</p>
                    <div className="flex flex-wrap gap-2">
                        {presets.map((preset) => (
                            <button
                                key={preset.name}
                                onClick={() => setActivity(preset.name)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                                    activity === preset.name 
                                    ? 'bg-teal-500 text-white border-teal-500 shadow-md' 
                                    : 'bg-white/50 dark:bg-white/5 border-teal-100 dark:border-white/10 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-white/10'
                                }`}
                            >
                                <span>{preset.icon}</span>
                                {preset.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase tracking-widest ml-1">Duration (Minutes)</label>
                <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-teal-400">timer</span>
                    <input 
                        type="number" 
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="15"
                        className="w-full h-16 pl-12 pr-4 rounded-2xl bg-white dark:bg-white/5 border-2 border-transparent focus:border-teal-400 focus:ring-0 text-lg font-bold text-teal-900 dark:text-white placeholder:text-teal-900/30 dark:placeholder:text-white/30 outline-none transition-all"
                    />
                </div>
            </div>
            
            {/* Quick Chips for Duration */}
            <div className="flex gap-2 justify-center">
                {[5, 10, 20, 30].map(min => (
                    <button 
                        key={min}
                        onClick={() => setDuration(min.toString())}
                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${duration === min.toString() ? 'bg-teal-500 text-white border-teal-500' : 'bg-transparent border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400'}`}
                    >
                        {min}m
                    </button>
                ))}
            </div>
        </div>

        {/* Start Button */}
        <div className="mt-auto">
            <button 
                onClick={handleStart}
                className="w-full h-20 rounded-full bg-teal-600 text-white shadow-xl shadow-teal-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
            >
                {/* Pulse Effect */}
                <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 rounded-full transition-transform duration-500 opacity-0 group-hover:opacity-100"></div>
                
                <span className="material-symbols-outlined text-3xl filled relative z-10 group-hover:animate-pulse">play_circle</span>
                <span className="text-xl font-black uppercase tracking-widest relative z-10">Begin Journey</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default ManualMeditationEntry;
