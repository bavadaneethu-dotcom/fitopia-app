
import React, { useState, useEffect } from 'react';
import { Screen, Character } from '../types';
import { CHARACTERS } from '../App';

interface CharacterSelectProps {
  activeCharacter: Character;
  setActiveCharacter: (char: Character) => void;
  onNavigate: (screen: Screen) => void;
}

const CharacterSelect: React.FC<CharacterSelectProps> = ({ activeCharacter, setActiveCharacter, onNavigate }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [activeCharacter.id]);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-white dark:bg-[#1a1a1a] text-light-text dark:text-white font-sans transition-colors duration-300">
      
      {/* Header Section */}
      <div className="flex flex-col items-center w-full pt-8 px-6 relative z-20 bg-white dark:bg-[#1a1a1a]">
        <div className="w-full flex items-center justify-between mb-4">
            <button 
              onClick={() => onNavigate(Screen.SIGNUP)}
              className="size-12 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
            >
              <span className="material-symbols-outlined text-gray-800 dark:text-white text-xl">arrow_back</span>
            </button>
            
            <div className="px-4 py-1.5">
                <span className="text-[10px] font-black text-indigo-400 dark:text-indigo-300 uppercase tracking-[0.2em]">Step 1 of 5</span>
            </div>

            <div className="size-12"></div> 
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-2">
            <div className="h-1.5 w-8 rounded-full bg-yellow-400 shadow-sm"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>

      {/* Main Content Scrollable */}
      <div className="flex-1 flex flex-col items-center w-full overflow-y-auto no-scrollbar relative z-0 pb-44">
        
        <h1 className="text-[34px] font-black text-center text-[#4A4A4A] dark:text-white leading-[0.95] tracking-tight mt-4 mb-8 drop-shadow-sm">
          Who is training <br/> <span className="text-[#6D5D4B] dark:text-gray-400">with you?</span>
        </h1>

        {/* Character Card */}
        <div className="w-full max-w-[320px] px-0 shrink-0 mb-6 perspective-1000 relative h-[420px]">
            <div 
                key={activeCharacter.id}
                className="absolute inset-0 rounded-[2.5rem] overflow-hidden bg-white dark:bg-gray-800 shadow-2xl shadow-black/20 dark:shadow-black/50 border border-white/50 dark:border-white/5 animate-card-enter"
            >
                <div className={`absolute inset-0 bg-gradient-to-b ${
                    activeCharacter.themeColor === 'blue' ? 'from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-900/60' :
                    activeCharacter.themeColor === 'green' ? 'from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-900/60' :
                    activeCharacter.themeColor === 'orange' ? 'from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-900/60' :
                    activeCharacter.themeColor === 'gray' ? 'from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900' :
                    'from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900'
                } transition-colors duration-500`}></div>

                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105" 
                    style={{ backgroundImage: `url("${activeCharacter.image}")`, backgroundPosition: 'center 20%' }}
                ></div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

                <div className="absolute top-6 left-6 z-20">
                    <div className="flex items-center gap-1.5 bg-yellow-400 text-black px-3 py-1.5 rounded-full shadow-lg border border-yellow-300">
                        <span className="material-symbols-outlined text-[14px] filled" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                        <span className="text-[9px] font-black uppercase tracking-wider">ZPD Verified Coach</span>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex flex-col items-start">
                    <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-2 drop-shadow-lg opacity-0 animate-slide-up" style={{ animationDelay: '100ms' }}>
                        {activeCharacter.name.split(' ').map((word, i) => (
                            <span key={i} className="block">{word}</span>
                        ))}
                    </h2>
                    
                    <p className="text-yellow-400 font-black text-xs uppercase tracking-[0.2em] mb-6 drop-shadow-md opacity-0 animate-slide-up" style={{ animationDelay: '200ms' }}>
                        {activeCharacter.role}
                    </p>
                    
                    <div className="w-full opacity-0 animate-slide-up" style={{ animationDelay: '300ms' }}>
                        <p className="text-sm font-bold text-white/90 italic leading-snug">
                            "{activeCharacter.onboardingMessages.select}"
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Carousel Container */}
        <div className="w-full max-w-[360px] bg-[#F5F5F5] dark:bg-white/5 rounded-[2.5rem] p-4 shadow-inner relative z-10 mx-auto mt-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 pl-2">Select Partner</p>
            
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-1 px-2 justify-start">
                {CHARACTERS.map((char) => {
                    const isActive = activeCharacter.id === char.id;
                    return (
                        <button 
                            key={char.id} 
                            onClick={() => setActiveCharacter(char)}
                            className="flex flex-col items-center gap-2 group focus:outline-none shrink-0"
                        >
                            <div className="relative p-[4px]">
                                <div className={`absolute inset-0 rounded-full border-[3px] transition-all duration-300 ${isActive ? 'border-yellow-400 opacity-100' : 'border-transparent opacity-0 scale-90'}`}></div>
                                <div className={`size-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 relative z-10 transition-all duration-300 border-2 ${isActive ? 'border-white' : 'border-transparent grayscale opacity-60 hover:opacity-100 hover:grayscale-0'}`}>
                                    <img 
                                      src={char.image} 
                                      alt={char.name} 
                                      className="w-full h-full object-cover object-top" 
                                    />
                                </div>
                                {isActive && (
                                    <div className="absolute bottom-0 right-0 bg-yellow-400 text-black rounded-full size-5 flex items-center justify-center border-2 border-white dark:border-gray-800 z-20 shadow-sm animate-pop-in">
                                        <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                                    </div>
                                )}
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-wider transition-colors ${isActive ? 'text-black dark:text-yellow-400' : 'text-gray-400'}`}>
                                {char.name.split(' ')[0]}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>

      </div>

      {/* Footer CTA */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent dark:from-[#1a1a1a] dark:via-[#1a1a1a] z-30 pt-16 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
          <button 
            onClick={() => onNavigate(Screen.USER_DATA)}
            className="w-full h-16 rounded-full bg-[#FACC15] hover:bg-yellow-300 text-black font-black text-sm uppercase tracking-widest shadow-xl shadow-yellow-400/20 flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98] group"
          >
              <span className="material-symbols-outlined text-xl filled">shield</span>
              Report for Duty
              <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
      </div>

      <style>{`
        @keyframes card-enter {
            0% { opacity: 0; transform: scale(0.95) translateY(10px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-card-enter {
            animation: card-enter 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes slide-up {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
            animation: slide-up 0.4s ease-out forwards;
            opacity: 0;
        }
        @keyframes pop-in {
            0% { transform: scale(0); }
            60% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        .animate-pop-in {
            animation: pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
};

export default CharacterSelect;
