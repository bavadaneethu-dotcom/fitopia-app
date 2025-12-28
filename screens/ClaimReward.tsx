
import React, { useEffect, useState } from 'react';
import { Screen, Character } from '../types';

interface ClaimRewardProps {
  activeCharacter: Character;
  setActiveCharacter: (char: Character) => void;
  onNavigate: (screen: Screen) => void;
  onUnlock: (itemId: string) => void;
}

const themeStyles: Record<string, { bgFrom: string; bgTo: string; button: string; textAccent: string; dotColor: string; }> = {
    blue: { bgFrom: 'from-[#EFF6FF]', bgTo: 'to-[#DBEAFE]', button: 'bg-blue-500 hover:bg-blue-400', textAccent: 'text-blue-600 dark:text-blue-400', dotColor: '#3B82F6' },
    green: { bgFrom: 'from-[#ECFDF5]', bgTo: 'to-[#D1FAE5]', button: 'bg-emerald-500 hover:bg-emerald-400', textAccent: 'text-emerald-600 dark:text-emerald-400', dotColor: '#10B981' },
    orange: { bgFrom: 'from-[#FFF7ED]', bgTo: 'to-[#FFEDD5]', button: 'bg-orange-500 hover:bg-orange-400', textAccent: 'text-orange-600 dark:text-orange-400', dotColor: '#F97316' },
    gray: { bgFrom: 'from-[#F8FAFC]', bgTo: 'to-[#E2E8F0]', button: 'bg-slate-600 hover:bg-slate-500', textAccent: 'text-slate-600 dark:text-slate-400', dotColor: '#64748B' },
    brown: { bgFrom: 'from-[#FFFBEB]', bgTo: 'to-[#FEF3C7]', button: 'bg-amber-600 hover:bg-amber-500', textAccent: 'text-amber-700 dark:text-amber-400', dotColor: '#D97706' }
};

const ClaimReward: React.FC<ClaimRewardProps> = ({ activeCharacter, setActiveCharacter, onNavigate, onUnlock }) => {
  const [viewState, setViewState] = useState<'initial' | 'revealing' | 'decision'>('initial');
  const [isEquipped, setIsEquipped] = useState(false);
  const theme = themeStyles[activeCharacter.themeColor] || themeStyles.blue;
  const rewardItem = { id: 'shades', name: 'Aviator Shades', icon: 'eyeglasses', type: 'Accessory' };

  const handleCollect = () => {
    setViewState('revealing');
    onUnlock(rewardItem.id);
    setTimeout(() => { setViewState('decision'); setIsEquipped(true); }, 2000);
  };

  const handleConfirm = () => {
      if (isEquipped) setActiveCharacter({ ...activeCharacter, accessory: rewardItem.id });
      onNavigate(Screen.HOME);
  };

  return (
    <div className={`relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-[#FEF3C7] dark:bg-[#1f1d18] font-sans transition-colors duration-700`}>
      <div className={`absolute inset-0 bg-gradient-to-b ${theme.bgFrom} ${theme.bgTo} dark:from-[#111] dark:to-[#222] transition-colors duration-500`}></div>
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `radial-gradient(${theme.dotColor} 1px, transparent 1px)`, backgroundSize: '30px 30px' }}></div>
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-30">
          <div className="flex flex-col items-start gap-1"><div className="flex items-center gap-2 bg-white/80 dark:bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 dark:border-white/10 shadow-sm animate-fade-in-up"><span className={`material-symbols-outlined filled text-lg animate-pulse-slow ${theme.textAccent}`}>local_fire_department</span><span className={`text-xs font-black uppercase tracking-wider ${theme.textAccent}`}>12 Day Streak</span></div></div>
          <button onClick={() => onNavigate(Screen.HOME)} className="size-10 rounded-full bg-white/60 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-colors shadow-sm"><span className="material-symbols-outlined text-gray-600 dark:text-gray-300">close</span></button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-sm mx-auto pb-32">
          {viewState === 'initial' && (<div className="flex flex-col items-center gap-8 animate-fade-in"><div className="relative group cursor-pointer" onClick={handleCollect}><div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-64 rounded-full blur-3xl animate-pulse-slow transition-colors opacity-40`} style={{ backgroundColor: theme.dotColor }}></div><div className="relative z-10 text-[150px] drop-shadow-2xl animate-float transition-transform duration-300 group-hover:scale-110 group-active:scale-95">🎁</div><div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 ${theme.button} text-white px-4 py-1 rounded-full font-black text-xs uppercase tracking-widest shadow-lg whitespace-nowrap`}>Mystery Drop</div></div><div className="text-center space-y-2"><h2 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">Reward Ready!</h2><p className="text-sm font-medium text-gray-500 dark:text-gray-400">Keep up the hustle to earn exclusive gear.</p></div></div>)}
          {viewState === 'revealing' && (<div className="flex flex-col items-center justify-center"><div className="text-[100px] animate-ping opacity-50">✨</div></div>)}
          {viewState === 'decision' && (<div className="flex flex-col items-center w-full animate-pop-in"><div className="relative w-full aspect-square max-w-[300px] mb-6"><div className="absolute inset-0 bg-white/40 dark:bg-white/5 rounded-[3rem] border-4 border-white dark:border-gray-700 shadow-2xl overflow-hidden"><div className={`absolute inset-0 bg-gradient-to-t from-${activeCharacter.themeColor}-400/20 to-transparent`}></div><div className="absolute inset-0 bg-cover bg-top transition-transform duration-500" style={{ backgroundImage: `url("${activeCharacter.image}")` }}></div>{isEquipped && (<div className={`absolute top-1/4 left-1/2 -translate-x-1/2 bg-black/80 p-2 rounded-full border-2 shadow-xl animate-bounce-in`} style={{ borderColor: theme.dotColor }}><span className="material-symbols-outlined text-4xl" style={{ color: theme.dotColor }}>eyeglasses</span></div>)}</div><div className={`absolute -top-4 -right-4 ${theme.button} text-white size-20 rounded-full flex flex-col items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg animate-float`}><span className="material-symbols-outlined text-2xl mb-[-2px]">star</span><span className="text-[8px] font-black uppercase tracking-wide">New!</span></div></div><div className="text-center mb-8"><h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-1">{rewardItem.name}</h2><p className={`text-xs font-bold uppercase tracking-widest ${theme.textAccent}`}>{rewardItem.type} Unlocked</p></div><div className="flex items-center bg-white dark:bg-black/30 p-1.5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm mb-6 w-full max-w-[280px]"><button onClick={() => setIsEquipped(true)} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wide transition-all ${isEquipped ? `${theme.button} text-white shadow-md` : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>Equip Now</button><button onClick={() => setIsEquipped(false)} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wide transition-all ${!isEquipped ? 'bg-gray-200 dark:bg-white/20 text-gray-600 dark:text-white shadow-inner' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>Unequip</button></div></div>)}
      </div>

      <div className="p-6 bg-white/50 dark:bg-black/20 backdrop-blur-lg border-t border-white/20 dark:border-white/5 z-20 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
          {viewState === 'initial' ? (<div className="flex gap-4"><button onClick={() => onNavigate(Screen.HOME)} className="flex-1 py-4 rounded-2xl bg-white dark:bg-white/10 text-gray-500 dark:text-gray-300 font-bold uppercase tracking-wider text-xs hover:bg-gray-50 dark:hover:bg-white/20 transition-colors">Later</button><button onClick={handleCollect} className={`flex-[2] py-4 rounded-2xl ${theme.button} text-white font-black uppercase tracking-widest text-sm shadow-xl flex items-center justify-center gap-2 group transition-all active:scale-[0.98]`}><span className="material-symbols-outlined filled group-hover:rotate-12 transition-transform">redeem</span>Collect Reward</button></div>) : viewState === 'decision' ? (<button onClick={handleConfirm} className="w-full py-4 rounded-2xl bg-green-500 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-green-500/30 hover:bg-green-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2"><span className="material-symbols-outlined">check_circle</span>{isEquipped ? 'Confirm & Wear' : 'Stash in Locker'}</button>) : (<div className="h-[56px]"></div>)}
      </div>

      <style>{` @keyframes bounce-in { 0% { transform: translate(-50%, -100%) scale(0); opacity: 0; } 60% { transform: translate(-50%, 10%) scale(1.1); opacity: 1; } 100% { transform: translate(-50%, 0) scale(1); opacity: 1; } } .animate-bounce-in { animation: bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; } `}</style>
    </div>
  );
};

export default ClaimReward;
