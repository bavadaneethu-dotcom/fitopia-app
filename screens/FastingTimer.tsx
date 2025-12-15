
import React, { useState, useEffect } from 'react';
import { Screen } from '../types';

interface FastingTimerProps {
  onNavigate: (screen: Screen) => void;
  isFasting: boolean;
  setIsFasting: (val: boolean) => void;
  fastStartTime: Date | null;
  setFastStartTime: (date: Date | null) => void;
}

const FastingTimer: React.FC<FastingTimerProps> = ({ onNavigate, isFasting, setIsFasting, fastStartTime, setFastStartTime }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update current time every second to drive the timer
    const timer = setInterval(() => {
        setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getFastingString = () => {
    if (!fastStartTime || !isFasting) return { h: '00', m: '00', s: '00', diff: 0 };
    
    // Ensure fastStartTime is a valid Date object
    const start = new Date(fastStartTime);
    const now = currentTime;
    
    const diff = Math.max(0, now.getTime() - start.getTime());
    
    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return {
        h: hours.toString().padStart(2, '0'),
        m: mins.toString().padStart(2, '0'),
        s: secs.toString().padStart(2, '0'),
        diff: diff // Return raw diff for progress calculation
    };
  };

  const handleToggle = () => {
      if (isFasting) {
          setIsFasting(false);
          setFastStartTime(null);
      } else {
          setIsFasting(true);
          setFastStartTime(new Date());
      }
  };

  const time = getFastingString();
  
  // Calculate progress ring (Visual effect looping every minute or based on 16h goal)
  // Let's make it loop every minute for the 'seconds' indicator visual
  const secondsProgress = parseFloat(time.s) / 60;
  
  return (
    <div className={`relative flex h-full min-h-screen w-full flex-col overflow-hidden transition-colors duration-1000 font-sans ${isFasting ? 'bg-indigo-950 text-white' : 'bg-orange-50 text-gray-800'}`}>
      
      {/* Dynamic Backgrounds */}
      {isFasting ? (
          <>
            {/* Night Watch / ZPD Patrol Theme */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-black z-0"></div>
            {/* Spotlight Effect */}
            <div className="absolute top-0 left-1/4 w-40 h-[100vh] bg-white/5 rotate-12 blur-xl animate-pulse-slow"></div>
            <div className="absolute top-0 right-1/4 w-20 h-[100vh] bg-blue-500/5 -rotate-12 blur-xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
            
            {/* Stars */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          </>
      ) : (
          <>
             {/* Day Theme */}
             <div className="absolute inset-0 bg-gradient-to-b from-orange-100 to-yellow-50 z-0"></div>
             <div className="absolute -top-20 -right-20 size-80 bg-yellow-300/30 rounded-full blur-3xl animate-pulse-slow"></div>
          </>
      )}

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <button 
          onClick={() => onNavigate(Screen.HOME)}
          className={`size-12 rounded-full backdrop-blur-md flex items-center justify-center transition-colors ${isFasting ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/5 hover:bg-black/10 text-gray-800'}`}
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
             <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isFasting ? 'text-blue-300' : 'text-orange-500'}`}>
                 {isFasting ? 'ZPD Night Watch' : 'Break Time'}
             </span>
             <h2 className={`text-lg font-bold uppercase tracking-wider ${isFasting ? 'text-white' : 'text-gray-900'}`}>
                 {isFasting ? 'Shift Active' : 'Eating Window'}
             </h2>
        </div>
        <div className="size-12"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
          
          {/* Central Timer Visual */}
          <div className="relative size-72 flex items-center justify-center mb-10">
              {/* Outer Pulse Rings */}
              <div className={`absolute inset-0 rounded-full border-4 ${isFasting ? 'border-indigo-500/30 animate-ping' : 'border-orange-300/30'} opacity-20`}></div>
              <div className={`absolute -inset-4 rounded-full border-2 ${isFasting ? 'border-blue-500/20' : 'border-yellow-400/20'}`}></div>
              
              {/* Badge Shape Container */}
              <div className={`relative size-full rounded-full shadow-2xl flex flex-col items-center justify-center backdrop-blur-sm border-4 transition-colors duration-500 ${isFasting ? 'bg-black/30 border-blue-500/50 shadow-blue-900/50' : 'bg-white/60 border-orange-400/50 shadow-orange-200'}`}>
                  
                  {isFasting ? (
                      <div className="flex flex-col items-center animate-fade-in">
                          <span className="material-symbols-outlined text-4xl text-blue-400 mb-2 filled">local_police</span>
                          <div className="text-6xl font-black tracking-tighter tabular-nums leading-none text-white drop-shadow-lg">
                              {time.h}:{time.m}
                          </div>
                          <span className="text-xs font-bold text-blue-300 uppercase tracking-[0.2em] mt-2">On Duty</span>
                      </div>
                  ) : (
                      <div className="flex flex-col items-center animate-fade-in">
                          <span className="material-symbols-outlined text-5xl text-orange-500 mb-2">restaurant</span>
                          <span className="text-2xl font-black text-gray-800 uppercase tracking-tight">Feed</span>
                          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest mt-1">Window Open</span>
                      </div>
                  )}

                  {/* Progress Ring SVG */}
                  <svg className="absolute inset-0 size-full -rotate-90 pointer-events-none">
                       <circle
                         cx="50%" cy="50%" r="48%"
                         fill="transparent"
                         stroke={isFasting ? "rgba(59, 130, 246, 0.2)" : "rgba(251, 146, 60, 0.2)"}
                         strokeWidth="4"
                       />
                       <circle
                         cx="50%" cy="50%" r="48%"
                         fill="transparent"
                         stroke={isFasting ? "#60A5FA" : "#F97316"}
                         strokeWidth="4"
                         strokeDasharray="289" // Approx circumference
                         strokeDashoffset={isFasting ? 289 - (secondsProgress * 289) : 0} 
                         strokeLinecap="round"
                         className="transition-all duration-1000 ease-linear"
                       />
                  </svg>
              </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={handleToggle}
            className={`w-full max-w-xs h-20 rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 group relative overflow-hidden ${isFasting ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-yellow-400 hover:bg-yellow-300 text-black'}`}
          >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-2xl"></div>
              
              <span className="material-symbols-outlined text-3xl filled relative z-10">{isFasting ? 'stop_circle' : 'play_circle'}</span>
              <div className="flex flex-col items-start relative z-10">
                  <span className="text-xl font-black uppercase tracking-wide">{isFasting ? 'End Shift' : 'Start Watch'}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isFasting ? 'text-red-200' : 'text-yellow-800'}`}>
                      {isFasting ? 'Stop Fasting' : 'Begin Fast'}
                  </span>
              </div>
          </button>

          {/* Info Stats */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs mt-12">
              <div className={`p-4 rounded-xl border flex flex-col items-center ${isFasting ? 'bg-white/5 border-white/10' : 'bg-white/60 border-orange-200'}`}>
                   <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1">Started</span>
                   <span className="font-mono font-bold text-lg">
                       {fastStartTime ? new Date(fastStartTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                   </span>
              </div>
              <div className={`p-4 rounded-xl border flex flex-col items-center ${isFasting ? 'bg-white/5 border-white/10' : 'bg-white/60 border-orange-200'}`}>
                   <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1">Goal</span>
                   <span className="font-mono font-bold text-lg">16h</span>
              </div>
          </div>

      </div>
    </div>
  );
};

export default FastingTimer;
