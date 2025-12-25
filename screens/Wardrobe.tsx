
import React from 'react';
import { Screen, Character } from '../types';

interface WardrobeProps {
  activeCharacter: Character;
  setActiveCharacter: (char: Character) => void;
  inventory: string[];
  onNavigate: (screen: Screen) => void;
}

// Reuse theme mapping logic
const themeStyles: Record<string, { 
    text: string;
    border: string;
    bg: string;
    selectedBorder: string;
    selectedBg: string;
    selectedText: string;
}> = {
    blue: { 
        text: 'text-blue-600 dark:text-blue-400', 
        border: 'border-blue-200 dark:border-blue-800',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        selectedBorder: 'border-blue-500',
        selectedBg: 'bg-blue-500',
        selectedText: 'text-white'
    },
    green: { 
        text: 'text-emerald-600 dark:text-emerald-400', 
        border: 'border-emerald-200 dark:border-emerald-800',
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        selectedBorder: 'border-emerald-500',
        selectedBg: 'bg-emerald-500',
        selectedText: 'text-white'
    },
    orange: { 
        text: 'text-orange-600 dark:text-orange-400', 
        border: 'border-orange-200 dark:border-orange-800',
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        selectedBorder: 'border-orange-500',
        selectedBg: 'bg-orange-500',
        selectedText: 'text-white'
    },
    gray: { 
        text: 'text-slate-600 dark:text-slate-400', 
        border: 'border-slate-200 dark:border-slate-800',
        bg: 'bg-slate-100 dark:bg-slate-800/30',
        selectedBorder: 'border-slate-500',
        selectedBg: 'bg-slate-600',
        selectedText: 'text-white'
    },
    brown: { 
        text: 'text-amber-700 dark:text-amber-400', 
        border: 'border-amber-200 dark:border-amber-800',
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        selectedBorder: 'border-amber-600',
        selectedBg: 'bg-amber-700',
        selectedText: 'text-white'
    }
};

const Wardrobe: React.FC<WardrobeProps> = ({ activeCharacter, setActiveCharacter, inventory, onNavigate }) => {
  const theme = themeStyles[activeCharacter.themeColor] || themeStyles.blue;
  
  const allItems = [
      { id: 'none', name: 'Default', icon: 'block', type: 'Basic' },
      { id: 'shades', name: 'Aviator Shades', icon: 'eyeglasses', type: 'Accessory' },
      { id: 'cap', name: 'Academy Cap', icon: 'checkroom', type: 'Headgear' },
      { id: 'watch', name: 'Smart Watch', icon: 'watch', type: 'Gadget' },
      { id: 'headband', name: 'Running Band', icon: 'sports', type: 'Gear' },
  ];

  const handleEquip = (itemId: string) => {
      setActiveCharacter({ ...activeCharacter, accessory: itemId });
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-light-bg dark:bg-dark-bg animate-fade-in font-sans transition-colors duration-300">
      {/* Header */}
      <div className={`flex items-center px-6 pt-6 pb-2 justify-between z-20 sticky top-0 bg-light-bg/90 dark:bg-dark-bg/90 backdrop-blur-sm border-b ${theme.border}`}>
        <div className="size-12"></div>
        <h2 className="text-lg font-black leading-tight text-light-text dark:text-white uppercase tracking-tight flex items-center gap-2">
           <span className={`material-symbols-outlined filled ${theme.text}`}>checkroom</span>
           Locker Room
        </h2>
        <button 
          onClick={() => onNavigate(Screen.HOME)}
          className={`flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors active:scale-90 text-light-text dark:text-white`}
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
      </div>

      <div className="flex-1 px-6 pt-4 pb-10 overflow-y-auto no-scrollbar flex flex-col gap-6">
          
          {/* Character Preview */}
          <div className={`relative w-full aspect-square rounded-[2.5rem] bg-light-surface dark:bg-dark-surface border-2 ${theme.border} shadow-inner flex items-center justify-center overflow-hidden`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/50 via-transparent to-transparent opacity-50 pointer-events-none"></div>
              
              {/* Character Image */}
              <div 
                className="w-full h-full bg-contain bg-bottom bg-no-repeat scale-110 transition-transform duration-500" 
                style={{ backgroundImage: `url("${activeCharacter.image}")` }}
              ></div>

              {/* Equipment Overlay Visual (Mockup) */}
              {activeCharacter.accessory && activeCharacter.accessory !== 'none' && (
                  <div className={`absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border ${theme.border} flex items-center gap-2 animate-fade-in-up`}>
                      <span className={`material-symbols-outlined ${theme.text} text-sm`}>
                          {allItems.find(i => i.id === activeCharacter.accessory)?.icon}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wide text-light-text dark:text-white">
                          {allItems.find(i => i.id === activeCharacter.accessory)?.name}
                      </span>
                  </div>
              )}
          </div>

          {/* Inventory Grid */}
          <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 pl-1">Your Gear</h3>
              <div className="grid grid-cols-2 gap-3">
                  {allItems.map((item) => {
                      const isOwned = inventory.includes(item.id);
                      const isEquipped = activeCharacter.accessory === item.id;

                      return (
                          <button
                            key={item.id}
                            disabled={!isOwned}
                            onClick={() => handleEquip(item.id)}
                            className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 ${
                                isEquipped 
                                ? `${theme.selectedBg} ${theme.selectedBorder} shadow-lg scale-[1.02]` 
                                : isOwned 
                                    ? `bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/30` 
                                    : 'bg-gray-100 dark:bg-gray-800 border-transparent opacity-60'
                            }`}
                          >
                              <div className={`size-12 rounded-full flex items-center justify-center text-2xl shadow-sm ${
                                  isEquipped 
                                  ? 'bg-white/20 text-white' 
                                  : `bg-light-surface dark:bg-black/20 ${theme.text}`
                              }`}>
                                  <span className="material-symbols-outlined">{item.icon}</span>
                              </div>
                              
                              <div className="text-center">
                                  <span className={`block text-xs font-bold uppercase tracking-wide mb-0.5 ${isEquipped ? 'text-white' : 'text-light-text dark:text-white'}`}>{item.name}</span>
                                  <span className={`block text-[9px] font-bold ${isEquipped ? 'text-white/70' : 'text-gray-400'}`}>{item.type}</span>
                              </div>

                              {/* Status Icons */}
                              <div className="absolute top-3 right-3">
                                  {isEquipped ? (
                                      <span className="material-symbols-outlined text-white text-sm filled">check_circle</span>
                                  ) : !isOwned ? (
                                      <span className="material-symbols-outlined text-gray-400 text-sm">lock</span>
                                  ) : null}
                              </div>
                          </button>
                      );
                  })}
              </div>
          </div>

      </div>
    </div>
  );
};

export default Wardrobe;
