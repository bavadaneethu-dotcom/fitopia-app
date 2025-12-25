
import React from 'react';
import { ActivityLog, Screen } from '../types';

interface MindfulnessHistoryProps {
  logs: ActivityLog[];
  onNavigate: (screen: Screen) => void;
}

const MindfulnessHistory: React.FC<MindfulnessHistoryProps> = ({ logs, onNavigate }) => {
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-light-bg dark:bg-dark-bg animate-fade-in font-sans">
      {/* Header */}
      <div className="flex items-center px-6 pt-6 pb-2 justify-between z-20 sticky top-0 bg-light-bg/90 dark:bg-dark-bg/90 backdrop-blur-sm">
        <div className="size-12"></div>
        <h2 className="text-lg font-black leading-tight text-light-text dark:text-white uppercase tracking-tight flex items-center gap-2">
           <span className="material-symbols-outlined filled text-teal-500">self_improvement</span>
           Mind Logs
        </h2>
        <button 
          onClick={() => onNavigate(Screen.HOME)}
          className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors active:scale-90"
        >
          <span className="material-symbols-outlined text-light-text dark:text-white text-2xl">close</span>
        </button>
      </div>

      <div className="flex-1 px-6 pt-2 pb-10 overflow-y-auto no-scrollbar">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[70vh] text-center gap-6">
             {/* Animated Empty State - Zen Vibe */}
             <div className="relative size-64 flex items-center justify-center">
                 <div className="absolute inset-0 bg-teal-100 dark:bg-teal-900/20 rounded-full animate-pulse-slow blur-3xl"></div>
                 {/* Floating Elements */}
                 <span className="absolute text-6xl animate-float" style={{ animationDelay: '0s', top: '20%', left: '20%' }}>🍃</span>
                 <span className="absolute text-4xl animate-float" style={{ animationDelay: '1.5s', bottom: '30%', right: '20%' }}>🧘</span>
                 <span className="absolute text-5xl animate-float" style={{ animationDelay: '3s', top: '30%', right: '30%' }}>🕊️</span>
                 
                 <div className="size-32 rounded-full border-4 border-dashed border-teal-300 dark:border-teal-700 animate-spin-slow opacity-50"></div>
             </div>
             
             <div className="relative z-10 max-w-[280px]">
                 <h3 className="text-2xl font-black text-light-text dark:text-white mb-2 italic">"Omm..."</h3>
                 <p className="text-sm font-bold text-gray-500 dark:text-gray-400 leading-relaxed">
                    "I am one with the fluff. The fluff is with me. <br/> Your mind is empty... literally. <br/><span className="text-teal-500 uppercase">Start a Session</span>"
                 </p>
                 <p className="text-[10px] font-black text-light-primary dark:text-dark-primary uppercase tracking-widest mt-3">— Yax</p>
             </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
             <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-2xl border border-teal-200 dark:border-teal-800/50 mb-2">
                 <div className="flex justify-between items-center">
                     <span className="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider">Total Sessions</span>
                     <span className="text-2xl font-black text-teal-600 dark:text-teal-400">{logs.length}</span>
                 </div>
             </div>

             {logs.map((log, idx) => (
                <div key={log.id} className="flex items-center gap-4 p-4 bg-white dark:bg-white/5 rounded-[1.5rem] border border-gray-100 dark:border-white/5 shadow-sm animate-fade-in-up hover:scale-[1.02] transition-transform" style={{ animationDelay: `${idx * 50}ms` }}>
                    <div className="size-14 rounded-2xl bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 flex items-center justify-center text-3xl shadow-inner">
                        {log.icon}
                    </div>
                    <div className="flex-1">
                        <h4 className="text-base font-black text-gray-800 dark:text-white leading-tight uppercase tracking-tight">{log.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded">{log.timestamp}</span>
                        </div>
                    </div>
                    <div className="bg-teal-100/50 dark:bg-teal-900/40 px-3 py-1.5 rounded-xl text-teal-800 dark:text-teal-200 text-xs font-black">
                        {log.duration}
                    </div>
                </div>
             ))}
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default MindfulnessHistory;
