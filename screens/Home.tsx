
import React, { useState, useEffect } from 'react';
import { Character, Screen, ActivityLog } from '../types';

interface HomeProps {
  character: Character;
  onNavigate: (screen: Screen) => void;
  onStartSession: (screen: Screen, data: { title: string; icon: string; duration?: string; color?: string }) => void;
  workoutLogs: ActivityLog[];
  meditationLogs: ActivityLog[];
  isFasting: boolean;
  fastStartTime: Date | null;
}

type TabType = 'weight' | 'zen' | 'workout' | 'fasting';
type WeightUnit = 'LBS' | 'KG';

const Home: React.FC<HomeProps> = ({ character, onNavigate, onStartSession, workoutLogs, meditationLogs, isFasting, fastStartTime }) => {
  const [activeTab, setActiveTab] = useState<TabType>('fasting');

  // --- Biometrics State ---
  const [weightValue, setWeightValue] = useState(142.0); // Stored as LBS internally
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('LBS');
  const [measurements, setMeasurements] = useState({ waist: 32.5, chest: 38.0, hips: 41.5 });
  const [isBioSaved, setIsBioSaved] = useState(false);

  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time ticking for fasting timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Helper for saving biometrics animation
  const handleBioSave = () => {
    setIsBioSaved(true);
    setTimeout(() => setIsBioSaved(false), 2000);
  };

  const handleWeightChange = (val: string) => {
    const num = parseFloat(val);
    if (!isNaN(num)) {
       if (weightUnit === 'KG') {
           setWeightValue(num * 2.20462);
       } else {
           setWeightValue(num);
       }
    }
  };

  const displayWeight = weightUnit === 'KG' ? (weightValue * 0.453592).toFixed(1) : weightValue.toFixed(1);

  // Calculate fasting time string
  const getFastingString = () => {
    if (!fastStartTime) return { h: '00', m: '00', s: '00' };
    const diff = Math.max(0, currentTime.getTime() - fastStartTime.getTime());
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    return {
        h: hours.toString().padStart(2, '0'),
        m: mins.toString().padStart(2, '0'),
        s: secs.toString().padStart(2, '0')
    };
  };

  const fastDuration = getFastingString();

  const handleTabClick = (tab: TabType) => {
      if (tab === 'fasting' && activeTab === 'fasting') {
          // If already on fasting tab, navigate to the full timer screen
          onNavigate(Screen.FASTING_TIMER);
      } else {
          setActiveTab(tab);
      }
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'weight':
        return (
          <div className="bg-[#fdfbf7] dark:bg-[#1a202c] p-6 rounded-[1.5rem] border-2 border-dashed border-gray-300 dark:border-gray-600 animate-fade-in-up shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                 <span className="material-symbols-outlined text-9xl text-gray-800 dark:text-white">monitor_weight</span>
             </div>
             
             <div className="flex justify-between items-start mb-6 relative z-10">
               <div>
                  <h3 className="text-gray-800 dark:text-gray-200 font-black text-lg uppercase tracking-tight">ZPD Medical File</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Update Biometrics</p>
               </div>
               <div className={`transition-all duration-300 ${isBioSaved ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'} dark:bg-white/10 dark:text-white rounded-full p-2`}>
                   <span className="material-symbols-outlined">{isBioSaved ? 'check' : 'edit'}</span>
               </div>
             </div>
             
             {/* Weight Input */}
             <div className="flex items-center gap-4 mb-6 bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm relative z-10">
                 <div className="size-12 rounded-xl bg-light-primary/20 dark:bg-dark-primary/20 flex items-center justify-center text-light-primary dark:text-dark-primary">
                    <span className="material-symbols-outlined">scale</span>
                 </div>
                 <div className="flex-1">
                     <div className="flex justify-between items-center mb-1">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Current Weight</p>
                         {/* Unit Toggle */}
                         <div className="flex bg-gray-100 dark:bg-gray-700 rounded-md p-0.5">
                             <button 
                                onClick={() => setWeightUnit('LBS')}
                                className={`px-2 py-0.5 text-[9px] font-bold rounded ${weightUnit === 'LBS' ? 'bg-white dark:bg-gray-600 shadow-sm text-black dark:text-white' : 'text-gray-400'}`}
                             >LBS</button>
                             <button 
                                onClick={() => setWeightUnit('KG')}
                                className={`px-2 py-0.5 text-[9px] font-bold rounded ${weightUnit === 'KG' ? 'bg-white dark:bg-gray-600 shadow-sm text-black dark:text-white' : 'text-gray-400'}`}
                             >KG</button>
                         </div>
                     </div>
                     <div className="flex items-baseline gap-1">
                        <input 
                            type="number" 
                            value={displayWeight}
                            onChange={(e) => handleWeightChange(e.target.value)}
                            className="text-3xl font-black text-light-text dark:text-white bg-transparent w-32 outline-none border-b border-dashed border-gray-300 focus:border-light-primary transition-colors"
                        />
                        <span className="text-xs font-bold text-gray-400">{weightUnit}</span>
                     </div>
                 </div>
                 <div className="flex items-center gap-1 text-green-500 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded text-[10px] font-bold">
                    <span className="material-symbols-outlined text-[10px]">trending_down</span>
                    1.2
                 </div>
             </div>

             {/* Measurements Grid */}
             <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-gray-400 text-sm">straighten</span>
                    <h4 className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-widest">Tape Measure (Inches)</h4>
                 </div>
                 <div className="grid grid-cols-3 gap-3">
                     {[
                         { label: 'Waist', key: 'waist' as const, val: measurements.waist },
                         { label: 'Chest', key: 'chest' as const, val: measurements.chest },
                         { label: 'Hips', key: 'hips' as const, val: measurements.hips }
                     ].map((item) => (
                         <div key={item.key} className="bg-white dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/10 flex flex-col items-center">
                             <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mb-1">{item.label}</span>
                             <input 
                                type="number"
                                value={item.val}
                                onChange={(e) => setMeasurements({...measurements, [item.key]: parseFloat(e.target.value)})}
                                className="w-full text-center font-black text-lg text-gray-800 dark:text-white bg-transparent outline-none focus:text-light-primary dark:focus:text-dark-primary transition-colors"
                             />
                             <div className="w-full h-px bg-gray-200 dark:bg-gray-700 mt-1"></div>
                         </div>
                     ))}
                 </div>
             </div>

             <button 
                onClick={handleBioSave}
                className="w-full mt-6 py-3 bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-bg rounded-xl font-black uppercase tracking-wider text-xs shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
             >
                <span className="material-symbols-outlined text-sm">save</span>
                Update Records
             </button>
          </div>
        );
      case 'zen':
        return (
          <div className="bg-[#fdfbf7] dark:bg-[#1a202c] p-6 rounded-[1.5rem] border-2 border-dashed border-gray-300 dark:border-gray-600 animate-fade-in-up shadow-sm">
             <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="text-gray-800 dark:text-gray-200 font-black text-lg uppercase tracking-tight">Mystic Spring Oasis</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Mindfulness Log</p>
               </div>
               <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-3xl animate-pulse-slow">self_improvement</span>
             </div>
             
             {/* Presets Horizontal Scroll */}
             <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2">
                <ZenPreset 
                    icon="🧘" title="Yax's Yoga" duration="15m" 
                    onClick={() => onStartSession(Screen.MEDITATION_TIMER, { title: "Yax's Yoga", icon: "🧘", duration: "15:00" })}
                />
                <ZenPreset 
                    icon="🦥" title="Sloth Nap" duration="20m" 
                    onClick={() => onStartSession(Screen.MEDITATION_TIMER, { title: "Sloth Nap", icon: "🦥", duration: "20:00" })}
                />
                <ZenPreset 
                    icon="🌬️" title="Deep Breath" duration="5m" 
                    onClick={() => onStartSession(Screen.MEDITATION_TIMER, { title: "Deep Breath", icon: "🌬️", duration: "05:00" })}
                />
                <ZenPreset 
                    icon="🚂" title="Train Commute" duration="30m" 
                    onClick={() => onStartSession(Screen.MEDITATION_TIMER, { title: "Train Commute", icon: "🚂", duration: "30:00" })}
                />
             </div>

             {/* Manual Entry Button */}
             <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                 <button 
                    onClick={() => onNavigate(Screen.MANUAL_MEDITATION)}
                    className="flex items-center justify-between w-full group bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5 hover:border-light-primary dark:hover:border-dark-primary transition-all shadow-sm"
                 >
                     <div className="flex items-center gap-3">
                         <div className="size-10 rounded-full bg-light-primary/10 dark:bg-dark-primary/10 flex items-center justify-center text-light-primary dark:text-dark-primary">
                             <span className="material-symbols-outlined">edit</span>
                         </div>
                         <div className="text-left">
                            <span className="block text-sm font-bold text-gray-800 dark:text-white uppercase tracking-tight">Custom Session</span>
                            <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wide">Enter Manual Details</span>
                         </div>
                     </div>
                     <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
                 </button>
             </div>
          </div>
        );
      case 'workout':
        return (
          <div className="bg-[#fdfbf7] dark:bg-[#1a202c] p-6 rounded-[1.5rem] border-2 border-dashed border-gray-300 dark:border-gray-600 animate-fade-in-up shadow-sm">
             <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="text-gray-800 dark:text-gray-200 font-black text-lg uppercase tracking-tight">Academy Training</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Activity Log</p>
               </div>
               <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-3xl">fitness_center</span>
             </div>
             
             {/* Presets */}
             <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2">
                <SportPreset 
                    icon="🚓" title="Traffic Duty" color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300" 
                    onClick={() => onStartSession(Screen.WORKOUT_TIMER, { title: "Traffic Duty", icon: "🚓", color: "blue" })}
                />
                <SportPreset 
                    icon="🥊" title="Boxing" color="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300" 
                    onClick={() => onStartSession(Screen.WORKOUT_TIMER, { title: "Boxing", icon: "🥊", color: "red" })}
                />
                <SportPreset 
                    icon="🥕" title="Carrot Farm" color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300" 
                    onClick={() => onStartSession(Screen.WORKOUT_TIMER, { title: "Carrot Farm", icon: "🥕", color: "orange" })}
                />
                <SportPreset 
                    icon="🐆" title="Sprinting" color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300" 
                    onClick={() => onStartSession(Screen.WORKOUT_TIMER, { title: "Sprinting", icon: "🐆", color: "yellow" })}
                />
             </div>

             {/* Manual Entry Button */}
             <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                 <button 
                    onClick={() => onNavigate(Screen.MANUAL_WORKOUT)}
                    className="flex items-center justify-between w-full group bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5 hover:border-light-primary dark:hover:border-dark-primary transition-all shadow-sm"
                 >
                     <div className="flex items-center gap-3">
                         <div className="size-10 rounded-full bg-light-primary/10 dark:bg-dark-primary/10 flex items-center justify-center text-light-primary dark:text-dark-primary">
                             <span className="material-symbols-outlined">edit_square</span>
                         </div>
                         <div className="text-left">
                            <span className="block text-sm font-bold text-gray-800 dark:text-white uppercase tracking-tight">Custom Mission</span>
                            <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wide">Log Manual Sport</span>
                         </div>
                     </div>
                     <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
                 </button>
             </div>
          </div>
        );
      case 'fasting':
        return (
          <div className="bg-[#fdfbf7] dark:bg-[#1a202c] p-6 rounded-[1.5rem] border-2 border-dashed border-gray-300 dark:border-gray-600 animate-fade-in-up shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-6 relative z-10">
               <div>
                  <h3 className="text-gray-800 dark:text-gray-200 font-black text-lg uppercase tracking-tight">Shift Timer</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Fasting Protocol</p>
               </div>
               <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 transition-colors duration-300 ${isFasting ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                  <span className={`size-1.5 rounded-full ${isFasting ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                  {isFasting ? 'On Duty' : 'Off Duty'}
               </div>
             </div>

             {/* Timer Visual */}
             <div className="flex flex-col items-center justify-center py-2 relative z-10">
                 {isFasting ? (
                     <>
                        {/* Real-time HH:MM:SS Ticker */}
                        <div className="flex items-end gap-1 mb-4 animate-fade-in">
                            <div className="flex gap-1 items-baseline">
                                <span className="text-5xl font-black text-light-text dark:text-white tracking-tighter tabular-nums">{fastDuration.h}</span>
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mr-1">h</span>
                                <span className="text-5xl font-black text-light-text dark:text-white tracking-tighter tabular-nums animate-pulse text-gray-300 dark:text-gray-600">:</span>
                                <span className="text-5xl font-black text-light-text dark:text-white tracking-tighter tabular-nums">{fastDuration.m}</span>
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mr-1">m</span>
                                <span className="text-5xl font-black text-light-text dark:text-white tracking-tighter tabular-nums animate-pulse text-gray-300 dark:text-gray-600">:</span>
                                <span className="text-5xl font-black text-light-text dark:text-white tracking-tighter tabular-nums">{fastDuration.s}</span>
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">s</span>
                            </div>
                        </div>
                        
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden mb-6">
                            <div className="h-full bg-light-primary dark:bg-dark-primary w-[85%] rounded-full shadow-[0_0_15px_rgba(250,204,21,0.5)] animate-shimmer relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/20 -skew-x-12 w-10 animate-shine"></div>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => onNavigate(Screen.FASTING_TIMER)}
                            className="w-full py-4 rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 z-20 relative bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-bg hover:brightness-110"
                        >
                            <span className="material-symbols-outlined text-lg filled">timer</span>
                            View Timer
                        </button>
                     </>
                 ) : (
                     <div className="py-6 flex flex-col items-center w-full">
                         <span className="material-symbols-outlined text-5xl mb-3 text-gray-400 dark:text-gray-500">restaurant</span>
                         <span className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-300 mb-6">Eating Window Active</span>
                         
                         <button 
                            onClick={() => onNavigate(Screen.FASTING_TIMER)}
                            className="w-full py-4 rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 z-20 relative bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-bg hover:brightness-110"
                        >
                            <span className="material-symbols-outlined text-lg filled">play_circle</span>
                            Start Night Watch (Start Fasting)
                        </button>
                     </div>
                 )}
             </div>

             {/* Background Decoration */}
             <div className="absolute -bottom-10 -right-10 text-gray-100 dark:text-white/5 opacity-50 z-0 pointer-events-none">
                 <span className="material-symbols-outlined text-[150px]">timer</span>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 px-6 pt-2 animate-fade-in pb-4">
      
      {/* Character ID Card */}
      <div className="relative w-full aspect-[16/10] rounded-[2rem] overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/50 group border border-white/50 dark:border-white/5 bg-gray-300 dark:bg-gray-800">
        {/* Background Image */}
        <div className="absolute inset-0 bg-cover bg-top transform transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("${character.image}")` }}></div>
        
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent mix-blend-multiply opacity-80"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50"></div>
        
        {/* Holographic Noise Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

        {/* Top Badges */}
        <div className="absolute top-6 left-6 right-6 flex justify-between z-20">
            {/* Live Feed Badge */}
            <div className="bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
                 <span className="size-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)] animate-pulse"></span>
                 <span className="text-[10px] font-black text-white/90 uppercase tracking-widest">Live Feed</span>
            </div>
            {/* Level Badge */}
            <div className="bg-yellow-400 text-black px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                Level {character.level}
            </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-6 left-6 z-20 flex flex-col">
             <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-1 drop-shadow-lg">{character.name}</h2>
             <div className="flex items-center gap-2">
                 <span className="text-xs font-bold text-gray-200 uppercase tracking-wider">{character.role}</span>
                 <span className="text-xs font-black text-yellow-400 uppercase tracking-wider">Coach</span>
             </div>
        </div>

        {/* Chat Button - No Interaction (Removed Select Character) */}
        <div className="absolute bottom-6 right-6 bg-white/20 backdrop-blur-md size-12 flex items-center justify-center rounded-full z-20 border border-white/20 shadow-lg">
          <span className="material-symbols-outlined text-white text-xl">chat_bubble</span>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Calories Card */}
        <div 
          onClick={() => onNavigate(Screen.FOOD_LOG)}
          className="bg-light-surface dark:bg-dark-surface rounded-[2rem] p-5 border border-light-primary/20 dark:border-dark-primary/20 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl text-light-text dark:text-white">local_pizza</span>
          </div>
          
          <div className="relative z-10 flex flex-col h-full justify-between gap-4">
             <div className="size-10 rounded-full bg-light-primary/10 dark:bg-dark-primary/10 flex items-center justify-center text-light-primary dark:text-dark-primary group-hover:scale-110 transition-transform">
                 <span className="material-symbols-outlined filled" style={{ fontVariationSettings: "'FILL' 1" }}>donut_large</span>
             </div>
             
             <div>
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fuel</span>
                 <div className="flex items-baseline gap-1">
                     <span className="text-3xl font-black text-light-text dark:text-white tracking-tighter">1,200</span>
                     <span className="text-[10px] font-bold text-gray-400">kcal</span>
                 </div>
             </div>

             <div className="w-full bg-gray-100 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                 <div className="h-full bg-light-primary dark:bg-dark-primary w-[60%] relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/20 animate-shine -skew-x-12"></div>
                 </div>
             </div>
          </div>
        </div>

        {/* Hydration Card */}
        <div 
          onClick={() => onNavigate(Screen.WATER_LOG)}
          className="bg-blue-50 dark:bg-[#1a202c] rounded-[2rem] p-5 border border-blue-200 dark:border-blue-900/30 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all"
        >
           <div className="absolute -bottom-4 -right-4 size-24 bg-blue-400/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl text-blue-900 dark:text-blue-200">water_drop</span>
          </div>

           <div className="relative z-10 flex flex-col h-full justify-between gap-4">
             <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                 <span className="material-symbols-outlined filled" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
             </div>
             
             <div>
                 <span className="text-xs font-bold text-blue-400 dark:text-blue-300 uppercase tracking-widest">Hydration</span>
                 <div className="flex items-baseline gap-1">
                     <span className="text-3xl font-black text-blue-900 dark:text-blue-100 tracking-tighter">1.2</span>
                     <span className="text-[10px] font-bold text-blue-400 dark:text-blue-300">L</span>
                 </div>
             </div>

             <div className="w-full bg-blue-100 dark:bg-blue-900/20 h-1.5 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-500 w-[45%] relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/20 animate-wave-slow"></div>
                 </div>
             </div>
          </div>
        </div>
      </div>

      {/* ZPD Command Deck */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 px-2">
            <div className="size-2 bg-light-primary dark:bg-dark-primary rounded-full animate-pulse"></div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Control Deck</h3>
        </div>
        
        {/* Tab Buttons */}
        <div className="grid grid-cols-4 gap-3">
          <TabButton 
            active={activeTab === 'weight'} 
            onClick={() => handleTabClick('weight')} 
            icon="monitor_weight" 
            label="Biometrics" 
            color="light-text" 
          />
          <TabButton 
            active={activeTab === 'zen'} 
            onClick={() => handleTabClick('zen')} 
            icon="self_improvement" 
            label="Mental" 
            color="light-text" 
          />
          <TabButton 
            active={activeTab === 'workout'} 
            onClick={() => handleTabClick('workout')} 
            icon="fitness_center" 
            label="Active" 
            color="light-text" 
          />
          <TabButton 
            active={activeTab === 'fasting'} 
            onClick={() => handleTabClick('fasting')} 
            icon="timer" 
            label="Watch" 
            color="light-text" 
          />
        </div>

        {/* Dynamic Content Area */}
        <div className="min-h-[160px]">
           {renderActiveTabContent()}
        </div>
      </div>

      {/* Added Styles for specific animations */}
      <style>{`
          @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
          }
          .animate-shimmer {
              animation: shimmer 2s infinite linear;
          }
          @keyframes shine {
              0% { left: -100%; }
              100% { left: 200%; }
          }
          .animate-shine {
              animation: shine 1.5s infinite;
          }
      `}</style>
    </div>
  );
};

// Reusable Components for the updated UI
const ZenPreset: React.FC<{ icon: string; title: string; duration: string; onClick?: () => void }> = ({ icon, title, duration, onClick }) => (
    <div 
        onClick={onClick}
        className="min-w-[120px] bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-white/5 flex flex-col items-center gap-2 shadow-sm cursor-pointer hover:border-light-primary dark:hover:border-dark-primary hover:scale-105 transition-all"
    >
        <span className="text-3xl filter drop-shadow-sm">{icon}</span>
        <span className="text-xs font-bold text-gray-800 dark:text-white whitespace-nowrap">{title}</span>
        <span className="text-[10px] font-mono text-gray-400 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-md">{duration}</span>
    </div>
);

const SportPreset: React.FC<{ icon: string; title: string; color: string; onClick?: () => void }> = ({ icon, title, color, onClick }) => (
    <div 
        onClick={onClick}
        className="min-w-[120px] bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-white/5 flex flex-col items-center gap-2 shadow-sm cursor-pointer hover:border-light-primary dark:hover:border-dark-primary hover:scale-105 transition-all"
    >
        <div className={`size-10 rounded-full flex items-center justify-center text-xl ${color}`}>
            {icon}
        </div>
        <span className="text-xs font-bold text-gray-800 dark:text-white whitespace-nowrap">{title}</span>
        <span className="material-symbols-outlined text-gray-300 text-sm">play_circle</span>
    </div>
);

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  color: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 h-20 rounded-2xl border transition-all duration-300 active:scale-95 ${
          active 
          ? 'bg-light-primary dark:bg-dark-primary border-light-primary dark:border-dark-primary shadow-lg shadow-light-primary/20 dark:shadow-dark-primary/20 scale-105 z-10' 
          : 'bg-white dark:bg-white/5 border-transparent hover:bg-gray-50 dark:hover:bg-white/10'
      }`}
    >
      <span className={`material-symbols-outlined text-2xl transition-transform ${active ? 'text-black dark:text-dark-bg filled scale-110' : 'text-gray-400'}`} style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span>
      <span className={`text-[9px] font-black uppercase tracking-wide leading-none ${active ? 'text-black dark:text-dark-bg' : 'text-gray-400'}`}>{label}</span>
    </button>
  );
};

export default Home;
