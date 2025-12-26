
import React, { useState, useEffect } from 'react';
import { Screen, Character } from '../types';

interface MeditationTimerProps {
  onNavigate: (screen: Screen) => void;
  sessionData: { title: string; icon: string; duration?: string } | null;
  activeCharacter: Character;
  onComplete?: (data: any) => void;
}

const MeditationTimer: React.FC<MeditationTimerProps> = ({ onNavigate, sessionData, activeCharacter, onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [initialTime, setInitialTime] = useState(15 * 60);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (sessionData?.duration) {
      const [min, sec] = sessionData.duration.split(':').map(Number);
      setInitialTime((min || 0) * 60 + (sec || 0));
      setTimeLeft((min || 0) * 60 + (sec || 0));
    }
  }, [sessionData]);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      finishSession();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const attemptStop = () => {
    const elapsed = initialTime - timeLeft;
    // Show confirmation if less than 5 minutes elapsed and currently active
    if (elapsed < 300 && isActive) {
        setIsActive(false);
        setShowConfirm(true);
    } else {
        finishSession();
    }
  };

  const finishSession = () => {
    const elapsed = initialTime - timeLeft;
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    const formattedDuration = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    // Immediately trigger completion without the intermediate feedback screen
    if (onComplete) {
      onComplete({ ...sessionData, duration: formattedDuration });
    } else {
      onNavigate(Screen.HOME);
    }
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-[#F0FDFA] font-sans transition-all duration-1000">
      
      {/* Background Zen Leaves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <span className="absolute top-[10%] left-[10%] text-2xl animate-float opacity-30">🍃</span>
          <span className="absolute top-[20%] right-[15%] text-xl animate-float delay-700 opacity-20">🍃</span>
          <span className="absolute bottom-[20%] left-[25%] text-2xl animate-float delay-300 opacity-30">🍃</span>
      </div>

      {/* Header matching screenshot */}
      <div className="relative z-20 flex flex-col items-center pt-12 pb-2">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0F766E] opacity-70 mb-1">
            Mystic Springs Oasis
        </span>
        <h2 className="text-2xl font-black text-[#0F766E] uppercase tracking-tight">
            {sessionData?.title || 'Mindfulness'}
        </h2>
        
        <button 
          onClick={() => onNavigate(Screen.HOME)}
          className="absolute top-10 right-6 size-10 rounded-full bg-gray-200/40 backdrop-blur-sm flex items-center justify-center transition-transform active:scale-90"
        >
          <span className="material-symbols-outlined text-[#0F766E] font-bold text-xl">close</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-10">
          {/* Sloth Character visualization */}
          <div className={`text-9xl mb-12 transform transition-all duration-[5s] ease-in-out ${isActive ? 'scale-105' : 'scale-100'}`}>
              <div className="relative">
                  <span className="drop-shadow-2xl">🦥</span>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-black/5 blur-md rounded-full -z-10"></div>
              </div>
          </div>

          <div className="text-[100px] font-black text-[#0F766E] tracking-tighter leading-none mb-4">
              {formatTime(timeLeft)}
          </div>
          
          <p className="text-[#0F766E] font-black uppercase text-[11px] tracking-[0.2em] opacity-60">
              {isActive ? 'Exhale the Chaos...' : 'Ready to Breathe?'}
          </p>
      </div>

      {/* Control Panel matching screenshot footer style */}
      <div className="relative z-10 pb-20 flex items-center justify-center gap-6">
           {/* Play/Pause Pill Button */}
           <button 
                onClick={() => setIsActive(!isActive)} 
                className={`h-16 w-36 rounded-[2rem] flex items-center justify-center shadow-xl shadow-teal-600/20 transition-all active:scale-95 ${isActive ? 'bg-[#FFD60A]' : 'bg-[#14B8A6]'}`}
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
              <div className="bg-white rounded-[3rem] p-8 text-center shadow-2xl border-4 border-[#14B8A6] max-w-xs animate-pop-in">
                  <h3 className="text-2xl font-black text-gray-800 mb-2 uppercase tracking-tight">Pause your Zen?</h3>
                  <p className="text-sm font-bold text-gray-500 mb-8 italic">"Even Flash takes longer to say 'Hello'. Stay a bit longer?"</p>
                  <div className="flex flex-col gap-3">
                      <button onClick={() => { setShowConfirm(false); setIsActive(true); }} className="w-full py-4 bg-[#14B8A6] text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-lg">Resume Peace</button>
                      <button onClick={() => { setShowConfirm(false); finishSession(); }} className="w-full py-4 bg-gray-100 text-gray-400 font-bold rounded-2xl uppercase tracking-widest text-xs">End Shift</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default MeditationTimer;
