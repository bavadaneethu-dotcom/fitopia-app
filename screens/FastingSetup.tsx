import React, { useState } from 'react';
import { Screen, Character } from '../types';

interface FastingSetupProps {
  onNavigate: (screen: Screen) => void;
  activeCharacter?: Character;
}

const FastingSetup: React.FC<FastingSetupProps> = ({ onNavigate, activeCharacter }) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('custom'); // Default to custom to show the change
  const [selectedPlanId, setSelectedPlanId] = useState<string>('16:8');
  const [customFastHours, setCustomFastHours] = useState<number>(14);

  const presets = [
    { 
      id: '13:11', 
      title: '13:11 Circadian', 
      tag: 'Beginner', 
      tagColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', 
      desc: "Aligns with your body's natural clock.", 
      hours: 13 
    },
    { 
      id: '16:8', 
      title: '16:8 Method', 
      tag: 'Intermediate', 
      tagColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300', 
      desc: "Lean gains & fat loss. The gold standard.", 
      hours: 16,
      isPopular: true
    },
    { 
      id: '18:6', 
      title: '18:6 Window', 
      tag: 'Advanced', 
      tagColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300', 
      desc: "Deeper ketosis and autophagy boost.", 
      hours: 18 
    },
    { 
      id: '20:4', 
      title: '20:4 Warrior', 
      tag: 'Expert', 
      tagColor: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300', 
      desc: "Maximum detox. Not for everyday.", 
      hours: 20 
    },
  ];

  // Calculations for circle
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (customFastHours / 24) * circumference;

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden pb-24 bg-light-bg dark:bg-dark-bg animate-fade-in">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 flex items-center bg-light-bg/95 dark:bg-dark-bg/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-200/50 dark:border-white/5">
        <button 
          onClick={() => onNavigate(Screen.GOAL_SELECTION)}
          className="text-light-text dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10 text-light-text dark:text-white">Fasting Plan</h2>
      </div>

      {/* Content Scroll Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar w-full">
        
        {/* Character Quote */}
        <div className="p-4 w-full">
          <div className="relative flex flex-col items-stretch justify-start rounded-2xl shadow-sm bg-white dark:bg-dark-surface overflow-hidden border border-gray-100 dark:border-white/5">
            <div className="flex flex-row items-center p-4 gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-light-primary dark:border-dark-primary shadow-sm bg-gray-100 dark:bg-gray-700">
                <div className="h-full w-full bg-center bg-cover bg-top" style={{ backgroundImage: `url("${activeCharacter?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd6NqGRVIknZoTfMn2uv9BcIuIbBTjxgKnkAngUlsVxWoLOVTRSP63A1qz5p7ZBoNlXcVxEd964X81sNrwueXgsctT9GVOQT1zNt7ZXyhjpmwouzmAIVD3hnHlNKoboNZrdImKjGa24yw1jXprfgAWmxDCB2riA-S00bKSLXUjYoJs6c2EO4JKP-N6tXNraA74ATLGZsebP2JsJaUB5NL6cyFEDCBG7aL7UC13ifFG73FykDYZgj469zfKSTjaahfQZHMxUlv0nvuz'}")` }}></div>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <div className="relative bg-light-surface dark:bg-black/20 p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl text-sm font-bold text-light-text dark:text-dark-text italic border border-light-primary/10 dark:border-dark-primary/10">
                  <span className="absolute -left-2 top-0 block h-0 w-0 border-t-[10px] border-r-[10px] border-b-0 border-l-0 border-transparent border-r-light-surface dark:border-r-black/20"></span>
                  "{activeCharacter?.onboardingMessages.fasting || "Discipline! That is what this is about. Set your timer."}"
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="px-4 py-2">
          <div className="relative flex h-12 w-full items-center rounded-xl bg-gray-200 dark:bg-gray-800 p-1">
            {/* Sliding Background */}
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-white dark:bg-dark-surface shadow-sm transition-all duration-300 ease-in-out ${activeTab === 'presets' ? 'left-1' : 'left-[calc(50%+4px)]'}`}
            ></div>

            <button 
              onClick={() => setActiveTab('presets')}
              className={`flex-1 relative z-10 text-sm font-bold leading-normal tracking-wide transition-colors duration-300 ${activeTab === 'presets' ? 'text-light-text dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
            >
              Presets
            </button>
            <button 
              onClick={() => setActiveTab('custom')}
              className={`flex-1 relative z-10 text-sm font-bold leading-normal tracking-wide transition-colors duration-300 ${activeTab === 'custom' ? 'text-light-text dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
            >
              Custom
            </button>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-xl font-bold leading-tight tracking-tight text-light-text dark:text-white">
            {activeTab === 'presets' ? 'Choose Your Fast' : 'Design Your Fast'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {activeTab === 'presets' ? 'Select a schedule that fits your lifestyle.' : 'Adjust the fasting window to your preference.'}
          </p>
        </div>

        {/* Content Container */}
        <div className="flex flex-col gap-3 px-4 pb-8 min-h-[300px]">
          {activeTab === 'presets' ? (
            // PRESETS LIST
            presets.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              return (
                <div 
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`relative cursor-pointer rounded-xl p-4 transition-all duration-200 ${
                    isSelected 
                      ? 'bg-white dark:bg-dark-surface border-2 border-light-primary dark:border-dark-primary shadow-md z-10' 
                      : 'bg-white dark:bg-dark-surface border-2 border-transparent hover:border-gray-200 dark:hover:border-white/10 shadow-sm'
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-4 bg-light-primary dark:bg-dark-primary text-black dark:text-dark-bg text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm z-20">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-1 flex-[2] mt-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${plan.tagColor}`}>
                          {plan.tag}
                        </span>
                      </div>
                      <p className={`text-base font-bold leading-tight mt-1 ${isSelected && plan.isPopular ? 'text-light-primary dark:text-dark-primary' : 'text-light-text dark:text-white'}`}>
                        {plan.title}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs font-normal leading-normal">
                        {plan.desc}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fast</span>
                        <span className={`block text-lg font-black ${isSelected && plan.isPopular ? 'text-light-primary dark:text-dark-primary' : 'text-light-text dark:text-white'}`}>
                          {plan.hours}h
                        </span>
                      </div>
                      <div className={`size-6 rounded-full flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'text-light-primary dark:text-dark-primary scale-110' 
                          : 'text-gray-300 scale-100'
                      }`}>
                         <span className={`material-symbols-outlined text-2xl ${isSelected ? 'filled' : ''}`} style={{ fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}>
                           {isSelected ? 'check_circle' : 'circle'}
                         </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            // CUSTOM PAGE
            <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 animate-fade-in">
              <div className="flex flex-col items-center justify-center py-6">
                {/* Circular Slider Visualization */}
                <div className="relative size-64 flex items-center justify-center mb-8">
                  {/* Background Track */}
                  <svg className="size-full transform -rotate-90 overflow-visible" viewBox="0 0 200 200">
                    <defs>
                      <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#E5E7EB" />
                        <stop offset="100%" stopColor="#E5E7EB" />
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    <circle 
                      className="text-gray-100 dark:text-gray-800 stroke-current" 
                      cx="100" cy="100" 
                      fill="transparent" 
                      r={radius} 
                      strokeWidth="20" 
                      strokeLinecap="round" 
                    />
                    {/* Active Track */}
                    <circle 
                      className="text-light-primary dark:text-dark-primary stroke-current transition-all duration-700 ease-out" 
                      cx="100" cy="100" 
                      fill="transparent" 
                      r={radius} 
                      strokeWidth="20" 
                      strokeDasharray={circumference} 
                      strokeDashoffset={strokeDashoffset} 
                      strokeLinecap="round" 
                      style={{ filter: 'drop-shadow(0px 2px 4px rgba(250, 204, 21, 0.4))' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-black text-light-text dark:text-white tracking-tighter animate-fade-in-up">{customFastHours}</span>
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Hours</span>
                  </div>
                </div>

                {/* Slider Input */}
                <div className="w-full px-2 mb-8">
                  <input 
                    type="range" 
                    min="12" 
                    max="24" 
                    step="1"
                    value={customFastHours}
                    onChange={(e) => setCustomFastHours(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-light-primary dark:accent-dark-primary hover:accent-yellow-500 transition-all focus:outline-none focus:ring-4 focus:ring-light-primary/20"
                  />
                  <div className="flex justify-between mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span>12h</span>
                    <span>18h</span>
                    <span>24h</span>
                  </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-2 gap-3 w-full">
                  <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-gray-100 dark:border-white/5 flex flex-col items-start gap-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fasting Window</p>
                    <p className="text-light-text dark:text-white font-black text-lg">{customFastHours} Hours</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-gray-100 dark:border-white/5 flex flex-col items-start gap-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Eating Window</p>
                    <p className="text-light-text dark:text-white font-black text-lg">{24 - customFastHours} Hours</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Button */}
      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-light-bg via-light-bg to-transparent dark:from-dark-bg dark:via-dark-bg z-20">
        <button 
          onClick={() => onNavigate(Screen.PLAN_GENERATION)}
          className="w-full h-14 rounded-full bg-light-primary dark:bg-dark-primary hover:brightness-105 text-light-text dark:text-dark-bg text-lg font-black flex items-center justify-center gap-2 shadow-lg shadow-light-primary/40 dark:shadow-dark-primary/40 transition-all active:scale-[0.98]"
        >
          <span className="material-symbols-outlined filled" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
          Start Fasting
        </button>
      </div>
    </div>
  );
};

export default FastingSetup;