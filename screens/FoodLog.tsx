
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

type FoodCategory = 'sweet' | 'junk' | 'healthy' | 'protein' | 'veggie' | 'fruit' | 'carb';

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  icon: string;
  category: FoodCategory;
  bgColor: string;
  borderColor: string;
  unit: 'g' | 'qty';
  amount: number;
}

const foodItems: FoodItem[] = [
  { id: '1', name: 'Pawpsicle', calories: 120, icon: '🐾', category: 'sweet', bgColor: 'bg-[#FFF1F2]', borderColor: 'border-red-100', unit: 'qty', amount: 2 },
  { id: '2', name: 'Idli', calories: 104, icon: '⚪', category: 'healthy', bgColor: 'bg-[#F8FAFC]', borderColor: 'border-slate-100', unit: 'qty', amount: 2 },
  { id: '3', name: 'Sambar', calories: 150, icon: '🥘', category: 'veggie', bgColor: 'bg-[#FFFBEB]', borderColor: 'border-orange-100', unit: 'g', amount: 250 },
];

interface DBItem {
  calPer100g: number;
  icon: string;
  macrosPer100g: {p: number, c: number, f: number};
  missing: string[];
  category: FoodCategory;
  unit: 'g' | 'qty';
  standardWeight?: number; 
}

const MOCK_FOOD_DATABASE: Record<string, DBItem> = {
    'pawpsicle': { calPer100g: 120, icon: '🐾', macrosPer100g: {p: 0, c: 30, f: 0}, missing: ['Protein', 'Fiber', 'Fats'], category: 'sweet', unit: 'qty', standardWeight: 60 },
    'dosa': { calPer100g: 168, icon: '🥞', macrosPer100g: {p: 3.9, c: 29, f: 3.7}, missing: ['Protein', 'Fiber'], category: 'carb', unit: 'qty', standardWeight: 80 },
    'idli': { calPer100g: 52, icon: '⚪', macrosPer100g: {p: 2.4, c: 10, f: 0.1}, missing: ['Healthy Fats'], category: 'healthy', unit: 'qty', standardWeight: 40 },
    'donut': { calPer100g: 452, icon: '🍩', macrosPer100g: {p: 4.9, c: 51, f: 25}, missing: ['Everything'], category: 'junk', unit: 'qty', standardWeight: 60 },
    'sambar': { calPer100g: 60, icon: '🥘', macrosPer100g: {p: 3, c: 9, f: 1.5}, missing: [], category: 'healthy', unit: 'g' },
    'shrimp': { calPer100g: 150, icon: '🍤', macrosPer100g: {p: 24, c: 0.2, f: 0.3}, missing: [], category: 'protein', unit: 'g' },
};

const getContextQuote = (charId: string, category: FoodCategory, foodName: string) => {
    const quotes: Record<string, string> = {
        judy: "Hustle! That's standard ZPD fuel!",
        nick: "It's called a hustle, sweetheart. Analysis complete.",
        bogo: "Dismissed! Maintain your focus!",
    };
    return quotes[charId] || quotes['judy'];
};

const FoodLog: React.FC<FoodLogProps> = ({ onNavigate, activeCharacter, onAddFood, onDeleteFood, onUpdateFood, foodLogs, targetCalories, onToggleOverlay }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastAdded, setLastAdded] = useState<{amount: number, icon: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [manualSearch, setManualSearch] = useState('');
  const [manualAmount, setManualAmount] = useState('2'); 
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setUploadedImage(reader.result as string);
            analyzeManualEntry(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const analyzeManualEntry = (imgData?: string) => {
      setIsAnalyzing(true);
      setTimeout(() => {
          setIsAnalyzing(false);
          const searchTermLower = manualSearch.toLowerCase().trim();
          const amountValue = Math.max(0, parseFloat(manualAmount) || (selectedUnit === 'qty' ? 1 : 100));
          
          let result: any = { name: manualSearch || 'Item', calories: 0, weight: 0, displayAmount: '', icon: '🍽️', macros: { protein: 0, carbs: 0, fat: 0 }, category: 'healthy' as FoodCategory, feedback: '' };
          const matchedKey = Object.keys(MOCK_FOOD_DATABASE).find(key => searchTermLower.includes(key));
          
          if (matchedKey) {
             const data = MOCK_FOOD_DATABASE[matchedKey];
             result.name = (manualSearch || matchedKey).toUpperCase();
             result.icon = data.icon;
             result.category = data.category;
             if (selectedUnit === 'qty') {
                 result.weight = amountValue * (data.standardWeight || 50);
                 result.calories = Math.round((result.weight / 100) * data.calPer100g);
                 result.displayAmount = `${amountValue} PCS`;
             } else {
                 result.weight = amountValue;
                 result.displayAmount = `${amountValue}G`;
                 result.calories = Math.round((amountValue / 100) * data.calPer100g);
             }
             const ratio = result.weight / 100;
             result.macros = { protein: parseFloat((data.macrosPer100g.p * ratio).toFixed(1)), carbs: parseFloat((data.macrosPer100g.c * ratio).toFixed(1)), fat: parseFloat((data.macrosPer100g.f * ratio).toFixed(1)) };
          } else {
             result.name = manualSearch.toUpperCase() || 'EVIDENCE ITEM';
             result.weight = selectedUnit === 'qty' ? amountValue * 100 : amountValue; 
             result.displayAmount = selectedUnit === 'qty' ? `${amountValue} PCS` : `${amountValue}G`;
             result.calories = Math.round(result.weight * 1.5); 
             result.macros = { protein: Math.round(result.weight * 0.1), carbs: Math.round(result.weight * 0.2), fat: Math.round(result.weight * 0.05) };
             result.category = 'junk';
          }
          result.feedback = getContextQuote(activeCharacter?.id || 'judy', result.category, result.name);
          setAnalyzedData(result);
      }, 1500);
  };

  const confirmAnalysis = () => {
      if (analyzedData) {
          const newItem: FoodLogItem = {
              id: editingId || Date.now().toString(),
              name: analyzedData.name,
              calories: analyzedData.calories,
              icon: analyzedData.icon,
              timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              date: new Date().toISOString().split('T')[0],
              displayAmount: analyzedData.displayAmount,
              macros: analyzedData.macros
          };
          if (editingId) onUpdateFood(newItem); else onAddFood(newItem);
          setAnalyzedData(null);
          setUploadedImage(null);
          setManualSearch('');
          setManualAmount('1');
          setEditingId(null);
      }
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden pb-24 bg-[#F8FAFC] dark:bg-dark-bg font-sans animate-fade-in transition-colors duration-300">
      
      {/* Background Overlay for Modal */}
      {analyzedData && <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md" />}

      {/* Title Bar */}
      <div className="flex items-center px-6 pt-10 pb-4 justify-between sticky top-0 z-20 bg-transparent">
        <div className="size-10"></div>
        <h2 className="text-sm font-black text-light-text dark:text-white flex items-center gap-2 tracking-widest uppercase">
            <span className="material-symbols-outlined text-orange-500 text-xl font-bold">restaurant</span>
            Fuel Station
        </h2>
        <button 
          onClick={() => onNavigate(Screen.HOME)} 
          className="size-10 rounded-full bg-white/40 dark:bg-white/10 flex items-center justify-center shadow-sm"
        >
          <span className="material-symbols-outlined text-gray-400">close</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 flex flex-col gap-6">
        
        {/* Daily Intake Card */}
        <div className="bg-white dark:bg-dark-surface p-6 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 relative">
            <div className="flex justify-between items-center mb-1">
                <div>
                    <p className="text-[10px] font-black text-yellow-600 dark:text-yellow-400 uppercase tracking-widest">Daily Intake</p>
                    <h1 className="text-[52px] font-black text-gray-800 dark:text-white tracking-tighter leading-none">{totalCalories}</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Of {targetCalories} kcal goal</p>
                </div>
                <div className="relative">
                    <div className="size-20 rounded-full bg-slate-100 dark:bg-white/10 border-4 border-white dark:border-gray-800 shadow-md flex items-center justify-center overflow-hidden relative">
                        {uploadedImage ? (
                            <img src={uploadedImage} className="w-full h-full object-cover" alt="Meal" />
                        ) : (
                            <span className="material-symbols-outlined text-gray-300 text-4xl">image</span>
                        )}
                        {isAnalyzing && (
                            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                <div className="size-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 size-7 rounded-full border-2 border-white bg-cover bg-top shadow-sm" style={{ backgroundImage: `url("${activeCharacter?.image}")` }}></div>
                </div>
            </div>
            {/* Progress Bar */}
            <div className="mt-6 h-4 w-full bg-slate-50 dark:bg-gray-800/50 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-[#FACC15] rounded-full transition-all duration-700" style={{ width: `${percentage}%` }}></div>
            </div>
        </div>

        {/* Input Section - Grey Rounded Container */}
        <div className="bg-[#E2E8F0]/40 dark:bg-white/5 p-6 rounded-[2.5rem] border border-slate-100 dark:border-white/5 flex flex-col gap-4 shadow-sm">
            {/* Food Name Input */}
            <div className="relative bg-white dark:bg-black/20 rounded-2xl h-16 flex items-center px-4 shadow-sm">
                <span className="material-symbols-outlined text-slate-300 mr-2">search</span>
                <input 
                    value={manualSearch} 
                    onChange={e => setManualSearch(e.target.value)}
                    placeholder="Idli"
                    className="flex-1 bg-transparent outline-none text-xl font-black text-[#422006] dark:text-white placeholder:text-slate-300"
                />
                <button onClick={() => fileInputRef.current?.click()}>
                    <span className="material-symbols-outlined text-slate-400">photo_camera</span>
                </button>
            </div>

            {/* Amount and Unit Row */}
            <div className="flex gap-3">
                {/* Unit Selector */}
                <div className="flex bg-[#F1F5F9] dark:bg-black/40 rounded-2xl p-1 items-center h-16 w-28 shadow-inner">
                    <button 
                        onClick={() => setSelectedUnit('qty')}
                        className={`flex-1 h-full rounded-xl transition-all flex items-center justify-center ${selectedUnit === 'qty' ? 'bg-white dark:bg-gray-700 shadow-sm text-black' : 'text-slate-400'}`}
                    >
                        <span className="font-black text-xl leading-none">#</span>
                    </button>
                    <button 
                        onClick={() => setSelectedUnit('g')}
                        className={`flex-1 h-full rounded-xl transition-all flex items-center justify-center ${selectedUnit === 'g' ? 'bg-white dark:bg-gray-700 shadow-sm text-black' : 'text-slate-400'}`}
                    >
                         <span className="font-black text-xl leading-none italic transform -skew-x-6">g</span>
                    </button>
                </div>
                {/* Numeric Input */}
                <div className="flex-1 bg-white dark:bg-black/20 rounded-2xl h-16 flex items-center shadow-sm">
                    <input 
                        type="number"
                        value={manualAmount}
                        onChange={e => setManualAmount(e.target.value)}
                        className="w-full text-center text-3xl font-black text-[#422006] dark:text-white bg-transparent outline-none"
                    />
                </div>
            </div>

            {/* Analyze Button */}
            <button 
                onClick={() => analyzeManualEntry()}
                disabled={!manualSearch || isAnalyzing}
                className="w-full h-16 bg-[#FACC15] dark:bg-yellow-500 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-yellow-400/20 active:scale-[0.98] transition-all disabled:opacity-50"
            >
                {isAnalyzing ? (
                    <div className="size-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <>
                        <span className="material-symbols-outlined font-bold">bar_chart</span>
                        <span className="font-black uppercase tracking-widest text-sm">Analyze Platter</span>
                    </>
                )}
            </button>

            {/* Quick Selector Icons */}
            <div className="flex justify-between pt-2 px-1">
                {foodItems.map(item => (
                    <button 
                        key={item.id} 
                        onClick={() => { setManualSearch(item.name); setManualAmount(item.amount.toString()); setSelectedUnit(item.unit); }}
                        className="flex flex-col items-center gap-2 group"
                    >
                        <div className={`size-16 rounded-2xl ${item.bgColor} border border-transparent hover:border-slate-200 transition-all flex items-center justify-center text-2xl shadow-sm`}>
                            {item.icon}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 group-hover:text-slate-600 uppercase tracking-wider">{item.name}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Today's Menu List */}
        <div className="animate-fade-in pb-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Today's Menu</h3>
            <div className="flex flex-col gap-3">
                {foodLogs.length === 0 ? (
                    <div className="text-center py-10 opacity-30 italic text-sm">Evidence files pending...</div>
                ) : (
                    foodLogs.map(item => (
                        <div key={item.id} className="flex items-center gap-4 p-4 bg-white dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm group active:scale-[0.99] transition-all">
                            <div className="size-14 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-3xl shadow-inner shrink-0 group-hover:scale-105 transition-transform">{item.icon}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                    <span className="text-[9px] font-black text-slate-300 dark:text-slate-500 uppercase tracking-widest">Item:</span>
                                    <p className="font-black truncate text-gray-900 dark:text-white text-sm uppercase tracking-tight">{item.name}</p>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">{item.timestamp} • {item.displayAmount}</p>
                            </div>
                            <div className="text-right pr-2">
                                <span className="text-xl font-black text-[#FACC15] dark:text-yellow-400 leading-none">{item.calories}</span>
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block -mt-1">KCAL</span>
                            </div>
                            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => onDeleteFood(item.id)} className="text-slate-300 hover:text-red-500"><span className="material-symbols-outlined text-lg">delete</span></button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

      {/* Analysis Result Modal (Premium) */}
      {analyzedData && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-fade-in">
              <div className="bg-white dark:bg-[#1a1a1a] w-full max-h-[80vh] max-w-[340px] animate-modal-pop relative flex flex-col rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-white/5">
                  <div className="flex-1 overflow-y-auto px-6 py-10 no-scrollbar relative z-10 flex flex-col items-center">
                        <div className="size-36 rounded-[3rem] bg-slate-50 dark:bg-white/5 flex items-center justify-center text-7xl shadow-inner mb-6 relative">
                             {uploadedImage ? <img src={uploadedImage} className="w-full h-full object-cover rounded-[3rem]" /> : analyzedData.icon}
                             <div className="absolute -bottom-2 bg-green-500 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border-2 border-white">Verified</div>
                        </div>
                        <h3 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none text-center mb-2">{analyzedData.name}</h3>
                        <div className="flex items-center gap-2 mb-8">
                            <span className="bg-orange-50 dark:bg-orange-900/30 text-orange-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100 shadow-sm">{analyzedData.calories} KCAL</span>
                            <span className="bg-slate-50 dark:bg-white/5 text-slate-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100 shadow-sm">{analyzedData.displayAmount}</span>
                        </div>
                        <div className="w-full space-y-4 mb-6">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100">
                                    <p className="text-[8px] font-black text-blue-400 uppercase mb-1">Protein</p>
                                    <p className="text-base font-black text-blue-700 dark:text-blue-300">{analyzedData.macros.protein}g</p>
                                </div>
                                <div className="text-center p-3 rounded-2xl bg-green-50 dark:bg-green-900/10 border border-green-100">
                                    <p className="text-[8px] font-black text-green-400 uppercase mb-1">Carbs</p>
                                    <p className="text-base font-black text-green-700 dark:text-green-300">{analyzedData.macros.carbs}g</p>
                                </div>
                                <div className="text-center p-3 rounded-2xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100">
                                    <p className="text-[8px] font-black text-yellow-600 uppercase mb-1">Fat</p>
                                    <p className="text-base font-black text-yellow-700 dark:text-yellow-300">{analyzedData.macros.fat}g</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#FFFBEB] dark:bg-yellow-900/20 p-5 rounded-3xl border-2 border-dashed border-yellow-200 dark:border-yellow-900/50 w-full">
                            <p className="text-xs font-bold text-gray-600 dark:text-yellow-200/60 italic leading-relaxed text-center">"{analyzedData.feedback}"</p>
                        </div>
                  </div>
                  <div className="p-6 bg-slate-50/50 dark:bg-black/20 flex gap-3">
                        <button onClick={() => setAnalyzedData(null)} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400">Discard</button>
                        <button onClick={confirmAnalysis} className="flex-[2.5] py-4 bg-[#FACC15] text-black text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg">Commit Log</button>
                  </div>
              </div>
          </div>
      )}

      <style>{`
          @keyframes modal-pop { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
          .animate-modal-pop { animation: modal-pop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default FoodLog;
