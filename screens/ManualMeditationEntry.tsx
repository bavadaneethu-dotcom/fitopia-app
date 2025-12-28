
import React, { useState, useMemo } from 'react';
import { Screen, ActivityLog } from '../types';

interface ManualMeditationEntryProps {
  onNavigate: (screen: Screen) => void;
  onManualLog?: (data: { id?: string; title: string; icon: string; duration: string }) => void;
  logs: ActivityLog[];
  onDeleteMeditation: (id: string) => void;
}

const YAX_QUOTES = [
    "Your aura is looking a bit spikey, man. Let's smooth it out.",
    "Don't let your mind become a DMV line... keep the thoughts moving.",
    "I am one with the fluff. The fluff is one with me. Ommm.",
    "You look like you've been chasing weasels all day. Sit. Breathe.",
    "Naked truth? Mindfulness is the only way to really see the spots.",
    "Is your inner sloth calling? Time for some slow... deep... breaths."
];

const ManualMeditationEntry: React.FC<ManualMeditationEntryProps> = ({ onNavigate, onManualLog, logs, onDeleteMeditation }) => {
  const [activity, setActivity] = useState('MINDFULNESS');
  const [duration, setDuration] = useState('15');
  const [zenLevel, setZenLevel] = useState(50);
  const [customFlow, setCustomFlow] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const quote = useMemo(() => YAX_QUOTES[Math.floor(Math.random() * YAX_QUOTES.length)], []);
  const presets = [{ name: 'MINDFULNESS', icon: '🧘' }, { name: 'YOGA', icon: '🤸' }, { name: 'DEEP BREATH', icon: '🌬️' }, { name: 'NATURE WALK', icon: '🍃' }, { name: 'SOUND BATH', icon: '🔔' }, { name: 'OASIS NAP', icon: '💤' }];

  const handleLogFlow = () => {
      const name = customFlow.trim().toUpperCase() || activity;
      const dur = `${duration}:00`;
      if (onManualLog) onManualLog({ id: editingId || undefined, title: name, icon: '🌸', duration: dur });
      setEditingId(null); setCustomFlow(''); setDuration('15');
  };

  const handleEdit = (log: ActivityLog) => {
      setEditingId(log.id); setCustomFlow(log.title);
      const mins = log.duration.split(':')[0];
      setDuration(mins); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-[#F0FDFA] dark:bg-dark-bg font-sans animate-fade-in text-teal-900 dark:text-white transition-colors duration-300">
      <div className="absolute inset-0 pointer-events-none"><div className="absolute top-[-10%] right-[-10%] size-96 bg-teal-200/30 dark:bg-teal-900/10 rounded-full blur-[100px]"></div><span className="absolute top-20 left-10 text-xl animate-float opacity-30 dark:opacity-10">🌸</span></div>
      <div className="relative z-20 flex flex-col items-center pt-10 px-6 gap-4 bg-white/60 dark:bg-dark-surface/60 backdrop-blur-md pb-4 border-b border-teal-100/50 dark:border-white/5 shadow-sm">
        <div className="w-full flex items-center justify-between"><div className="size-10"></div><div className="flex items-center gap-1.5 bg-white/80 dark:bg-white/10 px-4 py-1.5 rounded-full border border-teal-100 dark:border-white/10 shadow-sm"><span className="size-2 bg-teal-400 rounded-full animate-ping"></span><span className="text-[10px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400">Mystic Springs Oasis</span></div><button onClick={() => onNavigate(Screen.HOME)} className="size-10 rounded-full bg-white/80 dark:bg-white/10 shadow-sm flex items-center justify-center text-teal-900 dark:text-white"><span className="material-symbols-outlined text-2xl">close</span></button></div>
        <div className="w-full bg-teal-900/10 dark:bg-white/5 backdrop-blur-xl rounded-[2rem] p-4 border border-white/60 dark:border-white/5 shadow-lg flex items-center gap-4"><div className="size-12 rounded-2xl bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-2xl shadow-inner shrink-0">🐂</div><div className="flex-1 min-w-0"><p className="text-[9px] font-black uppercase tracking-[0.15em] text-teal-600 dark:text-teal-300">Yax's Zen Wisdom</p><p className="text-[11px] font-bold text-teal-800 dark:text-teal-300 leading-tight italic">"{quote}"</p></div></div>
      </div>

      <div className="flex-1 flex flex-col pt-4 pb-48 gap-6 relative z-10 overflow-y-auto no-scrollbar w-full px-6">
        <div className={`p-5 rounded-[2.5rem] border shadow-sm space-y-4 transition-colors ${editingId ? 'bg-teal-100/40 border-teal-400' : 'bg-white/80 dark:bg-dark-surface/80 border-teal-100 dark:border-white/5'}`}><label className={`text-[10px] font-black uppercase tracking-widest ml-2 ${editingId ? 'text-teal-700' : 'text-teal-500 dark:text-teal-400'}`}>{editingId ? 'Refining Flow Record' : 'Record Completed Flow'}</label><div className="flex flex-col gap-3"><input type="text" placeholder="Enter Flow Name (e.g. Sunset Yoga)" value={customFlow} onChange={(e) => setCustomFlow(e.target.value)} className="w-full h-14 px-6 rounded-2xl bg-white dark:bg-white/5 border border-teal-100 dark:border-white/10 text-sm font-bold outline-none focus:border-teal-400 dark:focus:border-teal-500 shadow-sm dark:text-white dark:placeholder:text-slate-500" /></div></div>
        <section className="space-y-3"><div className="flex justify-between items-center px-2"><label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Zen Presets</label><span className="text-[10px] font-black text-teal-500 dark:text-teal-400 tracking-wider">TAP TO FILL</span></div><div className="grid grid-cols-3 gap-2">{presets.map((preset) => (<button key={preset.name} onClick={() => {setActivity(preset.name); setCustomFlow(preset.name);}} className={`flex flex-col items-center gap-1.5 p-4 rounded-[1.8rem] transition-all duration-300 ${customFlow.toUpperCase() === preset.name ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30' : 'bg-white dark:bg-dark-surface shadow-sm border border-teal-50 dark:border-white/5 text-slate-400 dark:text-slate-500 hover:border-teal-200 dark:hover:border-white/20'}`}><span className="text-2xl">{preset.icon}</span><span className="text-[9px] font-black uppercase tracking-tight truncate w-full text-center">{preset.name}</span></button>))}</div></section>
        <section className="bg-white/40 dark:bg-dark-surface/40 p-6 rounded-[2.5rem] border border-teal-100 dark:border-white/5 shadow-sm space-y-8"><div className="space-y-4"><div className="flex justify-between items-baseline"><label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Flow Duration</label><div className="flex items-center gap-3"><div className="relative flex items-center h-12 bg-white dark:bg-black/20 rounded-xl border border-teal-100 dark:border-white/10 px-3 shadow-inner"><input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-14 bg-transparent text-center text-xl font-black text-teal-800 dark:text-white outline-none" min="1" max="999" /><span className="text-[8px] font-black text-teal-400 dark:text-teal-500 uppercase tracking-widest ml-1">MIN</span></div></div></div><input type="range" min="1" max="60" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full h-1.5 bg-teal-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-teal-500" /></div><div className="space-y-4"><label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Aura Intensity</label><input type="range" min="1" max="100" value={zenLevel} onChange={(e) => setZenLevel(parseInt(e.target.value))} className="w-full h-1.5 bg-teal-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-teal-500" /><div className="flex justify-between text-[8px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest px-1"><span>Muted</span><span>Radiant</span></div></div></section>
        <section className="animate-fade-in mt-2 pb-10"><h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500 mb-4 px-2">Today's Zen Records</h3><div className="flex flex-col gap-3">{logs.length === 0 ? <div className="text-center py-10 opacity-30 italic text-sm text-slate-400">Tranquility pending...</div> : logs.map(log => (<div key={log.id} className={`flex items-center gap-4 p-4 rounded-3xl border transition-all ${editingId === log.id ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-400 shadow-md ring-2 ring-teal-100 dark:ring-teal-900/40' : 'bg-white dark:bg-[#1C1C1E] border-slate-100 dark:border-white/5 shadow-sm group'}`}><div className="size-14 rounded-2xl bg-teal-50 dark:bg-black/20 flex items-center justify-center text-3xl shadow-inner shrink-0 group-hover:scale-105 transition-transform">{log.icon}</div><div className="flex-1 min-w-0"><div className="flex items-center gap-1.5 mb-0.5"><p className="font-black truncate text-gray-900 dark:text-white text-sm uppercase tracking-tight">{log.title}</p></div><p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 dark:text-gray-500">{log.timestamp} • {log.duration}</p></div><div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => handleEdit(log)} className="size-8 rounded-full bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-300 flex items-center justify-center hover:scale-110 active:scale-90 transition-transform"><span className="material-symbols-outlined text-lg">edit</span></button><button onClick={() => onDeleteMeditation(log.id)} className="size-8 rounded-full bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-300 flex items-center justify-center hover:scale-110 active:scale-90 transition-transform"><span className="material-symbols-outlined text-lg">delete</span></button></div></div>))}</div></section>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 z-30 bg-gradient-to-t from-[#F0FDFA] via-[#F0FDFA] to-transparent dark:from-dark-bg dark:via-dark-bg pt-10 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
        <button onClick={handleLogFlow} disabled={!customFlow && !activity} className={`w-full h-20 rounded-[2.5rem] text-white shadow-2xl active:scale-[0.98] transition-all flex flex-col items-center justify-center group disabled:opacity-50 ${editingId ? 'bg-teal-600 shadow-teal-700/40' : 'bg-teal-500 shadow-teal-600/40'}`}>
            <div className="flex items-center gap-3"><span className="material-symbols-outlined text-3xl filled group-hover:scale-110 transition-transform">{editingId ? 'verified' : 'spa'}</span><span className="text-xl font-black uppercase tracking-[0.15em]">{editingId ? 'Update Zen Flow' : 'Log Zen Record'}</span></div>
            <span className="text-[8px] font-black opacity-60 uppercase tracking-[0.3em] mt-1 text-center">Initiating Tranquility Protocol</span>
        </button>
      </div>
    </div>
  );
};

export default ManualMeditationEntry;
