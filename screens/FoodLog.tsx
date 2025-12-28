
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

interface DBItem {
  calPer100g: number;
  icon: string;
  macrosPer100g: {p: number, c: number, f: number};
  category: FoodCategory;
  unit: 'g' | 'qty';
  standardWeight?: number; 
}

const MOCK_FOOD_DATABASE: Record<string, DBItem> = {
    'pawpsicle': { calPer100g: 120, icon: '🐾', macrosPer100g: {p: 0, c: 30, f: 0}, category: 'sweet', unit: 'qty', standardWeight: 60 },
    'dosa': { calPer100g: 168, icon: '🥞', macrosPer100g: {p: 3.9, c: 29, f: 3.7}, category: 'carb', unit: 'qty', standardWeight: 80 },
    'idli': { calPer100g: 52, icon: '⚪', macrosPer100g: {p: 2.4, c: 10, f: 0.1}, category: 'healthy', unit: 'qty', standardWeight: 40 },
    'vada': { calPer100g: 280, icon: '🥯', macrosPer100g: {p: 5, c: 30, f: 16}, category: 'junk', unit: 'qty', standardWeight: 50 },
    'sambar': { calPer100g: 60, icon: '🥘', macrosPer100g: {p: 3, c: 9, f: 1.5}, category: 'healthy', unit: 'g' },
    'pongal': { calPer100g: 212, icon: '🥣', macrosPer100g: {p: 6, c: 32, f: 7}, category: 'healthy', unit: 'g' },
    'upma': { calPer100g: 150, icon: '🍛', macrosPer100g: {p: 4, c: 28, f: 4}, category: 'healthy', unit: 'g' },
    'coffee': { calPer100g: 45, icon: '☕', macrosPer100g: {p: 1.2, c: 6, f: 2}, category: 'sweet', unit: 'qty', standardWeight: 150 },
    'donut': { calPer100g: 452, icon: '🍩', macrosPer100g: {p: 4.9, c: 51, f: 25}, category: 'junk', unit: 'qty', standardWeight: 60 },
    'shrimp': { calPer100g: 150, icon: '🍤', macrosPer100g: {p: 24, c: 0.2, f: 0.3}, category: 'protein', unit: 'g' },
    'carrot': { calPer100g: 41, icon: '🥕', macrosPer100g: {p: 0.9, c: 10, f: 0.2}, category: 'veggie', unit: 'qty', standardWeight: 50 },
};

const SOUTH_INDIAN_QUICK_MENU = [
    { name: 'Idli', icon: '⚪', defaultQty: '2', unit: 'qty' as const },
    { name: 'Dosa', icon: '🥞', defaultQty: '2', unit: 'qty' as const },
    { name: 'Vada', icon: '🥯', defaultQty: '1', unit: 'qty' as const },
    { name: 'Sambar', icon: '🥘', defaultQty: '150', unit: 'g' as const },
    { name: 'Pongal', icon: '🥣', defaultQty: '200', unit: 'g' as const },
    { name: 'Upma', icon: '🍛', defaultQty: '150', unit: 'g' as const },
    { name: 'Filter Coffee', icon: '☕', defaultQty: '1', unit: 'qty' as const },
];

const getContextQuote = (charId: string, category: FoodCategory, foodName: string) => {
    const quotes: Record<string, Record<string, string[]>> = {
        judy: {
            sweet: [
                "A little sugar for the hustle! Just don't let Chief Bogo see you vibrating through walls.",
                "Energy boost! Just remember, you can't outrun a bad diet, rookie!",
                "Is that a Pawpsicle? Nick is rubbing off on you. Keep moving those paws!"
            ],
            junk: [
                "Officer, this is a code blue violation of the health code! Give me 20 burpees right now!",
                "If you keep eating like this, you'll be slower than a sloth at the DMV!",
                "I'm not mad, I'm just... highly motivated to make you run extra laps for this."
            ],
            veggie: [
                "Peak bunny performance! Carrots for vision, greens for agility. Outstanding!",
                "You're making the ZPD proud! That's the fuel of a hero.",
                "Agility +10! You're ready to chase down a runaway Duke Weaselton!"
            ],
            healthy: [
                "Zootopia is a better place when we eat like this. Keep it up, partner!",
                "Balanced fuel for a balanced mind. You're becoming a fine officer.",
                "Smooth as a fox, strong as a rhino. Great choice!"
            ],
            protein: [
                "Building muscle for the academy finals? I like your drive!",
                "Protein power! You'll be throwing rhinos over your shoulder in no time.",
                "Sturdy fuel for a long shift. Good thinking, cadet."
            ],
            carb: [
                "Carb-loading for the midnight patrol? Clever girl/boy!",
                "Stamina fuel! Just make sure we actually burn it off, okay?",
                "The energy is high! Let's translate this into a high-speed chase (on the treadmill)."
            ],
            fruit: [
                "Fresh from the Rainforest District! Energetic and vibrant.",
                "Nature's candy. Much better than whatever Nick is selling on the corner.",
                "Sweet, fresh, and functional. Just like our partnership!"
            ]
        },
        nick: {
            sweet: [
                "It's called a hustle, sweetheart. And this sugar high? Definitely part of the plan.",
                "Red flavor or blue? Doesn't matter, it's all delicious. Enjoy the rush.",
                "I know a guy who can get you these tax-free. For now, enjoy the calories."
            ],
            junk: [
                "Trying to keep up with Clawhauser? I admire your dedication to the donut arts.",
                "Look at you, living dangerously. Hope you've got a good excuse for the Chief.",
                "Sly bunny/fox trick: If you eat it fast enough, the calories don't count. (Note: They definitely count)."
            ],
            veggie: [
                "Eating your greens? You're becoming quite the law-abiding citizen. It's almost boring.",
                "Carrots again? You're going to turn into my partner if you're not careful.",
                "Health is wealth, or so I told a very gullible giraffe once."
            ],
            healthy: [
                "Efficient and effective. You've clearly been studying my methods.",
                "Standard procedure. Won't win you any awards, but you'll live to see tomorrow.",
                "Not a scam in sight. Just pure, honest nutrition. How... refreshing?"
            ],
            protein: [
                "Muscle fuel. Essential for when the 'hustle' turns into a 'run for your life'.",
                "Keep those muscles sharp. You never know when we'll need to jump a fence.",
                "Protein? Good. Makes you look more intimidating during interrogations."
            ],
            carb: [
                "Energy for days. Or at least until lunch. Don't let them see you sweat.",
                "Fueled up and ready to scheme. I mean, serve. Serve and protect.",
                "Nice. You've got that 'ready to dodge a parking ticket' energy now."
            ],
            fruit: [
                "Sweet and simple. Just like my last tax return.",
                "Vitamins. Because apparently, we care about 'longevity' now.",
                "Fruit is just nature's way of saying 'I'm not junk food, I promise'."
            ]
        },
        bogo: {
            sweet: [
                "Sugar is for citizens. Officers need discipline! ...Is there any left for me?",
                "I don't need a song and dance about your sweet tooth. Get back to work!",
                "This intake is... questionable. Report to the gym for extra conditioning."
            ],
            junk: [
                "DISMISSED! This platter is an insult to the ZPD uniform!",
                "I've seen weasels with better dietary habits. This is unacceptable, rookie!",
                "Are you trying to become the next desk sergeant? Eat some fiber!"
            ],
            healthy: [
                "Acceptable. Carry on with your duties.",
                "Finally, someone who understands the importance of operational readiness.",
                "Nutrition is the foundation of order. Good job, officer."
            ],
            veggie: [
                "Fiber keeps the horns sharp and the mind focused. Adequate.",
                "Vegetation is efficient fuel. I approve of this logistical choice.",
                "Peak physical condition requires sacrifices. This is a good one."
            ],
            protein: [
                "Strength. Power. Discipline. This is how we build a force to be reckoned with.",
                "I expect you to bench press a squad car after this intake. Move!",
                "Strong fuel for a strong officer. Don't waste it on paperwork."
            ],
            carb: [
                "Fueling for a double shift? Make every calorie count.",
                "Energy is a resource. Manage it like you manage your evidence files.",
                "Carbohydrates are essential for endurance. Just don't get soft."
            ],
            fruit: [
                "Vitamins are essential for field duty. I won't have my officers catching the flu.",
                "A practical choice. Quick energy without the sloth-like crash.",
                "Fruit. Simple. Effective. Dismissed!"
            ]
        }
    };

    const charQuotes = quotes[charId] || quotes['judy'];
    const categoryQuotes = charQuotes[category] || charQuotes['healthy'];
    return categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
};

const getZPDStatus = (calories: number) => {
    if (calories > 800) return "⚠️ CODE RED: METABOLIC EMERGENCY";
    if (calories > 500) return "📢 PUBLIC ANNOUNCEMENT: HEAVY LOAD";
    if (calories < 100) return "🔍 INVESTIGATION: LIGHT SNACK DETECTED";
    return "✅ STATUS: OPTIMAL CRUISING SPEED";
};

const FoodLog: React.FC<FoodLogProps> = ({ onNavigate, activeCharacter, onAddFood, onDeleteFood, onUpdateFood, foodLogs, targetCalories, onToggleOverlay }) => {
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

  const handleEditItem = (item: FoodLogItem) => {
    setEditingId(item.id);
    setManualSearch(item.name);
    
    const amountMatch = item.displayAmount?.match(/(\d+\.?\d*)/);
    const unitMatch = item.displayAmount?.match(/(G|PCS)/i);
    
    if (amountMatch) setManualAmount(amountMatch[1]);
    if (unitMatch) setSelectedUnit(unitMatch[0].toUpperCase() === 'G' ? 'g' : 'qty');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickSelect = (item: typeof SOUTH_INDIAN_QUICK_MENU[0]) => {
      setManualSearch(item.name);
      setManualAmount(item.defaultQty);
      setSelectedUnit(item.unit);
  };

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
          
          let result: any = { 
            name: manualSearch || 'Item', 
            calories: 0, 
            weight: 0, 
            displayAmount: '', 
            icon: '🍽️', 
            macros: { protein: 0, carbs: 0, fat: 0 }, 
            category: 'healthy' as FoodCategory, 
            feedback: '',
            zpdStatus: ''
          };
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
          result.zpdStatus = getZPDStatus(result.calories);
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
      
      {analyzedData && <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md" />}

      <div className="flex items-center px-6 pt-10 pb-4 justify-between sticky top-0 z-20 bg-transparent">
        <div className="size-10"></div>
        <h2 className="text-sm font-black text-light-text dark:text-white flex items-center gap-2 tracking-widest uppercase">
            <span className="material-symbols-outlined text-orange-500 text-xl font-bold">restaurant</span>
            Fuel Station
        </h2>
        <button 
          onClick={() => onNavigate(Screen.HOME)} 
          className="size-10 rounded-full bg-white/40 dark:bg-dark-surface flex items-center justify-center shadow-sm"
        >
          <span className="material-symbols-outlined text-gray-400">close</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 flex flex-col gap-6">
        
        {/* Daily Intake Card */}
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

        {/* Action Card: Identify New Evidence */}
        <div className={`p-6 rounded-[2.5rem] border flex flex-col gap-4 shadow-sm transition-colors duration-500 ${editingId ? 'bg-blue-50/50 border-blue-200 dark:bg-blue-900/10' : 'bg-[#FEF9C3] dark:bg-[#1C1C1E] border-yellow-200/50 dark:border-[#FFD60A]/20'}`}>
            <div className="flex justify-between items-center mb-1">
                <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${editingId ? 'text-blue-500' : 'text-[#854D0E] dark:text-[#FFD60A]'} opacity-60`}>
                    {editingId ? 'Edit Evidence File' : 'Identify New Evidence'}
                </h3>
                {editingId && (
                    <button 
                        onClick={() => { setEditingId(null); setManualSearch(''); setManualAmount('1'); }}
                        className="text-[9px] font-black uppercase tracking-widest text-blue-500 hover:underline"
                    >
                        Cancel Edit
                    </button>
                )}
            </div>
            
            <div className={`relative bg-white dark:bg-[#2C2C2E] rounded-2xl h-16 flex items-center px-4 shadow-sm border-2 transition-colors ${editingId ? 'border-blue-400' : 'border-transparent focus-within:border-yellow-400/40 dark:focus-within:border-[#FFD60A]/40'}`}>
                <span className={`material-symbols-outlined mr-2 ${editingId ? 'text-blue-400' : 'text-slate-300 dark:text-gray-600'}`}>search</span>
                <input 
                    value={manualSearch} 
                    onChange={e => setManualSearch(e.target.value)}
                    placeholder="Search Evidence..."
                    className="flex-1 bg-transparent outline-none text-xl font-black text-[#422006] dark:text-white placeholder:text-slate-300 dark:placeholder:text-gray-700"
                />
                <button onClick={() => fileInputRef.current?.click()} className="text-slate-400 dark:text-gray-600">
                    <span className="material-symbols-outlined">photo_camera</span>
                </button>
            </div>

            <div className="flex gap-3">
                <div className="flex bg-[#F1F5F9] dark:bg-[#2C2C2E] rounded-2xl p-1 items-center h-16 w-28 shadow-inner">
                    <button 
                        onClick={() => setSelectedUnit('qty')}
                        className={`flex-1 h-full rounded-xl transition-all flex items-center justify-center ${selectedUnit === 'qty' ? 'bg-white dark:bg-gray-700 shadow-sm text-black dark:text-white' : 'text-slate-400 dark:text-gray-600'}`}
                    >
                        <span className="font-black text-xl leading-none">#</span>
                    </button>
                    <button 
                        onClick={() => setSelectedUnit('g')}
                        className={`flex-1 h-full rounded-xl transition-all flex items-center justify-center ${selectedUnit === 'g' ? 'bg-white dark:bg-gray-700 shadow-sm text-black dark:text-white' : 'text-slate-400 dark:text-gray-600'}`}
                    >
                         <span className="font-black text-xl leading-none italic transform -skew-x-6">g</span>
                    </button>
                </div>
                <div className={`flex-1 bg-white dark:bg-[#2C2C2E] rounded-2xl h-16 flex items-center shadow-sm border-2 transition-colors ${editingId ? 'border-blue-400' : 'border-transparent focus-within:border-yellow-400/40 dark:focus-within:border-[#FFD60A]/40'}`}>
                    <input 
                        type="number"
                        value={manualAmount}
                        onChange={e => setManualAmount(e.target.value)}
                        className="w-full text-center text-3xl font-black text-[#422006] dark:text-white bg-transparent outline-none"
                    />
                </div>
            </div>

            <button 
                onClick={() => analyzeManualEntry()}
                disabled={!manualSearch || isAnalyzing}
                className={`w-full h-16 rounded-2xl flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 ${editingId ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-[#FACC15] dark:bg-[#FFD60A] text-black shadow-yellow-400/20 dark:shadow-[#FFD60A]/20'}`}
            >
                {isAnalyzing ? (
                    <div className={`size-6 border-2 border-t-transparent rounded-full animate-spin ${editingId ? 'border-white' : 'border-black'}`}></div>
                ) : (
                    <>
                        <span className="material-symbols-outlined font-bold">{editingId ? 'verified' : 'bar_chart'}</span>
                        <span className="font-black uppercase tracking-widest text-sm">{editingId ? 'Update Case Entry' : 'Analyze Platter'}</span>
                    </>
                )}
            </button>

            <div className="pt-2 animate-fade-in">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#854D0E] dark:text-[#FFD60A] opacity-50">Local Evidence (South Indian)</span>
                    <div className="h-px bg-yellow-600/10 dark:bg-yellow-400/10 flex-1"></div>
                </div>
                <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
                    {SOUTH_INDIAN_QUICK_MENU.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => handleQuickSelect(item)}
                            className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-white/60 dark:bg-[#2C2C2E]/60 border border-yellow-200/50 dark:border-white/5 rounded-xl shadow-sm hover:border-yellow-400 dark:hover:border-[#FFD60A] transition-all active:scale-95 group"
                        >
                            <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
                            <span className="text-[11px] font-black uppercase tracking-tight text-[#422006] dark:text-gray-300">{item.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Today's History */}
        <div className="animate-fade-in pb-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500 mb-4 px-2">Today's Menu</h3>
            <div className="flex flex-col gap-3">
                {foodLogs.length === 0 ? (
                    <div className="text-center py-10 opacity-30 dark:opacity-10 italic text-sm text-light-text dark:text-white">Evidence files pending...</div>
                ) : (
                    foodLogs.map(item => (
                        <div key={item.id} className={`flex items-center gap-4 p-4 rounded-3xl border transition-all ${editingId === item.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 shadow-md ring-2 ring-blue-100 dark:ring-blue-900/40' : 'bg-white dark:bg-[#1C1C1E] border-slate-100 dark:border-white/5 shadow-sm group'}`}>
                            <div className="size-14 rounded-2xl bg-slate-50 dark:bg-black/20 flex items-center justify-center text-3xl shadow-inner shrink-0 group-hover:scale-105 transition-transform">{item.icon}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                    <span className="text-[9px] font-black text-slate-300 dark:text-gray-600 uppercase tracking-widest">Item:</span>
                                    <p className="font-black truncate text-gray-900 dark:text-white text-sm uppercase tracking-tight">{item.name}</p>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 dark:text-gray-500">{item.timestamp} • {item.displayAmount}</p>
                            </div>
                            <div className="text-right pr-2">
                                <span className="text-xl font-black text-[#FACC15] dark:text-[#FFD60A] leading-none">{item.calories}</span>
                                <span className="text-[8px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest block -mt-1">KCAL</span>
                            </div>
                            
                            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => handleEditItem(item)} 
                                    className="size-8 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center hover:scale-110 active:scale-90 transition-transform"
                                    title="Edit Entry"
                                >
                                    <span className="material-symbols-outlined text-lg">edit</span>
                                </button>
                                <button 
                                    onClick={() => onDeleteFood(item.id)} 
                                    className="size-8 rounded-full bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-300 flex items-center justify-center hover:scale-110 active:scale-90 transition-transform"
                                    title="Delete Entry"
                                >
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>

      <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

      {/* Analysis Modal */}
      {analyzedData && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-fade-in">
              <div className="bg-white dark:bg-[#1C1C1E] w-full max-h-[90vh] max-w-[340px] animate-modal-pop relative flex flex-col rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-white/5">
                  <div className="flex-1 overflow-y-auto px-6 py-8 no-scrollbar relative z-10 flex flex-col items-center">
                        <div className="absolute top-0 left-0 w-full h-4 bg-yellow-400 dark:bg-[#FFD60A] flex items-center overflow-hidden opacity-20">
                            <span className="text-[6px] font-black text-black whitespace-nowrap animate-marquee">CRIME SCENE - DO NOT CROSS - EVIDENCE LOG - CASE NO. 8923 - </span>
                            <span className="text-[6px] font-black text-black whitespace-nowrap animate-marquee">CRIME SCENE - DO NOT CROSS - EVIDENCE LOG - CASE NO. 8923 - </span>
                        </div>

                        <div className="size-32 rounded-[3rem] bg-slate-50 dark:bg-[#2C2C2E] flex items-center justify-center text-6xl shadow-inner mb-4 relative mt-4">
                             {uploadedImage ? <img src={uploadedImage} className="w-full h-full object-cover rounded-[3rem]" alt="Meal" /> : analyzedData.icon}
                             <div className="absolute -bottom-2 bg-green-500 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border-2 border-white dark:border-gray-800">IDENTIFIED</div>
                        </div>

                        <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none text-center mb-1">{analyzedData.name}</h3>
                        <p className="text-[9px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-4">{analyzedData.zpdStatus}</p>
                        
                        <div className="flex items-center gap-2 mb-6">
                            <span className="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100 dark:border-orange-800/40 shadow-sm">{analyzedData.calories} KCAL</span>
                            <span className="bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-gray-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100 dark:border-white/10 shadow-sm">{analyzedData.displayAmount}</span>
                        </div>

                        <div className="w-full space-y-4 mb-6">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center p-3 rounded-2xl bg-blue-50 dark:bg-[#0EA5E910] border border-blue-100 dark:border-[#0EA5E930]">
                                    <p className="text-[8px] font-black text-blue-400 uppercase mb-1">Power</p>
                                    <p className="text-base font-black text-blue-700 dark:text-[#0EA5E9]">{analyzedData.macros.protein}g</p>
                                </div>
                                <div className="text-center p-3 rounded-2xl bg-green-50 dark:bg-[#10B98110] border border-green-100 dark:border-[#10B98130]">
                                    <p className="text-[8px] font-black text-green-400 uppercase mb-1">Fuel</p>
                                    <p className="text-base font-black text-green-700 dark:text-[#10B981]">{analyzedData.macros.carbs}g</p>
                                </div>
                                <div className="text-center p-3 rounded-2xl bg-yellow-50 dark:bg-[#FFD60A10] border border-yellow-100 dark:border-[#FFD60A30]">
                                    <p className="text-[8px] font-black text-yellow-600 dark:text-[#FFD60A] uppercase mb-1">Storage</p>
                                    <p className="text-base font-black text-yellow-700 dark:text-[#FFD60A]">{analyzedData.macros.fat}g</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#FFFBEB] dark:bg-[#172554] p-5 rounded-3xl border-2 border-dashed border-yellow-200 dark:border-[#FFD60A]/40 w-full relative group">
                            <div className="absolute -top-3 -left-2 size-10 rounded-full border-2 border-white dark:border-gray-800 bg-cover bg-top shadow-md z-10 animate-precinct-pulse" style={{ backgroundImage: `url("${activeCharacter?.image}")` }}></div>
                            <div className="absolute -top-2 -right-2 bg-yellow-400 dark:bg-[#FFD60A] text-black px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-tighter rotate-6">COACH JUDGMENT</div>
                            
                            <p className="text-[13px] font-bold text-gray-700 dark:text-[#BFDBFE] italic leading-relaxed text-center pl-2 transition-all group-hover:scale-105">
                                "{analyzedData.feedback}"
                            </p>
                            
                            <div className="mt-4 pt-3 border-t border-yellow-100 dark:border-white/5 flex justify-between items-center opacity-60">
                                <span className="text-[7px] font-black text-gray-400 dark:text-gray-500 uppercase">Case Status: {analyzedData.calories > 400 ? 'HEAVY LIFTING REQUIRED' : 'CLEAN SLATE'}</span>
                                <span className="text-[7px] font-black text-yellow-600 dark:text-[#FFD60A] uppercase italic">Coach Mood: {analyzedData.category === 'junk' ? 'DISAPPOINTED' : 'EXCITED'}</span>
                            </div>
                        </div>
                  </div>
                  <div className="p-6 bg-slate-50/50 dark:bg-black/40 flex gap-3 border-t dark:border-white/5">
                        <button onClick={() => setAnalyzedData(null)} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 transition-colors hover:text-red-400">Expunge File</button>
                        <button onClick={confirmAnalysis} className="flex-[2.5] py-4 bg-[#FACC15] dark:bg-[#FFD60A] hover:bg-yellow-400 text-black text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg transition-transform active:scale-95">Commit Evidence</button>
                  </div>
              </div>
          </div>
      )}

      <style>{`
          @keyframes modal-pop { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
          .animate-modal-pop { animation: modal-pop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .animate-marquee { display: inline-block; animation: marquee 20s linear infinite; }
          @keyframes precinct-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          .animate-precinct-pulse { animation: precinct-pulse 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default FoodLog;
