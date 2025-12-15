
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

  // Trigger animation state on character change (optional visual hooks)
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [activeCharacter.id]);

  return (
    <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-[#FDFBF7] dark:bg-[#1a1a1a] text-light-text dark:text-white font-sans transition-colors duration-300">
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-8 pb-2 z-10 shrink-0 relative">
        <button 
          onClick={() => onNavigate(Screen.SIGNUP)}
          className="size-10 rounded-full bg-white dark:bg-white/10 shadow-sm border border-gray-100 dark:border-white/5 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/20 transition-colors"
        >
          <span className="material-symbols-outlined text-gray-800 dark:text-white text-lg">arrow_back</span>
        </button>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Step 1 of 5</span>
        <div className="size-10"></div>
      </header>

      {/* Main Content Scrollable */}
      <div className="flex-1 flex flex-col items-center w-full overflow-y-auto no-scrollbar relative z-0 pb-32">
        
        {/* Progress Dots */}
        <div className="flex gap-2 mt-4 mb-6">
            <div className="h-1.5 w-8 rounded-full bg-yellow-400"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>

        {/* Title */}
        <h1 className="text-[32px] font-black text-center text-[#4A4A4A] dark:text-white leading-[0.95] tracking-tight mb-8 drop-shadow-sm">
          Who is training <br/> <span className="text-[#6D5D4B] dark:text-gray-400">with you?</span>
        </h1>

        {/* Character Card - Animated Key Switch */}
        <div className="w-full max-w-[320px] px-0 shrink-0 mb-8 perspective-1000 relative h-[420px]">
            {/* We use key to trigger a full re-render animation when character changes */}
            <div 
                key={activeCharacter.id}
                className="absolute inset-0 rounded-[2.5rem] overflow-hidden bg-white dark:bg-gray-800 shadow-2xl shadow-yellow-900/10 dark:shadow-black/50 border border-white/50 dark:border-white/5 animate-card-enter"
            >
                {/* Background Gradient/Color based on character */}
                <div className={`absolute inset-0 bg-gradient-to-b ${
                    activeCharacter.themeColor === 'blue' ? 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/40' :
                    activeCharacter.themeColor === 'green' ? 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/40' :
                    activeCharacter.themeColor === 'orange' ? 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/40' :
                    'from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900'
                } transition-colors duration-500`}></div>

                {/* Character Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105" 
                    style={{ backgroundImage: `url("${activeCharacter.image}")`, backgroundPosition: 'center 20%' }}
                ></div>
                
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                {/* Badge Top Left */}
                <div className="absolute top-5 left-5 z-20">
                    <div className="flex items-center gap-1.5 bg-yellow-400 text-black px-3 py-1.5 rounded-full shadow-lg border border-yellow-300">
                        <span className="material-symbols-outlined text-[14px] filled" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                        <span className="text-[9px] font-black uppercase tracking-wider">ZPD Verified Coach</span>
                    </div>
                </div>

                {/* Content Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col items-start">
                    <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-2 drop-shadow-lg opacity-0 animate-slide-up" style={{ animationDelay: '100ms' }}>
                        {activeCharacter.name.split(' ').map((word, i) => (
                            <span key={i} className="block">{word}</span>
                        ))}
                    </h2>
                    
                    <p className="text-yellow-400 font-black text-xs uppercase tracking-[0.2em] mb-4 drop-shadow-md animate-slide-up" style={{ animationDelay: '200ms' }}>
                        {activeCharacter.role}
                    </p>
                    
                    {/* Quote */}
                    <div className="w-full bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 mb-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
                        <p className="text-xs font-bold text-white/90 italic leading-snug">
                            "{activeCharacter.onboardingMessages.select}"
                        </p>
                    </div>

                    {/* Footer Tags */}
                    <div className="flex gap-2 w-full animate-slide-up" style={{ animationDelay: '400ms' }}>
                        <div className="flex-1 bg-black/30 backdrop-blur-sm rounded-lg py-2 flex items-center justify-center gap-1.5 border border-white/10">
                            <span className="material-symbols-outlined text-yellow-400 text-xs filled">bolt</span>
                            <span className="text-[9px] font-bold text-white uppercase tracking-wide">Ready to Train</span>
                        </div>
                        <div className="flex-1 bg-black/30 backdrop-blur-sm rounded-lg py-2 flex items-center justify-center gap-1.5 border border-white/10">
                            <span className="material-symbols-outlined text-gray-300 text-xs">add_circle</span>
                            <span className="text-[9px] font-bold text-white uppercase tracking-wide">Coach Lvl {activeCharacter.level}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Carousel Container - White Box */}
        <div className="w-full max-w-[360px] bg-white dark:bg-white/5 rounded-[2rem] p-4 shadow-sm border border-gray-100 dark:border-white/5 relative z-10 mx-auto">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 pl-2">Select Partner</p>
            
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 px-1">
                {CHARACTERS.map((char) => {
                    const isActive = activeCharacter.id === char.id;
                    return (
                        <button 
                            key={char.id} 
                            onClick={() => setActiveCharacter(char)}
                            className="flex flex-col items-center gap-2 group focus:outline-none shrink-0"
                        >
                            {/* Circle Container with padding for ring to prevent clipping */}
                            <div className="relative p-[3px]">
                                {/* Animated Selection Ring */}
                                <div className={`absolute inset-0 rounded-full border-[3px] transition-all duration-300 ${isActive ? 'border-yellow-400 scale-100 opacity-100' : 'border-transparent scale-90 opacity-0'}`}></div>
                                
                                {/* Image Avatar */}
                                <div className={`size-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 relative z-10 transition-all duration-300 ${isActive ? 'scale-95 shadow-none' : 'scale-100 grayscale opacity-70 hover:opacity-100 hover:grayscale-0'}`}>
                                    <img 
                                      src={char.image} 
                                      alt={char.name} 
                                      className="w-full h-full object-cover object-top" 
                                    />
                                </div>

                                {/* Checkmark Badge */}
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
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7] to-transparent dark:from-[#1a1a1a] dark:via-[#1a1a1a] z-30 pt-10">
          <button 
            onClick={() => onNavigate(Screen.USER_DATA)}
            className="w-full h-16 rounded-full bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm uppercase tracking-widest shadow-xl shadow-yellow-400/20 flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98] group"
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
            opacity: 0; /* Initial state handled by animation */
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
