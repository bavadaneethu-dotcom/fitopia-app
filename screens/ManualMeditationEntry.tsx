
import React, { useState, useMemo } from 'react';
import { Screen } from '../types';

interface ManualMeditationEntryProps {
  onNavigate: (screen: Screen) => void;
  onManualLog?: (data: { title: string; icon: string; duration: string }) => void;
}

const YAX_QUOTES = [
    "Your aura is looking a bit spikey, man. Let's smooth it out.",
    "Don't let your mind become a DMV line... keep the thoughts moving.",
    "I am one with the fluff. The fluff is one with me. Ommm.",
    "You look like you've been chasing weasels all day. Sit. Breathe.",
    "Naked truth? Mindfulness is the only way to really see the spots.",
    "Is your inner sloth calling? Time for some slow... deep... breaths."
];

const ManualMeditationEntry: React.FC<ManualMeditationEntryProps> = ({ onNavigate, onManualLog }) => {
  const [activity, setActivity] = useState('MINDFULNESS');
  const [duration, setDuration] = useState('15');
  const [zenLevel, setZenLevel] = useState(50);
  const [customFlow, setCustomFlow] = useState('');
  const [savedFlows, setSavedFlows] = useState<{name: string, icon: string}[]>([]);
  
  const quote = useMemo(() => YAX_QUOTES[Math.floor(Math.random() * YAX_QUOTES.length)], []);

  const presets = [
    { name: 'MINDFULNESS', icon: '🧘' },
    { name: 'YOGA', icon: '🤸' },
    { name: 'DEEP BREATH', icon: '🌬️' },
    { name: 'NATURE WALK', icon: '🍃' },
    ...savedFlows
  ].slice(0, 6);

  const handleLogFlow = () => {
      const name = customFlow.trim().toUpperCase() || activity;
      const dur = `${duration}:00`;
      
      if (onManualLog) {
          onManualLog({ title: name, icon: '🌸', duration: dur });
      }
  };

  const selectPreset = (preset: {name: string, icon: string}) => {
      setActivity(preset.name);
      setCustomFlow(preset.name);
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-[#F0FDFA] dark:bg-dark-bg font-sans animate-fade-in text-teal-900 dark:text-white transition-colors duration-300">
      {/* Immersive Zen Background */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] size-96 bg-teal-200/30 dark:bg-teal-900/10 rounded-full blur-[100px]"></div>
          <span className="absolute top-20 left-10 text-xl animate-float opacity-30 dark:opacity-10">🌸</span>
      </div>

      {/* Header */}
      <div className="relative z-20 flex flex-col items-center pt-10 px-6 gap-4 bg-white/60 dark:bg-dark-surface/60 backdrop-blur-md pb-4 border-b border-teal-100/50 dark:border-white/5 shadow-sm">
        <div className="w-full flex items-center justify-between">
            <div className="size-10"></div>
            <div className="flex items-center gap-1.5 bg-white/80 dark:bg-white/10 px-4 py-1.5 rounded-full border border-teal-100 dark:border-white/10 shadow-sm">
                <span className="size-2 bg-teal-400 rounded-full animate-ping"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400">Mystic Springs Oasis</span>
            </div>
            <button 
              onClick={() => onNavigate(Screen.HOME)}
              className="size-10 rounded-full bg-white/80 dark:bg-white/10 shadow-sm flex items-center justify-center text-teal-900 dark:text-white"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
        </div>

        {/* Yax Advice Card */}
        <div className="w-full bg-teal-900/10 dark:bg-white/5 backdrop-blur-xl rounded-[2rem] p-4 border border-white/60 dark:border-white/5 shadow-lg flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-2xl shadow-inner shrink-0">🐂</div>
            <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-teal-600 dark:text-teal-300">Yax's Zen Wisdom</p>
                <p className="text-[11px] font-bold text-teal-800 dark:text-teal-300 leading-tight italic">"{quote}"</p>
            </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col pt-4 pb-32 gap-6 relative z-10 overflow-y-auto no-scrollbar w-full px-6">
        
        {/* Manual Oasis Entry */}
        <div className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md p-5 rounded-[2.5rem] border border-teal-100 dark:border-white/5 shadow-sm space-y-4">
            <label className="text-[10px] font-black text-teal-500 dark:text-teal-400 uppercase tracking-widest ml-2">Record Completed Flow</label>
            <div className="flex flex-col gap-3">
                <input 
                    type="text" 
                    placeholder="Enter Flow Name (e.g. Sunset Yoga)"
                    value={customFlow}
                    onChange={(e) => setCustomFlow(e.target.value)}
                    className="w-full h-14 px-6 rounded-2xl bg-white dark:bg-white/5 border border-teal-100 dark:border-white/10 text-sm font-bold outline-none focus:border-teal-400 dark:focus:border-teal-500 shadow-sm dark:text-white dark:placeholder:text-slate-500"
                />
            </div>
        </div>

        {/* Flow Selection (Presets) */}
        <section className="space-y-3">
            <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Zen Presets</label>
                <span className="text-[10px] font-black text-teal-500 dark:text-teal-400 tracking-wider">TAP TO FILL</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
                {presets.map((preset) => (
                    <button
                        key={preset.name}
                        onClick={() => selectPreset(preset)}
                        className={`flex flex-col items-center gap-1.5 p-4 rounded-[1.8rem] transition-all duration-300 ${
                            customFlow.toUpperCase() === preset.name 
                            ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30' 
                            : 'bg-white dark:bg-dark-surface shadow-sm border border-teal-50 dark:border-white/5 text-slate-400 dark:text-slate-500 hover:border-teal-200 dark:hover:border-white/20'
                        }`}
                    >
                        <span className="text-2xl">{preset.icon}</span>
                        <span className="text-[9px] font-black uppercase tracking-tight truncate w-full text-center">{preset.name}</span>
                    </button>
                ))}
            </div>
        </section>

        {/* Adjust Parameters */}
        <section className="bg-white/40 dark:bg-dark-surface/40 p-6 rounded-[2.5rem] border border-teal-100 dark:border-white/5 shadow-sm space-y-8">
            <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Flow Duration</label>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-teal-800 dark:text-white tracking-tighter">{duration}</span>
                        <span className="text-xs font-black text-teal-400 dark:text-slate-500 uppercase">Min</span>
                    </div>
                </div>
                <input 
                    type="range" min="1" max="60" value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full h-1.5 bg-teal-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-teal-500"
                />
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Aura Intensity</label>
                <input 
                    type="range" min="1" max="100" value={zenLevel}
                    onChange={(e) => setZenLevel(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-teal-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-teal-500"
                />
                <div className="flex justify-between text-[8px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest px-1">
                    <span>Muted</span>
                    <span>Radiant</span>
                </div>
            </div>
        </section>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 z-30 bg-gradient-to-t from-[#F0FDFA] via-[#F0FDFA] to-transparent dark:from-dark-bg dark:via-dark-bg pt-10">
        <button 
            onClick={handleLogFlow}
            disabled={!customFlow && !activity}
            className="w-full h-20 rounded-[2.5rem] bg-teal-500 text-white shadow-2xl shadow-teal-600/40 active:scale-[0.98] transition-all flex flex-col items-center justify-center group disabled:opacity-50"
        >
            <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl filled group-hover:scale-110 transition-transform">spa</span>
                <span className="text-xl font-black uppercase tracking-[0.15em]">Log Zen Record</span>
            </div>
            <span className="text-[8px] font-black opacity-60 uppercase tracking-[0.3em] mt-1 text-center">Initiating Tranquility Protocol</span>
        </button>
      </div>
    </div>
  );
};

export default ManualMeditationEntry;
