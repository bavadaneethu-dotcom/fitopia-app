
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
}

type FoodCategory = 'sweet' | 'junk' | 'healthy' | 'protein' | 'veggie' | 'fruit' | 'carb';

const MOCK_DATABASE: Record<string, any> = {
    'pawpsicle': { cal: 120, icon: '🐾', cat: 'sweet', p: 0, c: 30, f: 0, quote: "Nick's special recipe... purely for the hustle!" },
    'carrot': { cal: 41, icon: '🥕', cat: 'veggie', p: 0.9, c: 10, f: 0.2, quote: "Peak Hopps family agility fuel!" },
    'donut': { cal: 452, icon: '🍩', cat: 'junk', p: 4.9, c: 51, f: 25, quote: "Clawhauser's influence is spreading. Give me 20!" },
    'coffee': { cal: 2, icon: '☕', cat: 'healthy', p: 0.1, c: 0, f: 0, quote: "Standard ZPD night-shift fuel." },
};

const FoodLog: React.FC<FoodLogProps> = ({ onNavigate, activeCharacter, onAddFood, onDeleteFood, onUpdateFood, foodLogs, targetCalories }) => {
  const [manualSearch, setManualSearch] = useState('');
  const [manualAmount, setManualAmount] = useState('1'); 
  const [selectedUnit, setSelectedUnit] = useState<'g' | 'qty'>('qty');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalCalories = foodLogs.reduce((sum, item) => sum + item.calories, 0);
  const percentage = Math.min((totalCalories / targetCalories) * 100, 100);

  const handleEditItem = (item: FoodLogItem) => {
    setEditingId(item.id);
    setManualSearch(item.name);
    if (item.displayAmount) {
        const match = item.displayAmount.match(/(\d+)\s*(PCS|G)/i);
        if (match) {
            setManualAmount(match[1]);
            setSelectedUnit(match[2].toUpperCase() === 'PCS' ? 'qty' : 'g');
        }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProcessEntry = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      const searchTermLower = manualSearch.toLowerCase().trim();
      const amountValue = parseFloat(manualAmount) || 1;
      
      let result: any = { name: manualSearch.toUpperCase() || 'EVIDENCE ITEM', calories: 0, icon: '🍽️', macros: { protein: 0, carbs: 0, fat: 0 } };
      const matched = MOCK_DATABASE[searchTermLower];

      if (matched) {
          result.icon = matched.icon;
          result.calories = Math.round(selectedUnit === 'qty' ? matched.cal * amountValue : (amountValue / 100) * matched.cal);
          result.macros = { protein: matched.p * amountValue, carbs: matched.c * amountValue, fat: matched.f * amountValue };
      } else {
          result.calories = Math.round(amountValue * (selectedUnit === 'qty' ? 150 : 1.5));
          result.macros = { protein: amountValue * 0.1, carbs: amountValue * 0.2, fat: amountValue * 0.05 };
      }

      const newItem: FoodLogItem = {
          id: editingId || Date.now().toString(),
          name: result.name,
          calories: result.calories,
          icon: result.icon,
          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          date: new Date().toISOString().split('T')[0],
          displayAmount: `${amountValue} ${selectedUnit === 'qty' ? 'PCS' : 'G'}`,
          macros: result.macros
      };

      if (editingId) onUpdateFood(newItem); else onAddFood(newItem);
      
      setManualSearch('');
      setManualAmount('1');
      setEditingId(null);
      setUploadedImage(null);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-[#F1F5F9] dark:bg-dark-bg font-sans transition-colors duration-300">
      
      <header className="flex items-center px-6 pt-12 pb-4 justify-between sticky top-0 z-30 bg-[#F1F5F9]/90 dark:bg-dark-bg/90 backdrop-blur-md">
        <div className="flex flex-col">
            <h2 className="text-2xl font-black text-zpd-navy dark:text-white uppercase tracking-tighter italic transform -skew-x-12">Fuel Station</h2>
            <p className="text-[10px] font-black text-zpd-muted uppercase tracking-[0.3em]">Evidence Log</p>
        </div>
        <button onClick={() => onNavigate(Screen.HOME)} className="size-11 rounded-full bg-white dark:bg-dark-surface shadow-md flex items-center justify-center active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-zpd-navy dark:text-white">close</span>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 flex flex-col gap-6 pb-32">
        
        {/* Vital Stats Card */}
        <div className="bg-white dark:bg-dark-surface p-6 rounded-[2.5rem] shadow-xl border border-white dark:border-white/5 relative overflow-hidden">
            <div className="flex justify-between items-end mb-4 relative z-10">
                <div>
                    <span className="text-[10px] font-black text-zpd-muted uppercase tracking-widest">Logged Intake</span>
                    <div className="flex items-baseline gap-2">
                        <h1 className="text-6xl font-black text-zpd-navy dark:text-white tracking-tighter">{totalCalories}</h1>
                        <span className="text-sm font-bold text-zpd-muted">/ {targetCalories} kcal</span>
                    </div>
                </div>
                <div className="size-16 rounded-3xl bg-zpd-gold/10 flex items-center justify-center text-4xl shadow-inner">⚡</div>
            </div>
            <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-zpd-gold rounded-full transition-all duration-1000 ease-out" style={{ width: `${percentage}%` }}></div>
            </div>
        </div>

        {/* THE FLASH CARD - High Fidelity Input */}
        <div className={`p-8 rounded-[3rem] shadow-2xl transition-all duration-500 relative overflow-hidden border-4 ${editingId ? 'bg-blue-600 border-blue-400 animate-pulse-slow' : 'bg-zpd-gold border-white dark:border-white/10'}`}>
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-8 -translate-y-8">
                <span className="material-symbols-outlined text-[200px]">edit_document</span>
            </div>

            <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-black uppercase tracking-[0.3em] ${editingId ? 'text-blue-100' : 'text-zpd-navy/40'}`}>
                        {editingId ? 'Re-examining Case #' + editingId.slice(-4) : 'New Entry Protocol'}
                    </span>
                    {editingId && (
                        <button onClick={() => {setEditingId(null); setManualSearch('');}} className="bg-white/20 px-3 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-widest">Cancel</button>
                    )}
                </div>

                {/* Name Input */}
                <div className="space-y-2">
                    <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${editingId ? 'text-blue-200' : 'text-zpd-navy/60'}`}>Evidence Item</label>
                    <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 border border-white/30">
                        <span className={`material-symbols-outlined ${editingId ? 'text-white' : 'text-zpd-navy'}`}>search</span>
                        <input 
                            value={manualSearch}
                            onChange={e => setManualSearch(e.target.value)}
                            placeholder="e.g. Jumbo Pop"
                            className="flex-1 bg-transparent outline-none text-xl font-black placeholder:text-white/40 text-white"
                        />
                        <button onClick={() => fileInputRef.current?.click()} className="size-10 rounded-full bg-white/20 flex items-center justify-center text-white"><span className="material-symbols-outlined">photo_camera</span></button>
                    </div>
                </div>

                {/* Amount Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${editingId ? 'text-blue-200' : 'text-zpd-navy/60'}`}>Quantity</label>
                        <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-2xl h-16 flex items-center shadow-inner border border-white/30">
                            <input 
                                type="number"
                                value={manualAmount}
                                onChange={e => setManualAmount(e.target.value)}
                                className="w-full text-center text-3xl font-black text-white bg-transparent outline-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${editingId ? 'text-blue-200' : 'text-zpd-navy/60'}`}>Scale</label>
                        <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-2xl h-16 flex p-1 border border-white/30">
                            <button onClick={() => setSelectedUnit('qty')} className={`flex-1 rounded-xl font-black text-sm transition-all ${selectedUnit === 'qty' ? 'bg-white text-zpd-navy shadow-lg' : 'text-white/60'}`}>PCS</button>
                            <button onClick={() => setSelectedUnit('g')} className={`flex-1 rounded-xl font-black text-sm transition-all ${selectedUnit === 'g' ? 'bg-white text-zpd-navy shadow-lg' : 'text-white/60'}`}>GRAMS</button>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handleProcessEntry}
                    disabled={!manualSearch || isAnalyzing}
                    className={`w-full h-16 rounded-[2rem] flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95 group overflow-hidden ${editingId ? 'bg-white text-blue-600' : 'bg-zpd-navy text-white'}`}
                >
                    {isAnalyzing ? (
                        <div className="size-8 border-4 border-current border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <span className="material-symbols-outlined font-black group-hover:scale-110 transition-transform">
                                {editingId ? 'verified' : 'add_circle'}
                            </span>
                            <span className="font-black uppercase tracking-[0.2em] text-sm">
                                {editingId ? 'Update Case File' : 'Log to Station'}
                            </span>
                        </>
                    )}
                </button>
            </div>
        </div>

        {/* THE EVIDENCE LOCKER - Logged Items */}
        <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3 px-2 mb-2">
                <div className="h-px bg-gray-200 dark:bg-white/10 flex-1"></div>
                <h3 className="text-[10px] font-black text-zpd-muted uppercase tracking-[0.4em]">Evidence Locker</h3>
                <div className="h-px bg-gray-200 dark:bg-white/10 flex-1"></div>
            </div>

            <div className="flex flex-col gap-3">
                {foodLogs.length === 0 ? (
                    <div className="text-center py-12 opacity-30 italic text-sm">Waiting for intake evidence...</div>
                ) : (
                    foodLogs.map(item => (
                        <div 
                            key={item.id} 
                            onClick={() => handleEditItem(item)}
                            className={`group flex items-center gap-4 p-5 bg-white dark:bg-dark-surface rounded-[2rem] border-2 transition-all cursor-pointer active:scale-95 hover:shadow-lg ${editingId === item.id ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-white dark:border-white/5 shadow-sm'}`}
                        >
                            <div className="size-16 rounded-2xl bg-zpd-gold/10 dark:bg-white/5 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">{item.icon}</div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-base font-black text-zpd-navy dark:text-white uppercase tracking-tight truncate">{item.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[9px] font-black text-zpd-muted uppercase bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded tracking-widest">{item.timestamp}</span>
                                    <span className="text-[9px] font-black text-zpd-blue uppercase tracking-widest">{item.displayAmount}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-black text-zpd-navy dark:text-white tracking-tighter">{item.calories}</span>
                                <p className="text-[8px] font-black text-zpd-muted uppercase tracking-widest -mt-1">KCAL</p>
                            </div>
                            <div className="flex flex-col gap-2 items-center">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onDeleteFood(item.id); }}
                                    className="size-8 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
    </div>
  );
};

export default FoodLog;
