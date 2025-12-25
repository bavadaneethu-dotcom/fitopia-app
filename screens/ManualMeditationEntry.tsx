
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
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-[#EAFBF9] dark:bg-gray-900 font-sans animate-fade-in text-teal-900 dark:text-teal-50">
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-10 pb-2">
        <div className="size-10"></div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-700 dark:text-teal-400">Mystic Springs Oasis</span>
        <button 
          onClick={() => onNavigate(Screen.HOME)}
          className="size-10 rounded-full bg-white/40 dark:bg-white/5 shadow-sm backdrop-blur-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-teal-900 dark:text-white text-xl">close</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col pt-8 pb-10 gap-8 relative z-10 overflow-y-auto no-scrollbar w-full">
        
        {/* Title Section */}
        <div className="text-center space-y-2 px-6">
            <h2 className="text-3xl font-black text-teal-900 dark:text-white tracking-tight">Design Your Peace</h2>
            <p className="text-teal-700 dark:text-teal-300 text-sm font-bold">Customize your mindfulness session.</p>
        </div>

        {/* Main Card */}
        <div className="mx-6 bg-[#E0F2F1] dark:bg-white/5 rounded-[2.5rem] p-6 shadow-sm border border-teal-100 dark:border-white/5 space-y-8">
            
            {/* Focus Area Section */}
            <div className="space-y-3">
                <label className="text-[10px] font-black text-teal-700 dark:text-teal-400 uppercase tracking-widest ml-1">Focus Area</label>
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 size-8 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center">
                         <span className="material-symbols-outlined text-teal-600 dark:text-teal-300 text-lg">psychology</span>
                    </div>
                    <input 
                        type="text" 
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                        placeholder="e.g. Deep Breathing"
                        className="w-full h-16 pl-14 pr-4 rounded-2xl bg-white dark:bg-black/20 border-2 border-transparent focus:border-teal-400 focus:ring-0 text-lg font-bold text-teal-900 dark:text-white placeholder:text-teal-900/30 dark:placeholder:text-white/30 outline-none transition-all shadow-sm"
                    />
                </div>
                
                {/* Quick Focus Chips */}
                <div>
                    <p className="text-[10px] font-bold text-teal-600/60 dark:text-teal-400/60 uppercase tracking-wider mb-2 ml-1">Quick Focus</p>
                    <div className="flex flex-wrap gap-2">
                        {presets.map((preset) => (
                            <button
                                key={preset.name}
                                onClick={() => setActivity(preset.name)}
                                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1.5 ${
                                    activity === preset.name 
                                    ? 'bg-teal-500 text-white border-teal-500 shadow-md' 
                                    : 'bg-white dark:bg-white/5 border-teal-100 dark:border-white/10 text-teal-800 dark:text-teal-200 hover:bg-teal-50 dark:hover:bg-white/10'
                                }`}
                            >
                                <span className="text-base">{preset.icon}</span>
                                {preset.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Duration Section */}
            <div className="space-y-3">
                <label className="text-[10px] font-black text-teal-700 dark:text-teal-400 uppercase tracking-widest ml-1">Duration (Minutes)</label>
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 size-8 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center">
                        <span className="material-symbols-outlined text-teal-600 dark:text-teal-300 text-lg">timer</span>
                    </div>
                    <input 
                        type="number" 
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="15"
                        className="w-full h-16 pl-14 pr-4 rounded-2xl bg-white dark:bg-black/20 border-2 border-transparent focus:border-teal-400 focus:ring-0 text-lg font-bold text-teal-900 dark:text-white placeholder:text-teal-900/30 dark:placeholder:text-white/30 outline-none transition-all shadow-sm"
                    />
                </div>
                
                {/* Duration Chips */}
                <div className="flex gap-2">
                    {[5, 10, 20, 30].map(min => (
                        <button 
                            key={min}
                            onClick={() => setDuration(min.toString())}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                                duration === min.toString() 
                                ? 'bg-teal-500 text-white border-teal-500 shadow-sm' 
                                : 'bg-white dark:bg-white/5 border-teal-100 dark:border-white/10 text-teal-700 dark:text-teal-300'
                            }`}
                        >
                            {min}m
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Start Button */}
        <div className="mt-auto px-6">
            <button 
                onClick={handleStart}
                className="w-full h-16 rounded-full bg-[#0F766E] dark:bg-teal-600 text-white shadow-xl shadow-teal-700/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm"
            >
                <span className="material-symbols-outlined text-2xl filled">play_circle</span>
                Begin Journey
            </button>
        </div>
      </div>
    </div>
  );
};

export default ManualMeditationEntry;
