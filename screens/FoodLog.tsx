
import React, { useState, useRef, useEffect } from 'react';
import { Screen, Character, FoodLogItem } from '../types';

interface FoodLogProps {
  onNavigate: (screen: Screen) => void;
  activeCharacter?: Character;
  onAddFood: (item: FoodLogItem) => void;
  onDeleteFood: (id: string) => void;
  onUpdateFood: (item: FoodLogItem) => void;
  foodLogs: FoodLogItem[];
  targetCalories: number;
  onToggleOverlay?: (isOpen: boolean) => void;
}

const FoodLog: React.FC<FoodLogProps> = ({ onNavigate, activeCharacter, onAddFood, onDeleteFood, onUpdateFood, foodLogs, targetCalories, onToggleOverlay }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [manualSearch, setManualSearch] = useState('');
  const [manualAmount, setManualAmount] = useState('1'); 
  const [selectedUnit, setSelectedUnit] = useState<'g' | 'qty'>('qty');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedData, setAnalyzedData] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    onToggleOverlay?.(!!analyzedData);
  }, [analyzedData, onToggleOverlay]);

  const totalCalories = foodLogs.reduce((sum, item) => sum + item.calories, 0);
  const percentage = Math.min((totalCalories / targetCalories) * 100, 100);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        // Food image analysis feature is disabled
        // To enable: Integrate with ChatGPT API for image analysis
        alert("Food image analysis is currently disabled. Please use manual entry or integrate ChatGPT API for this feature.");
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
    }
  };

  const confirmAnalysis = () => {
      if (analyzedData) {
          const newItem: FoodLogItem = {
              id: editingId || Date.now().toString(),
              name: analyzedData.name,
              calories: analyzedData.calories,
              icon: analyzedData.icon || '🍽️',
              timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              date: new Date().toISOString().split('T')[0],
              displayAmount: analyzedData.displayAmount,
              macros: analyzedData.macros
          };
          if (editingId) onUpdateFood(newItem); else onAddFood(newItem);
          setAnalyzedData(null);
          setUploadedImage(null);
          setManualSearch('');
          setEditingId(null);
      }
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden pb-24 bg-[#F8FAFC] dark:bg-dark-bg font-sans animate-fade-in transition-colors duration-300">
      
      {analyzedData && <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md" />}

      <div className="flex items-center px-6 pt-10 pb-4 justify-between sticky top-0 z-20 bg-transparent">
        <div className="size-10"></div>
        <h2 className="text-sm font-black text-light-text dark:text-white flex items-center gap-2 tracking-widest uppercase">
            <span className="material-symbols-outlined text-orange-500 text-xl font-bold">restaurant</span>
            Food Log
        </h2>
        <button 
          onClick={() => onNavigate(Screen.HOME)} 
          className="size-10 rounded-full bg-white/40 dark:bg-dark-surface flex items-center justify-center shadow-sm"
        >
          <span className="material-symbols-outlined text-gray-400">close</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 flex flex-col gap-6">
        
        <div className="bg-white dark:bg-[#1C1C1E] p-6 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 relative">
            <div className="flex justify-between items-center mb-1">
                <div>
                    <p className="text-[10px] font-black text-yellow-600 dark:text-[#FFD60A] uppercase tracking-widest">Daily Intake</p>
                    <h1 className="text-[52px] font-black text-gray-800 dark:text-white tracking-tighter leading-none">{totalCalories}</h1>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Of {targetCalories} kcal goal</p>
                </div>
                <div className="relative">
                    <div className="size-20 rounded-full bg-slate-100 dark:bg-[#2C2C2E] border-4 border-white dark:border-gray-800 shadow-md flex items-center justify-center overflow-hidden relative">
                        {uploadedImage ? (
                            <img src={uploadedImage} className="w-full h-full object-cover" alt="Meal" />
                        ) : (
                            <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-4xl">image</span>
                        )}
                        {isAnalyzing && (
                            <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex items-center justify-center">
                                <div className="size-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 size-7 rounded-full border-2 border-white dark:border-gray-800 bg-cover bg-top shadow-sm" style={{ backgroundImage: `url("${activeCharacter?.image}")` }}></div>
                </div>
            </div>
            <div className="mt-6 h-4 w-full bg-slate-50 dark:bg-black/40 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-[#FACC15] dark:bg-[#FFD60A] rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(255,214,10,0.3)]" style={{ width: `${percentage}%` }}></div>
            </div>
        </div>

        <div className="bg-indigo-600 text-white p-6 rounded-[2rem] flex flex-col gap-4 shadow-xl">
            <h3 className="text-xs font-black uppercase tracking-widest opacity-80">AI Visual Recognition</h3>
            <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
                className="w-full h-20 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center gap-3 border-2 border-white/20 transition-all active:scale-95"
            >
                {isAnalyzing ? (
                  <div className="size-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-4xl">photo_camera</span>
                    <span className="font-black uppercase tracking-widest">Snap & Log Evidence</span>
                  </>
                )}
            </button>
        </div>

        <div className="animate-fade-in pb-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500 mb-4 px-2">Today's Evidence Log</h3>
            <div className="flex flex-col gap-3">
                {foodLogs.length === 0 ? (
                    <div className="text-center py-10 opacity-30 italic text-sm text-light-text dark:text-white">Standby for fueling...</div>
                ) : (
                    foodLogs.map(item => (
                        <div key={item.id} className="flex items-center gap-4 p-4 rounded-3xl border bg-white dark:bg-[#1C1C1E] border-slate-100 dark:border-white/5 shadow-sm group">
                            <div className="size-14 rounded-2xl bg-slate-50 dark:bg-black/20 flex items-center justify-center text-3xl shrink-0">{item.icon}</div>
                            <div className="flex-1 min-w-0">
                                <p className="font-black truncate text-gray-900 dark:text-white text-sm uppercase tracking-tight">{item.name}</p>
                                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 dark:text-gray-500">{item.timestamp} • {item.displayAmount}</p>
                            </div>
                            <div className="text-right pr-2">
                                <span className="text-xl font-black text-[#FACC15] dark:text-[#FFD60A] leading-none">{item.calories}</span>
                                <span className="text-[8px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest block -mt-1">KCAL</span>
                            </div>
                            <button onClick={() => onDeleteFood(item.id)} className="size-8 rounded-full bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-300 flex items-center justify-center">
                                <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>

      <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

      {analyzedData && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-fade-in">
              <div className="bg-white dark:bg-[#1C1C1E] w-full max-h-[90vh] max-w-[340px] animate-modal-pop relative flex flex-col rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-white/5">
                  <div className="flex-1 overflow-y-auto px-6 py-8 no-scrollbar relative z-10 flex flex-col items-center">
                        <div className="size-32 rounded-[3rem] bg-slate-50 dark:bg-[#2C2C2E] flex items-center justify-center text-6xl shadow-inner mb-4 relative mt-4">
                             {uploadedImage ? <img src={uploadedImage} className="w-full h-full object-cover rounded-[3rem]" alt="Meal" /> : analyzedData.icon}
                        </div>

                        <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none text-center mb-1">{analyzedData.name}</h3>
                        <p className="text-[9px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-4">{analyzedData.zpdStatus}</p>
                        
                        <div className="flex items-center gap-2 mb-6">
                            <span className="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100 shadow-sm">{analyzedData.calories} KCAL</span>
                            <span className="bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-gray-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100 shadow-sm">{analyzedData.displayAmount}</span>
                        </div>

                        <div className="w-full space-y-4 mb-6">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20">
                                    <p className="text-[8px] font-black text-blue-400 uppercase mb-1">Power</p>
                                    <p className="text-base font-black text-blue-700 dark:text-blue-400">{analyzedData.macros.protein}g</p>
                                </div>
                                <div className="text-center p-3 rounded-2xl bg-green-50 dark:bg-green-900/20">
                                    <p className="text-[8px] font-black text-green-400 uppercase mb-1">Fuel</p>
                                    <p className="text-base font-black text-green-700 dark:text-green-400">{analyzedData.macros.carbs}g</p>
                                </div>
                                <div className="text-center p-3 rounded-2xl bg-yellow-50 dark:bg-yellow-900/20">
                                    <p className="text-[8px] font-black text-yellow-600 dark:text-yellow-400 uppercase mb-1">Fat</p>
                                    <p className="text-base font-black text-yellow-700 dark:text-yellow-400">{analyzedData.macros.fat}g</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#FFFBEB] dark:bg-[#172554] p-5 rounded-3xl border-2 border-dashed border-yellow-200 w-full relative">
                            <div className="absolute -top-3 -left-2 size-10 rounded-full border-2 border-white dark:border-gray-800 bg-cover bg-top shadow-md z-10" style={{ backgroundImage: `url("${activeCharacter?.image}")` }}></div>
                            <p className="text-[13px] font-bold text-gray-700 dark:text-white italic leading-relaxed text-center pl-2">
                                "{analyzedData.feedback}"
                            </p>
                        </div>
                  </div>
                  <div className="p-6 bg-slate-50/50 dark:bg-black/40 flex gap-3 border-t">
                        <button onClick={() => setAnalyzedData(null)} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400">Discard</button>
                        <button onClick={confirmAnalysis} className="flex-[2.5] py-4 bg-[#FACC15] text-black text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg">Commit Log</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default FoodLog;
