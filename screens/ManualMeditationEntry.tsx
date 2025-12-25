
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
      
      {/* Uniform Header */}
      <div className="flex items-center px-8 pt-10 pb-4 justify-between z-20 sticky top-0 bg-[#EAFBF9]/90 dark:bg-gray-900/90 backdrop-blur-md">
        <div className="flex flex-col">
            <h2 className="text-2xl font-black leading-none text-teal-900 dark:text-white uppercase tracking-tighter italic transform -skew-x-6">MEDITATION</h2>
            <span className="text-[9px] font-black text-teal-600 dark:text-teal-500 uppercase tracking-[0.3em] mt-1">Mystic Springs Oasis</span>
        </div>
        <button 
          onClick={() => onNavigate(Screen.HOME)}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/40 dark:bg-white/10 hover:bg-white/60 dark:hover:bg-white/20 transition-all active:scale-90 shadow-sm"
        >
          <span className="material-symbols-outlined text-teal-900 dark:text-white text-2xl font-bold">close</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col pt-4 pb-10 gap-6 relative z-10 overflow-y-auto no-scrollbar w-full px-6">
        
        <div className="bg-[#E0F2F1] dark:bg-white/5 rounded-[2.5rem] p-6 shadow-sm border border-teal-100 dark:border-white/5 space-y-8">
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

        {/* Uniform Rectangular Start Button */}
        <div className="mt-auto pb-10">
            <button 
                onClick={handleStart}
                className="w-full h-16 rounded-[1.8rem] bg-teal-600 text-white font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-teal-700/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine"></div>
                <span className="material-symbols-outlined text-2xl filled">play_circle</span>
                BEGIN JOURNEY
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

export default ManualMeditationEntry;
