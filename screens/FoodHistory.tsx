
import React, { useState } from 'react';
import { Screen, FoodLogItem } from '../types';

interface FoodHistoryProps {
  foodLogs: FoodLogItem[];
  onNavigate: (screen: Screen) => void;
}

const FoodHistory: React.FC<FoodHistoryProps> = ({ foodLogs, onNavigate }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Group logs by date
  const groupedLogs = foodLogs.reduce((acc, log) => {
    const date = log.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(log);
    return acc;
  }, {} as Record<string, FoodLogItem[]>);

  // Sort dates descending
  const sortedDates = Object.keys(groupedLogs).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-light-bg dark:bg-dark-bg animate-fade-in font-sans transition-colors duration-300">
      
      {/* Header */}
      <div className="flex items-center px-6 pt-6 pb-2 justify-between z-20 sticky top-0 bg-light-bg/90 dark:bg-dark-bg/90 backdrop-blur-sm">
        <div className="size-12"></div>
        <h2 className="text-lg font-black leading-tight text-light-text dark:text-white uppercase tracking-tight flex items-center gap-2">
           <span className="material-symbols-outlined filled text-yellow-500">folder_open</span>
           Evidence Locker
        </h2>
        <button 
          onClick={() => onNavigate(Screen.ANALYTICS)}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white dark:bg-dark-surface border border-gray-100 dark:border-white/10 shadow-sm transition-colors active:scale-90"
        >
          <span className="material-symbols-outlined text-light-text dark:text-white text-2xl">close</span>
        </button>
      </div>

      <div className="flex-1 px-6 pt-4 pb-10 overflow-y-auto no-scrollbar">
        {foodLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[70vh] text-center gap-6 opacity-60">
             <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600">no_meals</span>
             <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">No food evidence recorded.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8 pb-10">
             {sortedDates.map((date) => (
               <div key={date}>
                 <div className="flex items-center gap-4 mb-4">
                    <span className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full border border-gray-200 dark:border-white/5">
                        {new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <div className="h-px bg-gray-200 dark:bg-white/10 flex-1"></div>
                 </div>
                 
                 <div className="flex flex-col gap-3">
                    {groupedLogs[date].map((item) => (
                        <FoodHistoryItem 
                            key={item.id} 
                            item={item} 
                            isExpanded={expandedId === item.id} 
                            onToggle={() => toggleExpand(item.id)} 
                        />
                    ))}
                 </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FoodHistoryItem: React.FC<{ item: FoodLogItem; isExpanded: boolean; onToggle: () => void }> = ({ item, isExpanded, onToggle }) => {
    const micros = [
        { label: 'Vit A', amount: '12%', color: 'bg-orange-400' },
        { label: 'Vit C', amount: '22%', color: 'bg-yellow-400' },
        { label: 'Calcium', amount: '8%', color: 'bg-blue-400' },
        { label: 'Iron', amount: '15%', color: 'bg-red-400' }
    ];

    const macros = item.macros || { protein: 0, carbs: 0, fat: 0 };
    const totalMacro = (macros.protein + macros.carbs + macros.fat) || 1;

    return (
        <div 
            onClick={onToggle}
            className={`bg-white dark:bg-dark-surface border transition-all duration-300 rounded-[1.5rem] overflow-hidden cursor-pointer ${
                isExpanded 
                ? 'shadow-xl border-yellow-400 dark:border-yellow-600 scale-[1.02]' 
                : 'shadow-sm border-gray-100 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20 active:scale-[0.99]'
            }`}
        >
            <div className="flex items-center gap-4 p-4">
                <div className="size-14 rounded-2xl bg-gray-50 dark:bg-white/10 flex items-center justify-center text-3xl shadow-inner shrink-0">
                    {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-base font-black text-gray-800 dark:text-white leading-tight truncate">{item.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded">{item.timestamp}</span>
                        {item.displayAmount && <span className="text-[10px] font-bold text-gray-500 dark:text-gray-300">{item.displayAmount}</span>}
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xl font-black text-gray-800 dark:text-white">{item.calories}</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">kcal</span>
                </div>
                <span className={`material-symbols-outlined transition-transform duration-300 text-gray-400 ${isExpanded ? 'rotate-180' : ''}`}>expand_more</span>
            </div>

            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-5 pt-0 border-t border-dashed border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/20">
                    <div className="pt-4 mb-6">
                        <div className="flex justify-between items-end mb-2">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Macro Composition</p>
                            <span className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase border border-green-500 px-2 py-0.5 rounded rotate-[-2deg]">VERIFIED</span>
                        </div>
                        <div className="flex h-3 w-full rounded-full overflow-hidden mb-4 bg-gray-200 dark:bg-white/10">
                            <div className="h-full bg-blue-500 transition-all duration-1000 delay-100" style={{ width: isExpanded ? `${(macros.protein / totalMacro) * 100}%` : '0%' }}></div>
                            <div className="h-full bg-green-500 transition-all duration-1000 delay-200" style={{ width: isExpanded ? `${(macros.carbs / totalMacro) * 100}%` : '0%' }}></div>
                            <div className="h-full bg-yellow-500 transition-all duration-1000 delay-300" style={{ width: isExpanded ? `${(macros.fat / totalMacro) * 100}%` : '0%' }}></div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <MacroDetail label="Protein" val={`${macros.protein}g`} color="text-blue-500" />
                            <MacroDetail label="Carbs" val={`${macros.carbs}g`} color="text-green-500" />
                            <MacroDetail label="Fat" val={`${macros.fat}g`} color="text-yellow-500" />
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Micro Nutrients (Est.)</p>
                        <div className="grid grid-cols-4 gap-2">
                            {micros.map((m, i) => (
                                <div key={i} className="flex flex-col items-center justify-center p-2 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm">
                                    <div className={`size-1.5 rounded-full ${m.color} mb-1`}></div>
                                    <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase">{m.label}</span>
                                    <span className="text-[10px] font-black text-gray-800 dark:text-white">{m.amount}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MacroDetail: React.FC<{ label: string; val: string; color: string }> = ({ label, val, color }) => (
    <div className="bg-white dark:bg-white/5 p-2 rounded-xl border border-gray-100 dark:border-white/5 text-center shadow-sm">
        <span className={`block text-[9px] font-bold uppercase mb-0.5 ${color}`}>{label}</span>
        <span className="text-sm font-black text-gray-800 dark:text-white">{val}</span>
    </div>
);

export default FoodHistory;
