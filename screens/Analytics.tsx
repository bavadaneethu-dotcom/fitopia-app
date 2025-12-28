
import React, { useState, useEffect } from 'react';
import { FoodLogItem, ActivityLog, WaterLogItem, FastingLog, Screen, WeightLog } from '../types';

interface AnalyticsProps {
  foodLogs: FoodLogItem[];
  workoutLogs: ActivityLog[];
  meditationLogs: ActivityLog[];
  waterLogs: WaterLogItem[];
  fastingLogs: FastingLog[];
  weightLogs?: WeightLog[];
  onNavigate: (screen: Screen) => void;
  onUpdateWorkout: (log: ActivityLog) => void;
  onUpdateMeditation: (log: ActivityLog) => void;
  onDeleteWorkout: (id: string) => void;
  onDeleteMeditation: (id: string) => void;
  dailyCalorieLimit: number;
  onToggleOverlay?: (isOpen: boolean) => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ 
    foodLogs, workoutLogs, meditationLogs, waterLogs, fastingLogs, weightLogs = [],
    onNavigate, dailyCalorieLimit, onToggleOverlay
}) => {
  const [selectedFood, setSelectedFood] = useState<FoodLogItem | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<{log: ActivityLog, type: 'workout' | 'meditation'} | null>(null);
  const [selectedWeight, setSelectedWeight] = useState<WeightLog | null>(null);

  // Sync navigation visibility with App.tsx
  useEffect(() => {
    const isAnyModalOpen = !!selectedFood || !!selectedActivity || !!selectedWeight;
    onToggleOverlay?.(isAnyModalOpen);
  }, [selectedFood, selectedActivity, selectedWeight, onToggleOverlay]);

  const currentCalories = foodLogs.reduce((acc, item) => acc + item.calories, 0);
  const remainingCalories = Math.max(0, dailyCalorieLimit - currentCalories);
  const progressPercent = Math.min((currentCalories / dailyCalorieLimit) * 100, 100);

  const totalWater = waterLogs.reduce((acc, item) => acc + item.amount, 0);
  const waterTarget = 2500;

  const getMicros = (item: FoodLogItem) => {
    if (item.micros) return item.micros;
    return {
        vitA: '12%',
        vitC: '30%',
        calcium: '15%',
        iron: '8%',
        fiber: '5g',
        sodium: '140mg',
    };
  };

  const handleCloseDetail = () => {
    setSelectedFood(null);
    setSelectedActivity(null);
    setSelectedWeight(null);
  };

  return (
    <div className="flex flex-col gap-6 px-6 pt-6 animate-fade-in pb-12 relative overflow-x-hidden transition-all duration-500">
      
      {/* Dim Background for detail modals */}
      {(selectedFood || selectedActivity || selectedWeight) && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md animate-fade-in-blur cursor-pointer" 
          onClick={handleCloseDetail}
        />
      )}

      {/* Stats Page Header */}
      <div className="flex items-center justify-between px-2 mb-2">
          <div className="flex flex-col">
              <h2 className="text-2xl font-black text-gray-800 dark:text-white uppercase tracking-tighter italic">Stats Desk</h2>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Confidential Records</span>
          </div>
      </div>

      {/* Fuel Intake Header Card */}
      <div className="bg-[#fdfbf7] dark:bg-dark-surface rounded-[2.5rem] p-8 shadow-sm border-2 border-dashed border-gray-200 dark:border-white/10 font-sans relative overflow-hidden transition-all duration-500">
        <div className="flex items-center justify-between mb-8 relative z-10">
             <div>
                 <h3 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tighter italic">Fuel Intake</h3>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Daily Case Target: {dailyCalorieLimit} kcal</p>
             </div>
             <div className="bg-[#1e293b] text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] shadow-lg">Verified</div>
        </div>

        <div className="flex items-baseline gap-2 mb-6 relative z-10">
            <span className="text-7xl font-black text-[#422006] dark:text-white tracking-tighter leading-none">{currentCalories}</span>
            <span className="text-sm font-black text-gray-400 uppercase tracking-widest">KCAL</span>
        </div>

        <div className="relative h-6 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-8 z-10 shadow-inner">
            <div className="absolute top-0 left-0 h-full bg-yellow-400 transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}>
                <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="bg-white dark:bg-white/5 p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-1">Total Consumed</span>
                <span className="text-3xl font-black text-[#422006] dark:text-white">{currentCalories}</span>
            </div>
            <div className="bg-white dark:bg-white/5 p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-1">Fuel Remaining</span>
                <span className="text-3xl font-black text-[#422006] dark:text-white">{remainingCalories}</span>
            </div>
        </div>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-[2rem] border border-blue-100 dark:border-blue-900/30 flex flex-col gap-1 relative overflow-hidden">
              <span className="text-[9px] font-black text-blue-400 dark:text-blue-500 uppercase tracking-widest z-10">Hydration</span>
              <div className="flex items-baseline gap-1 z-10">
                  <span className="text-3xl font-black text-blue-600 dark:text-blue-300">{totalWater}</span>
                  <span className="text-[10px] font-bold text-blue-400">ml</span>
              </div>
              <div className="w-full bg-blue-200 dark:bg-blue-900/50 h-1.5 rounded-full mt-2 overflow-hidden z-10">
                  <div className="h-full bg-blue-500" style={{ width: `${Math.min((totalWater/waterTarget)*100, 100)}%` }}></div>
              </div>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/10 p-5 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/30 flex flex-col gap-1 relative overflow-hidden">
              <span className="text-[9px] font-black text-indigo-400 dark:text-indigo-500 uppercase tracking-widest z-10">Patrols</span>
              <div className="flex items-baseline gap-1 z-10">
                  <span className="text-3xl font-black text-indigo-600 dark:text-indigo-300">{fastingLogs.length}</span>
                  <span className="text-[10px] font-bold text-indigo-400">shifts</span>
              </div>
              <div className="flex gap-1 mt-2 z-10">
                  {fastingLogs.slice(0, 5).map((_, i) => <div key={i} className="size-1.5 rounded-full bg-indigo-500"></div>)}
                  {fastingLogs.length === 0 && <span className="text-[9px] font-bold text-indigo-300 uppercase italic">Standby...</span>}
              </div>
          </div>
      </div>

      {/* Main Evidence Sections */}
      <div className="space-y-8 mt-4">
          <section>
              <div className="flex items-center gap-2 px-2 mb-3">
                   <div className="size-2.5 rounded-full bg-orange-400"></div>
                   <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Fuel Files (Food)</h3>
              </div>
              <div className="flex flex-col gap-3">
                  {foodLogs.length === 0 ? <EmptyState label="No fuel files recorded" icon="no_meals" /> : foodLogs.map((item) => (
                      <LogItem key={item.id} icon={item.icon} title={item.name} subtitle={`${item.timestamp} • ${item.displayAmount}`} value={item.calories} unit="kcal" onClick={() => setSelectedFood(item)} />
                  ))}
              </div>
          </section>

          <section>
              <div className="flex items-center gap-2 px-2 mb-3">
                   <div className="size-2.5 rounded-full bg-blue-600"></div>
                   <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Medical Bay (Weight)</h3>
              </div>
              <div className="flex flex-col gap-3">
                  {weightLogs.length === 0 ? (
                      <EmptyState label="No mass records found" icon="monitor_weight" />
                  ) : (
                      weightLogs.map((log) => (
                          <LogItem 
                            key={log.id} 
                            icon="monitor_weight" 
                            title="Mass Entry" 
                            subtitle={`${new Date(log.date).toLocaleDateString()} • Log`} 
                            value={parseFloat(log.value)} 
                            unit={log.unit} 
                            onClick={() => setSelectedWeight(log)} 
                            color="text-blue-600 dark:text-blue-400" 
                          />
                      ))
                  )}
              </div>
          </section>

          <section>
              <div className="flex items-center gap-2 px-2 mb-3">
                   <div className="size-2.5 rounded-full bg-teal-400"></div>
                   <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Mindfulness Oasis</h3>
              </div>
              <div className="flex flex-col gap-3">
                  {meditationLogs.length === 0 ? <EmptyState label="No oasis sessions" icon="self_improvement" /> : meditationLogs.map((log) => (
                      <LogItem 
                        key={log.id} 
                        icon={log.icon} 
                        title={log.title} 
                        subtitle={`${log.timestamp} • Session`} 
                        value={parseInt(log.duration.split(':')[0])} 
                        unit="min" 
                        onClick={() => setSelectedActivity({log, type: 'meditation'})} 
                        color="text-teal-600 dark:text-teal-400" 
                      />
                  ))}
              </div>
          </section>

          <section>
              <div className="flex items-center gap-2 px-2 mb-3">
                   <div className="size-2.5 rounded-full bg-red-400"></div>
                   <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Academy Training</h3>
              </div>
              <div className="flex flex-col gap-3">
                  {workoutLogs.length === 0 ? <EmptyState label="No academy training" icon="fitness_center" /> : workoutLogs.map((log) => (
                      <LogItem 
                        key={log.id} 
                        icon={log.icon} 
                        title={log.title} 
                        subtitle={`${log.timestamp} • Drill`} 
                        value={log.calories || parseInt(log.duration.split(':')[0]) * 5} 
                        unit="kcal" 
                        onClick={() => setSelectedActivity({log, type: 'workout'})} 
                        color="text-red-600 dark:text-red-400" 
                      />
                  ))}
              </div>
          </section>
      </div>

      {/* Detailed Modals */}
      {(selectedFood || selectedActivity || selectedWeight) && (
        <DetailModalPremium 
            title={selectedFood?.name || selectedActivity?.log.title || 'Body Mass Record'}
            icon={selectedFood?.icon || selectedActivity?.log.icon || 'monitor_weight'}
            kcal={selectedFood?.calories || selectedActivity?.log.calories || parseFloat(selectedWeight?.value || '0')}
            mass={selectedFood?.displayAmount || selectedActivity?.log.duration || selectedWeight?.unit || '0'}
            isActivity={!!selectedActivity}
            isWeight={!!selectedWeight}
            macros={selectedFood ? selectedFood.macros : selectedWeight ? { protein: 0, carbs: 0, fat: 0 } : {
                protein: selectedActivity?.type === 'workout' ? 15 : 5, 
                carbs: selectedActivity?.type === 'workout' ? 10 : 25, 
                fat: selectedActivity?.type === 'workout' ? 5 : 2
            }}
            micros={selectedFood ? getMicros(selectedFood) : selectedWeight ? {
                waist: selectedWeight.dimensions.waist + selectedWeight.dimensions.unit,
                chest: selectedWeight.dimensions.chest + selectedWeight.dimensions.unit,
                arms: selectedWeight.dimensions.arms + selectedWeight.dimensions.unit,
                thighs: selectedWeight.dimensions.thighs + selectedWeight.dimensions.unit
            } : {
                intensity: selectedActivity?.type === 'workout' ? 'High' : 'Low',
                focus: selectedActivity?.type === 'workout' ? '80%' : '95%',
                discipline: '100%',
                rank: 'Officer'
            }}
            onClose={handleCloseDetail}
        />
      )}

      <style>{`
          @keyframes fade-in-blur {
              from { opacity: 0; backdrop-filter: blur(0px); }
              to { opacity: 1; backdrop-filter: blur(8px); }
          }
          .animate-fade-in-blur {
              animation: fade-in-blur 0.4s ease-out forwards;
          }
          @keyframes smooth-pop {
              0% { transform: scale(0.92) translateY(20px); opacity: 0; }
              100% { transform: scale(1) translateY(0); opacity: 1; }
          }
          .animate-smooth-pop {
              animation: smooth-pop 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          @keyframes smooth-stagger {
              from { transform: translateY(10px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
          }
          .stagger-in {
              animation: smooth-stagger 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              opacity: 0;
          }
      `}</style>
    </div>
  );
};

const DetailModalPremium: React.FC<{ 
    title: string; 
    icon: string; 
    kcal: number; 
    mass: string; 
    macros: any; 
    micros: any; 
    onClose: () => void;
    isActivity?: boolean;
    isWeight?: boolean;
}> = ({ title, icon, kcal, mass, macros, micros, onClose, isActivity, isWeight }) => (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 pointer-events-none">
        <div className="bg-white dark:bg-[#1a1a1a] w-full max-h-[85vh] max-w-[340px] animate-smooth-pop relative flex flex-col rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-white/5 pointer-events-auto" onClick={e => e.stopPropagation()}>
            
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/notebook.png")' }}></div>

            <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-center pt-8 pb-4 bg-white/40 dark:bg-black/40 backdrop-blur-md border-b border-white/10 stagger-in" style={{ animationDelay: '0.1s' }}>
                <div className="bg-[#FEF08A] px-4 py-1.5 rounded-xl border border-yellow-300 shadow-sm flex items-center gap-1.5 transform -rotate-1">
                    <div className="text-center">
                        <p className="text-[7px] font-black uppercase text-yellow-700 tracking-tighter">IDENTIFIED</p>
                        <p className="text-xs font-black text-gray-900 uppercase leading-none">VERIFIED</p>
                    </div>
                    <span className="material-symbols-outlined text-yellow-700 text-lg font-bold">verified_user</span>
                </div>
                <button 
                    onClick={onClose} 
                    className="absolute right-6 top-8 size-10 rounded-full bg-white/80 dark:bg-white/10 flex items-center justify-center transition-transform active:scale-90 shadow-sm"
                >
                    <span className="material-symbols-outlined font-black text-xl text-gray-400">close</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pt-24 pb-12 no-scrollbar relative z-10">
                <div className="flex flex-col items-center mt-2">
                    <div className="size-36 rounded-[2.8rem] bg-gradient-to-br from-gray-200 to-white dark:from-white/10 dark:to-white/5 flex items-center justify-center text-7xl shadow-[0_15px_30px_rgba(0,0,0,0.1)] mb-6 overflow-hidden relative border border-white/50 stagger-in" style={{ animationDelay: '0.15s' }}>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.8),transparent)] pointer-events-none"></div>
                        {isWeight ? <span className="material-symbols-outlined text-6xl text-blue-500">monitor_weight</span> : <span className="relative z-10 drop-shadow-lg">{icon}</span>}
                    </div>

                    <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-3 text-center stagger-in" style={{ animationDelay: '0.2s' }}>{title}</h3>
                    
                    <div className="flex items-center gap-2 mb-8 stagger-in" style={{ animationDelay: '0.25s' }}>
                        <span className="bg-white dark:bg-white/5 text-orange-600 dark:text-orange-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-50 dark:border-white/10 shadow-sm">{kcal} {isActivity ? 'XP' : isWeight ? mass : 'KCAL'}</span>
                        {!isWeight && <span className="bg-white dark:bg-white/5 text-gray-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100 dark:border-white/10 shadow-sm">{mass.toUpperCase()}</span>}
                    </div>

                    {!isWeight && (
                    <div className="w-full space-y-3 mb-8 stagger-in" style={{ animationDelay: '0.3s' }}>
                        <div className="flex items-center gap-3"><h4 className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">Composition</h4><div className="h-px bg-gray-200 dark:bg-white/10 flex-1"></div></div>
                        <div className="grid grid-cols-3 gap-3">
                            <MacroCardMini label={isActivity ? "Power" : "Protein"} val={`${macros.protein}${isActivity ? 'p' : 'g'}`} dotColor="bg-blue-600" textColor="text-blue-600" />
                            <MacroCardMini label={isActivity ? "Focus" : "Carbs"} val={`${macros.carbs}${isActivity ? 'p' : 'g'}`} dotColor="bg-green-600" textColor="text-green-600" />
                            <MacroCardMini label={isActivity ? "Calm" : "Fat"} val={`${macros.fat}${isActivity ? 'p' : 'g'}`} dotColor="bg-yellow-600" textColor="text-yellow-600" />
                        </div>
                    </div>
                    )}

                    <div className="w-full space-y-3 stagger-in" style={{ animationDelay: '0.35s' }}>
                        <div className="flex items-center gap-3"><h4 className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">{isActivity ? 'Performance' : isWeight ? 'Biometrics' : 'Nutrients'}</h4><div className="h-px bg-gray-200 dark:bg-white/10 flex-1"></div></div>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.entries(micros).slice(0, 4).map(([key, value], i) => (
                                <div key={key} className="bg-white dark:bg-white/5 p-3 px-4 rounded-xl flex justify-between items-center border border-gray-50 dark:border-white/10 shadow-sm transition-all hover:border-gray-200">
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                                        {key.replace('vit', 'Vit ').replace('sodium', 'Sod').replace('fiber', 'Fib')}
                                    </span>
                                    <span className="text-xs font-black text-gray-800 dark:text-white capitalize">{value as string}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const MacroCardMini: React.FC<{ label: string; val: string; dotColor: string; textColor: string }> = ({ label, val, dotColor, textColor }) => (
    <div className="flex flex-col items-center gap-1.5 p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm transition-transform hover:scale-105">
        <div className={`size-2 rounded-full ${dotColor} shadow-[0_0_8px_currentColor]`}></div>
        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
        <span className={`text-[15px] font-black ${textColor} dark:text-white`}>{val}</span>
    </div>
);

const LogItem: React.FC<{ icon: string; title: string; subtitle: string; value: number; unit: string; onClick: () => void; color?: string }> = ({ icon, title, subtitle, value, unit, onClick, color = "text-[#D97706] dark:text-yellow-400" }) => (
    <button onClick={onClick} className="group flex items-center gap-4 p-5 bg-white dark:bg-dark-surface rounded-[1.8rem] border border-gray-100 dark:border-white/5 shadow-sm active:scale-[0.98] transition-all hover:border-yellow-400 text-left hover:shadow-md">
        <div className="size-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
            {icon === "monitor_weight" ? <span className="material-symbols-outlined text-blue-500">monitor_weight</span> : icon}
        </div>
        <div className="flex-1 min-w-0">
            <h4 className="text-base font-black text-gray-800 dark:text-white uppercase tracking-tight truncate">{title}</h4>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">{subtitle}</p>
        </div>
        <div className="text-right shrink-0">
            <span className={`text-xl font-black ${color}`}>{value}</span>
            <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest -mt-1">{unit}</span>
        </div>
    </button>
);

const EmptyState: React.FC<{ label: string; icon: string }> = ({ label, icon }) => (
    <div className="bg-white/40 dark:bg-dark-surface/40 backdrop-blur-md rounded-[2rem] p-8 border-2 border-dashed border-gray-200 dark:border-white/5 text-center opacity-50">
        <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">{icon}</span>
        <p className="text-[10px] font-black uppercase tracking-widest">{label}</p>
    </div>
);

export default Analytics;
