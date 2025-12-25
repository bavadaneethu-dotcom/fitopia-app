
import React from 'react';
import { Character } from '../types';
import { CHARACTERS } from '../App';

interface CompanionsProps {
  activeCharacter: Character;
  setActiveCharacter: (char: Character) => void;
  onBack: () => void;
}

const Companions: React.FC<CompanionsProps> = ({ activeCharacter, setActiveCharacter, onBack }) => {
  // Use data from App.tsx instead of hardcoded
  const characters = CHARACTERS;

  return (
    <div className="flex flex-col h-full animate-fade-in pb-10 relative">
      {/* Close Button Header */}
      <div className="absolute top-0 right-0 p-6 z-30">
        <button 
          onClick={onBack}
          className="size-10 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 dark:hover:bg-white/10 transition-colors text-light-text dark:text-white"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </div>

      <div className="px-6 text-center pt-8 pb-6 mt-8">
        <h2 className="text-3xl font-bold text-light-text dark:text-dark-text tracking-tight mb-2">Choose Partner</h2>
        <p className="text-light-muted dark:text-dark-muted">Select a companion to motivate your journey.</p>
      </div>

      <div className="flex overflow-x-auto snap-x snap-mandatory px-6 gap-4 pb-8 hide-scrollbar">
        {characters.map((char) => (
          <div 
            key={char.id}
            onClick={() => setActiveCharacter(char)}
            className={`snap-center shrink-0 w-[85%] max-w-[320px] rounded-[2.5rem] overflow-hidden relative transition-all duration-300 border-4 cursor-pointer group ${activeCharacter.id === char.id ? 'border-light-primary dark:border-dark-primary shadow-xl shadow-light-primary/20 dark:shadow-dark-primary/20 scale-100' : 'border-transparent opacity-70 scale-95'}`}
          >
            <div className="aspect-[3/4] relative bg-white dark:bg-gray-800">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10"></div>
              {/* Updated image styling to show full body movie render */}
              <div 
                className="w-full h-full bg-center bg-contain bg-no-repeat transform scale-105" 
                style={{ backgroundImage: `url("${char.image}")` }}
              ></div>
              
              {activeCharacter.id === char.id && (
                <div className="absolute top-4 right-4 z-20 bg-light-primary dark:bg-dark-primary text-white dark:text-dark-bg text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  SELECTED
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h3 className="text-3xl font-bold leading-none">{char.name}</h3>
                    <p className="text-light-primary dark:text-dark-primary font-bold text-sm mt-1">{char.role}</p>
                  </div>
                </div>
                <p className="text-sm opacity-90 italic mb-4">"{char.quotes[0]}"</p>
                
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 flex items-center gap-3">
                  <div className="size-10 rounded-full bg-light-primary dark:bg-dark-primary flex items-center justify-center text-white dark:text-dark-bg shrink-0">
                    <span className="material-symbols-outlined filled" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">XP Bonus</p>
                    <p className="font-bold text-sm">+{char.level * 2}% XP Gain</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 mt-auto">
        <button 
          onClick={onBack}
          className="w-full bg-light-primary dark:bg-dark-primary hover:brightness-110 text-white dark:text-dark-bg font-bold text-lg h-14 rounded-full shadow-lg shadow-light-primary/30 dark:shadow-dark-primary/30 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
        >
          <span>Train with {activeCharacter.name.split(' ')[0]}</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default Companions;
