
import React, { useEffect, useState } from 'react';
import { Screen, Character } from '../types';

interface ClaimRewardProps {
  activeCharacter: Character;
  onNavigate: (screen: Screen) => void;
  onUnlock: (itemId: string) => void;
}

const ClaimReward: React.FC<ClaimRewardProps> = ({ activeCharacter, onNavigate, onUnlock }) => {
  const [stage, setStage] = useState<'intro' | 'reveal' | 'finished'>('intro');

  // Trigger unlock on mount
  useEffect(() => {
    onUnlock('shades'); // Simulate unlocking the "Aviator Shades" for demo
    
    // Animation sequence
    setTimeout(() => setStage('reveal'), 2000);
    setTimeout(() => setStage('finished'), 4000);
  }, []);

  // Determine animation based on character
  const getAnimationClass = () => {
      switch (activeCharacter.id) {
          case 'judy': return 'animate-bounce'; // Hopping
          case 'nick': return 'animate-wiggle'; // Cool wiggle
          case 'bogo': return 'animate-pulse'; // Flexing
          case 'clawhauser': return 'animate-spin-slow'; // Happy spin
          default: return 'animate-bounce';
      }
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-light-bg dark:bg-dark-bg">
      {/* Background FX */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-light-primary/20 via-transparent to-transparent animate-pulse-slow"></div>
          {stage !== 'intro' && (
              <>
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
                <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-green-400 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
              </>
          )}
      </div>

      {/* Main Character Display */}
      <div className="relative z-10 flex flex-col items-center gap-8">
          
          <div className={`relative transition-all duration-700 ${stage === 'reveal' ? 'scale-110' : 'scale-100'}`}>
              {/* Spotlight */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-40 h-10 bg-black/20 blur-xl rounded-full"></div>
              
              {/* Character */}
              <div 
                className={`w-64 h-64 bg-contain bg-center bg-no-repeat drop-shadow-2xl transition-all duration-500 ${stage === 'intro' ? '' : getAnimationClass()}`}
                style={{ backgroundImage: `url("${activeCharacter.image}")` }}
              ></div>

              {/* Reward Icon Popup */}
              <div className={`absolute -top-10 -right-10 bg-white dark:bg-gray-800 p-4 rounded-[2rem] shadow-2xl border-4 border-light-primary dark:border-dark-primary flex items-center justify-center transition-all duration-500 transform ${stage === 'intro' ? 'scale-0 opacity-0 translate-y-10' : 'scale-100 opacity-100 translate-y-0 rotate-12'}`}>
                  <span className="material-symbols-outlined text-5xl text-light-primary dark:text-dark-primary">eyeglasses</span>
              </div>
          </div>

          <div className="text-center px-6">
              <h2 className={`text-3xl font-black text-light-text dark:text-white uppercase tracking-tight mb-2 transition-all duration-500 ${stage === 'intro' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                  {stage === 'intro' ? 'Processing...' : 'Reward Unlocked!'}
              </h2>
              <p className={`text-sm font-bold text-gray-500 dark:text-gray-400 transition-all duration-500 delay-100 ${stage === 'intro' ? 'opacity-0' : 'opacity-100'}`}>
                  You earned <span className="text-light-primary dark:text-dark-primary">Aviator Shades</span>
              </p>
          </div>

          {/* Action Buttons */}
          <div className={`flex flex-col gap-3 w-full max-w-xs transition-all duration-500 delay-300 ${stage === 'finished' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
              <button 
                onClick={() => onNavigate(Screen.WARDROBE)}
                className="w-full py-4 bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-bg rounded-xl font-black uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                  <span className="material-symbols-outlined filled">checkroom</span>
                  Equip Now
              </button>
              <button 
                onClick={() => onNavigate(Screen.ACHIEVEMENTS)}
                className="w-full py-4 bg-white dark:bg-white/10 text-gray-500 dark:text-gray-300 rounded-xl font-bold uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-white/20 transition-all"
              >
                  Later
              </button>
          </div>
      </div>

      <style>{`
        @keyframes wiggle {
            0%, 100% { transform: rotate(-3deg); }
            50% { transform: rotate(3deg); }
        }
        .animate-wiggle {
            animation: wiggle 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ClaimReward;
