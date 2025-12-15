
import React from 'react';
import { Screen } from '../types';

interface AchievementsProps {
  onNavigate?: (screen: Screen) => void;
  inventory?: string[];
}

const Achievements: React.FC<AchievementsProps> = ({ onNavigate, inventory = [] }) => {
  
  const rewards = [
      { id: 'shades', icon: 'eyeglasses', title: 'Aviator Shades', subtitle: 'Accessory', unlocked: inventory.includes('shades') },
      { id: 'cap', icon: 'checkroom', title: 'ZPD Academy Cap', subtitle: 'Headgear', unlocked: inventory.includes('cap') },
      { id: 'watch', icon: 'watch', title: 'Smart Watch', subtitle: 'Gadget', unlocked: inventory.includes('watch') },
      { id: 'headband', icon: 'sports', title: 'Running Band', subtitle: 'Gear', unlocked: inventory.includes('headband') },
  ];

  return (
    <div className="flex flex-col gap-6 px-6 pt-2 pb-10 animate-fade-in">
      
      {/* Streak Header - "Commendation" */}
      <div className="relative flex flex-col items-center justify-center py-8">
        <div className="absolute inset-0 bg-light-primary/20 dark:bg-dark-primary/20 blur-3xl rounded-full scale-75 animate-pulse-slow"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="size-20 bg-light-primary dark:bg-dark-primary rounded-full flex items-center justify-center shadow-lg shadow-light-primary/30 dark:shadow-dark-primary/30 border-4 border-white dark:border-dark-bg mb-3 animate-bounce">
              <span className="material-symbols-outlined text-white dark:text-dark-bg text-4xl filled" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
          </div>
          <h1 className="text-4xl font-black text-light-text dark:text-dark-text tracking-tight">7-Day Streak</h1>
          <p className="text-light-muted dark:text-dark-muted text-xs font-bold uppercase tracking-widest mt-1">Consistency Award</p>
        </div>
      </div>

      {/* Hero Achievement Card */}
      <div className="w-full relative overflow-hidden rounded-[2rem] bg-light-surface dark:bg-dark-surface shadow-lg border border-light-primary/10 dark:border-dark-primary/10 group">
        <div className="h-44 w-full bg-cover bg-center relative" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCOwNnaGQOysP5AWIJcddX47oS7coiOCoyOMd11nXrMby7rcq-ML2hQKOmZFJuvN3qRZFxqFXlnKcx0wqiyqMO01g-iqkcOyk78b12yBl8NBwZJlE-Rd9-_dX0l5zII8Mkyz2YQLYcLjmTsMqY8rO3tgxvejYD4gvBUHrmAr2jBQUezJm3miT_v-n4MfSMVY1csobFjHEdRiSpiNwZW-e7cxB_dkkfYmYEKZcjTwP3wVikH2QlTcyTTqoq8hI1ffSk0Y1e6snDl5qHi")', backgroundPosition: 'center 30%' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-light-surface dark:from-dark-surface via-transparent to-transparent"></div>
          
          {/* Badge */}
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20 shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-light-primary dark:text-dark-primary text-sm filled" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
            <span className="text-[10px] font-bold uppercase tracking-wide text-light-text dark:text-white">Lvl 5 Unlocked</span>
          </div>
        </div>
        
        <div className="p-6 -mt-10 relative z-10">
          <div className="flex items-center gap-2 mb-2">
               <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">New Milestone</h3>
          </div>
          <h3 className="text-2xl font-black text-light-text dark:text-dark-text leading-none mb-2">You're on fire!</h3>
          <p className="text-sm text-light-muted dark:text-dark-muted font-medium italic leading-relaxed opacity-80">
            "Try everything! I knew you could do it. Let's hit that 10-day mark together!"
          </p>
          <button 
            onClick={() => onNavigate && onNavigate(Screen.CLAIM_REWARD)}
            className="w-full mt-6 bg-light-primary dark:bg-dark-primary hover:brightness-110 text-white dark:text-dark-bg font-bold py-4 rounded-xl shadow-lg shadow-light-primary/20 dark:shadow-dark-primary/20 flex items-center justify-center gap-2 transition-all active:scale-95 uppercase text-xs tracking-wider"
          >
            <span className="material-symbols-outlined text-lg">redeem</span>
            Claim Reward
          </button>
        </div>
      </div>

      {/* Roadmap */}
      <div className="bg-[#fdfbf7] dark:bg-[#1a202c] p-6 rounded-[2rem] border-2 border-dashed border-gray-300 dark:border-gray-600 font-mono relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
              <h3 className="text-lg font-black text-gray-800 dark:text-white uppercase tracking-tight">Reward Track</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Season 1</p>
          </div>
          <span className="text-3xl font-black text-light-primary dark:text-dark-primary tracking-tighter opacity-50">#01</span>
        </div>
        
        <div className="relative h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-6 border border-black/5 dark:border-white/5">
            <div className="absolute top-0 left-0 h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-20"></div>
            <div className="absolute top-0 left-0 h-full bg-light-primary dark:bg-dark-primary transition-all duration-1000 ease-out rounded-full flex items-center justify-end pr-1" style={{ width: '70%' }}>
                <div className="h-full w-1 bg-white/50"></div>
            </div>
        </div>

        <div className="flex justify-between items-center text-xs">
          <div className="flex flex-col items-center gap-2 opacity-50">
            <div className="size-8 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-sm">check</span>
            </div>
            <span className="font-bold text-[10px] text-gray-400 uppercase tracking-wide">Start</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="size-10 rounded-full border-2 border-light-primary dark:border-dark-primary bg-light-primary/20 dark:bg-dark-primary/20 text-light-primary dark:text-dark-primary flex items-center justify-center shadow-sm relative">
              <span className="material-symbols-outlined text-lg filled animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>lock_open</span>
              <div className="absolute -bottom-1 w-16 text-center bg-light-primary dark:bg-dark-primary text-black dark:text-dark-bg text-[8px] font-black px-1 rounded uppercase tracking-wider">Current</div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 opacity-40 grayscale">
            <div className="size-8 rounded-full bg-light-bg dark:bg-dark-bg border border-gray-300 dark:border-gray-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-sm text-gray-400">emoji_events</span>
            </div>
            <span className="font-bold text-[10px] text-gray-400 uppercase tracking-wide">Finish</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div>
         <div className="flex items-center gap-2 mb-3 px-2">
            <span className="size-2 bg-light-primary dark:bg-dark-primary rounded-full"></span>
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Badge Collection</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
            {rewards.map(item => (
                <AchievementBadge 
                    key={item.id} 
                    icon={item.icon} 
                    title={item.title} 
                    subtitle={item.subtitle} 
                    unlocked={item.unlocked} 
                    onClick={() => {
                        if (item.unlocked && onNavigate) {
                            onNavigate(Screen.WARDROBE);
                        }
                    }}
                />
            ))}
        </div>
      </div>

    </div>
  );
};

const AchievementBadge: React.FC<{ icon: string; title: string; subtitle: string; unlocked: boolean; onClick?: () => void }> = ({ icon, title, subtitle, unlocked, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-3 rounded-[1.5rem] p-5 text-center border transition-all duration-300 relative ${unlocked ? 'bg-white dark:bg-white/5 border-light-primary/30 dark:border-dark-primary/30 shadow-sm cursor-pointer hover:scale-105 active:scale-95' : 'bg-gray-100 dark:bg-gray-800/50 border-transparent opacity-60 grayscale'}`}
  >
    <div className={`size-14 rounded-full flex items-center justify-center mb-1 shadow-inner relative overflow-hidden ${unlocked ? 'bg-light-primary/10 dark:bg-dark-primary/10 text-light-primary dark:text-dark-primary' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
      <span className={`material-symbols-outlined text-2xl ${unlocked ? 'filled' : ''}`} style={{ fontVariationSettings: unlocked ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span>
      {unlocked && <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none"></div>}
    </div>
    <div>
      <p className="text-light-text dark:text-dark-text text-xs font-black uppercase tracking-wide leading-tight">{title}</p>
      <p className="text-light-muted dark:text-dark-muted text-[10px] mt-1 font-medium">{subtitle}</p>
    </div>
    {!unlocked && (
      <span className="material-symbols-outlined text-xs text-gray-400 absolute top-3 right-3">lock</span>
    )}
    {unlocked && (
      <span className="material-symbols-outlined text-xs text-light-primary dark:text-dark-primary absolute top-3 right-3">check_circle</span>
    )}
  </div>
);

export default Achievements;
