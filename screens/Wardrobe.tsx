
import React from 'react';
import { Screen, Character } from '../types';

interface WardrobeProps {
  activeCharacter: Character;
  setActiveCharacter: (char: Character) => void;
  inventory: string[];
  onNavigate: (screen: Screen) => void;
}

const Wardrobe: React.FC<WardrobeProps> = ({ activeCharacter, setActiveCharacter, inventory, onNavigate }) => {
  
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
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-light-bg dark:bg-dark-bg animate-fade-in font-sans">
      {/* Header */}
      <div className="flex items-center px-6 pt-6 pb-2 justify-between z-20 sticky top-0 bg-light-bg/90 dark:bg-dark-bg/90 backdrop-blur-sm">
        <button 
          onClick={() => onNavigate(Screen.ACHIEVEMENTS)}
          className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors active:scale-90"
        >
          <span className="material-symbols-outlined text-light-text dark:text-white text-2xl">arrow_back</span>
        </button>
        <h2 className="text-lg font-black leading-tight text-light-text dark:text-white uppercase tracking-tight flex items-center gap-2">
           <span className="material-symbols-outlined filled text-light-primary dark:text-dark-primary">checkroom</span>
           Locker Room
        </h2>
        <div className="size-12"></div>
      </div>

      <div className="flex-1 px-6 pt-4 pb-10 overflow-y-auto no-scrollbar flex flex-col gap-6">
          
          {/* Character Preview */}
          <div className="relative w-full aspect-square rounded-[2.5rem] bg-light-surface dark:bg-dark-surface border-2 border-light-primary/20 dark:border-dark-primary/20 shadow-inner flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/50 via-transparent to-transparent opacity-50 pointer-events-none"></div>
              
              {/* Character Image */}
              <div 
                className="w-full h-full bg-contain bg-bottom bg-no-repeat scale-110 transition-transform duration-500" 
                style={{ backgroundImage: `url("${activeCharacter.image}")` }}
              ></div>

              {/* Equipment Overlay Visual (Mockup) */}
              {activeCharacter.accessory && activeCharacter.accessory !== 'none' && (
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-light-primary/20 dark:border-dark-primary/20 flex items-center gap-2 animate-fade-in-up">
                      <span className="material-symbols-outlined text-light-primary dark:text-dark-primary text-sm">
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
                                ? 'bg-light-primary dark:bg-dark-primary border-light-primary dark:border-dark-primary shadow-lg scale-[1.02]' 
                                : isOwned 
                                    ? 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 hover:border-light-primary/50 dark:hover:border-dark-primary/50' 
                                    : 'bg-gray-100 dark:bg-gray-800 border-transparent opacity-60'
                            }`}
                          >
                              <div className={`size-12 rounded-full flex items-center justify-center text-2xl shadow-sm ${
                                  isEquipped 
                                  ? 'bg-white/20 text-white dark:text-dark-bg' 
                                  : 'bg-light-surface dark:bg-black/20 text-light-text dark:text-white'
                              }`}>
                                  <span className="material-symbols-outlined">{item.icon}</span>
                              </div>
                              
                              <div className="text-center">
                                  <span className={`block text-xs font-bold uppercase tracking-wide mb-0.5 ${isEquipped ? 'text-white dark:text-dark-bg' : 'text-light-text dark:text-white'}`}>{item.name}</span>
                                  <span className={`block text-[9px] font-bold ${isEquipped ? 'text-white/70 dark:text-dark-bg/70' : 'text-gray-400'}`}>{item.type}</span>
                              </div>

                              {/* Status Icons */}
                              <div className="absolute top-3 right-3">
                                  {isEquipped ? (
                                      <span className="material-symbols-outlined text-white dark:text-dark-bg text-sm filled">check_circle</span>
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
