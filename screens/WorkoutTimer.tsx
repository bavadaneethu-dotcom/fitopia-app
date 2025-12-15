
import React, { useState, useEffect } from 'react';
import { Screen } from '../types';

interface WorkoutTimerProps {
  onNavigate: (screen: Screen) => void;
  sessionData: { title: string; icon: string; color?: string } | null;
  onComplete?: (data: any) => void;
}

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({ onNavigate, sessionData, onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

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
              duration: formatTime(timeElapsed), // Use elapsed time
              calories: Math.floor(timeElapsed * 0.15) // Estimated calories
          });
      } else {
          onNavigate(Screen.HOME);
      }
  };

  // Dynamic Theme Colors based on passed prop or default
  const themeColor = sessionData?.color || 'blue';
  const colorMap: Record<string, string> = {
      blue: 'from-blue-500 to-indigo-600',
      red: 'from-red-500 to-orange-600',
      orange: 'from-orange-500 to-yellow-500',
      yellow: 'from-yellow-400 to-orange-500',
      green: 'from-green-500 to-emerald-600'
  };
  const bgGradient = colorMap[themeColor] || colorMap['blue'];

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-gray-900 font-sans text-white">
      {/* Intense Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-20 transition-opacity duration-500 ${isActive ? 'opacity-40' : 'opacity-20'}`}></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      
      {/* HUD Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      {/* Moving Stripes/Academy Vibe */}
      <div className={`absolute inset-0 overflow-hidden ${isActive ? 'opacity-30' : 'opacity-10'}`}>
           <div className="absolute -inset-[100%] bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,#ffffff_20px,#ffffff_40px)] opacity-10 animate-slide"></div>
      </div>
      <style>{`
        @keyframes slide { from { transform: translateY(0); } to { transform: translateY(50px); } }
        .animate-slide { animation: slide 2s linear infinite; }
        @keyframes heartbeat { 
            0% { transform: scale(1); opacity: 0.5; } 
            15% { transform: scale(1.3); opacity: 1; } 
            30% { transform: scale(1); opacity: 0.5; } 
            45% { transform: scale(1.15); opacity: 0.8; } 
            60% { transform: scale(1); opacity: 0.5; } 
        }
        .animate-heartbeat { animation: heartbeat 1.5s infinite; }
      `}</style>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <button onClick={() => setShowMenu(true)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-colors">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="flex flex-col items-center">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Academy Training</span>
             <h2 className="text-lg font-bold text-white uppercase tracking-wider">{sessionData?.title || 'Workout'}</h2>
        </div>
        <div className="size-10"></div>
      </div>

      {/* Main Stats */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
          <div className={`text-8xl mb-10 transform transition-all duration-300 relative ${isActive ? 'scale-125' : 'scale-100 grayscale opacity-50'}`}>
              {sessionData?.icon || '💪'}
              {isActive && (
                  <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-ping"></div>
              )}
          </div>
          
          <div className="relative">
              <div className="text-[120px] font-black text-white tracking-tighter tabular-nums drop-shadow-[0_0_25px_rgba(255,255,255,0.4)] leading-none">
                  {formatTime(timeElapsed)}
              </div>
              {isActive && (
                  <div className="flex justify-center mt-2 gap-2 items-center">
                    <span className="flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="text-xs font-bold text-red-400 uppercase tracking-widest animate-pulse">Recording</span>
                  </div>
              )}
          </div>
          
          {/* Live Metrics HUD */}
          <div className="grid grid-cols-2 gap-12 mt-16 w-full max-w-xs">
              <div className="flex flex-col items-center bg-black/20 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-1 mb-1">
                      <span className="material-symbols-outlined text-red-500 animate-heartbeat filled">favorite</span>
                      <span className="text-3xl font-black">142</span>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">Heart Rate</span>
              </div>
              
              <div className="flex flex-col items-center bg-black/20 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-1 mb-1">
                      <span className="material-symbols-outlined text-orange-500 filled">local_fire_department</span>
                      <span className="text-3xl font-black">{(timeElapsed * 0.15).toFixed(0)}</span>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">Kcal Burned</span>
              </div>
          </div>
      </div>

      {/* Primary Controls */}
      <div className="relative z-10 p-10 pb-20 flex items-center justify-center gap-6">
           <button 
             onClick={toggleTimer}
             className={`w-full max-w-[240px] h-24 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all active:scale-95 font-black text-2xl tracking-wide uppercase gap-3 border-b-8 border-black/30 ${isActive ? 'bg-yellow-400 text-black' : 'bg-green-500 text-white hover:brightness-110'}`}
           >
               <span className="material-symbols-outlined text-4xl filled">{isActive ? 'pause' : 'play_arrow'}</span>
               {isActive ? 'Pause' : 'Start'}
           </button>
      </div>

      {/* Full Screen Menu Overlay */}
      {showMenu && (
        <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center animate-fade-in p-8 gap-6">
           <div className="text-center mb-4">
               <h2 className="text-white text-3xl font-black uppercase tracking-widest italic">Mission Menu</h2>
               <div className="h-1 w-20 bg-yellow-400 mx-auto mt-2"></div>
           </div>
           
           <button 
             onClick={() => { setShowMenu(false); toggleTimer(); }}
             className="w-full py-6 bg-white text-black rounded-xl font-black text-xl uppercase tracking-wider shadow-lg flex items-center justify-center gap-3 transform hover:scale-[1.02] transition-transform"
           >
             <span className="material-symbols-outlined filled text-2xl">{isActive ? 'pause' : 'play_arrow'}</span>
             {isActive ? 'Pause Mission' : 'Resume Mission'}
           </button>

           <button 
             onClick={finishSession}
             className="w-full py-6 bg-red-600 text-white rounded-xl font-black text-xl uppercase tracking-wider shadow-lg flex items-center justify-center gap-3 transform hover:scale-[1.02] transition-transform"
           >
             <span className="material-symbols-outlined filled text-2xl">stop</span>
             Abort / Finish
           </button>

           <button 
             onClick={() => setShowMenu(false)}
             className="mt-8 text-gray-500 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors"
           >
             Dismiss
           </button>
        </div>
      )}
    </div>
  );
};

export default WorkoutTimer;
