
import React, { useState, useEffect } from 'react';
import { Screen } from '../types';

interface MeditationTimerProps {
  onNavigate: (screen: Screen) => void;
  sessionData: { title: string; icon: string; duration?: string } | null;
  onComplete?: (data: any) => void;
}

const MeditationTimer: React.FC<MeditationTimerProps> = ({ onNavigate, sessionData, onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // Default 15 min in seconds
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (sessionData?.duration) {
      const [min, sec] = sessionData.duration.split(':').map(Number);
      setTimeLeft((min || 0) * 60 + (sec || 0));
    }
  }, [sessionData]);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const finishSession = () => {
    if (onComplete) {
        onComplete({ 
            ...sessionData,
            duration: sessionData?.duration || '10:00', // Use session duration
        });
    } else {
        onNavigate(Screen.HOME);
    }
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-teal-50 dark:bg-gray-900 font-sans">
      {/* Dynamic Background */}
      <div className={`absolute inset-0 bg-gradient-to-b from-teal-100 to-blue-50 dark:from-gray-900 dark:to-teal-900/40 transition-colors duration-[10s] ease-in-out ${isActive ? 'scale-110' : 'scale-100'}`}></div>
      
      {/* High Animation: Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
             <div key={i} className={`absolute rounded-full bg-white/20 blur-xl animate-float opacity-50`} 
                  style={{
                      width: `${Math.random() * 100 + 50}px`,
                      height: `${Math.random() * 100 + 50}px`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDuration: `${Math.random() * 10 + 10}s`,
                      animationDelay: `${Math.random() * 5}s`
                  }}
             ></div>
          ))}
      </div>
      
      {/* Animated Lotus/Mandala Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none">
          {/* Outer Breathing Ring */}
          <div className={`absolute inset-0 rounded-full border border-teal-200/20 dark:border-teal-700/20 scale-50 transition-transform duration-[4000ms] ease-in-out ${isActive ? 'scale-100 opacity-0' : 'opacity-10'}`} style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)' }}></div>
          
          <div className={`absolute inset-[15%] rounded-full border-2 border-teal-200/30 dark:border-teal-700/30 scale-50 ${isActive ? 'animate-ping' : ''}`} style={{ animationDuration: '4s' }}></div>
          <div className={`absolute inset-[30%] rounded-full border-2 border-teal-300/20 dark:border-teal-500/20 scale-75 ${isActive ? 'animate-ping' : ''}`} style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
          <div className={`absolute inset-[40%] rounded-full bg-teal-100/50 dark:bg-teal-900/10 blur-3xl transition-transform duration-[4000ms] ease-in-out ${isActive ? 'scale-125' : 'scale-100'}`}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <button onClick={() => setShowMenu(true)} className="p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-teal-800 dark:text-teal-200 transition-colors">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="flex flex-col items-center">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400 opacity-80">Mystic Springs</span>
             <h2 className="text-lg font-bold text-teal-900 dark:text-white drop-shadow-sm">{sessionData?.title || 'Meditation'}</h2>
        </div>
        <div className="size-10"></div>
      </div>

      {/* Main Visual */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
          <div className={`text-9xl mb-8 filter drop-shadow-xl transform transition-all duration-[4s] ease-in-out ${isActive ? 'scale-110 -translate-y-4 brightness-110' : 'scale-100'}`}>
              {sessionData?.icon || '🧘'}
          </div>
          
          <div className="text-8xl font-black text-teal-800 dark:text-teal-100 tracking-tighter tabular-nums mb-4 drop-shadow-md">
              {formatTime(timeLeft)}
          </div>
          <p className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest text-xs transition-opacity duration-1000">
              {isActive ? <span className="animate-pulse">Breathe In... Breathe Out...</span> : 'Ready to Begin?'}
          </p>
      </div>

      {/* Primary Control */}
      <div className="relative z-10 p-10 pb-24 flex items-center justify-center gap-6">
           <button 
             onClick={toggleTimer}
             className={`size-24 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95 ${isActive ? 'bg-amber-100 text-amber-600 ring-4 ring-amber-200/50' : 'bg-teal-500 text-white hover:scale-105 ring-4 ring-teal-300/50'}`}
           >
               <span className="material-symbols-outlined text-5xl filled">{isActive ? 'pause' : 'play_arrow'}</span>
           </button>
      </div>

      {/* Full Screen Menu Overlay */}
      {showMenu && (
        <div className="absolute inset-0 bg-teal-900/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center animate-fade-in p-8 gap-6">
           <h2 className="text-white text-2xl font-black uppercase tracking-widest mb-4">Session Menu</h2>
           
           <button 
             onClick={() => { setShowMenu(false); toggleTimer(); }}
             className="w-full py-5 bg-white text-teal-900 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
           >
             <span className="material-symbols-outlined filled">{isActive ? 'pause' : 'play_arrow'}</span>
             {isActive ? 'Pause Session' : 'Resume Session'}
           </button>

           <button 
             onClick={finishSession}
             className="w-full py-5 bg-teal-800 text-white rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
           >
             <span className="material-symbols-outlined">stop</span>
             End Session
           </button>

           <button 
             onClick={() => setShowMenu(false)}
             className="mt-8 text-teal-200 font-bold uppercase tracking-widest text-sm"
           >
             Close Menu
           </button>
        </div>
      )}
    </div>
  );
};

export default MeditationTimer;
