
import React, { useState, useEffect } from 'react';
import { Screen, FastingPlanConfig } from '../types';

interface FastingTimerProps {
  onNavigate: (screen: Screen) => void;
  isFasting: boolean;
  setIsFasting: (val: boolean) => void;
  fastStartTime: Date | null;
  setFastStartTime: (date: Date | null) => void;
  fastingPlan: FastingPlanConfig;
}

const FastingTimer: React.FC<FastingTimerProps> = ({ onNavigate, isFasting, setIsFasting, fastStartTime, setFastStartTime, fastingPlan }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const fastGoalHours = fastingPlan.fastingHours || 16; 
  
  useEffect(() => {
    // Sync current time immediately on mount
    setCurrentTime(new Date());
    
    // Only run interval if fasting is active
    let timer: any;
    if (isFasting) {
      timer = setInterval(() => {
          setCurrentTime(new Date());
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isFasting]);

  const getFastingStats = () => {
    if (!fastStartTime || !isFasting) return { h: '00', m: '00', s: '00', percent: 0, totalSecs: 0 };
    
    const diff = Math.max(0, currentTime.getTime() - fastStartTime.getTime());
    const totalSeconds = Math.floor(diff / 1000);
    const goalSeconds = fastGoalHours * 3600;
    const percent = Math.min((totalSeconds / goalSeconds) * 100, 100);
    
    return {
        h: Math.floor(totalSeconds / 3600).toString().padStart(2, '0'),
        m: Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0'),
        s: (totalSeconds % 60).toString().padStart(2, '0'),
        percent,
        totalSecs: totalSeconds
    };
  };

  const stats = getFastingStats();
  
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (stats.percent / 100) * circumference;

  return (
    <div className={`relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-[#FFF8EE] font-sans transition-colors duration-700`}>
      
      {/* Atmosphere Glow when active */}
      {isFasting && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180vw] h-[180vw] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] animate-pulse-slow pointer-events-none"></div>
      )}

      {/* Top Header */}
      <div className="relative z-20 flex items-center justify-between p-6 pt-12">
        <div className="size-12"></div>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFEDD5] border border-[#FED7AA] shadow-sm">
            <span className={`size-2 rounded-full ${isFasting ? 'bg-blue-500 animate-pulse' : 'bg-[#F97316]'}`}></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#9A3412]">{isFasting ? 'ON DUTY' : 'RESTING'}</span>
        </div>
        <button 
          onClick={() => onNavigate(Screen.HOME)}
          className="size-12 rounded-full flex items-center justify-center bg-white/40 dark:bg-black/10 hover:bg-black/20 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-gray-800">close</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
          
          {/* Main Visual Circle */}
          <div className="relative size-80 flex items-center justify-center">
              {/* Ring Background */}
              <div className="absolute inset-0 rounded-full border-[18px] border-[#FFEDD5] opacity-50"></div>
              
              {/* Active Ring (SVG) */}
              <svg className="absolute inset-0 size-full transform -rotate-90 overflow-visible" viewBox="0 0 280 280">
                  {isFasting && (
                      <circle 
                        cx="140" cy="140" r={radius} 
                        className="stroke-blue-500 transition-all duration-1000 ease-out"
                        fill="none" strokeWidth="16" strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                      />
                  )}
              </svg>

              {/* Central Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  {isFasting ? (
                      <div className="animate-fade-in flex flex-col items-center">
                          <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-2">TIME ON DUTY</span>
                          <div className="flex items-baseline gap-1">
                              <span className="text-6xl font-black tracking-tighter text-gray-800 font-mono">{stats.h}</span>
                              <span className="text-xl font-bold text-gray-400">h</span>
                              <span className="text-6xl font-black tracking-tighter text-gray-800 font-mono">{stats.m}</span>
                              <span className="text-xl font-bold text-gray-400">m</span>
                          </div>
                          {/* Added Seconds for visual "ticking" effect */}
                          <div className="mt-1">
                             <span className="text-lg font-black text-blue-400 font-mono tracking-widest">{stats.s}s</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-4 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{stats.percent.toFixed(1)}% TO TARGET</span>
                          </div>
                      </div>
                  ) : (
                      <div className="animate-fade-in flex flex-col items-center">
                          <span className="text-7xl mb-4 drop-shadow-lg transform -rotate-12">🥕</span>
                          <h2 className="text-[28px] font-black text-[#1F2937] uppercase tracking-tighter leading-none">Ready to fast?</h2>
                          <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.15em] mt-3">Goal: {fastGoalHours} Hours</p>
                      </div>
                  )}
              </div>
          </div>

          {/* Coach's Log Card */}
          <div className="mt-16 mb-10 w-full max-w-sm">
              <div className="p-6 rounded-[2rem] border-2 border-dashed border-[#FED7AA] bg-[#FFFBF0] flex items-center gap-5 shadow-sm">
                  <div className="size-14 rounded-2xl shrink-0 flex items-center justify-center text-3xl bg-[#FFEDD5]">
                      👮
                  </div>
                  <div className="flex-1">
                      <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-[#F97316]">Coach's Log</p>
                      <p className="text-[13px] font-bold italic leading-snug text-[#4B5563]">
                          {isFasting 
                            ? "\"Focus on the case, rookie! Your body is preparing for elite performance. Keep that focus high!\"" 
                            : "\"Resting is part of the training! Clock in when you're ready for your next patrol shift.\""}
                      </p>
                  </div>
              </div>
          </div>

          {/* Large Action Button */}
          <button 
            onClick={() => { 
                if(isFasting) {
                    setIsFasting(false); 
                    setFastStartTime(null); 
                } else { 
                    const now = new Date();
                    setFastStartTime(now); 
                    setCurrentTime(now);
                    setIsFasting(true); 
                } 
            }} 
            className="w-full max-w-xs h-16 rounded-[1.5rem] bg-[#2563EB] hover:bg-blue-700 text-white font-black uppercase tracking-[0.15em] text-xs shadow-xl shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
              <span className="material-symbols-outlined filled text-lg">
                  {isFasting ? 'stop_circle' : 'play_circle'}
              </span>
              {isFasting ? 'End Fasting Patrol' : 'Clock In for Duty'}
          </button>
      </div>

      <style>{`
        .animate-pulse-slow {
            animation: pulse-ring 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse-ring {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.1; }
            50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.05; }
        }
      `}</style>
    </div>
  );
};

export default FastingTimer;
