
import React, { useState, useEffect } from 'react';
import { Screen, Character } from '../types';

interface WorkoutTimerProps {
  onNavigate: (screen: Screen) => void;
  sessionData: { title: string; icon: string; color?: string } | null;
  activeCharacter: Character;
  onComplete?: (data: any) => void;
}

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({ onNavigate, sessionData, activeCharacter, onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive) interval = setInterval(() => setTimeElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const attemptStop = () => {
    if (timeElapsed < 300) { // 5 mins
        setIsActive(false);
        setShowConfirm(true);
    } else {
        finishSession();
    }
  };

  const finishSession = () => {
    const formattedDuration = formatTime(timeElapsed);
    if (onComplete) {
      onComplete({ 
        ...sessionData, 
        duration: formattedDuration, 
        calories: Math.floor(timeElapsed * 0.15) 
      });
    } else {
      onNavigate(Screen.HOME);
    }
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-[#F8FAFC] dark:bg-[#020617] font-sans transition-all duration-1000">
      
      {/* Background Decorative Academy Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <span className="absolute top-[10%] left-[10%] text-2xl animate-float opacity-10">👮</span>
          <span className="absolute top-[20%] right-[15%] text-xl animate-float delay-700 opacity-10">🚔</span>
          <span className="absolute bottom-[20%] left-[25%] text-2xl animate-float delay-300 opacity-10">🛡️</span>
      </div>

      {/* Header matching improved screen style */}
      <div className="relative z-20 flex flex-col items-center pt-12 pb-2">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1E40AF] opacity-70 mb-1">
            Academy Assignment
        </span>
        <h2 className="text-2xl font-black text-[#1E40AF] uppercase tracking-tight">
            {sessionData?.title || 'Training Drill'}
        </h2>
        
        <button 
          onClick={() => onNavigate(Screen.HOME)}
          className="absolute top-10 right-6 size-10 rounded-full bg-gray-200/40 backdrop-blur-sm flex items-center justify-center transition-transform active:scale-90"
        >
          <span className="material-symbols-outlined text-[#1E40AF] font-bold text-xl">close</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-10">
          {/* Character visualization centered */}
          <div className={`text-9xl mb-12 transform transition-all duration-[5s] ease-in-out ${isActive ? 'scale-105 rotate-2' : 'scale-100'}`}>
              <div className="relative">
                  <span className="drop-shadow-2xl">{sessionData?.icon || '🚔'}</span>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-black/5 blur-md rounded-full -z-10"></div>
              </div>
          </div>

          <div className="text-[100px] font-black text-[#1E40AF] tracking-tighter leading-none mb-4">
              {formatTime(timeElapsed)}
          </div>
          
          <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 bg-blue-100/50 dark:bg-blue-900/20 px-4 py-2 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                  <span className="material-symbols-outlined text-orange-500 text-lg filled">local_fire_department</span>
                  <span className="text-xl font-black text-[#1E40AF]">{(timeElapsed * 0.15).toFixed(0)} <span className="text-[10px] font-bold text-slate-400">KCAL</span></span>
              </div>
          </div>
          
          <p className="text-[#1E40AF] font-black uppercase text-[11px] tracking-[0.2em] opacity-60 mt-8">
              {isActive ? 'Keep pushing, Officer!' : 'Mission Briefing Complete'}
          </p>
      </div>

      {/* Control Panel matching screenshot footer style */}
      <div className="relative z-10 pb-20 flex items-center justify-center gap-6">
           {/* Play/Pause Pill Button */}
           <button 
                onClick={() => setIsActive(!isActive)} 
                className={`h-16 w-36 rounded-[2rem] flex items-center justify-center shadow-xl shadow-blue-600/20 transition-all active:scale-95 ${isActive ? 'bg-[#FFD60A]' : 'bg-[#2563EB]'}`}
           >
               <span className={`material-symbols-outlined text-4xl filled ${isActive ? 'text-black' : 'text-white'}`}>
                   {isActive ? 'pause' : 'play_arrow'}
               </span>
           </button>

           {/* Stop Square Button */}
           <button 
                onClick={attemptStop} 
                className="size-16 rounded-2xl bg-white border border-gray-100 text-gray-400 flex items-center justify-center shadow-lg active:scale-90 transition-transform"
           >
               <span className="material-symbols-outlined text-3xl filled">stop</span>
           </button>
      </div>

      {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6 animate-fade-in">
              <div className="bg-white rounded-[3rem] p-8 text-center shadow-2xl border-4 border-[#2563EB] max-w-xs animate-pop-in">
                  <h3 className="text-2xl font-black text-gray-800 mb-2 uppercase tracking-tight">Desertion?</h3>
                  <p className="text-sm font-bold text-gray-500 mb-8 italic">"You wouldn't last a minute in the Tundratown district with that effort! Staying for the full shift?"</p>
                  <div className="flex flex-col gap-3">
                      <button onClick={() => { setShowConfirm(false); setIsActive(true); }} className="w-full py-4 bg-[#2563EB] text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-lg">Back to Duty</button>
                      <button onClick={() => { setShowConfirm(false); finishSession(); }} className="w-full py-4 bg-gray-100 text-gray-400 font-bold rounded-2xl uppercase tracking-widest text-xs">Clock Out Anyway</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default WorkoutTimer;
