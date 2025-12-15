import React, { useState } from 'react';
import { Screen, Character } from '../types';

interface GoalSelectionProps {
  onNavigate: (screen: Screen) => void;
  activeCharacter?: Character;
}

const GoalSelection: React.FC<GoalSelectionProps> = ({ onNavigate, activeCharacter }) => {
  const [selectedGoal, setSelectedGoal] = useState<'lose' | 'maintain' | 'gain'>('lose');

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden pb-24 bg-light-bg dark:bg-dark-bg animate-fade-in">
      {/* Header & Progress */}
      <div className="flex flex-col gap-4 p-6 pt-8">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate(Screen.USER_DATA)}
            className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl text-light-text dark:text-white">arrow_back</span>
          </button>
          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium opacity-70 text-light-text dark:text-dark-text">Step 3 of 5</span>
          </div>
          <div className="w-8"></div>
        </div>
        {/* Progress Bar */}
        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div className="h-full bg-light-primary dark:bg-dark-primary w-[60%] rounded-full transition-all duration-500"></div>
        </div>
      </div>

      {/* Headline with Character Voice */}
      <div className="px-6 pb-2">
        <div className="flex items-center gap-3 mb-3">
           {activeCharacter && (
                <div className="size-12 rounded-full bg-cover bg-top border-2 border-light-primary dark:border-dark-primary shadow-sm shrink-0" style={{ backgroundImage: `url("${activeCharacter.image}")` }}></div>
           )}
           <div className="bg-light-surface dark:bg-dark-surface px-4 py-3 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl rounded-tl-sm border border-light-primary/10 dark:border-dark-primary/10 flex-1 shadow-sm">
             <p className="text-sm font-bold leading-tight text-light-text dark:text-white italic">
               "{activeCharacter?.onboardingMessages.goal || "So, what's the angle? Looking good or feeling good? I can help with both."}"
             </p>
           </div>
        </div>
        <h1 className="text-3xl font-black leading-tight tracking-tight mb-1 text-light-text dark:text-white">Choose Mission</h1>
      </div>

      {/* Goal Selection Cards */}
      <div className="flex flex-col gap-4 px-6 py-4 flex-grow overflow-y-auto no-scrollbar">
        
        {/* Option 1: Lose Weight */}
        <div 
          onClick={() => setSelectedGoal('lose')}
          className={`group relative cursor-pointer flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 ease-out ${
            selectedGoal === 'lose' 
              ? 'border-light-primary dark:border-dark-primary bg-light-surface dark:bg-dark-surface shadow-md scale-[1.02]' 
              : 'border-transparent bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 hover:scale-[1.01]'
          }`}
        >
          {/* Avatar Image */}
          <div className={`relative h-20 w-20 flex-shrink-0 rounded-full overflow-hidden border-2 transition-colors ${selectedGoal === 'lose' ? 'border-white dark:border-white/20' : 'border-transparent'}`}>
            <img alt="Speed" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCB5HXMDv4p631SvO1Uhq8pz5SfrkZjPoNKeujrPVVU8Lc_gecxn_ip0u-D1SrVguysMSA0zs3kqZAIZD0uSF55yDNoQUHx8KkyDagCpQlYAzclrKddk3gMhmIORTbfdZEjzSK5CNAGpWeaVKLio8igNijC08C1TWJGa8lHtcvF4KSB-vULOj8pUlyZWIpbnlSuLSNBzqQSNbPIJrERGbTdu3V1B5o3Nf_2VOXsiQTof2bFFE5-pyZigrtKa-TdC6xj4LB-m5mPGT0M"/>
          </div>
          {/* Text Content */}
          <div className="flex flex-col flex-grow min-w-0">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-lg text-light-text dark:text-white leading-tight">Lose Weight</h3>
              {/* Radio Circle */}
              <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                selectedGoal === 'lose'
                  ? 'border-light-primary dark:border-dark-primary bg-light-primary dark:bg-dark-primary'
                  : 'border-gray-300 dark:border-gray-500 bg-transparent'
              }`}>
                <span className={`material-symbols-outlined text-white dark:text-dark-bg text-[16px] font-bold transition-all duration-300 ${selectedGoal === 'lose' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>check</span>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Get lean and agile.</p>
            <div className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md w-fit">
              <span className="material-symbols-outlined text-[14px] filled" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              <span>High Intensity</span>
            </div>
          </div>
        </div>

        {/* Option 2: Maintain Weight */}
        <div 
          onClick={() => setSelectedGoal('maintain')}
          className={`group relative cursor-pointer flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 ease-out ${
            selectedGoal === 'maintain' 
              ? 'border-light-primary dark:border-dark-primary bg-light-surface dark:bg-dark-surface shadow-md scale-[1.02]' 
              : 'border-transparent bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 hover:scale-[1.01]'
          }`}
        >
          <div className={`relative h-20 w-20 flex-shrink-0 rounded-full overflow-hidden border-2 transition-colors ${selectedGoal === 'maintain' ? 'border-white dark:border-white/20' : 'border-transparent'}`}>
            <img alt="Balance" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAiks3sR-IkTxLAWTNDcNPQgijP3Ps_i8uIHfg85TbVLCb92KCR-clDz5DMI5qQRJllUzO87UxKM1emRgnp9ExzztWFzAc6RQVe1Qjplhdups088A2AB2bW9Ixy7ycIqY8Y9Ia6jtXxmckEv-qEptMOrgOJDKxSQfAIfX46LkxihWo2mmLzKIHJ00CifvYfbvxYnYbl-7amM5kN-reohfOq9gkHIHhXzq2HMQgKMOAst3dh0qsj0yKLKcXCZtOkjlw2NboBga1l6GI"/>
          </div>
          <div className="flex flex-col flex-grow min-w-0">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-lg text-light-text dark:text-white leading-tight">Maintain Weight</h3>
              <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                selectedGoal === 'maintain'
                  ? 'border-light-primary dark:border-dark-primary bg-light-primary dark:bg-dark-primary'
                  : 'border-gray-300 dark:border-gray-500 bg-transparent'
              }`}>
                <span className={`material-symbols-outlined text-white dark:text-dark-bg text-[16px] font-bold transition-all duration-300 ${selectedGoal === 'maintain' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>check</span>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Stay fit and healthy.</p>
            <div className="flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-md w-fit">
              <span className="material-symbols-outlined text-[14px] filled" style={{ fontVariationSettings: "'FILL' 1" }}>balance</span>
              <span>Balanced Routine</span>
            </div>
          </div>
        </div>

        {/* Option 3: Gain Muscle */}
        <div 
          onClick={() => setSelectedGoal('gain')}
          className={`group relative cursor-pointer flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 ease-out ${
            selectedGoal === 'gain' 
              ? 'border-light-primary dark:border-dark-primary bg-light-surface dark:bg-dark-surface shadow-md scale-[1.02]' 
              : 'border-transparent bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 hover:scale-[1.01]'
          }`}
        >
          <div className={`relative h-20 w-20 flex-shrink-0 rounded-full overflow-hidden border-2 transition-colors ${selectedGoal === 'gain' ? 'border-white dark:border-white/20' : 'border-transparent'}`}>
            <img alt="Power" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtAxAVvgZdGafsxP0q1GSwEnsz77RblSvTNenr6FUzD3cCF_1rxKK4TOgiwR7xsYxdJH86lAAh834mjdEpedYkYVqwFE-B4WGYzUASFo385wuV48vBG4TNBr58Xwz649q3oFlQbyS4IZhGiJaGh-UcwohcWPTNexnXuicwydUwHSCghOvPsp_ei5xUMJNGeXZCnHfucXEMrztMKqCHoY1Elitrp6idCdcrBAaJSqlGPqT98-qUw8hBe_P4bfDVi00PKxySdux6VJM2"/>
          </div>
          <div className="flex flex-col flex-grow min-w-0">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-lg text-light-text dark:text-white leading-tight">Gain Muscle</h3>
              <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                selectedGoal === 'gain'
                  ? 'border-light-primary dark:border-dark-primary bg-light-primary dark:bg-dark-primary'
                  : 'border-gray-300 dark:border-gray-500 bg-transparent'
              }`}>
                <span className={`material-symbols-outlined text-white dark:text-dark-bg text-[16px] font-bold transition-all duration-300 ${selectedGoal === 'gain' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>check</span>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Build strength &amp; power.</p>
            <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-md w-fit">
              <span className="material-symbols-outlined text-[14px] filled" style={{ fontVariationSettings: "'FILL' 1" }}>fitness_center</span>
              <span>Strength Focus</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer Action */}
      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-light-bg via-light-bg to-transparent dark:from-dark-bg dark:via-dark-bg z-20">
        <button 
          onClick={() => onNavigate(Screen.FASTING_SETUP)}
          className="w-full flex items-center justify-center gap-2 rounded-full h-16 bg-light-primary dark:bg-dark-primary hover:brightness-105 active:scale-95 transition-all text-light-text dark:text-dark-bg text-lg font-black shadow-lg shadow-light-primary/30 dark:shadow-dark-primary/30"
        >
          <span>Start Training</span>
          <span className="material-symbols-outlined font-bold">arrow_forward</span>
        </button>
        <p className="text-center text-xs font-medium opacity-50 mt-4 pb-2 text-light-text dark:text-dark-text">You can change this later in settings.</p>
      </div>
    </div>
  );
};

export default GoalSelection;