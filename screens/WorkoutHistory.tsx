
import React, { useState, useEffect } from 'react';
import { ActivityLog, Screen } from '../types';

interface WorkoutHistoryProps {
  logs: ActivityLog[];
  onNavigate: (screen: Screen) => void;
}

const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({ logs, onNavigate }) => {
  // Typewriter effect state
  const quotePart1 = "Life isn't some cartoon musical where you sing a little song and your log fills up.";
  const [text1, setText1] = useState("");
  const [showPart2, setShowPart2] = useState(false);

  useEffect(() => {
    if (logs.length === 0) {
      setText1("");
      setShowPart2(false);

      let index = 0;
      const startDelay = setTimeout(() => {
          const interval = setInterval(() => {
            setText1(quotePart1.slice(0, index + 1));
            index++;
            if (index > quotePart1.length) {
                clearInterval(interval);
                setTimeout(() => setShowPart2(true), 400);
            }
          }, 40);
          return () => clearInterval(interval);
      }, 1200);
      
      return () => clearTimeout(startDelay);
    }
  }, [logs.length]);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-light-bg dark:bg-dark-bg animate-fade-in font-sans">
      {/* Header */}
      <div className="flex items-center px-6 pt-6 pb-2 justify-between z-20 sticky top-0 bg-light-bg/90 dark:bg-dark-bg/90 backdrop-blur-sm">
        <div className="size-12"></div>
        <h2 className="text-lg font-black leading-tight text-light-text dark:text-white uppercase tracking-tight flex items-center gap-2">
           <span className="material-symbols-outlined filled text-orange-500">fitness_center</span>
           Training Log
        </h2>
        <button 
          onClick={() => onNavigate(Screen.ANALYTICS)}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white dark:bg-dark-surface border border-gray-100 dark:border-white/10 shadow-sm transition-colors active:scale-90"
        >
          <span className="material-symbols-outlined text-light-text dark:text-white text-2xl">close</span>
        </button>
      </div>

      <div className="flex-1 px-6 pt-2 pb-10 overflow-y-auto no-scrollbar flex flex-col">
        {logs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[65vh]">
             <div className="relative w-64 h-[340px] border-2 border-[#6ba5ff] dark:border-blue-400/50 flex flex-col items-center mb-8 animate-scan-in bg-blue-50/10 backdrop-blur-[2px]">
                <div className="absolute top-16 -left-3 w-3 h-8 border-2 border-r-0 border-[#6ba5ff] dark:border-blue-400/50 bg-light-bg dark:bg-dark-bg"></div>
                <div className="flex items-center gap-2 text-[#D97706] dark:text-orange-400 mt-6 mb-auto font-black uppercase tracking-widest text-sm animate-fade-in delay-700 opacity-0 fill-mode-forwards">
                    <span className="material-symbols-outlined text-lg">fitness_center</span>
                    TRAINING LOG
                </div>
                <div className="relative mb-auto">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-40 bg-[#FEF3C7] dark:bg-orange-900/20 rounded-full blur-2xl animate-pulse-slow"></div>
                    <div className="relative z-10 text-[100px] animate-float drop-shadow-xl">🍩</div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-4xl animate-run-in-place">🏃</div>
                </div>
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#6ba5ff] dark:border-blue-400"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#6ba5ff] dark:border-blue-400"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#6ba5ff] dark:border-blue-400"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#6ba5ff] dark:border-blue-400"></div>
             </div>
             
             <div className="text-center max-w-xs space-y-3 z-10">
                 <h1 className="text-3xl font-black italic text-[#3F2E23] dark:text-white tracking-tighter transform -rotate-2 drop-shadow-sm animate-stamp origin-center">"DISMISSED!"</h1>
                 <div className="min-h-[60px]">
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 leading-relaxed italic">
                        "{text1}
                        {showPart2 && (
                             <>
                                <br/>
                                <button onClick={() => onNavigate(Screen.MANUAL_WORKOUT)} className="text-[#F97316] font-black uppercase animate-pop-in inline-block mt-2 hover:underline cursor-pointer">START TRAINING!</button>"
                             </>
                        )}
                        {!showPart2 && text1.length > 0 && <span className="animate-pulse">|</span>}
                    </p>
                 </div>
             </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 pb-20">
             <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-2xl border border-orange-200 dark:border-orange-800/50 mb-2">
                 <div className="flex justify-between items-center">
                     <span className="text-xs font-bold text-orange-700 dark:text-orange-300 uppercase tracking-wider">Total Missions</span>
                     <span className="text-2xl font-black text-orange-600 dark:text-orange-400">{logs.length}</span>
                 </div>
             </div>
             {logs.map((log, idx) => (
                <div key={log.id} className="flex items-center gap-4 p-4 bg-white dark:bg-white/5 rounded-[1.5rem] border border-gray-100 dark:border-white/5 shadow-sm animate-fade-in-up">
                    <div className={`size-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${log.color ? `bg-${log.color}-100 text-${log.color}-600 dark:bg-${log.color}-900/20 dark:text-${log.color}-300` : 'bg-orange-100 text-orange-600'}`}>{log.icon}</div>
                    <div className="flex-1">
                        <h4 className="text-base font-black text-gray-800 dark:text-white leading-tight uppercase tracking-tight">{log.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded">{log.timestamp}</span>
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-300">{log.duration}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-xl font-black text-gray-800 dark:text-white">{log.calories || '-'}</span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">kcal</span>
                    </div>
                </div>
             ))}
          </div>
        )}
      </div>
      <style>{`
        @keyframes scan-in { 0% { clip-path: inset(0 100% 0 0); opacity: 0; } 100% { clip-path: inset(0 0 0 0); opacity: 1; } }
        .animate-scan-in { animation: scan-in 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        @keyframes stamp { 0% { transform: scale(2.5) rotate(-10deg); opacity: 0; } 50% { transform: scale(0.9) rotate(-2deg); opacity: 1; } 70% { transform: scale(1.05) rotate(-2deg); } 100% { transform: scale(1) rotate(-2deg); opacity: 1; } }
        .animate-stamp { animation: stamp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.6s backwards; }
        @keyframes run-in-place { 0%, 100% { transform: translate(-50%, 0) rotate(0deg); } 25% { transform: translate(-50%, -6px) rotate(5deg); } 50% { transform: translate(-50%, 0) rotate(0deg); } 75% { transform: translate(-50%, -6px) rotate(5deg); } }
        .animate-run-in-place { animation: run-in-place 0.5s infinite linear; }
        @keyframes pop-in { 0% { transform: scale(0); opacity: 0; } 70% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        .animate-pop-in { animation: pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .fill-mode-forwards { animation-fill-mode: forwards; }
      `}</style>
    </div>
  );
};

export default WorkoutHistory;
