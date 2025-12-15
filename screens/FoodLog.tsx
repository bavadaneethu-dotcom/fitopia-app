
import React, { useState, useRef } from 'react';
import { Screen, Character, FoodLogItem } from '../types';

interface FoodLogProps {
  onNavigate: (screen: Screen) => void;
  activeCharacter?: Character;
  onAddFood: (item: FoodLogItem) => void;
  foodLogs: FoodLogItem[];
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

// Quick Add Presets - Mixed Zootopia & Requested Items
const foodItems: FoodItem[] = [
  { 
    id: '1', 
    name: 'Pawpsicle', 
    calories: 120, 
    icon: '🐾', 
    category: 'sweet',
    bgColor: 'bg-red-50 dark:bg-red-900/20', 
    borderColor: 'border-red-200 dark:border-red-800',
    unit: 'qty',
    amount: 2
  },
  { 
    id: '2', 
    name: 'Idli', 
    calories: 104, // 52kcal * 2
    icon: '⚪', 
    category: 'healthy',
    bgColor: 'bg-gray-50 dark:bg-gray-800', 
    borderColor: 'border-gray-200 dark:border-gray-700',
    unit: 'qty',
    amount: 2
  },
  { 
    id: '3', 
    name: 'Sambar', 
    calories: 150, 
    icon: '🥘', 
    category: 'veggie',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20', 
    borderColor: 'border-orange-200 dark:border-orange-800',
    unit: 'g',
    amount: 250
  },
  { 
    id: '4', 
    name: 'Masala Dosa', 
    calories: 206, 
    icon: '🥞', 
    category: 'carb',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20', 
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    unit: 'qty',
    amount: 1
  },
  { 
    id: '5', 
    name: 'Poriyal', 
    calories: 70, 
    icon: '🥦', 
    category: 'veggie',
    bgColor: 'bg-green-50 dark:bg-green-900/20', 
    borderColor: 'border-green-200 dark:border-green-800',
    unit: 'g',
    amount: 100
  },
  { 
    id: '6', 
    name: 'Glazed Donut', 
    calories: 280, 
    icon: '🍩', 
    category: 'junk',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20', 
    borderColor: 'border-pink-200 dark:border-pink-800',
    unit: 'qty',
    amount: 1
  },
];

interface DBItem {
  calPer100g: number;
  icon: string;
  macrosPer100g: {p: number, c: number, f: number};
  missing: string[];
  category: FoodCategory;
  unit: 'g' | 'qty';
  standardWeight?: number; // grams per 1 qty
}

// Enhanced Mock Database with Unit Logic
const MOCK_FOOD_DATABASE: Record<string, DBItem> = {
    // Qty based items (Standard weight approx)
    'dosa': { calPer100g: 168, icon: '🥞', macrosPer100g: {p: 3.9, c: 29, f: 3.7}, missing: ['Protein', 'Fiber'], category: 'carb', unit: 'qty', standardWeight: 80 }, // ~80g per dosa
    'masala dosa': { calPer100g: 206, icon: '🥞', macrosPer100g: {p: 4, c: 29, f: 8}, missing: ['Protein', 'Fiber'], category: 'carb', unit: 'qty', standardWeight: 120 },
    'idli': { calPer100g: 130, icon: '⚪', macrosPer100g: {p: 6, c: 25, f: 0.2}, missing: ['Healthy Fats'], category: 'healthy', unit: 'qty', standardWeight: 40 }, // ~40g per idli
    'vada': { calPer100g: 275, icon: '🍩', macrosPer100g: {p: 8, c: 20, f: 18}, missing: ['Fiber'], category: 'junk', unit: 'qty', standardWeight: 45 },
    'roti': { calPer100g: 297, icon: '🫓', macrosPer100g: {p: 10, c: 56, f: 3}, missing: ['Protein'], category: 'healthy', unit: 'qty', standardWeight: 35 },
    'chapati': { calPer100g: 297, icon: '🫓', macrosPer100g: {p: 10, c: 56, f: 3}, missing: ['Protein'], category: 'healthy', unit: 'qty', standardWeight: 40 },
    'naan': { calPer100g: 310, icon: '🫓', macrosPer100g: {p: 9, c: 54, f: 6}, missing: ['Protein', 'Fiber'], category: 'carb', unit: 'qty', standardWeight: 80 },
    'samosa': { calPer100g: 260, icon: '🥟', macrosPer100g: {p: 4, c: 30, f: 14}, missing: ['Protein', 'Fiber'], category: 'junk', unit: 'qty', standardWeight: 50 },
    'egg': { calPer100g: 155, icon: '🥚', macrosPer100g: {p: 13, c: 1.1, f: 11}, missing: ['Fiber', 'Carbs'], category: 'protein', unit: 'qty', standardWeight: 50 },
    'boiled egg': { calPer100g: 155, icon: '🥚', macrosPer100g: {p: 13, c: 1.1, f: 11}, missing: ['Fiber', 'Carbs'], category: 'protein', unit: 'qty', standardWeight: 50 },
    'apple': { calPer100g: 52, icon: '🍎', macrosPer100g: {p: 0.3, c: 14, f: 0.2}, missing: ['Protein'], category: 'fruit', unit: 'qty', standardWeight: 150 },
    'banana': { calPer100g: 89, icon: '🍌', macrosPer100g: {p: 1.1, c: 23, f: 0.3}, missing: ['Protein'], category: 'fruit', unit: 'qty', standardWeight: 120 },
    'pawpsicle': { calPer100g: 120, icon: '🐾', macrosPer100g: {p: 0, c: 30, f: 0}, missing: ['Protein', 'Fiber', 'Fats'], category: 'sweet', unit: 'qty', standardWeight: 60 },
    'donut': { calPer100g: 452, icon: '🍩', macrosPer100g: {p: 4, c: 51, f: 25}, missing: ['Protein', 'Fiber'], category: 'sweet', unit: 'qty', standardWeight: 70 },
    'burger': { calPer100g: 295, icon: '🍔', macrosPer100g: {p: 17, c: 30, f: 14}, missing: ['Fiber'], category: 'junk', unit: 'qty', standardWeight: 200 },
    'pizza': { calPer100g: 266, icon: '🍕', macrosPer100g: {p: 11, c: 33, f: 10}, missing: ['Fiber'], category: 'junk', unit: 'qty', standardWeight: 100 },

    // Weight (Gram) based items
    'sambar': { calPer100g: 60, icon: '🥘', macrosPer100g: {p: 3, c: 9, f: 1.5}, missing: [], category: 'healthy', unit: 'g' },
    'poriyal': { calPer100g: 70, icon: '🥦', macrosPer100g: {p: 2, c: 8, f: 4}, missing: ['Protein'], category: 'veggie', unit: 'g' },
    'chutney': { calPer100g: 250, icon: '🥥', macrosPer100g: {p: 2, c: 8, f: 24}, missing: ['Protein'], category: 'healthy', unit: 'g' },
    'rice': { calPer100g: 130, icon: '🍚', macrosPer100g: {p: 2.7, c: 28, f: 0.3}, missing: ['Protein', 'Fiber'], category: 'carb', unit: 'g' },
    'biryani': { calPer100g: 180, icon: '🍚', macrosPer100g: {p: 8, c: 25, f: 6}, missing: ['Fiber'], category: 'carb', unit: 'g' },
    'chicken biryani': { calPer100g: 210, icon: '🍗', macrosPer100g: {p: 10, c: 24, f: 8}, missing: ['Fiber'], category: 'protein', unit: 'g' },
    'paneer': { calPer100g: 265, icon: '🧀', macrosPer100g: {p: 18, c: 1.2, f: 20}, missing: ['Fiber'], category: 'protein', unit: 'g' },
    'chicken curry': { calPer100g: 140, icon: '🍗', macrosPer100g: {p: 15, c: 4, f: 7}, missing: ['Fiber'], category: 'protein', unit: 'g' },
    'salad': { calPer100g: 25, icon: '🥗', macrosPer100g: {p: 1, c: 5, f: 0.2}, missing: ['Protein', 'Healthy Fats'], category: 'veggie', unit: 'g' },
    'carrot': { calPer100g: 41, icon: '🥕', macrosPer100g: {p: 0.9, c: 10, f: 0.2}, missing: ['Protein', 'Fats'], category: 'veggie', unit: 'g' },
    'blueberry': { calPer100g: 57, icon: '🫐', macrosPer100g: {p: 0.7, c: 14, f: 0.3}, missing: ['Protein'], category: 'fruit', unit: 'g' },
    'chai': { calPer100g: 80, icon: '☕', macrosPer100g: {p: 2, c: 10, f: 3}, missing: [], category: 'sweet', unit: 'g' },
};

const FoodLog: React.FC<FoodLogProps> = ({ onNavigate, activeCharacter, onAddFood, foodLogs }) => {
  const targetCalories = 2150;
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastAdded, setLastAdded] = useState<{amount: number, icon: string} | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual Input States
  const [manualSearch, setManualSearch] = useState('');
  const [manualAmount, setManualAmount] = useState('1'); 
  const [selectedUnit, setSelectedUnit] = useState<'g' | 'qty'>('qty');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedData, setAnalyzedData] = useState<any>(null);

  const totalCalories = foodLogs.reduce((sum, item) => sum + item.calories, 0);

  const updateState = (calories: number, icon: string) => {
    setLastAdded({ amount: Math.round(calories), icon });
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    setTimeout(() => setLastAdded(null), 1000);
  };

  const triggerVisualFeedback = (id?: string) => {
    if (id) {
        const btn = document.getElementById(`btn-${id}`);
        if (btn) {
          btn.classList.add('scale-95');
          setTimeout(() => btn.classList.remove('scale-95'), 150);
        }
    }
  };

  // --------------------------------------------------------------------------------
  // CONTEXT-AWARE QUOTE LOGIC
  // --------------------------------------------------------------------------------
  const getContextQuote = (charId: string, category: FoodCategory, foodName: string) => {
      const quotes: Record<string, Record<string, string[]>> = {
          judy: {
              junk: ["Officer Clawhauser would love that, but we're on duty!", "A treat is fine, but don't let it slow you down!", "I hope you're running that off later!"],
              sweet: ["Sugar rush? Just make sure you burn it off!", "Donuts... the number one enemy of the force.", "Careful, too much sugar makes for a jittery officer."],
              healthy: ["That's ZPD standard fuel! Great job!", "Clean eating keeps you sharp for clues.", "Now THAT is a meal fit for a hero."],
              veggie: ["Carrots? My favorite! Excellent choice!", "Vegetables are the key to night vision. Probably.", "Fresh and crunchy. Love it!"],
              protein: ["Building muscle for the beat? Good work.", "Protein keeps you going on long stakeouts.", "Strong choice! literally."],
              fruit: ["Nature's candy! Way better than a Pawpsicle.", "Sweet and smart. Just like a hustle.", "Berry good choice! ...See what I did there?"]
          },
          nick: {
              junk: ["Hustle fuel. I approve.", "Finally, something with flavor.", "Living dangerously? I like your style."],
              sweet: ["Pawpsicle diet? bold move, Carrots.", "Sweet tooth, huh? Don't tell Bogo.", "Life's short. Eat the dessert."],
              healthy: ["Rabbit food? Really?", "Trying to live forever? Boring.", "I guess that's... responsible. Ugh."],
              veggie: ["You turning into a bunny now?", "Green stuff. Exciting.", "I hope there's some dip with that."],
              protein: ["Carnivore style. Now we're talking.", "Meat on the bone. Respect.", "That's real food. Good job, kid."],
              fruit: ["Blueberries? Going savage are we?", "Sweet, tart, and healthy. A triple threat.", "Not bad."]
          },
          bogo: {
              junk: ["That is NOT regulation fuel! Fix it!", "Do you want to end up in parking duty?", "My grandmother eats cleaner than that!"],
              sweet: ["Sugar makes you weak! dismissed!", "Do not bring that into my precinct!", "Focus! You need nutrition, not fluff."],
              healthy: ["Acceptable. Carry on.", "Good discipline. Keep it up.", "That serves the purpose. Dismissed."],
              veggie: ["Efficient fuel. Good.", "Eat your greens, officer.", "Nutrition is part of the uniform. Wear it well."],
              protein: ["Good. You need strength to hold the line.", "Protein synthesis is mandatory.", "That's what a ZPD officer eats."],
              fruit: ["Vitamin C. Necessary.", "Acceptable snack.", "Better than a donut."]
          },
      };

      const charQuotes = quotes[charId] || quotes['judy'];
      const categoryQuotes = charQuotes[category] || charQuotes['healthy'];
      return categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
  };

  // --------------------------------------------------------------------------------
  // ANALYSIS LOGIC
  // --------------------------------------------------------------------------------
  
  const prefillQuickAdd = (item: FoodItem) => {
      triggerVisualFeedback(item.id);
      setManualSearch(item.name);
      setManualAmount(item.amount.toString());
      setSelectedUnit(item.unit);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const analyzeManualEntry = () => {
      if (!manualSearch) return;

      setIsAnalyzing(true);
      
      setTimeout(() => {
          setIsAnalyzing(false);
          const searchTermLower = manualSearch.toLowerCase().trim();
          const amountValue = parseFloat(manualAmount) || (selectedUnit === 'qty' ? 1 : 100);
          
          let result: any = {
              name: manualSearch,
              calories: 0,
              weight: 0,
              displayAmount: '', 
              icon: '🍽️',
              macros: { protein: 0, carbs: 0, fat: 0 },
              missing: [] as string[],
              feedback: '',
              category: 'healthy' as FoodCategory
          };

          const dbKeys = Object.keys(MOCK_FOOD_DATABASE);
          const matchedKey = dbKeys.find(key => searchTermLower.includes(key));
          
          if (matchedKey) {
             const data = MOCK_FOOD_DATABASE[matchedKey];
             result.name = manualSearch.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
             result.icon = data.icon;
             result.category = data.category;
             result.missing = data.missing;

             if (selectedUnit === 'qty') {
                 const quantity = amountValue;
                 const weightPerItem = data.standardWeight || 50;
                 result.weight = quantity * weightPerItem;
                 if (data.unit === 'g') {
                     result.weight = quantity * 150;
                 }
                 result.calories = Math.round((result.weight / 100) * data.calPer100g);
                 result.displayAmount = `${quantity} ${quantity > 1 ? 'pcs' : 'pc'}`;

             } else {
                 result.weight = amountValue;
                 result.displayAmount = `${amountValue}g`;
                 result.calories = Math.round((amountValue / 100) * data.calPer100g);
             }

             const ratio = result.weight / 100;
             result.macros = { 
                 protein: parseFloat((data.macrosPer100g.p * ratio).toFixed(1)), 
                 carbs: parseFloat((data.macrosPer100g.c * ratio).toFixed(1)), 
                 fat: parseFloat((data.macrosPer100g.f * ratio).toFixed(1)) 
             };

          } else {
             result.name = manualSearch.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
             result.weight = selectedUnit === 'qty' ? amountValue * 100 : amountValue; 
             result.displayAmount = selectedUnit === 'qty' ? `${amountValue} pcs` : `${amountValue}g`;
             result.calories = Math.round(result.weight * 1.5); 
             result.macros = { protein: Math.round(result.weight * 0.1), carbs: Math.round(result.weight * 0.2), fat: Math.round(result.weight * 0.05) };
             result.missing = ['Macro Check']; 
             result.category = 'junk'; 
          }

          const charId = activeCharacter?.id || 'judy';
          result.feedback = getContextQuote(charId, result.category, result.name);
          
          setAnalyzedData(result);

      }, 1500);
  };

  const confirmAnalysis = () => {
      if (analyzedData) {
          updateState(analyzedData.calories, analyzedData.icon);
          onAddFood({
              id: Date.now().toString(),
              name: analyzedData.name,
              calories: analyzedData.calories,
              icon: analyzedData.icon,
              timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              displayAmount: analyzedData.displayAmount,
              macros: analyzedData.macros
          });
          setAnalyzedData(null);
          setManualSearch('');
          setManualAmount('1');
          setTimeout(() => {
              scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
      }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setIsAnalyzing(true);
          setTimeout(() => {
              setIsAnalyzing(false);
              const keys = Object.keys(MOCK_FOOD_DATABASE);
              const randomKey = keys[Math.floor(Math.random() * keys.length)];
              setManualSearch(randomKey.charAt(0).toUpperCase() + randomKey.slice(1)); 
              
              setTimeout(() => {
                 const analyzeBtn = document.getElementById('analyze-btn');
                 if(analyzeBtn) analyzeBtn.click();
              }, 200);
          }, 2000);
      }
  };

  const percentage = Math.min((totalCalories / targetCalories) * 100, 100);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden pb-24 bg-light-bg dark:bg-dark-bg animate-fade-in transition-colors duration-300">
       {/* Header */}
      <div className="flex items-center px-6 pt-6 pb-2 justify-between sticky top-0 z-20 bg-light-bg/90 dark:bg-dark-bg/90 backdrop-blur-sm">
        <button 
          onClick={() => onNavigate(Screen.HOME)}
          className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors active:scale-90"
        >
          <span className="material-symbols-outlined text-light-text dark:text-white text-2xl">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight text-light-text dark:text-white flex items-center gap-2">
           <span className="material-symbols-outlined filled text-orange-500">local_dining</span>
           Fuel Station
        </h2>
        <div className="size-12"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pt-2">
        
        {/* Progress Card */}
        <div 
            className={`bg-light-surface dark:bg-dark-surface p-6 rounded-[2.5rem] shadow-lg border-2 border-light-primary/20 dark:border-dark-primary/20 mb-6 relative overflow-hidden transition-all duration-300 ${isAnimating ? 'scale-[1.02] shadow-xl ring-4 ring-light-primary/30 dark:ring-dark-primary/30' : ''}`}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-light-primary/20 dark:bg-dark-primary/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            
            <div className="flex justify-between items-end mb-4 relative z-10">
                <div>
                    <p className="text-xs font-bold text-light-primary dark:text-dark-primary uppercase tracking-widest mb-1">Daily Intake</p>
                    <div className="flex items-baseline gap-1">
                        <h1 className={`text-5xl font-black text-light-text dark:text-white tracking-tighter transition-transform duration-200 ${isAnimating ? 'scale-110 text-light-primary dark:text-dark-primary' : ''}`}>
                            {totalCalories}
                        </h1>
                        {lastAdded && (
                            <span className="text-sm font-bold text-light-primary dark:text-dark-primary animate-fade-in-up">+{lastAdded.amount}</span>
                        )}
                    </div>
                    <p className="text-sm font-medium text-gray-500">of {targetCalories} kcal goal</p>
                </div>
                {/* Character Reaction */}
                <div 
                    className={`size-16 rounded-full bg-cover bg-center border-2 border-white shadow-md transition-transform duration-500 ${isAnimating ? 'rotate-[360deg] scale-110' : 'animate-bounce'}`} 
                    style={{ backgroundImage: `url("${activeCharacter?.image || 'https://static.wikia.nocookie.net/disney/images/e/e5/Clawhauser_infobox.png'}")`, animationDuration: '3s' }}
                >
                    {lastAdded && (
                        <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm animate-bounce text-xl">
                            {lastAdded.icon}
                        </div>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-6 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
                <div 
                    className={`h-full bg-gradient-to-r from-light-secondary to-light-primary dark:from-dark-secondary dark:to-dark-primary rounded-full transition-all duration-700 ease-out relative ${isAnimating ? 'brightness-125' : ''}`}
                    style={{ width: `${percentage}%` }}
                >
                    <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                </div>
            </div>
        </div>

        {/* Input Card */}
        <div className="animate-fade-in mb-6">
             {!analyzedData ? (
                <div className="bg-light-surface dark:bg-dark-surface p-5 rounded-[2rem] border border-light-primary/20 dark:border-dark-primary/20 shadow-md">
                    {/* ... Input Fields ... */}
                    <div className="flex justify-between items-center mb-3">
                         <label className="text-xs font-bold text-light-muted dark:text-dark-muted uppercase tracking-wide">Add Meal</label>
                         <div className="flex gap-1">
                            <span className="size-2 rounded-full bg-red-400 animate-pulse"></span>
                            <span className="size-2 rounded-full bg-yellow-400 animate-pulse delay-100"></span>
                            <span className="size-2 rounded-full bg-green-400 animate-pulse delay-200"></span>
                         </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 mb-4">
                        <div className="relative group">
                            <span className="absolute left-4 top-4 text-xl opacity-50">🔍</span>
                            <input 
                                value={manualSearch}
                                onChange={(e) => setManualSearch(e.target.value)}
                                placeholder="Type food or tap camera..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') analyzeManualEntry();
                                }}
                                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white dark:bg-black/20 border-2 border-transparent focus:border-light-primary dark:focus:border-dark-primary font-bold text-lg text-light-text dark:text-white outline-none shadow-inner transition-all placeholder:font-medium placeholder:text-gray-400"
                            />
                            <input 
                                type="file" 
                                accept="image/*" 
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handlePhotoUpload}
                            />
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute right-2 top-2 bottom-2 aspect-square rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-light-primary dark:hover:bg-dark-primary text-gray-500 dark:text-gray-300 hover:text-white dark:hover:text-dark-bg transition-colors flex items-center justify-center"
                            >
                                <span className="material-symbols-outlined">photo_camera</span>
                            </button>
                        </div>
                        
                        <div className="flex gap-3">
                            <div className="flex bg-gray-100 dark:bg-black/20 rounded-xl p-1 shrink-0 h-full self-stretch items-center">
                                <button 
                                   onClick={() => setSelectedUnit('qty')}
                                   className={`p-3 rounded-lg transition-all flex items-center justify-center ${selectedUnit === 'qty' ? 'bg-white dark:bg-gray-600 shadow-sm text-black dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                                   title="Quantity"
                                >
                                   <span className="text-base font-bold">#</span>
                                </button>
                                <button 
                                   onClick={() => setSelectedUnit('g')}
                                   className={`p-3 rounded-lg transition-all flex items-center justify-center ${selectedUnit === 'g' ? 'bg-white dark:bg-gray-600 shadow-sm text-black dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                                   title="Grams"
                                >
                                   <span className="material-symbols-outlined text-lg">scale</span>
                                </button>
                            </div>

                            <div className="relative flex-1 group">
                                <input 
                                    value={manualAmount}
                                    onChange={(e) => setManualAmount(e.target.value)}
                                    type="number"
                                    placeholder={selectedUnit === 'qty' ? '1' : '100'}
                                    className="w-full pl-4 pr-4 py-3 rounded-xl bg-white dark:bg-black/20 border-2 border-transparent focus:border-light-primary dark:focus:border-dark-primary font-bold text-light-text dark:text-white outline-none text-center shadow-inner transition-all"
                                />
                                <span className="absolute right-3 top-3.5 text-xs font-bold text-gray-400 pointer-events-none uppercase tracking-wide">
                                    {selectedUnit === 'qty' ? 'pcs' : 'g'}
                                </span>
                            </div>
                        </div>

                        <button 
                            id="analyze-btn"
                            onClick={() => analyzeManualEntry()}
                            disabled={!manualSearch || isAnalyzing}
                            className="w-full bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-bg font-black text-sm uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-light-primary/30 dark:shadow-dark-primary/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            {isAnalyzing ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                                    Scanning...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-lg">analytics</span>
                                    Analyze Platter
                                </>
                            )}
                        </button>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Quick Fuel</p>
                        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
                            {foodItems.map((item) => (
                                <button
                                    key={item.id}
                                    id={`btn-${item.id}`}
                                    onClick={() => prefillQuickAdd(item)}
                                    className={`shrink-0 relative group overflow-hidden flex flex-col items-center gap-2 p-2 rounded-xl border border-transparent hover:border-light-primary/30 dark:hover:border-dark-primary/30 w-auto transition-all active:scale-95 ${item.bgColor} ${item.borderColor} border-opacity-50 min-w-[100px]`}
                                >
                                    <span className="text-3xl bg-white/50 dark:bg-black/20 rounded-lg p-2 mb-1 shadow-sm">{item.icon}</span>
                                    <div className="flex flex-col items-center text-center">
                                        <span className="text-xs font-bold text-light-text dark:text-white leading-tight">{item.name}</span>
                                        <div className="flex items-center gap-1 mt-1">
                                            <span className="text-[10px] font-bold opacity-60 bg-white/30 dark:bg-black/10 px-1.5 rounded">{item.amount}{item.unit === 'qty' ? 'pc' : 'g'}</span>
                                            <span className="text-[10px] font-black text-light-primary dark:text-dark-primary">{item.calories}</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
             ) : (
                <div className="bg-[#fdfbf7] dark:bg-[#1a202c] rounded-[1rem] p-0 shadow-2xl overflow-hidden mb-6 border-2 border-dashed border-gray-300 dark:border-gray-600 animate-fade-in-up relative z-10 font-mono">
                     <div className="absolute top-4 right-4 z-20 border-4 border-red-500/30 text-red-500/30 font-black text-2xl px-2 py-1 transform -rotate-12 pointer-events-none">
                        ANALYZED
                     </div>

                     <div className="bg-gray-100 dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                         <div className="flex items-center gap-2">
                             <span className="material-symbols-outlined text-gray-400">folder_open</span>
                             <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Case File #8294</span>
                         </div>
                         <div className="text-[10px] font-bold text-gray-400">ZPD FORENSICS</div>
                     </div>
                     
                     <div className="p-6 pb-2 flex items-center gap-5">
                         <div className="size-20 bg-white dark:bg-black/20 rounded-lg border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-5xl shadow-inner relative">
                             {analyzedData.icon}
                             <div className="absolute -bottom-2 -right-2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 font-bold">FIG A</div>
                         </div>
                         <div>
                             <h3 className="text-2xl font-black text-gray-800 dark:text-white leading-none mb-1 uppercase tracking-tighter">{analyzedData.name}</h3>
                             <div className="flex items-center gap-3 mt-2">
                                 <div className="flex flex-col">
                                     <span className="text-[9px] uppercase font-bold text-gray-400">Energy</span>
                                     <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{analyzedData.calories} kcal</span>
                                 </div>
                                 <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
                                 <div className="flex flex-col">
                                     <span className="text-[9px] uppercase font-bold text-gray-400">Amount</span>
                                     <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{analyzedData.displayAmount}</span>
                                 </div>
                             </div>
                         </div>
                     </div>

                     <div className="px-6 py-4">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Chemical Composition</p>
                         <div className="flex gap-4 text-xs font-mono">
                             <div className="flex-1">
                                 <div className="flex justify-between mb-1">
                                     <span>Protein</span>
                                     <span className="font-bold">{analyzedData.macros.protein}g</span>
                                 </div>
                                 <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                     <div className="h-full bg-blue-500" style={{ width: `${Math.min(analyzedData.macros.protein * 2, 100)}%` }}></div>
                                 </div>
                             </div>
                             <div className="flex-1">
                                 <div className="flex justify-between mb-1">
                                     <span>Carbs</span>
                                     <span className="font-bold">{analyzedData.macros.carbs}g</span>
                                 </div>
                                 <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                     <div className="h-full bg-green-500" style={{ width: `${Math.min(analyzedData.macros.carbs, 100)}%` }}></div>
                                 </div>
                             </div>
                             <div className="flex-1">
                                 <div className="flex justify-between mb-1">
                                     <span>Fat</span>
                                     <span className="font-bold">{analyzedData.macros.fat}g</span>
                                 </div>
                                 <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                     <div className="h-full bg-yellow-500" style={{ width: `${Math.min(analyzedData.macros.fat * 2, 100)}%` }}></div>
                                 </div>
                             </div>
                         </div>
                     </div>

                     <div className="bg-yellow-50 dark:bg-yellow-900/10 p-5 border-t border-gray-200 dark:border-gray-700">
                         <div className="flex gap-3">
                             <div className="size-10 rounded-full border border-gray-300 dark:border-gray-600 bg-cover bg-top shrink-0 grayscale" style={{ backgroundImage: `url("${activeCharacter?.image}")` }}></div>
                             <div className="flex-1">
                                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Officer Notes ({activeCharacter?.name.split(' ')[0]})</p>
                                 <p className="text-sm font-medium text-gray-800 dark:text-gray-200 italic leading-relaxed font-sans">
                                     "{analyzedData.feedback}"
                                 </p>
                             </div>
                         </div>
                         
                         <div className="mt-5 flex gap-3 font-sans">
                             <button 
                                 onClick={() => setAnalyzedData(null)}
                                 className="flex-1 py-3 text-xs font-bold uppercase tracking-wide text-gray-500 hover:bg-gray-200 dark:hover:bg-white/5 rounded transition-colors border border-gray-300 dark:border-gray-600"
                             >
                                 Reject Evidence
                             </button>
                             <button 
                                 onClick={confirmAnalysis}
                                 className="flex-[1.5] py-3 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 text-xs font-bold uppercase tracking-wide rounded shadow-lg flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-white transition-colors"
                             >
                                 <span className="material-symbols-outlined text-sm">save_alt</span>
                                 File to Log
                             </button>
                         </div>
                     </div>
                </div>
             )}
        </div>

        {/* Recent History List */}
        <div className="animate-fade-in" ref={scrollRef}>
            <h3 className="text-lg font-black text-light-text dark:text-white mb-4 px-2 flex items-center gap-2">
                Today's Menu
                <div className="h-px bg-gray-200 dark:bg-white/10 flex-1 ml-2"></div>
            </h3>
            {foodLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 opacity-50 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl">
                    <span className="material-symbols-outlined text-4xl mb-2 text-gray-300 dark:text-gray-600">no_meals</span>
                    <p className="text-sm font-bold text-gray-400">No meals logged yet.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3 pb-6">
                    {foodLogs.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:border-light-primary/30 dark:hover:border-dark-primary/30 transition-colors group">
                            <div className="size-12 rounded-xl bg-gray-50 dark:bg-white/10 flex items-center justify-center text-2xl border border-gray-100 dark:border-white/5 group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-light-text dark:text-white">{item.name}</p>
                                <div className="flex gap-2 items-center">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.timestamp}</p>
                                    {item.displayAmount && <span className="text-[10px] bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-gray-500 font-bold">{item.displayAmount}</span>}
                                </div>
                            </div>
                            <span className="font-bold text-light-primary dark:text-dark-primary bg-light-primary/10 dark:bg-dark-primary/10 px-2 py-1 rounded-lg text-sm">{item.calories}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default FoodLog;
