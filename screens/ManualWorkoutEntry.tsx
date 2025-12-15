
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
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-gray-900 font-sans text-white animate-fade-in">
       {/* Background Grid */}
       <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
       <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-blue-900/40 to-transparent pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <button 
          onClick={() => onNavigate(Screen.HOME)}
          className="size-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors border border-white/10"
        >
          <span className="material-symbols-outlined text-white">arrow_back</span>
        </button>
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-[10px] font-black uppercase tracking-widest text-blue-300">
             <span className="size-1.5 bg-blue-400 rounded-full animate-pulse"></span>
             Academy Uplink
        </div>
        <div className="size-12"></div>
      </div>

      <div className="flex-1 flex flex-col px-6 pt-4 gap-8 relative z-10 overflow-y-auto no-scrollbar pb-20">
        <div className="text-center space-y-2 flex-shrink-0">
            <h2 className="text-3xl font-black text-white tracking-tight uppercase italic transform -skew-x-6">Mission Briefing</h2>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-wide">Configure training parameters.</p>
        </div>

        {/* Input Card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-[2rem] p-8 shadow-2xl border border-white/10 space-y-8 relative overflow-hidden flex-shrink-0">
            {/* Decoration Bar */}
            <div className="absolute top-0 left-0 w-2 h-full bg-yellow-400"></div>

            <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Operation Name</label>
                <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-400 transition-colors">edit</span>
                    <input 
                        type="text" 
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                        placeholder="e.g. Traffic Chase"
                        className="w-full h-16 pl-12 pr-4 rounded-xl bg-black/40 border border-white/10 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-lg font-bold text-white placeholder:text-gray-600 outline-none transition-all uppercase tracking-wide"
                    />
                </div>

                {/* Sports Presets */}
                <div className="pt-2">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Standard Ops</p>
                    <div className="flex flex-wrap gap-2">
                        {sportsPresets.map((sport) => (
                            <button
                                key={sport.name}
                                onClick={() => setActivity(sport.name)}
                                className={`px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wide border transition-all flex items-center gap-1.5 ${
                                    activity === sport.name 
                                    ? 'bg-yellow-400 text-black border-yellow-400 shadow-md transform skew-x-[-6deg]' 
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
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
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Time Limit (Min)</label>
                <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-400 transition-colors">timer</span>
                    <input 
                        type="number" 
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="30"
                        className="w-full h-16 pl-12 pr-4 rounded-xl bg-black/40 border border-white/10 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-lg font-bold text-white placeholder:text-gray-600 outline-none transition-all"
                    />
                </div>
                
                {/* Preset Chips */}
                 <div className="flex gap-2 justify-start overflow-x-auto no-scrollbar pt-2">
                    {[10, 20, 30, 45, 60].map(min => (
                        <button 
                            key={min}
                            onClick={() => setDuration(min.toString())}
                            className={`px-4 py-2 rounded-lg text-xs font-black border transition-all ${duration === min.toString() ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-transparent border-white/20 text-gray-400 hover:border-white/40'}`}
                        >
                            {min}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Start Button */}
        <div className="mt-auto">
            <button 
                onClick={handleStart}
                className="w-full h-24 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group relative overflow-hidden border-t border-white/20"
            >
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_20px)]"></div>
                
                <span className="material-symbols-outlined text-4xl filled relative z-10 group-hover:animate-ping">play_arrow</span>
                <div className="flex flex-col items-start relative z-10">
                    <span className="text-2xl font-black uppercase tracking-widest italic leading-none">Start Mission</span>
                    <span className="text-[10px] font-bold text-blue-200 uppercase tracking-[0.2em]">Initiate Sequence</span>
                </div>
            </button>
        </div>
      </div>
    </div>
  );
};

export default ManualWorkoutEntry;
